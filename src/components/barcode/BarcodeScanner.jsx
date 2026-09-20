
import { useEffect, useRef, useState } from "react";
import {
  Barcode,
  Camera,
  Image,
  X,
} from "lucide-react";
import {
  BrowserMultiFormatReader,
} from "@zxing/browser";
import { useTranslation } from "react-i18next";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../utils/apiError";
import "./barcodeScanner.css";

const BarcodeScanner = ({ onScan, onClose }) => {
  const { t } = useTranslation();

  const [value, setValue] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const readerRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!showCamera) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showCamera]);

  const stopCamera = () => {
    try {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }

      if (readerRef.current) {
        readerRef.current.reset();
        readerRef.current = null;
      }

      const video = document.getElementById("medicine-camera-reader");

      if (video?.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    } catch (error) {
      console.error("Stop camera error:", error);
    }
  };

  useEffect(() => {
    if (!showCamera) return;

    let cancelled = false;

    const startCamera = async () => {
      try {
        setError("");
        setCameraLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 200));

        if (cancelled) return;

        const videoElement = document.getElementById("medicine-camera-reader");

        if (!videoElement) {
          throw new Error("Camera element not found");
        }

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();

        if (!devices.length) {
          throw new Error("No camera found");
        }

        const backCamera = devices.find((device) =>
          /back|rear|environment/i.test(device.label)
        );

        const deviceId = backCamera?.deviceId || devices[0].deviceId;

        controlsRef.current = await reader.decodeFromVideoDevice(
          deviceId,
          videoElement,
          (result) => {
            if (cancelled) return;

            if (result) {
              const decodedText = result.getText();

              console.log("Camera scan:", decodedText);

              onScan(decodedText);

              stopCamera();
            }
          }
        );

        if (!cancelled) {
          setCameraLoading(false);
        }
      } catch (error) {
        console.error("Camera error:", error);

        if (!cancelled) {
          setCameraLoading(false);

          const message = getApiErrorMessage(
            error,
            t("barcodeScanner.cameraError")
          );

          setError(t("barcodeScanner.cameraError"));
          showError(message);

          setShowCamera(false);
        }
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [showCamera]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const barcodeValue = value.trim();

    if (!barcodeValue) return;

    console.log("Physical scanner:", barcodeValue);

    onScan(barcodeValue);

    setValue("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleOpenCamera = () => {
    setError("");
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    stopCamera();
    setShowCamera(false);
  };

  const handleOpenImage = () => {
    setError("");
    fileInputRef.current?.click();
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setImageLoading(true);

    const imageUrl = URL.createObjectURL(file);

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const result = await reader.decodeFromImageUrl(imageUrl);

      if (!result) {
        throw new Error("No barcode or QR code found");
      }

      const decodedText = result.getText();

      console.log("Image scan:", decodedText);

      onScan(decodedText);

      setError("");
    } catch (error) {
      console.error("Image scan error:", error);

      const message = getApiErrorMessage(
        error,
        t("barcodeScanner.imageError")
      );

      setError(t("barcodeScanner.imageError"));
      showError(message);
    } finally {
      URL.revokeObjectURL(imageUrl);

      setImageLoading(false);
      readerRef.current = null;

      e.target.value = "";
    }
  };

  const handleClose = () => {
    stopCamera();

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="barcode-scanner">
      <div className="barcode-scanner-header">
        <div className="barcode-scanner-title">
          <div className="barcode-scanner-icon">
            <Barcode size={22} />
          </div>

          <div>
            <h5>{t("barcodeScanner.title")}</h5>

            <span>{t("barcodeScanner.subtitle")}</span>
          </div>
        </div>

        {(onClose || showCamera) && (
          <button
            type="button"
            className="barcode-scanner-close"
            onClick={
              showCamera
                ? handleCloseCamera
                : handleClose
            }
            aria-label={t("common.close")}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {showCamera && (
        <div className="barcode-camera-container">
          <video
            id="medicine-camera-reader"
            className="barcode-camera-reader"
            autoPlay
            muted
            playsInline
          />

          {cameraLoading && (
            <div className="barcode-camera-loading">
              {t("barcodeScanner.startingCamera")}
            </div>
          )}

          <button
            type="button"
            className="barcode-camera-stop"
            onClick={handleCloseCamera}
          >
            <X size={18} />
            {t("barcodeScanner.stopCamera")}
          </button>
        </div>
      )}

      {!showCamera && (
        <>
          <form
            className="barcode-scanner-form"
            onSubmit={handleSubmit}
          >
            <div className="barcode-scanner-input-wrapper">
              <Barcode size={20} />

              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t("barcodeScanner.placeholder")}
                autoComplete="off"
              />
            </div>
          </form>

          <div className="barcode-scanner-actions">
            <button
              type="button"
              className="barcode-scanner-action"
              onClick={handleOpenCamera}
            >
              <Camera size={19} />

              <span>{t("barcodeScanner.camera")}</span>
            </button>

            <button
              type="button"
              className="barcode-scanner-action"
              onClick={handleOpenImage}
              disabled={imageLoading}
            >
              <Image size={19} />

              <span>
                {imageLoading
                  ? t("barcodeScanner.reading")
                  : t("barcodeScanner.image")}
              </span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageSelect}
          />
        </>
      )}

      {error && (
        <div className="barcode-scanner-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
