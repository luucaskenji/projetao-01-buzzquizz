var numberOfQuestions=1, numberOfLevels=1;

function addQuestion() {
    numberOfQuestions++;
    
    var newQuestion = document.createElement("div");
    newQuestion.classList.add("question-answers");
    newQuestion.innerHTML = "<span>Pergunta " + numberOfQuestions + "</span><input type='text' class='question' placeholder='Digite a pergunta'><div class='answers-images'><input type='text' placeholder='Digite a resposta correta' class='correct right-answer'><input type='text' placeholder='Link pra imagem correta' class='correct right-image-src'><input type='text' placeholder='Digite uma resposta errada 1' class='wrong wrong-answer'><input type='text' placeholder='Link pra imagem errada 1' class='wrong wrong-image-src'><input type='text' placeholder='Digite uma resposta errada 2' class='wrong wrong-answer'><input type='text' placeholder='Link pra imagem errada 2' class='wrong wrong-image-src'><input type='text' placeholder='Digite uma resposta errada 3' class='wrong wrong-answer'><input type='text' placeholder='Link pra imagem errada 3' class='wrong wrong-image-src'></div>";

    document.querySelector(".questions-container").appendChild(newQuestion);
}

function addLevel() {
    numberOfLevels++;

    var newLevel = document.createElement("div");
    newLevel.classList.add("result-level");
    newLevel.innerHTML = "<span>Nível " + numberOfLevels + "</span><div class='level-results-inputs'><input type='text' placeholder='% Mínima de acerto do nível' class='min-percentage'><input type='text' placeholder='% Máxima de acerto do nível' class='max-percentage'><input type='text' placeholder='Título do Nível' class='level-title'><input type='text' placeholder='Link da imagem do nível' class='img-link'><input type='text' placeholder='Descrição do nível' class='level-description'></div>";

    document.querySelector(".levels-container").appendChild(newLevel);
}

function createQuizz() {
    var createdQuizzObject = {
        title: "",
        data: {
            questions: [],
            levels: []
        }
    };

    objectQuestions = createdQuizzObject.data.questions;

    var titleInput = document.querySelector(".quizz-title-input").value;
    titleInput = adaptateString(titleInput);

    createdQuizzObject.title = titleInput;

    for (var i=1; i<=numberOfQuestions; i++) {
        var elementOrder = document.querySelector(".question-answers:nth-child(" + i + ")");

        var correctAnswer = elementOrder.querySelector(".right-answer").value;
        correctAnswer = adaptateString(correctAnswer);
        var correctImage = elementOrder.querySelector(".right-image-src").value;
        var arrayWrongAnswers = elementOrder.querySelectorAll(".wrong-answer");
        var arrayWrongImagesSources = elementOrder.querySelectorAll(".wrong-image-src");

        var questionInput = elementOrder.querySelector(".question").value;
        questionInput = adaptateString(questionInput);
        var isValid = verifyQuestionPattern(questionInput);
        if(!isValid) {
            alert("Verifique se a pergunta foi digitada corretamente");
            return;
        }

        var possibleAnswers = [];
        var imagesSources = [];

        var newQuestionPosition = { question: "", answers: [], images: [] };
        objectQuestions.push(newQuestionPosition); // cria um espaço pra nova pergunta no array questions do objeto

        possibleAnswers.push(correctAnswer); // a primeira resposta no array inicialmente será a correta
        for (var j=0; j<=2; j++) {
            arrayWrongAnswers[j].value = adaptateString(arrayWrongAnswers[j].value);
            possibleAnswers.push(arrayWrongAnswers[j].value); // as demais incluídas serão as erradas
        }

        imagesSources.push(correctImage); // a primeira url incluída sera a da imagem correta
        for (var j=0; j<=2; j++) imagesSources.push(arrayWrongImagesSources[j].value); // inclusão das demais imagens (erradas)      

        objectQuestions[i-1].question = questionInput; // a posição é i-1 para começar a alocar no índice 0 do array questions
        objectQuestions[i-1].answers = possibleAnswers;
        objectQuestions[i-1].images = imagesSources;
    }

    var objectLevels = createdQuizzObject.data.levels;

    for (var i=1; i<=numberOfLevels; i++) {
        elementOrder = document.querySelector(".result-level:nth-child(" + i + ")");

        var minimum = elementOrder.querySelector(".min-percentage").value;
        var maximum = elementOrder.querySelector(".max-percentage").value;
        var levelTitle = elementOrder.querySelector(".level-title").value;
        var imgLink = elementOrder.querySelector(".img-link").value;
        var levelDescription = elementOrder.querySelector(".level-description").value;

        var newLevelPosition = { lowerPercentage: minimum, upperPercentage: maximum, title: levelTitle, imageLink: imgLink, description: levelDescription }

        objectLevels.push(newLevelPosition);
    }

    displayNextContent(".quizz-creation", ".quizzes-list");
    postQuizzesOnServer(createdQuizzObject);
}

function adaptateString(inputString) {
    inputString = inputString.trim();
    inputString = inputString.replace(inputString[0], inputString.charAt(0).toUpperCase());

    return inputString;
}

function verifyQuestionPattern(inputString) {
    if (inputString.indexOf("?") === inputString.length-1) return true;
    else return false;
}

function postQuizzesOnServer(quizzObject) {
    var request = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes', quizzObject, objHeader);
    request.then(getQuizzesFromServer);
}