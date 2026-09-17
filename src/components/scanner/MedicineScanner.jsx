import { useEffect, useRef, useState } from "react";
import { ScanQrCode, Camera, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

import "./medicineScanner.css";

const MedicineScanner = ({ onScan }) => {
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
        { fps: 10,qrbox: {width: 250, height: 250}
        },
        (decodedText) => {
          if (isScanningRef.current) return;
          isScanningRef.current = true;
          onScan(decodedText);
          setTimeout(() => { isScanningRef.current = false; }, 1000);
        }
      );
    } catch (err) {
      console.error(err);
      setError(
        "Unable to access camera. Please allow camera permission."
      );
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
        <span>
          Scan QR Code
        </span>
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
                  <h5> Scan Medicine  </h5>
                  <span>
                    Scan the QR code on the medicine
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="medicine-scanner-close"
                onClick={handleCloseScanner}
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
                Point your camera at the medicine QR code.
              </p>

            </div>
            <div className="medicine-scanner-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCloseScanner}
              >
                <X size={17} />
                Close
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default MedicineScanner;