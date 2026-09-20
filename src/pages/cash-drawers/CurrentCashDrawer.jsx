
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  LockKeyhole,
  RefreshCw,
  Plus,
} from "lucide-react";
import Header from "../../components/header/Header";
import { getCurrentCashDrawer } from "../../services/cashDrawer.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const CurrentCashDrawer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [drawer, setDrawer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const fetchDrawer = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getCurrentCashDrawer();
      setDrawer(response.cashDrawer);
    } catch (error) {
      if (error.response?.status === 404) {
        setDrawer(null);
      } else {
        const message = getApiErrorMessage(
          error,
          t("cashDrawers.loadFailed")
        );

        setServerError(message);
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawer();
  }, []);

  const formatMoney = (value) =>
    `${Number(value || 0).toFixed(2)} ${t("common.egp")}`;

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleString(
          i18n.language === "ar"
            ? "ar-EG"
            : "en-GB"
        )
      : "-";

  return (
    <div>
      <Header
        title={t("cashDrawers.currentTitle")}
        description={t(
          "cashDrawers.currentDescription"
        )}
      />

      {serverError && (
        <div className="alert alert-danger">
          {serverError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" />
        </div>
      ) : !drawer ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <Wallet
              size={45}
              className="text-muted mb-3"
            />

            <h5>
              {t("cashDrawers.noOpenDrawer")}
            </h5>

            <p className="text-muted">
              {t(
                "cashDrawers.noOpenDrawerDescription"
              )}
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/cash-drawers/open")
              }
            >
              <Plus size={18} className="me-2" />
              {t("cashDrawers.openDrawer")}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-secondary"
              onClick={fetchDrawer}
            >
              <RefreshCw
                size={17}
                className="me-2"
              />
              {t("cashDrawers.refresh")}
            </button>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">
                    {t("cashDrawers.openingBalance")}
                  </div>
                  <h3 className="mt-2 mb-0">
                    {formatMoney(
                      drawer.openingBalance
                    )}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">
                    {t("cashDrawers.expectedCash")}
                  </div>
                  <h3 className="mt-2 mb-0 text-success">
                    {formatMoney(
                      drawer.expectedCash
                    )}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">
                    {t("cashDrawers.status")}
                  </div>
                  <div className="mt-2">
                    <span className="badge text-bg-success">
                      {t(
                        "cashDrawers.statuses.open"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">
                    {t("cashDrawers.openedAt")}
                  </div>
                  <div className="fw-semibold mt-2">
                    {formatDate(drawer.openedAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-4">
                    {t(
                      "cashDrawers.information"
                    )}
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="text-muted small">
                        {t("cashDrawers.openedBy")}
                      </div>
                      <div className="fw-semibold">
                        {drawer.openedBy?.name || "-"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">
                        {t("cashDrawers.email")}
                      </div>
                      <div className="fw-semibold">
                        {drawer.openedBy?.email || "-"}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="text-muted small">
                        {t("cashDrawers.notes")}
                      </div>
                      <div>
                        {drawer.notes || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        navigate(
                          `/cash-drawers/${drawer._id}/close`
                        )
                      }
                    >
                      <LockKeyhole
                        size={18}
                        className="me-2"
                      />
                      {t(
                        "cashDrawers.closeDrawer"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentCashDrawer;




