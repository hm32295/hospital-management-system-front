import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {Search, RefreshCw, Eye,} from "lucide-react";
import {getVisits,updateVisitStatus,} from "../../services/visit.service";
import { useNavigate } from "react-router-dom";

const Visits = () => {
  const { enqueueSnackbar } = useSnackbar();

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

    const navigate = useNavigate()
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
          response.message || "Failed to get visits"
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
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to get visits",
        {
          variant: "error",
        }
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
          response.message || "Failed to update visit status"
        );
      }

      setVisits((prev) =>
        prev.map((visit) =>
          visit._id === visitId
            ? response.visit
            : visit
        )
      );

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
      setUpdatingId(null);
    }
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

    return new Date(date).toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });
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
          <h3 className="mb-1">Visits</h3>
          <p className="text-muted mb-0">
            Manage and track patient visits
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={fetchVisits}
          disabled={loading}
        >
          <RefreshCw size={18} className="me-1" />
          Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">
                Patient ID
              </label>

              <input
                type="text"
                name="patient"
                className="form-control"
                placeholder="Patient ID..."
                value={filters.patient}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                Specialty ID
              </label>

              <input
                type="text"
                name="specialty"
                className="form-control"
                placeholder="Specialty ID..."
                value={filters.specialty}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                Doctor ID
              </label>

              <input
                type="text"
                name="doctor"
                className="form-control"
                placeholder="Doctor ID..."
                value={filters.doctor}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                Visit Type
              </label>

              <select
                name="visitType"
                className="form-select"
                value={filters.visitType}
                onChange={handleFilterChange}
              >
                <option value="">All Visit Types</option>
                <option value="first">First Visit</option>
                <option value="follow_up">Follow Up</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                Payment Status
              </label>

              <select
                name="paymentStatus"
                className="form-select"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
              >
                <option value="">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                Visit Status
              </label>

              <select
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="waiting">Waiting</option>
                <option value="in_consultation">
                  In Consultation
                </option>
                <option value="completed">
                  Completed
                </option>
                <option value="cancelled">
                  Cancelled
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
              Reset Filters
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
                  <th>Patient</th>
                  <th>Specialty</th>
                  <th>Doctor</th>
                  <th>Type</th>
                  <th>Fee</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-5"
                    >
                      Loading visits...
                    </td>
                  </tr>
                ) : visits.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-5 text-muted"
                    >
                      No visits found
                    </td>
                  </tr>
                ) : (
                  visits.map((visit) => (
                    <tr key={visit._id}>
                      <td>
                        {visit.patient?.name || "Walk-in"}
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
                        {visit.doctor?.name || "Any Doctor"}
                      </td>

                      <td>
                        {visit.visitType === "first"
                          ? "First Visit"
                          : "Follow Up"}
                      </td>

                      <td>
                        <strong>
                          {visit.consultationFee} EGP
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
                              Start
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
                              Complete
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
                                Cancel
                              </button>
                            )}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title="View visit"
                            onClick={() => navigate(`/visits/${visit._id}`)}
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
              Total: {pagination.total}
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
                Previous
              </button>

              <span className="small">
                Page {pagination.page} of{" "}
                {pagination.pages || 1}
              </span>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={
                  pagination.page >=
                    pagination.pages ||
                  loading
                }
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visits;