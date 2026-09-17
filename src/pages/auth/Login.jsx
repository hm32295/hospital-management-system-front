import { useState } from "react";
import { useFormik } from "formik";

import FormInput from "../../components/form/FormInput";

import { loginSchema } from "../../schemas/auth/login.schema";
import { loginInitialValues } from "../../initialValues/auth/login.initial";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {login} = useAuth()
  const [serverError, setServerError] = useState("");
  const navigation = useNavigate()


  const onSubmit =async (values, { setSubmitting }) => {
      try {
        setServerError("");
        await login(values);
        navigation('/')
      } catch (error) {
        setServerError(
          error.response?.data?.message ||
            "Something went wrong"
        );
      } finally {
        setSubmitting(false);
      }
  }
  
    const formik = useFormik({
      initialValues: loginInitialValues,
      validationSchema: loginSchema,
      onSubmit,
    });


  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">

        {/* Left Side */}
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-primary text-white">
          <div className="text-center px-5">
            <h1 className="fw-bold mb-3">
              Hospital Management System
            </h1>

            <p className="lead">
              Manage your pharmacy and hospital
              operations efficiently.
            </p>
          </div>
        </div>

        {/* Login Side */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
          <div
            className="w-100 px-4"
            style={{ maxWidth: "450px" }}
          >

            <div className="text-center mb-4">
              <h2 className="fw-bold">
                Welcome Back
              </h2>

              <p className="text-muted">
                Login to your account
              </p>
            </div>

            {/* Server Error */}
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
                label="Email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />

              <FormInput
                formik={formik}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="submit"
                className="btn btn-primary w-100 mt-2"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;