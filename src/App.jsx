import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Billing from "./components/Billing";
import Plans from "./components/Plans";
import Layout from "./components/Layout";
import CreatePlan from "./components/CreatePlan";
import Transactions from "./components/Transactions";
import TopUp from "./components/TopUp";
import Interviews from "./components/Interviews";
import AssignPlan from "./components/AssignPlan";
import Admin from "./components/Admin";
import AdminPlans from "./components/AdminPlans";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="billing" element={<Billing/>}></Route>
          <Route path="create-plans" element={<CreatePlan/>}></Route>
          <Route path="plans" element={<Plans/>}></Route>
          <Route path="register" element={<Register/>}></Route>
          <Route path="transactions" element={<Transactions/>}></Route>
          <Route path="topup" element={<TopUp/>}></Route>
          <Route path="interviews" element={<Interviews/>}></Route>
          <Route path="assign-plan" element={<AssignPlan/>}></Route>
          <Route path="admin" element={<Admin/>}></Route>
          <Route path="user-plans/:customerId" element={<AdminPlans/>}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
