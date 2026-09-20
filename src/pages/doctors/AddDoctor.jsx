
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  createDoctor,
} from "../../services/doctor.service";

import { getSpecialties } from "../../services/specialty.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";
import { useTranslation } from "react-i18next";

const AddDoctor = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [submitting, setSubmitting] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    specialties: [],
    phone: "",
    email: "",
  });

  const fetchSpecialties = async (searchValue) => {
    try {
      setSpecialtyLoading(true);

      const response = await getSpecialties({
        search: searchValue,
        page: 1,
        limit: 10,
      });

      const newOptions = (response.specialties || []).map(
        (specialty) => ({
          value: specialty._id,
          label: specialty.name,
        })
      );

      setSpecialtyOptions((prev) => {
        const merged = [...prev];

        newOptions.forEach((option) => {
          const exists = merged.some(
            (item) =>
              String(item.value) === String(option.value)
          );

          if (!exists) {
            merged.push(option);
          }
        });

        return merged;
      });
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctors.failedToSearchSpecialties")
        )
      );
    } finally {
      setSpecialtyLoading(false);
    }
  };

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
      showError(t("doctors.nameRequired"));
      return;
    }

    if (
      !Array.isArray(formData.specialties) ||
      formData.specialties.length === 0
    ) {
      showError(t("doctors.specialtyRequired"));
      return;
    }

    try {
      setSubmitting(true);

      const doctorData = {
        name: formData.name.trim(),
        specialties: formData.specialties,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
      };

      const response = await createDoctor(doctorData);

      if (!response.success) {
        throw new Error(
          response.message || t("doctors.failedToCreate")
        );
      }

      showSuccess(
        response.message || t("doctors.createdSuccessfully")
      );

      navigate("/doctors");
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          error.message || t("doctors.failedToCreate")
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-light btn-sm mb-3"
          onClick={() => navigate("/doctors")}
        >
          <ArrowLeft size={16} className="me-1" />
          {t("common.back")}
        </button>

        <h3 className="mb-1">
          {t("doctors.addTitle")}
        </h3>

        <p className="text-muted mb-0">
          {t("doctors.addDescription")}
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {t("doctors.doctorName")}
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("doctors.namePlaceholder")}
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6 mb-3">
                <FormSearchSelect
                  label={t("doctors.specialties")}
                  name="specialties"
                  value={formData.specialties}
                  options={specialtyOptions}
                  serverSearch
                  onSearch={fetchSpecialties}
                  loading={specialtyLoading}
                  minSearchLength={2}
                  debounceDelay={400}
                  required
                  isMulti
                  onChange={(values) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialties: values || [],
                    }))
                  }
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {t("doctors.phone")}
                </label>

                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("doctors.phonePlaceholder")}
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {t("doctors.email")}
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("doctors.emailPlaceholder")}
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
                  ? t("doctors.creating")
                  : t("doctors.create")}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/doctors")}
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

export default AddDoctor;