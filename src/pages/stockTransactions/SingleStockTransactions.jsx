
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DetailsCard from "../../components/details/DetailsCard";
import Header from "../../components/header/Header";
import {
  getSingleStockTransaction,
} from "../../services/stockTransactions.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const SingleStockTransaction = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  const [stockTransaction, setStockTransaction] =
    useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockTransaction = async () => {
      try {
        setLoading(true);

        const response =
          await getSingleStockTransaction(id);

        setStockTransaction(
          response.transaction ||
            response.transactions ||
            null
        );
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("stockTransactions.loadDetailsFailed")
          )
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
      label: t("stockTransactions.medicine"),
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
              {t("stockTransactions.manufacturer")}:{" "}
              {medicine.manufacturer}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "batch",
      label: t("stockTransactions.batch"),
      render: (batch) => (
        <div>
          <div className="fw-semibold">
            {batch?.batchNumber || "-"}
          </div>

          {batch?.expiryDate && (
            <div className="text-muted small">
              {t("stockTransactions.expiry")}:{" "}
              {new Date(
                batch.expiryDate
              ).toLocaleDateString(
                i18n.language === "ar"
                  ? "ar-EG"
                  : "en-GB"
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "type",
      label: t("stockTransactions.transactionType"),
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
      label: t("stockTransactions.quantity"),
      render: (quantity) => (
        <span className="fw-semibold">
          {quantity ?? 0}
        </span>
      ),
    },
    {
      key: "reason",
      label: t("stockTransactions.reason"),
      render: (reason) => (
        <span>{reason || "-"}</span>
      ),
    },
    {
      key: "user",
      label: t("stockTransactions.createdBy"),
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
      label: t("stockTransactions.createdAt"),
      render: (value) =>
        value
          ? new Date(value).toLocaleString(
              i18n.language === "ar"
                ? "ar-EG"
                : "en-GB"
            )
          : "-",
    },
  ];

  return (
    <div className="container-fluid">
      <Header
        title={t("stockTransactions.details")}
        description={t("stockTransactions.detailsDescription")}
        buttonContent={t("stockTransactions.backToTransactions")}
        buttonLink="/stock-transaction"
      />

      <DetailsCard
        title={t("stockTransactions.information")}
        data={stockTransaction}
        fields={stockTransactionFields}
        loading={loading}
        emptyMessage={t("stockTransactions.notFound")}
      />
    </div>
  );
};

export default SingleStockTransaction;