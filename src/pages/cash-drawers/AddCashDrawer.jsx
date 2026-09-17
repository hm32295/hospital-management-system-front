import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Wallet } from "lucide-react";

import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";

import {
  openCashDrawer,
} from "../../services/cashDrawer.service";

const AddCashDrawer = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      openingBalance: "",
      notes: "",
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError("");

        const response = await openCashDrawer({
          openingBalance: Number(values.openingBalance || 0),
          notes: values.notes,
        });

        console.log("Cash drawer opened:", response);

        navigate("/cash-drawers/current");
      } catch (error) {
        console.error("Open cash drawer error:", error);

        setServerError(
          error.response?.data?.message ||
            "Failed to open cash drawer"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Header
        title="Open Cash Drawer"
        description="Open a new cash drawer for today's operations"
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
              <div className="col-12 col-md-6">
                <FormInput
                  formik={formik}
                  name="openingBalance"
                  label="Opening Balance"
                  type="number"
                  placeholder="Enter opening balance"
                  required
                />
              </div>

              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="notes"
                  label="Notes"
                  type="text"
                  placeholder="Enter notes"
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
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting}
              >
                <Wallet size={18} className="me-2" />

                {formik.isSubmitting
                  ? "Opening..."
                  : "Open Cash Drawer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCashDrawer;