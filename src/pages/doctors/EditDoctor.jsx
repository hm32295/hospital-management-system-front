import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { useSnackbar } from "notistack";
import { ArrowLeft } from "lucide-react";

import {
  updateDoctor,
} from "../../services/doctor.service";

import {
  getDoctorAccount,
} from "../../services/doctorSettlements.service";

import { getSpecialties } from "../../services/specialty.service";

import FormSearchSelect from "../../components/form/FormSearchSelect";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
            "Failed to load doctor"
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
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to load doctor",
        {
          variant: "error",
        }
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
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to search specialties",
        {
          variant: "error",
        }
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
      enqueueSnackbar(
        "Doctor name is required",
        {
          variant: "error",
        }
      );

      return;
    }

    if (
      !Array.isArray(
        formData.specialties
      ) ||
      formData.specialties.length === 0
    ) {
      enqueueSnackbar(
        "At least one specialty is required",
        {
          variant: "error",
        }
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
            "Failed to update doctor"
        );
      }

      enqueueSnackbar(
        "Doctor updated successfully",
        {
          variant: "success",
        }
      );

      navigate("/doctors");
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to update doctor",
        {
          variant: "error",
        }
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
          Back
        </button>

        <h3 className="mb-1">
          Edit Doctor
        </h3>

        <p className="text-muted mb-0">
          Update doctor information
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Doctor Name
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
                  placeholder="Dr. Ahmed Mohamed"
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6 mb-3">
                <FormSearchSelect
                  label="Specialties"
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
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@example.com"
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
                  ? "Updating..."
                  : "Update Doctor"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/doctors")
                }
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDoctor;