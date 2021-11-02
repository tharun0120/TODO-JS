//selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const todoCount = document.querySelector(".num-todo");

//event listeners
document.addEventListener("DOMContentLoaded", getTodo);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

//functions
function add(todo, complete) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  if (complete) {
    todoDiv.classList.add("completed");
  }

  const newTodo = document.createElement("li");
  newTodo.innerText = todo;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  const completeButton = document.createElement("button");
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.classList.add("complete-btn");
  todoDiv.appendChild(completeButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.classList.add("delete-btn");
  todoDiv.appendChild(deleteButton);

  todoList.appendChild(todoDiv);
}

function addTodo(event) {
  //prevent from refreshing
  //   console.log("hello");
  event.preventDefault();

  if (todoInput.value === "") {
    toast("PLEASE ADD A TODO");
  } else {
    add(todoInput.value, false);
    saveTodo(todoInput.value);
    todoInput.value = "";
    toast("TODO ADDED SUCCESSFULLY");
  }
}

function deleteCheck(event) {
  event.preventDefault();

  const item = event.target;

  if (item.classList[0] === "delete-btn") {
    const todo = item.parentElement;
    todo.classList.add("fall");
    deleteTodo(todo.children[0].innerText);
    todo.addEventListener("transitionend", () => {
      todo.remove();
      toast("TODO DELETED SUCCESSFULLY");
    });
  }

  if (item.classList[0] === "complete-btn") {
    let todos = checkLocalStorage();
    todos.forEach((x) => {
      if (x.todo === item.parentElement.children[0].innerText) {
        x.completed = true;
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
    item.parentElement.classList.toggle("completed");
  }
}

function filterTodo(e) {
  e.preventDefault();

  const todos = todoList.childNodes;
  todos.forEach((todo) => {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "pending":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

//localstorage

function checkLocalStorage() {
  if (localStorage.getItem("todos") === null) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem("todos"));
  }
}

function saveTodo(todo) {
  todoObject = { todo: todo, completed: false };
  let todos = checkLocalStorage();
  todos.push(todoObject);
  localStorage.setItem("todos", JSON.stringify(todos));
  todoCount.innerText = todos.length;
}

function deleteTodo(todo) {
  let todos = checkLocalStorage();
  todos.splice(todos.indexOf(todo), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  todoCount.innerText = todos.length;
}

function getTodo() {
  let todos = checkLocalStorage();
  // console.log(todos);
  todoCount.innerText = todos.length;

  todos.forEach((todo) => {
    add(todo.todo, todo.completed);
  });
}

function toast(toastMessage) {
  var x = document.getElementById("toast");
  x.innerHTML = toastMessage;
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
