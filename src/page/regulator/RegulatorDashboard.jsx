import React, { useEffect, useState } from "react";
import "./style/RegulatorDashboard.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaSearch,
  FaSyncAlt,
  FaFileExport,
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
    recentUsers: [],
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ข้อมูล Mock สำหรับกราฟ 6 เหลี่ยม (คะแนนการประเมินภาพรวมหน่วยงาน)
  const mockEvaluationScores = [
    { subject: "ความโปร่งใส", score: 85, fullMark: 100 },
    { subject: "ความเป็นธรรม", score: 78, fullMark: 100 },
    { subject: "ความปลอดภัย", score: 92, fullMark: 100 },
    { subject: "ความเป็นส่วนตัว", score: 88, fullMark: 100 },
    { subject: "ความรับผิดชอบ", score: 75, fullMark: 100 },
    { subject: "ความน่าเชื่อถือ", score: 80, fullMark: 100 },
  ];

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

  const getStatusColor = (status) => {
    if (!status) return "status-default";
    const lower = status.toLowerCase();
    if (lower === "pending" || lower === "รอประเมิน") return "status-warning";
    if (
      lower === "active" ||
      lower === "completed" ||
      lower === "ดำเนินการแล้ว"
    )
      return "status-success";
    if (lower === "rejected" || lower === "ความเสี่ยงสูง")
      return "status-danger";
    return "status-default";
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
            {/* <div className="rgdash-header-actions">
              <button
                className="rgdash-btn-icon-outline"
                onClick={fetchDashboardData}
                title="Refresh"
              >
                <FaSyncAlt />
              </button>
              <button className="rgdash-btn-primary">
                Export <FaFileExport />
              </button>
            </div> */}
          </div>

          {loading ? (
            <div className="rgdash-loading-state">กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div className="rgdash-error-state">{error}</div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="rgdash-stats-row">
                <div className="rgdash-stat-card">
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

                <div className="rgdash-stat-card">
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

                <div className="rgdash-stat-card">
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

                <div className="rgdash-stat-card">
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

              {/* Middle Section */}
              <div className="rgdash-middle-section">
                {/* Chart (เปลี่ยนเป็นกราฟ 6 เหลี่ยม) */}
                <div className="rgdash-card rgdash-chart-card">
                  <div className="rgdash-card-header">
                    <h2>คะแนนประเมินจริยธรรม AI (ภาพรวมหน่วยงาน)</h2>
                  </div>
                  <div
                    className="rgdash-chart-body"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="75%"
                        data={mockEvaluationScores}
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
                        {/* <th>Status</th> */}
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
                            {/* <td>
                              <span
                                className={`rgdash-badge ${getStatusColor(proj.status)}`}
                              >
                                {proj.status}
                              </span>
                            </td> */}
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
