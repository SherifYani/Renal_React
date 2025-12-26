import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Reservations from "./pages/Reservations";
import Maintenance from "./pages/Maintenance";
import Analytics from "./pages/Analytics";
import Notfound from "./pages/Notfound";
function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
  );
}
export default AppRoutes;
