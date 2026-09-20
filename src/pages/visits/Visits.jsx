
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getVisits, updateVisitStatus } from "../../services/visit.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Visits = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [filters, setFilters] = useState({
    patient: "",
    specialty: "",
    doctor: "",
    visitType: "",
    paymentStatus: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchVisits = async () => {
    try {
      setLoading(true);

      const response = await getVisits(filters);

      if (!response.success) {
        throw new Error(
          response.message || t("visits.loadFailed")
        );
      }

      setVisits(response.visits || []);
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
          t("visits.loadFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [
    filters.patient,
    filters.specialty,
    filters.doctor,
    filters.visitType,
    filters.paymentStatus,
    filters.status,
    filters.page,
    filters.limit,
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleStatusChange = async (visitId, status) => {
    try {
      setUpdatingId(visitId);

      const response = await updateVisitStatus(
        visitId,
        status
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            t("visits.updateStatusFailed")
        );
      }

      setVisits((prev) =>
        prev.map((visit) =>
          visit._id === visitId
            ? response.visit
            : visit
        )
      );

      showSuccess(t("visits.statusUpdatedSuccess"));
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("visits.updateStatusFailed")
        )
      );
    } finally {
      setUpdatingId(null);
    }
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
      label: status,
    };

    return (
      <span className={`badge ${current.className}`}>
        {current.label}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const paymentMap = {
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

    const current = paymentMap[paymentStatus] || {
      className: "bg-secondary",
      label: paymentStatus,
    };

    return (
      <span className={`badge ${current.className}`}>
        {current.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      i18n.language === "ar" ? "ar-EG" : "en-GB",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  };

  const resetFilters = () => {
    setFilters({
      patient: "",
      specialty: "",
      doctor: "",
      visitType: "",
      paymentStatus: "",
      status: "",
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            {t("visits.title")}
          </h3>

          <p className="text-muted mb-0">
            {t("visits.subtitle")}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={fetchVisits}
          disabled={loading}
        >
          <RefreshCw size={18} className="me-1" />
          {t("common.refresh")}
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">
                {t("visits.patientId")}
              </label>

              <input
                type="text"
                name="patient"
                className="form-control"
                placeholder={t("visits.patientIdPlaceholder")}
                value={filters.patient}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                {t("visits.specialtyId")}
              </label>

              <input
                type="text"
                name="specialty"
                className="form-control"
                placeholder={t("visits.specialtyIdPlaceholder")}
                value={filters.specialty}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                {t("visits.doctorId")}
              </label>

              <input
                type="text"
                name="doctor"
                className="form-control"
                placeholder={t("visits.doctorIdPlaceholder")}
                value={filters.doctor}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                {t("visits.visitType")}
              </label>

              <select
                name="visitType"
                className="form-select"
                value={filters.visitType}
                onChange={handleFilterChange}
              >
                <option value="">
                  {t("visits.allVisitTypes")}
                </option>
                <option value="first">
                  {t("visits.visitTypes.first")}
                </option>
                <option value="follow_up">
                  {t("visits.visitTypes.followUp")}
                </option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                {t("visits.paymentStatus")}
              </label>

              <select
                name="paymentStatus"
                className="form-select"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
              >
                <option value="">
                  {t("visits.allPaymentStatuses")}
                </option>
                <option value="pending">
                  {t("visits.paymentStatuses.pending")}
                </option>
                <option value="paid">
                  {t("visits.paymentStatuses.paid")}
                </option>
                <option value="cancelled">
                  {t("visits.paymentStatuses.cancelled")}
                </option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                {t("visits.visitStatus")}
              </label>

              <select
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">
                  {t("visits.allStatuses")}
                </option>
                <option value="waiting">
                  {t("visits.statuses.waiting")}
                </option>
                <option value="in_consultation">
                  {t("visits.statuses.inConsultation")}
                </option>
                <option value="completed">
                  {t("visits.statuses.completed")}
                </option>
                <option value="cancelled">
                  {t("visits.statuses.cancelled")}
                </option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetFilters}
            >
              <Search size={17} className="me-1" />
              {t("visits.resetFilters")}
            </button>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>{t("visits.patient")}</th>
                  <th>{t("visits.specialty")}</th>
                  <th>{t("visits.doctor")}</th>
                  <th>{t("visits.type")}</th>
                  <th>{t("visits.fee")}</th>
                  <th>{t("visits.payment")}</th>
                  <th>{t("visits.status")}</th>
                  <th>{t("visits.date")}</th>
                  <th>{t("common.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-5"
                    >
                      {t("visits.loading")}
                    </td>
                  </tr>
                ) : visits.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-5 text-muted"
                    >
                      {t("visits.noVisitsFound")}
                    </td>
                  </tr>
                ) : (
                  visits.map((visit) => (
                    <tr key={visit._id}>
                      <td>
                        {visit.patient?.name ||
                          t("visits.walkIn")}

                        {visit.patient?.phone && (
                          <div className="small text-muted">
                            {visit.patient.phone}
                          </div>
                        )}
                      </td>

                      <td>
                        {visit.specialty?.name || "-"}
                      </td>

                      <td>
                        {visit.doctor?.name ||
                          t("visits.anyDoctor")}
                      </td>

                      <td>
                        {visit.visitType === "first"
                          ? t("visits.visitTypes.first")
                          : t("visits.visitTypes.followUp")}
                      </td>

                      <td>
                        <strong>
                          {visit.consultationFee}{" "}
                          {t("common.egp")}
                        </strong>
                      </td>

                      <td>
                        {getPaymentBadge(
                          visit.paymentStatus
                        )}
                      </td>

                      <td>
                        {getStatusBadge(visit.status)}
                      </td>

                      <td>
                        {formatDate(visit.createdAt)}
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          {visit.status === "waiting" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              disabled={
                                updatingId === visit._id
                              }
                              onClick={() =>
                                handleStatusChange(
                                  visit._id,
                                  "in_consultation"
                                )
                              }
                            >
                              {t("visits.start")}
                            </button>
                          )}

                          {visit.status ===
                            "in_consultation" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              disabled={
                                updatingId === visit._id
                              }
                              onClick={() =>
                                handleStatusChange(
                                  visit._id,
                                  "completed"
                                )
                              }
                            >
                              {t("visits.complete")}
                            </button>
                          )}

                          {visit.status !== "completed" &&
                            visit.status !== "cancelled" && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                disabled={
                                  updatingId === visit._id
                                }
                                onClick={() =>
                                  handleStatusChange(
                                    visit._id,
                                    "cancelled"
                                  )
                                }
                              >
                                {t("common.cancel")}
                              </button>
                            )}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title={t("visits.viewVisit")}
                            onClick={() =>
                              navigate(
                                `/visits/${visit._id}`
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center p-3 border-top">
            <div className="text-muted small">
              {t("visits.total")}: {pagination.total}
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={
                  pagination.page <= 1 || loading
                }
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
              >
                {t("common.previous")}
              </button>

              <span className="small">
                {t("visits.page")} {pagination.page}{" "}
                {t("common.of")}{" "}
                {pagination.pages || 1}
              </span>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={
                  pagination.page >=
                    pagination.pages || loading
                }
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              >
                {t("common.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visits;