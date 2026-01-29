// ===================================
// GlobalWork Pro | Enterprise OS
// Main Application Logic - FIXED VERSION
// ===================================

console.log('🚀 GlobalWork Pro Loading...');

// Global State Management
let currentState = {
    currentUser: null,
    employees: [],
    attendance: [],
    leaveRequests: [],
    announcements: [],
    officeLocations: [],
    settings: {
        lateThreshold: 15,
        gpsRadius: 150,
        defaultWorkMode: 'office',
        theme: 'light',
        language: 'th',
        // Work Shift Settings
        shifts: {
            morning: { start: '08:00', end: '17:00', name: 'Morning Shift' },
            night: { start: '20:00', end: '05:00', name: 'Night Shift' }
        }
    },
    session: {
        active: false,
        startTime: null,
        mode: null,
        location: null,
        breaks: []
    },
    pendingAction: null,
    employeeIdCounter: 1001
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    loadState();
    initializeApp();
});

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem('globalwork_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            currentState = { ...currentState, ...parsed };
            console.log('✅ State loaded from localStorage');
        } catch (e) {
            console.error('❌ Failed to load state:', e);
        }
    }
}

// Save state to localStorage
function saveState() {
    try {
        localStorage.setItem('globalwork_state', JSON.stringify(currentState));
        console.log('💾 State saved to localStorage');
    } catch (e) {
        console.error('❌ Failed to save state:', e);
    }
}

