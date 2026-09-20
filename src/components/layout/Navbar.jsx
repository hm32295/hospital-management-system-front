
import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { changeLanguage } from "../../services/language.service";
import { ROLES } from "../../constants/roles";
import './navbar.css'
const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const pageTitles = {
    "/dashboard": "dashboard",
    "/": "dashboard",
    "/reception": "reception",
    "/patients": "patients",
    "/doctors": "doctors",
    "/specialties": "specialties",
    "/visits": "visits",
    "/operations": "operations",
    "/sales": "sales",
    "/medicines": "medicines",
    "/batches": "batches",
    "/categories": "categories",
    "/dispenses": "dispenses",
    "/Stock": "stock",
    "/stock-transaction": "stockTransactions",
    "/purchases": "purchases",
    "/Suppliers": "suppliers",
    "/cash-drawers": "cashDrawers",
    "/income": "income",
    "/expenses": "expenses",
    "/expenses-report": "expensesReport",
    "/users": "users",
  };

  const getPageTitle = () => {
    if (pageTitles[location.pathname]) {
      return t(`pages.${pageTitles[location.pathname]}`);
    }

    const dynamicPages = [
      ["/medicines/", "medicine"],
      ["/categories/", "category"],
      ["/Suppliers/", "supplier"],
      ["/batches/", "medicineBatch"],
      ["/stock-transaction/", "stockTransaction"],
      ["/users/", "user"],
      ["/purchases/", "purchase"],
      ["/dispenses/", "dispensed"],
      ["/visits/", "visit"],
      ["/patients/", "patient"],
      ["/operations/", "operation"],
      ["/cash-drawers/", "cashDrawer"],
      ["/expenses/", "expense"],
      ["/cash-transactions/", "cashTransaction"],
    ];

    const page = dynamicPages.find(([path]) =>
      location.pathname.startsWith(path)
    );

    if (page) return t(`pages.${page[1]}`);

    if (location.pathname.startsWith("/expiry-batches")) {
      return t("pages.expiryBatches");
    }

    if (location.pathname.startsWith("/low-stock")) {
      return t("pages.lowStock");
    }

    if (location.pathname.startsWith("/expired-batches")) {
      return t("pages.expiredBatches");
    }

    return t("pages.hospitalManagement");
  };

  const roleLabels = {
    [ROLES.ADMIN]: "administrator",
    [ROLES.DOCTOR]: "doctor",
    [ROLES.NURSE]: "nurse",
    [ROLES.PHARMACIST]: "pharmacist",
    [ROLES.RECEPTIONIST]: "receptionist",
    [ROLES.LAB_TECHNICIAN]: "labTechnician",
    [ROLES.PATIENT]: "patient",
  };

  const getRoleLabel = () => {
    return t(`roles.${roleLabels[user?.role] || "user"}`);
  };

  const handleLanguageChange = async () => {
    if (isChangingLanguage) return;

    const nextLanguage = i18n.language === "ar" ? "en" : "ar";

    setIsChangingLanguage(true);

    try {
      await changeLanguage(nextLanguage);
    } finally {
      setTimeout(() => {
        setIsChangingLanguage(false);
      }, 300);
    }
  };

  const userName = user?.name || t("roles.user");
  const userInitial = userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="navbar-custom">
      <div className="navbar-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={t("common.openSidebar")}
        >
          <Menu size={23} />
        </button>

        <div className="navbar-page-info">
          <h5 className="navbar-page-title">{getPageTitle()}</h5>
          <span className="navbar-page-subtitle">
            {t("common.hospitalManagementSystem")}
          </span>
        </div>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className={`language-switcher ${
            isChangingLanguage ? "changing" : ""
          }`}
          onClick={handleLanguageChange}
          disabled={isChangingLanguage}
          aria-label={t("common.language")}
        >
          <span
            className={`language-option ${
              i18n.language === "ar" ? "active" : ""
            }`}
          >
            عربي
          </span>

          <span
            className={`language-option ${
              i18n.language === "en" ? "active" : ""
            }`}
          >
            EN
          </span>

          <span
            className={`language-slider ${
              i18n.language === "en" ? "english" : ""
            }`}
          />
        </button>

        <div className="navbar-divider" />

        <div className="navbar-user">
          <div className="navbar-user-info">
            <div className="navbar-user-name">{userName}</div>
            <div className="navbar-user-role">{getRoleLabel()}</div>
          </div>

          <div className="navbar-avatar">{userInitial}</div>
        </div>

        <button
          type="button"
          className="navbar-logout-btn"
          onClick={logout}
          title={t("auth.logout")}
          aria-label={t("auth.logout")}
        >
          <LogOut size={18} />
          <span>{t("auth.logout")}</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
