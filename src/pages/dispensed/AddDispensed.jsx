
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

import Header from "../../components/header/Header";
import AdminDataPage from "../../components/table/AdminDataPage";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";

import {
  createDispensing,
  getAvailableSalesForDispensing,
} from "../../services/dispensed.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const AddDispensed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const saleId = searchParams.get("sale");

  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);

  const locale =
    i18n.language === "ar" ? "ar-EG" : "en-GB";

  const formik = useFormik({
    initialValues: {
      sale: saleId || "",
      reason: "",
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");

        if (!selectedSale) {
          showError(t("dispensing.selectSale"));
          return;
        }

        if (!values.reason.trim()) {
          showError(t("dispensing.reasonRequired"));
          return;
        }

        const response = await createDispensing({
          sale: values.sale,
          reason: values.reason.trim(),
        });

        showSuccess(
          response?.message ||
            t("dispensing.createSuccess")
        );

        navigate("/dispenses");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("dispensing.failedToCreate")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchSales = async () => {
      setSalesLoading(true);
      setServerError("");

      try {
        const response =
          await getAvailableSalesForDispensing();

        setSales(response?.sales || []);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          t("dispensing.failedToLoadSales")
        );

        setServerError(message);
        showError(message);
      } finally {
        setSalesLoading(false);
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    if (!saleId || sales.length === 0) {
      return;
    }

    const sale = sales.find(
      (item) => item._id === saleId
    );

    if (!sale) {
      const message = t(
        "dispensing.saleNotAvailable"
      );

      setServerError(message);
      showError(message);
      return;
    }

    setSelectedSale(sale);

    formik.setFieldValue("sale", sale._id);
  }, [saleId, sales]);

  const salesOptions = sales.map((sale) => ({
    value: sale._id,
    label: `${t("dispensing.sale")} #${sale._id.slice(
      -6
    )} - ${
      sale.patient?.name ||
      t("dispensing.noPatient")
    } - ${Number(sale.totalAmount).toFixed(2)} ${t(
      "common.egp"
    )}`,
  }));

  const handleSaleChange = (selectedSaleId) => {
    formik.setFieldValue(
      "sale",
      selectedSaleId
    );

    const sale = sales.find(
      (item) => item._id === selectedSaleId
    );

    setSelectedSale(sale || null);
  };

  const medicineColumns = [
    {
      key: "medicine",
      label: t("dispensing.medicine"),
      render: (item) => (
        <div className="fw-semibold">
          {item.medicine?.name || "-"}

          {item.medicine?.genericName && (
            <div className="text-muted small">
              {item.medicine.genericName}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "batch",
      label: t("dispensing.batch"),
      render: (item) =>
        item.batch?.batchNumber || "-",
    },
    {
      key: "expiryDate",
      label: t("dispensing.expiry"),
      render: (item) =>
        item.batch?.expiryDate
          ? new Date(
              item.batch.expiryDate
            ).toLocaleDateString(locale)
          : "-",
    },
    {
      key: "quantity",
      label: t("dispensing.quantity"),
      render: (item) => (
        <span className="badge text-bg-primary">
          {item.quantity}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Header
        title={t("dispensing.addTitle")}
        description={t("dispensing.addDescription")}
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
              <div className="col-12">
                <FormSearchSelect
                  formik={formik}
                  name="sale"
                  label={t("dispensing.sale")}
                  placeholder={
                    salesLoading
                      ? t("dispensing.loadingPaidSales")
                      : t("dispensing.searchCompletedSale")
                  }
                  options={salesOptions}
                  disabled={
                    salesLoading || !!saleId
                  }
                  required
                  onChange={handleSaleChange}
                />
              </div>

              {selectedSale && (
                <>
                  <div className="col-12">
                    <div className="alert alert-success d-flex align-items-center gap-2 mb-0">
                      <CheckCircle2 size={20} />

                      <div>
                        <strong>
                          {t(
                            "dispensing.saleFullyPaid"
                          )}
                        </strong>

                        <div className="small">
                          {t(
                            "dispensing.saleReadyForDispensing"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card border h-100">
                      <div className="card-body">
                        <h6 className="mb-3">
                          {t("dispensing.patient")}
                        </h6>

                        <div className="fw-semibold">
                          {selectedSale.patient?.name ||
                            t("dispensing.noPatient")}
                        </div>

                        <div className="text-muted small">
                          {selectedSale.patient?.phone ||
                            t("dispensing.noPhone")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card border h-100">
                      <div className="card-body">
                        <h6 className="mb-3">
                          {t("dispensing.saleSummary")}
                        </h6>

                        <div className="d-flex justify-content-between">
                          <span>
                            {t("dispensing.total")}
                          </span>

                          <strong>
                            {Number(
                              selectedSale.totalAmount
                            ).toFixed(2)}{" "}
                            {t("common.egp")}
                          </strong>
                        </div>

                        <div className="d-flex justify-content-between mt-2">
                          <span>
                            {t("dispensing.paid")}
                          </span>

                          <strong className="text-success">
                            {Number(
                              selectedSale.paidAmount
                            ).toFixed(2)}{" "}
                            {t("common.egp")}
                          </strong>
                        </div>

                        {selectedSale.prescription && (
                          <div className="d-flex justify-content-between mt-2">
                            <span>
                              {t(
                                "dispensing.prescription"
                              )}
                            </span>

                            <span className="badge text-bg-info">
                              {
                                selectedSale
                                  .prescription
                                  .status
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <AdminDataPage
                      title={t(
                        "dispensing.medicines"
                      )}
                      subtitle={t(
                        "dispensing.medicinesInSale"
                      )}
                      loading={false}
                      data={
                        selectedSale.items || []
                      }
                      columns={medicineColumns}
                      emptyMessage={t(
                        "dispensing.noMedicines"
                      )}
                    />
                  </div>
                </>
              )}

              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="reason"
                  label={t("dispensing.dispensingReason")}
                  type="text"
                  placeholder={t(
                    "dispensing.reasonPlaceholder"
                  )}
                  required
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() =>
                  navigate("/dispenses")
                }
                disabled={formik.isSubmitting}
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  formik.isSubmitting ||
                  !selectedSale ||
                  !formik.values.reason.trim()
                }
              >
                {formik.isSubmitting
                  ? t("dispensing.dispensing")
                  : t(
                      "dispensing.confirmDispensing"
                    )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDispensed;