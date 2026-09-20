
import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  createSpecialty,
  getSpecialties,
  updateSpecialty,
  deactivateSpecialty,
} from "../../services/specialty.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const Specialties = () => {
  const { t } = useTranslation();

  const [specialties, setSpecialties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);

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
      showError(
        getApiErrorMessage(
          error,
          t("specialties.loadFailed")
        )
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
      showError(t("specialties.nameRequired"));
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
            t("specialties.operationFailed")
        );
      }

      showSuccess(
        editingSpecialty
          ? t("specialties.updatedSuccess")
          : t("specialties.createdSuccess")
      );

      resetForm();
      fetchSpecialties();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("specialties.operationFailed")
        )
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
      t("specialties.deactivateConfirmation")
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await deactivateSpecialty(id);

      if (!response.success) {
        throw new Error(
          response.message ||
            t("specialties.deactivateFailed")
        );
      }

      showSuccess(
        t("specialties.deactivatedSuccess")
      );

      fetchSpecialties();
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("specialties.deactivateFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            {t("specialties.title")}
          </h3>

          <p className="text-muted mb-0">
            {t("specialties.subtitle")}
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
          {t("specialties.addSpecialty")}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                {editingSpecialty
                  ? t("specialties.editSpecialty")
                  : t("specialties.addSpecialty")}
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
                    {t("specialties.name")}
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
                      "specialties.namePlaceholder"
                    )}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {t("specialties.description")}
                  </label>

                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t(
                      "specialties.descriptionPlaceholder"
                    )}
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
                    ? t("specialties.saving")
                    : editingSpecialty
                    ? t("specialties.updateSpecialty")
                    : t("specialties.createSpecialty")}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  {t("common.cancel")}
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
                  placeholder={t(
                    "specialties.searchPlaceholder"
                  )}
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
              {t("common.loading")}
            </div>
          ) : specialties.length === 0 ? (
            <div className="text-center text-muted py-5">
              {t("specialties.noSpecialtiesFound")}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>{t("specialties.name")}</th>
                    <th>
                      {t("specialties.description")}
                    </th>
                    <th className="text-end">
                      {t("common.actions")}
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
                            title={t("common.edit")}
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
                            title={t("common.delete")}
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