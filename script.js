document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.task-container');
    const addTaskBtns = document.querySelectorAll('.add-task-btn');
    const modal = document.getElementById('task-modal');
    const closeModal = document.querySelector('.close');
    const taskInput = document.getElementById('task-input');
    const saveTaskBtn = document.getElementById('save-task');

    // Drag and Drop functionality
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData('text/plain');
            const task = document.getElementById(taskId);
            column.appendChild(task);
            saveTasksToLocalStorage();
        });
    });

    // Add Task Modal
    addTaskBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
            taskInput.value = '';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskContainer = document.querySelector('[data-status="planung"]');
            createTask(taskText, taskContainer);
            modal.style.display = 'none';
            saveTasksToLocalStorage();
        }
    });

    function createTask(text, container) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.draggable = true;
        task.textContent = text;
        task.id = 'task-' + Date.now();

        task.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
        });

        container.appendChild(task);
    }

    function saveTasksToLocalStorage() {
        const boardState = {};
        columns.forEach(column => {
            const status = column.dataset.status;
            boardState[status] = Array.from(column.children)
                .map(task => task.textContent);
        });
        localStorage.setItem('kanbanBoard', JSON.stringify(boardState));
    }

    function loadTasksFromLocalStorage() {
        const savedBoard = localStorage.getItem('kanbanBoard');
        if (savedBoard) {
            const boardState = JSON.parse(savedBoard);
            Object.keys(boardState).forEach(status => {
                const container = document.querySelector(`[data-status="${status}"]`);
                boardState[status].forEach(taskText => {
                    createTask(taskText, container);
                });
            });
        }
    }

    loadTasksFromLocalStorage();
});