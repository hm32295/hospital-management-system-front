
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { LockKeyhole } from "lucide-react";
import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import {
  getSingleCashDrawer,
  closeCashDrawer,
} from "../../services/cashDrawer.service";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const CloseCashDrawer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [drawer, setDrawer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      actualCash: "",
      notes: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await closeCashDrawer(id, {
          actualCash: Number(values.actualCash),
          notes: values.notes,
        });

        showSuccess(
          response?.message ||
            t("cashDrawers.closeSuccess")
        );

        navigate(`/cash-drawers/${id}`);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          t("cashDrawers.closeFailed")
        );

        setServerError(message);
        showError(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchDrawer = async () => {
      try {
        const response = await getSingleCashDrawer(id);
        setDrawer(response.cashDrawer);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          t("cashDrawers.loadFailed")
        );

        setServerError(message);
        showError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawer();
  }, [id, t]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    );
  }

  if (!drawer) {
    return (
      <div className="alert alert-danger">
        {serverError ||
          t("cashDrawers.notFound")}
      </div>
    );
  }

  const expectedCash = Number(
    drawer.expectedCash || 0
  );

  const actualCash = Number(
    formik.values.actualCash || 0
  );

  const difference =
    actualCash - expectedCash;

  const formatMoney = (value) =>
    `${Number(value || 0).toFixed(2)} ${t("common.egp")}`;

  return (
    <div>
      <Header
        title={t("cashDrawers.closeTitle")}
        description={t(
          "cashDrawers.closeDescription"
        )}
        buttonContent={t(
          "cashDrawers.backToCurrent"
        )}
        buttonLink="/cash-drawers/current"
      />

      {serverError && (
        <div className="alert alert-danger">
          {serverError}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card border">
                <div className="card-body">
                  <div className="text-muted small">
                    {t("cashDrawers.openingBalance")}
                  </div>
                  <h4>
                    {formatMoney(
                      drawer.openingBalance
                    )}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border">
                <div className="card-body">
                  <div className="text-muted small">
                    {t("cashDrawers.expectedCash")}
                  </div>
                  <h4 className="text-primary">
                    {formatMoney(expectedCash)}
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border">
                <div className="card-body">
                  <div className="text-muted small">
                    {t("cashDrawers.difference")}
                  </div>
                  <h4
                    className={
                      difference === 0
                        ? "text-success"
                        : difference > 0
                        ? "text-primary"
                        : "text-danger"
                    }
                  >
                    {formatMoney(difference)}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <form onSubmit={formik.handleSubmit}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="actualCash"
                  label={t("cashDrawers.actualCash")}
                  type="number"
                  placeholder={t(
                    "cashDrawers.actualCashPlaceholder"
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
                    "cashDrawers.closingNotesPlaceholder"
                  )}
                />
              </div>
            </div>

            <div className="alert alert-warning mt-4">
              {t("cashDrawers.expectedCash")}:{" "}
              <strong>
                {formatMoney(expectedCash)}
              </strong>
              <br />
              {t("cashDrawers.actualCash")}:{" "}
              <strong>
                {formatMoney(actualCash)}
              </strong>
              <br />
              {t("cashDrawers.difference")}:{" "}
              <strong>
                {formatMoney(difference)}
              </strong>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() =>
                  navigate(
                    "/cash-drawers/current"
                  )
                }
                disabled={formik.isSubmitting}
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                className="btn btn-danger"
                disabled={formik.isSubmitting}
              >
                <LockKeyhole
                  size={18}
                  className="me-2"
                />
                {formik.isSubmitting
                  ? t("cashDrawers.closing")
                  : t("cashDrawers.closeDrawer")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CloseCashDrawer;