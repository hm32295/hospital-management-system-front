import { useEffect, useState } from "react";
import { CheckCircle2, X, PackageCheck } from "lucide-react";

import { createDispensing } from "../../services/dispensed.service";

import "./dispensingModal.css";

const DispensingModal = ({
  show,
  sale,
  loading = false,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (show) {
      setReason("");
    }
  }, [show]);

  if (!show || !sale) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim() || loading) {
      return;
    }

    try {
      const response = await createDispensing({
        sale: sale._id,
        reason: reason.trim(),
      });

      onSuccess(response);
    } catch (error) {
      console.error(
        "Create dispensing error:",
        error.response?.data || error
      );
    }
  };

  return (
    <div className="dispensing-modal-overlay">
      <div className="dispensing-modal">
        <div className="dispensing-modal-header">
          <div className="dispensing-modal-title">
            <div className="dispensing-modal-icon">
              <PackageCheck size={21} />
            </div>

            <div>
              <h5>Confirm Dispensing</h5>
              <span>
                Confirm medicine dispensing
              </span>
            </div>
          </div>

          <button
            type="button"
            className="dispensing-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="dispensing-modal-body">
          <div className="dispensing-summary">
            <div className="dispensing-summary-row">
              <span>Patient</span>
              <strong>
                {sale.patient?.name || "No patient"}
              </strong>
            </div>

            <div className="dispensing-summary-row">
              <span>Sale Total</span>
              <strong>
                {Number(sale.totalAmount || 0).toFixed(2)} EGP
              </strong>
            </div>

            <div className="dispensing-summary-row">
              <span>Paid</span>
              <strong>
                {Number(sale.paidAmount || 0).toFixed(2)} EGP
              </strong>
            </div>

            <div className="dispensing-paid">
              <CheckCircle2 size={18} />
              <span>Payment completed</span>
            </div>
          </div>

          <div className="dispensing-items">
            <div className="dispensing-items-title">
              <span>Medicines</span>
              <strong>
                {sale.items?.length || 0} items
              </strong>
            </div>

            {sale.items?.map((item, index) => (
              <div
                className="dispensing-item"
                key={`${item.batch?._id || item.batch}-${index}`}
              >
                <div className="dispensing-item-info">
                  <strong>
                    {item.medicine?.name || "Medicine"}
                  </strong>

                  {item.medicine?.genericName && (
                    <span>
                      {item.medicine.genericName}
                    </span>
                  )}

                  <small>
                    Batch:{" "}
                    {item.batch?.batchNumber || "-"}
                  </small>
                </div>

                <div className="dispensing-item-quantity">
                  × {item.quantity}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="dispensing-input-group">
              <label htmlFor="dispensing-reason">
                Dispensing Reason
              </label>

              <textarea
                id="dispensing-reason"
                rows="3"
                placeholder="Example: Patient prescription"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                disabled={loading}
                autoFocus
              />

              {!reason.trim() && (
                <small>
                  Enter the reason for dispensing.
                </small>
              )}
            </div>

            <div className="dispensing-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !reason.trim() || loading
                }
              >
                {loading
                  ? "Dispensing..."
                  : "Confirm Dispensing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DispensingModal;