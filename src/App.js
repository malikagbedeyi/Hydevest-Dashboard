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
import ProtectedRoute from "./component/ProtectedRoute";
import Permission from "./component/Dashboard/Pages/Admin/Permission";
import PartnerPayment from "./component/Dashboard/Pages/Expensify/PartnerPayment";
import Inbox from "./component/Dashboard/Pages/Inbox/Requestbox";
import Requestbox from "./component/Dashboard/Pages/Inbox/Requestbox";
import Overview from "./component/Dashboard/Pages/Overview/Overview";



function App() {
  return (
    <PopupProvider>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<SignUp />} />

        {/* DASHBOARD LAYOUT */}
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>}>
          {/* OverView */}
          <Route path="overview" element = {<Overview />} />
          {/* Purchase */}
          <Route path="trip" element={<Trip />} />
          <Route path="container" element={<Container />} />

          {/* Sales */}
          <Route path="pre-sale" element={<PreSale />} />
          <Route path="sales" element={<Sale />} />
          <Route path="recovery" element={<Recovery />} />

          {/* Expensify */}
          <Route path="finance" element={<Finance />} />
          <Route path="payroll" element={<PayRoll />} />
          <Route path="partner_payment" element={<PartnerPayment />} />

          {/* Reports */}
          <Route path="report" element={<Report />} />
           {/* Inbox */}
          <Route path="requestbox" element={<Requestbox />} />

          {/* Partnership */}
          <Route path="allocation" element={<Allocation />} />
          <Route path="profit" element={<Profit />} />
          <Route path="partnerlot" element={<PartnerLot />} />

          {/* Accounts */}
          <Route path="/dashboard/accounts" element={<Account   />}>
  <Route path="system-user" element={<AccUser />} />
  <Route path="partner" element={<AccPartner />} />
  <Route path="invest" element={<AccInvest />} />
  <Route path="retailer" element={<AccRetailer />} />
  <Route path="supplier" element={<AccSupplier />} />
  <Route path="clearing-agent" element={<AccAgent />} />
  <Route path="bdc-operator" element={<AccOperator />} />
</Route>


          {/* Admin */}
          <Route path="admin/entity" element={<Entity />} />
          <Route path="admin/role" element={<RoleSetup />} />
          <Route path="admin/permission" element={<Permission />} />
          <Route path="admin/bonus" element={<Bonus />} />
          <Route path="admin/bank-account" element={<BankAccount />} />

          {/* Catch-all for unknown pages */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
        </Route>
      </Routes>
    </HashRouter>
    </PopupProvider>
  );
}

export default App;



