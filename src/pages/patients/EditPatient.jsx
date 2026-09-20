
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import {
  getSinglePatient,
  updatePatient,
} from "../../services/patients.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  const fetchPatient = async () => {
    try {
      setLoading(true);

      const response = await getSinglePatient(id);
      const patient = response.patient || {};

      setFormData({
        name: patient.name || "",
        phone: patient.phone || "",
        email: patient.email || "",
        nationalId: patient.nationalId || "",
        dateOfBirth: patient.dateOfBirth
          ? new Date(patient.dateOfBirth)
              .toISOString()
              .split("T")[0]
          : "",
        gender: patient.gender || "",
        address: patient.address || "",
      });
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("patients.failedLoadSingle")
        )
      );

      navigate("/patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError(t("patients.nameRequired"));
      return;
    }

    try {
      setSubmitting(true);

      const patientData = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        nationalId: formData.nationalId.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address.trim() || null,
      };

      const response = await updatePatient(
        id,
        patientData
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            t("patients.updateFailed")
        );
      }

      showSuccess(
        response.message ||
          t("patients.updatedSuccess")
      );

      navigate("/patients");
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("patients.updateFailed")
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          {t("patients.loadingPatient")}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="mb-1">
          {t("patients.editPatient")}
        </h3>

        <p className="text-muted mb-0">
          {t("patients.editPatientDescription")}
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {t("patients.patientName")}
                  <span className="text-danger ms-1">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitting}
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
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={submitting}
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
                  value={formData.nationalId}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {t("patients.email")}
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
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
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {t("patients.gender")}
                </label>

                <select
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="">
                    {t("patients.selectGender")}
                  </option>

                  <option value="male">
                    {t("patients.genders.male")}
                  </option>

                  <option value="female">
                    {t("patients.genders.female")}
                  </option>
                </select>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">
                  {t("patients.address")}
                </label>

                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting
                  ? t("patients.saving")
                  : t("patients.updatePatient")}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/patients")}
                disabled={submitting}
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatient;
