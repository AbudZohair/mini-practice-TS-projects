"use strict";
// Catch DOM NODES
const todoInput = document.querySelector('.add-task input');
const addTaskFrom = document.querySelector('.add-task');
const tasks = document.querySelector('.tasks-content');
const tasksList = document.querySelector('.tasks-list');
const noTasks = document.querySelector('.no-tasks-message');
const allTasksController = document.querySelector('.all-tasks-controller');
const tasksCount = document.querySelector('.tasks-count > span');
const tasksCompletedCount = document.querySelector('.tasks-completed > span');
// Bind Event Listeners
document.addEventListener('DOMContentLoaded', (e) => {
    callFuncsInOrder(getTodosFromLocalStorage, addLocalStorageTodosToDOM, updateTotalTasks, updateTotalCompletedTasks)('');
});
addTaskFrom.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!todoInput.value || todoInput.value.length < 5) {
        return validationHandler();
    }
    callFuncsInOrder(addTaskToLocalStorage, createTaskItem, addTaskToDom, updateTotalTasks, noTasksChekcer)(todoInput.value);
    e.currentTarget.reset();
});
tasksList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        callFuncsInOrder(deleteTask, updateTotalCompletedTasks, updateTotalTasks, noTasksChekcer)(e.target);
    }
    else if (e.target.classList.contains('completed')) {
        markTaskAsCompleted(e.target);
        updateTotalCompletedTasks();
        disableBtn(e.target);
    }
});
allTasksController.addEventListener('click', (e) => {
    if (e.target.matches('.delete-all')) {
        callFuncsInOrder(deleteAllTasks, updateTotalCompletedTasks, updateTotalTasks, noTasksChekcer)('');
        disableBtn(e.target);
    }
    else if (e.target.matches('.complete-all')) {
        tasksList.querySelectorAll('li').forEach(li => {
            markTaskAsCompleted(li);
        });
        markAllAsCompletedInlocalStorage();
        updateTotalCompletedTasks();
        disableBtn(e.target);
    }
});
let todos = [];
// Helper Functions
// get todos from localStorage
// Mark all as completed in localStorage
function markAllAsCompletedInlocalStorage() {
    todos = todos.map(todo => {
        return Object.assign(Object.assign({}, todo), { completed: true });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}
function getTodosFromLocalStorage() {
    const localStorageTodos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = localStorageTodos;
}
// Display todos from localStorage
function addLocalStorageTodosToDOM() {
    todos.forEach(todo => {
        if (todo.completed) {
            addTaskToDom(addFinishedClass(createTaskItem(todo.details)));
            noTasksChekcer(updateTotalTasks());
        }
        else {
            callFuncsInOrder(createTaskItem, addTaskToDom, updateTotalTasks, noTasksChekcer)(todo.details);
        }
    });
}
function addFinishedClass(li) {
    li.classList.add('finished');
    return li;
}
// add todo localStorage
function addTaskToLocalStorage(taskItem) {
    const task = { details: taskItem, completed: false };
    todos.push(task);
    localStorage.setItem('todos', JSON.stringify(todos));
    return taskItem;
}
function addTaskToDom(taskItem) {
    tasksList.append(taskItem);
}
function createTaskItem(taskDetails) {
    // create list item for a Task
    const li = document.createElement('li');
    // add class to it
    li.classList.add('task-box');
    const span = document.createElement('span');
    // add the task details to it
    li.append(taskDetails);
    // Create Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.textContent = 'Delete';
    // Create Completed Button
    const completedBtn = document.createElement('button');
    completedBtn.classList.add('completed');
    completedBtn.textContent = 'Completed';
    // Create Buttons Wrapper
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('flex');
    wrapperDiv.append(completedBtn, deleteBtn);
    // Add delete btn to the Task list item
    li.appendChild(wrapperDiv);
    return li;
}
// delete TaksItem
function deleteTask(button) {
    button.closest('.task-box').remove();
    const taskDetails = button.parentNode.parentNode.firstChild.textContent;
    todos = todos.filter(todo => todo.details !== taskDetails);
    localStorage.setItem('todos', JSON.stringify(todos));
}
// Delete All Tasks
function deleteAllTasks() {
    tasksList.innerHTML = '';
    todos = [];
    localStorage.setItem('todos', JSON.stringify(todos));
}
// Mark Task As Completed
function markTaskAsCompleted(button) {
    button.closest('.task-box').classList.add('finished');
    const taskDetails = button.parentNode.parentNode.firstChild.textContent;
    todos.forEach(todo => {
        if (todo.details === taskDetails) {
            todo.completed = true;
        }
        localStorage.setItem('todos', JSON.stringify(todos));
    });
}
// Disable Button
function disableBtn(button) {
    button.disabled = true;
}
function changeAllTaskControllersState() { }
// Update Total Tasks
function updateTotalTasks() {
    const totalTasks = tasksList.querySelectorAll('li').length;
    tasksCount.textContent = `${totalTasks}`;
    return totalTasks;
}
// Updata Total Completed Tasks
function updateTotalCompletedTasks() {
    const count = tasksList.querySelectorAll('.task-box.finished').length;
    tasksCompletedCount.innerText = `${count}`;
}
// Validation Msg Handler
function validationHandler() {
    const errorDiv = document.createElement('div');
    errorDiv.textContent =
        'Enter a valid Task (length should be more than 5 chars)';
    todoInput.insertAdjacentElement('beforebegin', errorDiv);
    addTaskFrom.querySelector('button.plus').disabled = true;
    setTimeout(() => {
        errorDiv.remove();
        addTaskFrom.querySelector('button.plus').disabled = false;
    }, 2000);
}
// Toggle No Tasks Message
function noTasksChekcer(tasks) {
    if (tasks > 0) {
        noTasks.textContent = '';
    }
    else {
        noTasks.textContent = 'No Tasks To Show';
    }
}
// Pipe Function to call functions inorder
// Pipe Function
function callFuncsInOrder(...funcs) {
    return function (value) {
        return funcs.reduce((res, func) => {
            return func(res);
        }, value);
    };
}
