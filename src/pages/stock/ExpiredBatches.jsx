
import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminDataPage from "../../components/table/AdminDataPage";
import Header from "../../components/header/Header";

import { getExpiredBatches } from "../../services/stock.service";

const ExpiredBatches = () => {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
  const fetchExpiredBatches = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await getExpiredBatches({
        page, limit: pagination.limit,
      });

      console.log("Expired batches:", response);

      setBatches(response.batches || []);

      setPagination(
        response.pagination || {
          page: 1,limit: 10,total: 0,pages: 0,
        }
      );
    } catch (error) {
      console.error(
        "Failed to load expired batches:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load expired batches"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchExpiredBatches();
  }, []);

  const columns = [
    {
      key: "medicine",
      label: "Medicine",

      render: (medicine) => (
            medicine.medicine?.name || "-"
        
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
            value.isActive
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
        title="Expired Batches"
        description="View medicines that have passed their expiry date"
      />

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Warning */}
      <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
        <AlertTriangle size={20} />

        <div>
          <strong>Expired Stock Warning</strong>

          <div className="small">
            These batches have passed their expiry
            date and should not be dispensed.
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="d-flex justify-content-end mb-4">
        <button
          type="button"
          className="btn btn-light border d-flex align-items-center gap-2"
          onClick={() =>
            fetchExpiredBatches(
              pagination.page
            )
          }
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

      {/* Table */}
      <AdminDataPage
        title="Expired Batches"
        subtitle={`${pagination.total} expired batch${
          pagination.total !== 1
            ? "es"
            : ""
        }`}
        loading={loading}
        columns={columns}
        actions={actions}
        data={batches}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">

          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading ||
              pagination.page <= 1
            }
            onClick={() =>
              fetchExpiredBatches(
                pagination.page - 1
              )
            }
          >
            Previous
          </button>

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

          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading ||
              pagination.page >=
                pagination.pages
            }
            onClick={() =>
              fetchExpiredBatches(
                pagination.page + 1
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

export default ExpiredBatches;
