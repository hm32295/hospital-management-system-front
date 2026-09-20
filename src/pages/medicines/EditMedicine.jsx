
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getMedicineById,
  updateMedicine,
} from "../../services/medicines.service";
import { getCategory } from "../../services/category.service";
import { medicineSchema } from "../../schemas/medicine/medicine.schema";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import FormSelect from "../../components/form/FormSelect";

const EditMedicine = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const medicineResponse = await getMedicineById(id);
      const medicineData = medicineResponse.medicine;

      setMedicine(medicineData);

      setLoadingCategories(true);
      const categoryResponse = await getCategory();
      setCategories(categoryResponse.categories || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("medicines.failedLoad")
        )
      );
    } finally {
      setLoading(false);
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: medicine?.name || "",
      genericName: medicine?.genericName || "",
      category:
        medicine?.category?._id ||
        medicine?.category ||
        "",
      manufacturer: medicine?.manufacturer || "",
      description: medicine?.description || "",
      isActive: medicine?.isActive ?? true,
    },
    validationSchema: medicineSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateMedicine(id, values);
        showSuccess(t("medicines.updatedSuccess"));
        navigate("/medicines");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("medicines.updateFailed")
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

  if (loading) {
    return (
      <div>
        <Header
          title={t("medicines.editMedicine")}
          description={t("medicines.editMedicineDescription")}
          buttonContent={t("medicines.backToMedicines")}
          buttonLink="/medicines"
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
        title={t("medicines.editMedicine")}
        description={t("medicines.editMedicineDescription")}
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
                <FormSelect
                  formik={formik}
                  name="isActive"
                  label={t("medicines.status")}
                  options={[
                    {
                      value: true,
                      label: t("medicines.statuses.active"),
                    },
                    {
                      value: false,
                      label: t("medicines.statuses.inactive"),
                    },
                  ]}
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
                  disabled={loadingCategories}
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
                disabled={
                  formik.isSubmitting ||
                  loadingCategories
                }
              >
                {formik.isSubmitting
                  ? t("medicines.updating")
                  : t("medicines.updateMedicine")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMedicine;