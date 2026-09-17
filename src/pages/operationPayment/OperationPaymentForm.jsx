import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOperationPayment } from "../../services/operationPaymentsService";
import FormInput from "../../components/form/FormInput";


const OperationPaymentForm = ({ operation }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      amount: "",
      notes: "",
      doctor:operation.doctor._id
    },

    validate: (values) => {
      const errors = {};

      const amount = Number(values.amount || 0);
      const remaining = Number(
        operation?.remainingAmount || 0
      );

      if (!values.amount) {
        errors.amount = "Payment amount is required";
      } else if (amount <= 0) {
        errors.amount =
          "Payment amount must be greater than 0";
      } else if (amount > remaining) {
        errors.amount =
          "Payment cannot be greater than remaining amount";
      }

      return errors;
    },

    onSubmit: async (
      values,
      { setSubmitting }
    ) => {
      try {
        const payload = {
          operation: operation._id,
          doctor :operation.doctor._id,
          amount: Number(values.amount),
          notes: values.notes || "",
        };

        const response = await createOperationPayment(payload);

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to create payment"
          );
        }

        toast.success(
          response.message ||
            "Payment created successfully"
        );

        navigate(
          `/operations/${operation._id}`
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to create payment"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!operation) {
    return null;
  }

  const totalAmount = Number(
    operation.totalAmount || 0
  );

  const paidAmount = Number(
    operation.paidAmount || 0
  );

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
                Operation Payment
              </h5>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    Total Amount
                  </small>

                  <strong>
                    {totalAmount.toFixed(2)} EGP
                  </strong>
                </div>

                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    Paid Amount
                  </small>

                  <strong className="text-success">
                    {paidAmount.toFixed(2)} EGP
                  </strong>
                </div>

                <div className="col-12 col-md-4">
                  <small className="text-muted d-block">
                    Remaining Amount
                  </small>

                  <strong className="text-danger">
                    {remainingAmount.toFixed(2)} EGP
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
            label="Payment Amount"
            type="number"
            min="0.01"
            max={remainingAmount}
            step="0.01"
            required
          />

          <small className="text-muted">
            Maximum payment:{" "}
            {remainingAmount.toFixed(2)} EGP
          </small>
        </div>

        <div className="col-12">
          <FormInput
            formik={formik}
            name="notes"
            label="Notes"
            textarea
            placeholder="Enter payment notes..."
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
            Cancel
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
              ? "Processing..."
              : "Add Payment"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OperationPaymentForm;