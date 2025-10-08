document.addEventListener('DOMContentLoaded', () => {

    // Initialize Feather Icons
    feather.replace();

    // --- Modal Handling ---
    const addProjectFab = document.getElementById('addProjectFab');
    const addModal = document.getElementById('addProjectModal');
    const closeAddModalBtn = document.getElementById('closeAddModalBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const addProjectForm = document.getElementById('addProjectForm');
    const newProjectsColumn = document.getElementById('new-projects-col').querySelector('.project-cards');

    const showModal = () => {
        addModal.classList.remove('hidden');
    };

    const hideModal = () => {
        addModal.classList.add('hidden');
        addProjectForm.reset();
    };

    if (addProjectFab) {
        addProjectFab.addEventListener('click', showModal);
    }
    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener('click', hideModal);
    }
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', hideModal);
    }
    // Close modal if backdrop is clicked
    if (addModal) {
        addModal.addEventListener('click', (e) => {
            if (e.target === addModal) {
                hideModal();
            }
        });
    }

    // --- Form Submission ---
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Get values from the form
            const projectName = document.getElementById('projectName').value;
            const description = document.getElementById('projectDescription').value;
            const teamLeader = document.getElementById('teamLeader').value;
            const priority = document.getElementById('priority').value;
            const deadline = document.getElementById('deadline').value;

            // Format deadline for display
            const formattedDeadline = new Date(deadline).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            const today = new Date().toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            // 2. Create the new project card HTML
            const newCard = document.createElement('div');
            newCard.className = 'project-card';
            newCard.innerHTML = `
                <div class="card-header">
                    <h4>${projectName}</h4>
                    <span class="tag tag-purple">New</span>
                </div>
                <p class="open-tasks"><i data-feather="check-circle" class="w-4 h-4"></i> 0 open tasks</p>
                <p class="description">${description}</p>
                <div class="details">
                    <p><span>Created:</span> ${today}</p>
                    <p><span>Team Leader:</span> ${teamLeader}</p>
                    <p><span>Priority:</span> <span class="priority ${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span></p>
                    <p><span>Deadline:</span> ${formattedDeadline}</p>
                </div>
            `;

            // 3. Append the new card to the "New Projects" column
            if (newProjectsColumn) {
                newProjectsColumn.appendChild(newCard);
            }

            // 4. Re-initialize Feather Icons
            feather.replace();

            // 5. Hide the modal
            hideModal();
        });
    }
});
