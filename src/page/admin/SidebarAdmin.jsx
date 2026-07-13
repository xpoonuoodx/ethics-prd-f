import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // เพิ่ม useLocation และ Link
import "./style/SidebarAdmin.css";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaThLarge,
  FaBuilding,
  FaUsers,
  FaUserShield,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); // ดึงข้อมูล Path ปัจจุบัน
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "ผู้ดูแลระบบ",
  };

  // Responsive: จัดการเปิด/ปิด Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ฟังก์ชันเช็คว่าเมนูไหน Active
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <>
      {isOpen && (
        <div
          className="admin-sidebar-mobile-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <button className="admin-sidebar-mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`admin-sidebar-container ${isOpen ? "open" : "closed"}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand-wrapper">
            <div className="admin-brand-logo-box">
              <span>E</span>
            </div>
            <h2 className={`admin-sidebar-brand-name ${!isOpen && "hidden"}`}>
              EthicAdmin
            </h2>
          </div>

          {!isOpen && (
            <button
              className="admin-sidebar-expand-btn"
              onClick={toggleSidebar}
            >
              <FaAngleDoubleRight />
            </button>
          )}
        </div>

        <div className="admin-sidebar-nav-scroll">
          {/* ใช้ Link แทน a เพื่อไม่ให้หน้าเว็บรีเฟรช */}
          <Link
            to="/admin-dashboard"
            className={`admin-sidebar-item ${isActive("/admin-dashboard")}`}
          >
            <FaThLarge className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              หน้าหลัก
            </span>
          </Link>

          <div className={`admin-sidebar-category ${!isOpen && "hidden"}`}>
            การจัดการหลัก
          </div>

          <Link
            to="/admin-organize"
            className={`admin-sidebar-item ${isActive("/admin-organize")}`}
          >
            <FaBuilding className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              หน่วยงานทั้งหมด
            </span>
          </Link>

          <Link
            to="/admin/users"
            className={`admin-sidebar-item ${isActive("/admin/users")}`}
          >
            <FaUsers className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              ผู้ใช้งานระบบ
            </span>
          </Link>

          <Link
            to="/admin/roles"
            className={`admin-sidebar-item ${isActive("/admin/roles")}`}
          >
            <FaUserShield className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              สิทธิ์การใช้งาน
            </span>
          </Link>

          <div className={`admin-sidebar-category ${!isOpen && "hidden"}`}>
            ระบบส่วนหลัง
          </div>

          <Link
            to="/admin/reports"
            className={`admin-sidebar-item ${isActive("/admin/reports")}`}
          >
            <FaFileAlt className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              รายงานสรุป
            </span>
          </Link>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-bottom-menus">
            <Link
              to="/admin/settings"
              className={`admin-sidebar-item ${isActive("/admin/settings")}`}
            >
              <FaCog className="admin-menu-icon" />
              <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
                ตั้งค่าระบบ
              </span>
            </Link>
          </div>

          <div className="admin-sidebar-user-section">
            <button
              onClick={handleLogout}
              className="admin-user-pill-btn"
              title="ออกจากระบบ"
            >
              <div className="admin-user-avatar">
                <FaUserCircle size={28} color="#94a3b8" />
              </div>
              <div className={`admin-user-info ${!isOpen && "hidden"}`}>
                <span className="admin-user-name">
                  {user?.name || "ผู้ดูแลระบบ"}
                </span>
                <p>ผู้ดูแลระบบ</p>
              </div>
              <div className={`admin-user-logout-icon ${!isOpen && "hidden"}`}>
                <FaSignOutAlt />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
