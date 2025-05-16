document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addStaffBtn = document.getElementById('addStaffBtn');
    const staffModal = document.getElementById('staffModal');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const staffForm = document.getElementById('staffForm');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const searchBtn = document.getElementById('searchBtn');
    const staffSearch = document.getElementById('staffSearch');
    const staffTable = document.getElementById('staffTable').getElementsByTagName('tbody')[0];

    // API Functions
    async function fetchStaff() {
        try {
            const response = await fetch('api.php');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching staff:', error);
            return [];
        }
    }

    async function addStaff(staffData) {
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(staffData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding staff:', error);
            return { status: 'error', message: error.message };
        }
    }

    async function updateStaff(staffData) {
        try {
            const response = await fetch('api.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(staffData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating staff:', error);
            return { status: 'error', message: error.message };
        }
    }

    async function deleteStaff(staffId) {
        try {
            const response = await fetch(`api.php?staff_id=${staffId}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting staff:', error);
            return { status: 'error', message: error.message };
        }
    }

    // Initialize the staff table with data from the API
    async function initializeStaffTable() {
        const staff = await fetchStaff();
        staffTable.innerHTML = '';
        
        if (staff.length === 0) {
            const row = staffTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 7; // Adjust based on your table columns
            cell.textContent = 'No staff members found';
            cell.className = 'text-center';
            return;
        }
        
        staff.forEach(staff => {
            const row = staffTable.insertRow();
            const statusClass = staff.status === 'Active' ? 'status-active' : 'status-leave';
            const statusBadge = `<span class="${statusClass}">${staff.status}</span>`;
            
            row.innerHTML = `
                <td>${staff.staff_id}</td>
                <td>${staff.first_name} ${staff.last_name}</td>
                <td>${staff.ward_name}</td>
                <td>${staff.dept_name}</td>
                <td>${staff.rank_name}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${staff.staff_id}">View</button>
                    <button class="action-btn edit-btn" data-id="${staff.staff_id}">Edit</button>
                </td>
            `;
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const staffId = this.getAttribute('data-id');
                viewStaffDetails(staffId);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const staffId = this.getAttribute('data-id');
                editStaffDetails(staffId);
            });
        });
    }

    // View staff details
    function viewStaffDetails(staffId) {
        const staff = sampleStaff.find(s => s.id === staffId);
        if (staff) {
            alert(`Viewing details for ${staff.firstName} ${staff.lastName}\n\n` +
                  `Position: ${staff.rank}\n` +
                  `Department: ${staff.department}\n` +
                  `Ward: ${staff.ward}\n` +
                  `Status: ${staff.status}\n` +
                  `Phone: ${staff.phone}\n` +
                  `Email: ${staff.email}`);
        }
    }
    
    // Edit staff details
    function editStaffDetails(staffId) {
        const staff = sampleStaff.find(s => s.id === staffId);
        if (staff) {
            // Populate the form with staff data
            document.getElementById('staffId').value = staff.id;
            document.getElementById('nationalId').value = staff.nationalId;
            document.getElementById('firstName').value = staff.firstName;
            document.getElementById('middleName').value = staff.middleName;
            document.getElementById('lastName').value = staff.lastName;
            document.getElementById('gender').value = staff.gender;
            document.getElementById('dob').value = staff.dob;
            document.getElementById('email').value = staff.email;
            document.getElementById('phone').value = staff.phone;
            document.getElementById('ward').value = staff.ward;
            document.getElementById('address').value = staff.address;
            document.getElementById('department').value = staff.department;
            document.getElementById('rank').value = staff.rank;
            document.getElementById('employmentDate').value = staff.employmentDate;
            document.getElementById('salary').value = staff.salary;
            
            // Change form title
            document.querySelector('#staffModal h2').textContent = `Edit Staff: ${staff.firstName} ${staff.lastName}`;
            
            // Open the modal
            staffModal.style.display = 'block';
        }
    }
    
    // Generate a new staff ID
    async function generateStaffId() {
        const staff = await fetchStaff();
        const lastId = staff.length > 0 ? 
            parseInt(staff[staff.length - 1].staff_id.replace('MBF', '')) : 0;
        return `MBF${String(lastId + 1).padStart(3, '0')}`;
    }
    
    // Modal functions
    async function openAddStaffModal() {
        // Reset form
        staffForm.reset();

        // Generate new staff ID
        document.getElementById('staffId').value = await generateStaffId();

        // Change form title
        document.querySelector('#staffModal h2').textContent = 'Register New Staff Member';

        // Open the modal
        staffModal.style.display = 'block';
    }
    
    function closeModal() {
        staffModal.style.display = 'none';
    }
    
    // Filter staff table
    function filterStaffTable() {
        const wardFilter = document.getElementById('wardFilter').value;
        const deptFilter = document.getElementById('deptFilter').value;
        const rankFilter = document.getElementById('rankFilter').value;
        
        const rows = staffTable.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const ward = rows[i].cells[2].textContent;
            const dept = rows[i].cells[3].textContent;
            const rank = rows[i].cells[4].textContent;
            
            const wardMatch = !wardFilter || ward === wardFilter;
            const deptMatch = !deptFilter || dept === deptFilter;
            const rankMatch = !rankFilter || rank === rankFilter;
            
            rows[i].style.display = (wardMatch && deptMatch && rankMatch) ? '' : 'none';
        }
    }
    
    // Search staff
    function searchStaff() {
        const searchTerm = staffSearch.value.toLowerCase();
        const rows = staffTable.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const id = rows[i].cells[0].textContent.toLowerCase();
            const name = rows[i].cells[1].textContent.toLowerCase();
            
            if (id.includes(searchTerm) || name.includes(searchTerm)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
    
    // Reset filters
    function resetAllFilters() {
        document.getElementById('wardFilter').value = '';
        document.getElementById('deptFilter').value = '';
        document.getElementById('rankFilter').value = '';
        
        const rows = staffTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = '';
        }
    }
    
    // Navigation and Section Management
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.main-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the corresponding section
            const target = this.textContent.trim().toLowerCase();
            switch(target) {
                case 'dashboard':
                    document.querySelector('.main-content').style.display = 'block';
                    break;
                case 'staff':
                    document.getElementById('staffSection').style.display = 'block';
                    loadStaffCards();
                    break;
                case 'departments':
                    document.getElementById('departmentsSection').style.display = 'block';
                    loadDepartmentCards();
                    break;
                case 'reports':
                    document.getElementById('reportsSection').style.display = 'block';
                    break;
                default:
                    document.querySelector('.main-content').style.display = 'block';
            }
        });
    });

    // Load staff cards dynamically
    async function loadStaffCards() {
        const staffGrid = document.querySelector('.staff-grid');
        staffGrid.innerHTML = '<div class="spinner"></div>';
        
        try {
            const staff = await fetchStaff();
            staffGrid.innerHTML = '';
            
            if (staff.length === 0) {
                staffGrid.innerHTML = '<p class="no-results">No staff members found</p>';
                return;
            }
            
            staff.forEach(member => {
                const card = document.createElement('div');
                card.className = 'staff-card';
                card.innerHTML = `
                    <div class="staff-card-header">
                        <img src="${member.photo_path || 'default-avatar.png'}" alt="${member.first_name} ${member.last_name}" class="staff-photo">
                        <div class="staff-info">
                            <h3>${member.first_name} ${member.last_name}</h3>
                            <p>${member.rank_name}</p>
                            <p>${member.dept_name}</p>
                        </div>
                    </div>
                    <div class="staff-details">
                        <div class="staff-detail-row">
                            <span class="staff-detail-label">Staff ID:</span>
                            <span class="staff-detail-value">${member.staff_id}</span>
                        </div>
                        <div class="staff-detail-row">
                            <span class="staff-detail-label">Ward:</span>
                            <span class="staff-detail-value">${member.ward_name}</span>
                        </div>
                        <div class="staff-detail-row">
                            <span class="staff-detail-label">Status:</span>
                            <span class="status-${member.status.toLowerCase().replace(' ', '-')}">${member.status}</span>
                        </div>
                    </div>
                    <div class="staff-actions">
                        <button class="action-btn view-btn" data-id="${member.staff_id}">View Details</button>
                        <button class="action-btn edit-btn" data-id="${member.staff_id}">Edit</button>
                    </div>
                `;
                staffGrid.appendChild(card);
            });
        } catch (error) {
            staffGrid.innerHTML = `<p class="error-message">Error loading staff: ${error.message}</p>`;
        }
    }

    // Load department cards dynamically
    async function loadDepartmentCards() {
        const deptContainer = document.querySelector('.department-cards');
        deptContainer.innerHTML = '<div class="spinner"></div>';
        
        try {
            const response = await fetch('api.php?action=getDepartments');
            const departments = await response.json();
            deptContainer.innerHTML = '';
            
            if (departments.length === 0) {
                deptContainer.innerHTML = '<p class="no-results">No departments found</p>';
                return;
            }
            
            departments.forEach(dept => {
                const card = document.createElement('div');
                card.className = 'department-card';
                card.innerHTML = `
                    <h3>${dept.dept_name}</h3>
                    <div class="department-staff-count">${dept.staff_count} Staff</div>
                    <p class="department-description">${dept.description}</p>
                    <p class="department-manager">Manager: ${dept.manager_name || 'Not assigned'}</p>
                    <div class="department-actions">
                        <button class="action-btn view-dept-btn" data-id="${dept.dept_id}">View Staff</button>
                    </div>
                `;
                deptContainer.appendChild(card);
            });
        } catch (error) {
            deptContainer.innerHTML = `<p class="error-message">Error loading departments: ${error.message}</p>`;
        }
    }

    // Add event listeners for new buttons
    document.getElementById('addNewStaffBtn').addEventListener('click', openAddStaffModal);
    document.getElementById('addNewDeptBtn').addEventListener('click', openAddDeptModal);
    document.getElementById('generateReportBtn').addEventListener('click', generateReport);
    document.getElementById('exportReportBtn').addEventListener('click', exportReport);

    // Department Modal Functions
    function openAddDeptModal() {
        // TODO: Implement department modal
        alert('Add Department functionality coming soon!');
    }

    // Report Functions
    function generateReport() {
        const reportType = document.getElementById('reportType').value;
        const dateRange = document.getElementById('dateRange').value;
        // TODO: Implement report generation
        alert(`Generating ${reportType} report for ${dateRange}`);
    }

    function exportReport() {
        // TODO: Implement report export
        alert('Export functionality coming soon!');
    }

    // Handle form submission
    staffForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Collect form data
        const staffData = {
            staff_id: document.getElementById('staffId').value,
            national_id: document.getElementById('nationalId').value,
            first_name: document.getElementById('firstName').value,
            middle_name: document.getElementById('middleName').value,
            last_name: document.getElementById('lastName').value,
            gender: document.getElementById('gender').value,
            dob: document.getElementById('dob').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            ward_name: document.getElementById('ward').value,
            address: document.getElementById('address').value,
            dept_name: document.getElementById('department').value,
            rank_name: document.getElementById('rank').value,
            employment_date: document.getElementById('employmentDate').value,
            salary: document.getElementById('salary').value,
            notes: document.getElementById('notes').value,
        };

        // Call the addStaff API function
        const result = await addStaff(staffData);

        if (result.status === 'success') {
            alert('Staff added successfully!');
            closeModal();
            initializeStaffTable(); // Refresh the staff table
        } else {
            alert(`Error adding staff: ${result.message}`);
        }
    });
    
    // Event Listeners
    addStaffBtn.addEventListener('click', openAddStaffModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === staffModal) {
            closeModal();
        }
    });
    
    applyFilters.addEventListener('click', filterStaffTable);
    resetFilters.addEventListener('click', resetAllFilters);
    searchBtn.addEventListener('click', searchStaff);
    staffSearch.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchStaff();
        }
    });
    
    // Initialize the page
    initializeStaffTable();
});