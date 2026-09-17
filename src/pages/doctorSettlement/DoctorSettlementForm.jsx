
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createDoctorSettlement } from "../../services/doctorSettlements.service";
import FormInput from "../../components/form/FormInput";

const DoctorSettlementForm = ({
  operation,
  remainingAmount,
  onSuccess,
}) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      amount: "",
      notes: "",
    },

    validate: (values) => {
      const errors = {};

      const amount = Number(values.amount || 0);
      const remaining = Number(remainingAmount || 0);

      if (!values.amount) {
        errors.amount = "Settlement amount is required";
      } else if (amount <= 0) {
        errors.amount = "Settlement amount must be greater than 0";
      } else if (amount > remaining) {
        errors.amount = `Amount cannot exceed ${remaining}`;
      }

      if (values.notes && values.notes.length > 1000) {
        errors.notes = "Notes cannot exceed 1000 characters";
      }

      return errors;
    },

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          operation: operation._id,
          amount: Number(values.amount),
          notes: values.notes || "",
        };

        const response = await createDoctorSettlement(payload);

        toast.success(
          response?.message || "Doctor settlement created successfully"
        );

        resetForm();

        if (onSuccess) {
          onSuccess(response);
        } else {
          navigate(`/operations/${operation._id}`);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to create doctor settlement"
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
              <span>Remaining Doctor Fee</span>
              <strong>{Number(remainingAmount || 0).toFixed(2)} EGP</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <FormInput
            formik={formik}
            name="amount"
            label="Settlement Amount"
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
            label="Notes"
            textarea
            placeholder="Enter settlement notes..."
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-success"
            disabled={
              formik.isSubmitting ||
              Number(remainingAmount || 0) <= 0
            }
          >
            {formik.isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Processing...
              </>
            ) : (
              "Pay Doctor"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DoctorSettlementForm;
