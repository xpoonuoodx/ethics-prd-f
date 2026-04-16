import React, { useState } from "react";
import "./style/SidebarUser.css"; // อย่าลืมสร้างไฟล์ CSS ด้วยนะครับ
import {
  FaHome,
  FaUserAlt,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SidebarUser = () => {
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
      <button className="user-sidebar-mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* กล่อง Sidebar */}
      <div className={`user-sidebar-container ${isOpen ? "open" : "closed"}`}>
        {/* ส่วนหัว Sidebar */}
        <div className="user-sidebar-header">
          <div className="user-sidebar-brand">
            <FaUserAlt className="user-sidebar-brand-icon" />
            <h2 className={`user-sidebar-title ${!isOpen && "hidden"}`}>
              User Panel
            </h2>
          </div>
        </div>

        {/* เมนูนำทาง */}
        <div className="user-sidebar-menu">
          <a href="/user" className="user-sidebar-item active">
            <FaHome className="user-sidebar-icon" />
            <span className={`user-sidebar-text ${!isOpen && "hidden"}`}>
              หน้าหลัก
            </span>
          </a>

          <a href="/user/profile" className="user-sidebar-item">
            <FaUserAlt className="user-sidebar-icon" />
            <span className={`user-sidebar-text ${!isOpen && "hidden"}`}>
              โปรไฟล์ของฉัน
            </span>
          </a>

          <a href="/user/requests" className="user-sidebar-item">
            <FaClipboardList className="user-sidebar-icon" />
            <span className={`user-sidebar-text ${!isOpen && "hidden"}`}>
              ติดตามคำขอ
            </span>
          </a>

          <a href="/user/settings" className="user-sidebar-item">
            <FaCog className="user-sidebar-icon" />
            <span className={`user-sidebar-text ${!isOpen && "hidden"}`}>
              ตั้งค่าบัญชี
            </span>
          </a>
        </div>

        {/* ส่วนล่าง Sidebar */}
        <div className="user-sidebar-footer">
          <div className={`user-sidebar-user-info ${!isOpen && "hidden"}`}>
            <p className="user-sidebar-user-name">{user?.name || "User"}</p>
            <p className="user-sidebar-user-role">ผู้ใช้งานทั่วไป</p>
          </div>
          <button onClick={handleLogout} className="user-sidebar-logout-btn">
            <FaSignOutAlt className="user-sidebar-logout-icon" />
            <span className={`user-sidebar-text ${!isOpen && "hidden"}`}>
              ออกจากระบบ
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarUser;
