
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock3, RefreshCw } from "lucide-react";

import AdminDataPage from "../../components/table/AdminDataPage";
import Header from "../../components/header/Header";

import "./stock.css";
import { getExpiryBatches } from "../../services/stock.service";

const ExpiryBatches = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [batches, setBatches] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0});

  const [days, setDays] = useState(
    Number(searchParams.get("days")) || 30
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchExpiryBatches = async (
    page = pagination.page,
    selectedDays = days
  ) => {
    setLoading(true);
    setError("");

    try {
      const response = await getExpiryBatches({
        days: selectedDays,
        page,
        limit: pagination.limit,
      });

      console.log("Expiry batches:", response);

      setBatches(response.batches || []);

      setPagination( response.pagination || {page: 1,limit: 10, total: 0,pages: 0,});
    } catch (error) {
      console.error(
        "Failed to load expiry batches:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load expiry batches"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchExpiryBatches(1, days);
  }, []);

  const handleDaysChange = (value) => {
    const newDays = Number(value);
    setDays(newDays);
    setSearchParams({ days: newDays});
    fetchExpiryBatches(1, newDays);
  };

  const columns = [
    {
      key: "medicine",
      label: "Medicine",
          render: (medicine) => ( 
            medicine.medicine?.name || ''
    
      ),
    },

    {
      key: "batchNumber",
      label: "Batch Number",

    },

    {
      key: "quantity",
      label: "Quantity",

    },

    {
      key: "expiryDate",
      label: "Expiry Date",

    },

    {
      key: "sellingPrice",
      label: "Selling Price",
    },

    {
      key: "isActive",
      label: "Status",

      render: (value) => (
        <span
          className={`badge ${
            value
              ? "text-bg-success"
              : "text-bg-secondary"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: "Show",

      link: (batch) =>
        `/batches/${batch._id}`,
    },
  ];

  return (
    <div>
      <Header
        title="Expiry Batches"
        description="Monitor medicines that are approaching their expiry date"
      />

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end g-3">

            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                Expiry Period
              </label>

              <select
                className="form-select"
                value={days}
                onChange={(e) =>
                  handleDaysChange(e.target.value)
                }
                disabled={loading}
              >
                <option value={7}>
                  Next 7 Days
                </option>

                <option value={15}>
                  Next 15 Days
                </option>

                <option value={30}>
                  Next 30 Days
                </option>

                <option value={60}>
                  Next 60 Days
                </option>

                <option value={90}>
                  Next 90 Days
                </option>

                <option value={180}>
                  Next 180 Days
                </option>

                <option value={365}>
                  Next 365 Days
                </option>
              </select>
            </div>

            <div className="col-12 col-md-auto">
              <button
                type="button"
                className="btn btn-light border d-flex align-items-center gap-2"
                onClick={() => fetchExpiryBatches(pagination.page, days) }
                disabled={loading}
              >
                <RefreshCw
                  size={18}
                  className={
                    loading ? "spin" : ""
                  }
                />

                {loading
                  ? "Refreshing..."
                  : "Refresh"}
              </button>
            </div>

            <div className="col-12 col-md-auto ms-md-auto">
              <div className="d-flex align-items-center gap-2 text-muted">
                <Clock3 size={18} />

                <span>
                  {pagination.total} batch
                  {pagination.total !== 1
                    ? "es"
                    : ""}{" "}
                  expiring
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Table */}
      <AdminDataPage
        title="Expiry Batches"
        subtitle={`Batches expiring within the next ${days} days`}
        loading={loading}
        columns={columns}
        actions={actions}
        data={batches}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">

          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading ||
              pagination.page <= 1
            }
            onClick={() =>
              fetchExpiryBatches(
                pagination.page - 1,
                days
              )
            }
          >
            Previous
          </button>

          <span className="px-3">
            Page{" "}
            <strong>
              {pagination.page}
            </strong>{" "}
            of{" "}
            <strong>
              {pagination.pages}
            </strong>
          </span>

          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading ||
              pagination.page >=
                pagination.pages
            }
            onClick={() =>
              fetchExpiryBatches(
                pagination.page + 1,
                days
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

export default ExpiryBatches;
