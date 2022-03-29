const delUserFrm = document.querySelector("#delete-frm");
const newUserFrm = document.querySelector("#create-user-frm");
const retUserFrm = document.querySelector("#retrieve-frm");
const modifyFrm = document.getElementById("modify-user");


let adb2cUsers = [];
function loadUser(){
    document.getElementById('edit-frm-container').style.display = "block";
    const selectedUID = document.getElementById("user-select-dropdown").value;
    const theUser = adb2cUsers.filter((item) => item["id"] == selectedUID);
    console.log(theUser[0]);
    modifyFrm.elements['displayName'].value = theUser[0]['displayName'];
    modifyFrm.elements['givenNameEdit'].value = theUser[0]['givenName'];
     modifyFrm.elements['jobTitle'].value = theUser[0]['jobTitle'];
     modifyFrm.elements['mailEdit'].value = theUser[0]['mail'];
     modifyFrm.elements['mobilePhone'].value = theUser[0]['mobilePhone'];
     modifyFrm.elements['officeLocation'].value = theUser[0]['officeLocation'];
     modifyFrm.elements['surnameEdit'].value = theUser[0]['surname'];
}

modifyFrm.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = {}
    if (modifyFrm.elements['accountEnabled'].value) {
        user['accountEnabled'] = modifyFrm.elements['accountEnabled'].value;
    }
    if (modifyFrm.elements['displayName'].value.trim()) {
        user['displayName'] = modifyFrm.elements['displayName'].value.trim();
    }
    if (modifyFrm.elements['givenNameEdit'].value.trim()) {
        user['givenName'] = modifyFrm.elements['givenNameEdit'].value.trim()
    }
    if (modifyFrm.elements['surnameEdit'].value.trim()) {
        user['surname'] = modifyFrm.elements['surnameEdit'].value.trim()
    }
    if (modifyFrm.elements['employeeIDEdit'].value.trim()) {
        user['employeeId'] = modifyFrm.elements['employeeIDEdit'].value.trim()
    }
    if (modifyFrm.elements['mobilePhone'].value.trim()) {
        user['mobilePhone'] = modifyFrm.elements['mobilePhone'].value.trim()
    }
    if (modifyFrm.elements['officeLocation'].value.trim()) {
        user['officeLocation'] = modifyFrm.elements['officeLocation'].value.trim()
    }
    if (modifyFrm.elements['jobTitle'].value.trim()) {
        user['jobTitle'] = modifyFrm.elements['jobTitle'].value.trim()
    }
    if (modifyFrm.elements['department'].value.trim()) {
        user['department'] = modifyFrm.elements['department'].value.trim()
    }
    if (modifyFrm.elements['city'].value.trim()) {
        user['city'] = modifyFrm.elements['city'].value.trim()
    }
    if (modifyFrm.elements['country'].value.trim()) {
        user['country'] = modifyFrm.elements['country'].value.trim()
    }
    if (modifyFrm.elements['mailEdit'].value.trim()) {
        user['mail'] = modifyFrm.elements['mailEdit'].value.trim()
    }

    console.log(user);
    editADB2CUser(user);

});

newUserFrm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newUserObj = {
        'givenName': newUserFrm.elements['givenName'].value,
        'surname': newUserFrm.elements['surname'].value,
        'employeeId': newUserFrm.elements['employeeId'].value,
        'mail': newUserFrm.elements['mail'].value
    };
    createADB2CUser(newUserObj);
    newUserFrm.reset();
    let containerDiv = document.getElementById('adb2c-users');
    containerDiv.innerHTML = '';
});

delUserFrm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(delUserFrm.elements['azure-uid'].value);
    const uid = delUserFrm.elements['azure-uid'].value;
    if (uid.trim().length == 0) {
        alert("No input");
        return;
    }
    deleteADB2CUser(uid);
    delUserFrm.reset();
    let containerDiv = document.getElementById('adb2c-users');
    containerDiv.innerHTML = '';

});

