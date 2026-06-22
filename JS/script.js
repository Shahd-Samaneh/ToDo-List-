const addBtn = document.querySelector(".task-add");
const backdrop = document.querySelector(".black-backdrop");
const task = document.querySelector(".task");
const taskBtn = document.querySelector(".task-btn");
const edit = document.querySelector(".edit");
const editBtn = document.querySelector(".edit-btn");
let currentTask = null;
function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".card").forEach(card => {
        tasks.push({
            text: card.querySelector("label").textContent,
            completed: card.querySelector(".check-icon").classList.contains("show")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        createTask(task.text, task.completed);
    });
}
function createTask(taskText, completed = false) {
    const list = document.querySelector(".list");
    const li = document.createElement("li");
    li.classList.add("card", "flex-row");

    li.innerHTML = `
        <span class="checkbox">
            <i class="check-icon fa-solid fa-check fa-sm"></i>
        </span>

        <input type="checkbox" name="task">

        <label>${taskText}</label>

        <i class="edit-icon fa-regular fa-pen-to-square fa-sm" style="color: #1f3a5f;"></i>
        <i class="trash-icon fa-regular fa-trash-can fa-sm"></i>
    `;
    li.addEventListener("click", () => toggleIcons(li));
    li.addEventListener("mouseover", () => iconAppear(li));
    li.addEventListener("mouseleave", () => iconDisappear(li));
    const trashIcon = li.querySelector(".trash-icon");
    const editIcon = li.querySelector(".edit-icon");
    trashIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteTask(li);
    });
    list.appendChild(li);
    if (completed) {
        li.querySelector(".check-icon").classList.add("show");
    }

    editIcon.addEventListener("click", (event) => {
        event.stopPropagation();

        currentTask = li;

        document.querySelector(".edit .edit-task-input").value =
            li.querySelector("label").textContent;

        task.classList.remove("show");
        backdrop.classList.add("show");
        edit.classList.add("show");
        addBtn.classList.add("active");
    });
    updateTasksCount();
}
function updateTasksCount() {
    const allTasks = document.querySelectorAll(".card");
    const completedTasks = document.querySelectorAll(".check-icon.show");
    const tasksLeft = allTasks.length - completedTasks.length;
    document.querySelector(".tasks-number").textContent = tasksLeft;
}
function toggleIcons(item) {
    const checkIcon = item.querySelector(".check-icon");
    checkIcon.classList.toggle("show");
    updateTasksCount();
    saveTasks();
}
function iconAppear(item) {
    const trashIcon = item.querySelector(".trash-icon");
    const editIcon = item.querySelector(".edit-icon");
    trashIcon.classList.add("show");
    editIcon.classList.add("show");
}
function iconDisappear(item) {
    const trashIcon = item.querySelector(".trash-icon");
    const editIcon = item.querySelector(".edit-icon");
    trashIcon.classList.remove("show");
    editIcon.classList.remove("show");
}
function deleteTask(item) {
    item.remove();
    updateTasksCount();
    saveTasks();
}
addBtn.addEventListener("click", () => {
    backdrop.classList.toggle("show");
    if(edit.classList.contains("show")){
       edit.classList.remove("show");
    }
    else if( task.classList.contains("show")){
        task.classList.remove("show");
    }
    else{
        task.classList.add("show");
    }
    
    addBtn.classList.toggle("active");
});
backdrop.addEventListener("click", () => {
    console.log("close");

    backdrop.classList.remove("show");
    task.classList.remove("show");
    edit.classList.remove("show");
    addBtn.classList.remove("active");
});
editBtn.addEventListener("click", () => {

    const newText =
        document.querySelector(".edit .edit-task-input").value;

    if (!newText.trim()) return;

    currentTask.querySelector("label").textContent = newText;

    saveTasks();

    backdrop.classList.remove("show");
    edit.classList.remove("show");
    addBtn.classList.remove("active");
    currentTask = null;
});
taskBtn.addEventListener("click", addTask);
function addTask() {
    const input = document.querySelector(".add-task-input");
    if (input.value.trim() === "") return;
    createTask(input.value);
    updateTasksCount();
    saveTasks();
    input.value = "";
}
loadTasks();
updateTasksCount();

