import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../services/category.service";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { categoryInitialValues } from "../../initialValues/category.initial";
import { categorySchema } from "../../schemas/medicine/category.schema";


const AddCategory = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: categoryInitialValues,
    validationSchema: categorySchema,
    onSubmit: async (values, { setSubmitting }) => {
      const categories = [values]
      try {
        setServerError("");
        await createCategory({categories});
        navigate("/categories");

      } catch (error) {
        setServerError(
          error.response?.data?.message ||
            "Failed to create medicine"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Header
        title="Add category"
        description="Add a new category to the pharmacy"
        buttonContent={'back to categories'}
        buttonLink={'/categories'}
      />
      {serverError && ( <div className="alert alert-danger">{serverError} </div> )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit} >
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="name"
                  label="category Name"
                  type="text"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="description"
                  label="Description"
                  type="textarea"
                  placeholder="Enter category description"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() =>navigate("/categories") }
                disabled={ formik.isSubmitting }
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
                  : "Add Category"}
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default AddCategory;