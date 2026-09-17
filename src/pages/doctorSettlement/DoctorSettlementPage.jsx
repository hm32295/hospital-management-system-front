import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";
import { toast } from "react-toastify";

import { getOperation } from "../../services/operations.service";
import { getOperationSettlements } from "../../services/doctorSettlements.service";

import DetailsCard from "../../components/details/DetailsCard";
import DoctorSettlementForm from "./DoctorSettlementForm";

const DoctorSettlementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [operation, setOperation] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settlementsLoading, setSettlementsLoading] = useState(true);

  const loadOperation = async () => {
    try {
      const response = await getOperation(id);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to load operation"
        );
      }

      setOperation(response.operation || null);
    } catch (error) {
      console.error("GET OPERATION ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load operation"
      );
    }
  };

  const loadSettlements = async () => {
    try {
      setSettlementsLoading(true);

      const response = await getOperationSettlements(id);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to load doctor settlements"
        );
      }

      setSettlements(response.data || []);
    } catch (error) {
      console.error(
        "GET OPERATION SETTLEMENTS ERROR:",
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

      await Promise.all([
        loadOperation(),
        loadSettlements(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleSettlementSuccess = async () => {
    await loadData();
  };

  if (loading) {
    return (
      <div className="admin-data-page">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary">
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="admin-data-page">
        <div className="alert alert-danger">
          Operation not found
        </div>
      </div>
    );
  }

  const doctorFeeAmount = Number(
    operation.doctorFeeAmount || 0
  );

  const paidToDoctor = settlements.reduce(
    (total, settlement) => {
      if (settlement.status !== "completed") {
        return total;
      }

      return total + Number(settlement.amount || 0);
    },
    0
  );

  const remainingDoctorFee = Math.max(
    doctorFeeAmount - paidToDoctor,
    0
  );

  const doctorFeeType =
    operation.doctorFeeType === "percentage"
      ? `${operation.doctorFeeValue}%`
      : operation.doctorFeeType === "fixed"
      ? `${Number(
          operation.doctorFeeValue || 0
        ).toFixed(2)} EGP`
      : "None";

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
      key: "doctor.name",
      label: "Doctor",
      nav: (value, data) =>
        value
          ? `/doctors/${data.doctor?._id}`
          : null,
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
        value
          ? new Date(value).toLocaleDateString("en-GB")
          : "-",
    },
    {
      key: "totalAmount",
      label: "Operation Total",
      render: (value) =>
        `${Number(value || 0).toFixed(2)} EGP`,
    },
    {
      key: "doctorFeeType",
      label: "Doctor Fee Type",
      render: () => doctorFeeType,
    },
    {
      key: "doctorFeeAmount",
      label: "Doctor Fee",
      render: (value) =>
        `${Number(value || 0).toFixed(2)} EGP`,
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (value) => (
        <span
          className={`badge ${
            value === "paid"
              ? "bg-success"
              : value === "partial"
              ? "bg-warning text-dark"
              : "bg-secondary"
          }`}
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
          className={`badge ${
            value === "completed"
              ? "bg-success"
              : value === "cancelled"
              ? "bg-danger"
              : "bg-warning text-dark"
          }`}
        >
          {value || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="admin-data-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">
            Doctor Settlement
          </h4>

          <p className="text-muted mb-0">
            Manage payments for the operation doctor
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() =>
            navigate(`/operations/${id}`)
          }
        >
          <ArrowLeft size={16} />
          Back to Operation
        </button>
      </div>

      <DetailsCard
        data={operation}
        fields={operationFields}
      />

      <div className="row g-3 mt-1">
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted mb-2">
                Doctor Fee
              </div>

              <h4 className="mb-0">
                {doctorFeeAmount.toFixed(2)} EGP
              </h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted mb-2">
                Paid to Doctor
              </div>

              <h4 className="mb-0 text-success">
                {paidToDoctor.toFixed(2)} EGP
              </h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted mb-2">
                Remaining
              </div>

              <h4 className="mb-0 text-danger">
                {remainingDoctorFee.toFixed(2)} EGP
              </h4>
            </div>
          </div>
        </div>
      </div>

      {operation.status === "cancelled" ? (
        <div className="alert alert-danger mt-4">
          This operation is cancelled. Doctor settlement
          is not available.
        </div>
      ) : operation.paymentStatus !== "paid" ? (
        <div className="alert alert-warning mt-4">
          The operation must be fully paid before paying
          the doctor.
        </div>
      ) : remainingDoctorFee > 0 ? (
        <div className="card mt-4">
          <div className="card-header">
            <div className="d-flex align-items-center gap-2">
              <Wallet size={18} />
              <strong>Pay Doctor</strong>
            </div>
          </div>

          <div className="card-body">
            <DoctorSettlementForm
              operation={operation}
              remainingAmount={remainingDoctorFee}
              onSuccess={handleSettlementSuccess}
            />
          </div>
        </div>
      ) : (
        <div className="alert alert-success mt-4">
          Doctor fee has been fully paid.
        </div>
      )}

      <div className="card mt-4">
        <div className="card-header">
          <strong>Settlement History</strong>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Paid By</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Notes</th>
                </tr>
              </thead>

              <tbody>
                {settlementsLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4"
                    >
                      <div className="spinner-border text-primary">
                        <span className="visually-hidden">
                          Loading...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : settlements.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-muted"
                    >
                      No settlement payments found
                    </td>
                  </tr>
                ) : (
                  settlements.map(
                    (settlement, index) => (
                      <tr
                        key={
                          settlement._id || index
                        }
                      >
                        <td className="text-center">
                          {index + 1}
                        </td>

                        <td className="text-center fw-semibold">
                          {Number(
                            settlement.amount || 0
                          ).toFixed(2)}{" "}
                          EGP
                        </td>

                        <td className="text-center">
                          <span
                            className={`badge ${
                              settlement.status ===
                              "completed"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {settlement.status}
                          </span>
                        </td>

                        <td className="text-center">
                          {settlement.paidBy?.name ||
                            "-"}
                        </td>

                        <td className="text-center">
                          {settlement.createdAt
                            ? new Date(
                                settlement.createdAt
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td className="text-center">
                          {settlement.notes || "-"}
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
  );
};

export default DoctorSettlementPage;