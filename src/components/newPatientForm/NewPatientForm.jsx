
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { createPatient } from "../../services/patients.service";
import { showSuccess, showError } from "../../services/toast.service";

const NewPatientForm = ({ onPatientCreated, onCancel }) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      nationalId: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await createPatient(values);

        if (!response.success) {
          throw new Error(
            response.message || t("patients.createFailed")
          );
        }

        showSuccess(t("patients.createdSuccessfully"));

        onPatientCreated(response.patient);
        resetForm();
      } catch (error) {
        const existingPatient = error.response?.data?.patient;

        if (existingPatient) {
          onPatientCreated(existingPatient);
          onCancel();
        }

        showError(
          error.response?.data?.message ||
            error.message ||
            t("patients.createFailed")
        );
      }
    },
  });

  return (
    <div className="border rounded p-3 mb-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{t("patients.newPatient")}</h5>

        <button
          type="button"
          className="btn-close"
          onClick={onCancel}
          disabled={formik.isSubmitting}
          aria-label={t("common.close")}
        />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">
              {t("patients.name")}{" "}
              <span className="text-danger">*</span>
            </label>

            <input
              type="text"
              name="name"
              className="form-control"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {t("patients.phone")}
            </label>

            <input
              type="text"
              name="phone"
              className="form-control"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {t("patients.nationalId")}
            </label>

            <input
              type="text"
              name="nationalId"
              className="form-control"
              value={formik.values.nationalId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {t("patients.dateOfBirth")}
            </label>

            <input
              type="date"
              name="dateOfBirth"
              className="form-control"
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {t("patients.gender")}
            </label>

            <select
              name="gender"
              className="form-select"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            >
              <option value="">
                {t("patients.selectGender")}
              </option>
              <option value="male">
                {t("patients.male")}
              </option>
              <option value="female">
                {t("patients.female")}
              </option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {t("patients.email")}
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">
              {t("patients.address")}
            </label>

            <textarea
              name="address"
              className="form-control"
              rows="2"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            />
          </div>

          <div className="col-12 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? t("patients.creating")
                : t("patients.createPatient")}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={formik.isSubmitting}
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPatientForm;
