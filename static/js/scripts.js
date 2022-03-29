function setupIcons(){
    const emailInputEl = document.getElementById('email');
    const emailIco = document.createElement("i");
    emailIco.setAttribute("class", "fa fa-envelope icon");
    document.getElementsByClassName("entry-item")[0].insertBefore(emailIco,emailInputEl);

    const passwordInputEl = document.querySelector('#password');
    const passwordIco = document.createElement("i");
    passwordIco.setAttribute("class", "fa fa-lock icon");
    document.getElementsByClassName("entry-item")[1].insertBefore(passwordIco,passwordInputEl);
}

function getMeADog(){
    let xmlHttpRequest = new XMLHttpRequest();
    const dogUrl = 'https://dog.ceo/api/breeds/image/random';
    xmlHttpRequest.open("GET", dogUrl);
    xmlHttpRequest.getResponseHeader("Content-type", "application/json");
    xmlHttpRequest.onreadystatechange = function(){
        if (xmlHttpRequest.readyState == 4) {
            const obj = JSON.parse(xmlHttpRequest.responseText);
            document.getElementById('img-dog').src = obj['message'];
        }
    }
    xmlHttpRequest.send();
}

