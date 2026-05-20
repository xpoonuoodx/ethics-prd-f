import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// หน้าทั่วไป (Public Pages)
import Home from "./page/Home";
import Dashboard from "./page/Dashboard";
import AboutBackground from "./page/AboutBackground";
import AboutPrinciples from "./page/AboutPrinciples";
import AboutProcess from "./page/AboutProcess";
import AboutParticipation from "./page/AboutParticipation";
import Contact from "./page/Contact";
import Login from "./page/Login";
import Register from "./page/Register";
import NewsDetail from "./page/NewsDetail";

// Route Guards (สิทธิ์การเข้าถึง)
import UserRoute from "./route/UserRoute";
import AdminRoute from "./route/AdminRoute";
import RegulatorRoute from "./route/RegulatorRoute";
// ลบ ProviderRoute และ RegulatorRoute ออก เพราะไม่ใช้แล้ว

// Admin Pages
import AdminDashboard from "./page/admin/AdminDashboard";

// User Pages
import UserDashboard from "./page/user/UserDashboard";
import UserSelectRole from "./page/user/UserSelectRole"; // หน้าเลือกบทบาท
import UserClassroom from "./page/user/UserClassroom"; // หน้าเรียน
import UserTest from "./page/user/UserTest"; // หน้าสอบ
import UserClassroomDetail from "./page/user/UserClassroomDetail"; // หน้าเรียนรายละเอียด
import UserCertificate from "./page/user/UserCertificate"; // หน้าใบประกาศนียบัตร

//Ragulator Pages
import RegulatorDashboard from "./page/regulator/RegulatorDashboard"; // หน้าแดชบอร์ดของ Regulator
import RegulatorUserManage from "./page/regulator/RegulatorUserManage";
import RegulatorProjectManage from "./page/regulator/RegulatorProjectManage";

function App() {
  return (
    <Router>
      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about/background" element={<AboutBackground />} />
        <Route path="/about/principles" element={<AboutPrinciples />} />
        <Route path="/about/process" element={<AboutProcess />} />
        <Route path="/about/participation" element={<AboutParticipation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/news/:id" element={<NewsDetail />} />

        {/* === Admin Routes === */}
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

        {/* === User Routes === */}
        {/* หน้าหลัก User */}
        <Route
          path="/user-dashboard"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

        {/* หน้าเลือกสายงาน (เรียน หรือ สอบ) */}
        <Route
          path="/user-select-role"
          element={
            <UserRoute>
              <UserSelectRole />
            </UserRoute>
          }
        />

        {/* หน้าห้องเรียน */}
        <Route
          path="/user-classroom"
          element={
            <UserRoute>
              <UserClassroom />
            </UserRoute>
          }
        />

        {/* หน้าทำแบบทดสอบ */}
        <Route
          path="/user-test"
          element={
            <UserRoute>
              <UserTest />
            </UserRoute>
          }
        />

        <Route
          path="/user-classroom-detail"
          element={
            <UserRoute>
              <UserClassroomDetail />
            </UserRoute>
          }
        />

        <Route
          path="/user-certificate"
          element={
            <UserRoute>
              <UserCertificate />
            </UserRoute>
          }
        />

        <Route
          path="/regulator-user-manage"
          element={
            <RegulatorRoute>
              <RegulatorUserManage />
            </RegulatorRoute>
          }
        />

        <Route
          path="/regulator-project-manage"
          element={
            <RegulatorRoute>
              <RegulatorProjectManage />
            </RegulatorRoute>
          }
        />

        {/* --- เส้นทางสำหรับหน้า Unauthorized (ถ้าไม่มีสิทธิ์เข้าถึง) --- */}
        <Route path="/unauthorized" element={<h1>403 - ไม่ได้รับอนุญาต</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
