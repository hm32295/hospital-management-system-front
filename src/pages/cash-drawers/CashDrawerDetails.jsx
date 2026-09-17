import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/header/Header";

import {
  getSingleCashDrawer,
} from "../../services/cashDrawer.service";

const CashDrawerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drawer, setDrawer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

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

  if (serverError) {
    return (
      <div className="alert alert-danger">
        {serverError}
      </div>
    );
  }

  if (!drawer) return null;

  return (
    <div>
      <Header
        title="Cash Drawer Details"
        description="View cash drawer session details"
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-muted">
                Opening Balance
              </div>

              <h4>
                {Number(
                  drawer.openingBalance
                ).toFixed(2)}{" "}
                EGP
              </h4>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                Expected Cash
              </div>

              <h4>
                {Number(
                  drawer.expectedCash
                ).toFixed(2)}{" "}
                EGP
              </h4>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                Actual Cash
              </div>

              <h4>
                {drawer.status === "closed"
                  ? `${Number(
                      drawer.actualCash
                    ).toFixed(2)} EGP`
                  : "-"}
              </h4>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                Difference
              </div>

              <h4
                className={
                  drawer.difference === 0
                    ? "text-success"
                    : drawer.difference > 0
                    ? "text-primary"
                    : "text-danger"
                }
              >
                {drawer.status === "closed"
                  ? `${Number(
                      drawer.difference
                    ).toFixed(2)} EGP`
                  : "-"}
              </h4>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                Status
              </div>

              <span
                className={`badge ${
                  drawer.status === "open"
                    ? "text-bg-success"
                    : "text-bg-secondary"
                }`}
              >
                {drawer.status}
              </span>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                Opened By
              </div>

              <div className="fw-semibold">
                {drawer.openedBy?.name || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                Opened At
              </div>

              <div>
                {new Date(
                  drawer.openedAt
                ).toLocaleString("en-GB")}
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                Closed By
              </div>

              <div>
                {drawer.closedBy?.name || "-"}
              </div>
            </div>

            <div className="col-md-4">
              <div className="text-muted">
                Closed At
              </div>

              <div>
                {drawer.closedAt
                  ? new Date(
                      drawer.closedAt
                    ).toLocaleString("en-GB")
                  : "-"}
              </div>
            </div>

            <div className="col-12">
              <div className="text-muted">
                Notes
              </div>

              <div>
                {drawer.notes || "-"}
              </div>
            </div>
          </div>

          {drawer.status === "open" && (
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-danger"
                onClick={() =>
                  navigate(
                    `/cash-drawers/${drawer._id}/close`
                  )
                }
              >
                Close Cash Drawer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashDrawerDetails;