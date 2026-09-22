
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
  Activity,
  FileText,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const sections = [
    {
      title: "main",
      links: [
        {
          name: "dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
          roles: [
            ROLES.ADMIN,
            // ROLES.DOCTOR,
            // ROLES.NURSE,
            // ROLES.PHARMACIST,
            // ROLES.RECEPTIONIST,
            // ROLES.LAB_TECHNICIAN,
            // ROLES.PATIENT,
          ],
        },
      ],
    },
    {
      title: "clinical",
      links: [
        {
          name: "reception",
          path: "/reception",
          icon: Stethoscope,
          roles: [
            ROLES.ADMIN,
            ROLES.RECEPTIONIST,
          ],
        },
        {
          name: "patients",
          path: "/patients",
          icon: UsersRound,
          roles: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.NURSE,
            ROLES.RECEPTIONIST,
          ],
        },
        {
          name: "doctors",
          path: "/doctors",
          icon: UserRound,
          roles: [
            ROLES.ADMIN,
            ROLES.RECEPTIONIST,
          ],
        },
        {
          name: "specialties",
          path: "/specialties",
          icon: Stethoscope,
          roles: [
            ROLES.ADMIN,
          ],
        },
        {
          name: "visits",
          path: "/visits",
          icon: CalendarDays,
          roles: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
            ROLES.NURSE,
            ROLES.RECEPTIONIST,
          ],
        },
        {
          name: "operations",
          path: "/operations",
          icon: Activity,
          roles: [
            ROLES.ADMIN,
            ROLES.DOCTOR,
          ],
        },
      ],
    },
    {
      title: "pharmacy",
      links: [
        {
          name: "sales",
          path: "/sales",
          icon: ReceiptText,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
        {
          name: "medicines",
          path: "/medicines",
          icon: Pill,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
        {
          name: "medicineBatches",
          path: "/batches",
          icon: Layers3,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
        {
          name: "categories",
          path: "/categories",
          icon: Tags,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
        {
          name: "dispensed",
          path: "/dispenses",
          icon: ClipboardList,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
      ],
    },
    {
      title: "inventory",
      links: [
        {
          name: "stock",
          path: "/Stock",
          icon: Boxes,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
        {
          name: "stockTransactions",
          path: "/stock-transaction",
          icon: ArrowLeftRight,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
      ],
    },
    {
      title: "purchasing",
      links: [
        {
          name: "purchases",
          path: "/purchases",
          icon: ShoppingCart,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
        {
          name: "suppliers",
          path: "/Suppliers",
          icon: Truck,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
          ],
        },
      ],
    },
    {
      title: "finance",
      links: [
        {
          name: "cashDrawers",
          path: "/cash-drawers",
          icon: Wallet,
          roles: [
            ROLES.ADMIN,
            ROLES.PHARMACIST,
            ROLES.RECEPTIONIST,
          ],
        },
        {
          name: "income",
          path: "/income",
          icon: Banknote,
          roles: [
            ROLES.ADMIN,
          ],
        },
        {
          name: "expenses",
          path: "/expenses",
          icon: ReceiptText,
          roles: [
            ROLES.ADMIN,
          ],
        },
        {
          name: "expensesReport",
          path: "/expenses-report",
          icon: FileText,
          roles: [
            ROLES.ADMIN,
          ],
        },
      ],
    },
    {
      title: "administration",
      links: [
        {
          name: "users",
          path: "/users",
          icon: UsersRound,
          roles: [
            ROLES.ADMIN,
          ],
        },
      ],
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div>
          <h4 className="mb-0 fw-bold">
            Hospital
          </h4>

          <small>
            {t("common.hospitalManagementSystem")}
          </small>
        </div>

        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <X size={22} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => {
          const visibleLinks = section.links.filter((link) =>
            link.roles.includes(user?.role)
          );

          if (!visibleLinks.length) {
            return null;
          }

          return (
            <div
              className="sidebar-section"
              key={section.title}
            >
              <div className="sidebar-section-title">
                {t(`sidebar.sections.${section.title}`)}
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

                    <span>
                      {t(`sidebar.links.${link.name}`)}
                    </span>
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
