'use strict';

async function addGroupToPage(){
    document.getElementById('list-group').innerHTML = "";
    document.getElementById('mess-room').innerHTML = "";
    let response = await fetch('http://127.0.0.1:8000/api/v1/roomlist/', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Token '+ sessionStorage.tokenData,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
    });
    let result = await response.json();
    if (response.ok) {
        let rooms = JSON.parse(JSON.stringify(result));
        if (rooms) {
            if (rooms.length) {
                document.getElementById('mess-room').innerHTML = "<h4>Доступные комнаты-чаты:</h4>";
                for (let r of rooms) {
                    let button = document.createElement('button');
                    button.innerHTML = r.name;
                    button.onclick = function () {
                        sessionStorage.setItem('roomId', r.pk);
                        location.href = '../templates/chat.html';
                    };
                    let output = document.getElementById('list-group');
                    button.classList.add('list-group-item', 'list-group-item-action');
                    output.appendChild(button);
                    }
                }
            } else {
                document.getElementById('mess-room').innerHTML = "<h4>Нет доступных комнат-чатов. Создайте новую.</h4>";
            }
    }
    else{
        document.getElementById('mess-room').innerHTML = "<h4>Не удалось получить список доступных комнат-чатов.</h4>";
    }
}

addGroupToPage();

const cg_btn = document.getElementById('create-room-btn');
if (cg_btn)
    cg_btn.addEventListener('click', async (e) => {
            e.preventDefault();
            let group_name = prompt("Введите название комнаты-чата:", "Новый чат");
            if (group_name == null || group_name == "") {
                alert('Вы не ввели название, комната-чат не будет создана.')
            } else {
                let obj = {name: group_name};
                let response = await fetch('http://127.0.0.1:8000/api/v1/roomlist/', {
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
                    console.log('Группа создана.');
                    //добавить пользователя в созданную группу
                    let group_id = result['pk'];
                    obj = {room: group_id, user: 0};
                    response = await fetch('http://127.0.0.1:8000/api/v1/userroom/', {
                        method: 'POST',
                        body: JSON.stringify(obj),
                        headers: new Headers({
                            'Authorization': 'Token '+ sessionStorage.tokenData,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }),
                    });
                    result = await response.json();
                    if (response.ok) {
                        console.log('Пользователь добавлен в созданную группу.');
                    }
                    //обновить список групп
                    await addGroupToPage();
                }
            }
        }
    )

