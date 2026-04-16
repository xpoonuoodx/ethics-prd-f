import React from "react";
import "./style/UserDashboard.css";
import { FaUser } from "react-icons/fa";
import SidebarUser from "./SidebarUser"; // นำเข้า Sidebar

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="user-portal-layout">
      {/* วาง Sidebar ไว้ด้านซ้าย */}
      <SidebarUser />

      {/* ส่วนเนื้อหาหลักด้านขวา */}
      <div className="user-portal-content">
        <div className="user-portal-container">
          <div className="user-portal-card">
            {/* แถบ Header สีเขียวของ User */}
            <div className="user-portal-header">
              <div className="user-portal-icon-wrapper">
                <FaUser className="user-portal-icon" />
              </div>
              <h1 className="user-portal-title">ภาพรวม (Overview)</h1>
            </div>

            {/* ส่วนเนื้อหาหลัก */}
            <div className="user-portal-body">
              <p className="user-portal-greeting">
                ยินดีต้อนรับคุณ,{" "}
                <span className="user-portal-name">
                  {user?.name || "ไม่พบชื่อผู้ใช้งาน"}
                </span>
              </p>

              <div className="user-portal-role-container">
                <span className="user-portal-badge">
                  สิทธิ์การใช้งาน: {user?.role || "user"}
                </span>
              </div>

              <hr className="user-portal-divider" />

              <p className="user-portal-welcome">
                คุณสามารถเลือกเมนูด้านซ้ายมือเพื่อเข้าถึงบริการ อัปเดตโปรไฟล์
                และติดตามสถานะคำขอของคุณได้เลยครับ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
