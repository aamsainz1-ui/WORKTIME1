// ===================================
// Dashboard, Analytics & AI Features
// ===================================

// Update Dashboard
function updateDashboard() {
    calculateStats();
    renderWeeklyChart();
}

// Calculate Statistics
function calculateStats() {
    const user = currentState.currentUser;
    if (!user) return;

    const userRecords = currentState.attendance.filter(r => r.userId === user.id);

    // This week hours
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekRecords = userRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate >= weekStart && r.duration;
    });

    let totalMinutes = 0;
    weekRecords.forEach(r => {
        if (r.duration) {
            const match = r.duration.match(/(\d+)h\s*(\d+)m/);
            if (match) {
                totalMinutes += parseInt(match[1]) * 60 + parseInt(match[2]);
            }
        }
    });

    const weekHours = Math.floor(totalMinutes / 60);
    const weekMins = totalMinutes % 60;

    document.getElementById('statWeekHours').textContent = `${weekHours}h ${weekMins}m`;

    // Productivity Score
    const avgHoursPerDay = totalMinutes / 60 / 7;
    const productivityScore = Math.min(100, Math.round((avgHoursPerDay / 8) * 100));
    document.getElementById('statProductivity').textContent = productivityScore + '%';

    // Leave Balance
    const leaveQuota = user.leaveQuota || { vacation: { total: 10, remaining: 10 } };
    const totalRemaining = (leaveQuota.vacation?.remaining || 0) +
        (leaveQuota.sick?.remaining || 0) +
        (leaveQuota.personal?.remaining || 0);
    document.getElementById('statLeaveBalance').textContent = totalRemaining;

    // Work-Life Balance Score
    const lateCount = weekRecords.filter(r => r.status === 'late').length;
    const overtimeCount = weekRecords.filter(r => {
        if (!r.duration) return false;
        const match = r.duration.match(/(\d+)h/);
        return match && parseInt(match[1]) > 8;
    }).length;

    const balanceScore = Math.max(0, 100 - (lateCount * 10) - (overtimeCount * 5));
    document.getElementById('statWorkLife').textContent = balanceScore + '%';
}

// Render Weekly Chart
function renderWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const user = currentState.currentUser;

    // Get last 7 days data
    const days = [];
    const hours = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayRecords = currentState.attendance.filter(r =>
            r.userId === user.id && r.date === dateStr && r.duration
        );

        let totalMinutes = 0;
        dayRecords.forEach(r => {
            const match = r.duration.match(/(\d+)h\s*(\d+)m/);
            if (match) {
                totalMinutes += parseInt(match[1]) * 60 + parseInt(match[2]);
            }
        });

        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        hours.push(totalMinutes / 60);
    }

    // Simple bar chart
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    const padding = 40;
    const barWidth = (width - padding * 2) / days.length;
    const maxHours = Math.max(...hours, 8);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw bars
    hours.forEach((h, i) => {
        const barHeight = (h / maxHours) * (height - padding * 2);
        const x = padding + i * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;

        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);

        // Value label
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main');
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(h.toFixed(1) + 'h', x + barWidth * 0.4, y - 5);

        // Day label
        ctx.fillText(days[i], x + barWidth * 0.4, height - padding + 20);
    });

    // Draw baseline
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
}

