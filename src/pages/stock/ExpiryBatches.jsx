
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock3, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdminDataPage from "../../components/table/AdminDataPage";
import Header from "../../components/header/Header";
import "./stock.css";
import { getExpiryBatches } from "../../services/stock.service";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const ExpiryBatches = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [batches, setBatches] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [days, setDays] = useState(
    Number(searchParams.get("days")) || 30
  );

  const [loading, setLoading] = useState(false);

  const fetchExpiryBatches = async (
    page = pagination.page,
    selectedDays = days
  ) => {
    setLoading(true);

    try {
      const response = await getExpiryBatches({
        days: selectedDays,
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
          t("stock.loadExpiryBatchesFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiryBatches(1, days);
  }, []);

  const handleDaysChange = (value) => {
    const newDays = Number(value);

    setDays(newDays);
    setSearchParams({ days: newDays });
    fetchExpiryBatches(1, newDays);
  };

  const columns = [
    {
      key: "medicine",
      label: t("stock.medicine"),
      render: (medicine) =>
        medicine.medicine?.name || "-",
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
    },
    {
      key: "sellingPrice",
      label: t("stock.sellingPrice"),
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

  const batchesText =
    pagination.total === 1
      ? t("stock.batchesExpiring", {
          count: pagination.total,
        })
      : t("stock.batchesExpiringPlural", {
          count: pagination.total,
        });

  return (
    <div>
      <Header
        title={t("stock.expiryBatches")}
        description={t("stock.expiryBatchesSubtitle")}
      />

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end g-3">
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                {t("stock.expiryPeriod")}
              </label>

              <select
                className="form-select"
                value={days}
                onChange={(e) =>
                  handleDaysChange(e.target.value)
                }
                disabled={loading}
              >
                {[7, 15, 30, 60, 90, 180, 365].map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {t("stock.nextDays", {
                        days: value,
                      })}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-12 col-md-auto">
              <button
                type="button"
                className="btn btn-light border d-flex align-items-center gap-2"
                onClick={() =>
                  fetchExpiryBatches(
                    pagination.page,
                    days
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
              <div className="d-flex align-items-center gap-2 text-muted">
                <Clock3 size={18} />
                <span>{batchesText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminDataPage
        title={t("stock.expiryBatches")}
        subtitle={t("stock.batchesExpiringWithin", {
          days,
        })}
        loading={loading}
        columns={columns}
        actions={actions}
        data={batches}
      />

      {pagination.pages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <button
            type="button"
            className="btn btn-light border"
            disabled={
              loading || pagination.page <= 1
            }
            onClick={() =>
              fetchExpiryBatches(
                pagination.page - 1,
                days
              )
            }
          >
            {t("stock.previous")}
          </button>

          <span className="px-3">
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
              fetchExpiryBatches(
                pagination.page + 1,
                days
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

export default ExpiryBatches;