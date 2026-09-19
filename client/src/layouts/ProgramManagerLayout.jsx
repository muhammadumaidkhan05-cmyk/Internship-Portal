
import React, { useState } from "react";
import ProgramManagerSidebar from "../components/ProgramManagerSidebar";
import ProgramManagerNavbar from "../components/ProgramManagerNavbar";

function ProgramManagerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-[#172033]">

      {/* =========================
          MOBILE OVERLAY
      ========================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================== */}

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <ProgramManagerSidebar />
      </div>

      {/* =========================
          MAIN AREA
      ========================== */}

      <div className="min-h-screen lg:pl-64">

        {/* Navbar */}
        <ProgramManagerNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)] bg-[#F3F6FB] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default ProgramManagerLayout;

