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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/Api";

const RegulatorDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    orgName: "", // เพิ่ม orgName ใน state เริ่มต้น
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = JSON.parse(localStorage.getItem("user"));
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
                {/* Chart */}
                <div className="rgdash-card rgdash-chart-card">
                  <div className="rgdash-card-header">
                    <h2>Project Status Overview</h2>
                  </div>
                  <div className="rgdash-chart-body">
                    {(dashboardData.chartData || []).length > 0 ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <AreaChart
                          data={dashboardData.chartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorProjects"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="projects"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorProjects)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="rgdash-empty-state">
                        ไม่มีข้อมูลโครงการสำหรับสร้างกราฟ
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
                    <button
                      className="rgdash-btn-outline-primary"
                      onClick={() => {
                        /* Navigate to add user */
                      }}
                    >
                      <FaUserPlus /> Add
                    </button>
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
                            <div className="rgdash-item-right">
                              <span className="rgdash-role-text">
                                {user.role}
                              </span>
                            </div>
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
                                className={`rgdash-badge ${getStatusColor(proj.status)}`}
                              >
                                {proj.status}
                              </span>
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
