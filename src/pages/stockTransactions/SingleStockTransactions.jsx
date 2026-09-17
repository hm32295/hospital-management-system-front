
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";

import {
  getSingleStockTransaction,
} from "../../services/stockTransactions.service";

const SingleStockTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stockTransaction, setStockTransaction] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStockTransaction = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getSingleStockTransaction(id);

        console.log(
          "Single Stock Transaction:",
          response
        );

        setStockTransaction(
          response.transaction ||
            response.transactions ||
            null
        );
      } catch (error) {
        console.error(
          "Failed to load stock transaction:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load Stock Transaction"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStockTransaction();
    }
  }, [id]);

  const stockTransactionFields = [
    {
      key: "medicine",
      label: "Medicine",

      render: (medicine) => (
        <div>
          <div className="fw-semibold">
            {medicine?.name || "-"}
          </div>

          {medicine?.genericName && (
            <div className="text-muted small">
              {medicine.genericName}
            </div>
          )}

          {medicine?.manufacturer && (
            <div className="text-muted small">
              Manufacturer:{" "}
              {medicine.manufacturer}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "batch",
      label: "Batch",

      render: (batch) => (
        <div>
          <div className="fw-semibold">
            {batch?.batchNumber || "-"}
          </div>

          {batch?.expiryDate && (
            <div className="text-muted small">
              Expiry:{" "}
              {new Date(
                batch.expiryDate
              ).toLocaleDateString("en-GB")}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "type",
      label: "Transaction Type",

      render: (type) => (
        <span
          className={`badge ${
            type === "IN"
              ? "text-bg-success"
              : type === "OUT"
              ? "text-bg-danger"
              : "text-bg-secondary"
          }`}
        >
          {type || "-"}
        </span>
      ),
    },

    {
      key: "quantity",
      label: "Quantity",

      render: (quantity) => (
        <span className="fw-semibold">
          {quantity ?? 0}
        </span>
      ),
    },

    {
      key: "reason",
      label: "Reason",

      render: (reason) => (
        <span>
          {reason || "-"}
        </span>
      ),
    },

    {
      key: "user",
      label: "Created By",

      render: (user) => (
        <div>
          <div className="fw-semibold">
            {user?.name || "-"}
          </div>

          {user?.email && (
            <div className="text-muted small">
              {user.email}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",

      render: (value) =>
        value
          ? new Date(
              value
            ).toLocaleString("en-GB")
          : "-",
    },
  ];

  if (error) {
    return (
      <div className="container-fluid">
        <Header
          title="Stock Transaction"
          description="Stock transaction details"
          buttonContent="Back to Stock Transactions"
          buttonLink="/stock-transaction"
        />

        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate("/stock-transactions")
          }
        >
          Back to Stock Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Header
        title="Stock Transaction Details"
        description="View stock movement details"
        buttonContent="Back to Stock Transactions"
        buttonLink="/stock-transaction"
      />

      <DetailsCard
        title="Stock Transaction Information"
        data={stockTransaction}
        fields={stockTransactionFields}
        loading={loading}
        emptyMessage="Stock Transaction not found"
      />
    </div>
  );
};

export default SingleStockTransaction;
