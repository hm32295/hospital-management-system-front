
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { CheckCircle2 } from "lucide-react";

import Header from "../../components/header/Header";
import AdminDataPage from "../../components/table/AdminDataPage";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";

import {
  createDispensing,
  getAvailableSalesForDispensing,
} from "../../services/dispensed.service";

const AddDispensed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const saleId = searchParams.get("sale");

  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);

  const formik = useFormik({
    initialValues: {
      sale: saleId || "",
      reason: "",
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");

        if (!selectedSale) {
          setServerError("Please select a sale");
          return;
        }

        if (!values.reason.trim()) {
          setServerError("Dispensing reason is required");
          return;
        }

        const response = await createDispensing({
          sale: values.sale,
          reason: values.reason.trim(),
        });

        console.log("Dispensing created:", response);

        navigate("/dispenses");
      } catch (error) {
        console.error("Create dispensing error:", error);

        setServerError(
          error.response?.data?.message ||
            "Failed to create dispensing"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchSales = async () => {
      setSalesLoading(true);
      setServerError("");

      try {
        const response =
          await getAvailableSalesForDispensing();

        setSales(response?.sales || []);
      } catch (error) {
        console.error(
          "Failed to load sales:",
          error
        );

        setServerError(
          error.response?.data?.message ||
            "Failed to load sales"
        );
      } finally {
        setSalesLoading(false);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    if (!saleId || sales.length === 0) {
      return;
    }

    const sale = sales.find(
      (item) => item._id === saleId
    );

    if (!sale) {
      setServerError(
        "This sale is not available for dispensing"
      );
      return;
    }

    setSelectedSale(sale);

    formik.setFieldValue(
      "sale",
      sale._id
    );
  }, [saleId, sales]);

  const salesOptions = sales.map((sale) => ({
    value: sale._id,
    label: `Sale #${sale._id.slice(-6)} - ${
      sale.patient?.name || "No Patient"
    } - ${Number(sale.totalAmount).toFixed(2)} EGP`,
  }));

  const handleSaleChange = (selectedSaleId) => {
    formik.setFieldValue(
      "sale",
      selectedSaleId
    );

    const sale = sales.find(
      (item) => item._id === selectedSaleId
    );

    setSelectedSale(sale || null);
  };

  const medicineColumns = [
    {
      key: "medicine",
      label: "Medicine",
      render: (item) => (
        <div className="fw-semibold">
          {item.medicine?.name || "-"}

          {item.medicine?.genericName && (
            <div className="text-muted small">
              {item.medicine.genericName}
            </div>
          )}
        </div>
      ),
    },

    {
      key: "batch",
      label: "Batch",
      render: (item) =>
        item.batch?.batchNumber || "-",
    },

    {
      key: "expiryDate",
      label: "Expiry",
      render: (item) =>
        item.batch?.expiryDate
          ? new Date(
              item.batch.expiryDate
            ).toLocaleDateString("en-GB")
          : "-",
    },

    {
      key: "quantity",
      label: "Quantity",
      render: (item) => (
        <span className="badge text-bg-primary">
          {item.quantity}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Header
        title="Add Dispensing"
        description="Dispense medicines from a completed sale"
      />

      {serverError && (
        <div className="alert alert-danger">
          {serverError}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12">
                <FormSearchSelect
                  formik={formik}
                  name="sale"
                  label="Sale"
                  placeholder={
                    salesLoading
                      ? "Loading paid sales..."
                      : "Search completed sale..."
                  }
                  options={salesOptions}
                  disabled={
                    salesLoading || !!saleId
                  }
                  required
                  onChange={handleSaleChange}
                />
              </div>

              {selectedSale && (
                <>
                  <div className="col-12">
                    <div className="alert alert-success d-flex align-items-center gap-2 mb-0">
                      <CheckCircle2 size={20} />

                      <div>
                        <strong>
                          Sale is fully paid
                        </strong>

                        <div className="small">
                          This sale is ready for dispensing.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card border h-100">
                      <div className="card-body">
                        <h6 className="mb-3">
                          Patient
                        </h6>

                        <div className="fw-semibold">
                          {selectedSale.patient?.name ||
                            "No patient"}
                        </div>

                        <div className="text-muted small">
                          {selectedSale.patient?.phone ||
                            "No phone"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card border h-100">
                      <div className="card-body">
                        <h6 className="mb-3">
                          Sale Summary
                        </h6>

                        <div className="d-flex justify-content-between">
                          <span>Total</span>

                          <strong>
                            {Number(
                              selectedSale.totalAmount
                            ).toFixed(2)}{" "}
                            EGP
                          </strong>
                        </div>

                        <div className="d-flex justify-content-between mt-2">
                          <span>Paid</span>

                          <strong className="text-success">
                            {Number(
                              selectedSale.paidAmount
                            ).toFixed(2)}{" "}
                            EGP
                          </strong>
                        </div>

                        {selectedSale.prescription && (
                          <div className="d-flex justify-content-between mt-2">
                            <span>
                              Prescription
                            </span>

                            <span className="badge text-bg-info">
                              {
                                selectedSale
                                  .prescription
                                  .status
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <AdminDataPage
                      title="Medicines"
                      subtitle="Medicines included in this sale"
                      loading={false}
                      data={
                        selectedSale.items || []
                      }
                      columns={medicineColumns}
                      emptyMessage="No medicines found"
                    />
                  </div>
                </>
              )}

              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="reason"
                  label="Dispensing Reason"
                  type="text"
                  placeholder="Enter dispensing reason"
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() =>
                  navigate("/dispenses")
                }
                disabled={formik.isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  formik.isSubmitting ||
                  !selectedSale ||
                  !formik.values.reason.trim()
                }
              >
                {formik.isSubmitting
                  ? "Dispensing..."
                  : "Confirm Dispensing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDispensed;
