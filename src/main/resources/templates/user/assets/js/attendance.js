document.addEventListener("DOMContentLoaded", function() {
    // --- Sample Data ---
    const allAttendanceData = [
        { date: "02/11/2018", checkIn: "09:38 AM", break: "31 mins", checkOut: "17:33 PM", hoursWorked: "09h:11 mins", status: "Present" },
        { date: "02/25/2018", checkIn: "09:35 AM", break: "37 mins", checkOut: "17:25 PM", hoursWorked: "09h:36 mins", status: "Absent" },
        { date: "02/12/2018", checkIn: "09:18 AM", break: "28 mins", checkOut: "17:39 PM", hoursWorked: "09h:26 mins", status: "Present" },
        { date: "02/13/2018", checkIn: "09:18 AM", break: "35 mins", checkOut: "17:50 PM", hoursWorked: "09h:11 mins", status: "Present" },
        { date: "02/14/2018", checkIn: "09:40 AM", break: "24 mins", checkOut: "17:25 PM", hoursWorked: "09h:14 mins", status: "Absent" },
        { date: "02/15/2018", checkIn: "09:42 AM", break: "28 mins", checkOut: "17:33 PM", hoursWorked: "09h:24 mins", status: "Present" },
        { date: "02/16/2018", checkIn: "09:35 AM", break: "31 mins", checkOut: "17:39 PM", hoursWorked: "09h:36 mins", status: "Present" },
        { date: "02/18/2018", checkIn: "09:46 AM", break: "38 mins", checkOut: "17:25 PM", hoursWorked: "09h:30 mins", status: "Absent" },
        { date: "02/19/2018", checkIn: "09:38 AM", break: "28 mins", checkOut: "17:30 PM", hoursWorked: "09h:24 mins", status: "Present" },
        { date: "02/20/2018", checkIn: "09:14 AM", break: "21 mins", checkOut: "17:50 PM", hoursWorked: "09h:19 mins", status: "Present" },
        { date: "02/21/2018", checkIn: "09:20 AM", break: "30 mins", checkOut: "17:45 PM", hoursWorked: "09h:25 mins", status: "Present" },
        { date: "02/22/2018", checkIn: "09:33 AM", break: "40 mins", checkOut: "17:55 PM", hoursWorked: "09h:42 mins", status: "Absent" },
        { date: "02/23/2018", checkIn: "09:25 AM", break: "25 mins", checkOut: "17:35 PM", hoursWorked: "09h:15 mins", status: "Present" }
    ];

    let filteredData = [...allAttendanceData];
    let currentPage = 1;
    let itemsPerPage = 10;

    // --- DOM Elements ---
    const tableBody = document.getElementById('attendance-table-body');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    // --- Functions ---
    const renderTable = () => {
        tableBody.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredData.slice(start, end);

        if (paginatedItems.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center p-8 text-gray-500">No data found</td></tr>`;
            updatePaginationControls();
            return;
        }

        paginatedItems.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            const statusClass = item.status === 'Present' ? 'status-present' : 'status-absent';
            
            row.innerHTML = `
                <td class="p-4">${item.date}</td>
                <td class="p-4">${item.checkIn}</td>
                <td class="p-4">${item.break}</td>
                <td class="p-4">${item.checkOut}</td>
                <td class="p-4">${item.hoursWorked}</td>
                <td class="p-4"><span class="status-badge ${statusClass}">${item.status}</span></td>
            `;
            tableBody.appendChild(row);
        });

        updatePaginationControls();
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

    const handleSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredData = allAttendanceData.filter(item => {
            return Object.values(item).some(val => 
                val.toString().toLowerCase().includes(searchTerm)
            );
        });
        currentPage = 1;
        renderTable();
    };
    
    const handleRefresh = () => {
        const icon = refreshBtn.querySelector('i');
        icon.classList.add('refreshing');
        refreshBtn.disabled = true;

        setTimeout(() => {
            searchInput.value = '';
            filteredData = [...allAttendanceData];
            currentPage = 1;
            renderTable();
            icon.classList.remove('refreshing');
            refreshBtn.disabled = false;
        }, 1000); // Simulate network delay
    };

    const handleDownload = () => {
        const headers = Object.keys(allAttendanceData[0]);
        const csvContent = [
            headers.join(','),
            ...allAttendanceData.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'attendance.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // --- Event Listeners ---
    searchInput.addEventListener('input', handleSearch);
    refreshBtn.addEventListener('click', handleRefresh);
    downloadBtn.addEventListener('click', handleDownload);

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

    // --- Initial Load ---
    lucide.createIcons();
    renderTable();
});
