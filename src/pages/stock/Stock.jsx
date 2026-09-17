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

import "./stock.css";
import Header from "../../components/header/Header";
import { getOverview } from "../../services/stock.service";

const Stock = () => {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOverview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getOverview();

      setOverview(response.overview || null);
    } catch (error) {
      console.error(
        "Failed to load stock overview:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load stock overview"
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
      title: "Total Medicines",
      value: overview?.totalMedicines || 0,
      icon: Package,
      className: "primary",
    },
    {
      title: "Total Batches",
      value: overview?.totalBatches || 0,
      icon: Layers3,
      className: "info",
    },
    {
      title: "Total Quantity",
      value: overview?.totalQuantity || 0,
      icon: Boxes,
      className: "success",
    },
    {
      title: "Low Stock",
      value: overview?.lowStockMedicines || 0,
      icon: TrendingDown,
      className: "warning",
      link: "/low-stock",
      clickable: true,
    },
    {
      title: "Near Expiry",
      value: overview?.nearExpiryBatches || 0,
      icon: Clock3,
      className: "warning",
      link: "/expiry-batches",
      clickable: true,
    },
    {
      title: "Expired",
      value: overview?.expiredBatches || 0,
      icon: AlertTriangle,
      className: "danger",
      link: "/expired-batches",
      clickable: true,
    },
  ];

  const stockLinks = [
    {
      title: "Stock Transactions",
      description: "View all stock IN and OUT transactions",
      icon: History,
      link: "/stock-transaction",
      className: "primary",
    },
    {
      title: "Near Expiry",
      description: "View batches that will expire soon",
      icon: CalendarClock,
      link: "/expiry-batches",
      className: "warning",
    },
    {
      title: "Expired Batches",
      description: "View all expired medicine batches",
      icon: Ban,
      link: "/expired-batches",
      className: "danger",
    },
    {
      title: "Low Stock",
      description: "View medicines with low quantity",
      icon: TrendingDown,
      link: "/low-stock",
      className: "warning",
    },
  ];

  return (
    <div className="stock-page">

      <Header
        title="Stock"
        description="Monitor medicines, batches and inventory status"
      />

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Refresh */}
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

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Overview Cards */}
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
                          View details
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

      {/* Stock Management */}
      <div className="card border-0 shadow-sm mt-4">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h5 className="mb-1">
                Stock Management
              </h5>

              <p className="text-muted mb-0 small">
                Access stock reports and inventory operations
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
                    onClick={() =>
                      navigate(item.link)
                    }
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

      {/* Stock Status + Inventory Summary */}
      <div className="row g-4 mt-1">

        {/* Stock Status */}
        <div className="col-12 col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <h5 className="mb-3">
                Stock Status
              </h5>

              <div
                className="d-flex justify-content-between align-items-center py-3 border-bottom stock-status-row"
                onClick={() =>
                  navigate("/low-stock")
                }
              >

                <div className="d-flex align-items-center gap-2">

                  <TrendingDown
                    size={18}
                    className="text-warning"
                  />

                  <span>
                    Low Stock Medicines
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
                    Batches Near Expiry
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
                    Expired Batches
                  </span>

                </div>

                <strong className="text-danger">
                  {overview?.expiredBatches || 0}
                </strong>

              </div>

            </div>

          </div>

        </div>

        {/* Inventory Summary */}
        <div className="col-12 col-lg-6">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <h5 className="mb-3">
                Inventory Summary
              </h5>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">

                <span>
                  Active Medicines
                </span>

                <strong>
                  {overview?.totalMedicines || 0}
                </strong>

              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">

                <span>
                  Active Batches
                </span>

                <strong>
                  {overview?.totalBatches || 0}
                </strong>

              </div>

              <div className="d-flex justify-content-between align-items-center py-3">

                <span>
                  Available Quantity
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
