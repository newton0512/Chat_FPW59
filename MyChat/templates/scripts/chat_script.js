'use strict';

//window.addEventListener("beforeunload", function () {
    //sessionStorage.removeItem('roomId');
//});
let current_user_id = null;
let current_username = '';
let last_message_id = 0;

async function getCurrentUser() {
    let us_response = await fetch('http://127.0.0.1:8000/api/v1/currentuser/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Token ' + sessionStorage.tokenData,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
    });
    let us_result = await us_response.json();
    if (us_response.ok) {
        current_user_id = us_result['id'];
        current_username = us_result['username'];
        document.getElementById('curr-user-name').innerHTML = "<strong> Текущий пользователь: " + current_username + "</strong>";
    }
}

getCurrentUser();

async function AddUserInChat(chat_id){
    document.getElementById('user-list-group').innerHTML = "";
    //выбрать только пользователей из группы
    let response = await fetch('http://127.0.0.1:8000/api/v1/userroom/' + chat_id + '/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Token '+ sessionStorage.tokenData,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
    });
    let result = await response.json();
    if (response.ok) {
        let users_r = JSON.parse(JSON.stringify(result));
        if (users_r) {
            if (users_r.length) {
                for (let u of users_r) {
                    let button = document.createElement('button');
                    button.innerHTML = u.username;
                    let output = document.getElementById('user-list-group');
                    button.classList.add('list-group-item', 'list-group-item-action', 'mb-1', 'active');
                    output.appendChild(button);
                }
            }
        }

    }
    //выбрать всех пользователей, которых нет в группе
    response = await fetch('http://127.0.0.1:8000/api/v1/userlist/' + chat_id + '/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Token '+ sessionStorage.tokenData,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
    });
    result = await response.json();
    if (response.ok) {
        let users_nr = JSON.parse(JSON.stringify(result));
        if (users_nr) {
            if (users_nr.length) {
                for (let u of users_nr) {
                    let button = document.createElement('button');
                    button.innerHTML = u.username;
                    button.onclick = async function () {
                        if (confirm("Добавить пользователя " + u.username + " в этот чат?")) {
                            let obj = {room: chat_id, user: u.pk};
                            let response = await fetch('http://127.0.0.1:8000/api/v1/userroom/', {
                                method: 'POST',
                                body: JSON.stringify(obj),
                                headers: new Headers({
                                    'Authorization': 'Token '+ sessionStorage.tokenData,
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                }),
                            });

                            await AddUserInChat(sessionStorage.roomId);
                        }
                    };
                    let output = document.getElementById('user-list-group');
                    button.classList.add('list-group-item', 'list-group-item-action', 'mb-1');
                    output.appendChild(button);
                }
            }
        }
    }
}

AddUserInChat(sessionStorage.roomId);

document.getElementById('chat-list').innerHTML = "";
CheckNewMessage(sessionStorage.roomId);


const lg_btn = document.getElementById('leave-room-btn');
if (lg_btn)
    lg_btn.addEventListener('click', async (e) => {
            e.preventDefault();
            location.href = '../templates/group.html';
        }
    )

const send_btn = document.getElementById('send-btn');
if (send_btn)
    send_btn.addEventListener('click', async (e) => {
            e.preventDefault();
            let message_text = document.getElementById('input-message-txt').value;
            if (message_text !== ""){
                let obj = {sender: current_user_id, room: sessionStorage.roomId, text: message_text};
                let response = await fetch('http://127.0.0.1:8000/api/v1/send_message/', {
                    method: 'POST',
                    body: JSON.stringify(obj),
                    headers: new Headers({
                        'Authorization': 'Token '+ sessionStorage.tokenData,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
                });
                let result = await response.json();
                if (response.ok) {
                    document.getElementById('input-message-txt').value = "";
                    await CheckNewMessage(sessionStorage.roomId);
                }
            }
        }
    )

function fillChatList(result){
    let messages = JSON.parse(JSON.stringify(result));
    if (messages) {
        if (messages.length) {
            for (let m of messages) {
                last_message_id = m.id;
                let div = document.createElement('div');
                div.innerHTML = '<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">\n' +
                    '<div class="font-weight-bold mb-1">' + m.username + '</div>\n' +
                    m.message + '</div>';
                let output = document.getElementById('chat-list');
                console.log(m.sender_id + '-' + current_user_id);
                if (m.sender_id == current_user_id){
                    div.classList.add('chat-message-right', 'pb-4');
                }
                else {
                    div.classList.add('chat-message-left', 'pb-4');
                }
                output.appendChild(div);
                let scroll_to_bottom = document.getElementById('chat-list');
                scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
            }
        }
    }
}

async function CheckNewMessage(chat_id){
    let response = await fetch('http://127.0.0.1:8000/api/v1/messagelist/' + chat_id + '/?idm=' + last_message_id, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Token '+ sessionStorage.tokenData,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
    });
    let result = await response.json();
    if (response.ok) {
        fillChatList(result);
    }
}

let timerId = setTimeout(function tick() {
    CheckNewMessage(sessionStorage.roomId);
    timerId = setTimeout(tick, 2000); // (*)
}, 2000);


let input = document.getElementById("input-message-txt");

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("send-btn").click();
    }
});