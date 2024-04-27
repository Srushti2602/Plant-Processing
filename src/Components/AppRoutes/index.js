import { Route, Routes } from "react-router-dom";
import Customers from "../../Pages/Resources";
import Dashboard from "../../Pages/Dashboard";
import Usage from "../../Pages/Usage";
import Orders from "../../Pages/Monthly";
function AppRoutes() {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/usage" element={<Usage/>}></Route>
        <Route path="/orders" element={<Orders/>}></Route>
        <Route path="/customers" element={<Customers />}></Route>
      </Routes>
    );
  }
  export default AppRoutes;