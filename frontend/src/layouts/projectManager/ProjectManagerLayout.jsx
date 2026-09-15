import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import ProjectManagerSidebar from "../../components/projectManager/ProjectManagerSidebar";
import ProjectManagerNavbar from "../../components/projectManager/ProjectManagerNavbar";

function ProjectManagerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#071426] text-white">
      <ProjectManagerSidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <ProjectManagerNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ProjectManagerLayout;