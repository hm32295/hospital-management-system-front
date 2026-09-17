
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  X,
} from "lucide-react";

import {
  createDoctor,
  getDoctors,
  updateDoctor,
  deactivateDoctor,
} from "../../services/doctor.service";

import { getSpecialties } from "../../services/specialty.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";

const Doctors = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [doctors, setDoctors] = useState([]);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    specialties: [],
    phone: "",
    email: "",
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await getDoctors({
        search,
        page: 1,
        limit: 10,
      });

      setDoctors(response.doctors || []);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to load doctors",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

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

  const resetForm = () => {
    setFormData({
      name: "",
      specialties: [],
      phone: "",
      email: "",
    });

    setEditingDoctor(null);
    setSpecialtyOptions([]);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      enqueueSnackbar("Doctor name is required", {
        variant: "error",
      });

      return;
    }

    if (
      !Array.isArray(formData.specialties) ||
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
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
      };

      let response;

      if (editingDoctor) {
        response = await updateDoctor(
          editingDoctor._id,
          doctorData
        );
      } else {
        response = await createDoctor(doctorData);
      }

      if (!response.success) {
        throw new Error(
          response.message || "Operation failed"
        );
      }

      enqueueSnackbar(
        editingDoctor
          ? "Doctor updated successfully"
          : "Doctor created successfully",
        {
          variant: "success",
        }
      );

      resetForm();
      fetchDoctors();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Operation failed",
        {
          variant: "error",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (doctor) => {
    const selectedSpecialties = (
      doctor.specialties || []
    ).map((specialty) => ({
      value: specialty._id,
      label: specialty.name,
    }));

    setFormData({
      name: doctor.name || "",
      specialties: selectedSpecialties.map(
        (specialty) => specialty.value
      ),
      phone: doctor.phone || "",
      email: doctor.email || "",
    });

    setSpecialtyOptions((prev) => {
      const merged = [...prev];

      selectedSpecialties.forEach((specialty) => {
        const exists = merged.some(
          (option) =>
            String(option.value) ===
            String(specialty.value)
        );

        if (!exists) {
          merged.push(specialty);
        }
      });

      return merged;
    });

    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this doctor?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await deactivateDoctor(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to deactivate doctor"
        );
      }

      enqueueSnackbar(
        "Doctor deactivated successfully",
        {
          variant: "success",
        }
      );

      fetchDoctors();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to deactivate doctor",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Doctors</h3>

          <p className="text-muted mb-0">
            Manage doctors
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setEditingDoctor(null);

            setFormData({
              name: "",
              specialties: [],
              phone: "",
              email: "",
            });

            setSpecialtyOptions([]);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                {editingDoctor
                  ? "Edit Doctor"
                  : "Add Doctor"}
              </h5>

              <button
                type="button"
                className="btn btn-light"
                onClick={resetForm}
                disabled={submitting}
              >
                <X size={18} />
              </button>
            </div>

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
                    ? "Saving..."
                    : editingDoctor
                    ? "Update Doctor"
                    : "Create Doctor"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search doctors..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              Loading...
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center text-muted py-5">
              No doctors found
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialties</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td className="fw-semibold">
                        {doctor.name}
                      </td>

                      <td>
                        {doctor.specialties?.length ? (
                          <div className="d-flex flex-wrap gap-1">
                            {doctor.specialties.map(
                              (specialty) => (
                                <span
                                  key={specialty._id}
                                  className="badge text-bg-light border"
                                >
                                  {specialty.name}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {doctor.phone || "-"}
                      </td>

                      <td>
                        {doctor.email || "-"}
                      </td>

                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              handleEdit(doctor)
                            }
                            disabled={submitting}
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(doctor._id)
                            }
                            disabled={submitting}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;