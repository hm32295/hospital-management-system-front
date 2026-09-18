import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import RoleRoute from "./RoleRoute";
import { ROLES } from "../constants/roles";

import Medicines from "../pages/medicines/Medicines";
import MedicinesSingle from "../pages/medicines/MedicinesSingle";
import AddMedicine from "../pages/medicines/AddMedicine";
import EditMedicine from "../pages/medicines/EditMedicine";

import Categories from "../pages/categories/Categories";
import AddCategory from "../pages/categories/AddCategory";
import EditCategory from "../pages/categories/EditCategory";
import SingleCategory from "../pages/categories/SingleCategory";

import Supplier from "../pages/supplier/Supplier";
import EditSupplier from "../pages/supplier/EditSupplier";
import AddSupplier from "../pages/supplier/AddSupplier";
import SingleSupplier from "../pages/supplier/SingletSupplier";

import Batches from "../pages/batches/Batches";
import AddBatches from "../pages/batches/AddBatches";
import SingleBatches from "../pages/batches/SingleBatches";
import EditBatches from "../pages/batches/EditBatches";

import StockTransaction from "../pages/stockTransactions/StockTransactions";
import SingleStockTransaction from "../pages/stockTransactions/SingleStockTransactions";
import AddStockTransaction from "../pages/stockTransactions/AddStockTransactions";

import Users from "../pages/users/Users";
import EditUser from "../pages/users/EditUser";
import SingleUser from "../pages/users/SingleUsers";

import Purchases from "../pages/purchases/Purchases";
import SinglePurchases from "../pages/purchases/SinglePurchases";
import AddPurchases from "../pages/purchases/AddPurchases";

import AddDispensed from "../pages/dispensed/AddDispensed";
import Dispensed from "../pages/dispensed/Dispensed";
import SingleDispensed from "../pages/dispensed/SingleDispensed";

import Sales from "../pages/sales/Sales";

import Stock from "../pages/stock/Stock";
import ExpiryBatches from "../pages/stock/ExpiryBatches";
import LowStock from "../pages/stock/LowStock";
import ExpiredBatches from "../pages/stock/ExpiredBatches";

import CashDrawers from "../pages/cash-drawers/CashDrawers";
import AddCashDrawer from "../pages/cash-drawers/AddCashDrawer";
import CurrentCashDrawer from "../pages/cash-drawers/CurrentCashDrawer";
import CashDrawerDetails from "../pages/cash-drawers/CashDrawerDetails";
import CloseCashDrawer from "../pages/cash-drawers/CloseCashDrawer";

import Expenses from "../pages/expenses/Expenses";
import AddExpense from "../pages/expenses/AddExpense";

import Dashboard from "../pages/dashboard/Dashboard";

import Reception from "../pages/reception/Reception";

import Doctors from "../pages/doctors/Doctors";
import Specialties from "../pages/specialties/Specialties";

import Visits from "../pages/visits/Visits";
import VisitDetails from "../pages/visits/VisitDetails";
import DoctorConsultation from "../pages/doctors/DoctorConsultation";

import PatientDetails from "../pages/patients/PatientDetails";
import Patients from "../pages/patients/Patients";

import OperationsPage from "../pages/operations/OperationsPage";
import OperationForm from "../pages/operations/OperationForm";
import OperationDetails from "../pages/operations/OperationDetails";

import OperationPaymentPage from "../pages/operationPayment/OperationPaymentPage";
import DoctorSettlementPage from "../pages/doctorSettlement/DoctorSettlementPage";

import IncomePage from "../pages/income/IncomePage";
import ExpensesReportPage from "../pages/expenses/ExpensesReportPage";
import CashTransactionDetailsPage from "../pages/income/CashTransactionDetailsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== Public ==================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==================== Protected ==================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            {/* ==================== Dashboard ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.DOCTOR,
                    ROLES.NURSE,
                    ROLES.PHARMACIST,
                    ROLES.RECEPTIONIST,
                    ROLES.LAB_TECHNICIAN,
                    ROLES.PATIENT,
                  ]}
                />
              }
            >
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/"
                element={<Dashboard />}
              />
            </Route>

            {/* ==================== Reception ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.RECEPTIONIST,
                  ]}
                />
              }
            >
              <Route
                path="/reception"
                element={<Reception />}
              />
            </Route>

            {/* ==================== Patients ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.DOCTOR,
                    ROLES.NURSE,
                    ROLES.RECEPTIONIST,
                  ]}
                />
              }
            >
              <Route
                path="/patients"
                element={<Patients />}
              />

              <Route
                path="/patients/:id"
                element={<PatientDetails />}
              />
            </Route>

            {/* ==================== Doctors ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.RECEPTIONIST,
                  ]}
                />
              }
            >
              <Route
                path="/doctors"
                element={<Doctors />}
              />
            </Route>

            {/* ==================== Specialties ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                  ]}
                />
              }
            >
              <Route
                path="/specialties"
                element={<Specialties />}
              />
            </Route>

            {/* ==================== Visits ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.DOCTOR,
                    ROLES.NURSE,
                    ROLES.RECEPTIONIST,
                  ]}
                />
              }
            >
              <Route
                path="/visits"
                element={<Visits />}
              />

              <Route
                path="/visits/:id"
                element={<VisitDetails />}
              />
            </Route>

            {/* ==================== Doctor Consultation ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.DOCTOR,
                  ]}
                />
              }
            >
              <Route
                path="/visits/:id/consultation"
                element={<DoctorConsultation />}
              />
            </Route>

            {/* ==================== Operations ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.DOCTOR,
                  ]}
                />
              }
            >
              <Route
                path="/operations"
                element={<OperationsPage />}
              />

              <Route
                path="/operations/add"
                element={<OperationForm />}
              />

              <Route
                path="/operations/edit/:id"
                element={<OperationForm />}
              />

              <Route
                path="/operations/:id"
                element={<OperationDetails />}
              />

              <Route
                path="/operations/:id/payment"
                element={<OperationPaymentPage />}
              />

              <Route
                path="/operations/:id/settlement"
                element={<DoctorSettlementPage />}
              />
            </Route>

            {/* ==================== Pharmacy ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                  ]}
                />
              }
            >

              {/* Medicines */}

              <Route
                path="/medicines"
                element={<Medicines />}
              />

              <Route
                path="/add-medicine"
                element={<AddMedicine />}
              />

              <Route
                path="/medicines/:id"
                element={<MedicinesSingle />}
              />

              <Route
                path="/medicines/edit/:id"
                element={<EditMedicine />}
              />

              {/* Categories */}

              <Route
                path="/categories"
                element={<Categories />}
              />

              <Route
                path="/add-categories"
                element={<AddCategory />}
              />

              <Route
                path="/categories/edit/:id"
                element={<EditCategory />}
              />

              <Route
                path="/categories/:id"
                element={<SingleCategory />}
              />

              {/* Suppliers */}

              <Route
                path="/Suppliers"
                element={<Supplier />}
              />

              <Route
                path="/Suppliers/:id"
                element={<SingleSupplier />}
              />

              <Route
                path="/Suppliers/edit/:id"
                element={<EditSupplier />}
              />

              <Route
                path="/add-Suppliers"
                element={<AddSupplier />}
              />

              {/* Batches */}

              <Route
                path="/batches"
                element={<Batches />}
              />

              <Route
                path="/add-batches"
                element={<AddBatches />}
              />

              <Route
                path="/batches/:id"
                element={<SingleBatches />}
              />

              <Route
                path="/batches/edit/:id"
                element={<EditBatches />}
              />

              {/* Sales */}

              <Route
                path="/sales"
                element={<Sales />}
              />

              {/* Dispensing */}

              <Route
                path="/dispenses"
                element={<Dispensed />}
              />

              <Route
                path="/add-dispense"
                element={<AddDispensed />}
              />

              <Route
                path="/dispenses/:id"
                element={<SingleDispensed />}
              />

              {/* Purchases */}

              <Route
                path="/purchases"
                element={<Purchases />}
              />

              <Route
                path="/purchases/:id"
                element={<SinglePurchases />}
              />

              <Route
                path="/add-purchases"
                element={<AddPurchases />}
              />

              {/* Stock */}

              <Route
                path="/Stock"
                element={<Stock />}
              />

              <Route
                path="/expiry-batches"
                element={<ExpiryBatches />}
              />

              <Route
                path="/expiry-batches/:id"
                element={<ExpiryBatches />}
              />

              <Route
                path="/low-stock/"
                element={<LowStock />}
              />

              <Route
                path="/low-stock/:id"
                element={<LowStock />}
              />

              <Route
                path="/expired-batches/"
                element={<ExpiredBatches />}
              />

              <Route
                path="/expired-batches/:id"
                element={<ExpiredBatches />}
              />

              {/* Stock Transactions */}

              <Route
                path="/stock-transaction"
                element={<StockTransaction />}
              />

              <Route
                path="/stock-transaction/:id"
                element={<SingleStockTransaction />}
              />

              <Route
                path="/add-stock-transaction"
                element={<AddStockTransaction />}
              />

            </Route>

            {/* ==================== Cash Drawers ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.PHARMACIST,
                    ROLES.RECEPTIONIST,
                  ]}
                />
              }
            >
              <Route
                path="/cash-drawers"
                element={<CashDrawers />}
              />

              <Route
                path="/cash-drawers/open"
                element={<AddCashDrawer />}
              />

              <Route
                path="/cash-drawers/current"
                element={<CurrentCashDrawer />}
              />

              <Route
                path="/cash-drawers/:id"
                element={<CashDrawerDetails />}
              />

              <Route
                path="/cash-drawers/:id/close"
                element={<CloseCashDrawer />}
              />
            </Route>

            {/* ==================== Finance ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                  ]}
                />
              }
            >
              <Route
                path="/income"
                element={<IncomePage />}
              />

              <Route
                path="/expenses"
                element={<Expenses />}
              />

              <Route
                path="/expenses/add"
                element={<AddExpense />}
              />

              <Route
                path="/expenses-report"
                element={<ExpensesReportPage />}
              />

              <Route
                path="/cash-transactions/:id"
                element={<CashTransactionDetailsPage />}
              />
            </Route>

            {/* ==================== Users ==================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                  ]}
                />
              }
            >
              <Route
                path="/users"
                element={<Users />}
              />

              <Route
                path="/users/:id"
                element={<SingleUser />}
              />

              <Route
                path="/users/edit/:id"
                element={<EditUser />}
              />
            </Route>

          </Route>
        </Route>

        {/* ==================== Not Found ==================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;