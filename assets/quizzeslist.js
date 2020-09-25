var quizzesServerResponse;

function displayNextContent(hide, show) {
    document.querySelector(hide).style.display = "none";
    document.querySelector(show).style.display = "flex";
}

function displayQuizzesList(serverResponse) {
    var quizzesQuantity = serverResponse.data.length;
    var quizzesList = document.querySelector(".created-quizzes");
    quizzesList.innerHTML = `<button onclick='displayNextContent(".quizzes-list", ".quizz-creation")'><div class='add-quiz'>Novo<br>Quizz<img src='assets/images/add-circle-white.svg'></div></button>`

    for (var i=0; i<quizzesQuantity; i++) {
        var createdQuizzElement = document.createElement("button");
        createdQuizzElement.classList.add("quizz-card");
        createdQuizzElement.setAttribute("onclick", "openQuizz(this)");
        createdQuizzElement.innerText = serverResponse.data[i].title;

        document.querySelector(".created-quizzes").appendChild(createdQuizzElement);
    }

    displayNextContent(".login", ".quizzes-list");

    quizzesServerResponse = serverResponse; // guarda na variável global
}