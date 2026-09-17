import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { batchesInitialValues } from "../../initialValues/batches.initial";
import { batchesSchema } from "../../schemas/batches.schema";
import { createBatch } from "../../services/batches.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import { getMedicines } from "../../services/medicines.service";

const AddBatches = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loadingMedicine, setLoadingMedicine] = useState(false);
  const [medicines, setMedicines] = useState([]);

  const formik = useFormik({
    initialValues: batchesInitialValues,
    validationSchema: batchesSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");
        await createBatch(values);

        navigate("/batches");
      } catch (error) {
        setServerError(
          error.response?.data?.message ||
            "Failed to create batch"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchMedicine = async (search = "") => {
    try {
      setLoadingMedicine(true);

      const response = await getMedicines({
        search,
        isActive: true,
        limit: 10,
        page: 1,
      });

      setMedicines(response.medicines || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMedicine(false);
    }
  };

  const medicineOptions = medicines.map((medicine) => ({
    value: medicine._id,
    label: medicine.name,
  }));

  return (
    <div>
      <Header
        title="Add Batch"
        description="Add a new batch to the pharmacy"
        buttonContent="Back to Batches"
        buttonLink="/batches"
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
              <div className="col-12 col-md-6">
                <FormSearchSelect
                  formik={formik}
                  name="medicine"
                  label="Medicine"
                  placeholder="Search medicine..."
                  options={medicineOptions}
                  required
                  serverSearch
                  onSearch={fetchMedicine}
                  loading={loadingMedicine}
                  minSearchLength={2}
                  debounceDelay={400}
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="batchNumber"
                  label="Batch Number"
                  type="text"
                  placeholder="Enter batch number"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="expiryDate"
                  label="Expiry Date"
                  type="date"
                  placeholder="Enter expiry date"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="quantity"
                  label="Quantity"
                  type="number"
                  placeholder="Enter batch quantity"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="sellingPrice"
                  label="Selling Price"
                  type="number"
                  placeholder="Enter selling price"
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="purchasePrice"
                  label="Purchase Price"
                  type="number"
                  placeholder="Enter purchase price"
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/batches")}
                disabled={formik.isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Adding..." : "Add Batch"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBatches;