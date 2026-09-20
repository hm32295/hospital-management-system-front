
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Wallet,
  CreditCard,
  ArrowLeft,
  CircleDollarSign,
} from "lucide-react";

import {
  getDoctorAccount,
  createDoctorSettlement,
} from "../../services/doctorSettlements.service";

import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";
import { useTranslation } from "react-i18next";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [doctorAccount, setDoctorAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const dateLocale =
    i18n.language === "ar" ? "ar-EG" : "en-GB";

  const loadDoctorAccount = async () => {
    try {
      setLoading(true);

      const response = await getDoctorAccount(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            t("doctors.failedToLoadAccount")
        );
      }

      setDoctorAccount(response);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctors.failedToLoadAccount")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadDoctorAccount();
    }
  }, [id]);

  const formatMoney = (value) =>
    Number(value || 0).toLocaleString(
      i18n.language === "ar" ? "ar-EG" : "en-EG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  const handleDoctorPayment = async (e) => {
    e.preventDefault();

    const amount = Number(paymentAmount || 0);
    const due = Number(doctorAccount?.summary?.due || 0);

    if (!amount || amount <= 0) {
      showError(t("doctors.paymentAmountInvalid"));
      return;
    }

    if (amount > due) {
      showError(
        t("doctors.paymentExceedsDue", {
          amount: due.toFixed(2),
        })
      );
      return;
    }

    try {
      setPaymentSubmitting(true);

      const response = await createDoctorSettlement({
        doctor: id,
        amount,
        notes: paymentNotes.trim(),
      });

      if (!response.success) {
        throw new Error(
          response.message ||
            t("doctors.failedToPay")
        );
      }

      showSuccess(
        response.message ||
          t("doctors.paidSuccessfully")
      );

      setPaymentAmount("");
      setPaymentNotes("");
      setShowPaymentForm(false);

      await loadDoctorAccount();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctors.failedToPay")
        )
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          />
        </div>
      </div>
    );
  }

  if (!doctorAccount) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {t("doctors.failedToLoadAccount")}
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/doctors")}
        >
          <ArrowLeft size={16} className="me-1" />
          {t("doctors.backToDoctors")}
        </button>
      </div>
    );
  }

  const doctor = doctorAccount.doctor || {};
  const summary = doctorAccount.summary || {};
  const operations = doctorAccount.operations || [];
  const settlements = doctorAccount.settlements || [];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            type="button"
            className="btn btn-light btn-sm mb-2"
            onClick={() => navigate("/doctors")}
          >
            <ArrowLeft size={16} className="me-1" />
            {t("common.back")}
          </button>

          <h3 className="mb-1">
            {doctor.name || t("doctors.doctor")}
          </h3>

          <p className="text-muted mb-0">
            {t("doctors.account")}
          </p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    {t("doctors.totalEarned")}
                  </small>

                  <h4 className="mb-0 mt-2">
                    {formatMoney(summary.totalEarned)}{" "}
                    {t("common.egp")}
                  </h4>
                </div>

                <CircleDollarSign
                  size={30}
                  className="text-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    {t("doctors.totalPaid")}
                  </small>

                  <h4 className="mb-0 mt-2 text-success">
                    {formatMoney(summary.totalPaid)}{" "}
                    {t("common.egp")}
                  </h4>
                </div>

                <CreditCard
                  size={30}
                  className="text-success"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    {t("doctors.due")}
                  </small>

                  <h4 className="mb-0 mt-2 text-danger">
                    {formatMoney(summary.due)}{" "}
                    {t("common.egp")}
                  </h4>
                </div>

                <Wallet
                  size={30}
                  className="text-danger"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {summary.due > 0 && (
        <div className="d-flex justify-content-end mb-4">
          <button
            type="button"
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={() =>
              setShowPaymentForm((prev) => !prev)
            }
          >
            <CreditCard size={18} />
            {t("doctors.payDoctor")}
          </button>
        </div>
      )}

      {showPaymentForm && (
        <div className="card border-success mb-4">
          <div className="card-header bg-success-subtle">
            <h6 className="mb-0">
              {t("doctors.payDoctor")}
            </h6>
          </div>

          <div className="card-body">
            <form onSubmit={handleDoctorPayment}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    {t("doctors.amount")}
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    min="0.01"
                    max={summary.due}
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(e.target.value)
                    }
                    disabled={paymentSubmitting}
                  />

                  <small className="text-muted">
                    {t("doctors.maximumDue")}:{" "}
                    {formatMoney(summary.due)}{" "}
                    {t("common.egp")}
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    {t("doctors.notes")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={paymentNotes}
                    onChange={(e) =>
                      setPaymentNotes(e.target.value)
                    }
                    placeholder={t(
                      "doctors.paymentNotesPlaceholder"
                    )}
                    disabled={paymentSubmitting}
                  />
                </div>

                <div className="col-12 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={paymentSubmitting}
                  >
                    {paymentSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {t("doctors.processing")}
                      </>
                    ) : (
                      t("doctors.confirmPayment")
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPaymentForm(false);
                      setPaymentAmount("");
                      setPaymentNotes("");
                    }}
                    disabled={paymentSubmitting}
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            {t("doctors.operations")}
          </h5>
        </div>

        <div className="card-body p-0">
          {operations.length === 0 ? (
            <div className="text-center text-muted py-4">
              {t("doctors.noOperations")}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>{t("doctors.operation")}</th>
                    <th>{t("doctors.patient")}</th>
                    <th>{t("doctors.doctorFee")}</th>
                    <th>{t("doctors.paid")}</th>
                    <th>{t("doctors.due")}</th>
                    <th>{t("doctors.status")}</th>
                  </tr>
                </thead>

                <tbody>
                  {operations.map((item) => (
                    <tr key={item.operation?._id}>
                      <td>
                        <div className="fw-semibold">
                          {item.operation?.operationName}
                        </div>

                        <small className="text-muted">
                          {item.operation?.operationDate
                            ? new Date(
                                item.operation.operationDate
                              ).toLocaleDateString(dateLocale)
                            : "-"}
                        </small>
                      </td>

                      <td>
                        {item.operation?.patient?.name || "-"}
                      </td>

                      <td>
                        {formatMoney(item.doctorFeeAmount)}{" "}
                        {t("common.egp")}
                      </td>

                      <td className="text-success">
                        {formatMoney(item.paidAmount)}{" "}
                        {t("common.egp")}
                      </td>

                      <td className="text-danger">
                        {formatMoney(item.remainingAmount)}{" "}
                        {t("common.egp")}
                      </td>

                      <td>
                        {item.paymentStatus === "paid" && (
                          <span className="badge bg-success">
                            {t("doctors.paid")}
                          </span>
                        )}

                        {item.paymentStatus === "partial" && (
                          <span className="badge bg-warning text-dark">
                            {t("doctors.partial")}
                          </span>
                        )}

                        {item.paymentStatus === "unpaid" && (
                          <span className="badge bg-danger">
                            {t("doctors.unpaid")}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            {t("doctors.settlementHistory")}
          </h5>
        </div>

        <div className="card-body p-0">
          {settlements.length === 0 ? (
            <div className="text-center text-muted py-4">
              {t("doctors.noSettlements")}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>{t("doctors.date")}</th>
                    <th>{t("doctors.amount")}</th>
                    <th>{t("doctors.operation")}</th>
                    <th>{t("doctors.patient")}</th>
                    <th>{t("doctors.paidBy")}</th>
                    <th>{t("doctors.notes")}</th>
                  </tr>
                </thead>

                <tbody>
                  {settlements.map((settlement) => (
                    <tr key={settlement._id}>
                      <td>
                        {settlement.createdAt
                          ? new Date(
                              settlement.createdAt
                            ).toLocaleString(dateLocale)
                          : "-"}
                      </td>

                      <td className="fw-semibold text-success">
                        {formatMoney(settlement.amount)}{" "}
                        {t("common.egp")}
                      </td>

                      <td>
                        {settlement.operation?.operationName ||
                          t("doctors.generalSettlement")}
                      </td>

                      <td>
                        {settlement.patient?.name || "-"}
                      </td>

                      <td>
                        {settlement.paidBy?.name || "-"}
                      </td>

                      <td>
                        {settlement.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;




