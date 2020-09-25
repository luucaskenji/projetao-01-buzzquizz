var clickedQuizzTitle;
var elementData;
var questionIndex=0;
var questionsQuantity, questionsRemaining;
var correctAnswer;
var correctlyAnsweredCounter=0; 

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

    if (questionIndex === 0) displayNextContent(".quizzes-list", ".quizz-interface"); // verifica se é a primeira execução da função

    var elementTitle = clickedQuizzTitle;
    serverData = quizzesServerResponse.data;

    for (var i=0; i<serverData.length; i++) {
        if (elementTitle === serverData[i].title) {
            positionInData = i;
        }
    }

    elementData = serverData[positionInData].data;

    questionsQuantity = elementData.questions.length;
    if (questionIndex === 0) questionsRemaining = elementData.questions.length; // verifica se é a primeira execução da função

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

    renderQuestion(elementTitle, elementQuestion, answerImageObject)
    
    questionIndex++;
}

function renderQuestion(questionTitle, questionText, shuffledArray) {
    var quizzTitle = document.querySelector(".quizz-title");
    var quizzQuestion = document.querySelector(".quizz-question");

    quizzTitle.innerText = questionTitle;
    quizzQuestion.innerText = (questionIndex+1) + ". " + questionText;

    for (var i=1; i<=4; i++) {
        var answerBox = document.querySelector(".answer:nth-child(" + i + ")");
        answerBox.querySelector(".answer-text").innerText = shuffledArray[i-1].answer;
        answerBox.style.backgroundImage = "url(" + shuffledArray[i-1].image + ")";
    }
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
    if (questionsRemaining === 0) setTimeout(getResults, 2000);
    else {
        setTimeout(loadQuestion, 2000);
        setTimeout(resetBackgrounds, 2000);
    }
}