// Initialize App
function initializeApp() {
    console.log('🔧 Initializing app...');

    // Initialize demo data first
    initializeDemoData();

    // Apply saved settings
    applyTheme(currentState.settings.theme);
    updateLanguage(currentState.settings.language);

    // Setup event listeners
    setupEventListeners();

    // Check if user is logged in
    if (currentState.currentUser) {
        showMainApp();
    } else {
        showLoginModal();
    }

    console.log('✅ App initialized successfully');
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('🎯 Setting up event listeners...');

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar && mobileMenuToggle) {
            if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                sidebar.classList.remove('expanded');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            if (section) {
                showSection(section);
            }

            // Auto-close mobile sidebar
            if (window.innerWidth <= 900 && sidebar && mobileMenuToggle) {
                sidebar.classList.remove('expanded');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Clock In/Out
    const clockInBtn = document.getElementById('clockInBtn');
    const clockOutBtn = document.getElementById('clockOutBtn');
    if (clockInBtn) clockInBtn.addEventListener('click', () => initClockIn());
    if (clockOutBtn) clockOutBtn.addEventListener('click', () => initClockOut());

    // Break buttons
    const restroomBreakBtn = document.getElementById('restroomBreakBtn');
    const coffeeBreakBtn = document.getElementById('coffeeBreakBtn');
    if (restroomBreakBtn) restroomBreakBtn.addEventListener('click', () => toggleBreak('restroom'));
    if (coffeeBreakBtn) coffeeBreakBtn.addEventListener('click', () => toggleBreak('coffee'));

    // Leave request
    const requestLeaveBtn = document.getElementById('requestLeaveBtn');
    const leaveRequestForm = document.getElementById('leaveRequestForm');
    const cancelLeaveBtn = document.getElementById('cancelLeaveBtn');
    if (requestLeaveBtn) requestLeaveBtn.addEventListener('click', () => openModal('leaveRequestModal'));
    if (leaveRequestForm) leaveRequestForm.addEventListener('submit', submitLeaveRequest);
    if (cancelLeaveBtn) cancelLeaveBtn.addEventListener('click', () => closeModal('leaveRequestModal'));

    // Export attendance
    const exportAttendanceBtn = document.getElementById('exportAttendanceBtn');
    if (exportAttendanceBtn) exportAttendanceBtn.addEventListener('click', exportAttendanceToCSV);

    // AI Insights
    const generateInsightsBtn = document.getElementById('generateInsightsBtn');
    if (generateInsightsBtn) generateInsightsBtn.addEventListener('click', generateAIInsights);

    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab));
    });

    // Settings
    const themeSelect = document.getElementById('themeSelect');
    const languageSelect = document.getElementById('languageSelect');
    const workModeSelect = document.getElementById('workModeSelect');

    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            applyTheme(e.target.value);
            currentState.settings.theme = e.target.value;
            saveState();
        });
    }

    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
            currentState.settings.language = e.target.value;
            saveState();
        });
    }

    if (workModeSelect) {
        workModeSelect.addEventListener('change', (e) => {
            currentState.settings.defaultWorkMode = e.target.value;
            saveState();
        });
    }

    const changePinBtn = document.getElementById('changePinBtn');
    const resetFaceBtn = document.getElementById('resetFaceBtn');
    if (changePinBtn) changePinBtn.addEventListener('click', changePIN);
    if (resetFaceBtn) resetFaceBtn.addEventListener('click', resetFaceData);

    // Admin actions
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const cancelEmployeeBtn = document.getElementById('cancelEmployeeBtn');

    if (addEmployeeBtn) addEmployeeBtn.addEventListener('click', () => openModal('addEmployeeModal'));
    if (addEmployeeForm) addEmployeeForm.addEventListener('submit', addEmployee);
    if (cancelEmployeeBtn) cancelEmployeeBtn.addEventListener('click', () => closeModal('addEmployeeModal'));

    const addLocationBtn = document.getElementById('addLocationBtn');
    const addLocationForm = document.getElementById('addLocationForm');
    const cancelLocationBtn = document.getElementById('cancelLocationBtn');

    if (addLocationBtn) addLocationBtn.addEventListener('click', () => openAddLocationModal());
    if (addLocationForm) addLocationForm.addEventListener('submit', addLocation);
    if (cancelLocationBtn) cancelLocationBtn.addEventListener('click', () => closeModal('addLocationModal'));

    const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
    const addAnnouncementForm = document.getElementById('addAnnouncementForm');
    const cancelAnnouncementBtn = document.getElementById('cancelAnnouncementBtn');

    if (addAnnouncementBtn) addAnnouncementBtn.addEventListener('click', () => openModal('addAnnouncementModal'));
    if (addAnnouncementForm) addAnnouncementForm.addEventListener('submit', addAnnouncement);
    if (cancelAnnouncementBtn) cancelAnnouncementBtn.addEventListener('click', () => closeModal('addAnnouncementModal'));

    const saveSystemSettingsBtn = document.getElementById('saveSystemSettingsBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataBtn = document.getElementById('importDataBtn');
    const resetSystemBtn = document.getElementById('resetSystemBtn');

    if (saveSystemSettingsBtn) saveSystemSettingsBtn.addEventListener('click', saveSystemSettings);
    if (exportDataBtn) exportDataBtn.addEventListener('click', exportAllData);
    if (importDataBtn) importDataBtn.addEventListener('click', importData);
    if (resetSystemBtn) resetSystemBtn.addEventListener('click', resetSystem);

    // PIN Modal
    const cancelPinBtn = document.getElementById('cancelPinBtn');
    const verifyPinBtn = document.getElementById('verifyPinBtn');

    if (cancelPinBtn) {
        cancelPinBtn.addEventListener('click', () => {
            closeModal('pinModal');
            currentState.pendingAction = null;
        });
    }
    if (verifyPinBtn) verifyPinBtn.addEventListener('click', verifyPIN);

    // PIN input auto-focus
    document.querySelectorAll('.pin-digit').forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < 3) {
                const nextInput = document.querySelector(`.pin-digit[data-index="${index + 1}"]`);
                if (nextInput) nextInput.focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                const prevInput = document.querySelector(`.pin-digit[data-index="${index - 1}"]`);
                if (prevInput) prevInput.focus();
            }
        });
    });

    // Face ID Modal
    const cancelFaceBtn = document.getElementById('cancelFaceBtn');
    const captureFaceBtn = document.getElementById('captureFaceBtn');
    const registerFaceBtn = document.getElementById('registerFaceBtn');

    if (cancelFaceBtn) {
        cancelFaceBtn.addEventListener('click', () => {
            stopWebcam();
            closeModal('faceIdModal');
            currentState.pendingAction = null;
        });
    }
    if (captureFaceBtn) captureFaceBtn.addEventListener('click', captureAndVerifyFace);
    if (registerFaceBtn) registerFaceBtn.addEventListener('click', registerFace);

    // Work Mode Modal
    document.querySelectorAll('.mode-option').forEach(option => {
        option.addEventListener('click', () => selectWorkMode(option.dataset.mode));
    });

    console.log('✅ Event listeners set up');
}

