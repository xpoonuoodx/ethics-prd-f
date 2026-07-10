import React, { useState } from "react";
import "./style/SidebarRegulator.css";
import {
  FaHome,
  FaUsers,
  FaFolderOpen,
  FaBuilding,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGripLinesVertical,
  FaShieldAlt,
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
            <div className="rgsidebar-brand-icon">
              <FaShieldAlt />
            </div>
            <h2 className="rgsidebar-title">Organizer</h2>
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
            <FaHome className="rgsidebar-icon" />
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              แดชบอร์ด
            </span>
          </a>

          <a
            href="/regulator-user-manage"
            className={`rgsidebar-item ${currentPath.includes("user") ? "active" : ""}`}
          >
            <FaUsers className="rgsidebar-icon" />
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              จัดการบุคลากร
            </span>
          </a>

          <a
            href="/regulator-project-manage"
            className={`rgsidebar-item ${currentPath.includes("project") ? "active" : ""}`}
          >
            <FaFolderOpen className="rgsidebar-icon" />
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              จัดการโครงการ
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
            <FaBuilding className="rgsidebar-icon" />
            <span className={`rgsidebar-text ${!isOpen ? "hidden" : ""}`}>
              ข้อมูลหน่วยงาน
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
            <div className="rgsidebar-avatar">{getInitials(user?.name)}</div>
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
