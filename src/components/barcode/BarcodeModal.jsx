
import {
  Barcode,
  Printer,
  X,
  QrCode,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../utils/apiError";
import "./barcodeModal.css";

const BarcodeModal = ({ show, onClose, batch }) => {
  const { t } = useTranslation();

  const [type, setType] = useState("qrcode");
  const [copies, setCopies] = useState(1);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [checkingPrinter, setCheckingPrinter] = useState(false);

  useEffect(() => {
    if (show) {
      setType("qrcode");
      setCopies(1);
      setPrinterConnected(false);
    }
  }, [show, batch]);

  if (!show || !batch) {
    return null;
  }

  const barcodeUrl =
    `${import.meta.env.VITE_API_URL}` +
    `/medicine-batches/${batch._id}/barcode?type=${type}`;

  const medicineName =
    batch.medicine?.name ||
    t("barcode.unknownMedicine");

  const genericName =
    batch.medicine?.genericName || "";

  const batchNumber =
    batch.batchNumber || "-";

  const expiryDate = batch.expiryDate
    ? new Date(batch.expiryDate).toLocaleDateString("en-GB")
    : "-";

  const price = Number(
    batch.sellingPrice ||
      batch.price ||
      0
  ).toFixed(2);

  const handleSaveImage = async () => {
    try {
      const response = await fetch(barcodeUrl);

      if (!response.ok) {
        throw new Error(
          t("barcode.saveImageFailed")
        );
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = imageUrl;

      const safeMedicineName = medicineName
        .replace(/[^a-z0-9\u0600-\u06FF]/gi, "-")
        .replace(/-+/g, "-");

      link.download = `${safeMedicineName}-${type}-${batch.batchNumber || batch._id}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("barcode.saveImageFailed")
        )
      );
    }
  };

  const handleQrCode = () => {
    setType("qrcode");
  };

  const handleBarcode = () => {
    setType("barcode");
  };

  const increaseCopies = () => {
    setCopies((prev) =>
      Math.min(prev + 1, 100)
    );
  };

  const decreaseCopies = () => {
    setCopies((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  const handleCopiesChange = (e) => {
    const value = Number(e.target.value);

    if (!value || value < 1) {
      setCopies(1);
      return;
    }

    setCopies(Math.min(value, 100));
  };

  const checkPrinter = async () => {
    try {
      setCheckingPrinter(true);

      setTimeout(() => {
        setPrinterConnected(false);
        setCheckingPrinter(false);
      }, 500);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("barcode.printerCheckFailed")
        )
      );

      setPrinterConnected(false);
      setCheckingPrinter(false);
    }
  };

  const handlePrint = async () => {
    if (!printerConnected) {
      showError(t("barcode.printerNotConnected"));
      return;
    }

    console.log("Printing...", {
      type,
      copies,
      batchId: batch._id,
      barcodeUrl,
    });
  };

  return (
    <div
      className="barcode-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="barcode-modal">
        <div className="barcode-modal-header">
          <div className="barcode-modal-title">
            <div className="barcode-modal-icon">
              {type === "qrcode" ? (
                <QrCode size={21} />
              ) : (
                <Barcode size={21} />
              )}
            </div>

            <div>
              <h5>{t("barcode.title")}</h5>

              <span>
                {t("barcode.thermalPrinter")}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="barcode-modal-close"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X size={19} />
          </button>
        </div>

        <div className="barcode-modal-body">
          <div className="barcode-medicine-card">
            <div className="barcode-medicine-icon">
              {type === "qrcode" ? (
                <QrCode size={25} />
              ) : (
                <Barcode size={25} />
              )}
            </div>

            <div className="barcode-medicine-content">
              <span>{t("barcode.medicine")}</span>

              <h3>{medicineName}</h3>

              {genericName && (
                <p>{genericName}</p>
              )}
            </div>
          </div>

          <div className="barcode-section">
            <div className="barcode-section-header">
              <div>
                <strong>
                  {t("barcode.codeType")}
                </strong>

                <span>
                  {t("barcode.codeTypeDescription")}
                </span>
              </div>
            </div>

            <div className="barcode-type-options">
              <button
                type="button"
                className={`barcode-type-btn ${
                  type === "qrcode" ? "active" : ""
                }`}
                onClick={handleQrCode}
              >
                <QrCode size={20} />

                <div>
                  <strong>
                    {t("barcode.qrCode")}
                  </strong>

                  <span>
                    {t("barcode.twoDCode")}
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`barcode-type-btn ${
                  type === "barcode" ? "active" : ""
                }`}
                onClick={handleBarcode}
              >
                <Barcode size={20} />

                <div>
                  <strong>
                    {t("barcode.barcode")}
                  </strong>

                  <span>
                    {t("barcode.oneDCode")}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="barcode-preview-section">
            <div className="barcode-preview-header">
              <div>
                <strong>
                  {t("barcode.preview")}
                </strong>

                <span>
                  {type === "qrcode"
                    ? t("barcode.qrCode")
                    : t("barcode.barcode")}
                </span>
              </div>

              <div className="barcode-preview-badge">
                {type === "qrcode" ? (
                  <QrCode size={14} />
                ) : (
                  <Barcode size={14} />
                )}

                {type === "qrcode"
                  ? t("barcode.qr")
                  : t("barcode.barcodeLabel")}
              </div>
            </div>

            <div className="barcode-container">
              <img
                src={barcodeUrl}
                alt={`${medicineName} ${type}`}
              />
            </div>
          </div>

          <div className="barcode-info-grid">
            <div className="barcode-info-card">
              <span>
                {t("barcode.batchNumber")}
              </span>

              <strong>{batchNumber}</strong>
            </div>

            <div className="barcode-info-card">
              <span>
                {t("barcode.expiryDate")}
              </span>

              <strong>{expiryDate}</strong>
            </div>

            <div className="barcode-info-card">
              <span>
                {t("barcode.sellingPrice")}
              </span>

              <strong>
                {price} {t("common.egp")}
              </strong>
            </div>
          </div>

          <div className="barcode-print-options">
            <div className="copies-section">
              <div className="barcode-option-title">
                <span>{t("barcode.copies")}</span>

                <small>
                  {t("barcode.maxCopies", {
                    count: 100,
                  })}
                </small>
              </div>

              <div className="copies-control">
                <button
                  type="button"
                  onClick={decreaseCopies}
                  disabled={copies <= 1}
                  aria-label={t(
                    "barcode.decreaseCopies"
                  )}
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  min="1"
                  max="100"
                  value={copies}
                  onChange={handleCopiesChange}
                />

                <button
                  type="button"
                  onClick={increaseCopies}
                  disabled={copies >= 100}
                  aria-label={t(
                    "barcode.increaseCopies"
                  )}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="printer-section">
              <div className="printer-status">
                <div
                  className={`printer-status-icon ${
                    printerConnected
                      ? "connected"
                      : "disconnected"
                  }`}
                >
                  {printerConnected ? (
                    <CheckCircle2 size={19} />
                  ) : (
                    <AlertCircle size={19} />
                  )}
                </div>

                <div>
                  <strong>
                    {printerConnected
                      ? t("barcode.printerReady")
                      : t("barcode.printerNotConnected")}
                  </strong>

                  <span>
                    {printerConnected
                      ? t("barcode.readyToPrint")
                      : t("barcode.connectThermalPrinter")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="printer-check-btn"
                onClick={checkPrinter}
                disabled={checkingPrinter}
              >
                {checkingPrinter
                  ? t("barcode.checking")
                  : t("barcode.checkPrinter")}
              </button>
            </div>
          </div>

          <details className="barcode-value-details">
            <summary>
              {t("barcode.viewCodeData")}
            </summary>

            <div className="barcode-value">
              <code>
                {batch.barcodeValue || "-"}
              </code>
            </div>
          </details>
        </div>

        <div className="barcode-modal-footer">
          <button
            type="button"
            className="barcode-btn barcode-btn-close"
            onClick={onClose}
          >
            <X size={17} />
            {t("common.close")}
          </button>

          <button
            type="button"
            className="barcode-btn barcode-btn-save"
            onClick={handleSaveImage}
          >
            <Download size={17} />
            {t("barcode.saveImage")}
          </button>

          <button
            type="button"
            className="barcode-btn barcode-btn-print"
            onClick={handlePrint}
            disabled={
              !printerConnected ||
              copies < 1
            }
          >
            <Printer size={17} />

            {t("barcode.print")}
            {copies > 1
              ? ` (${copies})`
              : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;
