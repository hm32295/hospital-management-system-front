
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createOperationPayment } from "../../services/operationPaymentsService";
import FormInput from "../../components/form/FormInput";
import { showError, showSuccess } from "../../services/toast.service";
import { getApiErrorMessage } from "../../services/apiError";

const OperationPaymentForm = ({ operation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      amount: "",
      notes: "",
      doctor: operation?.doctor?._id || "",
    },
    validate: (values) => {
      const errors = {};
      const amount = Number(values.amount || 0);
      const remaining = Number(operation?.remainingAmount || 0);

      if (!values.amount) {
        errors.amount = t("operations.paymentAmountRequired");
      } else if (amount <= 0) {
        errors.amount = t("operations.paymentAmountGreaterThanZero");
      } else if (amount > remaining) {
        errors.amount = t("operations.paymentGreaterThanRemaining");
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          operation: operation._id,
          doctor: operation.doctor._id,
          amount: Number(values.amount),
          notes: values.notes || "",
        };

        const response = await createOperationPayment(payload);

        if (!response?.success) {
          throw new Error(
            response?.message ||
              t("operations.createPaymentFailed")
          );
        }

        showSuccess(
          response.message ||
            t("operations.paymentCreatedSuccess")
        );

        navigate(`/operations/${operation._id}`);
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("operations.createPaymentFailed")
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!operation) {
    return null;
  }

  const totalAmount = Number(operation.totalAmount || 0);
  const paidAmount = Number(operation.paidAmount || 0);
  const remainingAmount = Number(
    operation.remainingAmount || 0
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">
                {t("operations.operationPayment")}
              </h5>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    {t("operations.totalAmount")}
                  </small>

                  <strong>
                    {totalAmount.toFixed(2)}{" "}
                    {t("common.egp")}
                  </strong>
                </div>

                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    {t("operations.paidAmount")}
                  </small>

                  <strong className="text-success">
                    {paidAmount.toFixed(2)}{" "}
                    {t("common.egp")}
                  </strong>
                </div>

                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    {t("operations.remainingAmount")}
                  </small>

                  <strong className="text-danger">
                    {remainingAmount.toFixed(2)}{" "}
                    {t("common.egp")}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="amount"
            label={t("operations.paymentAmount")}
            type="number"
            min="0.01"
            max={remainingAmount}
            step="0.01"
            required
          />

          <small className="text-muted">
            {t("operations.maximumPayment")}:{" "}
            {remainingAmount.toFixed(2)}{" "}
            {t("common.egp")}
          </small>
        </div>

        <div className="col-12">
          <FormInput
            formik={formik}
            name="notes"
            label={t("operations.notes")}
            textarea
            placeholder={t(
              "operations.paymentNotesPlaceholder"
            )}
          />
        </div>

        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              navigate(
                `/operations/${operation._id}`
              )
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
              remainingAmount <= 0
            }
          >
            {formik.isSubmitting
              ? t("operations.processing")
              : t("operations.addPayment")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OperationPaymentForm;
