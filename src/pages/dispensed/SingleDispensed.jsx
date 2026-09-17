
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  ReceiptText,
  PackageCheck,
  UserCog,
  CalendarDays,
} from "lucide-react";

import Header from "../../components/header/Header";
import { getSingleDispensing } from "../../services/dispensed.service";

const SingleDispensed = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dispensing, setDispensing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDispensing = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSingleDispensing(id);
      console.log(response);
      
      setDispensing(response.dispense || response);
    } catch (error) {
      console.error("Failed to load dispensing:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load dispensing"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispensing();
  }, [id]);

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <div className="mt-3 text-muted">
            Loading dispensing...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-light border"
          onClick={() => navigate("/dispenses")}
        >
          <ArrowLeft size={17} className="me-2" />
          Back to Dispenses
        </button>
      </div>
    );
  }

  if (!dispensing) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">
          Dispensing not found
        </div>

        <button
          type="button"
          className="btn btn-light border"
          onClick={() => navigate("/dispenses")}
        >
          <ArrowLeft size={17} className="me-2" />
          Back to Dispenses
        </button>
      </div>
    );
  }

  const patient = dispensing.patient;
  const sale = dispensing.sale;
  const createdBy = dispensing.createdBy;
  const items = dispensing.items || [];

  return (
    <div>
      <Header
        title="Dispensing Details"
        description="View dispensing information and medicines"
      />

      <div className="container-fluid pb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            type="button"
            className="btn btn-light border"
            onClick={() => navigate("/dispenses")}
          >
            <ArrowLeft size={17} className="me-2" />
            Back to Dispenses
          </button>

          <span className="badge text-bg-success px-3 py-2">
            Dispensed
          </span>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <UserRound size={20} />
                  <h5 className="mb-0">Patient</h5>
                </div>

                <div className="fw-semibold fs-5">
                  {patient?.name || "No patient"}
                </div>

                {patient?.phone && (
                  <div className="text-muted mt-1">
                    {patient.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <ReceiptText size={20} />
                  <h5 className="mb-0">Sale</h5>
                </div>

                {sale?._id ? (
                  <>
                    <div className="fw-semibold fs-5">
                      #{sale._id.slice(-6)}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <span>Total</span>
                      <strong>
                        {Number(sale.totalAmount || 0).toFixed(2)} EGP
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <span>Paid</span>
                      <strong className="text-success">
                        {Number(sale.paidAmount || 0).toFixed(2)} EGP
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <span>Status</span>
                      <span className="badge text-bg-success">
                        {sale.paymentStatus || "paid"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-muted">
                    This dispensing is not linked to a sale.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <UserCog size={20} />
                  <h5 className="mb-0">Created By</h5>
                </div>

                <div className="fw-semibold">
                  {createdBy?.name || "-"}
                </div>

                {createdBy?.role && (
                  <div className="text-muted small mt-1">
                    {createdBy.role}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <CalendarDays size={20} />
                  <h5 className="mb-0">Dispensing Date</h5>
                </div>

                <div className="fw-semibold">
                  {dispensing.createdAt
                    ? new Date(
                        dispensing.createdAt
                      ).toLocaleDateString("en-GB")
                    : "-"}
                </div>

                {dispensing.createdAt && (
                  <div className="text-muted small mt-1">
                    {new Date(
                      dispensing.createdAt
                    ).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <PackageCheck size={20} />
                  <h5 className="mb-0">Dispensed Medicines</h5>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Medicine</th>
                        <th>Generic Name</th>
                        <th>Batch</th>
                        <th>expiry</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.length > 0 ? (
                        items.map((item, index) => (
                          <tr key={`${item.medicine?._id || index}-${index}`}>
                            <td>{index + 1}</td>

                            <td>
                              <div className="fw-semibold">
                                {item.medicine?.name || "-"}
                              </div>

                              {item.medicine?.manufacturer && (
                                <div className="text-muted small">
                                  {item.medicine.manufacturer}
                                </div>
                              )}
                            </td>

                            <td>
                              {item.medicine?.genericName || "-"}
                            </td>

                            <td>
                              {item.batch?.batchNumber ||
                                item.batch ||
                                "-"}
                            </td>
                            <td>
                              {item.batch?.expiryDate ||
                                item.batch ||
                                "-"}
                            </td>

                            <td>
                              <span className="badge text-bg-primary">
                                {item.quantity || 0}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-muted py-4"
                          >
                            No medicines found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-3">Reason</h5>

                <div className="bg-light rounded p-3">
                  {dispensing.reason || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDispensed;

