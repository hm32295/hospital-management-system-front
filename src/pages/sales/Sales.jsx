
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Sales = () => {
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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(response.patients || []);
      } catch (error) {
        console.error("Failed to load patients:", error);
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
        console.error("Failed to load batches:", error);
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
      setServerError("Patient name is required");
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
        throw new Error("Patient was not created");
      }

      setPatient(createdPatient);
      setPatients((prev) => [createdPatient, ...prev]);
      setCustomerType("existing");
      setNewPatient({
        name: "",
        phone: "",
      });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Failed to create patient"
      );
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
          existingItem.quantity >= availableQuantity
        ) {
          console.error(
            "Cannot exceed available quantity"
          );
          return prev;
        }

        const quantity = existingItem.quantity + 1;

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
      console.error("Invalid medicine QR code");
      return;
    }

    const scannedBatch = batches.find(
      (batch) => batch._id === medicineData.batch
    );

    if (!scannedBatch) {
      console.error("Batch not found");
      return;
    }

    if (!scannedBatch.isActive) {
      console.error("This batch is inactive");
      return;
    }

    if (
      new Date(scannedBatch.expiryDate) <
      new Date()
    ) {
      console.error(
        "This medicine batch has expired"
      );
      return;
    }

    if (Number(scannedBatch.quantity) <= 0) {
      console.error("This batch is out of stock");
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
    if (!medicine?.medicine || !medicine?.batch) {
      console.error("Invalid medicine data");
      return;
    }

    if (Number(medicine.availableQuantity) <= 0) {
      console.error("This batch is out of stock");
      return;
    }

    if (
      medicine.expiryDate &&
      new Date(medicine.expiryDate) < new Date()
    ) {
      console.error(
        "This medicine batch has expired"
      );
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
          item.quantity >= item.availableQuantity
        ) {
          console.error(
            "Cannot exceed available quantity"
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

          const quantity = item.quantity - 1;

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
      Number(item.unitPrice) * item.quantity,
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
      setServerError("Please select a patient");
      return;
    }

    if (
      customerType === "new" &&
      !patient
    ) {
      setServerError(
        "Please create the new patient first"
      );
      return;
    }

    if (cart.length === 0) {
      setServerError("Cart is empty");
      return;
    }

    if (discountValue > subtotal) {
      setServerError(
        "Discount cannot be greater than subtotal"
      );
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
    } catch (error) {
      console.error(
        "Create sale error:",
        error.response?.data || error
      );

      setServerError(
        error.response?.data?.message ||
          "Failed to create sale"
      );
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

      if (
        response.sale.paymentStatus === "paid"
      ) {
        navigate(
          `/add-dispense?sale=${response.sale._id}`
        );
      }
    } catch (error) {
      console.error(
        "Payment error:",
        error.response?.data || error
      );

      setServerError(
        error.response?.data?.message ||
          "Failed to process payment"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="sales-page container-fluid py-4">
      <div className="sales-header mb-4">
        <div>
          <h2 className="sales-title">
            New Sale
          </h2>

          <p className="sales-subtitle">
            Create a new medicine sale
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
            <span>Customer</span>
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
                Existing Patient
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
                New Patient
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
                Walk-in Customer
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
                        "No phone"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setPatient(null)
                    }
                  >
                    Change
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
                      placeholder="Search patient by name or phone..."
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
                                    "No phone"}
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
                            No patients found
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
                Create New Patient
              </h6>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Patient Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter patient name"
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
                    Phone
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter phone number"
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
                      ? "Creating..."
                      : "Create Patient"}
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
                  Walk-in Customer
                </strong>

                <div className="small">
                  This sale will not be linked
                  to a registered patient.
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
            <span>Scan Medicine</span>
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
                Scan Barcode / QR Code
              </h5>

              <p>
                Scan the medicine code to add
                it to the sale.
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
            <span>Sale Items</span>

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
              Clear Cart
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

              <h5>Cart is empty</h5>

              <p>
                Scan a medicine barcode or add
                medicine manually.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table sales-table mb-0">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Batch</th>
                    <th>Expiry</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
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
                          "en-GB"
                        )}
                      </td>

                      <td>
                        {Number(
                          item.unitPrice
                        ).toFixed(2)}
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
                          Available:{" "}
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
                          ).toFixed(2)}
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
            <span>Subtotal</span>

            <strong>
              {subtotal.toFixed(2)} EGP
            </strong>
          </div>

          <div className="summary-row discount-row">
            <span>Discount</span>

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

              <span>EGP</span>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              {total.toFixed(2)} EGP
            </strong>
          </div>

          <div className="summary-actions">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              Cancel
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
                ? "Creating Sale..."
                : "Create Sale"}
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
