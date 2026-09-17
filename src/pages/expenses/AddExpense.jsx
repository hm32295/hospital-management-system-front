import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Wallet } from "lucide-react";

import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";

import {
  getCurrentCashDrawer,
} from "../../services/cashDrawer.service";

import {
  createExpense,
} from "../../services/expense.service";
import FormSearchSelect from "../../components/form/FormSearchSelect";

const AddExpense = () => {
  const navigate = useNavigate();

  const [drawer, setDrawer] = useState(null);
  const [loadingDrawer, setLoadingDrawer] =
    useState(true);

  const [serverError, setServerError] =
    useState("");

  const formik = useFormik({
    initialValues: {
      amount: "",
      category: "",
      description: "",
      paymentMethod: "cash",
      notes: "",
    },

    onSubmit: async (
      values,
      { setSubmitting }
    ) => {
      try {
        setServerError("");
        if (!drawer) {setServerError("There is no open cash drawer" );
          return;
        }

        const response = await createExpense({
          cashDrawer: drawer._id,
          amount: Number(values.amount),
          category: values.category,
          description: values.description,
          paymentMethod:
            values.paymentMethod,
          notes: values.notes,
        });

        console.log(
          "Expense created:",
          response
        );

        navigate("/expenses");
      } catch (error) {
        console.error(
          "Create expense error:",
          error
        );

        setServerError(
          error.response?.data?.message ||
            "Failed to create expense"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchDrawer = async () => {
      try {
        const response =
          await getCurrentCashDrawer();

        setDrawer(response.cashDrawer);
      } catch (error) {
        setDrawer(null);
      } finally {
        setLoadingDrawer(false);
      }
    };

    fetchDrawer();
  }, []);
  const options = () => {
    return ["supplies", "maintenance", "transportation", "utilities", "salary", "other"]
      .map(item => {
        return {value: item,label:item}
    })
  }
  if (loadingDrawer) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Add Expense"
        description="Record an expense from the current cash drawer"
      />

      {!drawer && (
        <div className="alert alert-warning">
          There is no open cash drawer.
          <button
            className="btn btn-sm btn-primary ms-3"
            onClick={() =>
              navigate(
                "/cash-drawers/open"
              )
            }
          >
            Open Cash Drawer
          </button>
        </div>
      )}

      {serverError && (
        <div className="alert alert-danger">
          {serverError}
        </div>
      )}

      {drawer && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="alert alert-info">
              Current Expected Cash:{" "}
              <strong>
                {Number(
                  drawer.expectedCash
                ).toFixed(2)}{" "}
                EGP
              </strong>
            </div>

            <form
              onSubmit={formik.handleSubmit}
            >
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <FormInput
                    formik={formik}
                    name="amount"
                    label="Amount"
                    type="number"
                    placeholder="Enter expense amount"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <FormSearchSelect
                    formik={formik}
                    name="category"
                    label="Category"
                    type="select"
                    placeholder="e.g. Electricity"
                    required
                    options={options()}
                    
                  />
                </div>

                <div className="col-12">
                  <FormInput
                    formik={formik}
                    name="description"
                    label="Description"
                    type="text"
                    placeholder="Enter expense description"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <FormInput
                    formik={formik}
                    name="paymentMethod"
                    label="Payment Method"
                    type="text"
                    value="cash"
                    disabled
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
                    navigate("/expenses")
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    formik.isSubmitting
                  }
                >
                  <Wallet
                    size={18}
                    className="me-2"
                  />

                  {formik.isSubmitting
                    ? "Saving..."
                    : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddExpense;