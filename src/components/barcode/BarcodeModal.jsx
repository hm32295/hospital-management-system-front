
import {
  Barcode,
  Printer,
  X,
  QrCode,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Download
} from "lucide-react";

import { useEffect, useState } from "react";

import "./barcodeModal.css";

const BarcodeModal = ({ show, onClose, batch }) => {
  const handleSaveImage = async () => {
  try {
    const response = await fetch(barcodeUrl);

    if (!response.ok) {
      throw new Error("Failed to download barcode image");
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
    console.error(
      "Save barcode image error:",
      error
    );
  }
};
  const [type, setType] = useState("qrcode");
  const [copies, setCopies] = useState(1);

  const [printerConnected, setPrinterConnected] =
    useState(false);

  const [checkingPrinter, setCheckingPrinter] =
    useState(false);

  // =========================================================
  // RESET
  // =========================================================

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

  // =========================================================
  // DATA
  // =========================================================

  const barcodeUrl =
    `${import.meta.env.VITE_API_URL}` +
    `/medicine-batches/${batch._id}/barcode?type=${type}`;

  const medicineName =
    batch.medicine?.name ||
    "Unknown Medicine";

  const genericName =
    batch.medicine?.genericName ||
    "";

  const batchNumber =
    batch.batchNumber ||
    "-";

  const expiryDate =
    batch.expiryDate
      ? new Date(batch.expiryDate).toLocaleDateString(
          "en-GB"
        )
      : "-";

  const price = Number(
    batch.sellingPrice ||
      batch.price ||
      0
  ).toFixed(2);

  // =========================================================
  // CODE TYPE
  // =========================================================

  const handleQrCode = () => {
    setType("qrcode");
  };

  const handleBarcode = () => {
    setType("barcode");
  };

  // =========================================================
  // COPIES
  // =========================================================

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

    setCopies(
      Math.min(value, 100)
    );
  };

  // =========================================================
  // CHECK PRINTER
  // =========================================================

  const checkPrinter = async () => {
    try {
      setCheckingPrinter(true);

      /*
        هنربط هنا QZ Tray بعدين

        مثال:

        await qz.websocket.connect();

        setPrinterConnected(true);
      */

      console.log(
        "Checking thermal printer..."
      );

      setTimeout(() => {
        setPrinterConnected(false);
        setCheckingPrinter(false);
      }, 500);

    } catch (error) {
      console.error(
        "Printer connection error:",
        error
      );

      setPrinterConnected(false);
      setCheckingPrinter(false);
    }
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = async () => {
    if (!printerConnected) {
      console.error(
        "Thermal printer is not connected"
      );

      return;
    }

    console.log("Printing...", {
      type,
      copies,
      batchId: batch._id,
      barcodeUrl,
    });

    /*
      هنا هنضيف الطباعة الحقيقية:

      await printToThermalPrinter({
        type,
        copies,
        batch,
      });
    */
  };

  // =========================================================
  // RENDER
  // =========================================================

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

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

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

              <h5>
                Print Medicine Code
              </h5>

              <span>
                Thermal printer
              </span>

            </div>

          </div>

          <button
            type="button"
            className="barcode-modal-close"
            onClick={onClose}
          >
            <X size={19} />
          </button>

        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="barcode-modal-body">

          {/* ================================================= */}
          {/* MEDICINE */}
          {/* ================================================= */}

          <div className="barcode-medicine-card">

            <div className="barcode-medicine-icon">

              {type === "qrcode" ? (
                <QrCode size={25} />
              ) : (
                <Barcode size={25} />
              )}

            </div>

            <div className="barcode-medicine-content">

              <span>
                Medicine
              </span>

              <h3>
                {medicineName}
              </h3>

              {genericName && (
                <p>
                  {genericName}
                </p>
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* CODE TYPE */}
          {/* ================================================= */}

          <div className="barcode-section">

            <div className="barcode-section-header">

              <div>
                <strong>
                  Code Type
                </strong>

                <span>
                  Choose how the medicine code will be printed
                </span>
              </div>

            </div>

            <div className="barcode-type-options">

              <button
                type="button"
                className={
                  `barcode-type-btn ${
                    type === "qrcode"
                      ? "active"
                      : ""
                  }`
                }
                onClick={handleQrCode}
              >

                <QrCode size={20} />

                <div>
                  <strong>
                    QR Code
                  </strong>

                  <span>
                    2D code
                  </span>
                </div>

              </button>

              <button
                type="button"
                className={
                  `barcode-type-btn ${
                    type === "barcode"
                      ? "active"
                      : ""
                  }`
                }
                onClick={handleBarcode}
              >

                <Barcode size={20} />

                <div>
                  <strong>
                    Barcode
                  </strong>

                  <span>
                    1D code
                  </span>
                </div>

              </button>

            </div>

          </div>

          {/* ================================================= */}
          {/* PREVIEW */}
          {/* ================================================= */}

          <div className="barcode-preview-section">

            <div className="barcode-preview-header">

              <div>

                <strong>
                  Preview
                </strong>

                <span>
                  {type === "qrcode"
                    ? "QR Code"
                    : "Barcode"}
                </span>

              </div>

              <div className="barcode-preview-badge">

                {type === "qrcode" ? (
                  <QrCode size={14} />
                ) : (
                  <Barcode size={14} />
                )}

                {type === "qrcode"
                  ? "QR"
                  : "BARCODE"}

              </div>

            </div>

            <div className="barcode-container">

              <img
                src={barcodeUrl}
                alt={`${medicineName} ${type}`}
              />

            </div>

          </div>

          {/* ================================================= */}
          {/* INFORMATION */}
          {/* ================================================= */}

          <div className="barcode-info-grid">

            <div className="barcode-info-card">

              <span>
                Batch Number
              </span>

              <strong>
                {batchNumber}
              </strong>

            </div>

            <div className="barcode-info-card">

              <span>
                Expiry Date
              </span>

              <strong>
                {expiryDate}
              </strong>

            </div>

            <div className="barcode-info-card">

              <span>
                Selling Price
              </span>

              <strong>
                {price} EGP
              </strong>

            </div>

          </div>

          {/* ================================================= */}
          {/* COPIES + PRINTER */}
          {/* ================================================= */}

          <div className="barcode-print-options">

            {/* COPIES */}

            <div className="copies-section">

              <div className="barcode-option-title">

                <span>
                  Copies
                </span>

                <small>
                  Max 100
                </small>

              </div>

              <div className="copies-control">

                <button
                  type="button"
                  onClick={decreaseCopies}
                  disabled={copies <= 1}
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
                >
                  <Plus size={16} />
                </button>

              </div>

            </div>

            {/* PRINTER */}

            <div className="printer-section">

              <div className="printer-status">

                <div
                  className={
                    `printer-status-icon ${
                      printerConnected
                        ? "connected"
                        : "disconnected"
                    }`
                  }
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
                      ? "Printer Ready"
                      : "Printer Not Connected"}
                  </strong>

                  <span>
                    {printerConnected
                      ? "Ready to print"
                      : "Connect your thermal printer"}
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
                  ? "Checking..."
                  : "Check Printer"}

              </button>

            </div>

          </div>

          {/* ================================================= */}
          {/* BARCODE VALUE */}
          {/* ================================================= */}

          <details className="barcode-value-details">

            <summary>
              View Code Data
            </summary>

            <div className="barcode-value">

              <code>
                {batch.barcodeValue || "-"}
              </code>

            </div>

          </details>

        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="barcode-modal-footer">

          <button
            type="button"
            className="barcode-btn barcode-btn-close"
            onClick={onClose}
          >
            <X size={17} />
            Close
          </button>

          <button
            type="button"
            className="barcode-btn barcode-btn-save"
            onClick={handleSaveImage}
          >
            <Download size={17} />
            Save Image
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

            Print{" "}
            {copies > 1
              ? `(${copies})`
              : ""}
          </button>

        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;

