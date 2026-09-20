
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";
import { getSuppliers } from "../../services/supplier.service";
import { purchaseInitialValues } from "../../initialValues/purchases.initial";
import { purchaseSchema } from "../../schemas/purchase.schema";
import { createPurchases } from "../../services/purchases.service";
import { getMedicines } from "../../services/medicines.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const AddPurchases = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [supplier, setSuppler] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(false);

  const searchMedicines = async (search = "") => {
    setMedicinesLoading(true);

    try {
      const response = await getMedicines({
        search,
        page: 1,
        limit: 10,
      });

      setMedicines(response.medicines || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("purchases.searchMedicinesFailed")
        )
      );
    } finally {
      setMedicinesLoading(false);
    }
  };

  const fetchSupplier = async (search = "") => {
    try {
      const response = await getSuppliers({ search });

      setSuppler(response.suppliers || []);
    } catch (error) {
      showError(
        getApiErrorMessage(
          error,
          t("purchases.searchSuppliersFailed")
        )
      );
    }
  };

  useEffect(() => {
    fetchSupplier(" ");
    searchMedicines(" ");
  }, []);

  const formik = useFormik({
    initialValues: purchaseInitialValues,
    validationSchema: purchaseSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createPurchases(values);

        showSuccess(t("purchases.createdSuccess"));

        navigate("/purchases");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("purchases.createFailed")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const supplierOptions = supplier.map((supplier) => ({
    value: supplier._id,
    label: supplier.name,
  }));

  const medicinesOptions = medicines.map((medicine) => ({
    value: medicine._id,
    label: medicine.name,
  }));

  return (
    <div>
      <Header
        title={t("purchases.addPurchase")}
        description={t("purchases.addPurchaseDescription")}
        buttonContent={t("purchases.backToPurchases")}
        buttonLink="/purchases"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="purchaseDate"
                  label={t("purchases.purchaseDate")}
                  type="date"
                  placeholder={t("purchases.purchaseDatePlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="invoiceNumber"
                  label={t("purchases.invoiceNumber")}
                  type="text"
                  placeholder={t("purchases.invoiceNumberPlaceholder")}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormSearchSelect
                  formik={formik}
                  name="supplier"
                  label={t("purchases.supplier")}
                  placeholder={t("purchases.searchSupplier")}
                  options={supplierOptions}
                  serverSearch
                  onSearch={fetchSupplier}
                  required
                />
              </div>

              <div className="col-12">
                {formik.values.items.map((item, index) => (
                  <div
                    key={index}
                    className="card border mb-4"
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                          {t("purchases.medicineNumber", {
                            number: index + 1,
                          })}
                        </h6>

                        {formik.values.items.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              const newItems = [
                                ...formik.values.items,
                              ];

                              newItems.splice(index, 1);

                              formik.setFieldValue(
                                "items",
                                newItems
                              );
                            }}
                          >
                            {t("purchases.remove")}
                          </button>
                        )}
                      </div>

                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <FormSearchSelect
                            formik={formik}
                            name={`items[${index}].medicine`}
                            label={t("purchases.medicine")}
                            placeholder={
                              medicinesLoading
                                ? t("purchases.loadingMedicines")
                                : t("purchases.searchMedicine")
                            }
                            options={medicinesOptions}
                            serverSearch
                            onSearch={searchMedicines}
                            required
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <FormInput
                            formik={formik}
                            name={`items[${index}].batchNumber`}
                            label={t("purchases.batchNumber")}
                            type="text"
                            placeholder={t(
                              "purchases.batchNumberPlaceholder"
                            )}
                            required
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <FormInput
                            formik={formik}
                            name={`items[${index}].expiryDate`}
                            label={t("purchases.expiryDate")}
                            type="date"
                            required
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <FormInput
                            formik={formik}
                            name={`items[${index}].sellingPrice`}
                            label={t("purchases.sellingPrice")}
                            type="number"
                            placeholder={t(
                              "purchases.sellingPricePlaceholder"
                            )}
                            required
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <FormInput
                            formik={formik}
                            name={`items[${index}].quantity`}
                            label={t("purchases.quantity")}
                            type="number"
                            placeholder={t(
                              "purchases.quantityPlaceholder"
                            )}
                            required
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <FormInput
                            formik={formik}
                            name={`items[${index}].purchasePrice`}
                            label={t("purchases.purchasePrice")}
                            type="number"
                            placeholder={t(
                              "purchases.purchasePricePlaceholder"
                            )}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    formik.setFieldValue("items", [
                      ...formik.values.items,
                      {
                        medicine: "",
                        expiryDate: "",
                        quantity: "",
                        batchNumber: "",
                        purchasePrice: "",
                      },
                    ]);
                  }}
                >
                  + {t("purchases.addMedicine")}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => navigate("/purchases")}
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
                  ? t("purchases.adding")
                  : t("purchases.addPurchase")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPurchases;