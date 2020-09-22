var button = document.querySelector(".submit a");
var userToken;

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
    request.then(displayQuizzesList).catch(startAllOver);
}

function displayQuizzesList(serverResponse) {
    document.querySelector(".login").style.display = "none";
    document.querySelector(".quizzes-list").style.display = "flex";

    userToken = serverResponse.data.token;
    
    objHeader = {headers: {'User-Token': userToken}}
    var getQuizzes = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes', objHeader);
}

function startAllOver(serverResponse) {
    alert("Email e/ou senha incorretos");
    button.style.pointerEvents = "initial";
}