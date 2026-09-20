
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { supplierInitialValues } from "../../initialValues/supplier.initial";
import { createSupplier } from "../../services/supplier.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";
import { supplierSchema } from "../../schemas/supplire.schema";

const AddSupplier = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: supplierInitialValues,
    validationSchema: supplierSchema(t),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createSupplier(values);

        showSuccess(t("suppliers.createdSuccess"));

        navigate("/suppliers");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("suppliers.createFailed")
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
        title={t("suppliers.addSupplier")}
        description={t("suppliers.addSupplierDescription")}
        buttonContent={t("suppliers.backToSuppliers")}
        buttonLink="/suppliers"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="name"
                  label={t("suppliers.supplierName")}
                  type="text"
                  placeholder={t(
                    "suppliers.namePlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="email"
                  label={t("suppliers.email")}
                  type="email"
                  placeholder={t(
                    "suppliers.emailPlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="phone"
                  label={t("suppliers.phone")}
                  type="text"
                  placeholder={t(
                    "suppliers.phonePlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="address"
                  label={t("suppliers.address")}
                  type="text"
                  placeholder={t(
                    "suppliers.addressPlaceholder"
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
                  navigate("/suppliers")
                }
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
                  ? t("suppliers.adding")
                  : t("suppliers.addSupplier")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;