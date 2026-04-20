import React from "react";
import "./style/RegulatorDashboard.css";
import { FaBalanceScale } from "react-icons/fa";
import SidebarRegulator from "./SidebarRegulator"; // นำเข้า Sidebar

const RegulatorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="regulator-portal-layout">
      {/* วาง Sidebar ไว้ด้านซ้าย */}
      <SidebarRegulator />

      {/* ส่วนเนื้อหาหลักด้านขวา */}
      <div className="regulator-portal-content">
        <div className="regulator-portal-container">
          <div className="regulator-portal-card">
            {/* แถบ Header สีม่วงของ Regulator */}
            <div className="regulator-portal-header">
              <div className="regulator-portal-icon-wrapper">
                <FaBalanceScale className="regulator-portal-icon" />
              </div>
              <h1 className="regulator-portal-title">ภาพรวมระบบ (Overview)</h1>
            </div>

            {/* ส่วนเนื้อหาหลัก */}
            <div className="regulator-portal-body">
              <p className="regulator-portal-greeting">
                ยินดีต้อนรับคุณ,{" "}
                <span className="regulator-portal-name">
                  {user?.name || "ไม่พบชื่อผู้ใช้งาน"}
                </span>
              </p>

              <div className="regulator-portal-role-container">
                <span className="regulator-portal-badge">
                  สิทธิ์การใช้งาน: {user?.role || "regulator"}
                </span>
              </div>

              <hr className="regulator-portal-divider" />

              <p className="regulator-portal-welcome">
                คุณสามารถเลือกเมนูด้านซ้ายมือเพื่อติดตาม ตรวจสอบ
                และอนุมัติข้อมูลต่างๆ ภายในระบบได้เลยครับ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboard;
