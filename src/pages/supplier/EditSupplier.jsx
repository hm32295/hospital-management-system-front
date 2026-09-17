import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import { getSupplierById, updateSupplier } from "../../services/supplier.service";
import { supplierSchema } from "../../schemas/supplire.schema";

const EditSupplier = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  // States
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] =useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setServerError("");
        const supplierResponse =await getSupplierById(id);
        setSupplier(supplierResponse.supplier);
      } catch (error) {
        console.error(error);
        setServerError(
          error.response?.data?.message ||
            "Failed to load Supplier"
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
      name: supplier?.name || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      address: supplier?.address || "",
      isActive: supplier?.isActive ?? true,
    },
    validationSchema:supplierSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");
        await updateSupplier(id,values  );
        navigate("/suppliers");
      } catch (error) {
        console.error(error);
        setServerError(
          error.response?.data?.message ||
            "Failed to update Supplier"
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
          title="Edit Supplier"
          description="Update Supplier information"
          buttonContent= 'back to Supplier'
          buttonLink='/suppliers'
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
        title="Edit Supplier"
        description="Update Supplier information"
        buttonContent= 'back to Supplier'
        buttonLink='/suppliers'
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
                  label="Supplier Name"
                  type="text"
                  placeholder="Enter Supplier name"
                  required
                />
                              
                <FormInput
                  formik={formik}
                  name="phone"
                  label="Supplier phone"
                  type="text"
                  placeholder="Enter Supplier phone"
                  required
                />
                              
                <FormInput
                  formik={formik}
                  name="address"
                  label="Supplier address"
                  type="text"
                  placeholder="Enter Supplier address"
                  required
                />
                              
                <FormInput
                  formik={formik}
                  name="email"
                  label="Supplier email"
                  type="text"
                  placeholder="Enter Supplier email"
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


            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/suppliers")}
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
                  : "Update Supplier"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

};


export default EditSupplier;