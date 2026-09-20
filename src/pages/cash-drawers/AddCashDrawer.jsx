
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Wallet } from "lucide-react";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import { openCashDrawer } from "../../services/cashDrawer.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const AddCashDrawer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      openingBalance: "",
      notes: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await openCashDrawer({
          openingBalance: Number(values.openingBalance || 0),
          notes: values.notes,
        });

        showSuccess(
          response?.message ||
            t("cashDrawers.openSuccess")
        );

        navigate("/cash-drawers/");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("cashDrawers.openFailed")
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
        title={t("cashDrawers.openTitle")}
        description={t("cashDrawers.openDescription")}
        buttonContent={t("cashDrawers.backToCashDrawers")}
        buttonLink="/cash-drawers"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="openingBalance"
                  label={t("cashDrawers.openingBalance")}
                  type="number"
                  placeholder={t(
                    "cashDrawers.openingBalancePlaceholder"
                  )}
                  required
                />
              </div>

              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="notes"
                  label={t("cashDrawers.notes")}
                  type="text"
                  placeholder={t(
                    "cashDrawers.notesPlaceholder"
                  )}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() =>
                  navigate("/cash-drawers")
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
                <Wallet size={18} className="me-2" />
                {formik.isSubmitting
                  ? t("cashDrawers.opening")
                  : t("cashDrawers.openDrawer")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCashDrawer;
