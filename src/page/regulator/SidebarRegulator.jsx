import React, { useState } from "react";
import "./style/SidebarRegulator.css";
import {
  FaHome,
  FaUsers,
  FaFolderOpen,
  FaBuilding,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGripLinesVertical,
  FaBookOpen,
  FaClipboardCheck,
  FaTools,
  FaCertificate,
} from "react-icons/fa";
import { getStoredUser } from "../../api/Api";
import logoBde from "../../assets/logo-bde.png";

const SidebarRegulator = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = getStoredUser();

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
    localStorage.clear();
    window.location.href = "/login";
  };

  const currentPath = window.location.pathname + window.location.search;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="rgsidebar-mobile-toggle" onClick={toggleMobileSidebar}>
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="rgsidebar-overlay" onClick={toggleMobileSidebar}></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`rgsidebar-container ${isOpen ? "open" : "closed"} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* Header Section */}
        <div className="rgsidebar-header">
          <div className={`rgsidebar-brand ${!isOpen ? "hidden" : ""}`}>
            <img src={logoBde} alt="BDE" className="rgsidebar-logo" />
          </div>

          {/* <button className="rgsidebar-desktop-toggle" onClick={toggleSidebar}>
            <FaGripLinesVertical />
          </button> */}
        </div>

        {/* Menu Section */}
        <div className="rgsidebar-menu">
          <span className={`rgsidebar-menu-label ${!isOpen ? "hidden" : ""}`}>
            MAIN MENU
          </span>

          <a
            href="/regulator-dashboard"
            className={`rgsidebar-item ${currentPath.includes("dashboard") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaHome className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              แดชบอร์ด
            </span>
          </a>

          <a
            href="/regulator-user-manage"
            className={`rgsidebar-item ${currentPath.includes("user") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaUsers className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              จัดการบุคลากร
            </span>
          </a>

          <a
            href="/regulator-project-manage"
            className={`rgsidebar-item ${currentPath.includes("project") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaFolderOpen className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              จัดการโครงการ
            </span>
          </a>

          <span
            className={`rgsidebar-menu-label r-mt ${!isOpen ? "hidden" : ""}`}
          >
            การเรียนรู้และประเมิน
          </span>

          <a
            href="/regulator-classroom"
            className={`rgsidebar-item ${currentPath.includes("classroom") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaBookOpen className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              สื่อการเรียนรู้
            </span>
          </a>

          <a
            href="/regulator-test"
            className={`rgsidebar-item ${currentPath.includes("test") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaClipboardCheck className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              แบบทดสอบ
            </span>
          </a>

          <a
            href="/regulator-tools"
            className={`rgsidebar-item ${currentPath.includes("tools") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaTools className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              เครื่องมือประเมิน
            </span>
          </a>

          <a
            href="/regulator-certificate"
            className={`rgsidebar-item ${currentPath.includes("certificate") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaCertificate className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              ใบประกาศนียบัตร
            </span>
          </a>

          <span
            className={`rgsidebar-menu-label r-mt ${!isOpen ? "hidden" : ""}`}
          >
            SETTINGS
          </span>

          <a
            href="/regulator-org-manage"
            className={`rgsidebar-item ${currentPath.includes("org") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaBuilding className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              ข้อมูลหน่วยงาน
            </span>
          </a>

          <a
            href="/regulator-profile"
            className={`rgsidebar-item ${currentPath.includes("profile") ? "active" : ""}`}
          >
            <span className="rgsidebar-icon-badge">
              <FaUserCircle className="rgsidebar-icon" />
            </span>
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              ข้อมูลส่วนตัว
            </span>
          </a>
        </div>

        {/* Footer Section */}
        <div className="rgsidebar-footer">
          <div className="rgsidebar-bottom-menu">
            <button
              onClick={handleLogout}
              className="rgsidebar-item rgsidebar-logout-btn"
            >
              <FaSignOutAlt className="rgsidebar-icon" />
              <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
                ออกจากระบบ
              </span>
            </button>
          </div>

          <div className="rgsidebar-user-card">
            <div className="rgsidebar-avatar">
              {user?.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={user?.name || "Organizer"}
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className={`rgsidebar-user-info ${!isOpen ? "hidden" : ""}`}>
              <p className="rgsidebar-user-name">{user?.name || "Organizer"}</p>
              <p className="rgsidebar-user-role">ผู้กำกับดูแล</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarRegulator;
