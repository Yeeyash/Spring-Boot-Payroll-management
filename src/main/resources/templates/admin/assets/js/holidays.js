document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Feather Icons ---
    feather.replace();

    // --- Modal Handling ---
    const modal = document.getElementById('holidayModal');
    const addHolidayBtn = document.getElementById('addHolidayBtn');
    const modalTitle = document.getElementById('modalTitle');
    const holidayForm = document.getElementById('holidayForm');
    let currentRowToEdit = null;
    let isEditMode = false;

    const showModal = (edit = false) => {
        isEditMode = edit;
        modalTitle.textContent = isEditMode ? 'Edit Holiday' : 'Add Holiday';
        modal.classList.remove('hidden');
    };
    const hideModal = () => {
        modal.classList.add('hidden');
        holidayForm.reset();
        currentRowToEdit = null;
    };

    if (addHolidayBtn) addHolidayBtn.addEventListener('click', () => showModal(false));
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('#closeModalBtn, #cancelBtn')) {
                 e.preventDefault();
                 hideModal();
            }
        });
    }

    // --- Table & Pagination Variables ---
    const table = document.getElementById('holidaysTable');
    const tableBody = table?.querySelector('tbody');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    let currentPage = 1;
    let itemsPerPage = 10;

    // --- Pagination Logic ---
    function updateTableDisplay() {
        if (!tableBody) return;
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        const totalItems = rows.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        currentPage = Math.max(1, Math.min(currentPage, totalPages));

        rows.forEach(row => row.style.display = 'none');

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        rows.slice(start, end).forEach(row => row.style.display = '');

        pageInfo.textContent = `${start + 1} - ${Math.min(end, totalItems)} of ${totalItems}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalItems === 0;
    }
    
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value, 10);
            currentPage = 1;
            updateTableDisplay();
        });
    }
    if(prevPageBtn) prevPageBtn.addEventListener('click', () => { currentPage--; updateTableDisplay(); });
    if(nextPageBtn) nextPageBtn.addEventListener('click', () => { currentPage++; updateTableDisplay(); });


    // --- Form Submission (Add/Edit) ---
    if (holidayForm) {
        holidayForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('holidayName').value;
            const shift = document.getElementById('holidayShift').value;
            const date = new Date(document.getElementById('holidayDate').value).toLocaleDateString('en-US');
            const type = document.getElementById('holidayType').value;
            const status = document.getElementById('approvalStatus').value;
            const details = document.getElementById('holidayDetails').value;
            
            if (isEditMode && currentRowToEdit) {
                // Update existing row
                const cells = currentRowToEdit.querySelectorAll('td');
                cells[1].textContent = name;
                cells[2].textContent = shift;
                cells[3].textContent = date;
                cells[4].textContent = type;
                cells[7].innerHTML = `<span class="pill pill-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
                cells[8].textContent = details;
            } else {
                // Add new row
                const newRow = tableBody.insertRow();
                newRow.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox"></td>
                    <td>${name}</td>
                    <td>${shift}</td>
                    <td>${date}</td>
                    <td>${type}</td>
                    <td>Admin</td>
                    <td>${new Date().toLocaleDateString('en-US')}</td>
                    <td><span class="pill pill-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                    <td>${details}</td>
                    <td><div class="action-icons"><i data-feather="edit-2" class="edit-btn"></i><i data-feather="trash-2" class="delete-btn"></i></div></td>
                `;
                feather.replace();
            }
            
            updateTableDisplay();
            hideModal();
        });
    }

    // --- Table Actions (Edit/Delete) ---
    if (table) {
        table.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-btn');
            const editBtn = e.target.closest('.edit-btn');

            if (deleteBtn) {
                const row = deleteBtn.closest('tr');
                if (confirm('Are you sure you want to delete this holiday?')) {
                    row.remove();
                    updateTableDisplay();
                }
            }
            
            if (editBtn) {
                currentRowToEdit = editBtn.closest('tr');
                const cells = currentRowToEdit.querySelectorAll('td');
                
                const dateParts = cells[3].textContent.split('/');
                const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
                
                document.getElementById('holidayName').value = cells[1].textContent;
                document.getElementById('holidayShift').value = cells[2].textContent;
                document.getElementById('holidayDate').value = formattedDate;
                document.getElementById('holidayType').value = cells[4].textContent;
                document.getElementById('approvalStatus').value = cells[7].textContent.toLowerCase();
                document.getElementById('holidayDetails').value = cells[8].textContent;
                
                showModal(true);
            }
        });
    }
    
    // --- Search, Download, Checkbox ---
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const filter = searchInput.value.toUpperCase();
            const rows = tableBody.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                rows[i].style.display = rows[i].textContent.toUpperCase().indexOf(filter) > -1 ? "" : "none";
            }
            if (filter === '') {
                currentPage = 1;
                updateTableDisplay();
            }
        });
    }

    const downloadCsvBtn = document.getElementById('downloadCsvBtn');
    if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener('click', () => {
            let csv = [];
            for (let i = 0; i < table.rows.length; i++) {
                let row = [], cols = table.rows[i].querySelectorAll("td, th");
                for (let j = 1; j < cols.length - 1; j++) {
                    row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
                }
                csv.push(row.join(","));
            }
            const link = document.createElement("a");
            link.href = URL.createObjectURL(new Blob([csv.join("\n")], { type: "text/csv" }));
            link.download = "holidays.csv";
            link.click();
        });
    }
    
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if(selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = this.checked);
        });
    }
    
    // Initial display update
    updateTableDisplay();
});