// Show/Hide Sections
function showSection(sectionName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });

    // Update breadcrumb
    const breadcrumb = document.getElementById('currentSection');
    const navItem = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
    if (breadcrumb && navItem) {
        const navLabel = navItem.querySelector('.nav-label');
        if (navLabel) {
            breadcrumb.textContent = navLabel.textContent;
        }
    }

    // Show section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Load section data
    loadSectionData(sectionName);
}

// Load section-specific data
function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            if (typeof updateDashboard === 'function') updateDashboard();
            break;
        case 'attendance':
            if (typeof renderAttendanceTable === 'function') renderAttendanceTable();
            break;
        case 'leave':
            if (typeof updateLeaveQuotas === 'function') updateLeaveQuotas();
            if (typeof renderLeaveHistory === 'function') renderLeaveHistory();
            break;
        case 'team':
            if (typeof renderTeamStatus === 'function') renderTeamStatus();
            break;
        case 'admin':
            if (typeof renderEmployeeTable === 'function') renderEmployeeTable();
            if (typeof renderApprovalTable === 'function') renderApprovalTable();
            if (typeof renderAnnouncements === 'function') renderAnnouncements();
            if (typeof renderLocations === 'function') renderLocations();
            break;
    }
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Toast Notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// Theme Management
function toggleTheme() {
    const currentTheme = currentState.settings.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    currentState.settings.theme = newTheme;
    saveState();
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('.theme-icon');
            if (themeIcon) themeIcon.textContent = '☀️';
        }
    } else {
        document.body.classList.remove('dark-mode');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const themeIcon = themeToggle.querySelector('.theme-icon');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
    }
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = theme;
}

// Language Management
function toggleLanguage() {
    const currentLang = currentState.settings.language;
    const newLang = currentLang === 'th' ? 'en' : 'th';
    updateLanguage(newLang);
    currentState.settings.language = newLang;
    saveState();
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) langText.textContent = newLang.toUpperCase();
    }
}

// Login System
function showLoginModal() {
    renderUserSelect();
    openModal('loginModal');

    const showSetupBtn = document.getElementById('showSetupBtn');
    if (showSetupBtn) {
        showSetupBtn.addEventListener('click', () => {
            closeModal('loginModal');
            openModal('addEmployeeModal');
        });
    }
}

function renderUserSelect() {
    const container = document.getElementById('userSelect');
    if (!container) return;

    container.innerHTML = '';

    if (currentState.employees.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No employees found. Please set up your account.</p>';
        return;
    }

    currentState.employees.forEach(emp => {
        const option = document.createElement('div');
        option.className = 'user-option';
        option.innerHTML = `
            <div class="user-option-avatar">👤</div>
            <div class="user-option-name">${emp.name}</div>
            <div class="user-option-role">${emp.role}</div>
        `;
        option.addEventListener('click', () => selectUser(emp));
        container.appendChild(option);
    });
}

function selectUser(employee) {
    currentState.currentUser = employee;
    closeModal('loginModal');
    showMainApp();
}

function showMainApp() {
    const user = currentState.currentUser;
    if (!user) return;

    // Update user badge
    const userNameEl = document.getElementById('currentUserName');
    if (userNameEl) {
        userNameEl.textContent = user.name;
    }

    // Show/hide admin sections
    if (user.role === 'admin' || user.role === 'owner') {
        document.body.classList.add('is-admin');
    }
    if (user.role === 'owner') {
        document.body.classList.add('is-owner');
    }

    // Load dashboard
    showSection('dashboard');

    // Check for active session
    if (typeof checkActiveSession === 'function') checkActiveSession();

    // Start timers
    if (typeof startTimers === 'function') startTimers();
}

function logout() {
    const confirmMsg = (typeof t === 'function') ? t('confirm_logout') : 'Are you sure you want to logout?';
    if (confirm(confirmMsg)) {
        currentState.currentUser = null;
        currentState.session = { active: false, startTime: null, mode: null, location: null, breaks: [] };
        document.body.classList.remove('is-admin', 'is-owner');
        saveState();
        showLoginModal();
    }
}

// Initialize demo data if no employees exist
function initializeDemoData() {
    if (currentState.employees.length === 0) {
        console.log('📦 Initializing demo data...');

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
        console.log('✅ Demo data initialized!');
        console.log('👤 Demo Account - Username: Admin User, PIN: 1234');
    }
}

console.log('✅ app.js loaded successfully');
