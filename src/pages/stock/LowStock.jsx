import { useEffect, useState } from "react";
import {
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import AdminDataPage from "../../components/table/AdminDataPage";
import Header from "../../components/header/Header";
import { getLowStock } from "../../services/stock.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const LowStock = () => {
  const { t } = useTranslation();

  const [medicines, setMedicines] = useState([]);
  const [threshold, setThreshold] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchLowStock = async (
    page = 1,
    selectedThreshold = threshold
  ) => {
    setLoading(true);

    try {
      const response = await getLowStock({
        threshold: selectedThreshold,
        page,
        limit: pagination.limit,
      });

      setMedicines(response.medicines || []);

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
          t("stock.loadLowStockFailed")
        )
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
      label: t("stock.medicine"),
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
      label: t("stock.availableQuantity"),
      render: (value) => {
        const quantity =
          Number(value.totalQuantity) || 0;

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
      label: t("stock.status"),
      render: (value) => {
        const quantity =
          Number(value.totalQuantity) || 0;

        if (quantity === 0) {
          return (
            <span className="badge text-bg-danger">
              {t("stock.outOfStock")}
            </span>
          );
        }

        return (
          <span className="badge text-bg-warning">
            {t("stock.lowStock")}
          </span>
        );
      },
    },
  ];

  const actions = [
    {
      type: "show",
      label: t("common.view"),
      link: (medicine) =>
        `/medicines/${medicine._id._id}`,
    },
  ];

  const attentionText =
    pagination.total === 1
      ? t("stock.medicineNeedsAttention", {
          count: pagination.total,
        })
      : t("stock.medicinesNeedAttention", {
          count: pagination.total,
        });

  return (
    <div>
      <Header
        title={t("stock.lowStockTitle")}
        description={t("stock.lowStockSubtitle")}
      />

      <div className="alert alert-warning d-flex align-items-center gap-2 mb-4">
        <TrendingDown size={20} />

        <div>
          <strong>
            {t("stock.lowStockWarning")}
          </strong>

          <div className="small">
            {t("stock.lowStockWarningDescription")}
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end g-3">
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                {t("stock.stockThreshold")}
              </label>

              <select
                className="form-select"
                value={threshold}
                onChange={handleThresholdChange}
                disabled={loading}
              >
                <option value={0}>
                  {t("stock.outOfStockOption")}
                </option>

                <option value={5}>
                  {t("stock.orLess", { value: 5 })}
                </option>

                <option value={10}>
                  {t("stock.orLess", { value: 10 })}
                </option>

                <option value={20}>
                  {t("stock.orLess", { value: 20 })}
                </option>

                <option value={50}>
                  {t("stock.orLess", { value: 50 })}
                </option>
              </select>
            </div>

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
                  className={loading ? "spin" : ""}
                />

                {loading
                  ? t("stock.refreshing")
                  : t("stock.refresh")}
              </button>
            </div>

            <div className="col-12 col-md-auto ms-md-auto">
              <div className="text-muted">
                {attentionText}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminDataPage
        title={t("stock.lowStockMedicinesTitle")}
        subtitle={t("stock.lowStockDescriptionFull", {
          threshold,
        })}
        loading={loading}
        columns={columns}
        actions={actions}
        data={medicines}
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
              fetchLowStock(
                pagination.page - 1,
                threshold
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
              fetchLowStock(
                pagination.page + 1,
                threshold
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

export default LowStock;
