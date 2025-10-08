document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Feather Icons ---
    feather.replace();

    // --- Modal Handling ---
    const modal = document.getElementById('clientModal');
    const addClientBtn = document.getElementById('addClientBtn');
    const modalTitle = document.getElementById('modalTitle');
    const clientForm = document.getElementById('clientForm');
    let currentRowToEdit = null;
    let isEditMode = false;

    const showModal = (edit = false) => {
        isEditMode = edit;
        modalTitle.textContent = isEditMode ? 'Edit Client' : 'Add Client';
        modal.classList.remove('hidden');
    };
    const hideModal = () => {
        modal.classList.add('hidden');
        clientForm.reset();
        currentRowToEdit = null;
    };

    if (addClientBtn) addClientBtn.addEventListener('click', () => showModal(false));
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('#closeModalBtn, #cancelBtn')) {
                 e.preventDefault();
                 hideModal();
            }
        });
    }

    // --- Table & Pagination Variables ---
    const table = document.getElementById('clientsTable');
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
    if (clientForm) {
        clientForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const clientName = document.getElementById('clientName').value;
            const mobile = document.getElementById('mobile').value;
            const email = document.getElementById('email').value;
            const companyName = document.getElementById('companyName').value;
            const currency = document.getElementById('currency').value;
            const billingMethod = document.getElementById('billingMethod').value;
            const contactPerson = document.getElementById('contactPerson').value;
            const contactPhone = document.getElementById('contactPhone').value;
            const status = document.getElementById('status').value;
            const address = document.getElementById('address').value;
            
            if (isEditMode && currentRowToEdit) {
                // Update existing row
                const cells = currentRowToEdit.querySelectorAll('td');
                cells[1].querySelector('span').textContent = clientName;
                cells[2].textContent = mobile;
                cells[3].textContent = email;
                cells[4].textContent = companyName;
                cells[5].textContent = currency;
                cells[6].textContent = billingMethod;
                cells[7].textContent = contactPerson;
                cells[8].textContent = contactPhone;
                cells[9].innerHTML = `<span class="pill pill-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
                cells[11].textContent = address;
            } else {
                // Add new row
                const newRow = tableBody.insertRow();
                newRow.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox"></td>
                    <td><div class="user-profile"><img src="https://placehold.co/32x32/E2E8F0/4A5568?text=${clientName.charAt(0)}" alt="${clientName}"><span>${clientName}</span></div></td>
                    <td>${mobile}</td>
                    <td>${email}</td>
                    <td>${companyName}</td>
                    <td>${currency}</td>
                    <td>${billingMethod}</td>
                    <td>${contactPerson}</td>
                    <td>${contactPhone}</td>
                    <td><span class="pill pill-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                    <td><i data-feather="file-text" class="doc-icon"></i></td>
                    <td>${address}</td>
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
                if (confirm('Are you sure you want to delete this client?')) {
                    row.remove();
                    updateTableDisplay();
                }
            }
            
            if (editBtn) {
                currentRowToEdit = editBtn.closest('tr');
                const cells = currentRowToEdit.querySelectorAll('td');
                
                document.getElementById('clientName').value = cells[1].querySelector('span').textContent;
                document.getElementById('mobile').value = cells[2].textContent;
                document.getElementById('email').value = cells[3].textContent;
                document.getElementById('companyName').value = cells[4].textContent;
                document.getElementById('currency').value = cells[5].textContent;
                document.getElementById('billingMethod').value = cells[6].textContent;
                document.getElementById('contactPerson').value = cells[7].textContent;
                document.getElementById('contactPhone').value = cells[8].textContent;
                document.getElementById('status').value = cells[9].textContent.toLowerCase();
                document.getElementById('address').value = cells[11].textContent;
                
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
                // Skip checkbox, contract doc, and actions column
                const columnsToSkip = [0, 10, 12]; 
                for (let j = 0; j < cols.length; j++) {
                    if(!columnsToSkip.includes(j)) {
                       row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
                    }
                }
                csv.push(row.join(","));
            }
            const link = document.createElement("a");
            link.href = URL.createObjectURL(new Blob([csv.join("\n")], { type: "text/csv" }));
            link.download = "clients.csv";
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

