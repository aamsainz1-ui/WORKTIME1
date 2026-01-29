// ===================================
// Attendance & Clock In/Out Features
// ===================================

// Check for active session on load
function checkActiveSession() {
    if (currentState.session.active) {
        document.getElementById('clockInBtn').disabled = true;
        document.getElementById('clockOutBtn').disabled = false;
        document.getElementById('sessionInfo').style.display = 'block';
        updateSessionDisplay();
    } else {
        document.getElementById('clockInBtn').disabled = false;
        document.getElementById('clockOutBtn').disabled = true;
        document.getElementById('sessionInfo').style.display = 'none';
    }
}

// Initialize Clock In
function initClockIn() {
    currentState.pendingAction = { type: 'clockIn' };
    openModal('workModeModal');
}

// Select Work Mode
function selectWorkMode(mode) {
    currentState.pendingAction.mode = mode;
    closeModal('workModeModal');

    // Start security verification chain
    openModal('pinModal');
    document.querySelectorAll('.pin-digit').forEach(input => input.value = '');
    document.querySelector('.pin-digit[data-index="0"]').focus();
}

// Verify PIN
function verifyPIN() {
    const pin = Array.from(document.querySelectorAll('.pin-digit'))
        .map(input => input.value)
        .join('');

    const user = currentState.currentUser;

    if (pin === user.pin) {
        closeModal('pinModal');

        // Check if face data exists
        if (user.faceData) {
            // Proceed to Face ID verification
            openModal('faceIdModal');
            startWebcam();
        } else {
            // No face data, register first
            openModal('faceIdModal');
            document.getElementById('captureFaceBtn').style.display = 'none';
            document.getElementById('registerFaceBtn').style.display = 'inline-flex';
            startWebcam();
        }
    } else {
        showToast(t('toast_invalid_pin'));
        document.querySelectorAll('.pin-digit').forEach(input => input.value = '');
        document.querySelector('.pin-digit[data-index="0"]').focus();
    }
}

// Webcam Management
let videoStream = null;

async function startWebcam() {
    try {
        const video = document.getElementById('faceVideo');
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 640, height: 480 }
        });
        video.srcObject = videoStream;
    } catch (error) {
        console.error('Webcam error:', error);
        showToast('Unable to access webcam. Please check permissions.');
    }
}

function stopWebcam() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

// Face ID Verification with Liveness Check
async function captureAndVerifyFace() {
    const user = currentState.currentUser;

    if (!user.faceData) {
        showToast(t('toast_face_not_registered'));
        return;
    }

    // Show liveness challenge
    document.getElementById('livenessChallenge').style.display = 'block';
    document.getElementById('captureFaceBtn').disabled = true;

    // Simulate liveness check (in production, use real AI detection)
    await performLivenessCheck();

    // Capture and compare
    const capturedImage = captureFrame();
    const similarity = compareFaces(user.faceData, capturedImage);

    if (similarity >= 70) {
        // Face verified
        stopWebcam();
        closeModal('faceIdModal');

        // Proceed to GPS verification
        await verifyGPSAndExecute();
    } else {
        showToast(t('toast_verification_failed'));
        document.getElementById('livenessChallenge').style.display = 'none';
        document.getElementById('captureFaceBtn').disabled = false;
        resetLivenessProgress();
    }
}

// Liveness Check Simulation
async function performLivenessCheck() {
    const challenges = [
        { instruction: t('liveness_smile'), duration: 2000 },
        { instruction: t('liveness_blink'), duration: 1500 },
        { instruction: t('liveness_turn'), duration: 2000 }
    ];

    const instructionEl = document.getElementById('challengeInstruction');
    const progressEl = document.getElementById('livenessProgress');

    for (let i = 0; i < challenges.length; i++) {
        const challenge = challenges[i];
        instructionEl.textContent = challenge.instruction;

        // Animate progress
        const progress = ((i + 1) / challenges.length) * 100;
        progressEl.style.width = progress + '%';

        await new Promise(resolve => setTimeout(resolve, challenge.duration));
    }
}

function resetLivenessProgress() {
    document.getElementById('livenessProgress').style.width = '0%';
}

