document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Feather Icons ---
    feather.replace();

    // --- Modal Handling (Add & Edit) ---
    const addModal = document.getElementById('addLeaveModal');
    const editModal = document.getElementById('editLeaveModal');
    const addLeaveBtn = document.getElementById('addLeaveBtn');
    
    let currentRowToEdit = null;

    const showModal = (modal) => modal.classList.remove('hidden');
    const hideModal = (modal) => {
        modal.classList.add('hidden');
        modal.querySelector('form')?.reset();
    };

    if (addLeaveBtn) addLeaveBtn.addEventListener('click', () => showModal(addModal));
    
    [addModal, editModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.btn-secondary, .modal-header button')) {
                 e.preventDefault();
                 hideModal(modal);
            }
        });
    });

    // --- Add New Leave Request ---
    const addLeaveForm = document.getElementById('addLeaveForm');
    if (addLeaveForm) {
        addLeaveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const tableBody = document.getElementById('leaveTable').querySelector('tbody');
            const newRow = tableBody.insertRow();
            
            const name = document.getElementById('employeeName').value;
            const id = document.getElementById('employeeId').value;
            const department = document.getElementById('department').value;
            const leaveType = document.getElementById('leaveType').value;
            const from = new Date(document.getElementById('leaveFrom').value).toLocaleDateString('en-US');
            const to = new Date(document.getElementById('leaveTo').value).toLocaleDateString('en-US');
            const duration = document.getElementById('durationType').value;
            const reason = document.getElementById('reason').value;

            const fromDate = new Date(document.getElementById('leaveFrom').value);
            const toDate = new Date(document.getElementById('leaveTo').value);
            const diffTime = Math.abs(toDate - fromDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            newRow.innerHTML = `
                <td><input type="checkbox" class="row-checkbox"></td>
                <td><div class="user-profile"><img src="https://placehold.co/32x32/E2E8F0/4A5568?text=${name.charAt(0)}" alt="${name}"><span>${name}</span></div></td>
                <td>${id}</td>
                <td>${department}</td>
                <td>${leaveType}</td>
                <td>${from}</td>
                <td>${to}</td>
                <td>${diffDays}</td>
                <td>${duration}</td>
                <td><span class="pill pill-pending">Pending</span></td>
                <td>${reason}</td>
                <td>${new Date().toLocaleDateString('en-US')}</td>
                <td>-</td>
                <td>-</td>
                <td><div class="action-icons"><i data-feather="edit-2" class="edit-btn"></i><i data-feather="trash-2" class="delete-btn"></i></div></td>
            `;
            
            feather.replace();
            hideModal(addModal);
        });
    }

    // --- Table Actions (Edit/Delete) ---
    const table = document.getElementById('leaveTable');
    if (table) {
        table.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-btn');
            const editBtn = e.target.closest('.edit-btn');

            if (deleteBtn) {
                const row = deleteBtn.closest('tr');
                if (confirm('Are you sure you want to delete this leave request?')) {
                    row.remove();
                }
            }
            
            if (editBtn) {
                currentRowToEdit = editBtn.closest('tr');
                const cells = currentRowToEdit.querySelectorAll('td');
                
                document.getElementById('editEmployeeName').textContent = cells[1].querySelector('span').textContent;
                document.getElementById('editEmployeeId').textContent = cells[2].textContent;
                document.getElementById('editDepartment').textContent = cells[3].textContent;
                document.getElementById('editLeaveType').textContent = cells[4].textContent;
                document.getElementById('editLeaveFrom').textContent = cells[5].textContent;
                document.getElementById('editLeaveTo').textContent = cells[6].textContent;
                document.getElementById('editDurationType').textContent = cells[8].textContent;
                document.getElementById('editReason').textContent = cells[10].textContent;

                const statusText = cells[9].textContent.toLowerCase();
                document.getElementById('editStatus').value = statusText;
                
                const approvedBy = cells[12].textContent;
                document.getElementById('approvedBy').value = approvedBy === '-' ? '' : approvedBy;
                
                showModal(editModal);
            }
        });
    }

    // --- Save Edited Leave Request ---
    const editLeaveForm = document.getElementById('editLeaveForm');
    if (editLeaveForm) {
        editLeaveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentRowToEdit) return;

            const newStatus = document.getElementById('editStatus').value;
            const approver = document.getElementById('approvedBy').value || '-';
            
            const statusCell = currentRowToEdit.querySelector('td:nth-child(10)');
            statusCell.innerHTML = `<span class="pill pill-${newStatus}">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span>`;

            const approvedByCell = currentRowToEdit.querySelector('td:nth-child(13)');
            approvedByCell.textContent = approver;

            const approvalDateCell = currentRowToEdit.querySelector('td:nth-child(14)');
            approvalDateCell.textContent = (newStatus === 'approved' || newStatus === 'rejected') && approver !== '-' ? new Date().toLocaleDateString('en-US') : '-';

            hideModal(editModal);
        });
    }

    // --- Search, Download, Checkbox functionality ---
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const filter = searchInput.value.toUpperCase();
            const rows = table.getElementsByTagName('tr');
            for (let i = 1; i < rows.length; i++) {
                rows[i].style.display = rows[i].textContent.toUpperCase().indexOf(filter) > -1 ? "" : "none";
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
            const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
            const link = document.createElement("a");
            link.download = "leave_requests.csv";
            link.href = window.URL.createObjectURL(csvFile);
            link.click();
        });
    }
    
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if(selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = this.checked);
        });
    }
});
