import {
  Menu,
  Bell,
  LogOut,
} from "lucide-react";

import {
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  ROLES,
} from "../../constants/roles";

const Navbar = ({ onToggleSidebar }) => {
  const {
    user,
    logout,
  } = useAuth();

  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/": "Dashboard",

    "/reception": "Reception",

    "/patients": "Patients",
    "/doctors": "Doctors",
    "/specialties": "Specialties",
    "/visits": "Visits",
    "/operations": "Operations",

    "/sales": "Sales",
    "/medicines": "Medicines",
    "/batches": "Medicine Batches",
    "/categories": "Categories",
    "/dispenses": "Dispensed",

    "/Stock": "Stock",
    "/stock-transaction": "Stock Transactions",

    "/purchases": "Purchases",
    "/Suppliers": "Suppliers",

    "/cash-drawers": "Cash Drawers",
    "/income": "Income",
    "/expenses": "Expenses",
    "/expenses-report": "Expenses Report",

    "/users": "Users",
  };

  const getPageTitle = () => {
    if (pageTitles[location.pathname]) {
      return pageTitles[location.pathname];
    }

    if (location.pathname.startsWith("/medicines/")) {
      return "Medicine";
    }

    if (location.pathname.startsWith("/categories/")) {
      return "Category";
    }

    if (location.pathname.startsWith("/Suppliers/")) {
      return "Supplier";
    }

    if (location.pathname.startsWith("/batches/")) {
      return "Medicine Batch";
    }

    if (location.pathname.startsWith("/stock-transaction/")) {
      return "Stock Transaction";
    }

    if (location.pathname.startsWith("/users/")) {
      return "User";
    }

    if (location.pathname.startsWith("/purchases/")) {
      return "Purchase";
    }

    if (location.pathname.startsWith("/dispenses/")) {
      return "Dispensed";
    }

    if (location.pathname.startsWith("/visits/")) {
      return "Visit";
    }

    if (location.pathname.startsWith("/patients/")) {
      return "Patient";
    }

    if (location.pathname.startsWith("/operations/")) {
      return "Operation";
    }

    if (location.pathname.startsWith("/cash-drawers/")) {
      return "Cash Drawer";
    }

    if (location.pathname.startsWith("/expiry-batches")) {
      return "Expiry Batches";
    }

    if (location.pathname.startsWith("/low-stock")) {
      return "Low Stock";
    }

    if (location.pathname.startsWith("/expired-batches")) {
      return "Expired Batches";
    }

    if (location.pathname.startsWith("/expenses/")) {
      return "Expense";
    }

    if (location.pathname.startsWith("/cash-transactions/")) {
      return "Cash Transaction";
    }

    return "Hospital Management";
  };

  const getRoleLabel = () => {
    const roleLabels = {
      [ROLES.ADMIN]: "Administrator",
      [ROLES.DOCTOR]: "Doctor",
      [ROLES.NURSE]: "Nurse",
      [ROLES.PHARMACIST]: "Pharmacist",
      [ROLES.RECEPTIONIST]: "Receptionist",
      [ROLES.LAB_TECHNICIAN]: "Lab Technician",
      [ROLES.PATIENT]: "Patient",
    };

    return (
      roleLabels[user?.role] ||
      user?.role ||
      "User"
    );
  };

  const userName =
    user?.name ||
    "User";

  const userInitial =
    userName
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";

  return (
    <header className="navbar-custom">

      {/* Left Side */}

      <div className="navbar-left">

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={23} />
        </button>

        <div className="navbar-page-info">

          <h5 className="navbar-page-title">
            {getPageTitle()}
          </h5>

          <span className="navbar-page-subtitle">
            Hospital Management System
          </span>

        </div>

      </div>

      {/* Right Side */}

      <div className="navbar-right">

        {/* Notifications */}

        <button
          type="button"
          className="navbar-icon-btn navbar-notification-btn"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="notification-dot" />
        </button>

        <div className="navbar-divider" />

        {/* User */}

        <div className="navbar-user">

          <div className="navbar-user-info">

            <div className="navbar-user-name">
              {userName}
            </div>

            <div className="navbar-user-role">
              {getRoleLabel()}
            </div>

          </div>

          <div className="navbar-avatar">
            {userInitial}
          </div>

        </div>

        {/* Logout */}

        <button
          type="button"
          className="navbar-logout-btn"
          onClick={logout}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={18} />

          <span>
            Logout
          </span>
        </button>

      </div>

    </header>
  );
};

export default Navbar;