import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { LockKeyhole } from "lucide-react";

import Header from "../../components/header/Header";
import FormInput from "../../components/form/FormInput";

import {
  getSingleCashDrawer,
  closeCashDrawer,
} from "../../services/cashDrawer.service";

const CloseCashDrawer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
        setServerError("");

        const response = await closeCashDrawer(id, {
          actualCash: Number(values.actualCash),
          notes: values.notes,
        });

        console.log("Drawer closed:", response);

        navigate(`/cash-drawers/${id}`);
      } catch (error) {
        console.error(
          "Close cash drawer error:",
          error
        );

        setServerError(
          error.response?.data?.message ||
            "Failed to close cash drawer"
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
          await getSingleCashDrawer(id);

        setDrawer(response.cashDrawer);
      } catch (error) {
        setServerError(
          error.response?.data?.message ||
            "Failed to load cash drawer"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDrawer();
  }, [id]);

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
        Cash drawer not found
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

  return (
    <div>
      <Header
        title="Close Cash Drawer"
        description="Count the actual cash and close the drawer"
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
                    Opening Balance
                  </div>

                  <h4>
                    {Number(
                      drawer.openingBalance
                    ).toFixed(2)}{" "}
                    EGP
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border">
                <div className="card-body">
                  <div className="text-muted small">
                    Expected Cash
                  </div>

                  <h4 className="text-primary">
                    {expectedCash.toFixed(2)} EGP
                  </h4>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border">
                <div className="card-body">
                  <div className="text-muted small">
                    Difference
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
                    {difference.toFixed(2)} EGP
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
                  label="Actual Cash"
                  type="number"
                  placeholder="Enter actual cash"
                  required
                />
              </div>

              <div className="col-12">
                <FormInput
                  formik={formik}
                  name="notes"
                  label="Notes"
                  type="text"
                  placeholder="Enter closing notes"
                />
              </div>
            </div>

            <div className="alert alert-warning mt-4">
              Expected cash:{" "}
              <strong>
                {expectedCash.toFixed(2)} EGP
              </strong>
              <br />
              Actual cash:{" "}
              <strong>
                {actualCash.toFixed(2)} EGP
              </strong>
              <br />
              Difference:{" "}
              <strong>
                {difference.toFixed(2)} EGP
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
              >
                Cancel
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
                  ? "Closing..."
                  : "Close Cash Drawer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CloseCashDrawer;