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
import UnderConstruction from "./page/UnderConstruction"; // หน้า Under Construction

// Route Guards (สิทธิ์การเข้าถึง)
import UserRoute from "./route/UserRoute";
import AdminRoute from "./route/AdminRoute";
import RegulatorRoute from "./route/RegulatorRoute";
// ลบ ProviderRoute และ RegulatorRoute ออก เพราะไม่ใช้แล้ว

// Admin Pages
import AdminDashboard from "./page/admin/AdminDashboard";
import AdminOrganize from "./page/admin/AdminOrganize";

import AdminManageUser from "./page/admin/AdminManageUser";
import AdminViewOrganize from "./page/admin/AdminViewOrganize";
import AdminPrinciple from "./page/admin/AdminPrinciple";
import AdminMaturity from "./page/admin/AdminMaturity";
import AdminComponent from "./page/admin/AdminComponent";
import AdminMapping from "./page/admin/AdminMapping";
import AdminGuideline from "./page/admin/AdminGuideline"; // หน้าแนวทางการพัฒนา
import AdminClassroom from "./page/admin/AdminClassroom"; // หน้าเรียนของ Admin
import AdminAddChapter from "./page/admin/AdminAddChapter"; // หน้าเพิ่มบทเรียนของ Admin
import AdminEditChapter from "./page/admin/AdminEditChapter"; // หน้าแก้ไขบทเรียนของ Admin
import AdminCertificate from "./page/admin/AdminCertificate";
import AdminManageCertificate from "./page/admin/AdminManageCertificate";
import AdminUserDetail from "./page/admin/AdminUserDetail";
// User Pages
import UserDashboard from "./page/user/UserDashboard";
import UserSelectRole from "./page/user/UserSelectRole"; // หน้าเลือกบทบาท
import UserClassroom from "./page/user/UserClassroom"; // หน้าเรียน
import UserTest from "./page/user/UserTest"; // หน้าสอบ
import UserClassroomDetail from "./page/user/UserClassroomDetail"; // หน้าเรียนรายละเอียด
import UserCertificate from "./page/user/UserCertificate"; // หน้าใบประกาศนียบัตร
import UserTools from "./page/user/UserTools"; // หน้าเครื่องมือการเรียนรู้
import UserToolsCreate from "./page/user/UserToolsCreate";
import UserTestDetail from "./page/user/UserTestDetail";
import UserToolsResult from "./page/user/UserToolsResult";
import UserResult from "./page/user/UserResult"; // หน้าแสดงผลการสอบ

//Ragulator Pages
import RegulatorDashboard from "./page/regulator/RegulatorDashboard"; // หน้าแดชบอร์ดของ Regulator
import RegulatorUserManage from "./page/regulator/RegulatorUserManage";
import RegulatorProjectManage from "./page/regulator/RegulatorProjectManage";
import RegulatorViewProject from "./page/regulator/RegulatorViewProject";
import RegulatorViewUser from "./page/regulator/RegulatorViewUser";

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
          path="/admin-organize"
          element={
            <AdminRoute>
              <AdminOrganize />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-classroom"
          element={
            <AdminRoute>
              <AdminClassroom />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-classroom/add"
          element={
            <AdminRoute>
              <AdminAddChapter />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-classroom/edit/:id"
          element={
            <AdminRoute>
              <AdminEditChapter />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-user"
          element={
            <AdminRoute>
              <AdminManageUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-view-organize/:id"
          element={
            <AdminRoute>
              <AdminViewOrganize />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-principle"
          element={
            <AdminRoute>
              <AdminPrinciple />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-maturity"
          element={
            <AdminRoute>
              <AdminMaturity />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-component"
          element={
            <AdminRoute>
              <AdminComponent />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-mapping"
          element={
            <AdminRoute>
              <AdminMapping />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-guideline"
          element={
            <AdminRoute>
              <AdminGuideline />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-certificate"
          element={
            <AdminRoute>
              <AdminCertificate />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-manage-certificate"
          element={
            <AdminRoute>
              <AdminManageCertificate />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-user-detail/:id"
          element={
            <AdminRoute>
              <AdminUserDetail />
            </AdminRoute>
          }
        />

        {/* === Regulator Routes === */}
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
          path="/user-test-detail"
          element={
            <UserRoute>
              <UserTestDetail />
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
          path="/user-tools"
          element={
            <UserRoute>
              <UserTools />
            </UserRoute>
          }
        />
        <Route
          path="/user-tools-create"
          element={
            <UserRoute>
              <UserToolsCreate />
            </UserRoute>
          }
        />

        <Route
          path="/user-tools-result"
          element={
            <UserRoute>
              <UserToolsResult />
            </UserRoute>
          }
        />

        <Route
          path="/user-result"
          element={
            <UserRoute>
              <UserResult />
            </UserRoute>
          }
        />
        {/* --- เส้นทางสำหรับ Regulator --- */}

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
        <Route
          path="/regulator-view-project/:id"
          element={
            <RegulatorRoute>
              <RegulatorViewProject />
            </RegulatorRoute>
          }
        />

        <Route
          path="/regulator-view-user/:id"
          element={
            <RegulatorRoute>
              <RegulatorViewUser />
            </RegulatorRoute>
          }
        />

        {/* --- เส้นทางสำหรับหน้า Unauthorized (ถ้าไม่มีสิทธิ์เข้าถึง) --- */}
        <Route path="/unauthorized" element={<h1>403 - ไม่ได้รับอนุญาต</h1>} />
        <Route path="*" element={<UnderConstruction />} />
      </Routes>
    </Router>
  );
}

export default App;
