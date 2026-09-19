const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");
const AuditLog = require("./models/AuditLog");
const Program = require("./models/Program");
const RoleMatrix = require("./models/RoleMatrix");
const PlatformSetting = require("./models/PlatformSetting");
const Notification = require("./models/Notification");

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // ==========================================
    // CONNECT DATABASE
    // ==========================================
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for Super Admin seeding...");

    // ==========================================
    // CLEAR OLD SUPER ADMIN DATA
    // ==========================================
    await AuditLog.deleteMany({});
    await Program.deleteMany({});
    await RoleMatrix.deleteMany({});
    await PlatformSetting.deleteMany({});

    // Clear only super_admin user(s) to avoid disrupting other roles
    await User.deleteMany({ role: "super_admin" });

    // Clear super-admin notifications (role-targeted)
    await Notification.deleteMany({ recipientRole: "super_admin" });

    console.log("Old super admin data cleared.");

    // ==========================================
    // SUPER ADMIN USER
    // ==========================================
    await User.create({
      name: "Super Admin",
      email: "admin@msnacademy.com",
      password: await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD || "Msn@12345",
        10
      ),
      role: "super_admin",
      status: "Active",
    });

    console.log("Super Admin user created.");

    // ==========================================
    // PROGRAMS
    // ==========================================
    const programs = await Program.create([
      {
        name: "Frontend Engineering - Cohort 7",
        cohortSize: 28,
        programManager: "Sarah Ahmed",
        status: "active",
        progress: 64,
      },
      {
        name: "Backend APIs - Cohort 4",
        cohortSize: 22,
        programManager: "Ayesha Iqbal",
        status: "in_progress",
        progress: 41,
      },
      {
        name: "Data Analytics - Cohort 2",
        cohortSize: 16,
        programManager: "Mariam Javed",
        status: "active",
        progress: 88,
      },
      {
        name: "Mobile (React Native) - Cohort 1",
        cohortSize: 14,
        programManager: "Sarah Ahmed",
        status: "in_progress",
        progress: 23,
      },
      {
        name: "DevOps Foundations - Cohort 3",
        cohortSize: 19,
        programManager: "Ayesha Iqbal",
        status: "completed",
        progress: 100,
      },
      {
        name: "UI/UX Design - Cohort 5",
        cohortSize: 24,
        programManager: "Mariam Javed",
        status: "active",
        progress: 72,
      },
      {
        name: "AI Engineering - Cohort 1",
        cohortSize: 12,
        programManager: "Sarah Ahmed",
        status: "in_progress",
        progress: 35,
      },
      {
        name: "Quality Assurance - Cohort 2",
        cohortSize: 18,
        programManager: "Ayesha Iqbal",
        status: "archived",
        progress: 100,
      },
    ]);

    console.log(`Programs seeded: ${programs.length}`);

    // ==========================================
    // AUDIT LOGS
    // ==========================================
    await AuditLog.create([
      {
        timestamp: new Date("2026-09-15T09:02:00"),
        userName: "Jane Doe",
        action: "login",
        ipAddress: "10.0.0.4",
        device: "Chrome / Windows",
      },
      {
        timestamp: new Date("2026-09-15T08:55:00"),
        userName: "Sarah Ahmed",
        action: "approved_scrum",
        ipAddress: "10.0.0.7",
        device: "Safari / macOS",
      },
      {
        timestamp: new Date("2026-09-15T08:31:00"),
        userName: "Super Admin",
        action: "updated_role",
        ipAddress: "10.0.0.1",
        device: "Chrome / Windows",
      },
      {
        timestamp: new Date("2026-09-14T17:44:00"),
        userName: "Ali Raza",
        action: "logout",
        ipAddress: "10.0.0.9",
        device: "Firefox / Linux",
      },
      {
        timestamp: new Date("2026-09-14T16:02:00"),
        userName: "Super Admin",
        action: "created_user",
        ipAddress: "10.0.0.1",
        device: "Chrome / Windows",
      },
      {
        timestamp: new Date("2026-09-14T12:11:00"),
        userName: "Ayesha Ali",
        action: "login",
        ipAddress: "10.0.0.3",
        device: "Edge / Windows",
      },
      {
        timestamp: new Date("2026-09-14T09:48:00"),
        userName: "Super Admin",
        action: "exported_audit_log",
        ipAddress: "10.0.0.1",
        device: "Chrome / Windows",
      },
      {
        timestamp: new Date("2026-09-13T22:10:00"),
        userName: "Hira Malik",
        action: "login",
        ipAddress: "10.0.0.8",
        device: "Chrome / Android",
      },
    ]);

    console.log("Audit logs seeded: 8");

    // ==========================================
    // NOTIFICATIONS (Super Admin)
    // ==========================================
    await Notification.create([
      {
        title: "New user sign-up: Hamza Yousuf",
        message: "A new user has registered on the platform.",
        type: "info",
        recipientRole: "super_admin",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
      },
      {
        title: "Role change requested: Bilal Ahmed → Mentor",
        message: "A role change request is awaiting your approval.",
        type: "warning",
        recipientRole: "super_admin",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
      },
      {
        title: "Failed login attempt (3x) from 102.45.x.x",
        message: "Multiple failed login attempts detected. Review immediately.",
        type: "warning",
        recipientRole: "super_admin",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        title: "Program archived: QA Cohort 2",
        message: "Quality Assurance Cohort 2 has been archived successfully.",
        type: "info",
        recipientRole: "super_admin",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      },
      {
        title: "PM Sarah requested super-admin approval",
        message: "A program manager action requires your review.",
        type: "info",
        recipientRole: "super_admin",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
      },
      {
        title: "System backup completed successfully",
        message: "Automated system backup finished without errors.",
        type: "success",
        recipientRole: "super_admin",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
      },
      {
        title: "New device login: Hira Malik (Chrome / Android)",
        message: "A new device login was detected for Hira Malik.",
        type: "warning",
        recipientRole: "super_admin",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 90),
      },
      {
        title: "Intern record deletion requested",
        message: "Ayat requested deletion of an intern record.",
        type: "info",
        recipientRole: "super_admin",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
    ]);

    console.log("Notifications seeded: 8");

    // ==========================================
    // ROLE MATRIX
    // ==========================================
    await RoleMatrix.create([
      {
        roleName: "Super Admin",
        permissions: {
          view_dashboard: true,
          manage_users: true,
          manage_roles: true,
          manage_programs: true,
          view_audit_logs: true,
          export_audit_logs: true,
          manage_settings: true,
          manage_notifications: true,
        },
      },
      {
        roleName: "Program Manager",
        permissions: {
          view_dashboard: true,
          manage_users: true,
          manage_roles: false,
          manage_programs: true,
          view_audit_logs: false,
          export_audit_logs: false,
          manage_settings: false,
          manage_notifications: true,
        },
      },
      {
        roleName: "Mentor",
        permissions: {
          view_dashboard: true,
          manage_users: false,
          manage_roles: false,
          manage_programs: false,
          view_audit_logs: false,
          export_audit_logs: false,
          manage_settings: false,
          manage_notifications: false,
        },
      },
      {
        roleName: "Intern",
        permissions: {
          view_dashboard: true,
          manage_users: false,
          manage_roles: false,
          manage_programs: false,
          view_audit_logs: false,
          export_audit_logs: false,
          manage_settings: false,
          manage_notifications: false,
        },
      },
    ]);

    console.log("Role matrix seeded: 4 roles");

    // ==========================================
    // PLATFORM SETTINGS
    // ==========================================
    await PlatformSetting.create({
      platformName: "MSN Academy | IMP",
      supportEmail: "support@msnacademy.com",
      maintenanceMode: false,
      sessionTimeoutMinutes: 60,
      allowSignups: true,
    });

    console.log("Platform settings seeded.");

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log("");
    console.log("==========================================");
    console.log("  SUPER ADMIN SEED DATA CREATED");
    console.log("==========================================");
    console.log(`  Programs:          ${programs.length}`);
    console.log(`  Audit Logs:        8`);
    console.log(`  Notifications:     8`);
    console.log(`  Role Matrix:       4 roles`);
    console.log(`  Platform Settings: 1`);
    console.log("==========================================");
    console.log("  Login: admin@msnacademy.com");
    console.log("  Pass:  123456");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("Super Admin Seed Error:", error);
    process.exit(1);
  }
};

seedSuperAdmin();
