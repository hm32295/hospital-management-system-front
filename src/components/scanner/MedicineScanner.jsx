
import { useEffect, useRef, useState } from "react";
import { ScanQrCode, Camera, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { useTranslation } from "react-i18next";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../utils/apiError";
import "./medicineScanner.css";

const MedicineScanner = ({ onScan }) => {
  const { t } = useTranslation();
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState("");

  const startScanner = async () => {
    setError("");

    try {
      const scanner = new Html5Qrcode("medicine-qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (isScanningRef.current) return;

          isScanningRef.current = true;
          onScan(decodedText);

          setTimeout(() => {
            isScanningRef.current = false;
          }, 1000);
        }
      );
    } catch (err) {
      console.error(err);

      const message = getApiErrorMessage(
        err,
        t("medicineScanner.cameraError")
      );

      setError(t("medicineScanner.cameraError"));
      showError(message);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.error("Stop scanner error:", err);
    }

    isScanningRef.current = false;
  };

  const handleOpenScanner = async () => {
    setShowScanner(true);

    setTimeout(() => {
      startScanner();
    }, 100);
  };

  const handleCloseScanner = async () => {
    await stopScanner();
    setShowScanner(false);
    setError("");
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="medicine-scan-button"
        onClick={handleOpenScanner}
      >
        <ScanQrCode size={20} />
        <span>{t("medicineScanner.scanQrCode")}</span>
      </button>

      {showScanner && (
        <div className="medicine-scanner-overlay">
          <div className="medicine-scanner-modal">
            <div className="medicine-scanner-header">
              <div className="medicine-scanner-title">
                <div className="medicine-scanner-icon">
                  <ScanQrCode size={22} />
                </div>

                <div>
                  <h5>{t("medicineScanner.title")}</h5>
                  <span>{t("medicineScanner.subtitle")}</span>
                </div>
              </div>

              <button
                type="button"
                className="medicine-scanner-close"
                onClick={handleCloseScanner}
                aria-label={t("common.close")}
              >
                <X size={20} />
              </button>
            </div>

            <div className="medicine-scanner-body">
              <div className="scanner-camera-wrapper">
                <div
                  id="medicine-qr-reader"
                  className="medicine-qr-reader"
                />
              </div>

              {error && (
                <div className="scanner-error">
                  <Camera size={18} />
                  <span>{error}</span>
                </div>
              )}

              <p className="scanner-help">
                {t("medicineScanner.help")}
              </p>
            </div>

            <div className="medicine-scanner-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCloseScanner}
              >
                <X size={17} />
                {t("medicineScanner.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicineScanner;
