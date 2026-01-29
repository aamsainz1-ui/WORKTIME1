// ===================================
// Admin Console Features
// ===================================

// Switch Admin Tabs
function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`)?.classList.add('active');

    // Load tab data
    switch (tabName) {
        case 'employees':
            renderEmployeeTable();
            break;
        case 'approvals':
            renderApprovalTable();
            break;
        case 'announcements':
            renderAnnouncements();
            break;
        case 'locations':
            renderLocations();
            break;
    }
}

// Employee Management
function renderEmployeeTable() {
    const tbody = document.getElementById('employeeTableBody');
    if (!tbody) return;

    if (currentState.employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No employees</td></tr>';
        return;
    }

    tbody.innerHTML = currentState.employees.map(emp => `
        <tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.position}</td>
            <td>${t('role_' + emp.role)}</td>
            <td><span class="status-badge ${emp.status || 'active'}">${t('status_' + (emp.status || 'active'))}</span></td>
            <td>
                <button class="btn-secondary" onclick="editEmployee('${emp.id}')" style="padding: 6px 12px; font-size: 0.875rem;">Edit</button>
                <button class="btn-danger" onclick="deleteEmployee('${emp.id}')" style="padding: 6px 12px; font-size: 0.875rem;">Delete</button>
            </td>
        </tr>
    `).join('');
}

function addEmployee(e) {
    e.preventDefault();

    const name = document.getElementById('employeeName').value;
    const department = document.getElementById('employeeDepartment').value;
    const position = document.getElementById('employeePosition').value;
    const role = document.getElementById('employeeRole').value;
    const pin = document.getElementById('employeePin').value;

    const employee = {
        id: `EMP-${currentState.employeeIdCounter++}`,
        name,
        department,
        position,
        role,
        pin,
        status: 'active',
        faceData: null,
        leaveQuota: {
            vacation: { total: 10, remaining: 10 },
            sick: { total: 15, remaining: 15 },
            personal: { total: 5, remaining: 5 }
        },
        createdAt: new Date().toISOString()
    };

    currentState.employees.push(employee);
    saveState();

    closeModal('addEmployeeModal');
    document.getElementById('addEmployeeForm').reset();

    renderEmployeeTable();
    renderUserSelect();
    showToast(t('toast_employee_added'));
}

function editEmployee(empId) {
    const employee = currentState.employees.find(e => e.id === empId);
    if (!employee) return;

    // For simplicity, just show an alert with employee details
    // In production, you'd open an edit modal
    alert(`Edit Employee: ${employee.name}\n\nThis feature would open an edit form in production.`);
}

function deleteEmployee(empId) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    currentState.employees = currentState.employees.filter(e => e.id !== empId);
    saveState();

    renderEmployeeTable();
    showToast('Employee deleted successfully');
}

// Leave Approvals
function renderApprovalTable() {
    const tbody = document.getElementById('approvalsTableBody');
    if (!tbody) return;

    const pendingRequests = currentState.leaveRequests.filter(r => r.status === 'pending');

    if (pendingRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No pending approvals</td></tr>';
        return;
    }

    tbody.innerHTML = pendingRequests.map(req => `
        <tr>
            <td>${req.userName}</td>
            <td>${t('leave_' + req.type)}</td>
            <td>${new Date(req.startDate).toLocaleDateString()} - ${new Date(req.endDate).toLocaleDateString()}</td>
            <td>${req.days}</td>
            <td>${req.reason}</td>
            <td>
                <button class="btn-primary" onclick="approveLeave(${req.id})" style="padding: 6px 12px; font-size: 0.875rem;">Approve</button>
                <button class="btn-danger" onclick="rejectLeave(${req.id})" style="padding: 6px 12px; font-size: 0.875rem;">Reject</button>
            </td>
        </tr>
    `).join('');
}

function approveLeave(requestId) {
    const request = currentState.leaveRequests.find(r => r.id === requestId);
    if (!request) return;

    request.status = 'approved';
    request.approvedAt = new Date().toISOString();
    request.approvedBy = currentState.currentUser.id;

    // Deduct from employee quota
    const employee = currentState.employees.find(e => e.id === request.userId);
    if (employee && employee.leaveQuota) {
        const quota = employee.leaveQuota[request.type];
        if (quota) {
            quota.remaining = Math.max(0, quota.remaining - request.days);
        }
    }

    saveState();
    renderApprovalTable();
    showToast('Leave request approved');
}

function rejectLeave(requestId) {
    const request = currentState.leaveRequests.find(r => r.id === requestId);
    if (!request) return;

    request.status = 'rejected';
    request.rejectedAt = new Date().toISOString();
    request.rejectedBy = currentState.currentUser.id;

    saveState();
    renderApprovalTable();
    showToast('Leave request rejected');
}

// Announcements
function renderAnnouncements() {
    const container = document.getElementById('announcementsList');
    if (!container) return;

    if (currentState.announcements.length === 0) {
        container.innerHTML = '<p class="empty-state">No announcements</p>';
        return;
    }

    container.innerHTML = currentState.announcements
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(ann => `
            <div class="announcement-card">
                <div class="announcement-header">
                    <div class="announcement-title">${ann.title}</div>
                    <span class="announcement-priority ${ann.priority}">${t('priority_' + ann.priority)}</span>
                </div>
                <div class="announcement-message">${ann.message}</div>
                <div class="announcement-date">${new Date(ann.createdAt).toLocaleString()}</div>
            </div>
        `).join('');
}

function addAnnouncement(e) {
    e.preventDefault();

    const title = document.getElementById('announcementTitle').value;
    const message = document.getElementById('announcementMessage').value;
    const priority = document.getElementById('announcementPriority').value;

    const announcement = {
        id: Date.now(),
        title,
        message,
        priority,
        createdBy: currentState.currentUser.id,
        createdAt: new Date().toISOString()
    };

    currentState.announcements.push(announcement);
    saveState();

    closeModal('addAnnouncementModal');
    document.getElementById('addAnnouncementForm').reset();

    renderAnnouncements();
    showToast(t('toast_announcement_published'));
}

// Office Locations
function renderLocations() {
    const container = document.getElementById('locationsGrid');
    if (!container) return;

    if (currentState.officeLocations.length === 0) {
        container.innerHTML = '<p class="empty-state">No office locations configured</p>';
        return;
    }

    container.innerHTML = currentState.officeLocations.map(loc => `
        <div class="location-card">
            <h4>${loc.name}</h4>
            <div class="location-coords">📍 ${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}</div>
            <button class="btn-danger" onclick="deleteLocation(${loc.id})" style="margin-top: 12px; width: 100%;">Delete</button>
        </div>
    `).join('');
}

let mapInstance = null;
let mapMarker = null;

function openAddLocationModal() {
    openModal('addLocationModal');

    // Initialize map after modal is visible
    setTimeout(() => {
        if (!mapInstance) {
            mapInstance = L.map('mapPicker').setView([13.7563, 100.5018], 13); // Bangkok default

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstance);

            mapInstance.on('click', (e) => {
                const { lat, lng } = e.latlng;

                if (mapMarker) {
                    mapMarker.setLatLng([lat, lng]);
                } else {
                    mapMarker = L.marker([lat, lng]).addTo(mapInstance);
                }

                document.getElementById('locationLat').value = lat.toFixed(6);
                document.getElementById('locationLng').value = lng.toFixed(6);
            });
        } else {
            mapInstance.invalidateSize();
        }
    }, 300);
}

function addLocation(e) {
    e.preventDefault();

    const name = document.getElementById('locationName').value;
    const lat = parseFloat(document.getElementById('locationLat').value);
    const lng = parseFloat(document.getElementById('locationLng').value);

    if (!name || isNaN(lat) || isNaN(lng)) {
        showToast('Please fill all fields and select a location on the map');
        return;
    }

    const location = {
        id: Date.now(),
        name,
        lat,
        lng,
        createdAt: new Date().toISOString()
    };

    currentState.officeLocations.push(location);
    saveState();

    closeModal('addLocationModal');
    document.getElementById('addLocationForm').reset();

    if (mapMarker) {
        mapInstance.removeLayer(mapMarker);
        mapMarker = null;
    }

    renderLocations();
    showToast(t('toast_location_added'));
}

function deleteLocation(locId) {
    if (!confirm('Are you sure you want to delete this location?')) return;

    currentState.officeLocations = currentState.officeLocations.filter(l => l.id !== locId);
    saveState();

    renderLocations();
    showToast('Location deleted successfully');
}

// System Settings
function saveSystemSettings() {
    const lateThreshold = parseInt(document.getElementById('lateThresholdInput').value);
    const gpsRadius = parseInt(document.getElementById('gpsRadiusInput').value);

    currentState.settings.lateThreshold = lateThreshold;
    currentState.settings.gpsRadius = gpsRadius;

    saveState();
    showToast(t('toast_settings_saved'));
}

function exportAllData() {
    const data = JSON.stringify(currentState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `globalwork_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Data exported successfully!');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (confirm('This will replace all current data. Are you sure?')) {
                    currentState = data;
                    saveState();
                    location.reload();
                }
            } catch (error) {
                showToast('Invalid data file');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

function resetSystem() {
    if (!confirm('⚠️ WARNING: This will delete ALL data and reset the system. Are you absolutely sure?')) return;
    if (!confirm('This action cannot be undone. Type YES to confirm.')) return;

    localStorage.removeItem('globalwork_state');
    location.reload();
}

// Settings Page Functions
function changePIN() {
    const newPin = prompt('Enter new 4-digit PIN:');

    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
        showToast('Invalid PIN. Must be 4 digits.');
        return;
    }

    const userIndex = currentState.employees.findIndex(e => e.id === currentState.currentUser.id);
    if (userIndex !== -1) {
        currentState.employees[userIndex].pin = newPin;
        currentState.currentUser.pin = newPin;
        saveState();
        showToast(t('toast_pin_changed'));
    }
}

