import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { stockTransactionInitialValues } from "../../initialValues/stockTransaction.initial";
import { stockTransactionSchema } from "../../schemas/stockTransaction.schema";
import { createStockTransaction } from "../../services/stockTransactions.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import { getMedicines } from "../../services/medicines.service";
import { getBatches } from "../../services/batches.service";
import FormSelect from "../../components/form/FormSelect";


const AddStockTransaction = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMedicine, setLoadingMedicine] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [batch, setBatch] = useState([]);
    const fetchBatch = async () => {
        setLoadingBatch(true)
        try {
            const response = await getBatches();
            const handelResponse = response.batches.filter(batch => {
                return batch.isActive 
            })
            setBatch(handelResponse)
            
        } catch (error) {
            console.log(error);
            
        } finally {
            setLoadingBatch(false)
        }
    }    
    const fetchMedicine = async () => {
        setLoadingMedicine(true)
        try {
            const response = await getMedicines();
         const handelResponse = response.medicines.filter(medicine => {
                return medicine.isActive 
            })
            setMedicines(handelResponse)
            
        } catch (error) {
            console.log(error);
            
        } finally {
            setLoadingMedicine(false)
        }
    }    
    
    
  const formik = useFormik({
    initialValues: stockTransactionInitialValues,
    validationSchema: stockTransactionSchema,
      onSubmit: async (values, { setSubmitting }) => {
          
        setLoading(true)
      try {
        setServerError("");
        await createStockTransaction(values);
        navigate("/stock-transaction");

      } catch (error) {
        setServerError(
          error.response?.data?.message ||
            "Failed to create Stock Transaction"
        );
      } finally {
          setSubmitting(false);
          setLoading(false)
      }
    },
  });

    useEffect(() => {
        fetchMedicine()
        fetchBatch()
    },[])
    const medicineOptions=
         medicines?.map(medicine => {
            return {value: medicine._id, label: medicine.name,}
        })
    const batchOption = batch.map(batch => {
        return {value:batch._id ,label :batch.batchNumber}
    })
    // ["IN", "OUT"]
  return (
    <div>
      <Header
        title="Add Stock Transaction"
        description="Add a new Stock Transaction to the pharmacy"
        buttonContent={'back to Stock Transactions'}
        buttonLink={'/stock-transaction'}
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
                <FormInput
                  formik={formik}
                  name="reason"
                  label="reason"
                  type="text"
                  placeholder="Enter reason"
                  required
                />
                </div>
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="quantity"
                  label="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  required
                />
                </div>
                          
           
              <div className="col-12 col-md-6">

                  <FormSelect
                    formik={formik}
                    name="type"
                    label="type"
                    options={[
                      {
                        value: 'IN',
                        label: "IN",
                      },
                      {
                        value: "OUT",
                        label: "OUT",
                      },
                    ]}
                    required
                  />

                </div>
            <div className="col-12 col-md-6">
                <FormSearchSelect
                    formik = {formik}
                    name = 'batch'
                    label='medicine batch'
                    placeholder={
                        loadingBatch
                        ? "Loading batch..."
                        : "Search batch..."
                    }
                    options={batchOption}
                    disabled={loadingBatch}
                    required
                />
            </div>  
            <div className="col-12 col-md-6">
                <FormSearchSelect
                    formik = {formik}
                    name = 'medicine'
                    label='medicine'
                    placeholder={
                        loadingMedicine
                        ? "Loading Medicine..."
                        : "Search Medicine..."
                    }
                    options={medicineOptions}
                    disabled={loadingMedicine}
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
                  navigate("/stock-transaction")
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
                  formik.isSubmitting || loading
                }
              >
                {formik.isSubmitting
                  ? "Adding..."
                  : "Add Stock Transaction"}
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default AddStockTransaction;