import React, { useState } from "react";
import "./style/SidebarRegulator.css"; // อย่าลืมสร้างไฟล์ CSS ด้วยนะครับ
import {
  FaHome,
  FaBalanceScale,
  FaFileSignature,
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SidebarRegulator = () => {
  const [isOpen, setIsOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

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
        className="regulator-sidebar-mobile-toggle"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* กล่อง Sidebar */}
      <div
        className={`regulator-sidebar-container ${isOpen ? "open" : "closed"}`}
      >
        {/* ส่วนหัว Sidebar */}
        <div className="regulator-sidebar-header">
          <div className="regulator-sidebar-brand">
            <FaBalanceScale className="regulator-sidebar-brand-icon" />
            <h2 className={`regulator-sidebar-title ${!isOpen && "hidden"}`}>
              Regulator
            </h2>
          </div>
        </div>

        {/* เมนูนำทาง */}
        <div className="regulator-sidebar-menu">
          <a href="/regulator" className="regulator-sidebar-item active">
            <FaHome className="regulator-sidebar-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              หน้าหลัก
            </span>
          </a>

          <a href="/regulator/approvals" className="regulator-sidebar-item">
            <FaFileSignature className="regulator-sidebar-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              ตรวจสอบและอนุมัติ
            </span>
          </a>

          <a href="/regulator/inspections" className="regulator-sidebar-item">
            <FaSearch className="regulator-sidebar-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              ติดตามการประเมิน
            </span>
          </a>

          <a href="/regulator/settings" className="regulator-sidebar-item">
            <FaCog className="regulator-sidebar-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              ตั้งค่าระบบย่อย
            </span>
          </a>
        </div>

        {/* ส่วนล่าง Sidebar */}
        <div className="regulator-sidebar-footer">
          <div className={`regulator-sidebar-user-info ${!isOpen && "hidden"}`}>
            <p className="regulator-sidebar-user-name">
              {user?.name || "Regulator"}
            </p>
            <p className="regulator-sidebar-user-role">ผู้กำกับดูแล</p>
          </div>
          <button
            onClick={handleLogout}
            className="regulator-sidebar-logout-btn"
          >
            <FaSignOutAlt className="regulator-sidebar-logout-icon" />
            <span className={`regulator-sidebar-text ${!isOpen && "hidden"}`}>
              ออกจากระบบ
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarRegulator;
