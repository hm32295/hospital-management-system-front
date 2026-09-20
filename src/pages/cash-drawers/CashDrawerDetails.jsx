
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import { getSingleCashDrawer } from "../../services/cashDrawer.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const CashDrawerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [drawer, setDrawer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchDrawer = async () => {
      try {
        const response = await getSingleCashDrawer(id);
        setDrawer(response.cashDrawer);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          t("cashDrawers.loadFailed")
        );

        setServerError(message);
        showError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawer();
  }, [id, t]);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString(
          i18n.language === "ar"
            ? "ar-EG"
            : "en-GB"
        )
      : "-";

  const formatMoney = (value) =>
    `${Number(value || 0).toFixed(2)} ${t("common.egp")}`;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          {serverError}
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/cash-drawers")}
        >
          {t("cashDrawers.backToCashDrawers")}
        </button>
      </div>
    );
  }

  if (!drawer) return null;

  return (
    <div>
      <Header
        title={t("cashDrawers.detailsTitle")}
        description={t("cashDrawers.detailsDescription")}
        buttonContent={t("cashDrawers.backToCashDrawers")}
        buttonLink="/cash-drawers"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.openingBalance")}
              </div>
              <h4>
                {formatMoney(drawer.openingBalance)}
              </h4>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.expectedCash")}
              </div>
              <h4>
                {formatMoney(drawer.expectedCash)}
              </h4>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.actualCash")}
              </div>
              <h4>
                {drawer.status === "closed"
                  ? formatMoney(drawer.actualCash)
                  : "-"}
              </h4>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.difference")}
              </div>
              <h4
                className={
                  drawer.difference === 0
                    ? "text-success"
                    : drawer.difference > 0
                    ? "text-primary"
                    : "text-danger"
                }
              >
                {drawer.status === "closed"
                  ? formatMoney(drawer.difference)
                  : "-"}
              </h4>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.status")}
              </div>
              <span
                className={`badge ${
                  drawer.status === "open"
                    ? "text-bg-success"
                    : "text-bg-secondary"
                }`}
              >
                {drawer.status === "open"
                  ? t("cashDrawers.statuses.open")
                  : t("cashDrawers.statuses.closed")}
              </span>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.openedBy")}
              </div>
              <div className="fw-semibold">
                {drawer.openedBy?.name || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.openedAt")}
              </div>
              <div>{formatDate(drawer.openedAt)}</div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.closedBy")}
              </div>
              <div>
                {drawer.closedBy?.name || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                {t("cashDrawers.closedAt")}
              </div>
              <div>{formatDate(drawer.closedAt)}</div>
            </div>

            <div className="col-12">
              <div className="text-muted">
                {t("cashDrawers.notes")}
              </div>
              <div>{drawer.notes || "-"}</div>
            </div>
          </div>

          {drawer.status === "open" && (
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-danger"
                onClick={() =>
                  navigate(
                    `/cash-drawers/${drawer._id}/close`
                  )
                }
              >
                {t("cashDrawers.closeDrawer")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashDrawerDetails;
