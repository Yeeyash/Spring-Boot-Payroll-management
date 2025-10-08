document.addEventListener("DOMContentLoaded", function() {
    // --- Sample Data ---
    const allProjectsData = [
        { id: 258, title: "Android App", client: "Cara Stevens", startDate: "05/10/2021", endDate: "07/25/2021", deadline: "08/25/2021", members: ['AS', 'JC', 'MT', 'SS', 'JD'], priority: "High", progress: 80, status: "Active", comments: 25, bugs: 11, details: "God creature is sixth was abundantly and sea gathered. Every is fruitful multiply from, fill appear don't lesser darkness all may cattle." },
        { id: 578, title: "PHP website", client: "Sarah Smith", startDate: "02/22/2021", endDate: "04/12/2021", deadline: "05/10/2021", members: ['MT', 'JS', 'SS'], priority: "Low", progress: 50, status: "Deactive", comments: 10, bugs: 5, details: "A PHP-based e-commerce platform with a custom CMS. The project required extensive backend work and integration with third-party payment gateways." },
        { id: 267, title: "Logo Design", client: "John Deo", startDate: "01/05/2021", endDate: "03/15/2021", deadline: "04/24/2021", members: ['JD', 'MT'], priority: "High", progress: 30, status: "Active", comments: 8, bugs: 2, details: "Rebranding project for a major client. Included logo variations, a brand style guide, and marketing collateral mockups." },
        { id: 114, title: "Chat IOS app", client: "Pooja Sharma", startDate: "05/17/2021", endDate: "08/11/2021", deadline: "09/13/2021", members: ['PS', 'AC'], priority: "Medium", progress: 95, status: "Active", comments: 42, bugs: 1, details: "A real-time chat application for iOS using Swift and Firebase. Features include push notifications, image sharing, and group chats." },
        { id: 109, title: "Nursary App", client: "Ashton Cox", startDate: "04/19/2021", endDate: "06/28/2021", deadline: "06/30/2021", members: ['AC'], priority: "High", progress: 60, status: "Deactive", comments: 15, bugs: 9, details: "A management application for a local nursery, handling inventory, sales, and customer records." },
        { id: 367, title: "Html static...", client: "Sarah Smith", startDate: "05/10/2021", endDate: "06/17/2021", deadline: "06/24/2021", members: ['SS', 'MT'], priority: "Medium", progress: 20, status: "Deactive", comments: 3, bugs: 0, details: "Development of a 5-page static marketing website. The focus was on responsive design and fast load times." },
        { id: 865, title: "Accounting...", client: "Pooja Sharma", startDate: "05/19/2021", endDate: "06/20/2021", deadline: "07/01/2021", members: ['PS', 'JS', 'AS'], priority: "Low", progress: 75, status: "Active", comments: 22, bugs: 7, details: "Custom accounting software for a small business to track expenses, generate invoices, and create financial reports." },
    ];

    let filteredData = [...allProjectsData];
    let currentPage = 1;
    let itemsPerPage = 10;

    // --- DOM Elements ---
    const tableBody = document.getElementById('projects-table-body');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const projectModal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // --- Functions ---
    const renderTable = () => {
        tableBody.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        const searchTerm = searchInput.value.toLowerCase();
        filteredData = allProjectsData.filter(item => 
            Object.values(item).some(val => val.toString().toLowerCase().includes(searchTerm))
        );

        const paginatedItems = filteredData.slice(start, end);

        if (paginatedItems.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" class="text-center p-8 text-gray-500">No projects found</td></tr>`;
        } else {
             paginatedItems.forEach(item => {
                const row = document.createElement('tr');
                row.className = 'border-b hover:bg-gray-50';
                
                const membersHtml = `<div class="flex -space-x-2">` + 
                    item.members.map(m => `<img class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32/E2E8F0/4A5568?text=${m}" alt="member ${m}">`).join('') +
                    `</div>`;

                row.innerHTML = `
                    <td class="p-4">${item.id}</td>
                    <td class="p-4 font-semibold text-blue-600 hover:underline cursor-pointer project-title" data-id="${item.id}">${item.title}</td>
                    <td class="p-4">${item.client}</td>
                    <td class="p-4">${item.startDate}</td>
                    <td class="p-4">${item.endDate}</td>
                    <td class="p-4">${item.deadline}</td>
                    <td class="p-4">${membersHtml}</td>
                    <td class="p-4"><span class="badge priority-${item.priority.toLowerCase()}">${item.priority}</span></td>
                    <td class="p-4">
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${item.progress}%"></div>
                        </div>
                    </td>
                    <td class="p-4"><span class="badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                `;
                tableBody.appendChild(row);
            });
        }
        updatePaginationControls();
    };
    
    const openModalWithProject = (id) => {
        const project = allProjectsData.find(p => p.id === id);
        if (!project) return;

        modalTitle.textContent = project.title;

        const membersHtml = `<div class="flex items-center -space-x-2">` +
            project.members.slice(0, 4).map(m => `<img class="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32/E2E8F0/4A5568?text=${m}" alt="member ${m}">`).join('') +
            (project.members.length > 4 ? `<a href="#" class="flex items-center justify-center h-8 w-8 text-xs font-medium text-white bg-gray-700 rounded-full hover:bg-gray-600 ring-2 ring-white">+${project.members.length - 4}</a>` : '') +
            `</div>`;

        modalBody.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div><span class="font-semibold text-gray-500">Client Name:</span> <span class="text-gray-800">${project.client}</span></div>
                <div><span class="font-semibold text-gray-500">Comments:</span> <span class="text-gray-800">${project.comments}</span></div>
                <div><span class="font-semibold text-gray-500">Project Start Date:</span> <span class="text-gray-800">${project.startDate}</span></div>
                <div><span class="font-semibold text-gray-500">Bug:</span> <span class="text-gray-800">${project.bugs}</span></div>
                <div><span class="font-semibold text-gray-500">Project End Date:</span> <span class="text-gray-800">${project.endDate}</span></div>
                <div class="col-span-2 md:col-span-1">
                    <span class="font-semibold text-gray-500">Progress:</span>
                    <div class="progress-bar-container mt-1">
                        <div class="progress-bar" style="width: ${project.progress}%"></div>
                    </div>
                </div>
                <div><span class="font-semibold text-gray-500">Project DeadLine:</span> <span class="text-gray-800">${project.deadline}</span></div>
                <div><span class="font-semibold text-gray-500">Status:</span> <span class="badge status-${project.status.toLowerCase()}">${project.status}</span></div>
                <div class="flex items-center gap-2"><span class="font-semibold text-gray-500">Team:</span> ${membersHtml}</div>
                <div><span class="font-semibold text-gray-500">Priority:</span> <span class="badge priority-${project.priority.toLowerCase()}">${project.priority}</span></div>
                 <div class="col-span-2">
                     <p class="font-semibold text-gray-500">Project Details:</p>
                     <p class="text-gray-700 mt-1 leading-relaxed">${project.details}</p>
                </div>
            </div>
        `;
        projectModal.classList.remove('hidden');
        projectModal.classList.add('flex');
        lucide.createIcons();
    };

    const closeModal = () => {
        projectModal.classList.add('hidden');
        projectModal.classList.remove('flex');
    };

    const updatePaginationControls = () => {
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        
        pageInfo.textContent = `${startItem} - ${endItem} of ${totalItems}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalItems === 0;
    };
    
    const handleRefresh = () => {
        const icon = refreshBtn.querySelector('i');
        icon.classList.add('refreshing');
        refreshBtn.disabled = true;

        setTimeout(() => {
            searchInput.value = '';
            currentPage = 1;
            renderTable();
            icon.classList.remove('refreshing');
            refreshBtn.disabled = false;
        }, 1000);
    };

    const handleDownload = () => {
        const headers = ["ID", "Project Title", "Client Name", "Start Date", "End Date", "Deadline", "Priority", "Progress", "Status"];
        const dataToExport = allProjectsData.map(item => [item.id, item.title, item.client, item.startDate, item.endDate, item.deadline, item.priority, `${item.progress}%`, item.status]);
        const csvContent = [ headers.join(','), ...dataToExport.map(row => row.map(field => `"${field}"`).join(',')) ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'projects.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Event Listeners ---
    searchInput.addEventListener('input', () => { currentPage = 1; renderTable(); });
    refreshBtn.addEventListener('click', handleRefresh);
    downloadBtn.addEventListener('click', handleDownload);

    itemsPerPageSelect.addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderTable();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderTable(); }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) { currentPage++; renderTable(); }
    });
    
    tableBody.addEventListener('click', (e) => {
        const title = e.target.closest('.project-title');
        if (title) {
            const projectId = parseInt(title.dataset.id);
            openModalWithProject(projectId);
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) { closeModal(); }
    });

    // --- Initial Load ---
    lucide.createIcons();
    renderTable();
});

