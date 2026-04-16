import React, { useState } from "react";
import "./style/SidebarAdmin.css"; // สร้างไฟล์ CSS ไว้ในโฟลเดอร์ style นะครับ
import {
  FaHome,
  FaUsers,
  FaUserShield,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SidebarAdmin = () => {
  // State สำหรับเปิด/ปิด Sidebar (พับเก็บได้)
  const [isOpen, setIsOpen] = useState(true);

  // ดึงข้อมูล User เผื่อเอามาโชว์ใน Sidebar
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
      {/* ปุ่ม Toggle สำหรับมือถือ หรือตอนที่พับ Sidebar ไปแล้ว */}
      <button className="admin-sidebar-mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* ตัว Sidebar */}
      <div className={`admin-sidebar-container ${isOpen ? "open" : "closed"}`}>
        {/* ส่วนหัว Sidebar (โลโก้) */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <FaUserShield className="admin-sidebar-brand-icon" />
            <h2 className={`admin-sidebar-title ${!isOpen && "hidden"}`}>
              Admin Panel
            </h2>
          </div>
        </div>

        {/* เมนูนำทาง */}
        <div className="admin-sidebar-menu">
          <a href="/admin" className="admin-sidebar-item active">
            <FaHome className="admin-sidebar-icon" />
            <span className={`admin-sidebar-text ${!isOpen && "hidden"}`}>
              หน้าหลัก
            </span>
          </a>

          <a href="/admin/users" className="admin-sidebar-item">
            <FaUsers className="admin-sidebar-icon" />
            <span className={`admin-sidebar-text ${!isOpen && "hidden"}`}>
              จัดการผู้ใช้งาน
            </span>
          </a>

          <a href="/admin/roles" className="admin-sidebar-item">
            <FaUserShield className="admin-sidebar-icon" />
            <span className={`admin-sidebar-text ${!isOpen && "hidden"}`}>
              จัดการสิทธิ์
            </span>
          </a>

          <a href="/admin/reports" className="admin-sidebar-item">
            <FaChartBar className="admin-sidebar-icon" />
            <span className={`admin-sidebar-text ${!isOpen && "hidden"}`}>
              รายงานระบบ
            </span>
          </a>

          <a href="/admin/settings" className="admin-sidebar-item">
            <FaCog className="admin-sidebar-icon" />
            <span className={`admin-sidebar-text ${!isOpen && "hidden"}`}>
              ตั้งค่าระบบ
            </span>
          </a>
        </div>

        {/* ส่วนล่าง Sidebar (โปรไฟล์ & ออกจากระบบ) */}
        <div className="admin-sidebar-footer">
          <div className={`admin-sidebar-user-info ${!isOpen && "hidden"}`}>
            <p className="admin-sidebar-user-name">{user?.name || "Admin"}</p>
            <p className="admin-sidebar-user-role">ผู้ดูแลระบบ</p>
          </div>
          <button onClick={handleLogout} className="admin-sidebar-logout-btn">
            <FaSignOutAlt className="admin-sidebar-logout-icon" />
            <span className={`admin-sidebar-text ${!isOpen && "hidden"}`}>
              ออกจากระบบ
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
