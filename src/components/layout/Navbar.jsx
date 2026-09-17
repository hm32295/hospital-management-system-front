import {Menu, Bell ,LogOut,} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar-custom">

      {/* Left Side */}
      <div className="d-flex align-items-center gap-3">

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        <div>
          <h5 className="mb-0 fw-semibold">
            Dashboard
          </h5>
        </div>

      </div>

      {/* Right Side */}
      <div className="d-flex align-items-center gap-3">

        {/* Notifications */}
        <button
          type="button"
          className="navbar-icon-btn"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* User */}
        <div className="navbar-user">

          <div className="navbar-user-info">
            <div className="fw-semibold">
              {user?.name || "User"}
            </div>

            <small className="text-muted">
              {user?.email || ""}
            </small>
          </div>

          <div className="navbar-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

        </div>

        {/* Logout */}
        <button
          type="button"
          className="btn btn-outline-danger btn-sm navbar-logout-btn"
          onClick={logout}
        >
          <LogOut size={16} />

          <span>
            Logout
          </span>
        </button>

      </div>

    </header>
  );
};

export default Navbar;