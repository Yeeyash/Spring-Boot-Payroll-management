document.addEventListener("DOMContentLoaded", function() {
    // --- Sample Data ---
    let allLeavesData = [
        { id: 1, appDate: "2019-02-22", fromDate: "2019-02-22", toDate: "2019-02-26", halfDay: "Yes", type: "Casual Leave", status: "Approved", reason: "Lorem ipsum i..." },
        { id: 2, appDate: "2019-02-17", fromDate: "2019-02-22", toDate: "2019-02-26", halfDay: "Yes", type: "Sick Leave", status: "Rejected", reason: "Lorem ipsum i..." },
        { id: 3, appDate: "2019-02-17", fromDate: "2019-02-22", toDate: "2019-02-26", halfDay: "No", type: "Sick Leave", status: "Rejected", reason: "Lorem ipsum i..." },
        { id: 4, appDate: "2019-05-11", fromDate: "2019-03-17", toDate: "2019-03-26", halfDay: "No", type: "Casual Leave", status: "Pending", reason: "Lorem ipsum i..." },
        { id: 5, appDate: "2019-07-15", fromDate: "2019-02-22", toDate: "2019-02-26", halfDay: "No", type: "Casual Leave", status: "Approved", reason: "Lorem ipsum i..." },
        { id: 6, appDate: "2019-02-17", fromDate: "2019-04-22", toDate: "2019-02-26", halfDay: "Yes", type: "Privilege Leave", status: "Pending", reason: "Lorem ipsum i..." },
        { id: 7, appDate: "2019-02-20", fromDate: "2019-02-22", toDate: "2019-02-26", halfDay: "No", type: "Casual Leave", status: "Rejected", reason: "Lorem ipsum i..." },
        { id: 8, appDate: "2019-03-24", fromDate: "2019-02-22", toDate: "2019-02-26", halfDay: "Yes", type: "Marriage Leave", status: "Approved", reason: "Lorem ipsum i..." }
    ];

    let filteredData = [...allLeavesData];
    let currentPage = 1;
    let itemsPerPage = 10;
    let editingLeaveId = null;

    // --- DOM Elements ---
    const tableBody = document.getElementById('leaves-table-body');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const selectAllCheckbox = document.getElementById('selectAll');
    const addLeaveBtn = document.getElementById('addLeaveBtn');
    
    // Modal Elements
    const modalOverlay = document.getElementById('leave-modal-overlay');
    const modal = document.getElementById('leave-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const leaveForm = document.getElementById('leave-form');
    const modalTitle = document.getElementById('modal-title');

    // --- Functions ---
    const formatDateForInput = (dateStr) => {
        if (!dateStr || dateStr.split('/').length !== 3) return '';
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const formatDateForDisplay = (dateStr) => {
        if (!dateStr || dateStr.split('-').length !== 3) return dateStr;
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}/${year}`;
    };
    
    const renderTable = () => {
        tableBody.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        // Recalculate filtered data before rendering
        const searchTerm = searchInput.value.toLowerCase();
        filteredData = allLeavesData.filter(item => {
            return Object.values(item).some(val => 
                val.toString().toLowerCase().includes(searchTerm)
            );
        });

        const paginatedItems = filteredData.slice(start, end);

        if (paginatedItems.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="9" class="text-center p-8 text-gray-500">No data found</td></tr>`;
        } else {
             paginatedItems.forEach(item => {
                const row = document.createElement('tr');
                row.className = 'border-b hover:bg-gray-50';
                const statusClass = `status-${item.status.toLowerCase()}`;
                
                row.innerHTML = `
                    <td class="p-4"><input type="checkbox" class="h-4 w-4 rounded border-gray-300 row-checkbox" data-id="${item.id}"></td>
                    <td class="p-4">${formatDateForDisplay(item.appDate)}</td>
                    <td class="p-4">${formatDateForDisplay(item.fromDate)}</td>
                    <td class="p-4">${formatDateForDisplay(item.toDate)}</td>
                    <td class="p-4">${item.halfDay}</td>
                    <td class="p-4">${item.type}</td>
                    <td class="p-4"><span class="status-badge ${statusClass}">${item.status}</span></td>
                    <td class="p-4">${item.reason}</td>
                    <td class="p-4">
                        <div class="flex items-center gap-2">
                            <button class="text-blue-500 hover:text-blue-700 edit-btn" data-id="${item.id}"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                            <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${item.id}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        lucide.createIcons();
        updatePaginationControls();
        updateSelectAllCheckbox();
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
        const headers = ["Application Date", "From Date", "To Date", "Half Day", "Leave Type", "Status", "Reason"];
        const dataToExport = allLeavesData.map(item => [formatDateForDisplay(item.appDate), formatDateForDisplay(item.fromDate), formatDateForDisplay(item.toDate), item.halfDay, item.type, item.status, item.reason]);
        const csvContent = [ headers.join(','), ...dataToExport.map(row => row.map(field => `"${field}"`).join(',')) ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'leaves.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const updateSelectAllCheckbox = () => {
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');
        const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
        if (rowCheckboxes.length > 0) {
            selectAllCheckbox.checked = checkedCount === rowCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }
    };
    
    const openModal = (leave = null) => {
        leaveForm.reset();
        if (leave) {
            modalTitle.textContent = 'Edit Leave Request';
            editingLeaveId = leave.id;
            document.getElementById('applyDate').value = leave.appDate;
            document.getElementById('fromDate').value = leave.fromDate;
            document.getElementById('toDate').value = leave.toDate;
            document.getElementById('halfDay').value = leave.halfDay;
            document.getElementById('leaveType').value = leave.type;
            document.getElementById('leaveStatus').value = leave.status;
            document.getElementById('reason').value = leave.reason;
        } else {
            modalTitle.textContent = 'Add Leave Request';
            editingLeaveId = null;
        }
        modalOverlay.classList.remove('hidden');
        modal.classList.remove('hidden');
    };

    const closeModal = () => {
        modalOverlay.classList.add('hidden');
        modal.classList.add('hidden');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const newLeaveData = {
            appDate: document.getElementById('applyDate').value,
            fromDate: document.getElementById('fromDate').value,
            toDate: document.getElementById('toDate').value,
            halfDay: document.getElementById('halfDay').value,
            type: document.getElementById('leaveType').value,
            status: document.getElementById('leaveStatus').value,
            reason: document.getElementById('reason').value,
        };

        if (editingLeaveId) {
            allLeavesData = allLeavesData.map(l => l.id === editingLeaveId ? { ...newLeaveData, id: l.id } : l);
        } else {
            newLeaveData.id = Date.now();
            allLeavesData.push(newLeaveData);
        }
        renderTable();
        closeModal();
    };

    // --- Event Listeners ---
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderTable();
    });
    refreshBtn.addEventListener('click', handleRefresh);
    downloadBtn.addEventListener('click', handleDownload);
    addLeaveBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    leaveForm.addEventListener('submit', handleFormSubmit);

    itemsPerPageSelect.addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderTable();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    
    selectAllCheckbox.addEventListener('change', () => {
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    tableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('row-checkbox')) {
            updateSelectAllCheckbox();
        }
    });

    tableBody.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        
        if (editBtn) {
            const leaveId = parseInt(editBtn.dataset.id);
            const leaveToEdit = allLeavesData.find(l => l.id === leaveId);
            openModal(leaveToEdit);
        }

        if (deleteBtn) {
            const leaveId = parseInt(deleteBtn.dataset.id);
            allLeavesData = allLeavesData.filter(l => l.id !== leaveId);
            renderTable();
        }
    });

    // --- Initial Load ---
    lucide.createIcons();
    renderTable();
});