retUserFrm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const uid = retUserFrm.elements['retrieve-azure-uid'].value;
    if (uid.trim().length == 0) {
        alert("No input");
        return;
    }

    retUserFrm.reset();
    let containerDiv = document.getElementById('adb2c-users');
    containerDiv.innerHTML = '';
    const user = await retrieveUserProfile(uid);
    console.log(user);
    let table = document.createElement("table");
    const tblHead = document.createElement("thead");
    let tblRow = document.createElement("tr");
    let tblTh = document.createElement("th");

    let thHeadLabel = document.createTextNode("Property");
    tblTh.appendChild(thHeadLabel);
    tblRow.appendChild(tblTh);


    tblTh = document.createElement("th");
    thHeadLabel = document.createTextNode("Value");
    tblTh.appendChild(thHeadLabel);
    tblRow.appendChild(tblTh);
    table.appendChild(tblRow);
    for (let key in user) {
        tblRow = document.createElement("tr");
        let tblTd = document.createElement("td")
        let tdText = document.createTextNode(key);
        tblTd.appendChild(tdText);
        tblRow.appendChild(tblTd);

        tblTd = document.createElement("td");
        tdText = document.createTextNode(user[key]);
        tblTd.appendChild(tdText);
        tblRow.appendChild(tblTd);

        table.appendChild(tblRow);
    }
    let displayHeadingEl = document.createElement("h2");
    let displayHeadingElText = document.createTextNode(user['displayName'])
    displayHeadingEl.appendChild(displayHeadingElText);
    containerDiv.appendChild(displayHeadingEl);
    containerDiv.appendChild(table);

});

function retrieveUserProfile(uid) {
    return new Promise((resolve, reject) => {
        const xmlHttpRequest = new XMLHttpRequest();
        const url = "https://adb2c-user-management.azurewebsites.net/api/getUser/" + uid + "?code=cwdwE6CRbjjcfxNYWnanmqBF7M2DD0mIkRzoCbvikp8BJkdjPh3ODw==";
        xmlHttpRequest.open("GET", url);

        xmlHttpRequest.onreadystatechange = function(){
            if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                const ADUser = JSON.parse(xmlHttpRequest.responseText);
                resolve(ADUser);
                return;
            }
            if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status >= 400) {
                reject('Error processing request');
                return;
            }
        }
        xmlHttpRequest.send();
    });
}

function loadADB2CUsers(){
    return new Promise((resolve, reject) => {
        let xmlHttpRequest = new XMLHttpRequest();
        const url = 'https://adb2c-user-management.azurewebsites.net/api/getUsers?code=1mDimR05fVAjsgfXUjdYIKNmyNIraaeO7vFTQg2smLDx/N6jZ1VYkw==';
        console.log('Processing....');
        xmlHttpRequest.open("GET", url);
        xmlHttpRequest.onreadystatechange = function(){
         if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            const responseUsersObj = JSON.parse(xmlHttpRequest.responseText);
            let containerDiv = document.getElementById('adb2c-users');
            containerDiv.innerHTML = '';
            const records = responseUsersObj['value'];
            adb2cUsers = [...responseUsersObj['value']];
            console.log(adb2cUsers);

            document.getElementById("edit-user-frm-container").classList.add("misc-div");

            let editUsrFrm = document.getElementById('edit-user-frm');
            const selDrpDown = document.createElement('select')
            selDrpDown.setAttribute("onchange", "loadUser()");
            selDrpDown.setAttribute("id", "user-select-dropdown");
            let opt = document.createElement("option");
            opt.setAttribute("disabled", true);
            opt.setAttribute("selected", true);
            let optionText = document.createTextNode("Choose User To Modify");
            opt.appendChild(optionText);
            selDrpDown.appendChild(opt);
            for (let record of records) {
                let table = document.createElement("table");
                const tblHead = document.createElement("thead");
                let tblRow = document.createElement("tr");
                let tblTh = document.createElement("th");

                let thHeadLabel = document.createTextNode("Property");
                tblTh.appendChild(thHeadLabel);
                tblRow.appendChild(tblTh);

                tblTh = document.createElement("th");
                thHeadLabel = document.createTextNode("Value");
                tblTh.appendChild(thHeadLabel);
                tblRow.appendChild(tblTh);
                table.appendChild(tblRow);

                opt = document.createElement("option");
                opt.setAttribute("value", record["id"]);
                optionText = document.createTextNode(record["displayName"]);
                opt.appendChild(optionText);
                selDrpDown.appendChild(opt);
                editUsrFrm.appendChild(selDrpDown);
                for (let user in record) {
                    tblRow = document.createElement("tr");
                    let tblTd = document.createElement("td")
                    let tdText = document.createTextNode(user);
                    tblTd.appendChild(tdText);
                    tblRow.appendChild(tblTd);

                    tblTd = document.createElement("td");
                    tdText = document.createTextNode(record[user]);
                    tblTd.appendChild(tdText);
                    tblRow.appendChild(tblTd);

                    table.appendChild(tblRow);

                }
                let displayHeadingEl = document.createElement("h2");
                let displayHeadingElText = document.createTextNode(record['displayName'])
                displayHeadingEl.appendChild(displayHeadingElText);
                containerDiv.appendChild(displayHeadingEl);
                containerDiv.appendChild(table);
                console.log(record);
            }


            resolve(records);
         }
         if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status >= 400) {
            reject('There was a problem processing your request');
            alert('There was a problem processing your request');
            return;
         }
    }
    xmlHttpRequest.send();

    });
}


