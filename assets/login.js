var button = document.querySelector(".authentication");
var userToken;
var objHeader;

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

function getUserToken(serverResponse) {
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