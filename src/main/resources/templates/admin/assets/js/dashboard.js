document.addEventListener('DOMContentLoaded', () => {

    // Initialize Feather Icons
    feather.replace();

    // --- Sidebar Toggle for Mobile ---
    const sidebar = document.getElementById('sidebar');
    const menuOpenBtn = document.getElementById('menu-btn-open');
    const menuCloseBtn = document.getElementById('menu-btn-close');

    if (menuOpenBtn) {
        menuOpenBtn.addEventListener('click', () => {
            sidebar.classList.add('show');
        });
    }

    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('show');
        });
    }

    // --- Chart.js Implementations ---

    // Generic function to create small trend line charts
    const createTrendChart = (elementId, data, color) => {
        const ctx = document.getElementById(elementId).getContext('2d');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    data: data,
                    borderColor: color,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    };

    // Create KPI charts
    createTrendChart('timeToHireChart', [22, 21, 23, 20, 19, 18], '#dc3545'); // red
    createTrendChart('turnoverChart', [3.5, 3.8, 3.6, 4.0, 4.1, 4.2], '#198754'); // green
    createTrendChart('completionChart', [80, 82, 81, 85, 84, 87], '#0d6efd'); // blue

    // Department Distribution Pie Chart
    const pieCtx = document.getElementById('departmentPieChart')?.getContext('2d');
    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['HR', 'Engineering', 'Marketing', 'Finance', 'Operations', 'Others'],
                datasets: [{
                    label: 'Department Distribution',
                    data: [14, 78, 42, 30, 65, 26],
                    backgroundColor: [
                        '#dc3545', // red
                        '#0d6efd', // blue
                        '#ffc107', // yellow
                        '#6f42c1', // purple
                        '#fd7e14', // orange
                        '#6c757d'  // grey
                    ],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Weekly Attendance Bar Chart
    const weeklyCtx = document.getElementById('weeklyAttendanceChart')?.getContext('2d');
    if (weeklyCtx) {
        new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [
                    {
                        label: 'Present',
                        data: [225, 220, 215, 218, 210],
                        backgroundColor: '#198754', // green
                        borderWidth: 0,
                        borderRadius: 4,
                    },
                    {
                        label: 'Absent',
                        data: [10, 12, 15, 11, 14],
                        backgroundColor: '#dc3545', // red
                        borderWidth: 0,
                        borderRadius: 4,
                    },
                    {
                        label: 'Late',
                        data: [15, 8, 10, 12, 6],
                        backgroundColor: '#fd7e14', // orange
                        borderWidth: 0,
                        borderRadius: 4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // --- Projects Table Interactivity ---
    const projectsTableBody = document.querySelector('.projects-card tbody');
    const editModal = document.getElementById('editProjectModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editForm = document.getElementById('editProjectForm');
    
    // Store the row being edited
    let editingRow = null;

    if (projectsTableBody) {
        projectsTableBody.addEventListener('click', (e) => {
            // Target the SVG icon itself, which is what Feather Icons creates
            const icon = e.target.closest('svg'); 
            if (!icon) return;

            const row = icon.closest('tr');
            if (!row) return;

            // --- Delete Action ---
            // Check the class name on the SVG
            if (icon.classList.contains('feather-trash-2')) {
                // In a real application, you would add a confirmation dialog.
                row.remove();
            }

            // --- Edit Action ---
            // Check the class name on the SVG
            if (icon.classList.contains('feather-edit-2')) {
                editingRow = row;
                const cells = editingRow.querySelectorAll('td');

                // Extract data from the row
                const projectName = cells[0].textContent;
                const teamLeaders = cells[2].textContent;
                const priority = cells[3].querySelector('span').textContent.toLowerCase();
                const status = cells[6].querySelector('span').textContent.toLowerCase().replace(' ', '-');

                // Populate the modal
                document.getElementById('editProjectName').value = projectName;
                document.getElementById('editTeamLeaders').value = teamLeaders;
                document.getElementById('editPriority').value = priority;
                document.getElementById('editStatus').value = status;
                
                // Show the modal
                editModal.classList.remove('hidden');
            }
        });
    }

    const hideModal = () => {
        if (editModal) {
            editModal.classList.add('hidden');
        }
        editingRow = null; // Clear the editing state
    };
    
    // --- Modal Controls ---
    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', hideModal);
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            // Close if backdrop is clicked
            if (e.target === editModal) {
                hideModal();
            }
        });
    }

    // --- Form Submission ---
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!editingRow) return;

            // Get new values from the form
            const newProjectName = document.getElementById('editProjectName').value;
            const newTeamLeaders = document.getElementById('editTeamLeaders').value;
            const newPriorityValue = document.getElementById('editPriority').value;
            const newStatusValue = document.getElementById('editStatus').value;

            // Get the span elements to update
            const prioritySpan = editingRow.querySelector('.priority');
            const statusSpan = editingRow.querySelector('.status');
            
            // Update cell content
            editingRow.querySelectorAll('td')[0].textContent = newProjectName;
            editingRow.querySelectorAll('td')[2].textContent = newTeamLeaders;
            
            // Update priority span (text and class)
            prioritySpan.textContent = newPriorityValue.charAt(0).toUpperCase() + newPriorityValue.slice(1);
            prioritySpan.className = `priority ${newPriorityValue}`; 

            // Update status span (text and class)
            const statusText = newStatusValue.replace('-', ' ');
            statusSpan.textContent = statusText.replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
            statusSpan.className = `status ${newStatusValue}`;

            hideModal();
        });
    }
});

