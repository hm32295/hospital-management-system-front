import { useState } from "react";
import { Outlet } from "react-router-dom";
import './dashboard.css'
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Main */}
      <div className="dashboard-main">

        <Navbar
          onToggleSidebar={toggleSidebar}
        />

        <main className="dashboard-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;