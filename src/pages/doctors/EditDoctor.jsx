
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

import {
  updateDoctor,
} from "../../services/doctor.service";

import {
  getDoctorAccount,
} from "../../services/doctorSettlements.service";

import { getSpecialties } from "../../services/specialty.service";

import {
  showError,
  showSuccess,
} from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

import FormSearchSelect from "../../components/form/FormSearchSelect";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [specialtyOptions, setSpecialtyOptions] =
    useState([]);

  const [specialtyLoading, setSpecialtyLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    specialties: [],
    phone: "",
    email: "",
  });

  const loadDoctor = async () => {
    try {
      setLoading(true);

      const response =
        await getDoctorAccount(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            t("doctors.failedLoadDoctor")
        );
      }

      const doctor =
        response.doctor || {};

      const selectedSpecialties = (
        doctor.specialties || []
      ).map((specialty) => ({
        value: specialty._id,
        label: specialty.name,
      }));

      setFormData({
        name: doctor.name || "",
        specialties:
          selectedSpecialties.map(
            (specialty) =>
              specialty.value
          ),
        phone: doctor.phone || "",
        email: doctor.email || "",
      });

      setSpecialtyOptions(
        selectedSpecialties
      );
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctors.failedLoadDoctor")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadDoctor();
    }
  }, [id]);

  const fetchSpecialties = async (
    searchValue
  ) => {
    try {
      setSpecialtyLoading(true);

      const response = await getSpecialties({
        search: searchValue,
        page: 1,
        limit: 10,
      });

      const newOptions = (
        response.specialties || []
      ).map((specialty) => ({
        value: specialty._id,
        label: specialty.name,
      }));

      setSpecialtyOptions((prev) => {
        const merged = [...prev];

        newOptions.forEach((option) => {
          const exists = merged.some(
            (item) =>
              String(item.value) ===
              String(option.value)
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
          t("doctors.failedSearchSpecialties")
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
      showError(
        t("doctors.doctorNameRequired")
      );
      return;
    }

    if (
      !Array.isArray(
        formData.specialties
      ) ||
      formData.specialties.length === 0
    ) {
      showError(
        t("doctors.specialtyRequired")
      );
      return;
    }

    try {
      setSubmitting(true);

      const doctorData = {
        name: formData.name.trim(),
        specialties: formData.specialties,
        phone:
          formData.phone.trim() || null,
        email:
          formData.email.trim() || null,
      };

      const response =
        await updateDoctor(
          id,
          doctorData
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            t("doctors.failedUpdate")
        );
      }

      showSuccess(
        t("doctors.updatedSuccess")
      );

      navigate("/doctors");
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("doctors.failedUpdate")
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          />
          <div className="mt-2">
            {t("common.loading")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-light btn-sm mb-3"
          onClick={() => navigate("/doctors")}
        >
          <ArrowLeft
            size={16}
            className="me-1"
          />
          {t("common.back")}
        </button>

        <h3 className="mb-1">
          {t("doctors.editDoctor")}
        </h3>

        <p className="text-muted mb-0">
          {t("doctors.updateDescription")}
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {t("doctors.doctorName")}
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
                  placeholder={t(
                    "doctors.doctorNamePlaceholder"
                  )}
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6 mb-3">
                <FormSearchSelect
                  label={t(
                    "doctors.specialties"
                  )}
                  name="specialties"
                  value={
                    formData.specialties
                  }
                  options={specialtyOptions}
                  serverSearch
                  onSearch={fetchSpecialties}
                  loading={
                    specialtyLoading
                  }
                  minSearchLength={2}
                  debounceDelay={400}
                  required
                  isMulti
                  onChange={(values) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialties:
                        values || [],
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
                  placeholder={t(
                    "doctors.phonePlaceholder"
                  )}
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
                  placeholder={t(
                    "doctors.emailPlaceholder"
                  )}
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
                  ? t("doctors.updating")
                  : t("doctors.updateDoctor")}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/doctors")
                }
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

export default EditDoctor;