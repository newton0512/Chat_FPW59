'use strict';

function saveToken(token) {
    sessionStorage.setItem('tokenData', token);
}

function writeToScreen(id_element, message) {
    let output = document.getElementById(id_element);
    let el = document.createElement("div");
    el.classList.add('alert', 'alert-danger');
    el.setAttribute("role", "alert");
    el.innerHTML = message;
    output.appendChild(el);
}

function messageLogin(js, key, id_element){
    let message = js[key];
    if (message)
        for (let m of message) {
            writeToScreen(id_element,m);
        }
}

const btn = document.getElementById('reg-btn');
if (btn)
btn.addEventListener('click', async (e) => {
    e.preventDefault();
    document.getElementById('usernameHelp').innerHTML = "";
    document.getElementById('passwordHelp').innerHTML = "";
    document.getElementById('repasswordHelp').innerHTML = "";
    let reg_form = document.getElementById('signup-form');
    let user_data = new FormData(reg_form);
    let response = await fetch('http://127.0.0.1:8000/api/v1/auth/users/', {
        method: 'POST',
        body: user_data,
    });
    let result = await response.json();
    if (response.ok) {
        alert('Пользователь "' + user_data.get('username') + '" успешно зарегистрирован!\n' + 'Сейчас вы будете перенаправлены на страницу входа.' );
        location.href = '../templates/login.html';
    }
    else {
        messageLogin(result, 'username', 'usernameHelp');
        messageLogin(result, 'password', 'passwordHelp');
        messageLogin(result, 're_password', 'repasswordHelp');
        messageLogin(result, 'non_field_errors', 'repasswordHelp');
    }
    }
)


const btn_enter = document.getElementById('enter-btn');
if (btn_enter)
btn_enter.addEventListener('click', async (e) => {
    e.preventDefault();
    document.getElementById('usernameHelp1').innerHTML = "";
    document.getElementById('passwordHelp1').innerHTML = "";
    let enter_form = document.getElementById('enter-form');
        let user_data = new FormData(enter_form);
        let response = await fetch('http://127.0.0.1:8000/auth/token/login', {
            method: 'POST',
            body: user_data,
        });
        let result = await response.json();
        console.log(result);
        if (response.ok) {
            let token = result['auth_token'];
            console.log(token);
            saveToken(token);
            //document.cookie = "Token=" + token + ";";
            location.href = '../templates/group.html';
        }
        else {
            messageLogin(result, 'username', 'usernameHelp1');
            messageLogin(result, 'password', 'passwordHelp1');
            messageLogin(result, 'non_field_errors', 'passwordHelp1');
        }
}
)

const btn_exit = document.getElementById('logout-btn');
if (btn_exit)
    btn_exit.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log(sessionStorage.tokenData);
            let response = await fetch('http://127.0.0.1:8000/auth/token/logout', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Token '+ sessionStorage.tokenData,
                }),
            });
            if (response.ok) {
                sessionStorage.removeItem('tokenData');
                location.href = '../templates/auth.html';
            }
            else {
                alert('Что-то пошло не так...')
            }
        }
    )