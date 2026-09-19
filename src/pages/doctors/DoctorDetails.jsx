import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
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

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [doctorAccount, setDoctorAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPaymentForm, setShowPaymentForm] =
    useState(false);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [paymentNotes, setPaymentNotes] =
    useState("");

  const [paymentSubmitting, setPaymentSubmitting] =
    useState(false);

  const loadDoctorAccount = async () => {
    try {
      setLoading(true);

      const response = await getDoctorAccount(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to load doctor account"
        );
      }

      setDoctorAccount(response);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to load doctor account",
        {
          variant: "error",
        }
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
    Number(value || 0).toLocaleString("en-EG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleDoctorPayment = async (e) => {
    e.preventDefault();

    const amount = Number(paymentAmount || 0);
    const due = Number(
      doctorAccount?.summary?.due || 0
    );

    if (!amount || amount <= 0) {
      enqueueSnackbar(
        "Payment amount must be greater than zero",
        {
          variant: "error",
        }
      );

      return;
    }

    if (amount > due) {
      enqueueSnackbar(
        `Payment cannot exceed ${due.toFixed(2)} EGP`,
        {
          variant: "error",
        }
      );

      return;
    }

    try {
      setPaymentSubmitting(true);

      const response =
        await createDoctorSettlement({
          doctor: id,
          amount,
          notes: paymentNotes.trim(),
        });

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to pay doctor"
        );
      }

      enqueueSnackbar(
        response.message ||
          "Doctor paid successfully",
        {
          variant: "success",
        }
      );

      setPaymentAmount("");
      setPaymentNotes("");
      setShowPaymentForm(false);

      await loadDoctorAccount();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to pay doctor",
        {
          variant: "error",
        }
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
          Failed to load doctor account.
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/doctors")}
        >
          <ArrowLeft size={16} className="me-1" />
          Back to Doctors
        </button>
      </div>
    );
  }

  const doctor =
    doctorAccount.doctor || {};

  const summary =
    doctorAccount.summary || {};

  const operations =
    doctorAccount.operations || [];

  const settlements =
    doctorAccount.settlements || [];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            type="button"
            className="btn btn-light btn-sm mb-2"
            onClick={() => navigate("/doctors")}
          >
            <ArrowLeft
              size={16}
              className="me-1"
            />
            Back
          </button>

          <h3 className="mb-1">
            {doctor.name || "Doctor"}
          </h3>

          <p className="text-muted mb-0">
            Doctor Account
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
                    Total Earned
                  </small>

                  <h4 className="mb-0 mt-2">
                    {formatMoney(
                      summary.totalEarned
                    )}{" "}
                    EGP
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
                    Total Paid
                  </small>

                  <h4 className="mb-0 mt-2 text-success">
                    {formatMoney(
                      summary.totalPaid
                    )}{" "}
                    EGP
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
                    Due
                  </small>

                  <h4 className="mb-0 mt-2 text-danger">
                    {formatMoney(
                      summary.due
                    )}{" "}
                    EGP
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
            Pay Doctor
          </button>
        </div>
      )}

      {showPaymentForm && (
        <div className="card border-success mb-4">
          <div className="card-header bg-success-subtle">
            <h6 className="mb-0">
              Pay Doctor
            </h6>
          </div>

          <div className="card-body">
            <form
              onSubmit={handleDoctorPayment}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    Amount
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    min="0.01"
                    max={summary.due}
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(
                        e.target.value
                      )
                    }
                    disabled={
                      paymentSubmitting
                    }
                  />

                  <small className="text-muted">
                    Maximum due:{" "}
                    {formatMoney(
                      summary.due
                    )}{" "}
                    EGP
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Notes
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={paymentNotes}
                    onChange={(e) =>
                      setPaymentNotes(
                        e.target.value
                      )
                    }
                    placeholder="Payment notes..."
                    disabled={
                      paymentSubmitting
                    }
                  />
                </div>

                <div className="col-12 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={
                      paymentSubmitting
                    }
                  >
                    {paymentSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Payment"
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
                    disabled={
                      paymentSubmitting
                    }
                  >
                    Cancel
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
            Operations
          </h5>
        </div>

        <div className="card-body p-0">
          {operations.length === 0 ? (
            <div className="text-center text-muted py-4">
              No operations found
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Operation</th>
                    <th>Patient</th>
                    <th>Doctor Fee</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {operations.map((item) => (
                    <tr
                      key={
                        item.operation?._id
                      }
                    >
                      <td>
                        <div className="fw-semibold">
                          {
                            item.operation
                              ?.operationName
                          }
                        </div>

                        <small className="text-muted">
                          {item.operation
                            ?.operationDate
                            ? new Date(
                                item.operation.operationDate
                              ).toLocaleDateString(
                                "en-EG"
                              )
                            : "-"}
                        </small>
                      </td>

                      <td>
                        {item.operation
                          ?.patient?.name ||
                          "-"}
                      </td>

                      <td>
                        {formatMoney(
                          item.doctorFeeAmount
                        )}{" "}
                        EGP
                      </td>

                      <td className="text-success">
                        {formatMoney(
                          item.paidAmount
                        )}{" "}
                        EGP
                      </td>

                      <td className="text-danger">
                        {formatMoney(
                          item.remainingAmount
                        )}{" "}
                        EGP
                      </td>

                      <td>
                        {item.paymentStatus ===
                          "paid" && (
                          <span className="badge bg-success">
                            Paid
                          </span>
                        )}

                        {item.paymentStatus ===
                          "partial" && (
                          <span className="badge bg-warning text-dark">
                            Partial
                          </span>
                        )}

                        {item.paymentStatus ===
                          "unpaid" && (
                          <span className="badge bg-danger">
                            Unpaid
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
            Settlement History
          </h5>
        </div>

        <div className="card-body p-0">
          {settlements.length === 0 ? (
            <div className="text-center text-muted py-4">
              No settlements found
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Operation</th>
                    <th>Patient</th>
                    <th>Paid By</th>
                    <th>Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {settlements.map(
                    (settlement) => (
                      <tr
                        key={settlement._id}
                      >
                        <td>
                          {settlement.createdAt
                            ? new Date(
                                settlement.createdAt
                              ).toLocaleString(
                                "en-EG"
                              )
                            : "-"}
                        </td>

                        <td className="fw-semibold text-success">
                          {formatMoney(
                            settlement.amount
                          )}{" "}
                          EGP
                        </td>

                        <td>
                          {settlement
                            .operation
                            ?.operationName ||
                            "General Settlement"}
                        </td>

                        <td>
                          {settlement.patient
                            ?.name || "-"}
                        </td>

                        <td>
                          {settlement.paidBy
                            ?.name || "-"}
                        </td>

                        <td>
                          {settlement.notes ||
                            "-"}
                        </td>
                      </tr>
                    )
                  )}
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