import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/AdminProjectOverview.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaSearch,
  FaSpinner,
  FaCogs,
  FaHashtag,
  FaUsers,
  FaCheckCircle,
  FaCalendarAlt,
  FaProjectDiagram,
  FaBuilding,
  FaRegClock,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/Api";
import { getAvatarColor, timeAgoTh } from "../../utils/projectDisplay";

const AdminProjectOverview = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/get-all-projects");
      if (response.data && response.data.success) {
        setProjects(response.data.data);
      } else {
        setError("ไม่สามารถโหลดข้อมูลภาพรวมโครงการได้");
      }
    } catch (err) {
      console.error("Fetch All Projects Error:", err);
      setError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
      );
    } finally {
      setLoading(false);
    }
  };

  // สถานะโครงการคำนวณอัตโนมัติจากจำนวนสมาชิกที่ทำแบบประเมินตนเองแล้ว
  const getStatusMeta = (status) => {
    if (status === "Completed")
      return { label: "เสร็จสิ้น", className: "completed" };
    if (status === "In Progress")
      return { label: "กำลังดำเนินการ", className: "in-progress" };
    return { label: "รอดำเนินการ", className: "pending" };
  };

  const filteredProjects = projects.filter((p) => {
    const term = search.toLowerCase();
    return (
      (p.project_name || "").toLowerCase().includes(term) ||
      (p.project_code || "").toLowerCase().includes(term) ||
      (p.org_name || "").toLowerCase().includes(term)
    );
  });

  // สรุปตัวเลขภาพรวมสำหรับแดชบอร์ดด้านบน คำนวณจากข้อมูลที่ดึงมาแล้ว ไม่ต้องยิง API เพิ่ม
  const statusCounts = projects.reduce(
    (acc, p) => {
      acc[getStatusMeta(p.status).className] += 1;
      return acc;
    },
    { completed: 0, "in-progress": 0, pending: 0 },
  );
  const distinctOrgCount = new Set(
    projects.map((p) => p.org_name).filter(Boolean),
  ).size;
  const statusChartData = [
    { name: "เสร็จสิ้น", value: statusCounts.completed, color: "#166534" },
    {
      name: "กำลังดำเนินการ",
      value: statusCounts["in-progress"],
      color: "#1d4ed8",
    },
    { name: "รอดำเนินการ", value: statusCounts.pending, color: "#d97706" },
  ];

  return (
    <div className="apo-layout">
      <SidebarAdmin />
      <div className="apo-main-content">
        <div className="apo-container">
          <div className="apo-header">
            <h1 className="apo-title">
              ภาพรวมโครงการ
              <span className="apo-count">
                {projects.length.toLocaleString()}
              </span>
            </h1>

            <div className="apo-search-box">
              <FaSearch className="apo-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อโครงการ, รหัสโครงการ, หน่วยงาน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {!loading && !error && projects.length > 0 && (
            <div className="apo-dashboard">
              <div className="apo-stat-grid">
                <div className="apo-stat-tile">
                  <div className="apo-stat-tile-icon neutral">
                    <FaProjectDiagram />
                  </div>
                  <div>
                    <span className="apo-stat-tile-value">
                      {projects.length}
                    </span>
                    <span className="apo-stat-tile-label">
                      โครงการทั้งหมด
                    </span>
                  </div>
                </div>
                <div className="apo-stat-tile">
                  <div className="apo-stat-tile-icon purple">
                    <FaBuilding />
                  </div>
                  <div>
                    <span className="apo-stat-tile-value">
                      {distinctOrgCount}
                    </span>
                    <span className="apo-stat-tile-label">
                      หน่วยงานที่เข้าร่วม
                    </span>
                  </div>
                </div>
                <div className="apo-stat-tile">
                  <div className="apo-stat-tile-icon green">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <span className="apo-stat-tile-value">
                      {statusCounts.completed}
                    </span>
                    <span className="apo-stat-tile-label">เสร็จสิ้นแล้ว</span>
                  </div>
                </div>
                <div className="apo-stat-tile">
                  <div className="apo-stat-tile-icon amber">
                    <FaRegClock />
                  </div>
                  <div>
                    <span className="apo-stat-tile-value">
                      {statusCounts["in-progress"] + statusCounts.pending}
                    </span>
                    <span className="apo-stat-tile-label">
                      อยู่ระหว่างดำเนินการ
                    </span>
                  </div>
                </div>
              </div>

              <div className="apo-chart-card">
                <h3 className="apo-chart-title">สัดส่วนสถานะโครงการ</h3>
                <div className="apo-chart-body">
                  {/* ต้องห่อด้วย div ที่มีขนาดตายตัวเอง เพราะ ResponsiveContainer ตั้ง
                      inline style width:100% ทับ CSS ภายนอกไม่ได้ ถ้าเป็นลูกตรงของ flex container
                      จะแย่งพื้นที่กับ legend จนล้นกรอบการ์ด */}
                  <div className="apo-chart-donut">
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
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="apo-chart-legend">
                    {statusChartData.map((entry) => (
                      <div className="apo-legend-item" key={entry.name}>
                        <span
                          className="apo-legend-dot"
                          style={{ background: entry.color }}
                        ></span>
                        <span className="apo-legend-label">{entry.name}</span>
                        <span className="apo-legend-value">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="apo-list-header">
            <h2 className="apo-list-title">รายการโครงการ</h2>
            {!loading && !error && (
              <span className="apo-list-count">
                {filteredProjects.length.toLocaleString()} รายการ
              </span>
            )}
          </div>

          {loading ? (
            <div className="apo-state-container">
              <FaSpinner className="apo-spin" />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="apo-state-container apo-error">
              <p>{error}</p>
              <button onClick={fetchProjects} className="apo-btn-retry">
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="apo-empty-state">ไม่พบข้อมูลโครงการในระบบ</div>
          ) : (
            <div className="apo-grid">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="apo-card"
                  onClick={() => navigate(`/admin-view-project/${proj.id}`)}
                >
                  <div className="apo-card-top">
                    <div className="apo-card-title-line">
                      <span
                        className="apo-card-avatar"
                        style={{ background: getAvatarColor(proj.org_name) }}
                      >
                        {(proj.org_name || "?").charAt(0)}
                      </span>
                      <span className="apo-card-title">
                        <span className="apo-card-org">
                          {proj.org_name || "ไม่พบหน่วยงาน"}
                        </span>
                        <span className="apo-card-slash">/</span>
                        <span className="apo-card-name">
                          {proj.project_name}
                        </span>
                      </span>
                    </div>
                    <span
                      className={`apo-status-badge ${getStatusMeta(proj.status).className}`}
                    >
                      <span className="apo-status-dot"></span>
                      {getStatusMeta(proj.status).label}
                    </span>
                  </div>

                  <div className="apo-card-stat-row">
                    <span className="apo-stat-item">
                      <FaCogs /> {proj.project_type || "ไม่ระบุประเภท"}
                    </span>
                    <span className="apo-stat-dot">•</span>
                    <span className="apo-stat-item">
                      <FaHashtag /> {proj.project_code}
                    </span>
                    <span className="apo-stat-dot">•</span>
                    <span className="apo-stat-item">
                      <FaCalendarAlt /> {timeAgoTh(proj.created_at)}
                    </span>
                    <span className="apo-stat-dot">•</span>
                    <span className="apo-stat-item">
                      <FaUsers /> {proj.total_members || 0} คน
                    </span>
                    <span className="apo-stat-dot">•</span>
                    <span className="apo-stat-item">
                      <FaCheckCircle /> {proj.completed_members || 0}/
                      {proj.total_members || 0} ประเมินแล้ว
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProjectOverview;
