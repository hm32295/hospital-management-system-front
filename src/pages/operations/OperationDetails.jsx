
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  completeOperation,
  getOperation,
} from "../../services/operations.service";
import {
  getOperationSettlements,
} from "../../services/doctorSettlements.service";
import DetailsCard from "../../components/details/DetailsCard";
import {
  showError,
  showSuccess,
} from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const OperationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [operation, setOperation] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settlementsLoading, setSettlementsLoading] =
    useState(false);

  const loadOperation = async () => {
    const response = await getOperation(id);

    if (!response?.success) {
      throw new Error(
        response?.message ||
          t("operations.loadFailed")
      );
    }

    setOperation(response.operation);
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
        "GET SETTLEMENTS ERROR:",
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

      await loadOperation();
      await loadSettlements();
    } catch (error) {
      console.error(
        "GET OPERATION ERROR:",
        error
      );

      showError(
        getApiErrorMessage(
          error,
          t("operations.loadFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-GB"
    );
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toFixed(2)} ${t(
      "common.egp"
    )}`;
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "badge bg-success";
      case "partial":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  const getOperationStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "badge bg-success";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-warning text-dark";
    }
  };

  const getSettlementStatusClass = (status) => {
    return status === "completed"
      ? "badge bg-success"
      : "badge bg-danger";
  };

  const getPaymentStatusLabel = (status) => {
    return t(
      `operations.paymentStatuses.${status}`,
      {
        defaultValue: status || "-",
      }
    );
  };

  const getOperationStatusLabel = (status) => {
    return t(
      `operations.statuses.${status}`,
      {
        defaultValue: status || "-",
      }
    );
  };

  const getSettlementStatusLabel = (status) => {
    return t(
      `operations.settlementStatuses.${status}`,
      {
        defaultValue: status || "-",
      }
    );
  };

  const handleCompleteOperation = async () => {
    const confirmed = window.confirm(
      t("operations.completeConfirmation")
    );

    if (!confirmed) return;

    try {
      const response = await completeOperation(id);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            t("operations.completeFailed")
        );
      }

      showSuccess(
        response?.message ||
          t("operations.completeSuccess")
      );

      setOperation(response.operation);
    } catch (error) {
      console.error(
        "COMPLETE OPERATION ERROR:",
        error
      );

      showError(
        getApiErrorMessage(
          error,
          t("operations.completeFailed")
        )
      );
    }
  };

  const doctorPaidAmount = settlements.reduce(
    (total, settlement) => {
      if (settlement.status !== "completed") {
        return total;
      }

      return (
        total +
        Number(settlement.amount || 0)
      );
    },
    0
  );

  const doctorFeeAmount = Number(
    operation?.doctorFeeAmount || 0
  );

  const doctorRemainingAmount = Math.max(
    doctorFeeAmount - doctorPaidAmount,
    0
  );

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
      key: "patient.phone",
      label: t("operations.patientPhone"),
    },
    {
      key: "doctor.name",
      label: t("operations.doctor"),
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
      render: (value) =>
        formatDate(value),
    },
    {
      key: "cost",
      label: t("operations.cost"),
      render: (value) =>
        formatMoney(value),
    },
    {
      key: "discount",
      label: t("operations.discount"),
      render: (value) =>
        formatMoney(value),
    },
    {
      key: "totalAmount",
      label: t("operations.totalAmount"),
      render: (value) => (
        <strong>
          {formatMoney(value)}
        </strong>
      ),
    },
    {
      key: "doctorFeeType",
      label: t("operations.doctorFeeType"),
      render: (value) =>
        value === "percentage"
          ? t("operations.feeTypes.percentage")
          : value === "fixed"
          ? t("operations.feeTypes.fixed")
          : t("operations.feeTypes.none"),
    },
    {
      key: "doctorFeeValue",
      label: t("operations.doctorFeeValue"),
      render: (value, data) =>
        data.doctorFeeType === "percentage"
          ? `${Number(value || 0)}%`
          : formatMoney(value),
    },
    {
      key: "doctorFeeAmount",
      label: t("operations.doctorFeeAmount"),
      render: (value) =>
        formatMoney(value),
    },
    {
      key: "hospitalAmount",
      label: t("operations.hospitalAmount"),
      render: (value) => (
        <strong>
          {formatMoney(value)}
        </strong>
      ),
    },
    {
      key: "paidAmount",
      label: t("operations.paidAmount"),
      render: (value) =>
        formatMoney(value),
    },
    {
      key: "remainingAmount",
      label: t("operations.remainingAmount"),
      render: (value) => (
        <strong>
          {formatMoney(value)}
        </strong>
      ),
    },
    {
      key: "paymentStatus",
      label: t("operations.paymentStatus"),
      render: (value) => (
        <span
          className={getPaymentStatusClass(
            value
          )}
        >
          {getPaymentStatusLabel(value)}
        </span>
      ),
    },
    {
      key: "status",
      label: t("operations.operationStatus"),
      render: (value) => (
        <span
          className={getOperationStatusClass(
            value
          )}
        >
          {getOperationStatusLabel(value)}
        </span>
      ),
    },
    {
      key: "notes",
      label: t("operations.notes"),
      col: "col-12",
    },
  ];

  if (!loading && !operation) {
    return (
      <div className="details-page">
        <div className="details-card">
          <div className="details-empty">
            <h5>
              {t("operations.operationNotFound")}
            </h5>

            <p>
              {t("operations.operationNotFoundDescription")}
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate("/operations")
              }
            >
              {t("operations.backToOperations")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">
            {t("operations.operationDetails")}
          </h4>

          <p className="text-muted mb-0">
            {t("operations.detailsDescription")}
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => navigate("/operations")}
          >
            <ArrowLeft size={17} />
            {t("common.back")}
          </button>

          {!loading &&
            operation?.status === "pending" && (
              <>
                <button
                  type="button"
                  className="btn btn-success d-flex align-items-center gap-2"
                  onClick={
                    handleCompleteOperation
                  }
                >
                  <CheckCircle size={17} />
                  {t("operations.completeOperation")}
                </button>

                <button
                  type="button"
                  className="btn btn-warning d-flex align-items-center gap-2"
                  onClick={() =>
                    navigate(
                      `/operations/edit/${operation._id}`
                    )
                  }
                >
                  <Pencil size={17} />
                  {t("common.edit")}
                </button>
              </>
            )}
        </div>
      </div>

      <DetailsCard
        data={operation || {}}
        fields={operationFields}
        loading={loading}
        emptyMessage={t(
          "operations.noOperationInformation"
        )}
      />

      {!loading && operation && (
        <div className="row g-4 mt-1">
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <small className="text-muted d-block mb-2">
                  {t("operations.totalAmount")}
                </small>

                <h4 className="mb-0">
                  {formatMoney(
                    operation.totalAmount
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <small className="text-muted d-block mb-2">
                  {t("operations.paidAmount")}
                </small>

                <h4 className="mb-0 text-success">
                  {formatMoney(
                    operation.paidAmount
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <small className="text-muted d-block mb-2">
                  {t("operations.remainingAmount")}
                </small>

                <h4 className="mb-0 text-danger">
                  {formatMoney(
                    operation.remainingAmount
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading &&
        operation &&
        operation.status !== "cancelled" && (
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center gap-3">
                <div>
                  <h5 className="mb-1">
                    {t("operations.operationPayment")}
                  </h5>

                  <p className="text-muted mb-0">
                    {t(
                      "operations.operationPaymentDescription"
                    )}
                  </p>
                </div>

                {operation.remainingAmount >
                  0 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(
                        `/operations/${operation._id}/payment`
                      )
                    }
                  >
                    {t("operations.addPayment")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      {!loading && operation && (
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
              <div>
                <h5 className="mb-1">
                  {t("operations.doctorSettlement")}
                </h5>

                <p className="text-muted mb-0">
                  {t(
                    "operations.doctorSettlementDescription"
                  )}
                </p>
              </div>

              {operation.status !==
                "cancelled" &&
                operation.paymentStatus ===
                  "paid" &&
                doctorRemainingAmount > 0 && (
                  <button
                    type="button"
                    className="btn btn-success d-flex align-items-center gap-2"
                    onClick={() =>
                      navigate(
                        `/operations/${operation._id}/settlement`
                      )
                    }
                  >
                    <Wallet size={17} />
                    {t("operations.payDoctor")}
                  </button>
                )}
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">
                  <small className="text-muted d-block mb-1">
                    {t("operations.doctorFee")}
                  </small>

                  <strong>
                    {formatMoney(
                      doctorFeeAmount
                    )}
                  </strong>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">
                  <small className="text-muted d-block mb-1">
                    {t("operations.paidToDoctor")}
                  </small>

                  <strong className="text-success">
                    {formatMoney(
                      doctorPaidAmount
                    )}
                  </strong>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">
                  <small className="text-muted d-block mb-1">
                    {t(
                      "operations.remainingDoctorFee"
                    )}
                  </small>

                  <strong
                    className={
                      doctorRemainingAmount > 0
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {formatMoney(
                      doctorRemainingAmount
                    )}
                  </strong>
                </div>
              </div>
            </div>

            {operation.paymentStatus !==
              "paid" &&
              operation.status !==
                "cancelled" && (
                <div className="alert alert-warning mt-3 mb-0">
                  {t(
                    "operations.mustBeFullyPaid"
                  )}
                </div>
              )}

            {operation.paymentStatus ===
              "paid" &&
              doctorFeeAmount === 0 && (
                <div className="alert alert-secondary mt-3 mb-0">
                  {t(
                    "operations.noDoctorFee"
                  )}
                </div>
              )}

            {operation.paymentStatus ===
              "paid" &&
              doctorFeeAmount > 0 &&
              doctorRemainingAmount ===
                0 && (
                <div className="alert alert-success mt-3 mb-0">
                  {t(
                    "operations.doctorFeeFullyPaid"
                  )}
                </div>
              )}

            {settlements.length > 0 && (
              <div className="mt-4">
                <h6 className="mb-3">
                  {t(
                    "operations.settlementHistory"
                  )}
                </h6>

                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0">
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
                      {settlements.map(
                        (
                          settlement,
                          index
                        ) => (
                          <tr
                            key={
                              settlement._id ||
                              index
                            }
                          >
                            <td className="text-center">
                              {index + 1}
                            </td>

                            <td className="text-center">
                              {formatMoney(
                                settlement.amount
                              )}
                            </td>

                            <td className="text-center">
                              <span
                                className={getSettlementStatusClass(
                                  settlement.status
                                )}
                              >
                                {getSettlementStatusLabel(
                                  settlement.status
                                )}
                              </span>
                            </td>

                            <td className="text-center">
                              {settlement.paidBy
                                ?.name ||
                                "-"}
                            </td>

                            <td className="text-center">
                              {formatDate(
                                settlement.createdAt
                              )}
                            </td>

                            <td className="text-center">
                              {settlement.notes ||
                                "-"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {settlementsLoading && (
              <div className="text-center mt-3">
                <div className="spinner-border spinner-border-sm text-primary">
                  <span className="visually-hidden">
                    {t("common.loading")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationDetails;
