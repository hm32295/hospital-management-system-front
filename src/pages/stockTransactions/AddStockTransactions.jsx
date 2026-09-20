
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import FormSelect from "../../components/form/FormSelect";
import { stockTransactionInitialValues } from "../../initialValues/stockTransaction.initial";
import { stockTransactionSchema } from "../../schemas/stockTransaction.schema";
import { createStockTransaction } from "../../services/stockTransactions.service";
import { getMedicines } from "../../services/medicines.service";
import { getBatches } from "../../services/batches.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const AddStockTransaction = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [loadingMedicine, setLoadingMedicine] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [batch, setBatch] = useState([]);

  const fetchBatch = async () => {
    setLoadingBatch(true);

    try {
      const response = await getBatches();

      const activeBatches = response.batches.filter(
        (batch) => batch.isActive
      );

      setBatch(activeBatches);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("stockTransactions.loadBatchesFailed")
        )
      );
    } finally {
      setLoadingBatch(false);
    }
  };

  const fetchMedicine = async () => {
    setLoadingMedicine(true);

    try {
      const response = await getMedicines();

      const activeMedicines = response.medicines.filter(
        (medicine) => medicine.isActive
      );

      setMedicines(activeMedicines);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("stockTransactions.loadMedicinesFailed")
        )
      );
    } finally {
      setLoadingMedicine(false);
    }
  };

  const formik = useFormik({
    initialValues: stockTransactionInitialValues,
    validationSchema: stockTransactionSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);

      try {
        await createStockTransaction(values);

        showSuccess(
          t("stockTransactions.createdSuccess")
        );

        navigate("/stock-transaction");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("stockTransactions.createFailed")
          )
        );
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    fetchMedicine();
    fetchBatch();
  }, []);

  const medicineOptions = medicines?.map((medicine) => ({
    value: medicine._id,
    label: medicine.name,
  }));

  const batchOption = batch.map((batch) => ({
    value: batch._id,
    label: batch.batchNumber,
  }));

  return (
    <div>
      <Header
        title={t("stockTransactions.addTransaction")}
        description={t("stockTransactions.addTransactionDescription")}
        buttonContent={t("stockTransactions.backToTransactions")}
        buttonLink="/stock-transaction"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="reason"
                  label={t("stockTransactions.reason")}
                  type="text"
                  placeholder={t("stockTransactions.reasonPlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="quantity"
                  label={t("stockTransactions.quantity")}
                  type="number"
                  placeholder={t("stockTransactions.quantityPlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSelect
                  formik={formik}
                  name="type"
                  label={t("stockTransactions.type")}
                  options={[
                    {
                      value: "IN",
                      label: "IN",
                    },
                    {
                      value: "OUT",
                      label: "OUT",
                    },
                  ]}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSearchSelect
                  formik={formik}
                  name="batch"
                  label={t("stockTransactions.medicineBatch")}
                  placeholder={
                    loadingBatch
                      ? t("stockTransactions.loadingBatch")
                      : t("stockTransactions.searchBatch")
                  }
                  options={batchOption}
                  disabled={loadingBatch}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSearchSelect
                  formik={formik}
                  name="medicine"
                  label={t("stockTransactions.medicine")}
                  placeholder={
                    loadingMedicine
                      ? t("stockTransactions.loadingMedicine")
                      : t("stockTransactions.searchMedicine")
                  }
                  options={medicineOptions}
                  disabled={loadingMedicine}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() =>
                  navigate("/stock-transaction")
                }
                disabled={formik.isSubmitting}
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  formik.isSubmitting || loading
                }
              >
                {formik.isSubmitting
                  ? t("stockTransactions.adding")
                  : t("stockTransactions.addTransaction")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStockTransaction;