
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getOperation } from "../../services/operations.service";
import { getOperationPayments } from "../../services/operationPaymentsService";
import OperationPaymentForm from "./OperationPaymentForm";
import {
  showError,
} from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const OperationPaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [operation, setOperation] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] =
    useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await getOperation(id);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            t("operations.loadFailed")
        );
      }

      setOperation(response.operation);
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

  const loadPayments = async () => {
    try {
      setPaymentsLoading(true);

      const response =
        await getOperationPayments(id);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            t("operations.loadPaymentsFailed")
        );
      }

      setPayments(
        response?.payments || []
      );
    } catch (error) {
      console.error(
        "GET OPERATION PAYMENTS ERROR:",
        error
      );

      showError(
        getApiErrorMessage(
          error,
          t("operations.loadPaymentsFailed")
        )
      );
    } finally {
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    loadData();
    loadPayments();
  }, [id]);

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

  const formatMoney = (value) => {
    return `${Number(value || 0).toFixed(2)} ${t(
      "common.egp"
    )}`;
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-card">
          <div className="details-card-loading">
            <div className="details-skeleton-header">
              <div className="skeleton skeleton-icon" />

              <div className="skeleton-content">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-subtitle" />
              </div>
            </div>

            <div className="row g-4">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="col-12 col-md-6"
                  >
                    <div className="details-skeleton-item">
                      <div className="skeleton skeleton-label" />
                      <div className="skeleton skeleton-value" />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="details-page">
        <div className="details-card">
          <div className="details-empty">
            <h5>
              {t("operations.operationNotFound")}
            </h5>

            <p>
              {t(
                "operations.operationNotFoundDescription"
              )}
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

  const canPay =
    operation.status !== "cancelled" &&
    Number(operation.remainingAmount) > 0;

  return (
    <div className="details-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">
            {t("operations.operationPayment")}
          </h4>

          <p className="text-muted mb-0">
            {t(
              "operations.managePaymentsFor"
            )}{" "}
            <strong>
              {operation.operationName}
            </strong>
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() =>
            navigate(
              `/operations/${operation._id}`
            )
          }
        >
          <ArrowLeft size={17} />
          {t("operations.backToOperation")}
        </button>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">
                {t(
                  "operations.operationInformation"
                )}
              </h5>

              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <small className="text-muted d-block">
                    {t("operations.patient")}
                  </small>

                  <strong>
                    {operation.patient?.name ||
                      "-"}
                  </strong>
                </div>

                <div className="col-12 col-md-3">
                  <small className="text-muted d-block">
                    {t("operations.doctor")}
                  </small>

                  <strong>
                    {operation.doctor?.name ||
                      "-"}
                  </strong>
                </div>

                <div className="col-12 col-md-3">
                  <small className="text-muted d-block">
                    {t("operations.specialty")}
                  </small>

                  <strong>
                    {operation.specialty?.name ||
                      "-"}
                  </strong>
                </div>

                <div className="col-12 col-md-3">
                  <small className="text-muted d-block">
                    {t("operations.operationDate")}
                  </small>

                  <strong>
                    {formatDate(
                      operation.operationDate
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {canPay && (
          <div className="col-12">
            <OperationPaymentForm
              operation={operation}
            />
          </div>
        )}

        {!canPay && (
          <div className="col-12">
            <div className="alert alert-success mb-0">
              {operation.status ===
              "cancelled"
                ? t(
                    "operations.operationCancelled"
                  )
                : t(
                    "operations.operationFullyPaid"
                  )}
            </div>
          </div>
        )}

        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-1">
                    {t(
                      "operations.paymentHistory"
                    )}
                  </h5>

                  <p className="text-muted mb-0">
                    {t(
                      "operations.allPaymentsMade"
                    )}
                  </p>
                </div>

                <span className="badge bg-primary">
                  {payments.length}{" "}
                  {t(
                    "operations.payments"
                  )}
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>
                        {t("operations.amount")}
                      </th>
                      <th>
                        {t("operations.receivedBy")}
                      </th>
                      <th>
                        {t("operations.status")}
                      </th>
                      <th>
                        {t("operations.date")}
                      </th>
                      <th>
                        {t("operations.notes")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paymentsLoading ? (
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
                    ) : payments.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-muted py-4"
                        >
                          {t(
                            "operations.noPaymentsFound"
                          )}
                        </td>
                      </tr>
                    ) : (
                      payments.map(
                        (payment, index) => (
                          <tr
                            key={
                              payment._id ||
                              index
                            }
                          >
                            <td>
                              {index + 1}
                            </td>

                            <td>
                              <strong>
                                {formatMoney(
                                  payment.amount
                                )}
                              </strong>
                            </td>

                            <td>
                              {payment.receivedBy
                                ?.name || "-"}
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  payment.status ===
                                  "completed"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {payment.status ===
                                "completed"
                                  ? t(
                                      "operations.paymentStatuses.completed"
                                    )
                                  : payment.status ===
                                    "cancelled"
                                  ? t(
                                      "operations.paymentStatuses.cancelled"
                                    )
                                  : payment.status ||
                                    "-"}
                              </span>
                            </td>

                            <td>
                              {formatDateTime(
                                payment.createdAt
                              )}
                            </td>

                            <td>
                              {payment.notes ||
                                "-"}
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

        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    {t("operations.totalAmount")}
                  </small>

                  <h5 className="mb-0">
                    {formatMoney(
                      operation.totalAmount
                    )}
                  </h5>
                </div>

                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    {t("operations.paidAmount")}
                  </small>

                  <h5 className="mb-0 text-success">
                    {formatMoney(
                      operation.paidAmount
                    )}
                  </h5>
                </div>

                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    {t(
                      "operations.remainingAmount"
                    )}
                  </small>

                  <h5 className="mb-0 text-danger">
                    {formatMoney(
                      operation.remainingAmount
                    )}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationPaymentPage;
