
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  X,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getPatients,
  createPatient,
  updatePatient,
  deactivatePatient,
} from "../../services/patients.service";

const Patients = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Fetch Patients
  |--------------------------------------------------------------------------
  */

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await getPatients({search,page: 1,limit: 10,
      });
      console.log(response);
      
      setPatients(response.patients || []);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to load patients",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | Handle Input
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Form
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      nationalId: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    });

    setEditingPatient(null);
    setShowForm(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Open Add Form
  |--------------------------------------------------------------------------
  */

  const handleAdd = () => {
    setEditingPatient(null);

    setFormData({
      name: "",
      phone: "",
      email: "",
      nationalId: "",
      dateOfBirth: "",
      gender: "",
      address: "",
    });

    setShowForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Open Edit Form
  |--------------------------------------------------------------------------
  */

  const handleEdit = (patient) => {
    setEditingPatient(patient);

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

    setShowForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!formData.name.trim()) {
      enqueueSnackbar(
        "Patient name is required",
        {
          variant: "error",
        }
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    try {
      setSubmitting(true);

      const patientData = {
        name: formData.name.trim(),

        phone:
          formData.phone.trim() || null,

        email:
          formData.email.trim() || null,

        nationalId:
          formData.nationalId.trim() || null,

        dateOfBirth:
          formData.dateOfBirth || null,

        gender:
          formData.gender || null,

        address:
          formData.address.trim() || null,
      };

      let response;

      if (editingPatient) {
        response = await updatePatient(
          editingPatient._id,
          patientData
        );
      } else {
        response = await createPatient(
          patientData
        );
      }

      if (!response.success) {
        throw new Error(
          response.message ||
            "Operation failed"
        );
      }

      enqueueSnackbar(
        editingPatient
          ? "Patient updated successfully"
          : "Patient created successfully",
        {
          variant: "success",
        }
      );

      resetForm();

      fetchPatients();
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

  /*
  |--------------------------------------------------------------------------
  | Deactivate Patient
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this patient?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response =
        await deactivatePatient(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to deactivate patient"
        );
      }

      enqueueSnackbar(
        "Patient deactivated successfully",
        {
          variant: "success",
        }
      );

      fetchPatients();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to deactivate patient",
        {
          variant: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Patient Details
  |--------------------------------------------------------------------------
  */

  const handleView = (id) => {
    navigate(`/patients/${id}`);
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="mb-1">
            Patients
          </h3>

          <p className="text-muted mb-0">
            Manage patients
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleAdd}
        >
          <Plus size={18} />

          Add Patient
        </button>

      </div>

      {/* Form */}

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h5 className="mb-0">
                {editingPatient
                  ? "Edit Patient"
                  : "Add Patient"}
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

                {/* Name */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Patient Name
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
                    placeholder="Ahmed Mohamed"
                    disabled={submitting}
                  />

                </div>

                {/* Phone */}

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

                {/* National ID */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    National ID
                  </label>

                  <input
                    type="text"
                    name="nationalId"
                    className="form-control"
                    value={formData.nationalId}
                    onChange={handleChange}
                    placeholder="National ID"
                    disabled={submitting}
                  />

                </div>

                {/* Email */}

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
                    placeholder="patient@example.com"
                    disabled={submitting}
                  />

                </div>

                {/* Date of Birth */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={
                      formData.dateOfBirth
                    }
                    onChange={handleChange}
                    disabled={submitting}
                  />

                </div>

                {/* Gender */}

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Gender
                  </label>

                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>
                  </select>

                </div>

                {/* Address */}

                <div className="col-12 mb-3">

                  <label className="form-label">
                    Address
                  </label>

                  <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Patient address"
                    disabled={submitting}
                  />

                </div>

              </div>

              {/* Buttons */}

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingPatient
                    ? "Update Patient"
                    : "Create Patient"}
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

      {/* Patients Table */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          {/* Search */}

          <div className="row mb-4">

            <div className="col-md-5">

              <div className="input-group">

                <span className="input-group-text">
                  <Search size={18} />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, phone or national ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="text-center py-5">
              Loading...
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center text-muted py-5">
              No patients found
            </div>
          ) : (

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>

                  <tr>

                    <th>
                      Patient
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      National ID
                    </th>

                    <th>
                      Gender
                    </th>

                    <th>
                      Date of Birth
                    </th>

                    <th className="text-end">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {patients.map(
                    (patient) => (

                      <tr
                        key={patient._id}
                      >

                        {/* Patient */}

                        <td>

                          <div className="fw-semibold">
                            {patient.name}
                          </div>

                          {patient.email && (
                            <div className="text-muted small">
                              {patient.email}
                            </div>
                          )}

                        </td>

                        {/* Phone */}

                        <td>
                          {patient.phone || "-"}
                        </td>

                        {/* National ID */}

                        <td>
                          {patient.nationalId ||
                            "-"}
                        </td>

                        {/* Gender */}

                        <td>

                          {patient.gender ===
                          "male" ? (
                            <span className="badge text-bg-primary">
                              Male
                            </span>
                          ) : patient.gender ===
                            "female" ? (
                            <span className="badge text-bg-danger">
                              Female
                            </span>
                          ) : (
                            "-"
                          )}

                        </td>

                        {/* DOB */}

                        <td>

                          {patient.dateOfBirth
                            ? new Date(
                                patient.dateOfBirth
                              ).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}

                        </td>

                        {/* Actions */}

                        <td className="text-end">

                          <div className="d-flex justify-content-end gap-2">

                            {/* View */}

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                handleView(
                                  patient._id
                                )
                              }
                              title="View patient"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Edit */}

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                handleEdit(
                                  patient
                                )
                              }
                              title="Edit patient"
                            >
                              <Edit size={16} />
                            </button>

                            {/* Deactivate */}

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDelete(
                                  patient._id
                                )
                              }
                              title="Deactivate patient"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Patients;
