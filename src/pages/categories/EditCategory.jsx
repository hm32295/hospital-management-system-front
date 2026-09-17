import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../services/category.service";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import { categorySchema } from "../../schemas/medicine/category.schema";

const EditCategory = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  // States
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] =useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setServerError("");
        const categoryResponse =await getCategoryById(id);
        const categoryData = categoryResponse.category;
        setCategory(categoryData);
      } catch (error) {
        console.error(error);
        setServerError(
          error.response?.data?.message ||
            "Failed to load category"
        );

      } finally {
        setLoading(false);
      }

    };

    if (id) {
      fetchData();
    }

  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
      isActive: category?.isActive ?? true,
    },
    validationSchema:categorySchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");
        await updateCategory(id,values  );
        navigate("/categories");
      } catch (error) {
        console.error(error);
        setServerError(
          error.response?.data?.message ||
            "Failed to update category"
        );
      } finally {
        setSubmitting(false);
      }

    },

  });

  if (loading) {

    return (
      <div>
        <Header
          title="Edit category"
          description="Update category information"
          buttonContent= 'back to category'
          buttonLink='/categories'
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
        title="Edit category"
        description="Update category information"
        buttonContent= 'back to category'
        buttonLink='/categories'
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
                  label="category Name"
                  type="text"
                  placeholder="Enter category name"
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
                onClick={() => navigate("/categories")}
                disabled={formik.isSubmitting }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting || loading}
              >
                {formik.isSubmitting
                  ? "Updating..."
                  : "Update category"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

};


export default EditCategory;