// --- CONFIG ---
const username = "todo-ui";
const BASE_URL = `http://localhost:8080/users/${username}/todos`;

// --- DOM ELEMENTS ---
const taskInput = document.getElementById('task');
const dateInput = document.getElementById('date');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todo-list');

let todos = [];

// --- LOAD TODOS FROM BACKEND ---
async function loadTodos() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    todos = await res.json();
    displayTodos();
  } catch (error) {
    console.error("Error loading todos:", error);
  }
}

// --- DISPLAY TODOS ON PAGE ---
function displayTodos() {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>
        <span class="task">${todo.title || 'Untitled'}</span>
        <span class="date">${todo.date || ''}</span>
      </span>
      <div class="actions">
        <i class="fas fa-edit" onclick="editTodo(${todo.id}, '${escapeQuotes(todo.title)}', '${todo.date || ''}')"></i>
        <i class="fas fa-trash" onclick="deleteTodo(${todo.id})"></i>
      </div>
    `;
    todoList.appendChild(li);
  });
}

// --- ESCAPE SINGLE QUOTES IN STRINGS FOR INLINE JS ---
function escapeQuotes(str = "") {
  return str.replace(/'/g, "\\'");
}

// --- ADD NEW TODO ---
addBtn.addEventListener('click', async () => {
  const title = taskInput.value.trim();
  const date = dateInput.value;

  if (!title || !date) {
    alert('Please enter both a task and a date!');
    return;
  }

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date })
    });

    if (!response.ok) throw new Error("Failed to add todo");

    const data = await response.json();
    console.log("Added todo:", data);

    taskInput.value = '';
    dateInput.value = '';
    loadTodos();
  } catch (error) {
    console.error("Error adding todo:", error);
    alert("Failed to add task. Please try again.");
  }
});

// --- EDIT TODO ---
async function editTodo(id, oldTitle, oldDate) {
  const newTitle = prompt('Edit task:', oldTitle);
  const newDate = prompt('Edit date (YYYY-MM-DD):', oldDate);

  if (!newTitle || !newDate) return;

  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, date: newDate })
    });

    if (!res.ok) throw new Error("Failed to update todo");

    loadTodos();
  } catch (error) {
    console.error("Error editing todo:", error);
    alert("Failed to update task. Please try again.");
  }
}

// --- DELETE TODO ---
async function deleteTodo(id) {
  if (confirm('Are you sure you want to delete this schedule?')) {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete todo");

      loadTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete task. Please try again.");
    }
  }
}

// --- INITIAL LOAD ---
loadTodos();
