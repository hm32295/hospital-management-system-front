
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  ReceiptText,
  CircleDollarSign,
  X,
  Banknote,
} from "lucide-react";

import { getPatientDetails } from "../../services/patients.service";
import {
  createPayment,
  createVisitPayment,
  createOperationPayment,
} from "../../services/payment.service";
import { showError, showSuccess, showInfo } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [patient, setPatient] = useState(null);
  const [summary, setSummary] = useState(null);
  const [account, setAccount] = useState(null);

  const [visits, setVisits] = useState([]);
  const [operations, setOperations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [sales, setSales] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("visits");

  const [paymentTarget, setPaymentTarget] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);

      const response = await getPatientDetails(id);

      setPatient(response.patient || null);
      setSummary(response.summary || null);
      setAccount(response.account || null);
      setVisits(response.visits || []);
      setOperations(response.operations || []);
      setPrescriptions(response.prescriptions || []);
      setSales(response.sales || []);
      setPayments(response.payments || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("patientDetails.failedLoad")
        )
      );
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
      i18n.language === "ar" ? "ar-EG" : "en-GB"
    );
  };

  const formatMoney = (amount) => {
    return `${Number(amount || 0).toLocaleString(
      i18n.language === "ar" ? "ar-EG" : "en-EG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )} ${t("common.egp")}`;
  };

  const getVisitRemaining = (visit) => {
    if (visit.paymentStatus === "paid") {
      return 0;
    }

    return Number(visit.consultationFee || 0);
  };

  const getOperationRemaining = (operation) => {
    if (
      operation.remainingAmount !== undefined &&
      operation.remainingAmount !== null
    ) {
      return Number(operation.remainingAmount);
    }

    return Math.max(
      Number(operation.totalAmount || 0) -
        Number(operation.paidAmount || 0),
      0
    );
  };

  const getSaleRemaining = (sale) => {
    if (
      sale.remainingAmount !== undefined &&
      sale.remainingAmount !== null
    ) {
      return Number(sale.remainingAmount);
    }

    return Math.max(
      Number(sale.totalAmount || 0) -
        Number(sale.paidAmount || 0),
      0
    );
  };

  const getPaymentTypeLabel = (type) => {
    return t(`patientDetails.paymentTypes.${type}`, {
      defaultValue: type,
    });
  };

  const getPaymentStatusLabel = (status) => {
    return t(`patientDetails.paymentStatuses.${status}`, {
      defaultValue: status,
    });
  };

  const getVisitTypeLabel = (type) => {
    return t(`patientDetails.visitTypes.${type}`, {
      defaultValue: type,
    });
  };

  const getOperationStatusLabel = (status) => {
    return t(`patientDetails.statuses.${status}`, {
      defaultValue: status,
    });
  };

  const openPaymentModal = (type, item) => {
    let remaining = 0;

    if (type === "visit") {
      remaining = getVisitRemaining(item);
    }

    if (type === "operation") {
      remaining = getOperationRemaining(item);
    }

    if (type === "sale") {
      remaining = getSaleRemaining(item);
    }

    if (remaining <= 0) {
      showInfo(t("patientDetails.noRemainingAmount"));
      return;
    }

    setPaymentTarget({
      type,
      item,
      remaining,
    });

    setPaymentAmount(String(remaining));
    setPaymentNotes("");
  };

  const closePaymentModal = () => {
    if (paymentSubmitting) return;

    setPaymentTarget(null);
    setPaymentAmount("");
    setPaymentNotes("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!paymentTarget) return;

    const amount = Number(paymentAmount);

    if (!amount || amount <= 0) {
      showError(t("patientDetails.validPaymentAmount"));
      return;
    }

    if (amount > paymentTarget.remaining) {
      showError(
        t("patientDetails.paymentExceedsRemaining", {
          amount: formatMoney(paymentTarget.remaining),
        })
      );
      return;
    }

    try {
      setPaymentSubmitting(true);

      const { type, item } = paymentTarget;

      if (type === "visit") {
        await createVisitPayment(item._id, {
          amount,
          notes: paymentNotes,
        });
      }

      if (type === "operation") {
        await createOperationPayment({
          operation: item._id,
          amount,
          notes: paymentNotes,
        });
      }

      if (type === "sale") {
        await createPayment({
          sale: item._id,
          amount,
          notes: paymentNotes,
        });
      }

      showSuccess(t("patientDetails.paymentSuccess"));

      closePaymentModal();

      await fetchPatientDetails();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("patientDetails.paymentFailed")
        )
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">
            {t("common.loading")}
          </span>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          {t("patientDetails.notFound")}
        </div>
      </div>
    );
  }

  const totalCharges = Number(
    account?.charges?.total || 0
  );

  const totalPaid = Number(
    account?.payments?.total || 0
  );

  const totalDiscounts = Number(
    account?.discounts?.total || 0
  );

  const balance = Number(account?.balance || 0);

  return (
    <div className="container-fluid py-3">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => navigate("/patients")}
        >
          <ArrowLeft size={18} />
          {t("common.back")}
        </button>

        <h4 className="mb-0">
          {t("patientDetails.title")}
        </h4>

        <div />
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-4 align-items-center">
            <div className="col-md-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{
                    width: 65,
                    height: 65,
                  }}
                >
                  <UserRound size={30} />
                </div>

                <div>
                  <h5 className="mb-1">
                    {patient.name}
                  </h5>

                  <span
                    className={`badge ${
                      patient.isActive
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {patient.isActive
                      ? t("patientDetails.active")
                      : t("patientDetails.inactive")}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Phone size={17} />
                <span>
                  {patient.phone || "-"}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Mail size={17} />
                <span>
                  {patient.email || "-"}
                </span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <MapPin size={17} />
                <span>
                  {patient.address || "-"}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <CalendarDays size={17} />
                <span>
                  {formatDate(patient.dateOfBirth)}
                </span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="small text-muted mb-1">
                {t("patientDetails.nationalId")}
              </div>

              <div className="fw-semibold">
                {patient.nationalId || "-"}
              </div>

              <div className="small text-muted mt-2 mb-1">
                {t("patientDetails.gender")}
              </div>

              <div className="fw-semibold text-capitalize">
                {patient.gender
                  ? t(
                      `patientDetails.genders.${patient.gender}`,
                      {
                        defaultValue: patient.gender,
                      }
                    )
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">
                    {t("patientDetails.totalCharges")}
                  </div>

                  <h4 className="mt-2 mb-0">
                    {formatMoney(totalCharges)}
                  </h4>
                </div>

                <ReceiptText size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">
                    {t("patientDetails.totalPaid")}
                  </div>

                  <h4 className="mt-2 mb-0 text-success">
                    {formatMoney(totalPaid)}
                  </h4>
                </div>

                <CreditCard size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">
                    {t("patientDetails.discounts")}
                  </div>

                  <h4 className="mt-2 mb-0">
                    {formatMoney(totalDiscounts)}
                  </h4>
                </div>

                <CircleDollarSign size={28} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small">
                    {t("patientDetails.balance")}
                  </div>

                  <h4
                    className={`mt-2 mb-0 ${
                      balance > 0
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {formatMoney(balance)}
                  </h4>
                </div>

                <Wallet size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-3">
          <ul className="nav nav-tabs">
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
                <Stethoscope
                  size={16}
                  className="me-1"
                />
                {t("patientDetails.tabs.visits")}
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "operations"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("operations")
                }
              >
                <ReceiptText
                  size={16}
                  className="me-1"
                />
                {t("patientDetails.tabs.operations")}
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "prescriptions"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("prescriptions")
                }
              >
                <Pill
                  size={16}
                  className="me-1"
                />
                {t(
                  "patientDetails.tabs.prescriptions"
                )}
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
                <ShoppingCart
                  size={16}
                  className="me-1"
                />
                {t("patientDetails.tabs.sales")}
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "payments"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("payments")
                }
              >
                <CreditCard
                  size={16}
                  className="me-1"
                />
                {t("patientDetails.tabs.payments")}
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${
                  activeTab === "account"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("account")
                }
              >
                <Wallet
                  size={16}
                  className="me-1"
                />
                {t("patientDetails.tabs.account")}
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {activeTab === "visits" && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>{t("patientDetails.date")}</th>
                    <th>{t("patientDetails.specialty")}</th>
                    <th>{t("patientDetails.doctor")}</th>
                    <th>{t("patientDetails.type")}</th>
                    <th>{t("patientDetails.fee")}</th>
                    <th>{t("patientDetails.payment")}</th>
                    <th>{t("patientDetails.status")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {visits.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4"
                      >
                        {t("patientDetails.noVisits")}
                      </td>
                    </tr>
                  ) : (
                    visits.map((visit) => {
                      const remaining =
                        getVisitRemaining(visit);

                      return (
                        <tr key={visit._id}>
                          <td>
                            {formatDate(
                              visit.createdAt
                            )}
                          </td>

                          <td>
                            {visit.specialty?.name ||
                              "-"}
                          </td>

                          <td>
                            {visit.doctor?.name ||
                              "-"}
                          </td>

                          <td>
                            {getVisitTypeLabel(
                              visit.visitType
                            )}
                          </td>

                          <td>
                            {formatMoney(
                              visit.consultationFee
                            )}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                visit.paymentStatus ===
                                "paid"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {getPaymentStatusLabel(
                                visit.paymentStatus
                              )}
                            </span>
                          </td>

                          <td>
                            <span className="text-capitalize">
                              {getOperationStatusLabel(
                                visit.status
                              )}
                            </span>
                          </td>

                          <td>
                            {remaining > 0 ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                onClick={() =>
                                  openPaymentModal(
                                    "visit",
                                    visit
                                  )
                                }
                              >
                                <Banknote size={15} />
                                {t(
                                  "patientDetails.pay"
                                )}
                              </button>
                            ) : (
                              <span className="text-success small">
                                {t(
                                  "patientDetails.paid"
                                )}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "operations" && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>{t("patientDetails.date")}</th>
                    <th>{t("patientDetails.operation")}</th>
                    <th>{t("patientDetails.doctor")}</th>
                    <th>{t("patientDetails.total")}</th>
                    <th>{t("patientDetails.paid")}</th>
                    <th>{t("patientDetails.remaining")}</th>
                    <th>{t("patientDetails.status")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {operations.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4"
                      >
                        {t(
                          "patientDetails.noOperations"
                        )}
                      </td>
                    </tr>
                  ) : (
                    operations.map((operation) => {
                      const remaining =
                        getOperationRemaining(
                          operation
                        );

                      return (
                        <tr key={operation._id}>
                          <td>
                            {formatDate(
                              operation.operationDate ||
                                operation.createdAt
                            )}
                          </td>

                          <td>
                            {operation.operationName ||
                              "-"}
                          </td>

                          <td>
                            {operation.doctor?.name ||
                              "-"}
                          </td>

                          <td>
                            {formatMoney(
                              operation.totalAmount
                            )}
                          </td>

                          <td>
                            {formatMoney(
                              operation.paidAmount
                            )}
                          </td>

                          <td>
                            {formatMoney(remaining)}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                operation.paymentStatus ===
                                "paid"
                                  ? "bg-success"
                                  : operation.paymentStatus ===
                                    "partial"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                              }`}
                            >
                              {getPaymentStatusLabel(
                                operation.paymentStatus
                              )}
                            </span>
                          </td>

                          <td>
                            {remaining > 0 &&
                            operation.status !==
                              "cancelled" ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                onClick={() =>
                                  openPaymentModal(
                                    "operation",
                                    operation
                                  )
                                }
                              >
                                <Banknote size={15} />
                                {t(
                                  "patientDetails.pay"
                                )}
                              </button>
                            ) : (
                              <span
                                className={
                                  operation.status ===
                                  "cancelled"
                                    ? "text-danger small"
                                    : "text-success small"
                                }
                              >
                                {operation.status ===
                                "cancelled"
                                  ? t(
                                      "patientDetails.cancelled"
                                    )
                                  : t(
                                      "patientDetails.paid"
                                    )}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>{t("patientDetails.date")}</th>
                    <th>{t("patientDetails.doctor")}</th>
                    <th>{t("patientDetails.status")}</th>
                  </tr>
                </thead>

                <tbody>
                  {prescriptions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4"
                      >
                        {t(
                          "patientDetails.noPrescriptions"
                        )}
                      </td>
                    </tr>
                  ) : (
                    prescriptions.map(
                      (prescription) => (
                        <tr
                          key={prescription._id}
                        >
                          <td>
                            {formatDate(
                              prescription.createdAt
                            )}
                          </td>

                          <td>
                            {prescription.doctor
                              ?.name || "-"}
                          </td>

                          <td>
                            {getOperationStatusLabel(
                              prescription.status
                            )}
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "sales" && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>{t("patientDetails.date")}</th>
                    <th>{t("patientDetails.medicines")}</th>
                    <th>{t("patientDetails.subtotal")}</th>
                    <th>{t("patientDetails.discount")}</th>
                    <th>{t("patientDetails.total")}</th>
                    <th>{t("patientDetails.paid")}</th>
                    <th>{t("patientDetails.remaining")}</th>
                    <th>{t("patientDetails.status")}</th>
                    <th>{t("common.actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-4"
                      >
                        {t("patientDetails.noSales")}
                      </td>
                    </tr>
                  ) : (
                    sales.map((sale) => {
                      const remaining =
                        getSaleRemaining(sale);

                      return (
                        <tr key={sale._id}>
                          <td>
                            {formatDate(
                              sale.createdAt
                            )}
                          </td>

                          <td>
                            {sale.items?.length || 0}
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

                          <td>
                            {formatMoney(
                              sale.totalAmount
                            )}
                          </td>

                          <td>
                            {formatMoney(
                              sale.paidAmount
                            )}
                          </td>

                          <td>
                            {formatMoney(remaining)}
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                sale.paymentStatus ===
                                "paid"
                                  ? "bg-success"
                                  : sale.paymentStatus ===
                                    "partial"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                              }`}
                            >
                              {getPaymentStatusLabel(
                                sale.paymentStatus
                              )}
                            </span>
                          </td>

                          <td>
                            {remaining > 0 &&
                            sale.status !==
                              "cancelled" ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                                onClick={() =>
                                  openPaymentModal(
                                    "sale",
                                    sale
                                  )
                                }
                              >
                                <Banknote size={15} />
                                {t(
                                  "patientDetails.pay"
                                )}
                              </button>
                            ) : (
                              <span
                                className={
                                  sale.status ===
                                  "cancelled"
                                    ? "text-danger small"
                                    : "text-success small"
                                }
                              >
                                {sale.status ===
                                "cancelled"
                                  ? t(
                                      "patientDetails.cancelled"
                                    )
                                  : t(
                                      "patientDetails.paid"
                                    )}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>{t("patientDetails.date")}</th>
                    <th>{t("patientDetails.type")}</th>
                    <th>{t("patientDetails.amount")}</th>
                    <th>{t("patientDetails.receivedBy")}</th>
                    <th>{t("patientDetails.status")}</th>
                    <th>{t("patientDetails.notes")}</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4"
                      >
                        {t(
                          "patientDetails.noPayments"
                        )}
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment._id}>
                        <td>
                          {formatDate(
                            payment.createdAt
                          )}
                        </td>

                        <td>
                          {getPaymentTypeLabel(
                            payment.type
                          )}
                        </td>

                        <td>
                          {formatMoney(
                            payment.amount
                          )}
                        </td>

                        <td>
                          {payment.receivedBy?.name ||
                            "-"}
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
                            {getPaymentStatusLabel(
                              payment.status
                            )}
                          </span>
                        </td>

                        <td>
                          {payment.notes || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "account" && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <div className="text-muted small">
                      {t(
                        "patientDetails.visitCharges"
                      )}
                    </div>

                    <h5 className="mt-2 mb-0">
                      {formatMoney(
                        account?.charges?.visits
                      )}
                    </h5>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <div className="text-muted small">
                      {t(
                        "patientDetails.operationCharges"
                      )}
                    </div>

                    <h5 className="mt-2 mb-0">
                      {formatMoney(
                        account?.charges?.operations
                      )}
                    </h5>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <div className="text-muted small">
                      {t(
                        "patientDetails.salesCharges"
                      )}
                    </div>

                    <h5 className="mt-2 mb-0">
                      {formatMoney(
                        account?.charges?.sales
                      )}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <div className="text-muted small">
                      {t(
                        "patientDetails.visitPayments"
                      )}
                    </div>

                    <h5 className="mt-2 mb-0 text-success">
                      {formatMoney(
                        account?.payments?.visits
                      )}
                    </h5>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <div className="text-muted small">
                      {t(
                        "patientDetails.operationPayments"
                      )}
                    </div>

                    <h5 className="mt-2 mb-0 text-success">
                      {formatMoney(
                        account?.payments?.operations
                      )}
                    </h5>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <div className="text-muted small">
                      {t(
                        "patientDetails.salesPayments"
                      )}
                    </div>

                    <h5 className="mt-2 mb-0 text-success">
                      {formatMoney(
                        account?.payments?.sales
                      )}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="alert alert-light border d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">
                    {t(
                      "patientDetails.patientBalance"
                    )}
                  </div>

                  <div className="small text-muted">
                    {t(
                      "patientDetails.balanceDescription"
                    )}
                  </div>
                </div>

                <div
                  className={`fs-4 fw-bold ${
                    balance > 0
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {formatMoney(balance)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {paymentTarget && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {t("patientDetails.patientPayment")}
                </h5>

                <button
                  type="button"
                  className="btn btn-link text-dark p-0"
                  onClick={closePaymentModal}
                  disabled={paymentSubmitting}
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handlePayment}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      {t(
                        "patientDetails.paymentType"
                      )}
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={getPaymentTypeLabel(
                        paymentTarget.type
                      )}
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {t(
                        "patientDetails.remainingAmount"
                      )}
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={formatMoney(
                        paymentTarget.remaining
                      )}
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {t(
                        "patientDetails.paymentAmount"
                      )}
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      min="0.01"
                      max={paymentTarget.remaining}
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) =>
                        setPaymentAmount(
                          e.target.value
                        )
                      }
                      readOnly={
                        paymentTarget.type ===
                        "visit"
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {t("patientDetails.notes")}
                    </label>

                    <textarea
                      className="form-control"
                      rows="3"
                      value={paymentNotes}
                      onChange={(e) =>
                        setPaymentNotes(
                          e.target.value
                        )
                      }
                      placeholder={t(
                        "patientDetails.notesPlaceholder"
                      )}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closePaymentModal}
                    disabled={paymentSubmitting}
                  >
                    {t("common.cancel")}
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    disabled={paymentSubmitting}
                  >
                    {paymentSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        />
                        {t(
                          "patientDetails.processing"
                        )}
                      </>
                    ) : (
                      <>
                        <Banknote size={17} />
                        {t(
                          "patientDetails.confirmPayment"
                        )}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;