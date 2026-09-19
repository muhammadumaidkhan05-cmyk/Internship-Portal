import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import MentorSidebar from "../../components/mentor/MentorSidebar";
import MentorNavbar from "../../components/mentor/MentorNavbar";

function MentorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      <MentorSidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <MentorNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MentorLayout;
