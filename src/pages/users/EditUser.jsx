
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import {
  getCurrentUser,
  updateUser,
} from "../../services/auth.service";
import { userSchema } from "../../schemas/medicine/user.schema";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userResponse = await getCurrentUser(id);

        setUser(userResponse.user);
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("users.loadFailed")
          )
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
      isActive: user?.isActive ?? true,
    },
    validationSchema: userSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateUser(id, values);

        showSuccess(t("users.updatedSuccess"));

        navigate("/users");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("users.updateFailed")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const roles = [
    "admin",
    "doctor",
    "pharmacist",
    "nurse",
    "patient",
    "lab_technician",
    "receptionist",
  ].map((role) => ({
    value: role,
    label: role,
  }));

  if (loading) {
    return (
      <div>
        <Header
          title={t("users.editUser")}
          description={t("users.editUserDescription")}
          buttonContent={t("users.backToUsers")}
          buttonLink="/users"
        />

        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <div className="d-flex justify-content-center">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  {t("common.loading")}
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
        title={t("users.editUser")}
        description={t("users.editUserDescription")}
        buttonContent={t("users.backToUsers")}
        buttonLink="/users"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="name"
                  label={t("users.userName")}
                  type="text"
                  placeholder={t("users.userNamePlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="email"
                  label={t("users.email")}
                  type="email"
                  placeholder={t("users.emailPlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSelect
                  formik={formik}
                  name="isActive"
                  label={t("users.status")}
                  options={[
                    {
                      value: true,
                      label: t("users.active"),
                    },
                    {
                      value: false,
                      label: t("users.inactive"),
                    },
                  ]}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSelect
                  formik={formik}
                  name="role"
                  label={t("users.role")}
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
                disabled={formik.isSubmitting}
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? t("users.updating")
                  : t("users.updateUser")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;