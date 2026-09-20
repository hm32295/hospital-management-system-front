
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Home, SearchX } from "lucide-react";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center px-3">
        <div className="mb-4">
          <SearchX
            size={80}
            strokeWidth={1.5}
            className="text-primary"
          />
        </div>

        <h1
          className="fw-bold mb-2"
          style={{ fontSize: "6rem" }}
        >
          404
        </h1>

        <h3 className="fw-semibold mb-3">
          {t("notFound.title")}
        </h3>

        <p className="text-muted mb-4">
          {t("notFound.description")}
        </p>

        <div className="d-flex justify-content-center gap-2">
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => navigate("/")}
          >
            <Home size={18} />
            {t("notFound.goToDashboard")}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            {t("notFound.goBack")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;