import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  LockKeyhole,
  RefreshCw,
  Plus,
} from "lucide-react";

import Header from "../../components/header/Header";

import {
  getCurrentCashDrawer,
} from "../../services/cashDrawer.service";

const CurrentCashDrawer = () => {
  const navigate = useNavigate();

  const [drawer, setDrawer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  const fetchDrawer = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await getCurrentCashDrawer();

      setDrawer(response.cashDrawer);
    } catch (error) {
      if (error.response?.status === 404) {
        setDrawer(null);
      } else {
        setServerError(
          error.response?.data?.message ||
            "Failed to load cash drawer"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawer();
  }, []);

  return (
    <div>
      <Header
        title="Current Cash Drawer"
        description="View and manage the currently open cash drawer"
      />

      {serverError && (
        <div className="alert alert-danger">
          {serverError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" />
        </div>
      ) : !drawer ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <Wallet size={45} className="text-muted mb-3" />

            <h5>No Open Cash Drawer</h5>

            <p className="text-muted">
              There is currently no open cash drawer.
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/cash-drawers/open")
              }
            >
              <Plus size={18} className="me-2" />
              Open Cash Drawer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-secondary"
              onClick={fetchDrawer}
            >
              <RefreshCw size={17} className="me-2" />
              Refresh
            </button>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">
                    Opening Balance
                  </div>

                  <h3 className="mt-2 mb-0">
                    {Number(
                      drawer.openingBalance
                    ).toFixed(2)}{" "}
                    EGP
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">
                    Expected Cash
                  </div>

                  <h3 className="mt-2 mb-0 text-success">
                    {Number(
                      drawer.expectedCash
                    ).toFixed(2)}{" "}
                    EGP
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">
                    Status
                  </div>

                  <div className="mt-2">
                    <span className="badge text-bg-success">
                      OPEN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="text-muted small">
                    Opened At
                  </div>

                  <div className="fw-semibold mt-2">
                    {new Date(
                      drawer.openedAt
                    ).toLocaleString("en-GB")}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-4">
                    Cash Drawer Information
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="text-muted small">
                        Opened By
                      </div>

                      <div className="fw-semibold">
                        {drawer.openedBy?.name ||
                          "-"}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="text-muted small">
                        Email
                      </div>

                      <div className="fw-semibold">
                        {drawer.openedBy?.email ||
                          "-"}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="text-muted small">
                        Notes
                      </div>

                      <div>
                        {drawer.notes || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        navigate(
                          `/cash-drawers/${drawer._id}/close`
                        )
                      }
                    >
                      <LockKeyhole
                        size={18}
                        className="me-2"
                      />
                      Close Cash Drawer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentCashDrawer;