import React, { useEffect, useState } from "react";
import "./style/RegulatorDashboard.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaBalanceScale,
  FaCheck,
  FaTimes,
  FaSearch,
  FaEllipsisV, // เพิ่มไอคอน 3 จุดสำหรับ Widget
} from "react-icons/fa";
import {
  BarChart,
  Bar,
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

  // ข้อมูลสำหรับ Quick Stats สไตล์ใหม่
  const quickStats = [
    {
      id: 1,
      title: "บุคลากรในหน่วยงาน",
      value: "45",
      unit: "/คน",
      sub: "กำลังใช้งาน: 38 คน",
      progress: 85,
      color: "#2563eb", // สีน้ำเงิน
    },
    {
      id: 2,
      title: "โครงการทั้งหมด",
      value: "12",
      unit: "/โครงการ",
      sub: "ดำเนินการอยู่: 8",
      progress: 66,
      color: "#8b5cf6", // สีม่วง
    },
    {
      id: 3,
      title: "รอการอนุมัติ",
      value: "3",
      unit: "/รายการ",
      sub: "ด่วน: 1 รายการ",
      progress: 25,
      color: "#0ea5e9", // สีฟ้าคราม
    },
    {
      id: 4,
      title: "ความพร้อมเฉลี่ย",
      value: "84",
      unit: "%",
      sub: "อัปเดต: 2 วันที่แล้ว",
      progress: 84,
      color: "#10b981", // สีเขียว
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
              ส่วนหัวต้อนรับ (Header)
              ======================================= */}
          <div className="rgd-welcome-header">
            <div>
              <h1 className="rgd-greeting-title">
                ยินดีต้อนรับ, {userData?.name || "ผู้กำกับดูแล"} 
              </h1>
              <p className="rgd-greeting-subtitle">
                ภาพรวมระบบหน่วยงาน คุณสามารถติดตาม ตรวจสอบ และอนุมัติข้อมูลต่างๆ
                ได้ที่นี่
              </p>
            </div>
            <div className="rgd-role-badge">
              <FaBalanceScale /> {userData?.role || "Regulator"}
            </div>
          </div>

          {/* =======================================
              Quick Stats (สไตล์ Widget ตาม Ref Image)
              ======================================= */}
          <div className="rgd-stats-grid">
            {quickStats.map((stat) => (
              <div key={stat.id} className="rgd-stat-v2-card">
                <div className="rgd-stat-v2-left">
                  <h4 className="rgd-stat-v2-title">{stat.title}</h4>
                  <div className="rgd-stat-v2-value-wrap">
                    <span className="rgd-stat-v2-value">{stat.value}</span>
                    <span className="rgd-stat-v2-unit">{stat.unit}</span>
                  </div>
                  <p className="rgd-stat-v2-sub">{stat.sub}</p>
                </div>

                <div className="rgd-stat-v2-right">
                  <button className="rgd-stat-v2-more">
                    <FaEllipsisV size={14} />
                  </button>
                  <div className="rgd-stat-chart-wrap">
                    <svg
                      viewBox="0 0 36 36"
                      className="rgd-stat-circular-chart"
                    >
                      <path
                        className="rgd-stat-circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="rgd-stat-circle"
                        strokeDasharray={`${stat.progress}, 100`}
                        stroke={stat.color}
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
              Middle Layout: Chart & Approvals (คงเดิม)
              ======================================= */}
          <div className="rgd-middle-layout">
            {/* ฝั่งซ้าย: กราฟ */}
            <div className="rgd-card chart-card">
              <div className="rgd-card-header">
                <h3 className="rgd-card-title">คะแนนความพร้อมแยกตามฝ่าย</h3>
              </div>
              <div className="rgd-card-body" style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 13 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 13 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="score"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ฝั่งขวา: รายการรออนุมัติ */}
            <div className="rgd-card">
              <div className="rgd-card-header">
                <h3 className="rgd-card-title">รายการรออนุมัติ (Pending)</h3>
                <a href="/regulator/approvals" className="rgd-link-btn">
                  ดูทั้งหมด
                </a>
              </div>
              <div className="rgd-card-body p-0">
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
              Bottom Section: Projects Table (คงเดิม)
              ======================================= */}
          <div className="rgd-card">
            <div className="rgd-card-header">
              <h3 className="rgd-card-title">โครงการในหน่วยงาน</h3>
              <div className="rgd-search-box">
                <FaSearch className="search-icon" />
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
                      <td className="text-gray">{proj.id}</td>
                      <td className="font-bold">{proj.name}</td>
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
                          <div className="rgd-progress-track">
                            <div
                              className="rgd-progress-fill"
                              style={{
                                width: `${proj.progress}%`,
                                backgroundColor:
                                  proj.progress === 100 ? "#10b981" : "#3b82f6",
                              }}
                            ></div>
                          </div>
                          <span className="text-gray">{proj.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`rgd-status-badge ${proj.progress === 100 ? "success" : proj.progress < 50 ? "warning" : "active"}`}
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
