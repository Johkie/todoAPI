function getTasks()
{
    getDataAsync("https://localhost:44344/api/todoitems").then(data => buildSite(data));
}

async function getDataAsync(url)
{
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function buildSite(data)
{
    // Clear tablerows
    var taskTable = document.getElementById("taskTable");
    for(var i = taskTable.rows.length - 1; i > 0; i--)
    {
        taskTable.deleteRow(i);
    }  

    // Insert todoitems to table
    data.forEach(element => displayTodoItem(element, taskTable));
}

function displayTodoItem(element, taskTable)
{
    // Taskrow
    var taskRow = document.createElement("tr");
    taskRow.id = element.id;
    taskRow.className = "taskItem"

    // TaskName
    var textField = document.createElement("input");
    textField.className = "taskName"
    textField.id = "tn" + element.id;
    textField.type = "text";
    textField.value = element.name;

    textField.addEventListener('change', function () {
        var todoItem = this.parentElement.parentElement;
        changeTask(todoItem);
    })
    
    // Checkbox
    var checkbox = document.createElement("input");
    checkbox.className = "taskCheckbox";
    checkbox.id = "cb" + element.id;
    checkbox.type = "checkbox";
    checkbox.checked = element.isComplete;

    checkbox.addEventListener('change', function () {
        var todoItem = this.parentElement.parentElement;
        changeTask(todoItem);
    })

    // Delete button
    var deleteButton = document.createElement("input");
    deleteButton.id = "db" + element.id;
    deleteButton.type = "button";
    deleteButton.value = "Delete";

    deleteButton.addEventListener('click', async function() {
        var todoItem = this.parentElement.parentElement;

        // Delete on task ID
        await fetch(('https://localhost:44344/api/todoitems/' + todoItem.children[0].innerHTML), {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'DELETE'})
        
        // Refresh todo list
        getTasks();

    })
    
    // Insert all cells with taskdata to table
    taskRow.insertCell(0).innerHTML = element.id;
    taskRow.insertCell(1).appendChild(textField);
    taskRow.insertCell(2).appendChild(checkbox);
    taskRow.insertCell(3).appendChild(deleteButton);
    
    taskTable.appendChild(taskRow);
}

async function createTask()
{
    // Get task values from the inputfields
    var newTaskName = document.getElementById("newTaskName");
    var newTaskCheckbox = document.getElementById("newTaskCheckbox");

    // dont add if input string is empty
    if (newTaskName.value.trim() !== "")
    {
        await fetch('https://localhost:44344/api/todoitems', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify(
                {
                    name: newTaskName.value,
                    isComplete: newTaskCheckbox.checked
                })
            })
    }
            
    // Reset inputfields
    newTaskName.value = "";
    newTaskCheckbox.checked = false;

    // Refresh task list
    getTasks();
}

async function changeTask(todoItem)
{
    // Get task data
    var taskID = todoItem.children[0].innerHTML;
    var taskName = todoItem.children[1].children[0].value;
    var taskIsComplete = todoItem.children[2].children[0].checked;

    // Update databse with the new data
    fetch(('https://localhost:44344/api/todoitems/' + taskID), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'PUT',
        body: JSON.stringify(
            {
                id: parseInt(taskID),
                name: taskName,
                isComplete: taskIsComplete
            })
        })
}
