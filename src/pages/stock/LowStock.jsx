
import { useEffect, useState } from "react";
import {
  TrendingDown,
  RefreshCw,
} from "lucide-react";

import AdminDataPage from "../../components/table/AdminDataPage";
import Header from "../../components/header/Header";

import { getLowStock } from "../../services/stock.service";

const LowStock = () => {
  const [medicines, setMedicines] = useState([]);
  const [threshold, setThreshold] =useState(10);

  const [pagination, setPagination] =
    useState({page: 1,limit: 10, total: 0,pages: 0});
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchLowStock = async (page = 1,selectedThreshold = threshold) => {
    setLoading(true);
    setError("");
    try {
      const response = await getLowStock({
        threshold: selectedThreshold,
        page,limit: pagination.limit,
      });

      console.log("Low stock:", response);

      setMedicines(response.medicines || []);
      setPagination(
        response.pagination || {page: 1, limit: 10,total: 0,pages: 0,
        }
      );
    } catch (error) {
      console.error(
        "Failed to load low stock:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load low stock"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const handleThresholdChange = (e) => {
    const value = Number(e.target.value);
    setThreshold(value);
    fetchLowStock(1, value);
  };

  const columns = [
    {
      key: "_id",
      label: "Medicine",

      render: (medicine) => (
        <div>
          <div className="fw-semibold">
            {medicine._id?.name || "-"}
          </div>

          {medicine._id?.genericName && (
            <div className="text-muted small">
              {medicine._id.genericName}
            </div>
          )}

        </div>
      ),
    },

    {
      key: "totalQuantity",
      label: "Available Quantity",
      render: (value) => {
        const quantity =Number(value.totalQuantity) || 0;
        return (
          <span
            className={`badge ${
              quantity === 0
                ? "text-bg-danger"
                : "text-bg-warning"
            }`}
          >
            {quantity}
          </span>
        );
      },
    },

    {
      key: "totalQuantity",
      label: "Stock Status",

      render: (value) => {
        const quantity = Number(value.totalQuantity) || 0;
        if (quantity === 0) {
          return (
            <span className="badge text-bg-danger">
              Out of Stock
            </span>
          );
        }

        return (
          <span className="badge text-bg-warning">
            Low Stock
          </span>
        );
      },
    },
  ];

  const actions = [
    {
      type: "show",
      label: "Show",

      link: (medicine) =>
        `/medicines/${medicine._id._id}`,
    },
  ];

  // ==========================================
  // Render
  // ==========================================

  return (
    <div>
      <Header
        title="Low Stock"
        description="Monitor medicines with low available stock"
      />

      {/* Error */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Warning */}

      <div className="alert alert-warning d-flex align-items-center gap-2 mb-4">
        <TrendingDown size={20} />

        <div>
          <strong>
            Low Stock Warning
          </strong>

          <div className="small">
            Medicines at or below the selected
            quantity threshold are displayed here.
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end g-3">

            {/* Threshold */}

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                Stock Threshold
              </label>

              <select
                className="form-select"
                value={threshold}
                onChange={
                  handleThresholdChange
                }
                disabled={loading}
              >
                <option value={0}>
                  0 - Out of Stock
                </option>

                <option value={5}>
                  5 or less
                </option>

                <option value={10}>
                  10 or less
                </option>

                <option value={20}>
                  20 or less
                </option>

                <option value={50}>
                  50 or less
                </option>
              </select>
            </div>

            {/* Refresh */}

            <div className="col-12 col-md-auto">
              <button
                type="button"
                className="btn btn-light border d-flex align-items-center gap-2"
                onClick={() =>
                  fetchLowStock(
                    pagination.page,
                    threshold
                  )
                }
                disabled={loading}
              >
                <RefreshCw
                  size={18}
                  className={
                    loading
                      ? "spin"
                      : ""
                  }
                />

                {loading
                  ? "Refreshing..."
                  : "Refresh"}
              </button>
            </div>

            {/* Count */}

            <div className="col-12 col-md-auto ms-md-auto">
              <div className="text-muted">
                {pagination.total} medicine
                {pagination.total !== 1
                  ? "s"
                  : ""}{" "}
                need attention
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Table */}

      <AdminDataPage
        title="Low Stock Medicines"
        subtitle={`Medicines with quantity ≤ ${threshold}`}
        loading={loading}
        columns={columns}
        actions={actions}
        data={medicines}
      />

      {/* Pagination */}

      {pagination.pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">

          {/* Previous */}

          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading ||
              pagination.page <= 1
            }
            onClick={() =>
              fetchLowStock(
                pagination.page - 1,
                threshold
              )
            }
          >
            Previous
          </button>

          {/* Page */}

          <span>
            Page{" "}
            <strong>
              {pagination.page}
            </strong>{" "}
            of{" "}
            <strong>
              {pagination.pages}
            </strong>
          </span>

          {/* Next */}

          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading ||
              pagination.page >=
                pagination.pages
            }
            onClick={() =>
              fetchLowStock(
                pagination.page + 1,
                threshold
              )
            }
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
};

export default LowStock;
