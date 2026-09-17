import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { batchesSchema } from "../../schemas/batches.schema";
import { getBatchById, updateBatch } from "../../services/batches.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import { getMedicines } from "../../services/medicines.service";
import FormSelect from "../../components/form/FormSelect";


const EditBatches = () => {
      const { id } = useParams();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const [loadingMedicine ,setLoadingMedicine] = useState(false)
    const [medicines, setMedicines] = useState([])
    const [batchSingle, setBatchSingle] = useState(null)
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
            batchNumber: batchSingle?.batchNumber || "",
            purchasePrice: batchSingle?.purchasePrice || 0,
            quantity: batchSingle?.quantity || 0,
            expiryDate:batchSingle?.expiryDate ? batchSingle.expiryDate.split("T")[0]: "",
            sellingPrice: batchSingle?.sellingPrice || 0,
          medicine: batchSingle?.medicine?._id || batchSingle?.medicine || "",
             isActive:batchSingle?.isActive ?? true,

            },
    validationSchema: batchesSchema,
        onSubmit: async (values, { setSubmitting }) => {
        
      try {
        setServerError("");
        await updateBatch(id,values);
        navigate("/batches");

      } catch (error) {
        setServerError(
          error.response?.data?.message ||
            "Failed to update Batches"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

    
    const fetchMedicine = async () => {
        setLoadingMedicine(true)
        try {
            const response = await getMedicines()
            setMedicines(response.medicines)
            
        } catch (error) {
            console.log(error);
            
        } finally {
            setLoadingMedicine(false)
            
        }
    }
    const fetchBatchSingle = async () => {
        setLoadingMedicine(true)
        try {
            const response = await getBatchById(id)
            setBatchSingle(response.batch)
            console.log(response.batch);
            
        } catch (error) {
            console.log(error);
            
        } finally {
            setLoadingMedicine(false)
            
        }
    }

    useEffect(() => {
        fetchMedicine()
        fetchBatchSingle()
    },[])
    const medicineOptions =
        medicines.map((medicine) => ({
        value: medicine._id,
        label: medicine.name,
    }));
  return (
    <div>
      <Header
        title="update Batches"
        description="update a Batches to the pharmacy"
        buttonContent={'back to Batches'}
        buttonLink={'/batches'}
      />

      {serverError && (
        <div className="alert alert-danger">
          {serverError}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form
            onSubmit={formik.handleSubmit}
          >
            <div className="row g-4">

            <div className="col-12 col-md-6">
                <FormSearchSelect
                    formik = {formik}
                    name = 'medicine'
                    label='medicine'
                    placeholder={
                        loadingMedicine
                        ? "Loading Medicine..."
                        : "Search category..."
                    }
                    options={medicineOptions}
                    disabled={loadingMedicine}
                    required
                />
            </div>                  
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="batchNumber"
                  label="batch Number"
                  type="text"
                  placeholder="Enter batch Number"
                  required
                />
                </div>
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="expiryDate"
                  label="expiry Date"
                  type="date"
                  placeholder="Enter expiryDate"
                  required
                />
                </div>
                          
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="quantity"
                  label="quantity"
                  type="number"
                  placeholder="Enter Batches quantity"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <FormInput
                    formik={formik}
                    name="sellingPrice"
                    label="selling Price"
                    type="text"
                    placeholder="Enter selling Price"
                    required
                />
            </div>
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="purchasePrice"
                  label="purchase Price"
                  type="text"
                  placeholder="Enter purchase Price"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                  <FormSelect
                    formik={formik}
                    name="isActive"
                    label="Status"
                    options={[
                      { value: true,label: "Active" },
                      { value: false,label: "Inactive" },
                    ]}
                    required
                  />
              </div>

    

            </div>

            {/* Buttons */}

            <div className="d-flex justify-content-end gap-2 mt-4">

              <button
                type="button"
                className="btn btn-light border"
                onClick={() =>
                  navigate("/batches")
                }
                disabled={
                  formik.isSubmitting
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  formik.isSubmitting
                }
              >
                {formik.isSubmitting
                  ? "updating..."
                  : "update Batches"}
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default EditBatches;