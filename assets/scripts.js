var button = document.querySelector(".authentication");
var userToken;
var numberOfQuestions=1, numberOfLevels=1;
var quizzesServerResponse;
var objHeader;
var chosenQuizzTitle;
var questionIndex=0;
var questionsRemaining;
var correctAnswer;
var auxiliary;
var correctlyAnsweredCounter=0; 

function verifyInputContent() {
    button.style.pointerEvents="none";

    var inputEMail = document.querySelector(".email-input").value;
    var inputPassword = document.querySelector(".password-input").value;
    

    if (inputEMail === "" || inputPassword === "") {
        alert("Preenchimento obrigatório");
        button.style.pointerEvents="initial";
    }
    else {
        postServerRequest(inputEMail, inputPassword);
    }
}

function postServerRequest(email, password) {
    objPost = { email: email, password: password }
    var request = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/users', objPost);
    request.then(getUserToken).catch(startAllOver);
}

function displayNextContent(hide, show) {
    document.querySelector(hide).style.display = "none";
    document.querySelector(show).style.display = "flex";
}

function getUserToken(serverResponse) {
    displayNextContent(".login", ".quizzes-list");

    userToken = serverResponse.data.token;
    getQuizzesFromServer();
}

function getQuizzesFromServer() {    
    objHeader = {headers: {'User-Token': userToken}}
    var getQuizzes = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes', objHeader);
    getQuizzes.then(displayQuizzesList);
}

function startAllOver(serverResponse) {
    alert("Email e/ou senha incorretos");
    button.style.pointerEvents = "initial";
}

function displayQuizzCreation() {
    document.querySelector(".quizzes-list").style.display = "none";
    document.querySelector(".quizz-creation").style.display = "flex";
}

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
        objectQuestions.push(newQuestionPosition);

        possibleAnswers.push(correctAnswer);
        for (var j=0; j<=2; j++) {
            arrayWrongAnswers[j].value = adaptateString(arrayWrongAnswers[j].value);
            possibleAnswers.push(arrayWrongAnswers[j].value);
        }

        imagesSources.push(correctImage);
        for (var j=0; j<=2; j++) imagesSources.push(arrayWrongImagesSources[j].value);        

        objectQuestions[i-1].question = questionInput;
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

function displayQuizzesList(serverResponse) {
    quizzesQuantity = serverResponse.data.length;
    var quizzesList = document.querySelector(".created-quizzes");
    quizzesList.innerHTML = `<button onclick='displayNextContent(".quizzes-list", ".quizz-creation")'><div class='add-quiz'>Novo<br>Quizz<img src='assets/images/add-circle-white.svg'></div></button>`

    for (var i=0; i<quizzesQuantity; i++) {
        var createdQuizzElement = document.createElement("button");
        createdQuizzElement.classList.add("quizz-card");
        createdQuizzElement.setAttribute("onclick", "openQuizz(this)");
        createdQuizzElement.innerText = serverResponse.data[i].title;

        document.querySelector(".created-quizzes").appendChild(createdQuizzElement);
    }

    quizzesServerResponse = serverResponse; // guarda na variável global
}

function openQuizz(clickedQuizz) {
    clickedQuizzTitle = clickedQuizz.innerText;
    loadQuestion();
}

function loadQuestion() {

    function shuffleAnswersArray(array) {
        function randomize() { return Math.random() - 0.5 }
        array.sort(randomize);
    
        return array;
    }

    if (questionIndex === 0) displayNextContent(".quizzes-list", ".quizz-interface");

    var elementTitle = clickedQuizzTitle;
    serverData = quizzesServerResponse.data;

    for (var i=0; i<serverData.length; i++) {
        if (elementTitle === serverData[i].title) {
            positionInData = i;
        }
    }

    var elementData = serverData[positionInData].data;

    if (questionIndex === 0) questionsRemaining = elementData.questions.length;

    var elementQuestion = elementData.questions[questionIndex].question;
    var elementAnswers = elementData.questions[questionIndex].answers;
    correctAnswer = elementAnswers[0];
    var elementImages = elementData.questions[questionIndex].images;
    
    var answerImageObject = [];
    var answerObject = {};
    for (var i=0; i<4; i++) {
        answerObject.answer = elementAnswers[i];
        answerObject.image = elementImages[i];
        
        answerImageObject.push(answerObject);
        answerObject = {};
    }

    answerImageObject = shuffleAnswersArray(answerImageObject);

    var quizzTitle = document.querySelector(".quizz-title");
    var quizzQuestion = document.querySelector(".quizz-question");
    
    quizzTitle.innerText = elementTitle;
    quizzQuestion.innerText = (questionIndex+1) + ". " + elementQuestion;

    for (var i=1; i<=4; i++) {
        var answerBox = document.querySelector(".answer:nth-child(" + i + ")");
        answerBox.querySelector(".answer-text").innerText = answerImageObject[i-1].answer;
        answerBox.style.backgroundImage = "url(" + answerImageObject[i-1].image + ")";
    }

    questionIndex++;
}

function verifyAnswer(clickedAnswer) {

    function toggleClicks() {
        for (var i=1; i<=4; i++) {
            var answerBox = document.querySelector(".answer:nth-child(" + i + ")");
            answerBox.removeAttribute("onclick");

            setTimeout(answerBox.setAttribute("onclick", "verifyAnswer(this)"), 2000);
        }        
    }

    function resetBackgrounds() {
        for (var i=1; i<=4; i++) {
            var answerBox = document.querySelector(".answer:nth-child(" + i + ")");
            var answerTextBox = answerBox.querySelector(".answer-text");
    
            answerTextBox.style.backgroundColor = "white";
        }
    }

    var clickedAnswerText = clickedAnswer.querySelector(".answer-text").innerText;

    for (var i=1; i<=4; i++) {
        var answerBox = document.querySelector(".answer:nth-child(" + i + ")");
        var answerTextBox = answerBox.querySelector(".answer-text");
        var answerText = answerTextBox.innerText;

        if (answerText === correctAnswer) answerTextBox.style.backgroundColor = "#D8F6D9";
        else answerTextBox.style.backgroundColor = "#FDD8D9";
    }

    if (clickedAnswerText === correctAnswer) correctlyAnsweredCounter++;

    toggleClicks();

    questionsRemaining--;
    if (questionsRemaining === 0) setTimeout(displayResults, 2000);
    else {
        setTimeout(loadQuestion, 2000);
        setTimeout(resetBackgrounds, 2000);
    }
}

function displayResults() {
    displayNextContent(".quizz-interface", ".quizz-end");
}