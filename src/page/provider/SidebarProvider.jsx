import React, { useState } from "react";
import "./style/SidebarProvider.css"; // อย่าลืมสร้างไฟล์ CSS นี้ด้วยนะครับ
import {
  FaHome,
  FaBuilding,
  FaClipboardList,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { getStoredUser } from "../../api/Api";

const SidebarProvider = () => {
  const [isOpen, setIsOpen] = useState(true);
  const user = getStoredUser();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* ปุ่ม Toggle สำหรับมือถือ */}
      <button
        className="provider-sidebar-mobile-toggle"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* กล่อง Sidebar */}
      <div
        className={`provider-sidebar-container ${isOpen ? "open" : "closed"}`}
      >
        {/* ส่วนหัว Sidebar */}
        <div className="provider-sidebar-header">
          <div className="provider-sidebar-brand">
            <FaBuilding className="provider-sidebar-brand-icon" />
            <h2 className={`provider-sidebar-title ${!isOpen && "hidden"}`}>
              Provider Panel
            </h2>
          </div>
        </div>

        {/* เมนูนำทาง */}
        <div className="provider-sidebar-menu">
          <a href="/provider" className="provider-sidebar-item active">
            <FaHome className="provider-sidebar-icon" />
            <span className={`provider-sidebar-text ${!isOpen && "hidden"}`}>
              หน้าหลัก
            </span>
          </a>

          <a href="/provider/services" className="provider-sidebar-item">
            <FaClipboardList className="provider-sidebar-icon" />
            <span className={`provider-sidebar-text ${!isOpen && "hidden"}`}>
              จัดการบริการ
            </span>
          </a>

          <a href="/provider/reports" className="provider-sidebar-item">
            <FaChartPie className="provider-sidebar-icon" />
            <span className={`provider-sidebar-text ${!isOpen && "hidden"}`}>
              รายงานผล
            </span>
          </a>

          <a href="/provider/settings" className="provider-sidebar-item">
            <FaCog className="provider-sidebar-icon" />
            <span className={`provider-sidebar-text ${!isOpen && "hidden"}`}>
              ตั้งค่าโปรไฟล์
            </span>
          </a>
        </div>

        {/* ส่วนล่าง Sidebar */}
        <div className="provider-sidebar-footer">
          <div className={`provider-sidebar-user-info ${!isOpen && "hidden"}`}>
            <p className="provider-sidebar-user-name">
              {user?.name || "Provider"}
            </p>
            <p className="provider-sidebar-user-role">ผู้ให้บริการ</p>
          </div>
          <button
            onClick={handleLogout}
            className="provider-sidebar-logout-btn"
          >
            <FaSignOutAlt className="provider-sidebar-logout-icon" />
            <span className={`provider-sidebar-text ${!isOpen && "hidden"}`}>
              ออกจากระบบ
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarProvider;
