import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaCertificate,
  FaDownload,
  FaLock,
  FaArrowLeft,
  FaTrophy,
} from "react-icons/fa";
import "./style/UserCertificate.css";

const UserCertificate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ข้อมูลใบประกาศนียบัตร (Mock Data)
  const certificates = [
    {
      id: "CERT-001",
      role: "User",
      title: "AI Ethics for Users",
      date: "15 เม.ย. 2569",
      status: "passed",
    },
    {
      id: "CERT-002",
      role: "Provider",
      title: "Responsible AI Developer",
      date: "22 เม.ย. 2569",
      status: "passed",
    },
    {
      id: "CERT-003",
      role: "Regulator",
      title: "AI Policy & Regulation",
      date: "-",
      status: "locked",
    },
  ];

  return (
    <div className="user-portal-layout">
      <SidebarUser />

      <div className="user-portal-content">
        <div className="uct-container">
          {/* ปุ่มย้อนกลับ */}
          <button
            className="uct-back-btn"
            onClick={() => navigate("/user-dashboard")}
          >
            <FaArrowLeft /> กลับหน้าแดชบอร์ด
          </button>

          {/* หัวข้อหน้า */}
          <div className="uct-header">
            <div className="uct-header-icon">
              <FaCertificate />
            </div>
            <div>
              <h1 className="uct-title">คลังใบประกาศนียบัตร</h1>
              <p className="uct-subtitle">
                รวบรวมใบรับรองความสำเร็จ เมื่อคุณผ่านการทดสอบในแต่ละสายงาน
              </p>
            </div>
          </div>

          {/* รายการใบประกาศ */}
          <div className="uct-grid">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className={`uct-card ${cert.status === "locked" ? "locked" : ""}`}
              >
                <div className="uct-card-icon">
                  {cert.status === "locked" ? <FaLock /> : <FaTrophy />}
                </div>

                <div className="uct-card-info">
                  <span className="uct-role-badge">{cert.role}</span>
                  <h4 className="uct-card-title">{cert.title}</h4>
                  <p className="uct-card-date">
                    {cert.status === "locked"
                      ? "ยังไม่ผ่านแบบประเมิน"
                      : `ได้รับเมื่อ: ${cert.date}`}
                  </p>
                </div>

                <div className="uct-card-action">
                  {cert.status === "passed" ? (
                    <button className="uct-btn-download">
                      <FaDownload /> ดาวน์โหลด PDF
                    </button>
                  ) : (
                    <button className="uct-btn-locked" disabled>
                      <FaLock /> ล็อก
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCertificate;
