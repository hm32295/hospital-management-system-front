import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import { getCurrentUser, updateUser } from "../../services/auth.service";
import { userSchema } from "../../schemas/medicine/user.schema";

const EditUser = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  // States
  const [user, setUser] =  useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] =useState("");


  // Get Medicine + Categories

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setServerError("");
        const userResponse =await getCurrentUser(id);
        console.log(userResponse);
        const userData = userResponse.user;
        
        setUser(userData);
      } catch (error) {
        console.error(error);
        setServerError(
          error.response?.data?.message ||
            "Failed to load user"
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
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
      isActive:user?.isActive ?? true,
    },
    validationSchema:userSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");
        await updateUser(id,values  );
        navigate("/users");
      } catch (error) {
        console.error(error);
        setServerError(
          error.response?.data?.message ||
            "Failed to update user"
        );
      } finally {
        setSubmitting(false);
      }

    },

  });

    const roles = ["admin", "doctor", "pharmacist", "nurse", "patient", "lab_technician", "receptionist",].map(role => {
    return {value : role ,label:role}
})
  if (loading) {

    return (
      <div>
        <Header
          title="Edit user"
          description="Update user information"
          buttonContent= 'back to users'
          buttonLink='/users'
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
        title="Edit user"
        description="Update user information"
        buttonContent= 'back to users'
        buttonLink='/users'
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
                  label="user Name"
                  type="text"
                  placeholder="Enter medicine name"
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="email"
                  label="email"
                  type="email"
                  placeholder="Enter email user"
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

                  <FormSelect
                    formik={formik}
                    name="role"
                    label="role"
                    options={roles}
                    required
                  />

                </div>



            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/users")}
                disabled={formik.isSubmitting }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={ formik.isSubmitting}
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


export default EditUser;