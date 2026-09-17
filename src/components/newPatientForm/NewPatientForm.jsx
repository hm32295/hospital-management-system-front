import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { createPatient } from "../../services/patients.service";

const NewPatientForm = ({ onPatientCreated, onCancel }) => {
  const { enqueueSnackbar } = useSnackbar();

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
            response.message || "Failed to create patient"
          );
        }

        enqueueSnackbar("Patient created successfully", {
          variant: "success",
        });

        onPatientCreated(response.patient);
        resetForm();
      } catch (error) {
        const existingPatient = error.response?.data?.patient;

        if (existingPatient) {
          onPatientCreated(existingPatient);
          onCancel();
        }

        enqueueSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Failed to create patient",
          {
            variant: "error",
          }
        );
      }
    },
  });

  return (
    <div className="border rounded p-3 mb-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">New Patient</h5>

        <button
          type="button"
          className="btn-close"
          onClick={onCancel}
          disabled={formik.isSubmitting}
        />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Name <span className="text-danger">*</span>
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
            <label className="form-label">Phone</label>

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
            <label className="form-label">National ID</label>

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
              Date of Birth
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
            <label className="form-label">Gender</label>

            <select
              name="gender"
              className="form-select"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.isSubmitting}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>

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
            <label className="form-label">Address</label>

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
                ? "Creating..."
                : "Create Patient"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={formik.isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPatientForm;