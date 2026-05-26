import React, { useEffect, useState } from "react";
import "./style/RegulatorDashboard.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaBalanceScale,
  FaCheck,
  FaTimes,
  FaSearch,
  FaUsers,
  FaFolderOpen,
  FaFileSignature,
  FaChartBar,
  FaEllipsisV, // เพิ่มไอคอน 3 จุดสำหรับ Widget
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RegulatorDashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserData(storedUser);
  }, []);

  // ----------------------------------------
  // ข้อมูลจำลอง (Mock Data) สำหรับ Regulator
  // ----------------------------------------

  // ข้อมูลสำหรับ Quick Stats (สไตล์การ์ดสีทึบ)
  const quickStats = [
    {
      id: 1,
      title: "บุคลากรในหน่วยงาน",
      value: "45",
      unit: "/คน",
      sub: "กำลังใช้งาน: 38 คน",
      progress: 85,
      theme: "solid-blue",
    },
    {
      id: 2,
      title: "โครงการทั้งหมด",
      value: "12",
      unit: "/โครงการ",
      sub: "ดำเนินการอยู่: 8",
      progress: 66,
      theme: "solid-indigo",
    },
    {
      id: 3,
      title: "รอการอนุมัติ",
      value: "3",
      unit: "/รายการ",
      sub: "ด่วน: 1 รายการ",
      progress: 25,
      theme: "solid-orange",
    },
    {
      id: 4,
      title: "ความพร้อมเฉลี่ย",
      value: "84",
      unit: "%",
      sub: "อัปเดต: 2 วันที่แล้ว",
      progress: 84,
      theme: "solid-green",
    },
  ];

  const chartData = [
    { name: "ฝ่าย IT", score: 85 },
    { name: "ฝ่ายบัญชี", score: 92 },
    { name: "ฝ่ายบุคคล", score: 78 },
    { name: "ฝ่ายการตลาด", score: 88 },
    { name: "ฝ่ายบริการ", score: 75 },
  ];

  const pendingApprovals = [
    {
      id: "REQ-001",
      user: "สมหญิง รักงาน",
      project: "AI Chatbot",
      type: "ขอประเมิน",
      date: "20 เม.ย. 2569",
    },
    {
      id: "REQ-002",
      user: "วิชาญ ใจดี",
      project: "Data Analysis",
      type: "เพิ่มสมาชิก",
      date: "21 เม.ย. 2569",
    },
    {
      id: "REQ-003",
      user: "มณี มีทรัพย์",
      project: "Risk Predictor",
      type: "ขออนุมัติใช้งาน",
      date: "22 เม.ย. 2569",
    },
  ];

  const recentProjects = [
    {
      id: "PRJ-101",
      name: "ระบบแนะนำสินค้าอัตโนมัติ",
      manager: "สมชาย แซ่ตั้ง",
      progress: 80,
      status: "กำลังดำเนินการ",
    },
    {
      id: "PRJ-102",
      name: "การวิเคราะห์พฤติกรรมลูกค้า",
      manager: "วิชาญ ใจดี",
      progress: 100,
      status: "เสร็จสิ้น",
    },
    {
      id: "PRJ-103",
      name: "ระบบประเมินความเสี่ยง",
      manager: "สมหญิง รักงาน",
      progress: 30,
      status: "รอตรวจสอบ",
    },
  ];

  return (
    <div className="regulator-portal-layout">
      {/* วาง Sidebar ไว้ด้านซ้าย */}
      <SidebarRegulator />

      {/* ส่วนเนื้อหาหลักด้านขวา */}
      <div className="regulator-portal-content">
        <div className="rgd-container">
          {/* =======================================
              ส่วนหัวต้อนรับ (Header) ดีไซน์คลีน
              ======================================= */}
          <div className="rgd-header-wrapper">
            <div className="rgd-simple-header">
              <h1 className="rgd-greeting-title">
                ยินดีต้อนรับ, {userData?.name || "ผู้กำกับดูแล"}
              </h1>
              <p className="rgd-greeting-subtitle">
                ภาพรวมระบบหน่วยงาน คุณสามารถติดตาม ตรวจสอบ และอนุมัติข้อมูลต่างๆ
                ได้ที่นี่
              </p>
            </div>
            <div className="rgd-role-badge">
              <FaBalanceScale className="rgd-icon-gold" />{" "}
              {userData?.role || "Regulator"}
            </div>
          </div>

          {/* =======================================
              Quick Stats (สไตล์การ์ดสีทึบ Solid Color)
              ======================================= */}
          <div className="rgd-stats-grid">
            {quickStats.map((stat) => (
              <div
                key={stat.id}
                className={`rgd-stat-solid-card ${stat.theme}`}
              >
                <div className="rgd-stat-solid-left">
                  <h4 className="rgd-stat-solid-title">{stat.title}</h4>
                  <div className="rgd-stat-solid-value-wrap">
                    <span className="rgd-stat-solid-value">{stat.value}</span>
                    <span className="rgd-stat-solid-unit">{stat.unit}</span>
                  </div>
                  <p className="rgd-stat-solid-sub">{stat.sub}</p>
                </div>

                <div className="rgd-stat-solid-right">
                  <button className="rgd-stat-solid-more">
                    <FaEllipsisV size={14} />
                  </button>
                  <div className="rgd-stat-chart-wrap">
                    <svg
                      viewBox="0 0 36 36"
                      className="rgd-stat-circular-chart"
                    >
                      {/* แก้ไข fill="none" เพื่อป้องกันปัญหากราฟดำทึบ */}
                      <path
                        className="rgd-stat-circle-bg"
                        fill="none"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="rgd-stat-circle"
                        fill="none"
                        strokeDasharray={`${stat.progress}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.8" className="rgd-stat-percentage">
                        {stat.progress}%
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* =======================================
              Middle Layout: Chart & Approvals
              ======================================= */}
          <div className="rgd-progress-layout">
            {/* ฝั่งซ้าย: กราฟเส้น (Line Chart) */}
            <div className="rgd-card chart-wrapper">
              <div className="rgd-card-header">
                <h3 className="rgd-card-title">คะแนนความพร้อมแยกตามฝ่าย</h3>
              </div>
              <div className="rgd-card-body" style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f3f4f6"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 13 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 13 }}
                    />
                    <Tooltip
                      cursor={{
                        stroke: "rgba(59, 130, 246, 0.1)",
                        strokeWidth: 2,
                      }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #f3f4f6",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      dot={{
                        r: 5,
                        fill: "#ffffff",
                        stroke: "#3b82f6",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 8,
                        fill: "#3b82f6",
                        stroke: "#ffffff",
                        strokeWidth: 3,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ฝั่งขวา: รายการรออนุมัติ */}
            <div className="rgd-card list-wrapper">
              <div className="rgd-card-header">
                <h3 className="rgd-card-title">รายการรออนุมัติ</h3>
                <a href="/regulator/approvals" className="rgd-link-primary">
                  ดูทั้งหมด
                </a>
              </div>
              <div className="rgd-card-body rgd-p-0">
                <ul className="rgd-approval-list">
                  {pendingApprovals.map((req) => (
                    <li key={req.id} className="rgd-approval-item">
                      <div className="rgd-approval-info">
                        <h4>{req.user}</h4>
                        <p>
                          {req.type} • {req.project}
                        </p>
                      </div>
                      <div className="rgd-approval-actions">
                        <button className="rgd-btn-icon reject" title="ปฏิเสธ">
                          <FaTimes />
                        </button>
                        <button
                          className="rgd-btn-icon approve"
                          title="อนุมัติ"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* =======================================
              Bottom Section: Projects Table
              ======================================= */}
          <div className="rgd-card">
            <div className="rgd-card-header">
              <h3 className="rgd-card-title">โครงการในหน่วยงาน</h3>
              <div className="rgd-search-box">
                <FaSearch className="rgd-search-icon" />
                <input type="text" placeholder="ค้นหาโครงการ..." />
              </div>
            </div>
            <div className="rgd-table-wrapper">
              <table className="rgd-table">
                <thead>
                  <tr>
                    <th>รหัสโครงการ</th>
                    <th>ชื่อโครงการ</th>
                    <th>ผู้รับผิดชอบหลัก</th>
                    <th>ความคืบหน้า</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((proj) => (
                    <tr key={proj.id}>
                      <td className="rgd-text-muted">{proj.id}</td>
                      <td className="rgd-font-bold">{proj.name}</td>
                      <td>
                        <div className="rgd-user-cell">
                          <div className="rgd-avatar-small">
                            {proj.manager.charAt(0)}
                          </div>
                          {proj.manager}
                        </div>
                      </td>
                      <td>
                        <div className="rgd-progress-wrap">
                          <div className="rgd-mini-progress">
                            <div
                              className="rgd-mini-progress-fill"
                              style={{
                                width: `${proj.progress}%`,
                                backgroundColor:
                                  proj.progress === 100 ? "#10b981" : "#3b82f6",
                              }}
                            ></div>
                          </div>
                          <span className="rgd-text-muted-bold">
                            {proj.progress}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`rgd-badge ${proj.progress === 100 ? "success" : proj.progress < 50 ? "warning" : "active"}`}
                        >
                          {proj.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboard;
