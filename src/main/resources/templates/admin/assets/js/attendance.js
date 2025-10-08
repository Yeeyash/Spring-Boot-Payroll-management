document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Feather Icons ---
    feather.replace();

    // --- Modal Handling ---
    const editModal = document.getElementById('editAttendanceModal');
    const addAttendanceBtn = document.getElementById('addAttendanceBtn');
    let currentRowToEdit = null;

    const showModal = (modal) => modal.classList.remove('hidden');
    const hideModal = (modal) => {
        modal.classList.add('hidden');
        modal.querySelector('form')?.reset();
    };

    if (addAttendanceBtn) {
        addAttendanceBtn.addEventListener('click', () => {
            // In a real app, this would likely be a different, simpler modal
            // or an automated process. We'll reuse the edit modal for demonstration.
            alert("Adding attendance records manually is not standard. This would typically be an automated process. Use the edit button on a row to see the modal.");
        });
    }

    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal || e.target.closest('.btn-secondary, .modal-header button')) {
                e.preventDefault();
                hideModal(editModal);
            }
        });
    }

    // --- Table & Pagination Variables ---
    const table = document.getElementById('attendanceTable');
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


    // --- Table Actions (Edit/Delete) ---
    if (table) {
        table.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-btn');
            const editBtn = e.target.closest('.edit-btn');

            if (deleteBtn) {
                const row = deleteBtn.closest('tr');
                if (confirm('Are you sure you want to delete this attendance record?')) {
                    row.remove();
                    updateTableDisplay(); // Update pagination after deleting
                }
            }
            
            if (editBtn) {
                currentRowToEdit = editBtn.closest('tr');
                const cells = currentRowToEdit.querySelectorAll('td');
                
                document.getElementById('editEmployeeNameText').textContent = cells[1].querySelector('span').textContent;
                document.getElementById('editFirstIn').value = cells[2].textContent;
                document.getElementById('editBreak').value = cells[3].textContent;
                document.getElementById('editLastOut').value = cells[4].textContent;
                document.getElementById('editStatus').value = cells[6].textContent.toLowerCase();
                document.getElementById('editShift').value = cells[7].textContent;

                showModal(editModal);
            }
        });
    }

    // --- Save Edited Attendance ---
    const editAttendanceForm = document.getElementById('editAttendanceForm');
    if (editAttendanceForm) {
        editAttendanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentRowToEdit) return;

            const firstIn = document.getElementById('editFirstIn').value;
            const lastOut = document.getElementById('editLastOut').value;
            const breakTime = document.getElementById('editBreak').value;
            
            // Calculate total hours
            let totalHours = "00:00";
            if(firstIn && lastOut) {
                const start = new Date(`1970-01-01T${firstIn}:00`);
                const end = new Date(`1970-01-01T${lastOut}:00`);
                let diffMs = end - start;
                
                if (breakTime.includes(':')) {
                    const [bh, bm] = breakTime.split(':').map(Number);
                    const breakMs = (bh * 60 * 60 * 1000) + (bm * 60 * 1000);
                    diffMs -= breakMs;
                }

                const hours = Math.floor(diffMs / 3600000).toString().padStart(2, '0');
                const minutes = Math.floor((diffMs % 3600000) / 60000).toString().padStart(2, '0');
                totalHours = `${hours}:${minutes}`;
            }

            const newStatus = document.getElementById('editStatus').value;
            
            const cells = currentRowToEdit.querySelectorAll('td');
            cells[2].textContent = firstIn;
            cells[3].textContent = breakTime;
            cells[4].textContent = lastOut;
            cells[5].textContent = totalHours;
            cells[6].innerHTML = `<span class="pill pill-${newStatus}">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span>`;
            cells[7].textContent = document.getElementById('editShift').value;

            hideModal(editModal);
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
            // After filtering, reset to page 1 and update display
            if(filter === '') {
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
            link.download = "attendance.csv";
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
