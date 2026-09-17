import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { getMedicineById, updateMedicine } from "../../services/medicines.service";
import { getCategory } from "../../services/category.service";
import { medicineSchema } from "../../schemas/medicine/medicine.schema";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import FormSelect from "../../components/form/FormSelect";

const EditMedicine = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  // States
  const [medicine, setMedicine] =  useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [serverError, setServerError] =useState("");


  // Get Medicine + Categories

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setServerError("");
        const medicineResponse =await getMedicineById(id);
        const medicineData = medicineResponse.medicine;
        
        setMedicine(medicineData);
        setLoadingCategories(true);
        const categoryResponse =await getCategory();
        setCategories(categoryResponse.categories || [] );

      } catch (error) {
        console.error(error);
        setServerError(
          error.response?.data?.message ||
            "Failed to load medicine"
        );

      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }

    };

    if (id) {
      fetchData();
    }

  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: medicine?.name || "",
      genericName: medicine?.genericName || "",
      category: medicine?.category?._id || medicine?.category ||"",
      manufacturer:  medicine?.manufacturer || "",
      description: medicine?.description || "",
      isActive:medicine?.isActive ?? true,
    },
    validationSchema:medicineSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");
        await updateMedicine(id,values  );
        navigate("/medicines");
      } catch (error) {
        console.error(error);
        setServerError(
          error.response?.data?.message ||
            "Failed to update medicine"
        );
      } finally {
        setSubmitting(false);
      }

    },

  });

  const categoryOptions = categories.map((category) => (
    { value: category._id, label: category.name }
  ));
  if (loading) {

    return (
      <div>
        <Header
          title="Edit Medicine"
          description="Update medicine information"
          buttonContent= 'back to medicine'
          buttonLink='/medicines'
        />
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <div className="d-flex justify-content-center">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (

    <div>
      <Header
        title="Edit Medicine"
        description="Update medicine information"
        buttonContent= 'back to medicine'
        buttonLink='/medicines'
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

                <FormInput
                  formik={formik}
                  name="name"
                  label="Medicine Name"
                  type="text"
                  placeholder="Enter medicine name"
                  required
                />
              </div>
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
              

              <div className="col-12 col-md-6">

                  <FormSelect
                    formik={formik}
                    name="isActive"
                    label="Status"
                    options={[
                      {
                        value: true,
                        label: "Active",
                      },
                      {
                        value: false,
                        label: "Inactive",
                      },
                    ]}
                    required
                  />

                </div>


              <div className="col-12 col-md-6">
                <FormSearchSelect
                  formik={formik}
                  name="category"
                  label="Category"
                  placeholder={
                    loadingCategories
                      ? "Loading categories..."
                      : "Search category..."
                  }
                  options={
                    categoryOptions
                  }
                  disabled={
                    loadingCategories
                  }
                  required
                />

              </div>
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
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/medicines")}
                disabled={formik.isSubmitting }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  formik.isSubmitting ||
                  loadingCategories
                }
              >
                {formik.isSubmitting
                  ? "Updating..."
                  : "Update Medicine"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

};


export default EditMedicine;