
import { useEffect, useState } from "react";
import { Banknote, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import "./paymentModal.css";

const PaymentModal = ({
  show,
  sale,
  loading = false,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (show && sale) {
      setAmount(Number(sale.remainingAmount || 0).toFixed(2));
    }
  }, [show, sale]);

  if (!show || !sale) return null;

  const remainingAmount = Number(sale.remainingAmount) || 0;
  const paymentAmount = Number(amount) || 0;
  const isValid =
    paymentAmount > 0 && paymentAmount <= remainingAmount;

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
              <h5>{t("payment.title")}</h5>
              <span>{t("payment.subtitle")}</span>
            </div>
          </div>

          <button
            type="button"
            className="payment-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label={t("common.close")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="payment-modal-body">
          <div className="payment-info-row">
            <span>{t("payment.saleTotal")}</span>

            <strong>
              {Number(sale.totalAmount).toFixed(2)}{" "}
              {t("common.egp")}
            </strong>
          </div>

          <div className="payment-info-row">
            <span>{t("payment.alreadyPaid")}</span>

            <strong>
              {Number(sale.paidAmount).toFixed(2)}{" "}
              {t("common.egp")}
            </strong>
          </div>

          <div className="payment-remaining">
            <span>{t("payment.remaining")}</span>

            <strong>
              {remainingAmount.toFixed(2)}{" "}
              {t("common.egp")}
            </strong>
          </div>

          <div className="payment-input-group">
            <label>{t("payment.paymentAmount")}</label>

            <div className="payment-input-wrapper">
              <input
                type="number"
                min="0.01"
                max={remainingAmount}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                autoFocus
              />

              <span>{t("common.egp")}</span>
            </div>

            {paymentAmount > remainingAmount && (
              <small className="text-danger">
                {t("payment.exceedsRemaining")}
              </small>
            )}

            {paymentAmount <= 0 && (
              <small className="text-muted">
                {t("payment.enterAmount")}
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
            {t("common.cancel")}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading
              ? t("payment.processing")
              : t("payment.confirmPayment")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
