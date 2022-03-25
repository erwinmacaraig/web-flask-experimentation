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
