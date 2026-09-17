import { useEffect, useState } from "react";
import { Banknote, X } from "lucide-react";

import "./paymentModal.css";

const PaymentModal = ({show,sale,loading = false,onClose,onConfirm,}) => {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (show && sale) setAmount(Number(sale.remainingAmount || 0).toFixed(2));
  }, [show, sale]);

  if (!show || !sale) return null
  
  const remainingAmount =Number(sale.remainingAmount) || 0;
  const paymentAmount = Number(amount) || 0;
  const isValid =paymentAmount > 0 && paymentAmount <= remainingAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || loading) return;
    onConfirm(paymentAmount);
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <div className="payment-modal-title">
            <Banknote size={22} />

          <div>
              <h5>Payment</h5>
              <span>
                Complete sale payment
              </span>
            </div>
          </div>
          <button
            type="button"
            className="payment-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>

        </div>

        <div className="payment-modal-body">

          {/* Total */}

          <div className="payment-info-row">

            <span>
              Sale Total
            </span>

            <strong>
              {Number(
                sale.totalAmount
              ).toFixed(2)} EGP
            </strong>

          </div>

          {/* Already Paid */}

          <div className="payment-info-row">

            <span>
              Already Paid
            </span>

            <strong>
              {Number(
                sale.paidAmount
              ).toFixed(2)} EGP
            </strong>

          </div>

          {/* Remaining */}

          <div className="payment-remaining">

            <span>
              Remaining
            </span>

            <strong>
              {remainingAmount.toFixed(2)} EGP
            </strong>

          </div>

          {/* Amount */}

          <div className="payment-input-group">

            <label>
              Payment Amount
            </label>

            <div className="payment-input-wrapper">

              <input
                type="number"
                min="0.01"
                max={remainingAmount}
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                disabled={loading}
                autoFocus
              />

              <span>
                EGP
              </span>

            </div>

            {paymentAmount >
              remainingAmount && (
              <small className="text-danger">
                Payment cannot exceed remaining amount.
              </small>
            )}

            {paymentAmount <= 0 && (
              <small className="text-muted">
                Enter the amount received.
              </small>
            )}

          </div>

        </div>

        <div className="payment-modal-footer">

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading
              ? "Processing..."
              : "Confirm Payment"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default PaymentModal;