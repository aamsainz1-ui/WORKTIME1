// ===================================
// Custom Alert & Confirm Functions
// ===================================

// Custom Confirm Dialog
function customConfirm(message, title = 'Confirm Action') {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmModal');
        const titleEl = document.getElementById('confirmTitle');
        const messageEl = document.getElementById('confirmMessage');
        const okBtn = document.getElementById('confirmOkBtn');
        const cancelBtn = document.getElementById('confirmCancelBtn');

        if (!modal || !titleEl || !messageEl || !okBtn || !cancelBtn) {
            // Fallback to browser confirm
            resolve(confirm(message));
            return;
        }

        titleEl.textContent = title;
        messageEl.textContent = message;
        modal.classList.add('active');

        const handleOk = () => {
            modal.classList.remove('active');
            cleanup();
            resolve(true);
        };

        const handleCancel = () => {
            modal.classList.remove('active');
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            okBtn.removeEventListener('click', handleOk);
            cancelBtn.removeEventListener('click', handleCancel);
        };

        okBtn.addEventListener('click', handleOk);
        cancelBtn.addEventListener('click', handleCancel);
    });
}

// Custom Alert Dialog
function customAlert(message, title = 'Notification', type = 'info') {
    return new Promise((resolve) => {
        const modal = document.getElementById('alertModal');
        const titleEl = document.getElementById('alertTitle');
        const messageEl = document.getElementById('alertMessage');
        const iconEl = document.getElementById('alertIcon');
        const okBtn = document.getElementById('alertOkBtn');

        if (!modal || !titleEl || !messageEl || !iconEl || !okBtn) {
            // Fallback to browser alert
            alert(message);
            resolve();
            return;
        }

        titleEl.textContent = title;
        messageEl.textContent = message;

        // Set icon based on type
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        iconEl.textContent = icons[type] || icons.info;

        modal.classList.add('active');

        const handleOk = () => {
            modal.classList.remove('active');
            okBtn.removeEventListener('click', handleOk);
            resolve();
        };

        okBtn.addEventListener('click', handleOk);
    });
}

// Save System Settings (including work hours)
function saveSystemSettings() {
    const lateThreshold = document.getElementById('lateThresholdInput');
    const gpsRadius = document.getElementById('gpsRadiusInput');
    const workStartTime = document.getElementById('workStartTimeInput');
    const workEndTime = document.getElementById('workEndTimeInput');

    if (lateThreshold) {
        currentState.settings.lateThreshold = parseInt(lateThreshold.value);
    }
    if (gpsRadius) {
        currentState.settings.gpsRadius = parseInt(gpsRadius.value);
    }
    if (workStartTime) {
        currentState.settings.workStartTime = workStartTime.value;
    }
    if (workEndTime) {
        currentState.settings.workEndTime = workEndTime.value;
    }

    saveState();
    customAlert('System settings saved successfully!', 'Success', 'success');
}

// Load System Settings
function loadSystemSettings() {
    const lateThreshold = document.getElementById('lateThresholdInput');
    const gpsRadius = document.getElementById('gpsRadiusInput');
    const workStartTime = document.getElementById('workStartTimeInput');
    const workEndTime = document.getElementById('workEndTimeInput');

    if (lateThreshold && currentState.settings.lateThreshold) {
        lateThreshold.value = currentState.settings.lateThreshold;
    }
    if (gpsRadius && currentState.settings.gpsRadius) {
        gpsRadius.value = currentState.settings.gpsRadius;
    }
    if (workStartTime && currentState.settings.workStartTime) {
        workStartTime.value = currentState.settings.workStartTime;
    }
    if (workEndTime && currentState.settings.workEndTime) {
        workEndTime.value = currentState.settings.workEndTime;
    }
}

// Check if current time is late
function isLateArrival(clockInTime) {
    if (!currentState.settings.workStartTime) return false;

    const clockIn = new Date(clockInTime);
    const [startHour, startMinute] = currentState.settings.workStartTime.split(':').map(Number);

    const scheduledStart = new Date(clockIn);
    scheduledStart.setHours(startHour, startMinute, 0, 0);

    const lateThreshold = currentState.settings.lateThreshold || 15;
    const diffMinutes = (clockIn - scheduledStart) / (1000 * 60);

    return diffMinutes > lateThreshold;
}

// Export All Data
async function exportAllData() {
    const confirmed = await customConfirm(
        'This will download all system data as a JSON file. Continue?',
        'Export Data'
    );

    if (!confirmed) return;

    const dataStr = JSON.stringify(currentState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `globalwork_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    await customAlert('Data exported successfully!', 'Success', 'success');
}

// Import Data
async function importData() {
    const confirmed = await customConfirm(
        'This will replace all current data. Make sure you have a backup! Continue?',
        'Import Data'
    );

    if (!confirmed) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                currentState = { ...currentState, ...imported };
                saveState();
                await customAlert('Data imported successfully! Please refresh the page.', 'Success', 'success');
                location.reload();
            } catch (error) {
                await customAlert('Failed to import data. Invalid file format.', 'Error', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Reset System
async function resetSystem() {
    const confirmed = await customConfirm(
        'This will DELETE ALL DATA and reset the system. This action cannot be undone! Are you absolutely sure?',
        '⚠️ DANGER: Reset System'
    );

    if (!confirmed) return;

    const doubleConfirm = await customConfirm(
        'Last chance! Type YES in your mind and click Confirm to proceed.',
        'Final Confirmation'
    );

    if (!doubleConfirm) return;

    localStorage.clear();
    await customAlert('System has been reset. The page will reload.', 'System Reset', 'success');
    location.reload();
}

// Change PIN
async function changePIN() {
    const newPin = prompt('Enter new 4-digit PIN:');
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
        await customAlert('Invalid PIN. Please enter exactly 4 digits.', 'Error', 'error');
        return;
    }

    const confirmPin = prompt('Confirm new PIN:');
    if (newPin !== confirmPin) {
        await customAlert('PINs do not match!', 'Error', 'error');
        return;
    }

    if (currentState.currentUser) {
        const employee = currentState.employees.find(e => e.id === currentState.currentUser.id);
        if (employee) {
            employee.pin = newPin;
            currentState.currentUser.pin = newPin;
            saveState();
            await customAlert('PIN changed successfully!', 'Success', 'success');
        }
    }
}

// Reset Face Data
async function resetFaceData() {
    const confirmed = await customConfirm(
        'This will delete your registered face data. You will need to re-register. Continue?',
        'Reset Face Data'
    );

    if (!confirmed) return;

    if (currentState.currentUser) {
        const employee = currentState.employees.find(e => e.id === currentState.currentUser.id);
        if (employee) {
            employee.faceData = null;
            currentState.currentUser.faceData = null;
            saveState();
            await customAlert('Face data has been reset.', 'Success', 'success');
        }
    }
}

console.log('✅ helpers.js loaded successfully');
