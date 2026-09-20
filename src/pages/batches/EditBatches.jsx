
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { batchesSchema } from "../../schemas/batches.schema";
import {
  getBatchById,
  updateBatch,
} from "../../services/batches.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import { getMedicines } from "../../services/medicines.service";
import FormSelect from "../../components/form/FormSelect";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const EditBatches = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loadingMedicine, setLoadingMedicine] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [batchSingle, setBatchSingle] = useState(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      batchNumber: batchSingle?.batchNumber || "",
      purchasePrice: batchSingle?.purchasePrice || 0,
      quantity: batchSingle?.quantity || 0,
      expiryDate: batchSingle?.expiryDate
        ? batchSingle.expiryDate.split("T")[0]
        : "",
      sellingPrice: batchSingle?.sellingPrice || 0,
      medicine:
        batchSingle?.medicine?._id ||
        batchSingle?.medicine ||
        "",
      isActive: batchSingle?.isActive ?? true,
    },
    validationSchema: batchesSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await updateBatch(id, values);

        showSuccess(
          response?.message ||
            t("batches.updateSuccess")
        );

        navigate("/batches");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("batches.updateFailed")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchMedicine = async () => {
    setLoadingMedicine(true);

    try {
      const response = await getMedicines();
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

  const fetchBatchSingle = async () => {
    setLoadingMedicine(true);

    try {
      const response = await getBatchById(id);
      setBatchSingle(response.batch);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("batches.loadDetailsFailed")
        )
      );
    } finally {
      setLoadingMedicine(false);
    }
  };

  useEffect(() => {
    fetchMedicine();
    fetchBatchSingle();
  }, []);

  const medicineOptions = medicines.map((medicine) => ({
    value: medicine._id,
    label: medicine.name,
  }));

  return (
    <div>
      <Header
        title={t("batches.updateTitle")}
        description={t("batches.updateDescription")}
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
                  placeholder={
                    loadingMedicine
                      ? t("batches.loadingMedicine")
                      : t("batches.searchMedicine")
                  }
                  options={medicineOptions}
                  disabled={loadingMedicine}
                  required
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

              <div className="col-12 col-md-6">
                <FormSelect
                  formik={formik}
                  name="isActive"
                  label={t("batches.status")}
                  options={[
                    {
                      value: true,
                      label: t("batches.active"),
                    },
                    {
                      value: false,
                      label: t("batches.inactive"),
                    },
                  ]}
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
                  ? t("batches.updating")
                  : t("batches.updateBatch")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBatches;