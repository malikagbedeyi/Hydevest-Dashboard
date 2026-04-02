import { HashRouter, Routes, Route } from "react-router-dom";
import SignUp from "./component/Authentication/SignUp";
import { PopupProvider } from "./context/PopupContext";
import DashboardPage from "./component/Dashboard/DashboardPage";

// Purchase
import Trip from "./component/Dashboard/Pages/Purchase/Trip";
import Container from "./component/Dashboard/Pages/Purchase/Container";

// Sales
import PreSale from "./component/Dashboard/Pages/Sale/PreSale";
import Sale from "./component/Dashboard/Pages/Sale/Sale";
import Recovery from "./component/Dashboard/Pages/Sale/Recovery";

// Expensify
import Finance from "./component/Dashboard/Pages/Expensify/Finance";
import PayRoll from "./component/Dashboard/Pages/Expensify/PayRoll";
import PartnerPayment from "./component/Dashboard/Pages/Expensify/PartnerPayment";

// Accounts
import Account from "./component/Dashboard/Pages/Account/Account";
import AccUser from "./component/Dashboard/Pages/Account/AccUser";
import AccPartner from "./component/Dashboard/Pages/Account/AccPartner";
import AccInvest from "./component/Dashboard/Pages/Account/AccInvest";
import AccRetailer from "./component/Dashboard/Pages/Account/AccRetailer";
import AccSupplier from "./component/Dashboard/Pages/Account/AccSupplier";
import AccAgent from "./component/Dashboard/Pages/Account/AccAgent";
import AccOperator from "./component/Dashboard/Pages/Account/AccOperator";

// Reports
import Report from "./component/Dashboard/Pages/Report/Report";

// Partnership
import Allocation from "./component/Dashboard/Pages/PartnerShip/Allocation";
import Profit from "./component/Dashboard/Pages/PartnerShip/Profit";
import PartnerLot from "./component/Dashboard/Pages/PartnerShip/PartnerLot";

// Admin
import Entity from "./component/Dashboard/Pages/Admin/Entity";
import RoleSetup from "./component/Dashboard/Pages/Admin/RoleSetup";
import Bonus from "./component/Dashboard/Pages/Admin/Bonus";
import BankAccount from "./component/Dashboard/Pages/Admin/BankAccount";
import Permission from "./component/Dashboard/Pages/Admin/Permission";

// Others
import ProtectedRoute from "./component/ProtectedRoute";
import Requestbox from "./component/Dashboard/Pages/Inbox/Requestbox";
import Overview from "./component/Dashboard/Pages/Overview/Overview";
import PermissionRoute from "./context/PermissionRoute";
import PageNotFound from "./component/Dashboard/PageNotFound";

function App() {
  return (
    <PopupProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<SignUp />} />

          {/* DASHBOARD LAYOUT */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            {/* Overview */}
            <Route
              path="overview"
              element={
                <PermissionRoute permission="Fontend_can_view_overview">
                  <Overview />
                </PermissionRoute>
              }
            />

            {/* Purchase */}
            <Route path="trip" element={<PermissionRoute permission="Fontend_can.view.trips"><Trip /></PermissionRoute>} />
            <Route path="container" element={<PermissionRoute permission="Fontend_can.view.containers"><Container /></PermissionRoute>} />

            {/* Sales */}
            <Route path="pre-sale" element={<PermissionRoute permission="Fontend_can.view.presales"><PreSale /></PermissionRoute>} />
            <Route path="sales" element={<PermissionRoute permission="Fontend_can.view.sales"><Sale /></PermissionRoute>} />
            <Route path="recovery" element={<PermissionRoute permission="Fontend_can.view.recoveries"><Recovery /></PermissionRoute>} />

            {/* Expensify */}
            <Route path="finance" element={<PermissionRoute permission="Fontend_can.view.finance"><Finance /></PermissionRoute>} />
            <Route path="payroll" element={<PermissionRoute permission="Fontend_can.view.payroll"><PayRoll /></PermissionRoute>} />
            <Route path="partner_payment" element={<PermissionRoute permission="Fontend_can.view.partner_payments"><PartnerPayment /></PermissionRoute>} />

            {/* Reports */}
            <Route path="report" element={<PermissionRoute permission="Fontend_can_view_reports"><Report /></PermissionRoute>} />

            {/* Requestbox / Inbox */}
            <Route path="requestbox" element={<PermissionRoute permission="Fontend_can_view_inbox"><Requestbox /></PermissionRoute>} />

            {/* Partnership */}
            <Route path="allocation" element={<PermissionRoute permission="Fontend_can.view.allocations"><Allocation /></PermissionRoute>} />
            <Route path="profit" element={<PermissionRoute permission="Fontend_can.view.profits"><Profit /></PermissionRoute>} />
            <Route path="partnerlot" element={<PermissionRoute permission="Fontend_can.view.partnerlots"><PartnerLot /></PermissionRoute>} />

            {/* Accounts  */}
            <Route
              path="/dashboard/accounts"
              element={
                <PermissionRoute permission="Fontend_can_view_accounts">
                  <Account />
                </PermissionRoute>
              }
            >
              <Route path="system-user" element={<PermissionRoute permission="Fontend_Fontend_can.view.system_users"><AccUser /></PermissionRoute>} />
              <Route path="partner" element={<PermissionRoute permission="Fontend_Fontend_can.view.partners"><AccPartner /></PermissionRoute>} />
              <Route path="invest" element={<PermissionRoute permission="Fontend_Fontend_can.view.investors"><AccInvest /></PermissionRoute>} />
              <Route path="retailer" element={<PermissionRoute permission="Fontend_Fontend_can.view.retailers"><AccRetailer /></PermissionRoute>} />
              <Route path="supplier" element={<PermissionRoute permission="Fontend_Fontend_can.view.suppliers"><AccSupplier /></PermissionRoute>} />
              <Route path="clearing-agent" element={<PermissionRoute permission="Fontend_Fontend_can.view.agents"><AccAgent /></PermissionRoute>} />
              <Route path="bdc-operator" element={<PermissionRoute permission="Fontend_Fontend_can.view.operators"><AccOperator /></PermissionRoute>} />
            </Route>

            {/* Admin Section  */}
            <Route path="admin/entity" element={<PermissionRoute permission="Fontend_can.view.entities"><Entity /></PermissionRoute>} />
            <Route path="admin/role" element={<PermissionRoute permission="Fontend_can.view.roles"><RoleSetup /></PermissionRoute>} />
            <Route path="admin/permission" element={<PermissionRoute permission="Fontend_can.view.permissions"><Permission /></PermissionRoute>} />
            <Route path="admin/bonus" element={<PermissionRoute permission="Fontend_can.view.bonuses"><Bonus /></PermissionRoute>} />
            <Route path="admin/bank-account" element={<PermissionRoute permission="Fontend_can.view.bank_accounts"><BankAccount /></PermissionRoute>} />

            {/* Catch-all for unknown pages */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </PopupProvider>
  );
}

export default App;