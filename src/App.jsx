import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import Dashboard from "./page/Dashboard";
import AboutBackground from "./page/AboutBackground";
import AboutPrinciples from "./page/AboutPrinciples";
import AboutProcess from "./page/AboutProcess";
import AboutParticipation from "./page/AboutParticipation";
import Contact from "./page/Contact";
import Login from "./page/Login";
import Register from "./page/Register";

// Route
import UserRoute from "./route/UserRoute";
import AdminRoute from "./route/AdminRoute";
import ProviderRoute from "./route/ProviderRoute";
import RegulatorRoute from "./route/RegulatorRoute";

// Admin
import AdminDashboard from "./page/admin/AdminDashboard";

// Regulator
import RegulatorDashboard from "./page/regulator/RegulatorDashboard";

// Provider
import ProviderDashboard from "./page/provider/ProviderDashboard";
// User
import UserDashboard from "./page/user/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about/background" element={<AboutBackground />} />
        <Route path="/about/principles" element={<AboutPrinciples />} />
        <Route path="/about/process" element={<AboutProcess />} />
        <Route path="/about/participation" element={<AboutParticipation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/regulator-dashboard"
          element={
            <RegulatorRoute>
              <RegulatorDashboard />
            </RegulatorRoute>
          }
        />
        <Route
          path="/provider-dashboard"
          element={
            <ProviderRoute>
              <ProviderDashboard />
            </ProviderRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

        {/* --- เส้นทางสำหรับหน้า Unauthorized (ถ้าไม่มีสิทธิ์เข้าถึง) --- */}
        <Route path="/unauthorized" element={<h1>403 - ไม่ได้รับอนุญาต</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
