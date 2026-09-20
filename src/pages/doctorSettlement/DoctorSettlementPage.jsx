
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getOperation } from "../../services/operations.service";
import { getOperationSettlements } from "../../services/doctorSettlements.service";
import DetailsCard from "../../components/details/DetailsCard";
import DoctorSettlementForm from "./DoctorSettlementForm";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const DoctorSettlementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [operation, setOperation] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settlementsLoading, setSettlementsLoading] = useState(true);

  const loadOperation = async () => {
    try {
      const response = await getOperation(id);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            t("operations.loadFailed")
        );
      }

      setOperation(response.operation || null);
    } catch (error) {
      console.error("GET OPERATION ERROR:", error);

      showError(
        getApiErrorMessage(
          error,
          t("operations.loadFailed")
        )
      );
    }
  };

  const loadSettlements = async () => {
    try {
      setSettlementsLoading(true);

      const response =
        await getOperationSettlements(id);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            t("operations.loadSettlementsFailed")
        );
      }

      setSettlements(response.data || []);
    } catch (error) {
      console.error(
        "GET OPERATION SETTLEMENTS ERROR:",
        error
      );

      showError(
        getApiErrorMessage(
          error,
          t("operations.loadSettlementsFailed")
        )
      );
    } finally {
      setSettlementsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        loadOperation(),
        loadSettlements(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleSettlementSuccess = async () => {
    await loadData();
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toFixed(2)} ${t(
      "common.egp"
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-GB"
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-GB"
    );
  };

  if (loading) {
    return (
      <div className="admin-data-page">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary">
            <span className="visually-hidden">
              {t("common.loading")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="admin-data-page">
        <div className="alert alert-danger">
          {t("operations.operationNotFound")}
        </div>
      </div>
    );
  }

  const doctorFeeAmount = Number(
    operation.doctorFeeAmount || 0
  );

  const paidToDoctor = settlements.reduce(
    (total, settlement) => {
      if (settlement.status !== "completed") {
        return total;
      }

      return (
        total + Number(settlement.amount || 0)
      );
    },
    0
  );

  const remainingDoctorFee = Math.max(
    doctorFeeAmount - paidToDoctor,
    0
  );

  const doctorFeeType =
    operation.doctorFeeType === "percentage"
      ? `${operation.doctorFeeValue}%`
      : operation.doctorFeeType === "fixed"
      ? formatMoney(operation.doctorFeeValue)
      : t("operations.feeTypes.none");

  const operationFields = [
    {
      key: "patient.name",
      label: t("operations.patient"),
      nav: (value, data) =>
        value
          ? `/patients/${data.patient?._id}`
          : null,
    },
    {
      key: "doctor.name",
      label: t("operations.doctor"),
      nav: (value, data) =>
        value
          ? `/doctors/${data.doctor?._id}`
          : null,
    },
    {
      key: "specialty.name",
      label: t("operations.specialty"),
    },
    {
      key: "operationName",
      label: t("operations.operation"),
    },
    {
      key: "operationDate",
      label: t("operations.operationDate"),
      render: (value) => formatDate(value),
    },
    {
      key: "totalAmount",
      label: t("operations.operationTotal"),
      render: (value) => formatMoney(value),
    },
    {
      key: "doctorFeeType",
      label: t("operations.doctorFeeType"),
      render: () => doctorFeeType,
    },
    {
      key: "doctorFeeAmount",
      label: t("operations.doctorFee"),
      render: (value) => formatMoney(value),
    },
    {
      key: "paymentStatus",
      label: t("operations.paymentStatus"),
      render: (value) => (
        <span
          className={`badge ${
            value === "paid"
              ? "bg-success"
              : value === "partial"
              ? "bg-warning text-dark"
              : "bg-secondary"
          }`}
        >
          {value === "paid"
            ? t(
                "operations.paymentStatuses.paid"
              )
            : value === "partial"
            ? t(
                "operations.paymentStatuses.partial"
              )
            : value === "unpaid"
            ? t(
                "operations.paymentStatuses.unpaid"
              )
            : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: t("operations.operationStatus"),
      render: (value) => (
        <span
          className={`badge ${
            value === "completed"
              ? "bg-success"
              : value === "cancelled"
              ? "bg-danger"
              : "bg-warning text-dark"
          }`}
        >
          {value === "completed"
            ? t(
                "operations.statuses.completed"
              )
            : value === "cancelled"
            ? t(
                "operations.statuses.cancelled"
              )
            : value === "pending"
            ? t(
                "operations.statuses.pending"
              )
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="admin-data-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">
            {t("operations.doctorSettlement")}
          </h4>

          <p className="text-muted mb-0">
            {t(
              "operations.doctorSettlementDescription"
            )}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() =>
            navigate(`/operations/${id}`)
          }
        >
          <ArrowLeft size={16} />
          {t("operations.backToOperation")}
        </button>
      </div>

      <DetailsCard
        data={operation}
        fields={operationFields}
      />

      <div className="row g-3 mt-1">
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted mb-2">
                {t("operations.doctorFee")}
              </div>

              <h4 className="mb-0">
                {formatMoney(doctorFeeAmount)}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted mb-2">
                {t("operations.paidToDoctor")}
              </div>

              <h4 className="mb-0 text-success">
                {formatMoney(paidToDoctor)}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted mb-2">
                {t("operations.remainingDoctorFee")}
              </div>

              <h4 className="mb-0 text-danger">
                {formatMoney(remainingDoctorFee)}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {operation.status === "cancelled" ? (
        <div className="alert alert-danger mt-4">
          {t("operations.settlementNotAvailable")}
        </div>
      ) : operation.paymentStatus !== "paid" ? (
        <div className="alert alert-warning mt-4">
          {t("operations.mustBeFullyPaid")}
        </div>
      ) : remainingDoctorFee > 0 ? (
        <div className="card mt-4">
          <div className="card-header">
            <div className="d-flex align-items-center gap-2">
              <Wallet size={18} />
              <strong>
                {t("operations.payDoctor")}
              </strong>
            </div>
          </div>

          <div className="card-body">
            <DoctorSettlementForm
              operation={operation}
              remainingAmount={remainingDoctorFee}
              onSuccess={handleSettlementSuccess}
            />
          </div>
        </div>
      ) : (
        <div className="alert alert-success mt-4">
          {t("operations.doctorFeeFullyPaid")}
        </div>
      )}

      <div className="card mt-4">
        <div className="card-header">
          <strong>
            {t("operations.settlementHistory")}
          </strong>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="text-center">
                    #
                  </th>
                  <th className="text-center">
                    {t("operations.amount")}
                  </th>
                  <th className="text-center">
                    {t("operations.status")}
                  </th>
                  <th className="text-center">
                    {t("operations.paidBy")}
                  </th>
                  <th className="text-center">
                    {t("operations.date")}
                  </th>
                  <th className="text-center">
                    {t("operations.notes")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {settlementsLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4"
                    >
                      <div className="spinner-border text-primary">
                        <span className="visually-hidden">
                          {t("common.loading")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : settlements.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-muted"
                    >
                      {t(
                        "operations.noSettlementPayments"
                      )}
                    </td>
                  </tr>
                ) : (
                  settlements.map(
                    (settlement, index) => (
                      <tr
                        key={
                          settlement._id ||
                          index
                        }
                      >
                        <td className="text-center">
                          {index + 1}
                        </td>

                        <td className="text-center fw-semibold">
                          {formatMoney(
                            settlement.amount
                          )}
                        </td>

                        <td className="text-center">
                          <span
                            className={`badge ${
                              settlement.status ===
                              "completed"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {settlement.status ===
                            "completed"
                              ? t(
                                  "operations.settlementStatuses.completed"
                                )
                              : settlement.status ===
                                "cancelled"
                              ? t(
                                  "operations.settlementStatuses.cancelled"
                                )
                              : settlement.status ||
                                "-"}
                          </span>
                        </td>

                        <td className="text-center">
                          {settlement.paidBy?.name ||
                            "-"}
                        </td>

                        <td className="text-center">
                          {formatDateTime(
                            settlement.createdAt
                          )}
                        </td>

                        <td className="text-center">
                          {settlement.notes || "-"}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSettlementPage;
