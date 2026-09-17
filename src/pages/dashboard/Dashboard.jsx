import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Banknote as FaCashRegister,
  BanknoteArrowDown as FaMoneyBillWave,
  ShoppingCart as FaShoppingCart,
  Receipt as FaReceipt,
  Boxes as FaBoxes,
  TriangleAlert as FaExclamationTriangle,
  Clock as FaClock
} from "lucide-react";


import { getDashboard } from "../../services/dashboard.service";

import "./dashboard.css";
import Header from "../../components/header/Header";


const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // Fetch Dashboard
  // ==========================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboard();

      if (response.success) {
        setData(response.dashboard);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboard();
  }, []);


  // ==========================================
  // Currency
  // ==========================================

  const formatMoney = (value = 0) => {
    return `${Number(value).toLocaleString("en-US")} EGP`;
  };


  // ==========================================
  // Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <>
        <Header title="Dashboard" />

        <div className="dashboard-loading">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      </>
    );
  }


  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <>
        <Header title="Dashboard" />

        <div className="dashboard-page">
          <div className="alert alert-danger">
            {error}
          </div>

          <button
            className="btn btn-primary"
            onClick={fetchDashboard}
          >
            Try Again
          </button>
        </div>
      </>
    );
  }


  if (!data) {
    return null;
  }


  const {
    financial,
    sales,
    cashDrawer,
    inventory,
    recentSales,
    recentDispensing,
  } = data;


  return (
    <>
      <Header title="Dashboard" />

      <div className="dashboard-page">

        {/* ========================================
            Header
        ======================================== */}

        <div className="dashboard-header">
          <h2>Dashboard</h2>

          <p>
            Overview of your pharmacy
          </p>
        </div>


        {/* ========================================
            Financial Cards
        ======================================== */}

        <div className="row g-3">

          {/* Today's Sales */}

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-card">
              <div className="dashboard-card-body">

                <div className="d-flex justify-content-between align-items-start">

                  <div>
                    <div className="dashboard-card-title">
                      Today's Sales
                    </div>

                    <div className="dashboard-card-value">
                      {formatMoney(
                        financial.todaySales
                      )}
                    </div>

                    <div className="dashboard-card-subtitle">
                      {financial.todaySalesCount} sales
                    </div>
                  </div>

                  <FaShoppingCart size={25} />
                </div>

              </div>
            </div>
          </div>


          {/* Today's Payments */}

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-card">
              <div className="dashboard-card-body">

                <div className="d-flex justify-content-between align-items-start">

                  <div>
                    <div className="dashboard-card-title">
                      Today's Payments
                    </div>

                    <div className="dashboard-card-value">
                      {formatMoney(
                        financial.todayPayments
                      )}
                    </div>

                    <div className="dashboard-card-subtitle">
                      {financial.todayPaymentsCount} payments
                    </div>
                  </div>

                  <FaMoneyBillWave size={25} />
                </div>

              </div>
            </div>
          </div>


          {/* Today's Expenses */}

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-card">
              <div className="dashboard-card-body">

                <div className="d-flex justify-content-between align-items-start">

                  <div>
                    <div className="dashboard-card-title">
                      Today's Expenses
                    </div>

                    <div className="dashboard-card-value">
                      {formatMoney(
                        financial.todayExpenses
                      )}
                    </div>

                    <div className="dashboard-card-subtitle">
                      {financial.todayExpensesCount} expenses
                    </div>
                  </div>

                  <FaReceipt size={25} />
                </div>

              </div>
            </div>
          </div>


          {/* Net Cash */}

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="dashboard-card">
              <div className="dashboard-card-body">

                <div className="d-flex justify-content-between align-items-start">

                  <div>
                    <div className="dashboard-card-title">
                      Net Cash Today
                    </div>

                    <div className="dashboard-card-value">
                      {formatMoney(
                        financial.netCash
                      )}
                    </div>

                    <div className="dashboard-card-subtitle">
                      Payments - Expenses
                    </div>
                  </div>

                  <FaCashRegister size={25} />
                </div>

              </div>
            </div>
          </div>

        </div>


        {/* ========================================
            Sales + Cash Drawer
        ======================================== */}

        <div className="row g-3 dashboard-section">

          {/* Sales Overview */}

          <div className="col-12 col-lg-7">

            <div className="dashboard-card">

              <div className="dashboard-card-body">

                <div className="dashboard-section-title">
                  Sales Overview
                </div>


                <div className="row g-3">

                  {/* Today */}

                  <div className="col-12 col-md-4">

                    <div className="border rounded p-3">

                      <div className="text-muted small">
                        Today
                      </div>

                      <div className="fs-5 fw-bold mt-1">
                        {formatMoney(
                          sales.today.amount
                        )}
                      </div>

                      <div className="text-muted small">
                        {sales.today.count} sales
                      </div>

                    </div>

                  </div>


                  {/* Week */}

                  <div className="col-12 col-md-4">

                    <div className="border rounded p-3">

                      <div className="text-muted small">
                        This Week
                      </div>

                      <div className="fs-5 fw-bold mt-1">
                        {formatMoney(
                          sales.week.amount
                        )}
                      </div>

                      <div className="text-muted small">
                        {sales.week.count} sales
                      </div>

                    </div>

                  </div>


                  {/* Month */}

                  <div className="col-12 col-md-4">

                    <div className="border rounded p-3">

                      <div className="text-muted small">
                        This Month
                      </div>

                      <div className="fs-5 fw-bold mt-1">
                        {formatMoney(
                          sales.month.amount
                        )}
                      </div>

                      <div className="text-muted small">
                        {sales.month.count} sales
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Cash Drawer */}

          <div className="col-12 col-lg-5">

            <div className="cash-drawer-box">

              <div className="dashboard-section-title">
                Cash Drawer
              </div>


              {cashDrawer ? (

                <>

                  <div className="cash-drawer-status open">

                    <span>●</span>

                    OPEN

                  </div>


                  <div className="row g-3">

                    <div className="col-6">

                      <div className="text-muted small">
                        Opening Balance
                      </div>

                      <div className="cash-drawer-value">
                        {formatMoney(
                          cashDrawer.openingBalance
                        )}
                      </div>

                    </div>


                    <div className="col-6">

                      <div className="text-muted small">
                        Expected Cash
                      </div>

                      <div className="cash-drawer-value">
                        {formatMoney(
                          cashDrawer.expectedCash
                        )}
                      </div>

                    </div>

                  </div>


                  <hr />


                  <div className="small text-muted">
                    Opened by
                  </div>

                  <div className="fw-semibold">
                    {cashDrawer.openedBy?.name ||
                      cashDrawer.openedBy?.email ||
                      "-"}
                  </div>


                  <div className="small text-muted mt-2">
                    Opened at
                  </div>

                  <div>
                    {formatDate(
                      cashDrawer.openedAt
                    )}
                  </div>


                  <button
                    className="btn btn-outline-primary btn-sm mt-3"
                    onClick={() =>
                      navigate(
                        `/cash-drawers/${cashDrawer.id}`
                      )
                    }
                  >
                    View Cash Drawer
                  </button>

                </>

              ) : (

                <>

                  <div className="text-center py-3">

                    <FaCashRegister
                      size={35}
                    />

                    <h6 className="mt-3">
                      No Open Cash Drawer
                    </h6>

                    <p className="text-muted small">
                      Open a cash drawer to start
                      receiving payments.
                    </p>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        navigate(
                          "/cash-drawers/open"
                        )
                      }
                    >
                      Open Cash Drawer
                    </button>

                  </div>

                </>

              )}

            </div>

          </div>

        </div>


        {/* ========================================
            Inventory + Alerts
        ======================================== */}

        <div className="row g-3 dashboard-section">

          {/* Inventory */}

          <div className="col-12 col-md-6">

            <div className="dashboard-card">

              <div className="dashboard-card-body">

                <div className="dashboard-section-title">
                  Inventory
                </div>


                <div className="inventory-item">

                  <span className="inventory-label">
                    Total Medicines
                  </span>

                  <span className="inventory-value">
                    {inventory.totalMedicines}
                  </span>

                </div>


                <div className="inventory-item">

                  <span className="inventory-label">
                    Low Stock
                  </span>

                  <span className="inventory-value">
                    {inventory.lowStock}
                  </span>

                </div>


                <div className="inventory-item">

                  <span className="inventory-label">
                    Expiring Soon
                  </span>

                  <span className="inventory-value">
                    {inventory.expiringSoon}
                  </span>

                </div>


                <div className="inventory-item">

                  <span className="inventory-label">
                    Expired
                  </span>

                  <span className="inventory-value">
                    {inventory.expired}
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* Alerts */}

          <div className="col-12 col-md-6">

            <div className="dashboard-card">

              <div className="dashboard-card-body">

                <div className="dashboard-section-title">
                  Inventory Alerts
                </div>


                <div className="inventory-item">

                  <span>
                    <FaExclamationTriangle
                      className="me-2"
                    />

                    Expired Medicines
                  </span>

                  <span className="badge text-bg-danger">
                    {inventory.expired}
                  </span>

                </div>


                <div className="inventory-item">

                  <span>
                    <FaClock
                      className="me-2"
                    />

                    Expiring Within{" "}
                    {inventory.expiryAlertDays} Days
                  </span>

                  <span className="badge text-bg-warning">
                    {inventory.expiringSoon}
                  </span>

                </div>


                <div className="inventory-item">

                  <span>
                    <FaBoxes
                      className="me-2"
                    />

                    Low Stock
                  </span>

                  <span className="badge text-bg-secondary">
                    {inventory.lowStock}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================
            Recent Sales
        ======================================== */}

        <div className="dashboard-section">

          <div className="dashboard-section-title">
            Recent Sales
          </div>


          <div className="dashboard-table table-responsive">

            <table className="table table-hover">

              <thead>

                <tr>

                  <th>Patient</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>

                </tr>

              </thead>


              <tbody>

                {recentSales?.length > 0 ? (

                  recentSales.map((sale) => (

                    <tr key={sale._id}>

                      <td>

                        {sale.patient?.name ||
                          "Walk-in Patient"}

                      </td>


                      <td>
                        {sale.items?.length || 0}
                      </td>


                      <td>
                        {formatMoney(
                          sale.totalAmount
                        )}
                      </td>


                      <td>

                        <span
                          className={`badge ${
                            sale.paymentStatus === "paid"
                              ? "text-bg-success"
                              : sale.paymentStatus === "partial"
                              ? "text-bg-warning"
                              : "text-bg-danger"
                          }`}
                        >
                          {sale.paymentStatus}
                        </span>

                      </td>


                      <td>
                        {formatDate(
                          sale.createdAt
                        )}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="dashboard-empty"
                    >
                      No sales found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ========================================
            Recent Dispensing
        ======================================== */}

        <div className="dashboard-section">

          <div className="dashboard-section-title">
            Recent Dispensing
          </div>


          <div className="dashboard-table table-responsive">

            <table className="table table-hover">

              <thead>

                <tr>

                  <th>Patient</th>
                  <th>Medicines</th>
                  <th>Sale</th>
                  <th>Dispensed By</th>
                  <th>Date</th>

                </tr>

              </thead>


              <tbody>

                {recentDispensing?.length > 0 ? (

                  recentDispensing.map(
                    (dispensing) => (

                      <tr
                        key={dispensing._id}
                      >

                        <td>
                          {dispensing.patient
                            ?.name ||
                            "-"}
                        </td>


                        <td>
                          {dispensing.items
                            ?.length || 0}
                        </td>


                        <td>

                          {dispensing.sale
                            ? formatMoney(
                                dispensing.sale
                                  .totalAmount
                              )
                            : "-"}

                        </td>


                        <td>
                          {dispensing.createdBy
                            ?.name ||
                            dispensing.createdBy
                              ?.email ||
                            "-"}
                        </td>


                        <td>
                          {formatDate(
                            dispensing.createdAt
                          )}
                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="dashboard-empty"
                    >
                      No dispensing records found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
};


export default Dashboard;