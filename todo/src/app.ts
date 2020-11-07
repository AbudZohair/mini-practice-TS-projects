// Catch DOM NODES
const todoInput = document.querySelector('.add-task input') as HTMLInputElement;
const addTaskFrom = document.querySelector('.add-task') as HTMLFormElement;
const tasks = document.querySelector('.tasks-content') as HTMLDivElement;
const tasksList = document.querySelector('.tasks-list') as HTMLUListElement;
const noTasks = document.querySelector('.no-tasks-message') as HTMLSpanElement;
const allTasksController = document.querySelector(
  '.all-tasks-controller'
) as HTMLDivElement;
const tasksCount = document.querySelector(
  '.tasks-count > span'
) as HTMLSpanElement;
const tasksCompletedCount = document.querySelector(
  '.tasks-completed > span'
) as HTMLSpanElement;

// Bind Event Listeners
document.addEventListener('DOMContentLoaded', (e: Event) => {
  callFuncsInOrder(
    getTodosFromLocalStorage,
    addLocalStorageTodosToDOM,
    updateTotalTasks,
    updateTotalCompletedTasks
  )('');
});

addTaskFrom.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  if (!todoInput.value || todoInput.value.length < 5) {
    return validationHandler();
  }

  callFuncsInOrder(
    addTaskToLocalStorage,
    createTaskItem,
    addTaskToDom,
    updateTotalTasks,
    noTasksChekcer
  )(todoInput.value);
  (e.currentTarget as HTMLFormElement).reset();
});

tasksList.addEventListener('click', (e: Event) => {
  if (e.target!.classList.contains('delete')) {
    callFuncsInOrder(
      deleteTask,
      updateTotalCompletedTasks,
      updateTotalTasks,
      noTasksChekcer
    )(e.target);
  } else if (e.target.classList.contains('completed')) {
    markTaskAsCompleted(e.target);
    updateTotalCompletedTasks();
    disableBtn(e.target);
  }
});

allTasksController.addEventListener('click', (e: Event) => {
  if (e.target.matches('.delete-all')) {
    callFuncsInOrder(
      deleteAllTasks,
      updateTotalCompletedTasks,
      updateTotalTasks,
      noTasksChekcer
    )('');
    disableBtn(e.target);
  } else if (e.target.matches('.complete-all')) {
    tasksList.querySelectorAll('li').forEach(li => {
      markTaskAsCompleted(li);
    });
    markAllAsCompletedInlocalStorage();
    updateTotalCompletedTasks();

    disableBtn(e.target);
  }
});

// Store
// todos is a container for all app todos
// todo = {details, completed}
interface todo {
  details: string;
  completed: boolean;
}
let todos: todo[] = [];

// Helper Functions

// get todos from localStorage

// Mark all as completed in localStorage

function markAllAsCompletedInlocalStorage() {
  todos = todos.map(todo => {
    return { ...todo, completed: true };
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
  const localStorageTodos = JSON.parse(localStorage.getItem('todos')!) || [];
  todos = localStorageTodos;
}

// Display todos from localStorage
function addLocalStorageTodosToDOM() {
  todos.forEach(todo => {
    if (todo.completed) {
      addTaskToDom(addFinishedClass(createTaskItem(todo.details)));
      noTasksChekcer(updateTotalTasks());
    } else {
      callFuncsInOrder(
        createTaskItem,
        addTaskToDom,
        updateTotalTasks,
        noTasksChekcer
      )(todo.details);
    }
  });
}
function addFinishedClass(li: HTMLLIElement) {
  li.classList.add('finished');
  return li;
}

// add todo localStorage
function addTaskToLocalStorage(taskItem: string) {
  const task = { details: taskItem, completed: false };
  todos.push(task);
  localStorage.setItem('todos', JSON.stringify(todos));
  return taskItem;
}

function addTaskToDom(taskItem: HTMLLIElement) {
  tasksList.append(taskItem);
}

function createTaskItem(taskDetails: string): HTMLLIElement {
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
function deleteTask(button: Event) {
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
function markTaskAsCompleted(button: HTMLButtonElement | HTMLLIElement) {
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
function disableBtn(button: HTMLButtonElement) {
  button.disabled = true;
}

function changeAllTaskControllersState() {}

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
  addTaskFrom.querySelector<HTMLButtonElement>('button.plus')!.disabled = true;

  setTimeout(() => {
    errorDiv.remove();
    addTaskFrom.querySelector<HTMLButtonElement>(
      'button.plus'
    )!.disabled = false;
  }, 2000);
}

// Toggle No Tasks Message

function noTasksChekcer(tasks: number) {
  if (tasks > 0) {
    noTasks.textContent = '';
  } else {
    noTasks.textContent = 'No Tasks To Show';
  }
}
// Pipe Function to call functions inorder
// Pipe Function
function callFuncsInOrder(...funcs: Array<any>) {
  return function (value: string) {
    return funcs.reduce((res, func) => {
      return func(res);
    }, value);
  };
}