function deleteADB2CUser(uid='') {
    const xmlHttpRequest = new XMLHttpRequest();
    const url = 'https://adb2c-user-management.azurewebsites.net/api/deleteUser/' + uid +'?code=qom1KrDet96iRYoWYWjEob0WHFxk3h7BwMZHmhiHkOfCUSAan0pD3w==';
    xmlHttpRequest.open("GET", url);
    xmlHttpRequest.onreadystatechange = function(){
        if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            alert('User Successfully Created');
        }
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status >= 400){
            alert('There was a problem processing request.')
        }
    }
    xmlHttpRequest.send();


}
function createADB2CUser(userObj={}){
    let errorMsgs = []
    console.log(userObj)
    console.log(typeof(userObj))
    if(userObj['mail'] == undefined) {
        errorMsgs.push("mail parameter missing. \r\n");
    }
    if (!userObj['givenName']) {
        errorMsgs.push("givenName parameter is missing. \r\n");
    }
    if (userObj['surname'] == undefined) {
        errorMsgs.push("surname parameter is missing. \r\n");
    }
    if (userObj['employeeId'] == undefined) {
        errorMsgs.push("Unique ID parameter is missing. \r\n");
    }
    console.log(errorMsgs);
    if (errorMsgs.length > 0) {
        let error = '';
        for (let item of errorMsgs) {
            error = error + item
        }
        alert(error);
        return;
    }
    const url = 'https://adb2c-user-management.azurewebsites.net/api/createUser?code=4lGsxICmUpsfjpoPwNaIp3ojOYI1bXC6Bjw2vstmAcjGy/Zo1DVi3g==';
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("POST", url);
    xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
    xmlHttpRequest.onreadystatechange = function(){
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            // todo: need to process result and store Azure ID to database
            console.log(xmlHttpRequest.responseText);
            alert('Azure AD User profile created successfully.')
        }
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status >= 400){
            // array of error messages
            const serverMsgs = JSON.parse(xmlHttpRequest.responseText);
            console.log(serverMsgs);
            let displayErrors = 'There was an error processing your request.';
            for(let msg of serverMsgs) {
                displayErrors = displayErrors + msg + "\r\n";
            }
            alert(displayErrors);
        }

    }
    try {
        xmlHttpRequest.send(JSON.stringify(userObj))
    } catch(e) {
        console.log(e);
        alert('Network error')
    }
}

function editADB2CUser(userObj={}){


}