// Render Attendance Table
function renderAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;

    const user = currentState.currentUser;
    const userRecords = currentState.attendance
        .filter(r => r.userId === user.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (userRecords.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">${t('no_records')}</td></tr>`;
        return;
    }

    tbody.innerHTML = userRecords.map(record => `
        <tr>
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.clockIn}</td>
            <td>${record.clockOut || '--'}</td>
            <td>${record.duration || '--'}</td>
            <td>${t('mode_' + record.mode)}</td>
            <td>${record.location}</td>
            <td><span class="status-badge ${record.status}">${t('status_' + record.status.replace('-', '_'))}</span></td>
            <td>
                <div class="verification-icons">
                    ${record.photo ? '<span class="verification-icon" title="Face ID">📸</span>' : ''}
                    ${record.gpsVerified ? '<span class="verification-icon" title="GPS">📍</span>' : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Export Attendance to CSV
function exportAttendanceToCSV() {
    const user = currentState.currentUser;
    const records = currentState.attendance.filter(r => r.userId === user.id);

    if (records.length === 0) {
        showToast('No records to export');
        return;
    }

    // CSV Headers
    let csv = 'Date,Clock In,Clock Out,Duration,Mode,Location,Status,Face ID,GPS\n';

    // CSV Data
    records.forEach(r => {
        csv += `${r.date},${r.clockIn},${r.clockOut || ''},${r.duration || ''},${r.mode},${r.location},${r.status},${r.photo ? 'Yes' : 'No'},${r.gpsVerified ? 'Yes' : 'No'}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${user.name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Attendance exported successfully!');
}

// AI Insights Generation
async function generateAIInsights() {
    const btn = document.getElementById('generateInsightsBtn');
    const insightsEl = document.getElementById('aiInsights');
    const recommendationsEl = document.getElementById('aiRecommendations');

    btn.disabled = true;
    btn.textContent = 'Generating...';

    insightsEl.innerHTML = '<p style="text-align: center;">🤖 Analyzing your work patterns...</p>';
    recommendationsEl.innerHTML = '<p style="text-align: center;">🤖 Generating recommendations...</p>';

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const user = currentState.currentUser;
    const userRecords = currentState.attendance.filter(r => r.userId === user.id && r.duration);

    // Calculate insights
    const totalDays = userRecords.length;
    const lateDays = userRecords.filter(r => r.status === 'late').length;
    const remoteDays = userRecords.filter(r => r.mode === 'remote').length;

    let totalMinutes = 0;
    userRecords.forEach(r => {
        const match = r.duration.match(/(\d+)h\s*(\d+)m/);
        if (match) {
            totalMinutes += parseInt(match[1]) * 60 + parseInt(match[2]);
        }
    });

    const avgHours = totalMinutes / 60 / Math.max(totalDays, 1);

    // Generate insights
    const insights = `
        <h4>📊 Work Pattern Analysis</h4>
        <ul style="line-height: 2;">
            <li><strong>Total Work Days:</strong> ${totalDays} days</li>
            <li><strong>Average Hours/Day:</strong> ${avgHours.toFixed(1)} hours</li>
            <li><strong>On-Time Rate:</strong> ${totalDays > 0 ? Math.round((1 - lateDays / totalDays) * 100) : 0}%</li>
            <li><strong>Remote Work:</strong> ${remoteDays} days (${totalDays > 0 ? Math.round(remoteDays / totalDays * 100) : 0}%)</li>
        </ul>
        <p style="margin-top: 16px; padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
            <strong>💡 AI Insight:</strong> ${getAIInsight(avgHours, lateDays, totalDays)}
        </p>
    `;

    const recommendations = `
        <h4>🎯 Personalized Recommendations</h4>
        <ul style="line-height: 2;">
            ${getRecommendations(avgHours, lateDays, totalDays, remoteDays)}
        </ul>
    `;

    insightsEl.innerHTML = insights;
    recommendationsEl.innerHTML = recommendations;

    btn.disabled = false;
    btn.textContent = t('btn_generate_insights');
}

function getAIInsight(avgHours, lateDays, totalDays) {
    if (avgHours > 9) {
        return "You're working above average hours. Consider taking breaks to maintain productivity and avoid burnout.";
    } else if (avgHours < 6) {
        return "Your work hours are below the standard. Try to maintain consistent work schedules for better productivity.";
    } else if (lateDays / totalDays > 0.3) {
        return "You have a high late arrival rate. Consider adjusting your morning routine for better punctuality.";
    } else {
        return "Great work-life balance! You're maintaining healthy work hours and good punctuality.";
    }
}

function getRecommendations(avgHours, lateDays, totalDays, remoteDays) {
    const recs = [];

    if (avgHours > 9) {
        recs.push('<li>⏰ <strong>Time Management:</strong> Try to complete tasks within standard hours (8h/day)</li>');
        recs.push('<li>🧘 <strong>Wellness:</strong> Take regular breaks to maintain mental health</li>');
    }

    if (lateDays / totalDays > 0.2) {
        recs.push('<li>🌅 <strong>Morning Routine:</strong> Set an earlier alarm to improve punctuality</li>');
    }

    if (remoteDays / totalDays < 0.2) {
        recs.push('<li>🏠 <strong>Flexibility:</strong> Consider remote work options for better work-life balance</li>');
    }

    if (avgHours >= 7 && avgHours <= 9 && lateDays / totalDays < 0.2) {
        recs.push('<li>✅ <strong>Keep it up!</strong> Your work patterns are excellent</li>');
        recs.push('<li>🎯 <strong>Goal:</strong> Maintain this healthy balance</li>');
    }

    recs.push('<li>📈 <strong>Productivity Tip:</strong> Use the Pomodoro technique (25min work, 5min break)</li>');

    return recs.join('');
}

// Leave Management
function updateLeaveQuotas() {
    const user = currentState.currentUser;
    if (!user) return;

    const quota = user.leaveQuota || {
        vacation: { total: 10, remaining: 10 },
        sick: { total: 15, remaining: 15 },
        personal: { total: 5, remaining: 5 }
    };

    document.getElementById('vacationTotal').textContent = quota.vacation.total;
    document.getElementById('vacationRemaining').textContent = quota.vacation.remaining;
    document.getElementById('sickTotal').textContent = quota.sick.total;
    document.getElementById('sickRemaining').textContent = quota.sick.remaining;
    document.getElementById('personalTotal').textContent = quota.personal.total;
    document.getElementById('personalRemaining').textContent = quota.personal.remaining;
}

function renderLeaveHistory() {
    const tbody = document.getElementById('leaveTableBody');
    if (!tbody) return;

    const user = currentState.currentUser;
    const userRequests = currentState.leaveRequests
        .filter(r => r.userId === user.id)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    if (userRequests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">${t('no_requests')}</td></tr>`;
        return;
    }

    tbody.innerHTML = userRequests.map(req => `
        <tr>
            <td>${t('leave_' + req.type)}</td>
            <td>${new Date(req.startDate).toLocaleDateString()}</td>
            <td>${new Date(req.endDate).toLocaleDateString()}</td>
            <td>${req.days}</td>
            <td>${req.reason}</td>
            <td><span class="status-badge ${req.status}">${t('status_' + req.status)}</span></td>
        </tr>
    `).join('');
}

function submitLeaveRequest(e) {
    e.preventDefault();

    const type = document.getElementById('leaveType').value;
    const startDate = document.getElementById('leaveStartDate').value;
    const endDate = document.getElementById('leaveEndDate').value;
    const reason = document.getElementById('leaveReason').value;

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const request = {
        id: Date.now(),
        userId: currentState.currentUser.id,
        userName: currentState.currentUser.name,
        type,
        startDate,
        endDate,
        days,
        reason,
        status: 'pending',
        submittedAt: new Date().toISOString()
    };

    currentState.leaveRequests.push(request);
    saveState();

    closeModal('leaveRequestModal');
    document.getElementById('leaveRequestForm').reset();

    renderLeaveHistory();
    showToast(t('toast_leave_submitted'));
}

// Team Status
function renderTeamStatus() {
    const container = document.getElementById('teamGrid');
    if (!container) return;

    container.innerHTML = '';

    currentState.employees.forEach(emp => {
        const status = getEmployeeStatus(emp);

        const card = document.createElement('div');
        card.className = 'team-member-card';
        card.innerHTML = `
            <div class="member-avatar">👤</div>
            <div class="member-info">
                <div class="member-name">${emp.name}</div>
                <div class="member-position">${emp.position}</div>
                <div class="member-status">
                    <span class="status-badge ${status.class}">${status.text}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function getEmployeeStatus(employee) {
    // Check if currently working
    const activeSession = currentState.attendance.find(r =>
        r.userId === employee.id &&
        r.sessionStart &&
        !r.sessionEnd
    );

    if (activeSession) {
        return { class: 'active', text: t('status_working') };
    }

    // Check if on leave today
    const today = new Date().toISOString().split('T')[0];
    const onLeave = currentState.leaveRequests.find(r =>
        r.userId === employee.id &&
        r.status === 'approved' &&
        r.startDate <= today &&
        r.endDate >= today
    );

    if (onLeave) {
        return { class: 'pending', text: t('status_on_leave') };
    }

    return { class: 'inactive', text: t('status_offline') };
}
