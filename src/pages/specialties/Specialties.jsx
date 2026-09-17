
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
  createSpecialty,
  getSpecialties,
  updateSpecialty,
  deactivateSpecialty,
} from "../../services/specialty.service";

const Specialties = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [specialties, setSpecialties] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingSpecialty, setEditingSpecialty] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchSpecialties = async () => {
    try {
      setLoading(true);

      const response = await getSpecialties({
        search,
        page: 1,
        limit: 10,
      });

      setSpecialties(response.specialties || []);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          "Failed to load specialties",
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
      fetchSpecialties();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

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
      description: "",
    });

    setEditingSpecialty(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      enqueueSnackbar("Specialty name is required", {
        variant: "error",
      });

      return;
    }

    try {
      setSubmitting(true);

      let response;

      if (editingSpecialty) {
        response = await updateSpecialty(
          editingSpecialty._id,
          {
            name: formData.name.trim(),
            description:
              formData.description.trim() || null,
            isActive: true,
          }
        );
      } else {
        response = await createSpecialty({
          name: formData.name.trim(),
          description:
            formData.description.trim() || null,
        });
      }

      if (!response.success) {
        throw new Error(
          response.message ||
            "Operation failed"
        );
      }

      enqueueSnackbar(
        editingSpecialty
          ? "Specialty updated successfully"
          : "Specialty created successfully",
        {
          variant: "success",
        }
      );

      resetForm();
      fetchSpecialties();
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

  const handleEdit = (specialty) => {
    setEditingSpecialty(specialty);

    setFormData({
      name: specialty.name || "",
      description: specialty.description || "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this specialty?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await deactivateSpecialty(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to deactivate specialty"
        );
      }

      enqueueSnackbar(
        "Specialty deactivated successfully",
        {
          variant: "success",
        }
      );

      fetchSpecialties();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.message ||
          "Failed to deactivate specialty",
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
          <h3 className="mb-1">Specialties</h3>

          <p className="text-muted mb-0">
            Manage medical specialties
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setEditingSpecialty(null);

            setFormData({
              name: "",
              description: "",
            });

            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Specialty
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                {editingSpecialty
                  ? "Edit Specialty"
                  : "Add Specialty"}
              </h5>

              <button
                type="button"
                className="btn btn-light"
                onClick={resetForm}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Specialty Name
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
                    placeholder="Internal Medicine"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Specialty description"
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
                    : editingSpecialty
                    ? "Update Specialty"
                    : "Create Specialty"}
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
                  placeholder="Search specialties..."
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
          ) : specialties.length === 0 ? (
            <div className="text-center text-muted py-5">
              No specialties found
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {specialties.map((specialty) => (
                    <tr key={specialty._id}>
                      <td className="fw-semibold">
                        {specialty.name}
                      </td>

                      <td>
                        {specialty.description || "-"}
                      </td>

                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              handleEdit(specialty)
                            }
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(
                                specialty._id
                              )
                            }
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

export default Specialties;
