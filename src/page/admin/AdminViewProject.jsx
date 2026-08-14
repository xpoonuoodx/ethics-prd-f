import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/AdminViewProject.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaRegClock,
  FaHashtag,
  FaCalendarAlt,
  FaUsers,
  FaCogs,
  FaLayerGroup,
  FaCertificate,
} from "react-icons/fa";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/Api";
import { getAvatarColor, timeAgoTh } from "../../utils/projectDisplay";
import { SECTOR_LABELS } from "../../utils/sectorLabels";

const AdminViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [members, setMembers] = useState([]);
  const [ethicsRadar, setEthicsRadar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/view-project/${id}`);

      if (response.data && response.data.success) {
        setProjectData(response.data.data.project);
        setMembers(response.data.data.members || []);
        setEthicsRadar(response.data.data.ethicsRadar || []);
      } else {
        setError("ไม่พบข้อมูลโครงการนี้");
      }
    } catch (err) {
      console.error("Fetch Admin Project Detail Error:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลโครงการ");
    } finally {
      setLoading(false);
    }
  };

  const getStatusMeta = (status) => {
    if (status === "Completed")
      return { label: "เสร็จสิ้น", className: "completed" };
    if (status === "In Progress")
      return { label: "กำลังดำเนินการ", className: "in-progress" };
    return { label: "รอดำเนินการ", className: "pending" };
  };

  return (
    <div className="avp-layout">
      <SidebarAdmin />

      <div className="avp-main-content">
        <div className="avp-container">
          <button className="avp-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> กลับไปหน้าภาพรวมโครงการ
          </button>

          {loading ? (
            <div className="avp-state-container">
              <FaSpinner className="avp-spin" />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="avp-state-container avp-error">
              <p>{error}</p>
            </div>
          ) : (
            projectData && (
              <>
                {/* ===== การ์ดหัวข้อแบบ Model Card ===== */}
                <div className="avp-card-header">
                  {/* แบนเนอร์สีไล่โทนตามชื่อหน่วยงาน แทนที่รูปภาพปกที่ไม่มีให้ใช้ (สไตล์หน้าโมเดลของ Hugging Face) */}
                  <div
                    className="avp-banner"
                    style={{
                      background: `linear-gradient(135deg, ${getAvatarColor(projectData.org_name)}, #0f172a)`,
                    }}
                  >
                    <div className="avp-org-line">
                      <div className="avp-org-avatar">
                        {(projectData.org_name || "?").charAt(0)}
                      </div>
                      <span>{projectData.org_name || "ไม่พบหน่วยงาน"}</span>
                    </div>
                  </div>

                  <div className="avp-card-body">
                    <h1 className="avp-project-name">
                      {projectData.project_name}
                    </h1>

                    {/* แถวสถิติแบบย่อ ไอคอน+ตัวเลข เรียงเป็นบรรทัดเดียว (สไตล์ Hugging Face) */}
                    <div className="avp-stat-row">
                      <span className="avp-stat-item">
                        <FaHashtag /> {projectData.project_code}
                      </span>
                      <span className="avp-stat-dot">•</span>
                      <span className="avp-stat-item">
                        <FaCalendarAlt /> {timeAgoTh(projectData.created_at)}
                      </span>
                      <span className="avp-stat-dot">•</span>
                      <span className="avp-stat-item">
                        <FaUsers /> {projectData.total_members || 0} คน
                      </span>
                      <span className="avp-stat-dot">•</span>
                      <span className="avp-stat-item">
                        <FaCheckCircle /> {projectData.completed_members || 0}/
                        {projectData.total_members || 0} ประเมินแล้ว
                      </span>
                    </div>

                    <div className="avp-tag-row">
                      {projectData.project_type && (
                        <span className="avp-tag tag-type">
                          <FaCogs /> {projectData.project_type}
                        </span>
                      )}
                      <span
                        className={`avp-tag tag-status ${getStatusMeta(projectData.status).className}`}
                      >
                        <span className="avp-status-dot"></span>
                        {getStatusMeta(projectData.status).label}
                      </span>
                      {projectData.sector && (
                        <span className="avp-tag tag-sector">
                          <FaLayerGroup />{" "}
                          {SECTOR_LABELS[projectData.sector] ||
                            projectData.sector}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ===== เนื้อหาหลัก 2 คอลัมน์ ===== */}
                <div className="avp-content-grid">
                  {/* คอลัมน์หลัก */}
                  <div className="avp-main-col">
                    <div className="avp-section">
                      <h2 className="avp-section-title">ภาพรวมโครงการ</h2>
                      <div className="avp-spec-table">
                        <div className="avp-spec-row">
                          <span className="avp-spec-key">รหัสโครงการ</span>
                          <span className="avp-spec-val">
                            {projectData.project_code}
                          </span>
                        </div>
                        <div className="avp-spec-row">
                          <span className="avp-spec-key">หน่วยงานเจ้าของ</span>
                          <span className="avp-spec-val">
                            {projectData.org_name || "ไม่พบหน่วยงาน"}
                          </span>
                        </div>
                        <div className="avp-spec-row">
                          <span className="avp-spec-key">กลุ่มอุตสาหกรรม</span>
                          <span className="avp-spec-val">
                            {SECTOR_LABELS[projectData.sector] ||
                              projectData.sector ||
                              "ยังไม่ระบุ"}
                          </span>
                        </div>
                        <div className="avp-spec-row">
                          <span className="avp-spec-key">ประเภทโครงการ</span>
                          <span className="avp-spec-val">
                            {projectData.project_type || "ยังไม่ระบุ"}
                          </span>
                        </div>
                        <div className="avp-spec-row">
                          <span className="avp-spec-key">
                            ฝ่ายงานเจ้าของ (Accountable Owner)
                          </span>
                          <span className="avp-spec-val">
                            {projectData.accountable_owner || "ยังไม่ระบุ"}
                          </span>
                        </div>
                        <div className="avp-spec-row">
                          <span className="avp-spec-key">สถานะ</span>
                          <span className="avp-spec-val">
                            {getStatusMeta(projectData.status).label}
                          </span>
                        </div>
                        <div className="avp-spec-row">
                          <span className="avp-spec-key">วันที่สร้าง</span>
                          <span className="avp-spec-val">
                            {new Date(
                              projectData.created_at,
                            ).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              timeZone: "Asia/Bangkok",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="avp-section">
                      <h2 className="avp-section-title">
                        วัตถุประสงค์ของ AI
                      </h2>
                      <p className="avp-objective-text">
                        {projectData.ai_objective ||
                          "ยังไม่มีการระบุวัตถุประสงค์ของ AI สำหรับโครงการนี้"}
                      </p>
                    </div>

                    <div className="avp-section">
                      <h2 className="avp-section-title">
                        ผลการประเมินจริยธรรม AI
                      </h2>
                      <p className="avp-section-subtitle">
                        คำนวณจากผลประเมินตนเองของบุคลากรที่ทำแบบประเมินแล้วในโครงการนี้เท่านั้น
                        เทียบกับคะแนนเฉลี่ยของทุกโครงการทั่วทั้งระบบ
                      </p>
                      <div className="avp-radar-body">
                        {ethicsRadar.length > 0 ? (
                          <ResponsiveContainer width="100%" height={320}>
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="75%"
                              data={ethicsRadar}
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
                                name="ค่าเฉลี่ยทั้งระบบ"
                                dataKey="systemAverage"
                                stroke="#94a3b8"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                fill="#94a3b8"
                                fillOpacity={0.08}
                              />
                              <Radar
                                name="โครงการนี้"
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
                              <Legend
                                wrapperStyle={{ fontSize: "12px" }}
                                iconType="circle"
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="avp-empty-state">
                            ยังไม่มีบุคลากรในโครงการนี้ที่ทำแบบประเมินตนเอง
                          </div>
                        )}
                      </div>

                      {/* ตารางสรุปคะแนนรายหลักการ คู่กับ radar chart (สไตล์ตาราง evaluation results ของ Hugging Face) */}
                      {ethicsRadar.length > 0 && (
                        <div className="avp-spec-table avp-results-table">
                          {ethicsRadar.map((row) => (
                            <div className="avp-spec-row" key={row.subject}>
                              <span className="avp-spec-key">
                                {row.subject}
                                {row.levelName && (
                                  <span className="avp-level-name">
                                    {row.levelName}
                                  </span>
                                )}
                              </span>
                              <span className="avp-spec-val avp-score-val">
                                {row.score} / {row.fullMark}
                                <span className="avp-system-avg-val">
                                  (ระบบเฉลี่ย {row.systemAverage})
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="avp-section">
                      <h2 className="avp-section-title">
                        ทีมงาน / ผู้รับผิดชอบ
                      </h2>
                      <div className="avp-contributors">
                        {members.length > 0 ? (
                          members.map((member, index) => (
                            <div className="avp-contributor" key={index}>
                              <div className="avp-contributor-avatar">
                                {member.name ? member.name.charAt(0) : "U"}
                              </div>
                              <div className="avp-contributor-info">
                                <span className="avp-contributor-name">
                                  {member.name || "ไม่มีชื่อ"}
                                </span>
                                <span className="avp-contributor-username">
                                  @{member.username}
                                </span>
                              </div>
                              <div className="avp-contributor-badges">
                                {member.has_certificate && (
                                  <span
                                    className="avp-assess-badge certificate"
                                    title="ได้รับใบประกาศแล้ว"
                                  >
                                    <FaCertificate /> มีใบประกาศ
                                  </span>
                                )}
                                {member.has_assessed ? (
                                  <span className="avp-assess-badge done">
                                    <FaCheckCircle /> ประเมินแล้ว
                                  </span>
                                ) : (
                                  <span className="avp-assess-badge pending">
                                    <FaRegClock /> ยังไม่ประเมิน
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="avp-empty-state">
                            ยังไม่มีการเพิ่มบุคลากรรับผิดชอบในโครงการนี้
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar ข้อมูลเมทาดาทา - เหลือแค่ความคืบหน้า เพราะรายละเอียดอื่นย้ายไปรวมกับ
                      ตาราง "ภาพรวมโครงการ" ในเนื้อหาหลักแล้ว ไม่ต้องโชว์ซ้ำ 3 รอบ */}
                  <div className="avp-side-col">
                    <div className="avp-meta-card">
                      <h3 className="avp-meta-title">ความคืบหน้า</h3>
                      <div className="avp-progress-track">
                        <div
                          className="avp-progress-fill"
                          style={{
                            width: `${
                              projectData.total_members > 0
                                ? (projectData.completed_members /
                                    projectData.total_members) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="avp-progress-fraction">
                        {projectData.completed_members || 0}/
                        {projectData.total_members || 0} คนประเมินตนเองแล้ว
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminViewProject;
