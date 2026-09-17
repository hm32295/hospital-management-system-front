
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

import { completeOperation, getOperation } from "../../services/operations.service";
import {
  getOperationSettlements,
} from "../../services/doctorSettlements.service";
import DetailsCard from "../../components/details/DetailsCard";

const OperationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
          "Failed to load operation"
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
            "Failed to load doctor settlements"
        );
      }

      setSettlements(response.data || []);
    } catch (error) {
      console.error(
        "GET SETTLEMENTS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load doctor settlements"
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

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load operation"
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
      "en-GB"
    );
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toFixed(2)} EGP`;
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

const handleCompleteOperation = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to mark this operation as completed?"
  );

  if (!confirmed) return;

  try {
    const response = await completeOperation(id);

    if (!response?.success) {
      throw new Error(
        response?.message || "Failed to complete operation"
      );
    }

    toast.success(
      response?.message || "Operation completed successfully"
    );

    setOperation(response.operation);
  } catch (error) {
    console.error("COMPLETE OPERATION ERROR:", error);

    toast.error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to complete operation"
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
      label: "Patient",
      nav: (value, data) =>
        value
          ? `/patients/${data.patient?._id}`
          : null,
    },
    {
      key: "patient.phone",
      label: "Patient Phone",
    },
    {
      key: "doctor.name",
      label: "Doctor",
    },
    {
      key: "specialty.name",
      label: "Specialty",
    },
    {
      key: "operationName",
      label: "Operation",
    },
    {
      key: "operationDate",
      label: "Operation Date",
      render: (value) =>
        formatDate(value),
    },
    {
      key: "cost",
      label: "Cost",
      render: (value) =>
        formatMoney(value),
    },
    {
      key: "discount",
      label: "Discount",
      render: (value) =>
        formatMoney(value),
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (value) => (
        <strong>
          {formatMoney(value)}
        </strong>
      ),
    },
    {
      key: "doctorFeeType",
      label: "Doctor Fee Type",
      render: (value) =>
        value === "percentage"
          ? "Percentage"
          : value === "fixed"
          ? "Fixed"
          : "None",
    },
    {
      key: "doctorFeeValue",
      label: "Doctor Fee Value",
      render: (value, data) =>
        data.doctorFeeType === "percentage"
          ? `${Number(value || 0)}%`
          : formatMoney(value),
    },
    {
      key: "doctorFeeAmount",
      label: "Doctor Fee Amount",
      render: (value) =>
        formatMoney(value),
    },
    {
      key: "hospitalAmount",
      label: "Hospital Amount",
      render: (value) => (
        <strong>
          {formatMoney(value)}
        </strong>
      ),
    },
    {
      key: "paidAmount",
      label: "Paid Amount",
      render: (value) =>
        formatMoney(value),
    },
    {
      key: "remainingAmount",
      label: "Remaining Amount",
      render: (value) => (
        <strong>
          {formatMoney(value)}
        </strong>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (value) => (
        <span
          className={getPaymentStatusClass(
            value
          )}
        >
          {value || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Operation Status",
      render: (value) => (
        <span
          className={getOperationStatusClass(
            value
          )}
        >
          {value || "-"}
        </span>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      col: "col-12",
    },
  ];

  if (!loading && !operation) {
    return (
      <div className="details-page">
        <div className="details-card">
          <div className="details-empty">
            <h5>Operation Not Found</h5>

            <p>
              The requested operation could not
              be found.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate("/operations")
              }
            >
              Back to Operations
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
            Operation Details
          </h4>

          <p className="text-muted mb-0">
            View operation and payment information
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => navigate("/operations")}
          >
            <ArrowLeft size={17} />
            Back
          </button>

          {!loading && operation?.status === "pending" && (
            <>
              <button
                type="button"
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={handleCompleteOperation}
              >
                <CheckCircle size={17} />
                Complete Operation
              </button>

              <button
                type="button"
                className="btn btn-warning d-flex align-items-center gap-2"
                onClick={() =>
                  navigate(`/operations/edit/${operation._id}`)
                }
              >
                <Pencil size={17} />
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      <DetailsCard
        data={operation || {}}
        fields={operationFields}
        loading={loading}
        emptyMessage="No operation information available"
      />

      {!loading && operation && (
        <div className="row g-4 mt-1">
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <small className="text-muted d-block mb-2">
                  Total Amount
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
                  Paid Amount
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
                  Remaining Amount
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
                    Operation Payment
                  </h5>

                  <p className="text-muted mb-0">
                    Manage payments for this operation
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
                    Add Payment
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
                  Doctor Settlement
                </h5>

                <p className="text-muted mb-0">
                  Manage payments made to the doctor
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
                    Pay Doctor
                  </button>
                )}
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="border rounded p-3 h-100">
                  <small className="text-muted d-block mb-1">
                    Doctor Fee
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
                    Paid to Doctor
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
                    Remaining Doctor Fee
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
                  The operation must be fully paid
                  before paying the doctor.
                </div>
              )}

            {operation.paymentStatus ===
              "paid" &&
              doctorFeeAmount === 0 && (
                <div className="alert alert-secondary mt-3 mb-0">
                  No doctor fee is assigned to this
                  operation.
                </div>
              )}

            {operation.paymentStatus ===
              "paid" &&
              doctorFeeAmount > 0 &&
              doctorRemainingAmount ===
                0 && (
                <div className="alert alert-success mt-3 mb-0">
                  Doctor fee has been fully paid.
                </div>
              )}

            {settlements.length > 0 && (
              <div className="mt-4">
                <h6 className="mb-3">
                  Settlement History
                </h6>

                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="text-center">
                          #
                        </th>

                        <th className="text-center">
                          Amount
                        </th>

                        <th className="text-center">
                          Status
                        </th>

                        <th className="text-center">
                          Paid By
                        </th>

                        <th className="text-center">
                          Date
                        </th>

                        <th className="text-center">
                          Notes
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
                                {
                                  settlement.status
                                }
                              </span>
                            </td>

                            <td className="text-center">
                              {settlement
                                .paidBy
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
                    Loading...
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
