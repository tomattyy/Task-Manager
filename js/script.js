const STORAGE_KEY = "gatinhos-tasks-v1";

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");

function loadTask() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return[];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render(tasks) {
    list.innerHTML = "";
    emptyMsg.hidden = tasks.length > 0;

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        if (task.done) listItem.classList.add("done");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", "Marcar como concluída");
        checkbox.addEventListener("change", () => {
            task[index].done = checkbox.checked;
            listItem.classList.toggle("done", checkbox.checked);
            saveTasks(tasks);
        });

        const label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + task.text));
        
        const del = document.createElement("button");
        del.type = "button";
        del.className = "del";
        del.textContent = "Excluir";
        del.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks(tasks);
            render(tasks);
        });

        listItem.appendChild(label);
        listItem.appendChild(del);
        list.appendChild(listItem);
    });
      
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const tasks = loadTask();
    tasks.push({text, done: false})
    saveTasks(tasks);
    input.value = "";
    render(tasks);
    input.focus();
});

render(loadTask());

