
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  createDoctorSettlement,
} from "../../services/doctorSettlements.service";

import {
  showError,
  showSuccess,
} from "../../services/toast.service";

import { getApiErrorMessage } from "../../services/apiError";

import FormInput from "../../components/form/FormInput";

const DoctorSettlementForm = ({
  operation,
  remainingAmount,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      amount: "",
      notes: "",
    },

    validate: (values) => {
      const errors = {};

      const amount = Number(values.amount || 0);
      const remaining = Number(
        remainingAmount || 0
      );

      if (!values.amount) {
        errors.amount = t(
          "doctorSettlement.amountRequired"
        );
      } else if (amount <= 0) {
        errors.amount = t(
          "doctorSettlement.amountGreaterThanZero"
        );
      } else if (amount > remaining) {
        errors.amount = t(
          "doctorSettlement.amountExceedsRemaining",
          {
            amount: remaining.toFixed(2),
          }
        );
      }

      if (
        values.notes &&
        values.notes.length > 1000
      ) {
        errors.notes = t(
          "doctorSettlement.notesMaxLength"
        );
      }

      return errors;
    },

    onSubmit: async (
      values,
      { setSubmitting, resetForm }
    ) => {
      try {
        const payload = {
          operation: operation._id,
          amount: Number(values.amount),
          notes: values.notes || "",
        };

        const response =
          await createDoctorSettlement(
            payload
          );

        showSuccess(
          response?.message ||
            t(
              "doctorSettlement.createdSuccess"
            )
        );

        resetForm();

        if (onSuccess) {
          onSuccess(response);
        } else {
          navigate(
            `/operations/${operation._id}`
          );
        }
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t(
              "doctorSettlement.createFailed"
            )
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <div className="alert alert-info mb-0">
            <div className="d-flex justify-content-between">
              <span>
                {t(
                  "doctorSettlement.remainingDoctorFee"
                )}
              </span>

              <strong>
                {Number(
                  remainingAmount || 0
                ).toFixed(2)}{" "}
                {t("common.egp")}
              </strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="amount"
            label={t(
              "doctorSettlement.settlementAmount"
            )}
            type="number"
            min="0.01"
            max={remainingAmount}
            step="0.01"
            required
          />
        </div>

        <div className="col-12">
          <FormInput
            formik={formik}
            name="notes"
            label={t(
              "doctorSettlement.notes"
            )}
            textarea
            placeholder={t(
              "doctorSettlement.notesPlaceholder"
            )}
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-success"
            disabled={
              formik.isSubmitting ||
              Number(
                remainingAmount || 0
              ) <= 0
            }
          >
            {formik.isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                {t(
                  "doctorSettlement.processing"
                )}
              </>
            ) : (
              t(
                "doctorSettlement.payDoctor"
              )
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DoctorSettlementForm;