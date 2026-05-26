import React, { useState } from "react";
import "./style/SidebarRegulator.css";
import {
  FaHome,
  FaUsers,
  FaFolderOpen,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGripLinesVertical,
  FaBalanceScale,
} from "react-icons/fa";

const SidebarRegulator = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const getInitials = (name) => {
    if (!name) return "RG";
    return name.substring(0, 2).toUpperCase();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ตรวจสอบ URL ปัจจุบันเพื่อให้เมนูขึ้นแถบ Active ถูกหน้า
  const currentPath = window.location.pathname + window.location.search;

  return (
    <>
      {/* ปุ่ม Toggle สำหรับมือถือ */}
      <button
        className="regulator-sidebar-mobile-toggle"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay พื้นหลังเวลาเปิดเมนูบนมือถือ */}
      {isMobileOpen && (
        <div
          className="regulator-sidebar-overlay"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* กล่อง Sidebar */}
      <div
        className={`regulator-sidebar-container ${isOpen ? "open" : "closed"} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* ส่วนหัว Sidebar */}
        <div className="regulator-sidebar-header">
          <div className={`regulator-sidebar-brand ${!isOpen && "hidden"}`}>
            <div className="regulator-brand-icon-wrapper">
              <FaBalanceScale />
            </div>
            <h2 className="regulator-sidebar-title">Regulator Portal</h2>
          </div>

          <button className="regulator-desktop-toggle" onClick={toggleSidebar}>
            <FaGripLinesVertical />
          </button>
        </div>

        {/* เมนูนำทาง (ปรับปรุงตาม Requirement ของหน่วยงาน) */}
        <div className="regulator-sidebar-menu">
          <a
            href="/regulator-dashboard"
            className={`regulator-sidebar-item ${currentPath.includes("dashboard") ? "active" : ""}`}
          >
            <FaHome className="regulator-sidebar-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              แดชบอร์ด
            </span>
          </a>

          <a
            href="/regulator-user-manage"
            className={`regulator-sidebar-item ${currentPath.includes("/users") ? "active" : ""}`}
          >
            <FaUsers className="regulator-sidebar-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              จัดการบุคลากร
            </span>
          </a>

          <a
            href="/regulator-project-manage"
            className={`regulator-sidebar-item ${currentPath.includes("/projects") ? "active" : ""}`}
          >
            <FaFolderOpen className="regulator-sidebar-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              จัดการโครงการ
            </span>
          </a>

          {/* <a
            href="/regulator/inspections"
            className={`regulator-sidebar-item ${currentPath.includes("/inspections") ? "active" : ""}`}
          >
            <FaChartLine className="regulator-sidebar-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              ติดตามผลประเมิน
            </span>
          </a> */}
        </div>

        {/* ส่วนล่าง Sidebar */}
        <div className="regulator-sidebar-footer">
          <div className="regulator-bottom-menu">
            {/* <a
              href="/regulator/settings"
              className={`regulator-sidebar-item ${currentPath.includes("/settings") ? "active" : ""}`}
            >
              <FaCog className="regulator-sidebar-icon" />
              <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
                ตั้งค่าหน่วยงาน
              </span>
            </a> */}
            <button
              onClick={handleLogout}
              className="regulator-sidebar-item regulator-logout-btn"
            >
              <FaSignOutAlt className="regulator-sidebar-icon" />
              <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
                ออกจากระบบ
              </span>
            </button>
          </div>

          <div className="regulator-user-card">
            <div className="regulator-avatar">{getInitials(user?.name)}</div>
            <div className={`regulator-user-info ${!isOpen && "hidden"}`}>
              <p className="regulator-user-name">
                {user?.name || "Regulator User"}
              </p>
              <p className="regulator-user-role">ผู้กำกับดูแลหน่วยงาน</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarRegulator;
