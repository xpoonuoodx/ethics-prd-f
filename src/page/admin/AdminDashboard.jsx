import React from "react";
import "./style/AdminDashboard.css";
import { FaUserShield } from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin"; // <--- นำเข้า SidebarAdmin ที่เราสร้างไว้

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="admin-portal-layout">
      {/* วาง Sidebar ไว้ด้านซ้าย */}
      <SidebarAdmin />

      {/* ส่วนเนื้อหาหลักด้านขวา (Content Area) */}
      <div className="admin-portal-content">
        <div className="admin-portal-container">
          <div className="admin-portal-card">
            {/* แถบ Header สีแดงของ Admin */}
            <div className="admin-portal-header">
              <div className="admin-portal-icon-wrapper">
                <FaUserShield className="admin-portal-icon" />
              </div>
              <h1 className="admin-portal-title">ภาพรวมระบบ (Overview)</h1>
            </div>

            {/* ส่วนเนื้อหาหลัก */}
            <div className="admin-portal-body">
              <p className="admin-portal-greeting">
                ยินดีต้อนรับคุณ,{" "}
                <span className="admin-portal-name">
                  {user?.name || "ไม่พบชื่อผู้ใช้งาน"}
                </span>
              </p>

              <div className="admin-portal-role-container">
                <span className="admin-portal-badge">
                  สิทธิ์การใช้งาน: {user?.role || "admin"}
                </span>
              </div>

              <hr className="admin-portal-divider" />

              <p className="admin-portal-welcome">
                คุณสามารถเลือกเมนูด้านซ้ายมือเพื่อจัดการผู้ใช้งาน ควบคุมสิทธิ์
                และตั้งค่าระบบทั้งหมดได้เลยครับ
              </p>

              {/* หมายเหตุ: ปุ่ม Logout เอาออกไปไว้ที่ Sidebar แล้วเพื่อความเรียบร้อย */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
