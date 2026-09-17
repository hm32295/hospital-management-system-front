import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { supplierSchema } from "../../schemas/supplire.schema";
import { supplierInitialValues } from "../../initialValues/supplier.initial";
import { createSupplier } from "../../services/supplier.service";


const AddSupplier = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: supplierInitialValues,
    validationSchema: supplierSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");
        await createSupplier(values);
        navigate("/suppliers");

      } catch (error) {
        setServerError(
          error.response?.data?.message ||
            "Failed to create supplier"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Header
        title="Add Supplier"
        description="Add a new Supplier to the pharmacy"
        buttonContent={'back to suppliers'}
        buttonLink={'/suppliers'}
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
                  name="name"
                  label="Supplier Name"
                  type="text"
                  placeholder="Enter Supplier name"
                  required
                />
                </div>
                          
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="email"
                  label="email"
                  type="email"
                  placeholder="Enter Supplier email"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="phone"
                  label="Supplier phone"
                  type="text"
                  placeholder="Enter Supplier phone"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="address"
                  label="Supplier address"
                  type="text"
                  placeholder="Enter Supplier address"
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
                  navigate("/suppliers")
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
                  ? "Adding..."
                  : "Add Supplier"}
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default AddSupplier;