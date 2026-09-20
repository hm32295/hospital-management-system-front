import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import AdminDataPage from "../../components/table/AdminDataPage";
import Header from "../../components/header/Header";

import { getExpiredBatches } from "../../services/stock.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const ExpiredBatches = () => {
  const { t,i18n  } = useTranslation();

  const [batches, setBatches] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchExpiredBatches = async (page = 1) => {
    setLoading(true);

    try {
      const response = await getExpiredBatches({
        page,
        limit: pagination.limit,
      });

      setBatches(response.batches || []);

      setPagination(
        response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        }
      );
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("stock.loadExpiredBatchesFailed")
        )
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
      label: t("stock.medicine"),
      render: (medicine) =>
        medicine?.medicine?.name || "-",
    },
    {
      key: "batchNumber",
      label: t("stock.batchNumber"),
    },
    {
      key: "quantity",
      label: t("stock.quantity"),
    },
    {
      key: "expiryDate",
      label: t("stock.expiryDate"),
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString(
              i18n.language === "ar" ? "ar-EG" : "en-GB"
            )
          : "-",
    },
    {
      key: "sellingPrice",
      label: t("stock.sellingPrice"),
      render: (value) =>
        value != null
          ? `${Number(value).toLocaleString()} ${t(
              "common.egp"
            )}`
          : "-",
    },
    {
      key: "isActive",
      label: t("stock.status"),
      render: (value) => (
        <span
          className={`badge ${
            value
              ? "text-bg-success"
              : "text-bg-secondary"
          }`}
        >
          {value
            ? t("stock.active")
            : t("stock.inactive")}
        </span>
      ),
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (batch) =>
        `/batches/${batch._id}`,
    },
  ];

  const expiredBatchesText =
    pagination.total === 1
      ? t("stock.expiredBatchCount", {
          count: pagination.total,
        })
      : t("stock.expiredBatchesCount", {
          count: pagination.total,
        });

  return (
    <div>
      <Header
        title={t("stock.expiredBatches")}
        description={t("stock.expiredBatchesDescription")}
      />

      <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
        <AlertTriangle size={20} />

        <div>
          <strong>
            {t("stock.expiredStockWarning")}
          </strong>

          <div className="small">
            {t("stock.expiredStockWarningDescription")}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <button
          type="button"
          className="btn btn-light border d-flex align-items-center gap-2"
          onClick={() =>
            fetchExpiredBatches(pagination.page)
          }
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

      <AdminDataPage
        title={t("stock.expiredBatches")}
        subtitle={expiredBatchesText}
        loading={loading}
        columns={columns}
        actions={actions}
        data={batches}
      />

      {pagination.pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading || pagination.page <= 1
            }
            onClick={() =>
              fetchExpiredBatches(
                pagination.page - 1
              )
            }
          >
            {t("stock.previous")}
          </button>

          <span>
            {t("stock.page")}{" "}
            <strong>{pagination.page}</strong>{" "}
            {t("stock.of")}{" "}
            <strong>{pagination.pages}</strong>
          </span>

          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading ||
              pagination.page >= pagination.pages
            }
            onClick={() =>
              fetchExpiredBatches(
                pagination.page + 1
              )
            }
          >
            {t("stock.next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpiredBatches;