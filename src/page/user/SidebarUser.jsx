import React, { useState } from "react";
import "./style/SidebarUser.css";
import {
  FaHome,
  FaBookOpen,
  FaClipboardCheck,
  FaTools,
  FaFileDownload,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGripLinesVertical,
  FaCertificate,
} from "react-icons/fa";
import { getStoredUser } from "../../api/Api";

const SidebarUser = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = getStoredUser();

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
    localStorage.clear();
    window.location.href = "/login";
  };

  // ตรวจสอบ URL ปัจจุบันเพื่อให้เมนูขึ้นแถบ Active ถูกหน้า
  const currentPath = window.location.pathname + window.location.search;

  return (
    <>
      {/* ปุ่ม Toggle สำหรับหน้าจอมือถือ */}
      <button className="su-mobile-toggle" onClick={toggleMobileSidebar}>
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay พื้นหลังเวลาเปิดเมนูบนมือถือ */}
      {isMobileOpen && (
        <div className="su-mobile-overlay" onClick={toggleMobileSidebar}></div>
      )}

      {/* ตัว Sidebar */}
      <aside
        className={`su-container ${isOpen ? "open" : "closed"} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* ================= Header ================= */}
        <div className="su-header">
          <div className={`su-brand ${!isOpen && "hidden"}`}>
            <div className="su-brand-icon-wrapper">
              <span className="su-brand-sparkle">❈</span>
            </div>
            <h2 className="su-brand-title">BDE AI ETHIC</h2>
          </div>

          {/* <button className="su-desktop-toggle" onClick={toggleSidebar}>
            <FaGripLinesVertical />
          </button> */}
        </div>

        {/* ================= Main Menu ================= */}
        <nav className="su-menu">
          <a
            href="/user-dashboard"
            className={`su-menu-item ${
              currentPath === "/user-dashboard" ? "active" : ""
            }`}
            title="แดชบอร์ด"
          >
            <FaHome className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>แดชบอร์ด</span>
          </a>

          <a
            href="/user-classroom"
            className={`su-menu-item ${
              currentPath.includes("type=learn") ||
              currentPath.includes("classroom")
                ? "active"
                : ""
            }`}
            title="สื่อการเรียนรู้"
          >
            <FaBookOpen className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>
              สื่อการเรียนรู้
            </span>
          </a>

          <a
            href="/user-test"
            className={`su-menu-item ${
              currentPath.includes("type=test") ||
              currentPath.includes("user-test")
                ? "active"
                : ""
            }`}
            title="แบบทดสอบ"
          >
            <FaClipboardCheck className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>แบบทดสอบ</span>
          </a>

          <a
            href="/user-tools"
            className={`su-menu-item ${
              currentPath === "/user-tools" ? "active" : ""
            }`}
            title="เครื่องมือ"
          >
            <FaTools className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>เครื่องมือ</span>
          </a>

          <a
            href="/user-certificate"
            className={`su-menu-item ${
              currentPath === "/user-certificate" ? "active" : ""
            }`}
            title="ใบประกาศนียบัตร"
          >
            <FaCertificate className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>ใบประกาศนียบัตร</span>
          </a>

          {/* <a
            href="/user-download"
            className={`su-menu-item ${
              currentPath === "/user-download" ? "active" : ""
            }`}
            title="ดาวน์โหลดเอกสาร"
          >
            <FaFileDownload className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>
              ดาวน์โหลดเอกสาร
            </span>
          </a> */}
        </nav>

        {/* ================= Footer ================= */}
        <div className="su-footer">
          <div className="su-bottom-menu">
            {/* <a
              href="/user-settings"
              className="su-menu-item"
              title="ตั้งค่าบัญชี"
            >
              <FaCog className="su-icon" />
              <span className={`su-text ${!isOpen && "hidden"}`}>
                ตั้งค่าบัญชี
              </span>
            </a> */}
            <button
              onClick={handleLogout}
              className="su-menu-item su-logout-btn"
              title="ออกจากระบบ"
            >
              <FaSignOutAlt className="su-icon" />
              <span className={`su-text ${!isOpen && "hidden"}`}>
                ออกจากระบบ
              </span>
            </button>
          </div>

          <div className="su-user-card" title={user?.name || "ผู้ใช้งาน"}>
            <div className="su-avatar">{getInitials(user?.name)}</div>
            <div className={`su-user-info ${!isOpen && "hidden"}`}>
              <p className="su-user-name">{user?.name || "ผู้ใช้งานระบบ"}</p>
              <p className="su-user-email">
                {user?.username || "user@email.com"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarUser;
