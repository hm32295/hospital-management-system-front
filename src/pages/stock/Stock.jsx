import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Layers3,
  Boxes,
  AlertTriangle,
  Clock3,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  History,
  CalendarClock,
  Ban,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./stock.css";
import Header from "../../components/header/Header";
import { getOverview } from "../../services/stock.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Stock = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);

    try {
      const response = await getOverview();
      setOverview(response.overview || null);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("stock.loadOverviewFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const cards = [
    {
      title: t("stock.totalMedicines"),
      value: overview?.totalMedicines || 0,
      icon: Package,
      className: "primary",
    },
    {
      title: t("stock.totalBatches"),
      value: overview?.totalBatches || 0,
      icon: Layers3,
      className: "info",
    },
    {
      title: t("stock.totalQuantity"),
      value: overview?.totalQuantity || 0,
      icon: Boxes,
      className: "success",
    },
    {
      title: t("stock.lowStock"),
      value: overview?.lowStockMedicines || 0,
      icon: TrendingDown,
      className: "warning",
      link: "/low-stock",
      clickable: true,
    },
    {
      title: t("stock.nearExpiry"),
      value: overview?.nearExpiryBatches || 0,
      icon: Clock3,
      className: "warning",
      link: "/expiry-batches",
      clickable: true,
    },
    {
      title: t("stock.expired"),
      value: overview?.expiredBatches || 0,
      icon: AlertTriangle,
      className: "danger",
      link: "/expired-batches",
      clickable: true,
    },
  ];

  const stockLinks = [
    {
      title: t("stock.stockTransactions"),
      description: t("stock.stockTransactionsDescription"),
      icon: History,
      link: "/stock-transaction",
      className: "primary",
    },
    {
      title: t("stock.nearExpiry"),
      description: t("stock.nearExpiryDescription"),
      icon: CalendarClock,
      link: "/expiry-batches",
      className: "warning",
    },
    {
      title: t("stock.expiredBatches"),
      description: t("stock.expiredBatchesDescription"),
      icon: Ban,
      link: "/expired-batches",
      className: "danger",
    },
    {
      title: t("stock.lowStock"),
      description: t("stock.lowStockDescription"),
      icon: TrendingDown,
      link: "/low-stock",
      className: "warning",
    },
  ];

  return (
    <div className="stock-page">
      <Header
        title={t("stock.title")}
        description={t("stock.subtitle")}
      />

      <div className="d-flex justify-content-end mb-4">
        <button
          type="button"
          className="btn btn-light border d-flex align-items-center gap-2"
          onClick={fetchOverview}
          disabled={loading}
        >
          <RefreshCw
            size={18}
            className={loading ? "spin" : ""}
          />
          {loading
            ? t("stock.refreshing")
            : t("stock.refresh")}
        </button>
      </div>

      <div className="row g-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="col-12 col-sm-6 col-xl-4"
              key={card.title}
            >
              <div
                className={`card border-0 shadow-sm h-100 stock-overview-card ${
                  card.clickable
                    ? "stock-card-clickable"
                    : ""
                }`}
                onClick={() => {
                  if (card.link) {
                    navigate(card.link);
                  }
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="text-muted mb-2">
                        {card.title}
                      </div>

                      <h3 className="mb-0 fw-bold">
                        {loading
                          ? "..."
                          : card.value.toLocaleString()}
                      </h3>

                      {card.clickable && (
                        <div className="small text-primary mt-2">
                          {t("stock.viewDetails")}
                        </div>
                      )}
                    </div>

                    <div
                      className={`bg-${card.className} bg-opacity-10 rounded p-3`}
                    >
                      <Icon
                        size={24}
                        className={`text-${card.className}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-1">
                {t("stock.stockManagement")}
              </h5>

              <p className="text-muted mb-0 small">
                {t("stock.stockManagementDescription")}
              </p>
            </div>
          </div>

          <div className="row g-3">
            {stockLinks.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className="col-12 col-md-6"
                  key={item.title}
                >
                  <button
                    type="button"
                    className="stock-management-item w-100"
                    onClick={() => navigate(item.link)}
                  >
                    <div
                      className={`stock-management-icon bg-${item.className} bg-opacity-10`}
                    >
                      <Icon
                        size={22}
                        className={`text-${item.className}`}
                      />
                    </div>

                    <div className="stock-management-content text-start">
                      <div className="fw-semibold">
                        {item.title}
                      </div>

                      <div className="text-muted small">
                        {item.description}
                      </div>
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-muted ms-auto"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="mb-3">
                {t("stock.stockStatus")}
              </h5>

              <div
                className="d-flex justify-content-between align-items-center py-3 border-bottom stock-status-row"
                onClick={() => navigate("/low-stock")}
              >
                <div className="d-flex align-items-center gap-2">
                  <TrendingDown
                    size={18}
                    className="text-warning"
                  />
                  <span>
                    {t("stock.lowStockMedicines")}
                  </span>
                </div>

                <strong>
                  {overview?.lowStockMedicines || 0}
                </strong>
              </div>

              <div
                className="d-flex justify-content-between align-items-center py-3 border-bottom stock-status-row"
                onClick={() =>
                  navigate("/expiry-batches")
                }
              >
                <div className="d-flex align-items-center gap-2">
                  <Clock3
                    size={18}
                    className="text-warning"
                  />
                  <span>
                    {t("stock.batchesNearExpiry")}
                  </span>
                </div>

                <strong>
                  {overview?.nearExpiryBatches || 0}
                </strong>
              </div>

              <div
                className="d-flex justify-content-between align-items-center py-3 stock-status-row"
                onClick={() =>
                  navigate("/expired-batches")
                }
              >
                <div className="d-flex align-items-center gap-2">
                  <AlertTriangle
                    size={18}
                    className="text-danger"
                  />
                  <span>
                    {t("stock.expiredBatches")}
                  </span>
                </div>

                <strong className="text-danger">
                  {overview?.expiredBatches || 0}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="mb-3">
                {t("stock.inventorySummary")}
              </h5>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span>
                  {t("stock.activeMedicines")}
                </span>

                <strong>
                  {overview?.totalMedicines || 0}
                </strong>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <span>
                  {t("stock.activeBatches")}
                </span>

                <strong>
                  {overview?.totalBatches || 0}
                </strong>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3">
                <span>
                  {t("stock.availableQuantity")}
                </span>

                <strong className="text-success">
                  {overview?.totalQuantity || 0}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;