
import { useEffect, useState } from "react";
import { CheckCircle2, X, PackageCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createDispensing } from "../../services/dispensed.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../utils/apiError";
import "./dispensingModal.css";

const DispensingModal = ({
  show,
  sale,
  loading = false,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
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

      showSuccess(t("dispensing.success"));
      onSuccess(response);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("dispensing.failed")
        )
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
              <h5>{t("dispensing.confirmTitle")}</h5>
              <span>{t("dispensing.confirmSubtitle")}</span>
            </div>
          </div>

          <button
            type="button"
            className="dispensing-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label={t("common.close")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="dispensing-modal-body">
          <div className="dispensing-summary">
            <div className="dispensing-summary-row">
              <span>{t("dispensing.patient")}</span>
              <strong>
                {sale.patient?.name ||
                  t("dispensing.noPatient")}
              </strong>
            </div>

            <div className="dispensing-summary-row">
              <span>{t("dispensing.saleTotal")}</span>
              <strong>
                {Number(sale.totalAmount || 0).toFixed(2)}{" "}
                {t("common.egp")}
              </strong>
            </div>

            <div className="dispensing-summary-row">
              <span>{t("dispensing.paid")}</span>
              <strong>
                {Number(sale.paidAmount || 0).toFixed(2)}{" "}
                {t("common.egp")}
              </strong>
            </div>

            <div className="dispensing-paid">
              <CheckCircle2 size={18} />
              <span>
                {t("dispensing.paymentCompleted")}
              </span>
            </div>
          </div>

          <div className="dispensing-items">
            <div className="dispensing-items-title">
              <span>{t("dispensing.medicines")}</span>
              <strong>
                {sale.items?.length || 0}{" "}
                {t("dispensing.items")}
              </strong>
            </div>

            {sale.items?.map((item, index) => (
              <div
                className="dispensing-item"
                key={`${item.batch?._id || item.batch}-${index}`}
              >
                <div className="dispensing-item-info">
                  <strong>
                    {item.medicine?.name ||
                      t("dispensing.medicine")}
                  </strong>

                  {item.medicine?.genericName && (
                    <span>
                      {item.medicine.genericName}
                    </span>
                  )}

                  <small>
                    {t("dispensing.batch")}:{" "}
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
                {t("dispensing.reason")}
              </label>

              <textarea
                id="dispensing-reason"
                rows="3"
                placeholder={t(
                  "dispensing.reasonPlaceholder"
                )}
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                disabled={loading}
                autoFocus
              />

              {!reason.trim() && (
                <small>
                  {t("dispensing.reasonRequired")}
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
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!reason.trim() || loading}
              >
                {loading
                  ? t("dispensing.dispensing")
                  : t("dispensing.confirmTitle")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DispensingModal;
