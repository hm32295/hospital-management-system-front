
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ScanBarcode,
  UserRound,
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  ReceiptText,
  UserPlus,
  UserX,
} from "lucide-react";

import "./sales.css";
import { getBatches } from "../../services/batches.service";
import { createSale } from "../../services/sales.service";
import { createPayment } from "../../services/payment.service";
import BarcodeScanner from "../../components/barcode/BarcodeScanner";
import MedicineManualSelector from "../../components/medicineSelector/MedicineManualSelector";
import PaymentModal from "../../components/paymentModal/PaymentModal";
import parseBarcode from "../../utils/parseBarcode";
import {
  createPatient,
  getPatients,
} from "../../services/patients.service";
import {
  showError,
  showSuccess,
  showWarning,
} from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Sales = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [customerType, setCustomerType] = useState("existing");
  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [newPatient, setNewPatient] = useState({
    name: "",
    phone: "",
  });
  const [creatingPatient, setCreatingPatient] = useState(false);

  const [batches, setBatches] = useState([]);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);

  const [creatingSale, setCreatingSale] = useState(false);
  const [createdSale, setCreatedSale] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const locale =
    i18n.language === "ar" ? "ar-EG" : "en-EG";

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(response.patients || []);
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("sales.loadPatientsFailed")
          )
        );
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await getBatches({
          isActive: true,
          expiryStatus: "valid",
          quantity: "available",
          limit: 100,
        });

        setBatches(response.batches || []);
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("sales.loadBatchesFailed")
          )
        );
      }
    };

    fetchBatches();
  }, []);

  const filteredPatients = patients.filter((item) => {
    const search = patientSearch.toLowerCase().trim();

    if (!search) return true;

    return (
      item.name?.toLowerCase().includes(search) ||
      item.phone?.toString().includes(search)
    );
  });

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);
    setServerError("");
    setPatientSearch("");

    if (type !== "existing") {
      setPatient(null);
    }

    if (type !== "new") {
      setNewPatient({
        name: "",
        phone: "",
      });
    }
  };

  const handleSelectPatient = (selectedPatient) => {
    setPatient(selectedPatient);
    setPatientSearch("");
    setServerError("");
  };

  const handleCreateNewPatient = async () => {
    if (!newPatient.name.trim()) {
      setServerError(t("sales.patientNameRequired"));
      showError(t("sales.patientNameRequired"));
      return;
    }

    try {
      setCreatingPatient(true);
      setServerError("");

      const response = await createPatient({
        name: newPatient.name.trim(),
        phone: newPatient.phone.trim() || undefined,
      });

      const createdPatient =
        response.patient || response.data?.patient;

      if (!createdPatient) {
        throw new Error(t("sales.patientNotCreated"));
      }

      setPatient(createdPatient);
      setPatients((prev) => [
        createdPatient,
        ...prev,
      ]);
      setCustomerType("existing");

      setNewPatient({
        name: "",
        phone: "",
      });

      showSuccess(t("sales.patientCreatedSuccess"));
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        t("sales.createPatientFailed")
      );

      setServerError(message);
      showError(message);
    } finally {
      setCreatingPatient(false);
    }
  };

  const addToCart = (medicine, availableQuantity) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) => item.batch === medicine.batch
      );

      if (existingItem) {
        if (
          existingItem.quantity >=
          availableQuantity
        ) {
          showWarning(
            t("sales.cannotExceedAvailable")
          );
          return prev;
        }

        const quantity =
          existingItem.quantity + 1;

        return prev.map((item) =>
          item.batch === medicine.batch
            ? {
                ...item,
                quantity,
                total:
                  item.unitPrice * quantity,
              }
            : item
        );
      }

      const unitPrice =
        Number(medicine.unitPrice) || 0;

      return [
        ...prev,
        {
          ...medicine,
          availableQuantity,
          quantity: 1,
          total: unitPrice,
        },
      ];
    });
  };

  const handleScan = (decodedText) => {
    const medicineData = parseBarcode(decodedText);

    if (!medicineData) {
      showError(t("sales.invalidMedicineCode"));
      return;
    }

    const scannedBatch = batches.find(
      (batch) => batch._id === medicineData.batch
    );

    if (!scannedBatch) {
      showError(t("sales.batchNotFound"));
      return;
    }

    if (!scannedBatch.isActive) {
      showWarning(t("sales.batchInactive"));
      return;
    }

    if (
      new Date(scannedBatch.expiryDate) <
      new Date()
    ) {
      showWarning(t("sales.batchExpired"));
      return;
    }

    if (Number(scannedBatch.quantity) <= 0) {
      showWarning(t("sales.batchOutOfStock"));
      return;
    }

    addToCart(
      {
        medicine: medicineData.medicine,
        batch: medicineData.batch,
        name:
          medicineData.name ||
          scannedBatch.medicine?.name ||
          `Medicine-${medicineData.medicine.slice(-6)}`,
        genericName:
          medicineData.genericName ||
          scannedBatch.medicine?.genericName ||
          "",
        batchNumber:
          scannedBatch.batchNumber || "-",
        expiryDate: scannedBatch.expiryDate,
        unitPrice:
          Number(medicineData.unitPrice) ||
          Number(scannedBatch.sellingPrice) ||
          0,
      },
      Number(scannedBatch.quantity)
    );
  };

  const handleManualAdd = (medicine) => {
    if (
      !medicine?.medicine ||
      !medicine?.batch
    ) {
      showError(t("sales.invalidMedicineData"));
      return;
    }

    if (Number(medicine.availableQuantity) <= 0) {
      showWarning(t("sales.batchOutOfStock"));
      return;
    }

    if (
      medicine.expiryDate &&
      new Date(medicine.expiryDate) <
        new Date()
    ) {
      showWarning(t("sales.batchExpired"));
      return;
    }

    addToCart(
      medicine,
      Number(medicine.availableQuantity)
    );
  };

  const increaseQuantity = (batchId) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.batch !== batchId) return item;

        if (
          item.quantity >=
          item.availableQuantity
        ) {
          showWarning(
            t("sales.cannotExceedAvailable")
          );
          return item;
        }

        const quantity = item.quantity + 1;

        return {
          ...item,
          quantity,
          total:
            item.unitPrice * quantity,
        };
      })
    );
  };

  const decreaseQuantity = (batchId) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.batch !== batchId) return item;

          const quantity =
            item.quantity - 1;

          return {
            ...item,
            quantity,
            total:
              item.unitPrice * quantity,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (batchId) => {
    setCart((prev) =>
      prev.filter(
        (item) => item.batch !== batchId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.unitPrice) *
        item.quantity,
    0
  );

  const discountValue =
    Number(discount) || 0;

  const total = Math.max(
    subtotal - discountValue,
    0
  );

  const handleCreateSale = async () => {
    setServerError("");

    if (
      customerType === "existing" &&
      !patient
    ) {
      const message = t(
        "sales.selectPatient"
      );
      setServerError(message);
      showError(message);
      return;
    }

    if (
      customerType === "new" &&
      !patient
    ) {
      const message = t(
        "sales.createNewPatientFirst"
      );
      setServerError(message);
      showError(message);
      return;
    }

    if (cart.length === 0) {
      const message = t("sales.cartEmpty");
      setServerError(message);
      showError(message);
      return;
    }

    if (discountValue > subtotal) {
      const message = t(
        "sales.discountExceedsSubtotal"
      );
      setServerError(message);
      showError(message);
      return;
    }

    try {
      setCreatingSale(true);

      const saleData = {
        patient: patient?._id || null,
        items: cart.map((item) => ({
          medicine: item.medicine,
          batch: item.batch,
          quantity: item.quantity,
        })),
        discount: discountValue,
        notes: "",
      };

      const response =
        await createSale(saleData);

      setCreatedSale(response.sale);
      setShowPaymentModal(true);

      showSuccess(
        t("sales.saleCreatedSuccess")
      );
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        t("sales.createSaleFailed")
      );

      setServerError(message);
      showError(message);
    } finally {
      setCreatingSale(false);
    }
  };

  const handleConfirmPayment = async (
    paymentAmount
  ) => {
    if (!createdSale) return;

    try {
      setPaymentLoading(true);

      const response = await createPayment({
        sale: createdSale._id,
        amount: paymentAmount,
        notes: "",
      });

      setCreatedSale(response.sale);
      setShowPaymentModal(false);

      showSuccess(
        t("sales.paymentSuccess")
      );

      if (
        response.sale.paymentStatus ===
        "paid"
      ) {
        navigate(
          `/add-dispense?sale=${response.sale._id}`
        );
      }
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        t("sales.paymentFailed")
      );

      setServerError(message);
      showError(message);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="sales-page container-fluid py-4">
      <div className="sales-header mb-4">
        <div>
          <h2 className="sales-title">
            {t("sales.newSale")}
          </h2>

          <p className="sales-subtitle">
            {t("sales.createNewMedicineSale")}
          </p>
        </div>

        <div className="sales-header-icon">
          <ReceiptText size={28} />
        </div>
      </div>

      {serverError && (
        <div className="alert alert-danger">
          {serverError}
        </div>
      )}

      <div className="sales-card mb-4">
        <div className="sales-card-header">
          <div className="sales-section-title">
            <UserRound size={20} />
            <span>{t("sales.customer")}</span>
          </div>
        </div>

        <div className="sales-card-body">
          <div className="row g-2 mb-4">
            <div className="col-12 col-md-4">
              <button
                type="button"
                className={`btn w-100 ${
                  customerType === "existing"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() =>
                  handleCustomerTypeChange(
                    "existing"
                  )
                }
              >
                <UserRound
                  size={17}
                  className="me-2"
                />
                {t("sales.existingPatient")}
              </button>
            </div>

            <div className="col-12 col-md-4">
              <button
                type="button"
                className={`btn w-100 ${
                  customerType === "new"
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() =>
                  handleCustomerTypeChange("new")
                }
              >
                <UserPlus
                  size={17}
                  className="me-2"
                />
                {t("sales.newPatient")}
              </button>
            </div>

            <div className="col-12 col-md-4">
              <button
                type="button"
                className={`btn w-100 ${
                  customerType === "walk-in"
                    ? "btn-secondary"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  handleCustomerTypeChange(
                    "walk-in"
                  )
                }
              >
                <UserX
                  size={17}
                  className="me-2"
                />
                {t("sales.walkInCustomer")}
              </button>
            </div>
          </div>

          {customerType === "existing" && (
            <>
              {patient ? (
                <div className="selected-patient">
                  <div className="patient-avatar">
                    <UserRound size={20} />
                  </div>

                  <div className="patient-details">
                    <strong>
                      {patient.name}
                    </strong>

                    <span>
                      {patient.phone ||
                        t("sales.noPhone")}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setPatient(null)
                    }
                  >
                    {t("sales.change")}
                  </button>
                </div>
              ) : (
                <div className="patient-selector">
                  <div className="patient-select-wrapper">
                    <div className="sales-input-icon">
                      <UserRound size={19} />
                    </div>

                    <input
                      type="text"
                      className="form-control sales-input"
                      placeholder={t(
                        "sales.searchPatientPlaceholder"
                      )}
                      value={patientSearch}
                      onChange={(e) =>
                        setPatientSearch(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {patientSearch.trim() && (
                    <div className="patient-search-results">
                      {filteredPatients.length >
                      0 ? (
                        filteredPatients.map(
                          (item) => (
                            <button
                              key={item._id}
                              type="button"
                              className="patient-search-item"
                              onClick={() =>
                                handleSelectPatient(
                                  item
                                )
                              }
                            >
                              <div className="patient-result-icon">
                                <UserRound
                                  size={18}
                                />
                              </div>

                              <div className="patient-result-info">
                                <strong>
                                  {item.name}
                                </strong>

                                <span>
                                  {item.phone ||
                                    t(
                                      "sales.noPhone"
                                    )}
                                </span>
                              </div>
                            </button>
                          )
                        )
                      ) : (
                        <div className="patient-no-results">
                          <UserRound
                            size={20}
                          />

                          <span>
                            {t(
                              "sales.noPatientsFound"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {customerType === "new" && (
            <div className="border rounded p-3">
              <h6 className="mb-3">
                {t("sales.createNewPatient")}
              </h6>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    {t("sales.patientName")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder={t(
                      "sales.patientNamePlaceholder"
                    )}
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient(
                        (prev) => ({
                          ...prev,
                          name: e.target.value,
                        })
                      )
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    {t("sales.phone")}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder={t(
                      "sales.phonePlaceholder"
                    )}
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient(
                        (prev) => ({
                          ...prev,
                          phone: e.target.value,
                        })
                      )
                    }
                  />
                </div>

                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={
                      handleCreateNewPatient
                    }
                    disabled={creatingPatient}
                  >
                    <UserPlus
                      size={17}
                      className="me-2"
                    />

                    {creatingPatient
                      ? t("sales.creating")
                      : t("sales.createPatient")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {customerType === "walk-in" && (
            <div className="alert alert-secondary d-flex align-items-center gap-2 mb-0">
              <UserX size={20} />

              <div>
                <strong>
                  {t("sales.walkInCustomer")}
                </strong>

                <div className="small">
                  {t(
                    "sales.walkInDescription"
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sales-card mb-4">
        <div className="sales-card-header">
          <div className="sales-section-title">
            <ScanBarcode size={20} />
            <span>
              {t("sales.scanMedicine")}
            </span>
          </div>
        </div>

        <div className="sales-card-body">
          <div className="scanner-box">
            <ScanBarcode
              size={42}
              strokeWidth={1.7}
            />

            <div>
              <h5>
                {t("sales.scanBarcodeTitle")}
              </h5>

              <p>
                {t("sales.scanBarcodeDescription")}
              </p>
            </div>

            <BarcodeScanner
              onScan={handleScan}
            />
          </div>

          <MedicineManualSelector
            onAdd={handleManualAdd}
          />
        </div>
      </div>

      <div className="sales-card mb-4">
        <div className="sales-card-header">
          <div className="sales-section-title">
            <ShoppingCart size={20} />
            <span>
              {t("sales.saleItems")}
            </span>

            <span className="cart-count">
              {cart.length}
            </span>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={clearCart}
            >
              <Trash2 size={16} />
              {t("sales.clearCart")}
            </button>
          )}
        </div>

        <div className="sales-card-body p-0">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart
                size={50}
                strokeWidth={1.3}
              />

              <h5>
                {t("sales.cartEmpty")}
              </h5>

              <p>
                {t(
                  "sales.emptyCartDescription"
                )}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table sales-table mb-0">
                <thead>
                  <tr>
                    <th>{t("sales.medicine")}</th>
                    <th>{t("sales.batch")}</th>
                    <th>{t("sales.expiry")}</th>
                    <th>{t("sales.price")}</th>
                    <th>{t("sales.quantity")}</th>
                    <th>{t("sales.total")}</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map((item) => (
                    <tr key={item.batch}>
                      <td>
                        <div className="medicine-cell">
                          <strong>
                            {item.name}
                          </strong>

                          {item.genericName && (
                            <span>
                              {item.genericName}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        {item.batchNumber}
                      </td>

                      <td>
                        {new Date(
                          item.expiryDate
                        ).toLocaleDateString(
                          locale
                        )}
                      </td>

                      <td>
                        {Number(
                          item.unitPrice
                        ).toFixed(2)}{" "}
                        {t("common.egp")}
                      </td>

                      <td>
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.batch
                              )
                            }
                            disabled={
                              item.quantity <= 1
                            }
                          >
                            <Minus size={15} />
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.batch
                              )
                            }
                            disabled={
                              item.quantity >=
                              item.availableQuantity
                            }
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <small className="text-muted d-block mt-1">
                          {t("sales.available")}:{" "}
                          {item.availableQuantity}
                        </small>
                      </td>

                      <td>
                        <strong>
                          {(
                            Number(
                              item.unitPrice
                            ) *
                            item.quantity
                          ).toFixed(2)}{" "}
                          {t("common.egp")}
                        </strong>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() =>
                            removeItem(
                              item.batch
                            )
                          }
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="sale-summary-wrapper">
        <div className="sale-summary">
          <div className="summary-row">
            <span>
              {t("sales.subtotal")}
            </span>

            <strong>
              {subtotal.toFixed(2)}{" "}
              {t("common.egp")}
            </strong>
          </div>

          <div className="summary-row discount-row">
            <span>
              {t("sales.discount")}
            </span>

            <div className="discount-input">
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) =>
                  setDiscount(
                    e.target.value
                  )
                }
              />

              <span>
                {t("common.egp")}
              </span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>
              {t("sales.total")}
            </span>

            <strong>
              {total.toFixed(2)}{" "}
              {t("common.egp")}
            </strong>
          </div>

          <div className="summary-actions">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              {t("common.cancel")}
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreateSale}
              disabled={
                cart.length === 0 ||
                creatingSale ||
                (customerType !==
                  "walk-in" &&
                  !patient)
              }
            >
              {creatingSale
                ? t("sales.creatingSale")
                : t("sales.createSale")}
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        show={showPaymentModal}
        sale={createdSale}
        loading={paymentLoading}
        onClose={() =>
          setShowPaymentModal(false)
        }
        onConfirm={
          handleConfirmPayment
        }
      />
    </div>
  );
};

export default Sales;
