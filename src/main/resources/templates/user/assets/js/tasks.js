document.addEventListener("DOMContentLoaded", function() {
    // --- Sample Data ---
    const allTasksData = [
        { id: 1, taskNumber: "TASK-01", project: "PHP Website", client: "Cara Stevens", status: "Open", priority: "Medium", type: "Development", executor: "Cara Stevens", date: "2018-03-22", details: "Initial setup of the project environment." },
        { id: 2, taskNumber: "TASK-14", project: "IOS App", client: "Airi Satou", status: "Open", priority: "Medium", type: "Bug", executor: "Airi Satou", date: "2018-10-12", details: "Fix login button crash on iOS 12." },
        { id: 3, taskNumber: "TASK-25", project: "ERP System", client: "Angelica Ra...", status: "Closed", priority: "High", type: "Error", executor: "Angelica Ra...", date: "2018-01-14", details: "Database connection error on the main server." },
        { id: 4, taskNumber: "TASK-17", project: "Angular Ad...", client: "Ashton Cox", status: "Closed", priority: "Low", type: "Bug", executor: "John Doe", date: "2018-04-17", details: "UI glitch in the admin dashboard." },
        { id: 5, taskNumber: "TASK-16", project: "PHP Website", client: "Airi Satou", status: "Open", priority: "Medium", type: "Development", executor: "Ashton Cox", date: "2018-05-20", details: "Implement the new user profile page." },
        { id: 6, taskNumber: "TASK-22", project: "Angular Ad...", client: "Angelica Ra...", status: "Closed", priority: "High", type: "Error", executor: "Angelica Ra...", date: "2018-05-19", details: "Critical security vulnerability in the authentication module." },
        { id: 7, taskNumber: "TASK-38", project: "IOS App", client: "Cara Stevens", status: "Open", priority: "Low", type: "Bug", executor: "Cara Stevens", date: "2018-02-19", details: "Push notifications are not being delivered." },
        { id: 8, taskNumber: "TASK-74", project: "Logo Design", client: "Ashton Cox", status: "Open", priority: "Medium", type: "Bug", executor: "Airi Satou", date: "2018-04-11", details: "Exported logo has incorrect color profile." },
    ];

    let tasksData = [...allTasksData];

    // --- DOM Elements ---
    const tableBody = document.getElementById('tasks-table-body');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const addTaskBtn = document.getElementById('addTaskBtn');

    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    let taskToDeleteId = null;

    // Add/Edit Modal
    const taskModal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    const taskForm = document.getElementById('taskForm');
    let currentTaskId = null; // null for 'Add', number for 'Edit'

    // --- Functions ---
    const renderTable = () => {
        tableBody.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = tasksData.filter(item => 
            Object.values(item).some(val => val.toString().toLowerCase().includes(searchTerm))
        );

        if (filteredData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" class="text-center p-8 text-gray-500">No tasks found</td></tr>`;
            return;
        }

        filteredData.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            const formattedDate = new Date(item.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

            row.innerHTML = `
                <td class="p-4"><input type="checkbox" class="rounded border-gray-300"></td>
                <td class="p-4">${item.taskNumber}</td>
                <td class="p-4 font-semibold text-gray-800">${item.project}</td>
                <td class="p-4">${item.client}</td>
                <td class="p-4"><span class="badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                <td class="p-4"><span class="badge priority-${item.priority.toLowerCase()}">${item.priority}</span></td>
                <td class="p-4">${item.type}</td>
                <td class="p-4">${item.executor}</td>
                <td class="p-4">${formattedDate}</td>
                <td class="p-4">
                    <div class="flex items-center gap-2">
                        <button class="action-btn action-btn-edit" title="Edit" data-id="${item.id}"><i data-lucide="edit-2"></i></button>
                        <button class="action-btn action-btn-delete" title="Delete" data-id="${item.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        lucide.createIcons();
    };

    // --- Modal Handling ---
    const openTaskModal = (mode, id = null) => {
        taskForm.reset();
        if (mode === 'edit') {
            currentTaskId = id;
            const task = tasksData.find(t => t.id === id);
            if(task) {
                modalTitle.textContent = `Edit Task - ${task.taskNumber}`;
                document.getElementById('taskNo').value = task.taskNumber;
                document.getElementById('project').value = task.project;
                document.getElementById('client').value = task.client;
                document.getElementById('status').value = task.status;
                document.getElementById('priority').value = task.priority;
                document.getElementById('type').value = task.type;
                document.getElementById('executor').value = task.executor;
                document.getElementById('date').value = task.date;
                document.getElementById('details').value = task.details || '';
            }
        } else {
            currentTaskId = null;
            modalTitle.textContent = 'Add New Task';
        }
        taskModal.classList.remove('hidden');
        taskModal.classList.add('flex');
        lucide.createIcons();
    };

    const closeTaskModal = () => {
        taskModal.classList.add('hidden');
        taskModal.classList.remove('flex');
    };

    const handleSaveTask = (e) => {
        e.preventDefault();
        const formData = {
            taskNumber: document.getElementById('taskNo').value,
            project: document.getElementById('project').value,
            client: document.getElementById('client').value,
            status: document.getElementById('status').value,
            priority: document.getElementById('priority').value,
            type: document.getElementById('type').value,
            executor: document.getElementById('executor').value,
            date: document.getElementById('date').value,
            details: document.getElementById('details').value,
        };

        if (currentTaskId) { // Editing existing task
            const taskIndex = tasksData.findIndex(t => t.id === currentTaskId);
            if (taskIndex > -1) {
                tasksData[taskIndex] = { ...tasksData[taskIndex], ...formData };
            }
        } else { // Adding new task
            const newId = tasksData.length > 0 ? Math.max(...tasksData.map(t => t.id)) + 1 : 1;
            tasksData.push({ id: newId, ...formData });
        }
        renderTable();
        closeTaskModal();
    };

    const openDeleteModal = (id) => {
        taskToDeleteId = id;
        deleteModal.classList.remove('hidden');
        deleteModal.classList.add('flex');
        lucide.createIcons();
    };

    const closeDeleteModal = () => {
        taskToDeleteId = null;
        deleteModal.classList.add('hidden');
        deleteModal.classList.remove('flex');
    };
    
    const handleDeleteTask = () => {
        if (taskToDeleteId) {
            tasksData = tasksData.filter(task => task.id !== taskToDeleteId);
            renderTable();
            closeDeleteModal();
        }
    };
    
    // --- General Functions ---
    const handleRefresh = () => { /* ... (existing code) ... */ };
    const handleDownload = () => { /* ... (existing code) ... */ };

    // --- Event Listeners ---
    searchInput.addEventListener('input', renderTable);
    refreshBtn.addEventListener('click', handleRefresh);
    downloadBtn.addEventListener('click', handleDownload);
    addTaskBtn.addEventListener('click', () => openTaskModal('add'));
    
    tableBody.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.action-btn-delete');
        const editButton = e.target.closest('.action-btn-edit');
        
        if (deleteButton) {
            const id = parseInt(deleteButton.dataset.id);
            openDeleteModal(id);
        } else if (editButton) {
            const id = parseInt(editButton.dataset.id);
            openTaskModal('edit', id);
        }
    });

    // Modal listeners
    taskForm.addEventListener('submit', handleSaveTask);
    closeModalBtn.addEventListener('click', closeTaskModal);
    cancelTaskBtn.addEventListener('click', closeTaskModal);
    confirmDeleteBtn.addEventListener('click', handleDeleteTask);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeTaskModal();
    });


    // --- Initial Load ---
    lucide.createIcons();
    renderTable();
});

