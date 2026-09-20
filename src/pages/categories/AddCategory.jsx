
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { createCategory } from "../../services/category.service";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { categoryInitialValues } from "../../initialValues/category.initial";
import { categorySchema } from "../../schemas/medicine/category.schema";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const AddCategory = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: categoryInitialValues,
    validationSchema: categorySchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const categories = [values];
        const response = await createCategory({ categories });

        showSuccess(
          response?.message || t("categories.createSuccess")
        );

        navigate("/categories");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("categories.failedToCreate")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Header
        title={t("categories.addTitle")}
        description={t("categories.addDescription")}
        buttonContent={t("categories.backToCategories")}
        buttonLink="/categories"
      />

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

              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="description"
                  label={t("categories.description")}
                  type="textarea"
                  placeholder={t("categories.descriptionPlaceholder")}
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
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? t("categories.adding")
                  : t("categories.add")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
