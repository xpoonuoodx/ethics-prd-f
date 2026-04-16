import React from "react";
import "./style/ProviderDashboard.css";
import { FaBuilding } from "react-icons/fa";
import SidebarProvider from "./SidebarProvider"; // นำเข้า Sidebar

const ProviderDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="provider-portal-layout">
      {/* วาง Sidebar ไว้ด้านซ้าย */}
      <SidebarProvider />

      {/* ส่วนเนื้อหาหลักด้านขวา */}
      <div className="provider-portal-content">
        <div className="provider-portal-container">
          <div className="provider-portal-card">
            {/* แถบ Header สีส้มของ Provider */}
            <div className="provider-portal-header">
              <div className="provider-portal-icon-wrapper">
                <FaBuilding className="provider-portal-icon" />
              </div>
              <h1 className="provider-portal-title">ภาพรวมผู้ให้บริการ</h1>
            </div>

            {/* ส่วนเนื้อหาหลัก */}
            <div className="provider-portal-body">
              <p className="provider-portal-greeting">
                ยินดีต้อนรับคุณ,{" "}
                <span className="provider-portal-name">
                  {user?.name || "ไม่พบชื่อผู้ใช้งาน"}
                </span>
              </p>

              <div className="provider-portal-role-container">
                <span className="provider-portal-badge">
                  สิทธิ์การใช้งาน: {user?.role || "provider"}
                </span>
              </div>

              <hr className="provider-portal-divider" />

              <p className="provider-portal-welcome">
                คุณสามารถเลือกเมนูด้านซ้ายมือเพื่อจัดการบริการของคุณ
                อัปเดตข้อมูล และดูรายงานผลต่างๆ ได้เลยครับ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
