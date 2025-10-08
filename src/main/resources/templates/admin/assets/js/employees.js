document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Feather Icons ---
    feather.replace();

    // --- Add Modal Handling ---
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const addModal = document.getElementById('addEmployeeModal');
    const closeAddModalBtn = document.getElementById('closeAddModalBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const addEmployeeForm = document.getElementById('addEmployeeForm');

    const showAddModal = () => addModal.classList.remove('hidden');
    const hideAddModal = () => {
        addModal.classList.add('hidden');
        addEmployeeForm.reset();
    };

    if (addEmployeeBtn) addEmployeeBtn.addEventListener('click', showAddModal);
    if (closeAddModalBtn) closeAddModalBtn.addEventListener('click', hideAddModal);
    if (cancelAddBtn) cancelAddBtn.addEventListener('click', hideAddModal);
    if (addModal) addModal.addEventListener('click', (e) => {
        if (e.target === addModal) hideAddModal();
    });

    // --- Edit Modal Handling ---
    const editModal = document.getElementById('editEmployeeModal');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editEmployeeForm = document.getElementById('editEmployeeForm');
    let currentRowToEdit = null;

    const showEditModal = () => editModal.classList.remove('hidden');
    const hideEditModal = () => {
        editModal.classList.add('hidden');
        editEmployeeForm.reset();
        currentRowToEdit = null;
    };

    if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', hideEditModal);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', hideEditModal);
    if (editModal) editModal.addEventListener('click', (e) => {
        if (e.target === editModal) hideEditModal();
    });

    // --- Add New Employee ---
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // ... (Add employee logic remains the same)
            const tableBody = document.getElementById('employeeTable').querySelector('tbody');
            const newRow = tableBody.insertRow();
            const name = document.getElementById('employeeName').value;
            const role = document.getElementById('employeeRole').value;
            const department = document.getElementById('employeeDepartment').value;
            const mobile = document.getElementById('employeeMobile').value;
            const joiningDate = document.getElementById('employeeJoiningDate').value;
            const email = document.getElementById('employeeEmail').value;
            const gender = document.getElementById('employeeGender').value;
            const address = document.getElementById('employeeAddress').value;
            const status = document.getElementById('employeeStatus').value;
            const formattedDate = new Date(joiningDate).toLocaleDateString('en-US');

            newRow.innerHTML = `
                <td><input type="checkbox" class="row-checkbox"></td>
                <td><div class="user-profile"><img src="https://placehold.co/32x32/E2E8F0/4A5568?text=${name.charAt(0)}" alt="${name}"><span>${name}</span></div></td>
                <td>${role}</td>
                <td>${department}</td>
                <td>${mobile}</td>
                <td>${formattedDate}</td>
                <td>${email}</td>
                <td><span class="pill pill-${gender}">${gender.charAt(0).toUpperCase() + gender.slice(1)}</span></td>
                <td>${address}</td>
                <td><span class="pill pill-${status.replace(' ', '-')}">${status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></td>
                <td><div class="action-icons"><i data-feather="edit-2" class="edit-btn"></i><i data-feather="trash-2" class="delete-btn"></i></div></td>
            `;
            feather.replace();
            hideAddModal();
        });
    }

    // --- Table Actions (Edit/Delete) ---
    const table = document.getElementById('employeeTable');
    if (table) {
        table.addEventListener('click', (e) => {
            // Handle Delete
            if (e.target.closest('.delete-btn')) {
                const row = e.target.closest('tr');
                if (confirm('Are you sure you want to delete this employee?')) {
                    row.remove();
                }
            }
            // Handle Edit
            if (e.target.closest('.edit-btn')) {
                currentRowToEdit = e.target.closest('tr');
                const cells = currentRowToEdit.querySelectorAll('td');

                // Extract data from cells
                const name = cells[1].querySelector('span').innerText;
                const role = cells[2].innerText;
                const department = cells[3].innerText;
                const mobile = cells[4].innerText;
                const joiningDate = cells[5].innerText;
                const email = cells[6].innerText;
                const gender = cells[7].innerText.toLowerCase();
                const address = cells[8].innerText;
                const statusText = cells[9].innerText;
                
                // Convert status text to value (e.g., "On Leave" -> "on-leave")
                const status = statusText.toLowerCase().replace(' ', '-');
                
                // Convert MM/DD/YYYY to YYYY-MM-DD for date input
                const dateParts = joiningDate.split('/');
                const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;

                // Populate the edit form
                document.getElementById('editEmployeeName').value = name;
                document.getElementById('editEmployeeRole').value = role;
                document.getElementById('editEmployeeDepartment').value = department;
                document.getElementById('editEmployeeMobile').value = mobile;
                document.getElementById('editEmployeeJoiningDate').value = formattedDate;
                document.getElementById('editEmployeeEmail').value = email;
                document.getElementById('editEmployeeGender').value = gender;
                document.getElementById('editEmployeeAddress').value = address;
                document.getElementById('editEmployeeStatus').value = status;
                
                showEditModal();
            }
        });
    }

    // --- Save Edited Employee ---
    if (editEmployeeForm) {
        editEmployeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentRowToEdit) return;

            // Get updated values
            const name = document.getElementById('editEmployeeName').value;
            const role = document.getElementById('editEmployeeRole').value;
            const department = document.getElementById('editEmployeeDepartment').value;
            const mobile = document.getElementById('editEmployeeMobile').value;
            const joiningDate = document.getElementById('editEmployeeJoiningDate').value;
            const email = document.getElementById('editEmployeeEmail').value;
            const gender = document.getElementById('editEmployeeGender').value;
            const address = document.getElementById('editEmployeeAddress').value;
            const status = document.getElementById('editEmployeeStatus').value;
            
            const formattedDate = new Date(joiningDate).toLocaleDateString('en-US');
            const statusText = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            // Update the row in the table
            const cells = currentRowToEdit.querySelectorAll('td');
            cells[1].innerHTML = `<div class="user-profile"><img src="https://placehold.co/32x32/E2E8F0/4A5568?text=${name.charAt(0)}" alt="${name}"><span>${name}</span></div>`;
            cells[2].innerText = role;
            cells[3].innerText = department;
            cells[4].innerText = mobile;
            cells[5].innerText = formattedDate;
            cells[6].innerText = email;
            cells[7].innerHTML = `<span class="pill pill-${gender}">${gender.charAt(0).toUpperCase() + gender.slice(1)}</span>`;
            cells[8].innerText = address;
            cells[9].innerHTML = `<span class="pill pill-${status.replace(' ', '-')}">${statusText}</span>`;

            hideEditModal();
        });
    }

    // --- Search, Download, Checkbox functionality (remains the same) ---
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const filter = searchInput.value.toUpperCase();
            const rows = table.getElementsByTagName('tr');
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                let found = false;
                for (let j = 0; j < cells.length; j++) {
                    if (cells[j] && cells[j].textContent.toUpperCase().indexOf(filter) > -1) {
                        found = true;
                        break;
                    }
                }
                rows[i].style.display = found ? "" : "none";
            }
        });
    }

    const downloadCsvBtn = document.getElementById('downloadCsvBtn');
    if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener('click', () => {
            const table = document.getElementById("employeeTable");
            let csv = [];
            for (let i = 0; i < table.rows.length; i++) {
                let row = [], cols = table.rows[i].querySelectorAll("td, th");
                for (let j = 1; j < cols.length - 1; j++) {
                    row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
                }
                csv.push(row.join(","));
            }
            const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
            const downloadLink = document.createElement("a");
            downloadLink.download = "employees.csv";
            downloadLink.href = window.URL.createObjectURL(csvFile);
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }
    
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if(selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
});

