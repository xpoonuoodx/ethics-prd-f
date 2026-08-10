import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/AdminDashboard.css";
import {
  FaBuilding,
  FaUsers,
  FaProjectDiagram,
  FaSpinner,
  FaUserShield,
  FaCertificate,
  FaArrowRight,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import SidebarAdmin from "./SidebarAdmin";
import api, { getStoredUser } from "../../api/Api";
import { getAvatarColor } from "../../utils/projectDisplay";
import { SECTOR_LABELS } from "../../utils/sectorLabels";

// สถานะโครงการคำนวณอัตโนมัติจากจำนวนสมาชิกที่ทำแบบประเมินตนเองแล้ว (แบบเดียวกับหน้าภาพรวมโครงการ)
const getStatusMeta = (status) => {
  if (status === "Completed") return { label: "เสร็จสิ้น", className: "completed" };
  if (status === "In Progress")
    return { label: "กำลังดำเนินการ", className: "in-progress" };
  return { label: "รอดำเนินการ", className: "pending" };
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [summary, setSummary] = useState({
    totalOrganizations: 0,
    totalRegulators: 0,
    totalProjects: 0,
    totalUsers: 0,
    totalCertificates: 0,
  });
  const [organizations, setOrganizations] = useState([]);
  const [userTypeBreakdown, setUserTypeBreakdown] = useState([]);
  const [ethicsRadar, setEthicsRadar] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, projectsRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/get-all-projects"),
      ]);

      if (dashboardRes.data && dashboardRes.data.success) {
        const { summary, organizations, userTypeBreakdown, ethicsRadar } =
          dashboardRes.data.data || {};
        setSummary(
          summary || {
            totalOrganizations: 0,
            totalRegulators: 0,
            totalProjects: 0,
            totalUsers: 0,
            totalCertificates: 0,
          },
        );
        setOrganizations(organizations || []);
        setUserTypeBreakdown(userTypeBreakdown || []);
        setEthicsRadar(ethicsRadar || []);
      } else {
        setError("ไม่สามารถดึงข้อมูลภาพรวมระบบได้");
      }

      if (projectsRes.data && projectsRes.data.success) {
        setProjects(projectsRes.data.data || []);
      }
    } catch (err) {
      console.error("Fetch Dashboard Error:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAll();
  }, []);

  // สัดส่วนสถานะโครงการทั้งระบบ สำหรับกราฟโดนัท
  const statusCounts = projects.reduce(
    (acc, p) => {
      acc[getStatusMeta(p.status).className] += 1;
      return acc;
    },
    { completed: 0, "in-progress": 0, pending: 0 },
  );
  const statusChartData = [
    { name: "เสร็จสิ้น", value: statusCounts.completed, color: "#166534" },
    {
      name: "กำลังดำเนินการ",
      value: statusCounts["in-progress"],
      color: "#1d4ed8",
    },
    { name: "รอดำเนินการ", value: statusCounts.pending, color: "#d97706" },
  ];
  const maxUserTypeCount = Math.max(
    1,
    ...userTypeBreakdown.map((row) => row.count),
  );

  // สัดส่วนหน่วยงานตามกลุ่มอุตสาหกรรม (sector)
  const sectorCounts = organizations.reduce((acc, org) => {
    const key = org.sector || "ไม่ระบุ";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const sectorBreakdown = Object.entries(sectorCounts)
    .map(([sector, count]) => ({
      label: SECTOR_LABELS[sector] || sector,
      count,
    }))
    .sort((a, b) => b.count - a.count);
  const maxSectorCount = Math.max(1, ...sectorBreakdown.map((row) => row.count));

  const latestOrganizations = organizations.slice(0, 5);

  return (
    <div className="admin-layout">
      <SidebarAdmin />

      <div className="admin-main-content">
        <div className="admin-content-inner">
          <div className="admin-top-section">
            <div className="admin-header-text">
              <h1>ยินดีต้อนรับคุณ, {user?.name || "หน่วยงาน"}</h1>
              <p>ภาพรวมและสถิติการใช้งานระบบจัดการหน่วยงานทั้งหมด</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-state-container">
              <FaSpinner className="admin-spin" />
              <p>กำลังโหลดข้อมูลระบบ...</p>
            </div>
          ) : error ? (
            <div className="admin-state-container error">
              <p>{error}</p>
              <button onClick={fetchAll} className="admin-btn-retry">
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="admin-stats-container">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-emerald-light">
                    <FaBuilding className="text-emerald" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">หน่วยงานทั้งหมด</span>
                    <span className="stat-value">
                      {summary.totalOrganizations}
                    </span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-blue-light">
                    <FaUserShield className="text-blue" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">ผู้กำกับดูแลระบบ</span>
                    <span className="stat-value">
                      {summary.totalRegulators}
                    </span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-purple-light">
                    <FaProjectDiagram className="text-purple" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">โครงการทั้งหมด</span>
                    <span className="stat-value">{summary.totalProjects}</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-orange-light">
                    <FaUsers className="text-orange" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">ผู้ใช้งานรวม</span>
                    <span className="stat-value">{summary.totalUsers}</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-pink-light">
                    <FaCertificate className="text-pink" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">ใบประกาศที่ออกแล้ว</span>
                    <span className="stat-value">
                      {summary.totalCertificates}
                    </span>
                  </div>
                </div>
              </div>

              {/* หน่วยงานล่าสุด + กราฟสถานะโครงการ/ประเภทผู้ใช้ */}
              <div className="admin-dash-grid">
                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <h2>หน่วยงานล่าสุด</h2>
                    <button
                      className="admin-link-btn"
                      onClick={() => navigate("/admin-organize")}
                    >
                      ดูทั้งหมด <FaArrowRight />
                    </button>
                  </div>
                  {latestOrganizations.length === 0 ? (
                    <div className="admin-panel-empty">ยังไม่มีหน่วยงาน</div>
                  ) : (
                    <div className="admin-recent-org-list">
                      {latestOrganizations.map((org, index) => (
                        <div className="admin-recent-org-item" key={index}>
                          <span
                            className="admin-recent-org-avatar"
                            style={{ background: getAvatarColor(org.name) }}
                          >
                            {(org.name || "?").charAt(0)}
                          </span>
                          <div className="admin-recent-org-text">
                            <span className="admin-recent-org-name">
                              {org.name}
                            </span>
                            <span className="admin-recent-org-meta">
                              {org.regulatorName} · {org.totalProjects} โครงการ
                            </span>
                          </div>
                          <span
                            className={`admin-badge ${org.status.toLowerCase()}`}
                          >
                            <span className="badge-dot"></span>
                            {org.status === "Active"
                              ? "ใช้งานปกติ"
                              : "ระงับการใช้งาน"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-side-col">
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h2>สัดส่วนสถานะโครงการ</h2>
                    </div>
                    <div className="admin-donut-row">
                      <div className="admin-donut-wrap">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius="60%"
                              outerRadius="95%"
                              paddingAngle={3}
                            >
                              {statusChartData.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                borderRadius: "10px",
                                border: "none",
                                boxShadow:
                                  "0 10px 25px -5px rgba(0,0,0,0.1)",
                                fontSize: "12px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="admin-donut-legend">
                        {statusChartData.map((entry) => (
                          <div className="admin-legend-item" key={entry.name}>
                            <span
                              className="admin-legend-dot"
                              style={{ background: entry.color }}
                            ></span>
                            <span className="admin-legend-label">
                              {entry.name}
                            </span>
                            <span className="admin-legend-value">
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h2>สัดส่วนผู้ใช้งานตามประเภท</h2>
                    </div>
                    {userTypeBreakdown.length === 0 ? (
                      <div className="admin-panel-empty">ยังไม่มีข้อมูล</div>
                    ) : (
                      <div className="admin-bar-list">
                        {userTypeBreakdown.map((row) => (
                          <div className="admin-bar-item" key={row.userType}>
                            <span className="admin-bar-label">
                              {row.userType}
                            </span>
                            <div className="admin-bar-track">
                              <div
                                className="admin-bar-fill"
                                style={{
                                  width: `${(row.count / maxUserTypeCount) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="admin-bar-value">
                              {row.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* คะแนนเฉลี่ยจริยธรรม AI ทั้งระบบ + สัดส่วนหน่วยงานตามอุตสาหกรรม */}
              <div className="admin-dash-grid">
                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <h2>คะแนนเฉลี่ยจริยธรรม AI ทั้งระบบ</h2>
                  </div>
                  <p className="admin-panel-subtitle">
                    คำนวณจากผลประเมินตนเองของผู้ใช้งานทุกคนในทุกโครงการทั่วทั้งระบบ
                  </p>
                  {ethicsRadar.length === 0 ? (
                    <div className="admin-panel-empty">
                      ยังไม่มีผู้ใช้งานทำแบบประเมินตนเอง
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="75%"
                        data={ethicsRadar}
                      >
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: "#94a3b8", fontSize: 10 }}
                          tickCount={6}
                        />
                        <Radar
                          name="คะแนนเฉลี่ย"
                          dataKey="score"
                          stroke="#6d28d9"
                          strokeWidth={2}
                          fill="#6d28d9"
                          fillOpacity={0.3}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "10px",
                            border: "none",
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                            fontSize: "12px",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <h2>สัดส่วนหน่วยงานตามอุตสาหกรรม</h2>
                  </div>
                  {sectorBreakdown.length === 0 ? (
                    <div className="admin-panel-empty">ยังไม่มีข้อมูล</div>
                  ) : (
                    <div className="admin-bar-list">
                      {sectorBreakdown.map((row) => (
                        <div className="admin-bar-item" key={row.label}>
                          <span className="admin-bar-label">{row.label}</span>
                          <div className="admin-bar-track">
                            <div
                              className="admin-bar-fill sector"
                              style={{
                                width: `${(row.count / maxSectorCount) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="admin-bar-value">{row.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
