
// Initialize Lucide icons
lucide.createIcons();

// Weekly Working Hours Chart
const workingHoursCtx = document.getElementById('workingHoursChart').getContext('2d');
new Chart(workingHoursCtx, {
    type: 'bar',
    data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [{
            label: 'Top',
            data: [17, 29, 33, 11, 37, 39],
            backgroundColor: '#d1d5db', // gray-300
            borderRadius: {topLeft: 6, topRight: 6},
            barPercentage: 0.5,
        }, {
            label: 'Bottom',
            data: [83, 71, 67, 89, 63, 61],
            backgroundColor: '#6366f1', // indigo-500
            borderRadius: {bottomLeft: 6, bottomRight: 6},
            barPercentage: 0.5,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                 callbacks: {
                    label: function(context) {
                        // Show percentage on hover
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + '%';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                 ticks: {
                    color: '#6b7280' // gray-500
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                max: 100,
                ticks: {
                   stepSize: 20,
                   color: '#6b7280', // gray-500
                   callback: function(value) {
                       return value.toFixed(1);
                   }
                },
                grid: {
                    color: '#e5e7eb', // gray-200
                    borderDash: [5, 5]
                }
            }
        }
    }
});

// Running Project Review Chart
const projectReviewCtx = document.getElementById('projectReviewChart').getContext('2d');
new Chart(projectReviewCtx, {
    type: 'doughnut',
    data: {
        labels: ['Project 1', 'Project 2', 'Project 3', 'Remaining'],
        datasets: [{
            data: [20, 20, 12, 48], // These values make up 52% of the total circle
            backgroundColor: [
                '#fb923c', // orange-400
                '#3b82f6', // blue-500
                '#22c55e', // green-500
                '#e5e7eb'  // gray-200
            ],
            borderColor: '#ffffff',
            borderWidth: 4,
            hoverBorderWidth: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Lucide icons on initial load
    lucide.createIcons();

    // ========= TEAM & TASK SCRIPT (EXISTING) =========
    const teamList = document.getElementById('team-list');
    const taskList = document.getElementById('task-list');

    // Sample data for team members
    const teamData = [
        { name: 'Ms. Megha T', role: 'Tester', status: 'Available', avatar: 'https://placehold.co/40x40/fecaca/991b1b?text=MT' },
        { name: 'Mr. John Deo', role: 'Designer', status: 'Available', avatar: 'https://placehold.co/40x40/dbeafe/1e3a8a?text=JD' },
        { name: 'Mr. Jacob Ryan', role: 'Developer', status: 'Absent', avatar: 'https://placehold.co/40x40/fee2e2/991b1b?text=JR' },
        { name: 'Mr. Jay Soni', role: 'Team Leader', status: 'Available', avatar: 'https://placehold.co/40x40/e0e7ff/3730a3?text=JS' },
        { name: 'Ms. Linda Cart', role: 'Director', status: 'Available', avatar: 'https://placehold.co/40x40/f3e8ff/5b21b6?text=LC' },
        { name: 'Mr. Rajesh Kun', role: 'Tester', status: 'Absent', avatar: 'https://placehold.co/40x40/fae8ff/7e22ce?text=RK' },
        { name: 'Ms. Nina Patel', role: 'Developer', status: 'Available', avatar: 'https://placehold.co/40x40/fce7f3/9d266f?text=NP' },
        { name: 'Mr. Michael Le', role: 'Designer', status: 'Available', avatar: 'https://placehold.co/40x40/e2e8f0/475569?text=ML' },
    ];

    // Sample data for tasks
    const taskData = [
        { task: 'Task A', status: 'Not Started', manager: 'Jay Soni', progress: 60, document: true },
        { task: 'Task B', status: 'Completed', manager: 'Sarah Smith', progress: 100, document: true },
        { task: 'Task C', status: 'In Progress', manager: 'Megha Trivedi', progress: 80, document: true },
        { task: 'Task D', status: 'Pending', manager: 'Jacob Ryan', progress: 70, document: false },
        { task: 'Task E', status: 'In Progress', manager: 'Airi Satou', progress: 90, document: true },
        { task: 'Task A', status: 'Not Started', manager: 'Angelica Ra...', progress: 50, document: false },
        { task: 'Task B', status: 'Completed', manager: 'Ashton Cox', progress: 100, document: true },
    ];

    function renderTeam() {
        teamList.innerHTML = teamData.map(member => `
            <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div class="flex items-center">
                    <img src="${member.avatar}" alt="${member.name}" class="w-10 h-10 rounded-full mr-4">
                    <div>
                        <p class="font-semibold text-gray-800">${member.name}</p>
                        <p class="text-xs text-gray-500">${member.role}</p>
                    </div>
                </div>
                <span class="status-badge ${member.status === 'Available' ? 'status-available' : 'status-absent'}">
                    ${member.status}
                </span>
            </div>
        `).join('');
    }

    function renderTasks() {
        taskList.innerHTML = taskData.map(task => `
            <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${task.task}</td>
                <td class="px-6 py-4"><span class="status-badge status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span></td>
                <td class="px-6 py-4">${task.manager}</td>
                <td class="px-6 py-4"><div class="progress-bar-container"><div class="progress-bar" style="width: ${task.progress}%"></div></div></td>
                <td class="px-6 py-4">${task.document ? '<i data-lucide="file-text" class="w-5 h-5 text-gray-400"></i>' : ''}</td>
                <td class="px-6 py-4"><a href="#" class="font-medium text-blue-600 hover:underline">Details</a></td>
            </tr>
        `).join('');
        lucide.createIcons();
    }

    renderTeam();
    renderTasks();


    // ========= TODO LIST SCRIPT (NEW) =========
    const newTodoInput = document.getElementById('newTodoInput');
    const newTodoPriority = document.getElementById('newTodoPriority');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoListContainer = document.getElementById('todoListContainer');

    let todos = [
        { text: 'Buy groceries', completed: false, priority: 'normal' },
        { text: 'Finish project report', completed: false, priority: 'high' },
        { text: 'Clean the house', completed: true, priority: 'low' },
        { text: 'Call the bank', completed: false, priority: 'normal' },
        { text: 'Read a book', completed: false, priority: 'low' },
        { text: 'Schedule doctor appointment', completed: false, priority: 'high' },
    ];

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return '<i data-lucide="arrow-up" class="w-4 h-4 mr-1 text-red-500"></i>';
            case 'low': return '<i data-lucide="arrow-down" class="w-4 h-4 mr-1 text-green-500"></i>';
            default: return '<i data-lucide="minus" class="w-4 h-4 mr-1 text-gray-500"></i>';
        }
    };

    function renderTodos() {
        todoListContainer.innerHTML = '';
        if (todos.length === 0) {
            todoListContainer.innerHTML = `<p class="text-gray-500 text-sm text-center">No tasks yet. Add one above!</p>`;
            return;
        }

        todos.forEach((todo, index) => {
            const todoEl = document.createElement('div');
            todoEl.className = 'flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:bg-gray-50';
            todoEl.innerHTML = `
                <div class="flex items-center min-w-0">
                    <i data-lucide="grip-vertical" class="w-5 h-5 text-gray-400 cursor-grab mr-2 shrink-0"></i>
                    <input type="checkbox" id="todo-${index}" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3 shrink-0" ${todo.completed ? 'checked' : ''}>
                    <label for="todo-${index}" class="text-sm text-gray-700 truncate ${todo.completed ? 'line-through text-gray-400' : ''}" title="${todo.text}">${todo.text}</label>
                </div>
                <div class="flex items-center shrink-0 ml-2">
                    <div class="flex items-center text-sm mr-4 priority-${todo.priority}">
                        ${getPriorityIcon(todo.priority)}
                        <span>${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>
                    </div>
                    <button class="delete-btn text-gray-400 hover:text-red-500" data-index="${index}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            todoListContainer.appendChild(todoEl);
        });
        lucide.createIcons();
    }
    
    function addTask() {
        const taskText = newTodoInput.value.trim();
        const priority = newTodoPriority.value;
        if (taskText) {
            todos.unshift({ text: taskText, completed: false, priority: priority });
            newTodoInput.value = '';
            renderTodos();
        }
    }

    addTodoBtn.addEventListener('click', addTask);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    todoListContainer.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') {
            const index = parseInt(e.target.id.split('-')[1]);
            todos[index].completed = e.target.checked;
            renderTodos();
        }

        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const index = parseInt(deleteButton.dataset.index);
            todos.splice(index, 1);
            renderTodos();
        }
    });

    renderTodos();

});

