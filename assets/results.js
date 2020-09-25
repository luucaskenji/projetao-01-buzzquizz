function getResults() {
    displayNextContent(".quizz-interface", ".quizz-end");

    var score = correctlyAnsweredCounter/questionsQuantity;
    score *= 100;
    score = Math.round(score);

    var elementLevels = elementData.levels;

    for (var i = 0; i < elementLevels.length; i++) {
        var levelTitle = elementLevels[i].title;
        var levelDescription = elementLevels[i].description;
        var levelImageLink = elementLevels[i].imageLink;

        var minimumPercentage = elementLevels[i].lowerPercentage;
        var maximumPercentage = elementLevels[i].upperPercentage;

        console.log(minimumPercentage, maximumPercentage);

        if (score >= minimumPercentage && score <= maximumPercentage) {
            renderResults(score, levelTitle, levelDescription, levelImageLink);
        }
    }
}

function renderResults(finalScore, title, description,  imageLink) {
    document.querySelector(".quizz-end h1").innerText = clickedQuizzTitle;
    document.querySelector(".main-text").innerHTML = "Você acertou " + correctlyAnsweredCounter + " de " + questionsQuantity + " perguntas!<br>Score: " + finalScore + "%";
    document.querySelector(".message-title").innerText = title;
    document.querySelector(".message-text").innerText = description;
    document.querySelector(".result-message img").src = imageLink;
}