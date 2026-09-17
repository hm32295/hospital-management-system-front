import {
  LayoutDashboard,
  Stethoscope,
  UserRound,
  UsersRound,
  CalendarDays,
  Pill,
  Layers3,
  Tags,
  ShoppingCart,
  Truck,
  ArrowLeftRight,
  Boxes,
  ClipboardList,
  ReceiptText,
  Wallet,
  Banknote,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const sections = [
    {
      title: "Main",
      links: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Reception",
          path: "/reception",
          icon: Stethoscope,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
      ],
    },
    {
      title: "Medical",
      links: [
        {
          name: "Patients",
          path: "/patients",
          icon: UsersRound,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Doctors",
          path: "/doctors",
          icon: UserRound,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Specialties",
          path: "/specialties",
          icon: Stethoscope,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Visits",
          path: "/visits",
          icon: CalendarDays,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Operations",
          path: "/operations",
          icon: CalendarDays,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
      ],
    },
    {
      title: "Pharmacy",
      links: [
        {
          name: "Sales",
          path: "/sales",
          icon: ReceiptText,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Medicines",
          path: "/medicines",
          icon: Pill,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Medicine Batches",
          path: "/batches",
          icon: Layers3,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Categories",
          path: "/categories",
          icon: Tags,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Dispensed",
          path: "/dispenses",
          icon: ClipboardList,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
      ],
    },
    {
      title: "Inventory",
      links: [
        {
          name: "Stock",
          path: "/stock",
          icon: Boxes,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Stock Transactions",
          path: "/stock-transaction",
          icon: ArrowLeftRight,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
      ],
    },
    {
      title: "Purchasing",
      links: [
        {
          name: "Purchases",
          path: "/purchases",
          icon: ShoppingCart,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Suppliers",
          path: "/suppliers",
          icon: Truck,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
      ],
    },
    {
      title: "Finance",
      links: [
        {
          name: "Cash Drawers",
          path: "/cash-drawers",
          icon: Wallet,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Income",
          path: "/income",
          icon: Banknote,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "expenses Report",
          path: "/expenses-report",
          icon: Banknote,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
        {
          name: "Expenses",
          path: "/expenses",
          icon: ReceiptText,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
      ],
    },
    {
      title: "Administration",
      links: [
        {
          name: "Users",
          path: "/users",
          icon: UsersRound,
          roles: [ROLES.ADMIN, ROLES.PHARMACIST],
        },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div>
          <h4 className="mb-0 fw-bold">Pharmacy</h4>
          <small>Management System</small>
        </div>

        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => {
          const visibleLinks = section.links.filter((link) =>
            link.roles.includes(user?.role)
          );

          if (!visibleLinks.length) return null;

          return (
            <div className="sidebar-section" key={section.title}>
              <div className="sidebar-section-title">
                {section.title}
              </div>

              {visibleLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;