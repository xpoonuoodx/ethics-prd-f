import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar"; // ปรับ path ให้ตรงกับโฟลเดอร์ของคุณ
import Footer from "../component/Footer"; // ปรับ path ให้ตรงกับโฟลเดอร์ของคุณ
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Building2,
} from "lucide-react";
import "./style/Dashboard.css"; // ปรับ path ให้ตรงกับโฟลเดอร์ของคุณ

function Dashboard() {
  // ทำให้หน้าเว็บเลื่อนขึ้นไปบนสุดเสมอเวลาโหลดหน้านี้
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ข้อมูลจำลองสำหรับ Progress Bar (หลักจริยธรรม AI)
  const progressData = [
    {
      label: "ความโปร่งใสและอธิบายได้ (Transparency)",
      percent: 85,
      color: "#75ba40",
    },
    {
      label: "ความมั่นคงปลอดภัย (Security & Safety)",
      percent: 92,
      color: "#3b82f6",
    },
    {
      label: "ความเป็นธรรมและลดความลำเอียง (Fairness)",
      percent: 78,
      color: "#f59e0b",
    },
    {
      label: "การคุ้มครองข้อมูลส่วนบุคคล (Privacy)",
      percent: 88,
      color: "#10b981",
    },
  ];

  // ข้อมูลจำลองสำหรับตารางกิจกรรมล่าสุด
  const recentActivities = [
    {
      id: 1,
      org: "บริษัท เอไอ โซลูชั่น จำกัด",
      action: "ผ่านการประเมินความพร้อม AI",
      date: "10 เม.ย. 2569",
      status: "สำเร็จ",
    },
    {
      id: 2,
      org: "ธนาคารไทยนวัตกรรม",
      action: "ส่งรายงานความเสี่ยงระบบสินเชื่อ",
      date: "08 เม.ย. 2569",
      status: "รอตรวจสอบ",
    },
    {
      id: 3,
      org: "มหาวิทยาลัยเทคโนโลยี",
      action: "ลงทะเบียนเข้าร่วมโครงการนำร่อง",
      date: "05 เม.ย. 2569",
      status: "สำเร็จ",
    },
    {
      id: 4,
      org: "โรงพยาบาลศูนย์สุขภาพ",
      action: "อัปเดตข้อมูล PDPA Policy",
      date: "02 เม.ย. 2569",
      status: "กำลังดำเนินการ",
    },
  ];

  return (
    <div className="db-wrapper">
      {/* 1. แถบเมนูด้านบน */}
      <Tabbar />

      {/* 2. เนื้อหาหลักของ Dashboard */}
      <main className="db-main-content">
        {/* --- ส่วนหัวข้อ --- */}
        <div className="db-header">
          <div>
            <h1 className="db-title">แดชบอร์ดภาพรวมโครงการ</h1>
            <p className="db-subtitle">
              สถิติและข้อมูลการดำเนินงานด้านแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
            </p>
          </div>
          <button className="db-btn-export">ดาวน์โหลดรายงาน (PDF)</button>
        </div>

        {/* --- ส่วนการ์ดสถิติ 4 ใบ (Stat Cards) --- */}
        <div className="db-stats-grid">
          <div className="db-stat-card">
            <div
              className="db-stat-icon-wrapper"
              style={{
                backgroundColor: "rgba(117, 186, 64, 0.1)",
                color: "#75ba40",
              }}
            >
              <Building2 size={28} />
            </div>
            <div className="db-stat-info">
              <p className="db-stat-label">องค์กรที่เข้าร่วมประเมิน</p>
              <h3 className="db-stat-value">1,250</h3>
              <p className="db-stat-trend positive">
                <TrendingUp size={14} /> +12% จากเดือนที่แล้ว
              </p>
            </div>
          </div>

          <div className="db-stat-card">
            <div
              className="db-stat-icon-wrapper"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
              }}
            >
              <BarChart3 size={28} />
            </div>
            <div className="db-stat-info">
              <p className="db-stat-label">คะแนนความพร้อมเฉลี่ย</p>
              <h3 className="db-stat-value">84.5 / 100</h3>
              <p className="db-stat-trend positive">
                <TrendingUp size={14} /> +3.2 คะแนน
              </p>
            </div>
          </div>

          <div className="db-stat-card">
            <div
              className="db-stat-icon-wrapper"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                color: "#f59e0b",
              }}
            >
              <BookOpen size={28} />
            </div>
            <div className="db-stat-info">
              <p className="db-stat-label">ผู้ผ่านการอบรมหลักสูตร</p>
              <h3 className="db-stat-value">8,430</h3>
              <p className="db-stat-trend positive">
                <TrendingUp size={14} /> +450 คนในสัปดาห์นี้
              </p>
            </div>
          </div>

          <div className="db-stat-card">
            <div
              className="db-stat-icon-wrapper"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
              }}
            >
              <AlertTriangle size={28} />
            </div>
            <div className="db-stat-info">
              <p className="db-stat-label">เคสความเสี่ยงที่พบ</p>
              <h3 className="db-stat-value">14</h3>
              <p className="db-stat-trend negative">
                <TrendingUp size={14} style={{ transform: "rotate(180deg)" }} />{" "}
                -2 เคส จากเดือนที่แล้ว
              </p>
            </div>
          </div>
        </div>

        {/* --- ส่วนกราฟและตาราง (แบ่งซ้าย-ขวา) --- */}
        <div className="db-content-grid">
          {/* ฝั่งซ้าย: Progress Bars */}
          <div className="db-card">
            <div className="db-card-header">
              <h3 className="db-card-title">ความคืบหน้าตามหลักการ AI Ethics</h3>
            </div>
            <div className="db-card-body">
              <div className="db-progress-list">
                {progressData.map((item, index) => (
                  <div key={index} className="db-progress-item">
                    <div className="db-progress-info">
                      <span className="db-progress-label">{item.label}</span>
                      <span className="db-progress-percent">
                        {item.percent}%
                      </span>
                    </div>
                    <div className="db-progress-bar-bg">
                      <div
                        className="db-progress-bar-fill"
                        style={{
                          width: `${item.percent}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: รายการอัปเดตล่าสุด */}
          <div className="db-card">
            <div className="db-card-header">
              <h3 className="db-card-title">ความเคลื่อนไหวล่าสุด</h3>
              <button className="db-btn-link">ดูทั้งหมด</button>
            </div>
            <div className="db-card-body">
              <ul className="db-activity-list">
                {recentActivities.map((act) => (
                  <li key={act.id} className="db-activity-item">
                    <div className="db-activity-icon">
                      <CheckCircle
                        size={20}
                        color={act.status === "สำเร็จ" ? "#10b981" : "#9ca3af"}
                      />
                    </div>
                    <div className="db-activity-details">
                      <p className="db-activity-org">{act.org}</p>
                      <p className="db-activity-action">{act.action}</p>
                    </div>
                    <div className="db-activity-meta">
                      <span
                        className={`db-status-badge ${act.status === "สำเร็จ" ? "success" : act.status === "รอตรวจสอบ" ? "warning" : "processing"}`}
                      >
                        {act.status}
                      </span>
                      <span className="db-activity-date">{act.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 3. แถบด้านล่างสุด */}
      <Footer />
    </div>
  );
}

export default Dashboard;