function resetFaceData() {
    if (!confirm('Are you sure you want to reset your face data? You will need to register again.')) return;

    const userIndex = currentState.employees.findIndex(e => e.id === currentState.currentUser.id);
    if (userIndex !== -1) {
        currentState.employees[userIndex].faceData = null;
        currentState.currentUser.faceData = null;
        saveState();
        showToast(t('toast_face_reset'));
    }
}

// Initialize demo data if no employees exist
function initializeDemoData() {
    if (currentState.employees.length === 0) {
        // Create demo owner account
        const demoOwner = {
            id: 'EMP-1001',
            name: 'Admin User',
            department: 'Management',
            position: 'System Administrator',
            role: 'owner',
            pin: '1234',
            status: 'active',
            faceData: null,
            leaveQuota: {
                vacation: { total: 10, remaining: 10 },
                sick: { total: 15, remaining: 15 },
                personal: { total: 5, remaining: 5 }
            },
            createdAt: new Date().toISOString()
        };

        currentState.employees.push(demoOwner);
        currentState.employeeIdCounter = 1002;

        // Add demo office location (Bangkok)
        currentState.officeLocations.push({
            id: Date.now(),
            name: 'Innovation Park Zone',
            lat: 13.7563,
            lng: 100.5018,
            createdAt: new Date().toISOString()
        });

        saveState();
    }
}

// Call initialization on first load
if (typeof currentState !== 'undefined') {
    initializeDemoData();
}
