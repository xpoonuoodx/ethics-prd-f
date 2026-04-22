import React, { useState } from "react";
import "./style/SidebarUser.css";
import {
  FaHome,
  FaBookOpen,
  FaTools,
  FaFileDownload,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGripLinesVertical, // ใช้เป็นไอคอน Toggle คล้ายๆ ในรูป
} from "react-icons/fa";

const SidebarUser = () => {
  // ค่าเริ่มต้นให้เปิด Sidebar (สำหรับ Desktop)
  const [isOpen, setIsOpen] = useState(true);
  // สำหรับมือถือโดยเฉพาะ
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // ดึงตัวอักษรย่อของชื่อมาใส่ใน Avatar (เช่น นามสมมติ "Somchai" -> "SO")
  const getInitials = (name) => {
    if (!name) return "US";
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

  return (
    <>
      {/* ปุ่ม Toggle สำหรับมือถือ (แสดงเฉพาะหน้าจอเล็ก) */}
      <button className="su-mobile-toggle" onClick={toggleMobileSidebar}>
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay สำหรับมือถือ */}
      {isMobileOpen && (
        <div className="su-mobile-overlay" onClick={toggleMobileSidebar}></div>
      )}

      {/* กล่อง Sidebar หลัก */}
      <div
        className={`su-container ${isOpen ? "open" : "closed"} ${isMobileOpen ? "mobile-open" : ""}`}
      >
        {/* ================= ส่วนหัว Sidebar (Logo & Toggle) ================= */}
        <div className="su-header">
          <div className={`su-brand ${!isOpen && "hidden"}`}>
            {/* โลโก้จำลอง คล้ายๆ ในรูป */}
            <div className="su-brand-icon-wrapper">
              <span className="su-brand-sparkle">❈</span>
            </div>
            <h2 className="su-brand-title">BDE THE ETHIC AI PLATFORM</h2>
          </div>

          {/* ปุ่มย่อ/ขยาย Sidebar (เฉพาะ Desktop) */}
          <button className="su-desktop-toggle" onClick={toggleSidebar}>
            <FaGripLinesVertical />
          </button>
        </div>

        {/* ================= เมนูนำทางส่วนบน (Main Menu) ================= */}
        <div className="su-menu">
          <a href="/user-dashboard" className="su-menu-item active">
            <FaHome className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>แดชบอร์ด</span>
          </a>

          <a href="/user-classroom" className="su-menu-item">
            <FaBookOpen className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>
              สื่อการเรียนรู้
            </span>
          </a>

          <a href="/user-tools" className="su-menu-item">
            <FaTools className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>เครื่องมือ</span>
          </a>

          <a href="/user-download" className="su-menu-item">
            <FaFileDownload className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>
              ดาวน์โหลดเอกสาร
            </span>
          </a>
        </div>

        {/* ================= เมนูส่วนล่าง (Footer Menu & User Card) ================= */}
        <div className="su-footer">
          <div className="su-bottom-menu">
            <a href="/user/settings" className="su-menu-item">
              <FaCog className="su-icon" />
              <span className={`su-text ${!isOpen && "hidden"}`}>
                ตั้งค่าบัญชี
              </span>
            </a>
            <button
              onClick={handleLogout}
              className="su-menu-item su-logout-btn"
            >
              <FaSignOutAlt className="su-icon" />
              <span className={`su-text ${!isOpen && "hidden"}`}>
                ออกจากระบบ
              </span>
            </button>
          </div>

          {/* การ์ดผู้ใช้งาน (User Card) */}
          <div className="su-user-card">
            <div className="su-avatar">{getInitials(user?.name)}</div>
            <div className={`su-user-info ${!isOpen && "hidden"}`}>
              <p className="su-user-name">{user?.name || "ผู้ใช้งานระบบ"}</p>
              <p className="su-user-email">
                {user?.username || "user@email.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarUser;
