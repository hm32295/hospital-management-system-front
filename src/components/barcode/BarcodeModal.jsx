
import {
  Barcode,
  Printer,
  X,
  QrCode,
  Minus,
  Plus,
  Download,
  RotateCcw,
  Ruler,
  Maximize2,
} from "lucide-react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { showError } from "../../services/toast.service";
import { getApiErrorMessage } from "../../utils/apiError";
import "./barcodeModal.css";

const DEFAULT_LABEL_WIDTH = 50;
const DEFAULT_LABEL_HEIGHT = 30;
const DEFAULT_LABEL_PADDING = 2;

const MIN_LABEL_WIDTH = 20;
const MAX_LABEL_WIDTH = 150;
const MIN_LABEL_HEIGHT = 15;
const MAX_LABEL_HEIGHT = 100;
const MIN_LABEL_PADDING = 0;
const MAX_LABEL_PADDING = 15;

const BarcodeModal = ({ show, onClose, batch }) => {
  const { t, i18n } = useTranslation();

  const [type, setType] = useState("qrcode");
  const [copies, setCopies] = useState(1);
  const [backendFailed, setBackendFailed] =
    useState(false);
  const [backendLoading, setBackendLoading] =
    useState(true);

  const [labelWidth, setLabelWidth] =
    useState(DEFAULT_LABEL_WIDTH);
  const [labelHeight, setLabelHeight] =
    useState(DEFAULT_LABEL_HEIGHT);
  const [labelPadding, setLabelPadding] =
    useState(DEFAULT_LABEL_PADDING);

  const qrCanvasRef = useRef(null);
  const barcodeSvgRef = useRef(null);

  useEffect(() => {
    if (show) {
      setType("qrcode");
      setCopies(1);
      setBackendFailed(false);
      setBackendLoading(true);
      setLabelWidth(DEFAULT_LABEL_WIDTH);
      setLabelHeight(DEFAULT_LABEL_HEIGHT);
      setLabelPadding(DEFAULT_LABEL_PADDING);
    }
  }, [show, batch]);

  const barcodeValue =
    batch?.barcodeValue || "";

  const barcodeUrl = batch
    ? `${import.meta.env.VITE_API_URL}/medicine-batches/${batch._id}/barcode?type=${type}`
    : "";

  const medicineName =
    batch?.medicine?.name ||
    t("barcode.unknownMedicine");

  const genericName =
    batch?.medicine?.genericName || "";

  const batchNumber =
    batch?.batchNumber || "-";

  const expiryDate = batch?.expiryDate
    ? new Date(
        batch.expiryDate
      ).toLocaleDateString(
        i18n.language === "ar"
          ? "ar-EG"
          : "en-GB"
      )
    : "-";

  const price = Number(
    batch?.sellingPrice ||
      batch?.price ||
      0
  ).toFixed(2);

  useEffect(() => {
    if (
      !show ||
      !batch ||
      !backendFailed ||
      !barcodeValue
    ) {
      return;
    }

    if (type === "qrcode") {
      if (!qrCanvasRef.current) {
        return;
      }

      QRCode.toCanvas(
        qrCanvasRef.current,
        barcodeValue,
        {
          width: 220,
          margin: 2,
          errorCorrectionLevel: "M",
        },
        (error) => {
          if (error) {
            showError(
              getApiErrorMessage(
                error,
                t(
                  "barcode.generateFailed"
                )
              )
            );
          }
        }
      );
    }

    if (type === "barcode") {
      if (!barcodeSvgRef.current) {
        return;
      }

      try {
        JsBarcode(
          barcodeSvgRef.current,
          barcodeValue,
          {
            format: "CODE128",
            width: 2,
            height: 80,
            displayValue: false,
            margin: 5,
          }
        );
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t(
              "barcode.generateFailed"
            )
          )
        );
      }
    }
  }, [
    show,
    batch,
    backendFailed,
    barcodeValue,
    type,
    t,
  ]);

  useEffect(() => {
    if (!show || !batch) {
      return;
    }

    setBackendFailed(false);
    setBackendLoading(true);
  }, [type, show, batch]);

  if (!show || !batch) {
    return null;
  }

  const handleBackendLoad = () => {
    setBackendLoading(false);
    setBackendFailed(false);
  };

  const handleBackendError = () => {
    setBackendLoading(false);
    setBackendFailed(true);
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
    const value = Number(
      e.target.value
    );

    if (!value || value < 1) {
      setCopies(1);
      return;
    }

    setCopies(
      Math.min(value, 100)
    );
  };

  const handleLabelWidthChange = (
    e
  ) => {
    const value = Number(
      e.target.value
    );

    if (!value) {
      setLabelWidth(
        MIN_LABEL_WIDTH
      );
      return;
    }

    setLabelWidth(
      Math.min(
        Math.max(
          value,
          MIN_LABEL_WIDTH
        ),
        MAX_LABEL_WIDTH
      )
    );
  };

  const handleLabelHeightChange = (
    e
  ) => {
    const value = Number(
      e.target.value
    );

    if (!value) {
      setLabelHeight(
        MIN_LABEL_HEIGHT
      );
      return;
    }

    setLabelHeight(
      Math.min(
        Math.max(
          value,
          MIN_LABEL_HEIGHT
        ),
        MAX_LABEL_HEIGHT
      )
    );
  };

  const handleLabelPaddingChange = (
    e
  ) => {
    const value = Number(
      e.target.value
    );

    if (
      value <
      MIN_LABEL_PADDING
    ) {
      setLabelPadding(
        MIN_LABEL_PADDING
      );
      return;
    }

    setLabelPadding(
      Math.min(
        value,
        MAX_LABEL_PADDING
      )
    );
  };

  const increaseLabelWidth = () => {
    setLabelWidth((prev) =>
      Math.min(
        prev + 1,
        MAX_LABEL_WIDTH
      )
    );
  };

  const decreaseLabelWidth = () => {
    setLabelWidth((prev) =>
      Math.max(
        prev - 1,
        MIN_LABEL_WIDTH
      )
    );
  };

  const increaseLabelHeight = () => {
    setLabelHeight((prev) =>
      Math.min(
        prev + 1,
        MAX_LABEL_HEIGHT
      )
    );
  };

  const decreaseLabelHeight = () => {
    setLabelHeight((prev) =>
      Math.max(
        prev - 1,
        MIN_LABEL_HEIGHT
      )
    );
  };

  const increaseLabelPadding = () => {
    setLabelPadding((prev) =>
      Math.min(
        prev + 1,
        MAX_LABEL_PADDING
      )
    );
  };

  const decreaseLabelPadding = () => {
    setLabelPadding((prev) =>
      Math.max(
        prev - 1,
        MIN_LABEL_PADDING
      )
    );
  };

  const resetLabelSize = () => {
    setLabelWidth(
      DEFAULT_LABEL_WIDTH
    );
    setLabelHeight(
      DEFAULT_LABEL_HEIGHT
    );
    setLabelPadding(
      DEFAULT_LABEL_PADDING
    );
  };

  const getFileName = () => {
    const safeMedicineName =
      medicineName
        .replace(
          /[^a-z0-9\u0600-\u06FF]/gi,
          "-"
        )
        .replace(
          /-+/g,
          "-"
        );

    return `${safeMedicineName}-${type}-${batch.batchNumber || batch._id}.png`;
  };

  const downloadBlob = (blob) => {
    const imageUrl =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = imageUrl;
    link.download =
      getFileName();

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    setTimeout(() => {
      URL.revokeObjectURL(
        imageUrl
      );
    }, 1000);
  };

  const saveFrontendQrCode =
    async () => {
      if (!qrCanvasRef.current) {
        throw new Error(
          t(
            "barcode.generateFailed"
          )
        );
      }

      const canvas =
        qrCanvasRef.current;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            showError(
              t(
                "barcode.saveImageFailed"
              )
            );
            return;
          }

          downloadBlob(blob);
        },
        "image/png"
      );
    };

  const saveFrontendBarcode =
    () => {
      if (
        !barcodeSvgRef.current
      ) {
        throw new Error(
          t(
            "barcode.generateFailed"
          )
        );
      }

      const svg =
        barcodeSvgRef.current;

      const serializer =
        new XMLSerializer();

      const svgString =
        serializer.serializeToString(
          svg
        );

      const svgBlob =
        new Blob(
          [svgString],
          {
            type: "image/svg+xml;charset=utf-8",
          }
        );

      const url =
        URL.createObjectURL(
          svgBlob
        );

      const image =
        new Image();

      image.onload = () => {
        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width =
          image.width;

        canvas.height =
          image.height;

        const context =
          canvas.getContext(
            "2d"
          );

        context.drawImage(
          image,
          0,
          0
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              showError(
                t(
                  "barcode.saveImageFailed"
                )
              );
              return;
            }

            downloadBlob(blob);
          },
          "image/png"
        );

        URL.revokeObjectURL(
          url
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          url
        );

        showError(
          t(
            "barcode.saveImageFailed"
          )
        );
      };

      image.src = url;
    };

  const saveFrontendImage =
    async () => {
      if (!barcodeValue) {
        throw new Error(
          t(
            "barcode.generateFailed"
          )
        );
      }

      if (type === "qrcode") {
        await saveFrontendQrCode();
        return;
      }

      saveFrontendBarcode();
    };

  const handleSaveImage =
    async () => {
      try {
        if (!backendFailed) {
          try {
            const response =
              await fetch(
                barcodeUrl
              );

            if (!response.ok) {
              throw new Error(
                t(
                  "barcode.saveImageFailed"
                )
              );
            }

            const blob =
              await response.blob();

            downloadBlob(blob);

            return;
          } catch {
            setBackendFailed(
              true
            );
          }
        }

        await saveFrontendImage();
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t(
              "barcode.saveImageFailed"
            )
          )
        );
      }
    };

  const getFrontendImageForPrint =
    async () => {
      if (!barcodeValue) {
        throw new Error(
          t(
            "barcode.generateFailed"
          )
        );
      }

      if (type === "qrcode") {
        const canvas =
          document.createElement(
            "canvas"
          );

        await QRCode.toCanvas(
          canvas,
          barcodeValue,
          {
            width: 800,
            margin: 2,
            errorCorrectionLevel:
              "M",
          }
        );

        return canvas.toDataURL(
          "image/png"
        );
      }

      const svg =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );

      JsBarcode(
        svg,
        barcodeValue,
        {
          format: "CODE128",
          width: 3,
          height: 160,
          displayValue: false,
          margin: 5,
        }
      );

      const serializer =
        new XMLSerializer();

      const svgString =
        serializer.serializeToString(
          svg
        );

      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        svgString
      )}`;
    };

  const getPrintImage =
    async () => {
      if (!backendFailed) {
        try {
          const response =
            await fetch(
              barcodeUrl
            );

          if (!response.ok) {
            throw new Error(
              t(
                "barcode.printFailed"
              )
            );
          }

          const blob =
            await response.blob();

          return URL.createObjectURL(
            blob
          );
        } catch {
          setBackendFailed(
            true
          );
        }
      }

      return getFrontendImageForPrint();
    };

  const handlePrint =
    async () => {
      let printImageUrl = null;
      let shouldRevokeUrl =
        false;

      try {
        printImageUrl =
          await getPrintImage();

        shouldRevokeUrl =
          printImageUrl.startsWith(
            "blob:"
          );

        const printWindow =
          window.open(
            "",
            "_blank",
            "width=800,height=900"
          );

        if (!printWindow) {
          showError(
            t(
              "barcode.popupBlocked"
            )
          );
          return;
        }

        const copiesHtml =
          Array.from(
            {
              length: copies,
            },
            () => `
              <div class="barcode-copy">
                <img
                  src="${printImageUrl}"
                  alt="Barcode"
                  class="barcode-image"
                />
              </div>
            `
          ).join("");

        printWindow.document.write(`
          <!DOCTYPE html>
          <html
            lang="${i18n.language}"
            dir="${
              i18n.language === "ar"
                ? "rtl"
                : "ltr"
            }"
          >
            <head>
              <meta charset="UTF-8" />

              <title>
                ${medicineName}
              </title>

              <style>
                @page {
                  size: ${labelWidth}mm ${labelHeight}mm;
                  margin: 0;
                }

                * {
                  box-sizing: border-box;
                }

                html,
                body {
                  width: ${labelWidth}mm;
                  height: auto;
                  margin: 0;
                  padding: 0;
                  background: #fff;
                }

                body {
                  font-family:
                    Arial,
                    Helvetica,
                    sans-serif;
                }

                .print-container {
                  width: ${labelWidth}mm;
                  margin: 0;
                  padding: 0;
                }

                .barcode-copy {
                  width: ${labelWidth}mm;
                  height: ${labelHeight}mm;
                  padding: ${labelPadding}mm;
                  margin: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                  page-break-after: always;
                  break-after: page;
                }

                .barcode-copy:last-child {
                  page-break-after: auto;
                  break-after: auto;
                }

                .barcode-image {
                  display: block;
                  width: 100%;
                  height: 100%;
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                }

                @media print {
                  html,
                  body {
                    width: ${labelWidth}mm;
                    margin: 0;
                    padding: 0;
                  }

                  .barcode-copy {
                    width: ${labelWidth}mm;
                    height: ${labelHeight}mm;
                    padding: ${labelPadding}mm;
                    page-break-after: always;
                    break-after: page;
                  }

                  .barcode-copy:last-child {
                    page-break-after: auto;
                    break-after: auto;
                  }
                }
              </style>
            </head>

            <body>
              <div class="print-container">
                ${copiesHtml}
              </div>

              <script>
                const images =
                  document.querySelectorAll(
                    ".barcode-image"
                  );

                let loaded = 0;

                const printWhenReady =
                  () => {
                    loaded++;

                    if (
                      loaded ===
                      images.length
                    ) {
                      setTimeout(
                        () => {
                          window.print();
                        },
                        300
                      );
                    }
                  };

                if (
                  images.length ===
                  0
                ) {
                  setTimeout(
                    () => {
                      window.print();
                    },
                    300
                  );
                } else {
                  images.forEach(
                    (img) => {
                      if (
                        img.complete
                      ) {
                        printWhenReady();
                      } else {
                        img.onload =
                          printWhenReady;

                        img.onerror =
                          printWhenReady;
                      }
                    }
                  );
                }

                window.onafterprint =
                  () => {
                    window.close();
                  };
              </script>
            </body>
          </html>
        `);

        printWindow.document.close();

        if (shouldRevokeUrl) {
          setTimeout(() => {
            URL.revokeObjectURL(
              printImageUrl
            );
          }, 10000);
        }
      } catch (error) {
        if (
          shouldRevokeUrl &&
          printImageUrl
        ) {
          URL.revokeObjectURL(
            printImageUrl
          );
        }

        showError(
          getApiErrorMessage(
            error,
            t(
              "barcode.printFailed"
            )
          )
        );
      }
    };

  return (
    <div
      className="barcode-modal-overlay"
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
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
              <h5>
                {t("barcode.title")}
              </h5>

              <span>
                {t(
                  "barcode.thermalPrinter"
                )}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="barcode-modal-close"
            onClick={onClose}
            aria-label={t(
              "common.close"
            )}
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
              <span>
                {t(
                  "barcode.medicine"
                )}
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

          <div className="barcode-section">
            <div className="barcode-section-header">
              <div>
                <strong>
                  {t(
                    "barcode.codeType"
                  )}
                </strong>

                <span>
                  {t(
                    "barcode.codeTypeDescription"
                  )}
                </span>
              </div>
            </div>

            <div className="barcode-type-options">
              <button
                type="button"
                className={`barcode-type-btn ${
                  type === "qrcode"
                    ? "active"
                    : ""
                }`}
                onClick={
                  handleQrCode
                }
              >
                <QrCode size={20} />

                <div>
                  <strong>
                    {t(
                      "barcode.qrCode"
                    )}
                  </strong>

                  <span>
                    {t(
                      "barcode.twoDCode"
                    )}
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`barcode-type-btn ${
                  type === "barcode"
                    ? "active"
                    : ""
                }`}
                onClick={
                  handleBarcode
                }
              >
                <Barcode size={20} />

                <div>
                  <strong>
                    {t(
                      "barcode.barcode"
                    )}
                  </strong>

                  <span>
                    {t(
                      "barcode.oneDCode"
                    )}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="barcode-preview-section">
            <div className="barcode-preview-header">
              <div>
                <strong>
                  {t(
                    "barcode.preview"
                  )}
                </strong>

                <span>
                  {type === "qrcode"
                    ? t(
                        "barcode.qrCode"
                      )
                    : t(
                        "barcode.barcode"
                      )}
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
                  : t(
                      "barcode.barcodeLabel"
                    )}
              </div>
            </div>

            <div className="barcode-container">
              {backendLoading &&
                !backendFailed && (
                  <div className="barcode-loading">
                    {t(
                      "common.loading"
                    )}
                  </div>
                )}

              {!backendFailed && (
                <img
                  src={barcodeUrl}
                  alt={`${medicineName} ${type}`}
                  onLoad={
                    handleBackendLoad
                  }
                  onError={
                    handleBackendError
                  }
                  style={{
                    display:
                      backendLoading
                        ? "none"
                        : "block",
                  }}
                />
              )}

              {backendFailed &&
                type === "qrcode" && (
                  <canvas
                    ref={
                      qrCanvasRef
                    }
                    aria-label={`${medicineName} QR Code`}
                  />
                )}

              {backendFailed &&
                type === "barcode" && (
                  <svg
                    ref={
                      barcodeSvgRef
                    }
                    aria-label={`${medicineName} Barcode`}
                  />
                )}

              {backendFailed &&
                !barcodeValue && (
                  <div className="barcode-error">
                    {t(
                      "barcode.generateFailed"
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="barcode-info-grid">
            <div className="barcode-info-card">
              <span>
                {t(
                  "barcode.batchNumber"
                )}
              </span>

              <strong>
                {batchNumber}
              </strong>
            </div>

            <div className="barcode-info-card">
              <span>
                {t(
                  "barcode.expiryDate"
                )}
              </span>

              <strong>
                {expiryDate}
              </strong>
            </div>

            <div className="barcode-info-card">
              <span>
                {t(
                  "barcode.sellingPrice"
                )}
              </span>

              <strong>
                {price}{" "}
                {t("common.egp")}
              </strong>
            </div>
          </div>

          <div className="barcode-print-options">
            <div className="copies-section">
              <div className="barcode-option-title">
                <span>
                  {t(
                    "barcode.copies"
                  )}
                </span>

                <small>
                  {t(
                    "barcode.maxCopies",
                    {
                      count: 100,
                    }
                  )}
                </small>
              </div>

              <div className="copies-control">
                <button
                  type="button"
                  onClick={
                    decreaseCopies
                  }
                  disabled={
                    copies <= 1
                  }
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
                  onChange={
                    handleCopiesChange
                  }
                />

                <button
                  type="button"
                  onClick={
                    increaseCopies
                  }
                  disabled={
                    copies >= 100
                  }
                  aria-label={t(
                    "barcode.increaseCopies"
                  )}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="label-settings">
              <div className="label-settings-header">
                <div className="label-settings-title">
                  <div className="label-settings-icon">
                    <Ruler
                      size={18}
                    />
                  </div>

                  <div>
                    <strong>
                      {t(
                        "barcode.labelSettings",
                        {
                          defaultValue:
                            "Label Settings",
                        }
                      )}
                    </strong>

                    <span>
                      {t(
                        "barcode.labelSettingsDescription",
                        {
                          defaultValue:
                            "Customize the thermal label size",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="label-settings-reset"
                  onClick={
                    resetLabelSize
                  }
                  title={t(
                    "barcode.resetLabelSize",
                    {
                      defaultValue:
                        "Reset to default",
                    }
                  )}
                >
                  <RotateCcw
                    size={15}
                  />

                  <span>
                    {t(
                      "barcode.reset",
                      {
                        defaultValue:
                          "Reset",
                      }
                    )}
                  </span>
                </button>
              </div>

              <div className="label-size-cards">
                <div className="label-size-card">
                  <div className="label-size-card-icon">
                    <Maximize2
                      size={16}
                    />
                  </div>

                  <div className="label-size-card-content">
                    <span>
                      {t(
                        "barcode.width",
                        {
                          defaultValue:
                            "Width",
                        }
                      )}
                    </span>

                    <div className="label-number-control">
                      <button
                        type="button"
                        onClick={
                          decreaseLabelWidth
                        }
                        disabled={
                          labelWidth <=
                          MIN_LABEL_WIDTH
                        }
                      >
                        <Minus
                          size={13}
                        />
                      </button>

                      <input
                        type="number"
                        min={
                          MIN_LABEL_WIDTH
                        }
                        max={
                          MAX_LABEL_WIDTH
                        }
                        value={
                          labelWidth
                        }
                        onChange={
                          handleLabelWidthChange
                        }
                      />

                      <button
                        type="button"
                        onClick={
                          increaseLabelWidth
                        }
                        disabled={
                          labelWidth >=
                          MAX_LABEL_WIDTH
                        }
                      >
                        <Plus
                          size={13}
                        />
                      </button>
                    </div>

                    <small>
                      mm
                    </small>
                  </div>
                </div>

                <div className="label-size-card">
                  <div className="label-size-card-icon">
                    <Maximize2
                      size={16}
                    />
                  </div>

                  <div className="label-size-card-content">
                    <span>
                      {t(
                        "barcode.height",
                        {
                          defaultValue:
                            "Height",
                        }
                      )}
                    </span>

                    <div className="label-number-control">
                      <button
                        type="button"
                        onClick={
                          decreaseLabelHeight
                        }
                        disabled={
                          labelHeight <=
                          MIN_LABEL_HEIGHT
                        }
                      >
                        <Minus
                          size={13}
                        />
                      </button>

                      <input
                        type="number"
                        min={
                          MIN_LABEL_HEIGHT
                        }
                        max={
                          MAX_LABEL_HEIGHT
                        }
                        value={
                          labelHeight
                        }
                        onChange={
                          handleLabelHeightChange
                        }
                      />

                      <button
                        type="button"
                        onClick={
                          increaseLabelHeight
                        }
                        disabled={
                          labelHeight >=
                          MAX_LABEL_HEIGHT
                        }
                      >
                        <Plus
                          size={13}
                        />
                      </button>
                    </div>

                    <small>
                      mm
                    </small>
                  </div>
                </div>

                <div className="label-size-card">
                  <div className="label-size-card-icon">
                    <Ruler
                      size={16}
                    />
                  </div>

                  <div className="label-size-card-content">
                    <span>
                      {t(
                        "barcode.padding",
                        {
                          defaultValue:
                            "Padding",
                        }
                      )}
                    </span>

                    <div className="label-number-control">
                      <button
                        type="button"
                        onClick={
                          decreaseLabelPadding
                        }
                        disabled={
                          labelPadding <=
                          MIN_LABEL_PADDING
                        }
                      >
                        <Minus
                          size={13}
                        />
                      </button>

                      <input
                        type="number"
                        min={
                          MIN_LABEL_PADDING
                        }
                        max={
                          MAX_LABEL_PADDING
                        }
                        value={
                          labelPadding
                        }
                        onChange={
                          handleLabelPaddingChange
                        }
                      />

                      <button
                        type="button"
                        onClick={
                          increaseLabelPadding
                        }
                        disabled={
                          labelPadding >=
                          MAX_LABEL_PADDING
                        }
                      >
                        <Plus
                          size={13}
                        />
                      </button>
                    </div>

                    <small>
                      mm
                    </small>
                  </div>
                </div>
              </div>

              <div className="label-size-summary">
                <div className="label-size-summary-icon">
                  <Ruler
                    size={16}
                  />
                </div>

                <div>
                  <span>
                    {t(
                      "barcode.currentLabelSize",
                      {
                        defaultValue:
                          "Current label size",
                      }
                    )}
                  </span>

                  <strong>
                    {labelWidth} ×{" "}
                    {labelHeight} mm
                  </strong>
                </div>

                <div className="label-size-default">
                  <span>
                    {t(
                      "barcode.default",
                      {
                        defaultValue:
                          "Default",
                      }
                    )}
                  </span>

                  <strong>
                    {DEFAULT_LABEL_WIDTH} ×{" "}
                    {DEFAULT_LABEL_HEIGHT} mm
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="barcode-print-hint">
            {t(
              "barcode.printScaleHint",
              {
                defaultValue:
                  "For best results, use 100% / Actual Size in the browser print dialog.",
              }
            )}
          </div>

          <details className="barcode-value-details">
            <summary>
              {t(
                "barcode.viewCodeData"
              )}
            </summary>

            <div className="barcode-value">
              <code>
                {barcodeValue || "-"}
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
            {t(
              "common.close"
            )}
          </button>

          <button
            type="button"
            className="barcode-btn barcode-btn-save"
            onClick={
              handleSaveImage
            }
          >
            <Download
              size={17}
            />
            {t(
              "barcode.saveImage"
            )}
          </button>

          <button
            type="button"
            className="barcode-btn barcode-btn-print"
            onClick={
              handlePrint
            }
            disabled={
              copies < 1
            }
          >
            <Printer
              size={17}
            />

            {t(
              "barcode.print"
            )}

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