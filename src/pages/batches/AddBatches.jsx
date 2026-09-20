
import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { batchesInitialValues } from "../../initialValues/batches.initial";
import { batchesSchema } from "../../schemas/batches.schema";
import { createBatch } from "../../services/batches.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import { getMedicines } from "../../services/medicines.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const AddBatches = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loadingMedicine, setLoadingMedicine] = useState(false);
  const [medicines, setMedicines] = useState([]);

  const formik = useFormik({
    initialValues: batchesInitialValues,
    validationSchema: batchesSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await createBatch(values);

        showSuccess(
          response?.message ||
            t("batches.createSuccess")
        );

        navigate("/batches");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("batches.createFailed")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchMedicine = async (search = "") => {
    try {
      setLoadingMedicine(true);

      const response = await getMedicines({
        search,
        isActive: true,
        limit: 10,
        page: 1,
      });

      setMedicines(response.medicines || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("batches.loadMedicinesFailed")
        )
      );
    } finally {
      setLoadingMedicine(false);
    }
  };

  const medicineOptions = medicines.map((medicine) => ({
    value: medicine._id,
    label: medicine.name,
  }));

  return (
    <div>
      <Header
        title={t("batches.addTitle")}
        description={t("batches.addDescription")}
        buttonContent={t("batches.backToBatches")}
        buttonLink="/batches"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormSearchSelect
                  formik={formik}
                  name="medicine"
                  label={t("batches.medicine")}
                  placeholder={t(
                    "batches.searchMedicine"
                  )}
                  options={medicineOptions}
                  required
                  serverSearch
                  onSearch={fetchMedicine}
                  loading={loadingMedicine}
                  minSearchLength={2}
                  debounceDelay={400}
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="batchNumber"
                  label={t("batches.batchNumber")}
                  type="text"
                  placeholder={t(
                    "batches.batchNumberPlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="expiryDate"
                  label={t("batches.expiryDate")}
                  type="date"
                  placeholder={t(
                    "batches.expiryDatePlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="quantity"
                  label={t("batches.quantity")}
                  type="number"
                  placeholder={t(
                    "batches.quantityPlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="sellingPrice"
                  label={t("batches.sellingPrice")}
                  type="number"
                  placeholder={t(
                    "batches.sellingPricePlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="purchasePrice"
                  label={t("batches.purchasePrice")}
                  type="number"
                  placeholder={t(
                    "batches.purchasePricePlaceholder"
                  )}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/batches")}
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
                  ? t("batches.adding")
                  : t("batches.addBatch")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBatches;
