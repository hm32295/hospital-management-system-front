
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getCategory } from "../../services/category.service";
import { medicineInitialValues } from "../../initialValues/medicine.initial";
import { medicineSchema } from "../../schemas/medicine/medicine.schema";
import { createMedicine } from "../../services/medicines.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";

const AddMedicine = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = async (search = "") => {
    try {
      setLoadingCategories(true);
      const response = await getCategory({
        search,
        isActive: true,
        page: 1,
        limit: 10,
      });

      setCategories(response.categories || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("medicines.failedLoadCategories")
        )
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories(" ");
  }, []);

  const formik = useFormik({
    initialValues: medicineInitialValues,
    validationSchema: medicineSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const medicines = [values];

      try {
        await createMedicine({ medicines });
        showSuccess(t("medicines.createdSuccess"));
        navigate("/medicines");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("medicines.createFailed")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  return (
    <div>
      <Header
        title={t("medicines.addMedicine")}
        description={t("medicines.addMedicineDescription")}
        buttonContent={t("medicines.backToMedicines")}
        buttonLink="/medicines"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="name"
                  label={t("medicines.medicineName")}
                  type="text"
                  placeholder={t("medicines.medicineNamePlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="genericName"
                  label={t("medicines.genericName")}
                  type="text"
                  placeholder={t("medicines.genericNamePlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSearchSelect
                  formik={formik}
                  name="category"
                  label={t("medicines.category")}
                  placeholder={
                    loadingCategories
                      ? t("medicines.loadingCategories")
                      : t("medicines.searchCategory")
                  }
                  options={categoryOptions}
                  serverSearch
                  onSearch={fetchCategories}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="manufacturer"
                  label={t("medicines.manufacturer")}
                  type="text"
                  placeholder={t("medicines.manufacturerPlaceholder")}
                  required
                />
              </div>

              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="description"
                  label={t("medicines.description")}
                  type="textarea"
                  placeholder={t("medicines.descriptionPlaceholder")}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/medicines")}
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
                  ? t("medicines.adding")
                  : t("medicines.addMedicine")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicine;