import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
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

import { createVisitPayment } from "../../services/payment.service";
import {
  getVisit,
  updateVisitStatus,
} from "../../services/visit.service";

const VisitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
          response.message || "Failed to get visit"
        );
      }

      setVisit(response.visit);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to get visit",
        {
          variant: "error",
        }
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
            "Failed to pay consultation fee"
        );
      }

      setVisit(response.visit);

      enqueueSnackbar(
        "Consultation fee paid successfully",
        {
          variant: "success",
        }
      );
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to pay consultation fee",
        {
          variant: "error",
        }
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
            "Failed to update visit status"
        );
      }

      setVisit(response.visit);

      enqueueSnackbar(
        "Visit status updated successfully",
        {
          variant: "success",
        }
      );
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to update visit status",
        {
          variant: "error",
        }
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

    return new Date(date).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      waiting: {
        className: "bg-warning text-dark",
        label: "Waiting",
      },
      in_consultation: {
        className: "bg-primary",
        label: "In Consultation",
      },
      completed: {
        className: "bg-success",
        label: "Completed",
      },
      cancelled: {
        className: "bg-danger",
        label: "Cancelled",
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
        label: "Pending",
      },
      paid: {
        className: "bg-success",
        label: "Paid",
      },
      cancelled: {
        className: "bg-danger",
        label: "Cancelled",
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
          Loading visit...
        </div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          Visit not found
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
          <h3 className="mb-1">Visit Details</h3>

          <p className="text-muted mb-0">
            View visit information and status
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/visits")}
        >
          <ArrowLeft size={18} className="me-1" />
          Back
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">
                  Visit Information
                </h5>

                {getStatusBadge(visit.status)}
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <UserRound size={22} />

                    <div>
                      <small className="text-muted">
                        Patient
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
                        Specialty
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
                        Doctor
                      </small>

                      <div className="fw-semibold">
                        {visit.doctor?.name ||
                          "Any Doctor"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <CalendarDays size={22} />

                    <div>
                      <small className="text-muted">
                        Visit Type
                      </small>

                      <div className="fw-semibold">
                        {visit.visitType === "first"
                          ? "First Visit"
                          : "Follow Up"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <Banknote size={22} />

                    <div>
                      <small className="text-muted">
                        Consultation Fee
                      </small>

                      <div className="fw-semibold">
                        {visit.consultationFee} EGP
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-3">
                    <Clock size={22} />

                    <div>
                      <small className="text-muted">
                        Created At
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
                  Payment Status
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
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard
                            size={18}
                            className="me-2"
                          />
                          Pay{" "}
                          {visit.consultationFee} EGP
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
                    Consultation fee has been paid.
                  </div>
                )}
              </div>

              {visit.completedAt && (
                <div className="mt-4">
                  <small className="text-muted">
                    Completed At
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
                Visit Actions
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
                      ? "Starting..."
                      : "Start Consultation"}
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
                    Open Consultation
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
                    ? "Completing..."
                    : "Complete Visit"}
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
                    Cancel Visit
                  </button>
                )}

              {isCancelled && (
                <div className="alert alert-danger mb-0">
                  This visit has been cancelled.
                </div>
              )}

              {!isCancelled &&
                !isPaid && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <small>
                      Consultation must be paid
                      before starting the
                      consultation.
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