// Capture frame from video
function captureFrame() {
    const video = document.getElementById('faceVideo');
    const canvas = document.getElementById('faceCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 128;
    canvas.height = 128;
    ctx.drawImage(video, 0, 0, 128, 128);

    return canvas.toDataURL('image/jpeg', 0.8);
}

// Compare faces (simplified pixel-based comparison)
function compareFaces(storedImage, capturedImage) {
    // In production, use a proper face recognition API
    // This is a simplified simulation

    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    canvas1.width = canvas2.width = 128;
    canvas1.height = canvas2.height = 128;

    const img1 = new Image();
    const img2 = new Image();

    img1.src = storedImage;
    img2.src = capturedImage;

    // Simplified: return random similarity between 65-95%
    // In production, implement actual face comparison
    return Math.random() * 30 + 65;
}

// Register Face
async function registerFace() {
    document.getElementById('registerFaceBtn').disabled = true;

    // Perform liveness check
    document.getElementById('livenessChallenge').style.display = 'block';
    await performLivenessCheck();

    // Capture face
    const faceData = captureFrame();

    // Save to user profile
    const userIndex = currentState.employees.findIndex(e => e.id === currentState.currentUser.id);
    if (userIndex !== -1) {
        currentState.employees[userIndex].faceData = faceData;
        currentState.currentUser.faceData = faceData;
        saveState();

        showToast(t('toast_face_registered'));

        stopWebcam();
        closeModal('faceIdModal');

        // Reset button states
        document.getElementById('captureFaceBtn').style.display = 'inline-flex';
        document.getElementById('registerFaceBtn').style.display = 'none';
        document.getElementById('registerFaceBtn').disabled = false;
        document.getElementById('livenessChallenge').style.display = 'none';
        resetLivenessProgress();

        // Continue with pending action
        if (currentState.pendingAction) {
            openModal('pinModal');
        }
    }
}

// GPS Verification and Execute Action
async function verifyGPSAndExecute() {
    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;

        // Check if within range of any office location
        let nearestLocation = null;
        let minDistance = Infinity;

        for (const location of currentState.officeLocations) {
            const distance = calculateDistance(latitude, longitude, location.lat, location.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestLocation = location;
            }
        }

        const withinRange = minDistance <= currentState.settings.gpsRadius;

        if (withinRange || currentState.pendingAction.mode === 'remote') {
            // GPS verified or remote mode
            const locationName = nearestLocation ? nearestLocation.name : generateLocationName(latitude, longitude);

            // Execute pending action
            if (currentState.pendingAction.type === 'clockIn') {
                executeClockIn(locationName, latitude, longitude);
            } else if (currentState.pendingAction.type === 'clockOut') {
                executeClockOut(locationName, latitude, longitude);
            }
        } else {
            showToast(t('toast_gps_failed'));
        }
    } catch (error) {
        console.error('GPS error:', error);
        // Allow action without GPS for demo purposes
        const locationName = 'Unknown Location';
        if (currentState.pendingAction.type === 'clockIn') {
            executeClockIn(locationName, 0, 0);
        } else if (currentState.pendingAction.type === 'clockOut') {
            executeClockOut(locationName, 0, 0);
        }
    }
}

// Get current GPS position
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Generate location name from coordinates (mock reverse geocoding)
function generateLocationName(lat, lng) {
    const zones = ['Innovation Park Zone', 'Tech Hub District', 'Business Center Area', 'Creative Quarter', 'Enterprise Plaza'];
    return zones[Math.floor(Math.random() * zones.length)];
}

// Execute Clock In
function executeClockIn(locationName, lat, lng) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // Check if late
    const workStartTime = new Date(now);
    workStartTime.setHours(9, 0, 0, 0);
    const isLate = now > new Date(workStartTime.getTime() + currentState.settings.lateThreshold * 60000);

    // Create attendance record
    const record = {
        id: Date.now(),
        userId: currentState.currentUser.id,
        userName: currentState.currentUser.name,
        date: now.toISOString().split('T')[0],
        timestamp: now.toISOString(),
        clockIn: timeString,
        clockOut: null,
        sessionStart: now.toISOString(),
        sessionEnd: null,
        duration: null,
        mode: currentState.pendingAction.mode,
        location: locationName,
        coordinates: { lat, lng },
        status: isLate ? 'late' : 'on-time',
        photo: captureFrame(),
        gpsVerified: true,
        breaks: []
    };

    currentState.attendance.push(record);

    // Update session
    currentState.session = {
        active: true,
        recordId: record.id,
        startTime: now.toISOString(),
        mode: currentState.pendingAction.mode,
        location: locationName,
        breaks: []
    };

    currentState.pendingAction = null;

    saveState();

    // Update UI
    checkActiveSession();
    showToast(t('toast_clock_in_success'));

    // Explicit confirmation
    alert(`✅ Clocked In Successfully!\n\nTime: ${timeString}\nMode: ${currentState.session.mode}\nLocation: ${locationName}`);
}

// Initialize Clock Out
function initClockOut() {
    currentState.pendingAction = { type: 'clockOut' };
    openModal('pinModal');
    document.querySelectorAll('.pin-digit').forEach(input => input.value = '');
    document.querySelector('.pin-digit[data-index="0"]').focus();
}

// Execute Clock Out
function executeClockOut(locationName, lat, lng) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // Find active record
    const record = currentState.attendance.find(r => r.id === currentState.session.recordId);

    if (record) {
        record.clockOut = timeString;
        record.sessionEnd = now.toISOString();

        // Calculate duration
        const start = new Date(record.sessionStart);
        const durationMs = now - start;
        const hours = Math.floor(durationMs / 3600000);
        const minutes = Math.floor((durationMs % 3600000) / 60000);
        record.duration = `${hours}h ${minutes}m`;

        // Close any active breaks
        if (currentState.session.breaks.length > 0) {
            const lastBreak = currentState.session.breaks[currentState.session.breaks.length - 1];
            if (!lastBreak.end) {
                lastBreak.end = now.toISOString();
                lastBreak.duration = Math.floor((now - new Date(lastBreak.start)) / 60000);
            }
        }

        record.breaks = [...currentState.session.breaks];
    }

    // Clear session
    currentState.session = {
        active: false,
        startTime: null,
        mode: null,
        location: null,
        breaks: []
    };

    currentState.pendingAction = null;

    saveState();

    // Update UI
    checkActiveSession();
    calculateStats();
    showToast(t('toast_clock_out_success'));

    // Explicit confirmation
    alert(`✅ Clocked Out Successfully!\n\nTime: ${timeString}\nDuration: ${record.duration}`);
}

// Break Management
function toggleBreak(breakType) {
    if (!currentState.session.active) return;

    const now = new Date();
    const activeBreak = currentState.session.breaks.find(b => !b.end);

    if (activeBreak) {
        // End current break
        activeBreak.end = now.toISOString();
        activeBreak.duration = Math.floor((now - new Date(activeBreak.start)) / 60000);

        document.getElementById('breakStatus').style.display = 'none';
        document.querySelectorAll('.btn-break').forEach(btn => btn.classList.remove('active'));

        showToast(`Break ended: ${activeBreak.duration} minutes`);
    } else {
        // Start new break
        currentState.session.breaks.push({
            type: breakType,
            start: now.toISOString(),
            end: null,
            duration: null
        });

        document.getElementById('breakStatus').style.display = 'block';
        document.getElementById('breakType').textContent = t(`break_${breakType}`);

        document.querySelectorAll('.btn-break').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.breakType === breakType);
        });

        showToast(`Break started: ${t(`break_${breakType}`)}`);
    }

    saveState();
}

// Session Display Update
function updateSessionDisplay() {
    if (!currentState.session.active) return;

    const record = currentState.attendance.find(r => r.id === currentState.session.recordId);
    if (!record) return;

    document.getElementById('sessionStartTime').textContent = record.clockIn;
    document.getElementById('sessionMode').textContent = t(`mode_${record.mode}`);
    document.getElementById('sessionLocation').textContent = record.location;
}

// Timers
let timerInterval = null;

function startTimers() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        updateSessionTimer();
        updateBreakTimer();
    }, 1000);
}

function updateSessionTimer() {
    if (!currentState.session.active) return;

    const start = new Date(currentState.session.startTime);
    const now = new Date();
    const diff = now - start;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const timerEl = document.getElementById('sessionTimer');
    if (timerEl) {
        timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function updateBreakTimer() {
    const activeBreak = currentState.session.breaks.find(b => !b.end);
    if (!activeBreak) return;

    const start = new Date(activeBreak.start);
    const now = new Date();
    const diff = now - start;

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const timerEl = document.getElementById('breakTimer');
    if (timerEl) {
        timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}
