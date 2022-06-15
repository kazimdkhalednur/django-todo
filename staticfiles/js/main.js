let toggle = true;
let formId = document.getElementById('formID');
let btnID = document.getElementById('btnID');

let formShow = () => {
    formId.classList.remove('hidden');
    btnID.innerHTML = 'Close'
    btnID.style.backgroundColor = 'red'
    toggle = false;
}

let formHide = () => {
    formId.classList.add('hidden');
    btnID.innerHTML = 'Add'
    btnID.style.backgroundColor = 'green'
    toggle = true;
}

btnID.addEventListener('click', () => {
    if(toggle){
        formShow()
    } else {
        formHide()
    }
})



// CRUD operation

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

let taskList = document.getElementById('task-list');
var activeTaskID = null;


const getTasks = async() => {
    taskList.innerHTML = ''
    let response = await fetch('/api/task/',{
        method: "GET",
        headers: {
            "Content-type": "application/json",
        }
    })
    let data = await response.json()
    if(data.length === 0 ){
        console.log('nothing')
        taskList.innerHTML = '<h2 style="text-align: center;padding: 30px 0;">No task added</h2>'
    } else {
    for(var task in data){
        taskList.innerHTML += `
            <div class="task ${data[task].reminder ? 'reminder' : ''}" ondblclick="toggleReminder('${data[task].id}', '${data[task].url}')">
                <h3>
                    ${data[task].text}
                    <div class="flex">
                        <div class="edit-btn" onclick="editTask(${data[task].id},'${data[task].text}', '${data[task].date_and_time}', '${data[task].reminder}')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="1em" width="1em" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                        </div>
                        <div class="delete-btn" onclick="deleteTask('${data[task].url}')">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                        </svg>
                        </div>
                    </div>
                </h3>
                <p>${data[task].date_and_time}</p>
            </div>
        `
    }
}
}
getTasks()

const editTask = (id, text, date_and_time, reminder) => {
    formId.reset()
    document.getElementById('text-id').value = text;
    document.getElementById('date_and_time-id').value = date_and_time;
    if (reminder === 'true'){
        document.getElementById("reminderId").checked = true;
    } else {
        document.getElementById("reminderId").checked = false;
    }
    activeTaskID = id;
    formShow()
}

const deleteTask = async(url) => {
    let response = await fetch(url,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        }
    })
    getTasks()
}

formId.addEventListener('submit', async(e) => {
    e.preventDefault();
    if (activeTaskID){
        let response = await fetch(`/api/task/${activeTaskID}/`,{
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
        let oldTask = await response.json();
        if (e.target.text.value !== oldTask.text && e.target.date_and_time.value !== oldTask.date_and_time && e.target.reminder.checked !== oldTask.reminder) {
            let response = await fetch(`/api/task/${activeTaskID}/`,{
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify({'text': e.target.text.value, 'date_and_time': e.target.date_and_time.value, 'reminder': e.target.reminder.checked}),
            })
            let data = await response.json()
            formId.reset()
        } else {
            let formData = {};
            e.target.text.value !== oldTask.text ? formData.text = e.target.text.value : ''

            e.target.date_and_time.value !== oldTask.date_and_time ? formData.date_and_time = e.target.date_and_time.value : ''


            e.target.reminder.checked !== oldTask.reminder ? formData.reminder = e.target.reminder.checked : ''
            let response = await fetch(`/api/task/${activeTaskID}/`,{
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify(formData),
            })
            let data = await response.json()
            formId.reset()
        }
        
    } else {
        let response = await fetch('/api/task/',{
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({'text': e.target.text.value, 'date_and_time': e.target.date_and_time.value, 'reminder': e.target.reminder.checked}),
        })
        let data = await response.json()
        formId.reset()
    }
    getTasks()
    formHide()
})

const toggleReminder = async(id, url) => {
    let getresponse = await fetch(url,{
        method: "GET",
        headers: {
            "Content-type": "application/json",
        }
    })
    let task = await getresponse.json()
    let patchresponse = await fetch(url,{
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({'reminder': !task.reminder}),
    })
    let data = await patchresponse.json()
    getTasks()
}