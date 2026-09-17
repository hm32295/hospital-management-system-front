import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { getCategory } from "../../services/category.service";
import { medicineInitialValues } from "../../initialValues/medicine.initial";
import { medicineSchema } from "../../schemas/medicine/medicine.schema";
import { createMedicine } from "../../services/medicines.service";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";
const AddMedicine = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [serverError, setServerError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const fetchCategories = async (search = "") => {
    try {
      setLoadingCategories(true);
      const response = await getCategory({ search, isActive: true, page: 1, limit: 10 });
      console.log(response.categories);
      
      setCategories(response.categories || []);
    } catch (error) {
      console.error(error);
      setServerError(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoadingCategories(false);
    }
  };
  useEffect(() => {
    fetchCategories(" ");
  }, []);
  const formik = useFormik({
    initialValues: medicineInitialValues,
    validationSchema: medicineSchema,

    onSubmit: async (values, { setSubmitting }) => {
      const medicines = [values]
      try {
        setServerError("");
        await createMedicine({medicines});
        navigate("/medicines");

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
  const categoryOptions =
    categories.map((category) => ({
      value: category._id,
      label: category.name,
    }));
  return (
    <div>
      <Header
        title="Add Medicine"
        description="Add a new medicine to the pharmacy"
        buttonContent={'back to medicine'}
        buttonLink={'/medicines'}
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
                  label="Medicine Name"
                  type="text"
                  placeholder="Enter medicine name"
                  required
                />
              </div>
              {/* Generic Name */}

              <div className="col-12 col-md-6">

                <FormInput
                  formik={formik}
                  name="genericName"
                  label="Generic Name"
                  type="text"
                  placeholder="Enter generic name"
                  required
                />

              </div>
              {/* Category */}
              <div className="col-12 col-md-6">

                <FormSearchSelect
                  formik={formik}
                  name="category"
                  label="Category"
                  placeholder={loadingCategories ? "Loading categories...": "Search category..."}
                  options={categoryOptions}
                  serverSearch
                  onSearch={fetchCategories}
                  required
                />

              </div>
              {/* Manufacturer */}
              <div className="col-12 col-md-6">

                <FormInput
                  formik={formik}
                  name="manufacturer"
                  label="Manufacturer"
                  type="text"
                  placeholder="Enter manufacturer"
                  required
                />

              </div>

    
              {/* Description */}

              <div className="col-12">

                <FormInput
                  formik={formik}
                  name="description"
                  label="Description"
                  type="textarea"
                  placeholder="Enter medicine description"
                  rows={4}
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
                  navigate("/medicines")
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
                  : "Add Medicine"}
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default AddMedicine;