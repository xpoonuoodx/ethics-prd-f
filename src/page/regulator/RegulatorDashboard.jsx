import React, { useEffect, useState } from "react";
import "./style/RegulatorDashboard.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaSearch,
  FaSyncAlt,
  FaUserPlus,
  FaRegFileAlt,
  FaRegCheckCircle,
  FaRegClock,
  FaUsers,
} from "react-icons/fa";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api, { getStoredUser } from "../../api/Api";

const RegulatorDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    orgName: "",
    stats: {
      totalProjects: 0,
      totalUsers: 0,
      pendingProjects: 0,
      activeProjects: 0,
    },
    chartData: [],
    ethicsRadar: [],
    recentUsers: [],
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = getStoredUser();
    setUserData(storedUser);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/regulator/dashboard");
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Dashboard Error:", err);
      setError("ไม่สามารถดึงข้อมูลแดชบอร์ดได้");
    } finally {
      setLoading(false);
    }
  };

  // สถานะโครงการคำนวณอัตโนมัติจากจำนวนสมาชิกที่ทำแบบประเมินตนเองแล้ว
  // (Pending = ยังไม่มีใครทำ, In Progress = ทำแล้วบางส่วน, Completed = ทำครบทุกคน)
  const getStatusMeta = (status) => {
    if (status === "Completed")
      return { label: "เสร็จสิ้น", className: "status-success" };
    if (status === "In Progress")
      return { label: "กำลังดำเนินการ", className: "status-info" };
    return { label: "รอดำเนินการ", className: "status-warning" };
  };

  return (
    <div className="rgdash-layout">
      <SidebarRegulator />

      <div className="rgdash-main-content">
        <div className="rgdash-container">
          {/* Header */}
          <div className="rgdash-header">
            <div className="rgdash-header-title">
              <h1>Dashboard</h1>
              <p>
                Welcome back, {userData?.name || "Regulator"}
                {dashboardData.orgName ? ` | ${dashboardData.orgName}` : ""}
              </p>
            </div>
            <div className="rgdash-header-actions">
              <button
                className="rgdash-btn-icon-outline"
                onClick={fetchDashboardData}
                title="รีเฟรชข้อมูล"
              >
                <FaSyncAlt />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rgdash-loading-state">กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div className="rgdash-error-state">{error}</div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="rgdash-stats-row">
                <div className="rgdash-stat-card accent-teal">
                  <div className="rgdash-stat-top">
                    <span className="rgdash-stat-label">TOTAL PROJECTS</span>
                    <div className="rgdash-stat-icon teal-icon">
                      <FaRegFileAlt />
                    </div>
                  </div>
                  <div className="rgdash-stat-value">
                    {dashboardData.stats.totalProjects}
                  </div>
                </div>

                <div className="rgdash-stat-card accent-green">
                  <div className="rgdash-stat-top">
                    <span className="rgdash-stat-label">ACTIVE PROJECTS</span>
                    <div className="rgdash-stat-icon green-icon">
                      <FaRegCheckCircle />
                    </div>
                  </div>
                  <div className="rgdash-stat-value">
                    {dashboardData.stats.activeProjects}
                  </div>
                </div>

                <div className="rgdash-stat-card accent-orange">
                  <div className="rgdash-stat-top">
                    <span className="rgdash-stat-label">PENDING REVIEW</span>
                    <div className="rgdash-stat-icon orange-icon">
                      <FaRegClock />
                    </div>
                  </div>
                  <div className="rgdash-stat-value">
                    {dashboardData.stats.pendingProjects}
                  </div>
                </div>

                <div className="rgdash-stat-card accent-blue">
                  <div className="rgdash-stat-top">
                    <span className="rgdash-stat-label">TOTAL USERS</span>
                    <div className="rgdash-stat-icon blue-icon">
                      <FaUsers />
                    </div>
                  </div>
                  <div className="rgdash-stat-value">
                    {dashboardData.stats.totalUsers}
                  </div>
                </div>
              </div>

              {/* สัดส่วนสถานะโครงการ (ใช้ chartData ที่ backend คำนวณไว้แล้ว) */}
              {dashboardData.chartData && dashboardData.chartData.length > 0 && (
                <div className="rgdash-status-breakdown">
                  <div className="rgdash-status-breakdown-header">
                    <h2>สัดส่วนสถานะโครงการ</h2>
                    <span className="rgdash-subtitle">
                      สถานะคำนวณอัตโนมัติจากจำนวนบุคลากรที่ทำแบบประเมินตนเองในแต่ละโครงการ
                      — รอดำเนินการ (ยังไม่มีใครประเมิน) · กำลังดำเนินการ
                      (ประเมินแล้วบางส่วน) · เสร็จสิ้น (ประเมินครบทุกคน)
                    </span>
                  </div>
                  <div className="rgdash-status-breakdown-items">
                    {dashboardData.chartData.map((item) => {
                      const total = dashboardData.chartData.reduce(
                        (sum, c) => sum + c.projects,
                        0,
                      );
                      const pct =
                        total > 0 ? (item.projects / total) * 100 : 0;
                      return (
                        <div key={item.name} className="rgdash-status-item">
                          <div className="rgdash-status-item-label">
                            <span
                              className="rgdash-status-dot"
                              style={{ backgroundColor: item.color }}
                            ></span>
                            <span>{item.name || "ไม่ระบุสถานะ"}</span>
                            <strong>{item.projects}</strong>
                          </div>
                          <div className="rgdash-status-bar-track">
                            <div
                              className="rgdash-status-bar-fill"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: item.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Middle Section */}
              <div className="rgdash-middle-section">
                {/* Chart (เปลี่ยนเป็นกราฟ 6 เหลี่ยม) */}
                <div className="rgdash-card rgdash-chart-card">
                  <div className="rgdash-card-header">
                    <div>
                      <h2>คะแนนประเมินจริยธรรม AI (ภาพรวมหน่วยงาน)</h2>
                      <span className="rgdash-subtitle">
                        คำนวณจากผลประเมินตนเองของบุคลากรในหน่วยงานนี้เท่านั้น
                      </span>
                    </div>
                  </div>
                  <div
                    className="rgdash-chart-body"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {dashboardData.ethicsRadar &&
                    dashboardData.ethicsRadar.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="75%"
                          data={dashboardData.ethicsRadar}
                        >
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{
                              fill: "#64748b",
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            tickCount={6}
                          />
                          <Radar
                            name="คะแนนเฉลี่ย"
                            dataKey="score"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="#10b981"
                            fillOpacity={0.3}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "10px",
                              border: "none",
                              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                              fontSize: "13px",
                              color: "#1e293b",
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="rgdash-empty-state">
                        ยังไม่มีข้อมูลการประเมินตนเองในหน่วยงานนี้
                      </div>
                    )}
                  </div>
                </div>

                {/* User List */}
                <div className="rgdash-card rgdash-users-card">
                  <div className="rgdash-card-header-flex">
                    <div>
                      <h2>Team Members</h2>
                      <span className="rgdash-subtitle">บุคลากรในหน่วยงาน</span>
                    </div>
                    {/* <button
                      className="rgdash-btn-outline-primary"
                      onClick={() => {
                       
                      }}
                    >
                      <FaUserPlus /> Add
                    </button> */}
                  </div>
                  <div className="rgdash-list-body">
                    {(dashboardData.recentUsers || []).length > 0 ? (
                      <div className="rgdash-user-list">
                        {dashboardData.recentUsers.map((user) => (
                          <div key={user.id} className="rgdash-list-item">
                            <div className="rgdash-item-left">
                              <div className="rgdash-avatar">
                                {user.name ? user.name.charAt(0) : "U"}
                              </div>
                              <div className="rgdash-item-info">
                                <span className="rgdash-item-title">
                                  {user.name || user.username}
                                </span>
                                <span className="rgdash-item-sub">
                                  @{user.username}
                                </span>
                              </div>
                            </div>
                            {/* <div className="rgdash-item-right">
                              <span className="rgdash-role-text">
                                {user.role}
                              </span>
                            </div> */}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rgdash-empty-state">
                        ยังไม่มีบุคลากรในระบบ
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Table */}
              <div className="rgdash-card rgdash-table-card">
                <div className="rgdash-card-header-flex">
                  <div>
                    <h2>Project List</h2>
                    <span className="rgdash-subtitle">
                      {(dashboardData.recentProjects || []).length} projects
                      found
                    </span>
                  </div>
                  <div className="rgdash-table-actions">
                    <div className="rgdash-search-box">
                      <FaSearch className="rgdash-search-icon" />
                      <input type="text" placeholder="Search projects..." />
                    </div>
                  </div>
                </div>

                <div className="rgdash-table-container">
                  <table className="rgdash-table">
                    <thead>
                      <tr>
                        <th>Project Name</th>
                        <th>Manager</th>
                        <th>Progress</th>
                        <th>Created Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dashboardData.recentProjects || []).length > 0 ? (
                        dashboardData.recentProjects.map((proj) => (
                          <tr key={proj.id}>
                            <td className="rgdash-font-medium">
                              {proj.project_name}
                            </td>
                            <td className="rgdash-text-muted">
                              {proj.manager || "Unassigned"}
                            </td>
                            <td>
                              <span className="rgdash-text-muted">
                                {proj.progress || 0}%
                              </span>
                            </td>
                            <td className="rgdash-text-muted">
                              {new Date(proj.created_at).toLocaleDateString(
                                "th-TH",
                              )}
                            </td>
                            <td>
                              <span
                                className={`rgdash-badge ${getStatusMeta(proj.status).className}`}
                              >
                                {getStatusMeta(proj.status).label}
                              </span>
                              <div className="rgdash-status-fraction">
                                {proj.completed_members || 0}/
                                {proj.total_members || 0} คนประเมินแล้ว
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="rgdash-empty-state"
                            style={{ padding: "40px 0" }}
                          >
                            ไม่พบข้อมูลโครงการในหน่วยงานนี้
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboard;
