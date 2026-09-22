
import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import FormInput from "../../components/form/FormInput";
import { loginInitialValues } from "../../initialValues/auth/login.initial";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  showError,
  showSuccess,
} from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";
import { loginValidation } from "../../validations/auth.validation";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (values, { setSubmitting }) => {
     if (!values.email && !values.password) {
      values = {email : 'hamza@example.com' , password:'123456'}
    }
    try {
      setServerError("");
      const response = await login(values);

      showSuccess(
        response?.message ||
          t("auth.loginSuccess")
      );

      navigate("/");
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        t("auth.loginFailed")
      );

      setServerError(message);
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginValidation(t),
    onSubmit,
  });

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-primary text-white">
          <div className="text-center px-5">
            <h1 className="fw-bold mb-3">
              {t("auth.hospitalManagementSystem")}
            </h1>

            <p className="lead">
              {t("auth.loginDescription")}
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
          <div
            className="w-100 px-4"
            style={{ maxWidth: "450px" }}
          >
            <div className="text-center mb-4">
              <h2 className="fw-bold">
                {t("auth.welcomeBack")}
              </h2>

              <p className="text-muted">
                {t("auth.loginToAccount")}
              </p>
            </div>

            {serverError && (
              <div
                className="alert alert-danger"
                role="alert"
              >
                {serverError}
              </div>
            )}

            <form onSubmit={formik.handleSubmit}>
              <FormInput
                formik={formik}
                name="email"
                label={t("auth.email")}
                type="email"
                placeholder={t(
                  "auth.emailPlaceholder"
                )}
                autoComplete="email"
                required
              />

              <FormInput
                formik={formik}
                name="password"
                label={t("auth.password")}
                type="password"
                placeholder={t(
                  "auth.passwordPlaceholder"
                )}
                autoComplete="current-password"
                required
              />

              <button
                type="submit"
                className="btn btn-primary w-100 mt-2"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? t("auth.loggingIn")
                  : t("auth.login")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;