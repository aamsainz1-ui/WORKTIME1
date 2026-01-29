// GlobalWork Pro - Multi-language Translation System
// Supports: Thai (TH) and English (EN)

const translations = {
    en: {
        // Navigation
        enterprise_os: "Enterprise OS",
        nav_dashboard: "Dashboard",
        nav_attendance: "Attendance",
        nav_leave: "Leave Management",
        nav_team: "Team Status",
        nav_ai_insights: "AI Insights",
        nav_admin: "Admin Console",
        nav_settings: "Settings",
        btn_logout: "Logout",

        // Dashboard
        dashboard_title: "Dashboard",
        dashboard_subtitle: "Your work overview at a glance",
        action_clock_in: "Clock In",
        action_clock_in_desc: "Start your work session",
        action_clock_out: "Clock Out",
        action_clock_out_desc: "End your work session",

        current_session: "Current Session",
        status_active: "Active",
        clock_in_time: "Clock In",
        work_mode: "Mode",
        location: "Location",
        duration: "Duration",

        break_restroom: "Restroom",
        break_coffee: "Coffee Break",
        on_break: "On Break",

        stat_this_week: "This Week",
        stat_hours_worked: "Hours Worked",
        stat_productivity: "Productivity",
        stat_weekly_score: "Weekly Score",
        stat_leave_balance: "Leave Balance",
        stat_days_remaining: "Days Remaining",
        stat_work_life: "Work-Life Balance",
        stat_balance_score: "Balance Score",

        chart_weekly_hours: "Weekly Work Hours",

        // Attendance
        attendance_title: "Attendance History",
        attendance_subtitle: "View your complete attendance records",
        btn_export_csv: "Export to CSV",

        table_date: "Date",
        table_clock_in: "Clock In",
        table_clock_out: "Clock Out",
        table_duration: "Duration",
        table_mode: "Mode",
        table_location: "Location",
        table_status: "Status",
        table_verification: "Verification",
        no_records: "No records found",

        // Leave Management
        leave_title: "Leave Management",
        leave_subtitle: "Request and manage your time off",
        leave_vacation: "Vacation Leave",
        leave_sick: "Sick Leave",
        leave_personal: "Personal Leave",
        days_remaining: "Days Remaining",
        btn_request_leave: "Request Leave",
        leave_history: "Leave History",

        table_type: "Type",
        table_start_date: "Start Date",
        table_end_date: "End Date",
        table_days: "Days",
        table_reason: "Reason",
        table_status: "Status",
        no_requests: "No leave requests",

        // Team Status
        team_title: "Team Status Directory",
        team_subtitle: "See who's working, on leave, or offline",

        // AI Insights
        ai_title: "AI Work Insights",
        ai_subtitle: "Powered by Gemini AI",
        ai_analysis: "Work Pattern Analysis",
        ai_productivity: "Productivity Recommendations",
        ai_loading: "Analyzing your work patterns...",
        ai_no_data: "Click generate to get personalized recommendations",
        btn_generate_insights: "Generate Insights",

        // Admin Console
        admin_title: "Admin Console",
        admin_subtitle: "Manage employees, approvals, and system settings",
        admin_tab_employees: "Employees",
        admin_tab_approvals: "Leave Approvals",
        admin_tab_announcements: "Announcements",
        admin_tab_locations: "Office Locations",
        admin_tab_system: "System",

        btn_add_employee: "Add Employee",
        table_id: "ID",
        table_name: "Name",
        table_department: "Department",
        table_position: "Position",
        table_role: "Role",
        table_actions: "Actions",

        table_employee: "Employee",
        table_dates: "Dates",

        btn_add_announcement: "Add Announcement",
        btn_add_location: "Add Office Location",

        system_settings: "System Settings",
        setting_late_threshold: "Late Threshold (minutes)",
        setting_gps_radius: "GPS Verification Radius (meters)",
        btn_save_settings: "Save Settings",

        data_management: "Data Management",
        btn_export_data: "Export All Data",
        btn_import_data: "Import Data",
        btn_reset_system: "Reset System",

        // Settings
        settings_title: "Settings",
        settings_subtitle: "Manage your personal preferences",
        setting_appearance: "Appearance",
        setting_theme: "Theme",
        theme_light: "Light",
        theme_dark: "Dark",
        setting_language: "Language",

        setting_security: "Security",
        setting_change_pin: "Change PIN",
        btn_change_pin: "Change PIN",
        setting_reset_face: "Reset Face Data",
        btn_reset_face: "Reset Biometric",

        setting_work_mode: "Work Mode Preference",
        setting_default_mode: "Default Mode",
        mode_office: "Office",
        mode_remote: "Remote",

        // Modals
        login_title: "Welcome to GlobalWork Pro",
        login_subtitle: "Select your profile to continue",
        btn_first_time: "First time? Set up your account",

        pin_title: "Enter Your PIN",
        pin_subtitle: "Verify your identity",
        btn_cancel: "Cancel",
        btn_verify: "Verify",

        faceid_title: "Face ID Verification",
        faceid_subtitle: "Position your face in the frame",
        liveness_title: "Liveness Check",
        liveness_smile: "Please smile! 😊",
        liveness_blink: "Please blink! 👁️",
        liveness_turn: "Turn your head slightly! ↔️",
        btn_capture: "Capture",
        btn_register: "Register Face",

        workmode_title: "Select Work Mode",
        workmode_subtitle: "Choose how you're working today",

        leave_request_title: "Request Leave",
        form_leave_type: "Leave Type",
        form_start_date: "Start Date",
        form_end_date: "End Date",
        form_reason: "Reason",
        btn_submit: "Submit Request",

        add_employee_title: "Add Employee",
        form_name: "Name",
        form_department: "Department",
        form_position: "Position",
        form_role: "Role",
        role_staff: "Staff",
        role_admin: "Admin",
        role_owner: "Owner",
        form_pin: "PIN (4 digits)",
        btn_add: "Add Employee",

        add_location_title: "Add Office Location",
        form_location_name: "Location Name",
        form_coordinates: "Select Location on Map",
        form_latitude: "Latitude",
        form_longitude: "Longitude",

        add_announcement_title: "Add Announcement",
        form_title: "Title",
        form_message: "Message",
        form_priority: "Priority",
        priority_normal: "Normal",
        priority_important: "Important",
        priority_urgent: "Urgent",
        btn_publish: "Publish",

        // Status Messages
        status_working: "Working",
        status_on_leave: "On Leave",
        status_offline: "Offline",
        status_on_break: "On Break",

        // Toast Messages
        toast_clock_in_success: "Clocked in successfully!",
        toast_clock_out_success: "Clocked out successfully!",
        toast_leave_submitted: "Leave request submitted!",
        toast_settings_saved: "Settings saved successfully!",
        toast_employee_added: "Employee added successfully!",
        toast_location_added: "Location added successfully!",
        toast_announcement_published: "Announcement published!",
        toast_face_registered: "Face data registered!",
        toast_face_reset: "Face data reset successfully!",
        toast_pin_changed: "PIN changed successfully!",
        toast_verification_failed: "Verification failed. Please try again.",
        toast_invalid_pin: "Invalid PIN. Please try again.",
        toast_gps_failed: "GPS verification failed. You must be within 150m of an office location.",
        toast_face_not_registered: "Face not registered. Please register your face first.",
    },

    th: {
        // Navigation
        enterprise_os: "ระบบองค์กร",
        nav_dashboard: "แดชบอร์ด",
        nav_attendance: "บันทึกเวลา",
        nav_leave: "จัดการการลา",
        nav_team: "สถานะทีม",
        nav_ai_insights: "ข้อมูลเชิง AI",
        nav_admin: "ระบบผู้ดูแล",
        nav_settings: "ตั้งค่า",
        btn_logout: "ออกจากระบบ",

        // Dashboard
        dashboard_title: "แดชบอร์ด",
        dashboard_subtitle: "ภาพรวมการทำงานของคุณ",
        action_clock_in: "ลงเวลาเข้างาน",
        action_clock_in_desc: "เริ่มต้นการทำงาน",
        action_clock_out: "ลงเวลาออกงาน",
        action_clock_out_desc: "สิ้นสุดการทำงาน",

        current_session: "เซสชันปัจจุบัน",
        status_active: "กำลังทำงาน",
        clock_in_time: "เวลาเข้า",
        work_mode: "โหมด",
        location: "สถานที่",
        duration: "ระยะเวลา",

        break_restroom: "ห้องน้ำ",
        break_coffee: "พักดื่มกาแฟ",
        on_break: "กำลังพัก",

        stat_this_week: "สัปดาห์นี้",
        stat_hours_worked: "ชั่วโมงทำงาน",
        stat_productivity: "ประสิทธิภาพ",
        stat_weekly_score: "คะแนนรายสัปดาห์",
        stat_leave_balance: "วันลาคงเหลือ",
        stat_days_remaining: "วันที่เหลือ",
        stat_work_life: "สมดุลชีวิต-งาน",
        stat_balance_score: "คะแนนสมดุล",

        chart_weekly_hours: "ชั่วโมงทำงานรายสัปดาห์",

        // Attendance
        attendance_title: "ประวัติการลงเวลา",
        attendance_subtitle: "ดูบันทึกการลงเวลาทั้งหมดของคุณ",
        btn_export_csv: "ส่งออกเป็น CSV",

        table_date: "วันที่",
        table_clock_in: "เวลาเข้า",
        table_clock_out: "เวลาออก",
        table_duration: "ระยะเวลา",
        table_mode: "โหมด",
        table_location: "สถานที่",
        table_status: "สถานะ",
        table_verification: "การยืนยัน",
        no_records: "ไม่พบบันทึก",

        // Leave Management
        leave_title: "จัดการการลา",
        leave_subtitle: "ยื่นคำขอและจัดการวันลาของคุณ",
        leave_vacation: "ลาพักร้อน",
        leave_sick: "ลาป่วย",
        leave_personal: "ลากิจ",
        days_remaining: "วันที่เหลือ",
        btn_request_leave: "ยื่นคำขอลา",
        leave_history: "ประวัติการลา",

        table_type: "ประเภท",
        table_start_date: "วันเริ่มต้น",
        table_end_date: "วันสิ้นสุด",
        table_days: "จำนวนวัน",
        table_reason: "เหตุผล",
        table_status: "สถานะ",
        no_requests: "ไม่มีคำขอลา",

        // Team Status
        team_title: "สถานะทีมงาน",
        team_subtitle: "ดูว่าใครกำลังทำงาน ลางาน หรือออฟไลน์",

        // AI Insights
        ai_title: "ข้อมูลเชิงลึกจาก AI",
        ai_subtitle: "ขับเคลื่อนโดย Gemini AI",
        ai_analysis: "วิเคราะห์รูปแบบการทำงาน",
        ai_productivity: "คำแนะนำเพิ่มประสิทธิภาพ",
        ai_loading: "กำลังวิเคราะห์รูปแบบการทำงานของคุณ...",
        ai_no_data: "คลิกสร้างเพื่อรับคำแนะนำส่วนบุคคล",
        btn_generate_insights: "สร้างข้อมูลเชิงลึก",

        // Admin Console
        admin_title: "ระบบผู้ดูแล",
        admin_subtitle: "จัดการพนักงาน การอนุมัติ และการตั้งค่าระบบ",
        admin_tab_employees: "พนักงาน",
        admin_tab_approvals: "อนุมัติการลา",
        admin_tab_announcements: "ประกาศ",
        admin_tab_locations: "สถานที่ทำงาน",
        admin_tab_system: "ระบบ",

        btn_add_employee: "เพิ่มพนักงาน",
        table_id: "รหัส",
        table_name: "ชื่อ",
        table_department: "แผนก",
        table_position: "ตำแหน่ง",
        table_role: "บทบาท",
        table_actions: "การดำเนินการ",

        table_employee: "พนักงาน",
        table_dates: "วันที่",

        btn_add_announcement: "เพิ่มประกาศ",
        btn_add_location: "เพิ่มสถานที่ทำงาน",

        system_settings: "การตั้งค่าระบบ",
        setting_late_threshold: "เกณฑ์การมาสาย (นาที)",
        setting_gps_radius: "รัศมีการตรวจสอบ GPS (เมตร)",
        btn_save_settings: "บันทึกการตั้งค่า",

        data_management: "จัดการข้อมูล",
        btn_export_data: "ส่งออกข้อมูลทั้งหมด",
        btn_import_data: "นำเข้าข้อมูล",
        btn_reset_system: "รีเซ็ตระบบ",

        // Settings
        settings_title: "ตั้งค่า",
        settings_subtitle: "จัดการการตั้งค่าส่วนบุคคลของคุณ",
        setting_appearance: "รูปลักษณ์",
        setting_theme: "ธีม",
        theme_light: "สว่าง",
        theme_dark: "มืด",
        setting_language: "ภาษา",

        setting_security: "ความปลอดภัย",
        setting_change_pin: "เปลี่ยน PIN",
        btn_change_pin: "เปลี่ยน PIN",
        setting_reset_face: "รีเซ็ตข้อมูลใบหน้า",
        btn_reset_face: "รีเซ็ตไบโอเมตริกซ์",

        setting_work_mode: "โหมดการทำงานที่ต้องการ",
        setting_default_mode: "โหมดเริ่มต้น",
        mode_office: "ออฟฟิศ",
        mode_remote: "ทำงานทางไกล",

        // Modals
        login_title: "ยินดีต้อนรับสู่ GlobalWork Pro",
        login_subtitle: "เลือกโปรไฟล์ของคุณเพื่อดำเนินการต่อ",
        btn_first_time: "ครั้งแรก? ตั้งค่าบัญชีของคุณ",

        pin_title: "ป้อน PIN ของคุณ",
        pin_subtitle: "ยืนยันตัวตนของคุณ",
        btn_cancel: "ยกเลิก",
        btn_verify: "ยืนยัน",

        faceid_title: "ยืนยันตัวตนด้วยใบหน้า",
        faceid_subtitle: "วางใบหน้าของคุณในกรอบ",
        liveness_title: "ตรวจสอบความมีชีวิต",
        liveness_smile: "กรุณายิ้ม! 😊",
        liveness_blink: "กรุณากระพริบตา! 👁️",
        liveness_turn: "หันหน้าเล็กน้อย! ↔️",
        btn_capture: "ถ่ายภาพ",
        btn_register: "ลงทะเบียนใบหน้า",

        workmode_title: "เลือกโหมดการทำงาน",
        workmode_subtitle: "เลือกว่าคุณทำงานอย่างไรวันนี้",

        leave_request_title: "ยื่นคำขอลา",
        form_leave_type: "ประเภทการลา",
        form_start_date: "วันเริ่มต้น",
        form_end_date: "วันสิ้นสุด",
        form_reason: "เหตุผล",
        btn_submit: "ส่งคำขอ",

        add_employee_title: "เพิ่มพนักงาน",
        form_name: "ชื่อ",
        form_department: "แผนก",
        form_position: "ตำแหน่ง",
        form_role: "บทบาท",
        role_staff: "พนักงาน",
        role_admin: "ผู้ดูแล",
        role_owner: "เจ้าของ",
        form_pin: "PIN (4 หลัก)",
        btn_add: "เพิ่มพนักงาน",

        add_location_title: "เพิ่มสถานที่ทำงาน",
        form_location_name: "ชื่อสถานที่",
        form_coordinates: "เลือกตำแหน่งบนแผนที่",
        form_latitude: "ละติจูด",
        form_longitude: "ลองจิจูด",

        add_announcement_title: "เพิ่มประกาศ",
        form_title: "หัวข้อ",
        form_message: "ข้อความ",
        form_priority: "ความสำคัญ",
        priority_normal: "ปกติ",
        priority_important: "สำคัญ",
        priority_urgent: "เร่งด่วน",
        btn_publish: "เผยแพร่",

        // Status Messages
        status_working: "กำลังทำงาน",
        status_on_leave: "ลางาน",
        status_offline: "ออฟไลน์",
        status_on_break: "กำลังพัก",

        // Toast Messages
        toast_clock_in_success: "ลงเวลาเข้างานสำเร็จ!",
        toast_clock_out_success: "ลงเวลาออกงานสำเร็จ!",
        toast_leave_submitted: "ส่งคำขอลาสำเร็จ!",
        toast_settings_saved: "บันทึกการตั้งค่าสำเร็จ!",
        toast_employee_added: "เพิ่มพนักงานสำเร็จ!",
        toast_location_added: "เพิ่มสถานที่สำเร็จ!",
        toast_announcement_published: "เผยแพร่ประกาศสำเร็จ!",
        toast_face_registered: "ลงทะเบียนใบหน้าสำเร็จ!",
        toast_face_reset: "รีเซ็ตข้อมูลใบหน้าสำเร็จ!",
        toast_pin_changed: "เปลี่ยน PIN สำเร็จ!",
        toast_verification_failed: "การยืนยันล้มเหลว กรุณาลองใหม่อีกครั้ง",
        toast_invalid_pin: "PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
        toast_gps_failed: "การตรวจสอบ GPS ล้มเหลว คุณต้องอยู่ภายในรัศมี 150 เมตรจากสถานที่ทำงาน",
        toast_face_not_registered: "ยังไม่ได้ลงทะเบียนใบหน้า กรุณาลงทะเบียนก่อน",
    }
};

// Translation utility function
function t(key, lang = null) {
    const currentLang = lang || document.documentElement.lang || 'th';
    return translations[currentLang]?.[key] || translations['en'][key] || key;
}

// Update all elements with data-i18n attribute
function updateLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key, lang);

        // Update text content or placeholder based on element type
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.placeholder) {
                element.placeholder = translation;
            }
        } else if (element.tagName === 'OPTION') {
            element.textContent = translation;
        } else {
            element.textContent = translation;
        }
    });
}
