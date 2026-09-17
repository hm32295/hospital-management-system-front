
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  ArrowLeft,
  UserRound,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  CreditCard,
  Stethoscope,
  Pill,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import { getPatientDetails } from "../../services/patients.service";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [patient, setPatient] = useState(null);
  const [summary, setSummary] = useState(null);
  const [visits, setVisits] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("visits");

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);

      const response =
        await getPatientDetails(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to load patient details"
        );
      }

      setPatient(response.patient);
      setSummary(response.summary);
      setVisits(response.visits || []);
      setPrescriptions(
        response.prescriptions || []
      );
      setSales(response.sales || []);
      setPayments(response.payments || []);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to load patient details",
        {
          variant: "error",
        }
      );

      navigate("/patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-GB"
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-GB",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString(
      "en-EG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )} EGP`;
  };

  const getVisitStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "text-bg-success";

      case "waiting":
        return "text-bg-warning";

      case "in_consultation":
        return "text-bg-primary";

      case "cancelled":
        return "text-bg-danger";

      default:
        return "text-bg-secondary";
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "paid":
      case "completed":
        return "text-bg-success";

      case "pending":
      case "partial":
        return "text-bg-warning";

      case "cancelled":
        return "text-bg-danger";

      default:
        return "text-bg-secondary";
    }
  };

  const getPrescriptionStatusClass = (
    status
  ) => {
    switch (status) {
      case "Dispensed":
        return "text-bg-success";

      case "Partially Dispensed":
        return "text-bg-warning";

      case "Pending":
        return "text-bg-primary";

      case "Cancelled":
        return "text-bg-danger";

      default:
        return "text-bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          Loading patient details...
        </div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  const totalCharges =
    Number(summary?.visitTotal || 0) +
    Number(summary?.salesTotal || 0);

  const totalPaid = Number(
    summary?.totalPaid || 0
  );

  const totalRemaining = Math.max(
    totalCharges - totalPaid,
    0
  );

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex align-items-center gap-3 mb-4">

        <button
          type="button"
          className="btn btn-light border"
          onClick={() =>
            navigate("/patients")
          }
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h3 className="mb-1">
            Patient Details
          </h3>

          <p className="text-muted mb-0">
            Patient medical and financial history
          </p>
        </div>

      </div>

      {/* Patient Information */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="row g-4">

            {/* Patient Identity */}

            <div className="col-lg-4">

              <div className="d-flex align-items-center gap-3">

                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: 64,
                    height: 64,
                  }}
                >
                  <UserRound size={30} />
                </div>

                <div>
                  <h4 className="mb-1">
                    {patient.name}
                  </h4>

                  <span className="badge text-bg-success">
                    Active
                  </span>
                </div>

              </div>

            </div>

            {/* Contact */}

            <div className="col-lg-4">

              <div className="d-flex flex-column gap-2">

                <div className="d-flex align-items-center gap-2">
                  <Phone size={16} />
                  <span>
                    {patient.phone || "-"}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Mail size={16} />
                  <span>
                    {patient.email || "-"}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <MapPin size={16} />
                  <span>
                    {patient.address || "-"}
                  </span>
                </div>

              </div>

            </div>

            {/* Personal Info */}

            <div className="col-lg-4">

              <div className="d-flex flex-column gap-2">

                <div className="d-flex align-items-center gap-2">
                  <CreditCard size={16} />
                  <span>
                    {patient.nationalId || "-"}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <CalendarDays size={16} />

                  <span>
                    {formatDate(
                      patient.dateOfBirth
                    )}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <UserRound size={16} />

                  <span className="text-capitalize">
                    {patient.gender || "-"}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="row g-3 mb-4">

        <div className="col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <div className="text-muted small mb-1">
                    Total Charges
                  </div>

                  <h4 className="mb-0">
                    {formatMoney(
                      totalCharges
                    )}
                  </h4>
                </div>

                <div className="text-primary">
                  <CreditCard size={24} />
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <div className="text-muted small mb-1">
                    Total Paid
                  </div>

                  <h4 className="mb-0 text-success">
                    {formatMoney(
                      totalPaid
                    )}
                  </h4>
                </div>

                <div className="text-success">
                  <Wallet size={24} />
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <div className="text-muted small mb-1">
                    Remaining
                  </div>

                  <h4 className="mb-0 text-danger">
                    {formatMoney(
                      totalRemaining
                    )}
                  </h4>
                </div>

                <div className="text-danger">
                  <CreditCard size={24} />
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-6 col-xl-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <div className="text-muted small mb-1">
                    Visits
                  </div>

                  <h4 className="mb-0">
                    {summary?.visitsCount ||
                      0}
                  </h4>
                </div>

                <div className="text-primary">
                  <Stethoscope size={24} />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Secondary Summary */}

      <div className="row g-3 mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body d-flex align-items-center gap-3">

              <Stethoscope size={22} />

              <div>
                <div className="text-muted small">
                  Visits
                </div>

                <strong>
                  {summary?.visitsCount ||
                    0}
                </strong>
              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body d-flex align-items-center gap-3">

              <Pill size={22} />

              <div>
                <div className="text-muted small">
                  Prescriptions
                </div>

                <strong>
                  {summary
                    ?.prescriptionsCount ||
                    0}
                </strong>
              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body d-flex align-items-center gap-3">

              <ShoppingCart size={22} />

              <div>
                <div className="text-muted small">
                  Medicine Sales
                </div>

                <strong>
                  {summary?.salesCount ||
                    0}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* History */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          {/* Tabs */}

          <ul className="nav nav-tabs mb-4">

            <li className="nav-item">

              <button
                type="button"
                className={`nav-link ${
                  activeTab === "visits"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("visits")
                }
              >
                Visits
              </button>

            </li>

            <li className="nav-item">

              <button
                type="button"
                className={`nav-link ${
                  activeTab ===
                  "prescriptions"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(
                    "prescriptions"
                  )
                }
              >
                Prescriptions
              </button>

            </li>

            <li className="nav-item">

              <button
                type="button"
                className={`nav-link ${
                  activeTab === "sales"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("sales")
                }
              >
                Sales
              </button>

            </li>

            <li className="nav-item">

              <button
                type="button"
                className={`nav-link ${
                  activeTab ===
                  "payments"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(
                    "payments"
                  )
                }
              >
                Payments
              </button>

            </li>

          </ul>

          {/* Visits */}

          {activeTab === "visits" && (

            visits.length === 0 ? (

              <div className="text-center text-muted py-5">
                No visits found
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Specialty</th>
                      <th>Doctor</th>
                      <th>Type</th>
                      <th>Fee</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {visits.map(
                      (visit) => (

                        <tr
                          key={
                            visit._id
                          }
                        >

                          <td>
                            {formatDateTime(
                              visit.createdAt
                            )}
                          </td>

                          <td>
                            {
                              visit
                                .specialty
                                ?.name
                            }
                          </td>

                          <td>
                            {visit.doctor
                              ?.name ||
                              "-"}
                          </td>

                          <td>
                            <span className="text-capitalize">
                              {visit.visitType.replace(
                                "_",
                                " "
                              )}
                            </span>
                          </td>

                          <td>
                            {formatMoney(
                              visit.consultationFee
                            )}
                          </td>

                          <td>
                            <span
                              className={`badge ${getPaymentStatusClass(
                                visit.paymentStatus
                              )}`}
                            >
                              {
                                visit.paymentStatus
                              }
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge ${getVisitStatusClass(
                                visit.status
                              )}`}
                            >
                              {visit.status.replace(
                                "_",
                                " "
                              )}
                            </span>
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )

          )}

          {/* Prescriptions */}

          {activeTab ===
            "prescriptions" && (

            prescriptions.length ===
            0 ? (

              <div className="text-center text-muted py-5">
                No prescriptions found
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Medicines</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>

                  <tbody>

                    {prescriptions.map(
                      (prescription) => (

                        <tr
                          key={
                            prescription._id
                          }
                        >

                          <td>
                            {formatDateTime(
                              prescription.createdAt
                            )}
                          </td>

                          <td>

                            <div className="d-flex flex-column gap-1">

                              {prescription.items?.map(
                                (
                                  item
                                ) => (

                                  <div
                                    key={
                                      item._id
                                    }
                                  >

                                    <strong>
                                      {
                                        item
                                          .medicine
                                          ?.name
                                      }
                                    </strong>

                                    <span className="text-muted ms-2">
                                      ×{" "}
                                      {
                                        item.quantity
                                      }
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          </td>

                          <td>

                            <span
                              className={`badge ${getPrescriptionStatusClass(
                                prescription.status
                              )}`}
                            >
                              {
                                prescription.status
                              }
                            </span>

                          </td>

                          <td>
                            {prescription.notes ||
                              "-"}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )

          )}

          {/* Sales */}

          {activeTab === "sales" && (

            sales.length === 0 ? (

              <div className="text-center text-muted py-5">
                No sales found
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>

                    <tr>
                      <th>Date</th>
                      <th>Medicines</th>
                      <th>Subtotal</th>
                      <th>Discount</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Remaining</th>
                      <th>Status</th>
                    </tr>

                  </thead>

                  <tbody>

                    {sales.map(
                      (sale) => (

                        <tr
                          key={
                            sale._id
                          }
                        >

                          <td>
                            {formatDateTime(
                              sale.createdAt
                            )}
                          </td>

                          <td>

                            <div className="d-flex flex-column gap-1">

                              {sale.items?.map(
                                (
                                  item,
                                  index
                                ) => (

                                  <div
                                    key={
                                      `${sale._id}-${index}`
                                    }
                                  >
                                    {
                                      item
                                        .medicine
                                        ?.name
                                    }

                                    <span className="text-muted ms-2">
                                      ×{" "}
                                      {
                                        item.quantity
                                      }
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          </td>

                          <td>
                            {formatMoney(
                              sale.subtotal
                            )}
                          </td>

                          <td>
                            {formatMoney(
                              sale.discount
                            )}
                          </td>

                          <td className="fw-semibold">
                            {formatMoney(
                              sale.totalAmount
                            )}
                          </td>

                          <td className="text-success">
                            {formatMoney(
                              sale.paidAmount
                            )}
                          </td>

                          <td className="text-danger">
                            {formatMoney(
                              sale.remainingAmount
                            )}
                          </td>

                          <td>

                            <span
                              className={`badge ${getPaymentStatusClass(
                                sale.paymentStatus
                              )}`}
                            >
                              {
                                sale.paymentStatus
                              }
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )

          )}

          {/* Payments */}

          {activeTab ===
            "payments" && (

            payments.length === 0 ? (

              <div className="text-center text-muted py-5">
                No payments found
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>

                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Received By</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>

                  </thead>

                  <tbody>

                    {payments.map(
                      (payment) => {

                        const paymentType =
                          payment.sale
                            ? "Medicine Sale"
                            : payment.visit
                            ? "Visit"
                            : "-";

                        return (
                          <tr
                            key={
                              payment._id
                            }
                          >

                            <td>
                              {formatDateTime(
                                payment.createdAt
                              )}
                            </td>

                            <td>
                              {paymentType}
                            </td>

                            <td className="fw-semibold text-success">
                              {formatMoney(
                                payment.amount
                              )}
                            </td>

                            <td>
                              {payment
                                .receivedBy
                                ?.name ||
                                "-"}
                            </td>

                            <td>

                              <span
                                className={`badge ${getPaymentStatusClass(
                                  payment.status
                                )}`}
                              >
                                {
                                  payment.status
                                }
                              </span>

                            </td>

                            <td>
                              {payment.notes ||
                                "-"}
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )

          )}

        </div>

      </div>

    </div>
  );
};

export default PatientDetails;