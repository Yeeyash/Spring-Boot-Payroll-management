document.addEventListener("DOMContentLoaded", function() {
    // --- Sample Data ---
    const payrollData = [
        { id: 1, period: "March 2024", gross: 50000, deductions: 5000, net: 45000, status: "Paid", presentDays: 22, absentDays: 0 },
        { id: 2, period: "April 2024", gross: 50000, deductions: 5200, net: 44800, status: "Paid", presentDays: 21, absentDays: 1 },
        { id: 3, period: "May 2024", gross: 50000, deductions: 4800, net: 45200, status: "Paid", presentDays: 22, absentDays: 0 },
        { id: 4, period: "June 2024", gross: 50000, deductions: 7500, net: 42500, status: "Paid", presentDays: 18, absentDays: 4 },
        { id: 5, period: "July 2024", gross: 50000, deductions: 5000, net: 45000, status: "Paid", presentDays: 22, absentDays: 0 },
    ];

    // --- DOM Elements ---
    const tableBody = document.getElementById('payroll-table-body');
    const modal = document.getElementById('payslipModal');
    const modalTitle = document.getElementById('modalTitle');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const payslipContent = document.getElementById('payslipContent');
    const downloadSlipBtn = document.getElementById('downloadSlipBtn');
    
    let currentPayslip = null;

    // --- Functions ---
    const renderTable = () => {
        tableBody.innerHTML = '';
        payrollData.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            row.innerHTML = `
                <td class="p-4 font-semibold">${item.period}</td>
                <td class="p-4">₹${item.gross.toLocaleString('en-IN')}</td>
                <td class="p-4 text-red-600">₹${item.deductions.toLocaleString('en-IN')}</td>
                <td class="p-4 font-bold text-green-600">₹${item.net.toLocaleString('en-IN')}</td>
                <td class="p-4"><span class="status-paid">${item.status}</span></td>
                <td class="p-4">
                    <div class="flex items-center gap-2">
                        <button class="action-btn action-btn-view" title="View Payslip" data-id="${item.id}"><i data-lucide="eye"></i></button>
                        <button class="action-btn action-btn-download" title="Download Payslip" data-id="${item.id}"><i data-lucide="download"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        lucide.createIcons();
    };

    const generatePayslipHTML = (slip) => {
        return `
            <div class="payslip-header">
                <h4>Urdhwarit Rane Inc.</h4>
                <p>Payslip for the month of ${slip.period}</p>
            </div>
            <div class="payslip-grid">
                <div class="grid-item"><strong>Employee Name:</strong> Urdhwarit Rane</div>
                <div class="grid-item"><strong>Designation:</strong> Owner</div>
                <div class="grid-item"><strong>Present Days:</strong> ${slip.presentDays}</div>
                <div class="grid-item"><strong>Absent Days:</strong> ${slip.absentDays}</div>
            </div>
            <table class="payslip-table">
                <thead>
                    <tr><th>Earnings</th><th>Amount</th><th>Deductions</th><th>Amount</th></tr>
                </thead>
                <tbody>
                    <tr><td>Basic Salary</td><td>₹${slip.gross.toLocaleString('en-IN')}</td><td>Professional Tax</td><td>₹200</td></tr>
                    <tr><td></td><td></td><td>TDS</td><td>₹${(slip.deductions - 200).toLocaleString('en-IN')}</td></tr>
                    <tr class="total-row"><td>Total Earnings</td><td>₹${slip.gross.toLocaleString('en-IN')}</td><td>Total Deductions</td><td>₹${slip.deductions.toLocaleString('en-IN')}</td></tr>
                </tbody>
            </table>
            <div class="text-right mt-6 font-bold text-lg">
                Net Salary: ₹${slip.net.toLocaleString('en-IN')}
            </div>
        `;
    };

    const openModal = (id) => {
        currentPayslip = payrollData.find(p => p.id === id);
        if (currentPayslip) {
            modalTitle.textContent = `Payslip - ${currentPayslip.period}`;
            payslipContent.innerHTML = generatePayslipHTML(currentPayslip);
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            lucide.createIcons();
        }
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        currentPayslip = null;
    };

    const downloadPayslip = (id) => {
        const slip = payrollData.find(p => p.id === id);
        if (slip) {
            const content = `
                PAYSLIP - ${slip.period}\n
                ---------------------------------\n
                Employee: Urdhwarit Rane\n
                Gross Salary: INR ${slip.gross}\n
                Deductions: INR ${slip.deductions}\n
                Net Salary: INR ${slip.net}\n
                ---------------------------------\n
                This is a system generated payslip.
            `;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `Payslip-${slip.period.replace(' ', '-')}.txt`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // --- Event Listeners ---
    tableBody.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.action-btn-view');
        const downloadBtn = e.target.closest('.action-btn-download');
        if (viewBtn) {
            const id = parseInt(viewBtn.dataset.id);
            openModal(id);
        }
        if (downloadBtn) {
            const id = parseInt(downloadBtn.dataset.id);
            downloadPayslip(id);
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    downloadSlipBtn.addEventListener('click', () => {
        if (currentPayslip) {
            downloadPayslip(currentPayslip.id);
        }
    });

    // --- Initial Load ---
    lucide.createIcons();
    renderTable();
});
