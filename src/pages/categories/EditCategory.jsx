
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getCategoryById,
  updateCategory,
} from "../../services/category.service";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import { categorySchema } from "../../schemas/medicine/category.schema";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setServerError("");

        const response = await getCategoryById(id);
        setCategory(response.category);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          t("categories.failedToLoad")
        );

        setServerError(message);
        showError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
      isActive: category?.isActive ?? true,
    },
    validationSchema: categorySchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");

        const response = await updateCategory(id, values);

        showSuccess(
          response?.message || t("categories.updateSuccess")
        );

        navigate("/categories");
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          t("categories.failedToUpdate")
        );

        setServerError(message);
        showError(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <div>
        <Header
          title={t("categories.editTitle")}
          description={t("categories.editDescription")}
          buttonContent={t("categories.backToCategories")}
          buttonLink="/categories"
        />

        <div className="card border-0 shadow-sm">
          <div className="card-body p-5">
            <div className="d-flex justify-content-center">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  {t("common.loading")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={t("categories.editTitle")}
        description={t("categories.editDescription")}
        buttonContent={t("categories.backToCategories")}
        buttonLink="/categories"
      />

      {serverError && (
        <div className="alert alert-danger">
          {serverError}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="name"
                  label={t("categories.name")}
                  type="text"
                  placeholder={t("categories.namePlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSelect
                  formik={formik}
                  name="isActive"
                  label={t("categories.status")}
                  options={[
                    {
                      value: true,
                      label: t("categories.active"),
                    },
                    {
                      value: false,
                      label: t("categories.inactive"),
                    },
                  ]}
                  required
                />
              </div>

              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="description"
                  label={t("categories.description")}
                  type="textarea"
                  placeholder={t(
                    "categories.descriptionPlaceholder"
                  )}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/categories")}
                disabled={formik.isSubmitting}
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting || loading}
              >
                {formik.isSubmitting
                  ? t("categories.updating")
                  : t("categories.update")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
