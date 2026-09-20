
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Wallet } from "lucide-react";

import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";
import FormSearchSelect from "../../components/form/FormSearchSelect";

import {
  getCurrentCashDrawer,
} from "../../services/cashDrawer.service";

import {
  createExpense,
} from "../../services/expense.service";

import {
  showError,
  showSuccess,
} from "../../services/toast.service";

import { getApiErrorMessage } from "../../services/apiError";

const AddExpense = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [drawer, setDrawer] = useState(null);
  const [loadingDrawer, setLoadingDrawer] =
    useState(true);

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
        if (!drawer) {
          showError(
            t("expense.noOpenCashDrawer")
          );
          return;
        }

        const response =
          await createExpense({
            cashDrawer: drawer._id,
            amount: Number(values.amount),
            category: values.category,
            description:
              values.description,
            paymentMethod:
              values.paymentMethod,
            notes: values.notes,
          });

        showSuccess(
          response?.message ||
            t("expense.createdSuccess")
        );

        navigate("/expenses");
      } catch (error) {
        showError(
          getApiErrorMessage(
            error,
            t("expense.createFailed")
          )
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

        showError(
          getApiErrorMessage(
            error,
            t("expense.failedLoadCashDrawer")
          )
        );
      } finally {
        setLoadingDrawer(false);
      }
    };

    fetchDrawer();
  }, []);

  const options = () => {
    return [
      "supplies",
      "maintenance",
      "transportation",
      "utilities",
      "salary",
      "other",
    ].map((item) => ({
      value: item,
      label: t(
        `expense.categories.${item}`
      ),
    }));
  };

  if (loadingDrawer) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          role="status"
        />
        <div className="mt-2">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={t("expense.addExpense")}
        description={t(
          "expense.addExpenseDescription"
        )}
      />

      {!drawer && (
        <div className="alert alert-warning">
          {t("expense.noOpenCashDrawer")}

          <button
            className="btn btn-sm btn-primary ms-3"
            onClick={() =>
              navigate(
                "/cash-drawers/open"
              )
            }
          >
            {t("expense.openCashDrawer")}
          </button>
        </div>
      )}

      {drawer && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="alert alert-info">
              {t(
                "expense.currentExpectedCash"
              )}
              :{" "}
              <strong>
                {Number(
                  drawer.expectedCash
                ).toFixed(2)}{" "}
                {t("common.egp")}
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
                    label={t(
                      "expense.amount"
                    )}
                    type="number"
                    placeholder={t(
                      "expense.amountPlaceholder"
                    )}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <FormSearchSelect
                    formik={formik}
                    name="category"
                    label={t(
                      "expense.category"
                    )}
                    type="select"
                    placeholder={t(
                      "expense.categoryPlaceholder"
                    )}
                    required
                    options={options()}
                  />
                </div>

                <div className="col-12">
                  <FormInput
                    formik={formik}
                    name="description"
                    label={t(
                      "expense.description"
                    )}
                    type="text"
                    placeholder={t(
                      "expense.descriptionPlaceholder"
                    )}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <FormInput
                    formik={formik}
                    name="paymentMethod"
                    label={t(
                      "expense.paymentMethod"
                    )}
                    type="text"
                    value="cash"
                    disabled
                  />
                </div>

                <div className="col-12">
                  <FormInput
                    formik={formik}
                    name="notes"
                    label={t(
                      "expense.notes"
                    )}
                    type="text"
                    placeholder={t(
                      "expense.notesPlaceholder"
                    )}
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
                  {t("common.cancel")}
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
                    ? t("expense.saving")
                    : t("expense.saveExpense")}
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