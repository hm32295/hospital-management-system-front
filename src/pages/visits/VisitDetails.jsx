
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Stethoscope,
  CalendarDays,
  Banknote,
  Clock,
  CreditCard,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { createVisitPayment } from "../../services/payment.service";
import {
  getVisit,
  updateVisitStatus,
} from "../../services/visit.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const VisitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paying, setPaying] = useState(false);

  const fetchVisit = async () => {
    try {
      setLoading(true);

      const response = await getVisit(id);

      if (!response.success) {
        throw new Error(
          response.message || t("visits.loadDetailsFailed")
        );
      }

      setVisit(response.visit);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("visits.loadDetailsFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisit();
  }, [id]);

  const handlePayment = async () => {
    if (!visit || paying) return;

    try {
      setPaying(true);

      const response = await createVisitPayment(
        visit._id,
        {
          amount: visit.consultationFee,
        }
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            t("visits.payConsultationFailed")
        );
      }

      setVisit(response.visit);

      showSuccess(
        t("visits.consultationPaidSuccess")
      );
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("visits.payConsultationFailed")
        )
      );
    } finally {
      setPaying(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      setUpdating(true);

      const response = await updateVisitStatus(
        id,
        status
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            t("visits.updateStatusFailed")
        );
      }

      setVisit(response.visit);

      showSuccess(t("visits.statusUpdatedSuccess"));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("visits.updateStatusFailed")
        )
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenConsultation = () => {
    if (
      visit.paymentStatus !== "paid" ||
      visit.status === "cancelled"
    ) {
      return;
    }

    navigate(`/visits/${visit._id}/consultation`);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      i18n.language === "ar" ? "ar-EG" : "en-GB",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      waiting: {
        className: "bg-warning text-dark",
        label: t("visits.statuses.waiting"),
      },
      in_consultation: {
        className: "bg-primary",
        label: t("visits.statuses.inConsultation"),
      },
      completed: {
        className: "bg-success",
        label: t("visits.statuses.completed"),
      },
      cancelled: {
        className: "bg-danger",
        label: t("visits.statuses.cancelled"),
      },
    };

    const current = statusMap[status] || {
      className: "bg-secondary",
      label: status || "-",
    };

    return (
      <span className={`badge ${current.className}`}>
        {current.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusMap = {
      pending: {
        className: "bg-warning text-dark",
        label: t("visits.paymentStatuses.pending"),
      },
      paid: {
        className: "bg-success",
        label: t("visits.paymentStatuses.paid"),
      },
      cancelled: {
        className: "bg-danger",
        label: t("visits.paymentStatuses.cancelled"),
      },
    };

    const current = statusMap[status] || {
      className: "bg-secondary",
      label: status || "-",
    };

    return (
      <span className={`badge ${current.className}`}>
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          {t("visits.loadingDetails")}
        </div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {t("visits.notFound")}
        </div>
      </div>
    );
  }

  const isCancelled = visit.status === "cancelled";
  const isPaid = visit.paymentStatus === "paid";
  const isPendingPayment =
    visit.paymentStatus === "pending";

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            {t("visits.visitDetails")}
          </h3>

          <p className="text-muted mb-0">
            {t("visits.visitDetailsSubtitle")}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/visits")}
        >
          <ArrowLeft size={18} className="me-1" />
          {t("common.back")}
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">
                  {t("visits.visitInformation")}
                </h5>

                {getStatusBadge(visit.status)}
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <UserRound size={22} />

                    <div>
                      <small className="text-muted">
                        {t("visits.patient")}
                      </small>

                      <div className="fw-semibold">
                        {visit.patient?.name || "-"}
                      </div>

                      {visit.patient?.phone && (
                        <small className="text-muted">
                          {visit.patient.phone}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <Stethoscope size={22} />

                    <div>
                      <small className="text-muted">
                        {t("visits.specialty")}
                      </small>

                      <div className="fw-semibold">
                        {visit.specialty?.name || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <UserRound size={22} />

                    <div>
                      <small className="text-muted">
                        {t("visits.doctor")}
                      </small>

                      <div className="fw-semibold">
                        {visit.doctor?.name ||
                          t("visits.anyDoctor")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <CalendarDays size={22} />

                    <div>
                      <small className="text-muted">
                        {t("visits.visitType")}
                      </small>

                      <div className="fw-semibold">
                        {visit.visitType === "first"
                          ? t("visits.visitTypes.first")
                          : t("visits.visitTypes.followUp")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <Banknote size={22} />

                    <div>
                      <small className="text-muted">
                        {t("visits.consultationFee")}
                      </small>

                      <div className="fw-semibold">
                        {visit.consultationFee}{" "}
                        {t("common.egp")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <Clock size={22} />

                    <div>
                      <small className="text-muted">
                        {t("visits.createdAt")}
                      </small>

                      <div className="fw-semibold">
                        {formatDate(visit.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <small className="text-muted">
                  {t("visits.paymentStatus")}
                </small>

                <div className="mt-2">
                  {getPaymentBadge(
                    visit.paymentStatus
                  )}
                </div>

                {isPendingPayment &&
                  !isCancelled && (
                    <button
                      type="button"
                      className="btn btn-success mt-3"
                      disabled={paying}
                      onClick={handlePayment}
                    >
                      {paying ? (
                        <>
                          <Loader2
                            size={18}
                            className="me-2"
                            style={{
                              animation:
                                "spin 1s linear infinite",
                            }}
                          />
                          {t("visits.processing")}
                        </>
                      ) : (
                        <>
                          <CreditCard
                            size={18}
                            className="me-2"
                          />
                          {t("visits.pay")}{" "}
                          {visit.consultationFee}{" "}
                          {t("common.egp")}
                        </>
                      )}
                    </button>
                  )}

                {isPaid && (
                  <div className="alert alert-success mt-3 mb-0 d-flex align-items-center">
                    <CheckCircle2
                      size={20}
                      className="me-2"
                    />
                    {t("visits.consultationPaid")}
                  </div>
                )}
              </div>

              {visit.completedAt && (
                <div className="mt-4">
                  <small className="text-muted">
                    {t("visits.completedAt")}
                  </small>

                  <div className="fw-semibold">
                    {formatDate(visit.completedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-4">
                {t("visits.visitActions")}
              </h5>

              {!isCancelled &&
                isPaid &&
                visit.status === "waiting" && (
                  <button
                    type="button"
                    className="btn btn-primary w-100 mb-2"
                    disabled={updating}
                    onClick={() =>
                      handleStatusChange(
                        "in_consultation"
                      )
                    }
                  >
                    {updating
                      ? t("visits.starting")
                      : t("visits.startConsultation")}
                  </button>
                )}

              {!isCancelled &&
                isPaid &&
                visit.status ===
                  "in_consultation" && (
                  <button
                    type="button"
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleOpenConsultation}
                  >
                    <Stethoscope
                      size={18}
                      className="me-2"
                    />
                    {t("visits.openConsultation")}
                  </button>
                )}

              {visit.status ===
                "in_consultation" && (
                <button
                  type="button"
                  className="btn btn-success w-100 mb-2"
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange(
                      "completed"
                    )
                  }
                >
                  {updating
                    ? t("visits.completing")
                    : t("visits.completeVisit")}
                </button>
              )}

              {!isCancelled &&
                visit.status !== "completed" && (
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    disabled={updating || paying}
                    onClick={() =>
                      handleStatusChange(
                        "cancelled"
                      )
                    }
                  >
                    {t("visits.cancelVisit")}
                  </button>
                )}

              {isCancelled && (
                <div className="alert alert-danger mb-0">
                  {t("visits.cancelledMessage")}
                </div>
              )}

              {!isCancelled &&
                !isPaid && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <small>
                      {t("visits.paymentRequired")}
                    </small>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitDetails;