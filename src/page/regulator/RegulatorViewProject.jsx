import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/RegulatorViewProject.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaArrowLeft,
  FaProjectDiagram,
  FaUsers,
  FaSpinner,
  FaUserTie,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaRegClock,
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
import api from "../../api/Api";
import { useThemedAlert } from "../../hooks/useThemedAlert";

const RegulatorViewProject = () => {
  const { fire } = useThemedAlert();
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [members, setMembers] = useState([]);
  const [ethicsRadar, setEthicsRadar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // States สำหรับแก้ไขข้อมูลโครงการ
  // ==========================================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    project_name: "",
    project_type: "",
    ai_objective: "",
    accountable_owner: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/regulator/view-project/${id}`);

      if (response.data && response.data.success) {
        setProjectData(response.data.data.project);
        setMembers(response.data.data.members || []);
        setEthicsRadar(response.data.data.ethicsRadar || []);
      } else {
        setError("ไม่พบข้อมูลโครงการนี้");
      }
    } catch (err) {
      console.error("Fetch Project Detail Error:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลโครงการ");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ฟังก์ชันจัดการการแก้ไขข้อมูลโครงการ
  // ==========================================
  const handleOpenEditModal = () => {
    setEditForm({
      project_name: projectData.project_name || "",
      project_type: projectData.project_type || "",
      ai_objective: projectData.ai_objective || "",
      accountable_owner: projectData.accountable_owner || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.project_name.trim()) {
      fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อโครงการ",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        project_name: editForm.project_name.trim(),
        project_type: editForm.project_type.trim(),
        ai_objective: editForm.ai_objective.trim(),
        accountable_owner: editForm.accountable_owner.trim(),
      };
      const response = await api.put(`/regulator/edit-project/${id}`, payload);

      if (response.data && response.data.success) {
        setProjectData((prev) => ({ ...prev, ...payload }));
        setIsEditModalOpen(false);
        fire({
          title: "สำเร็จ",
          text: "แก้ไขข้อมูลโครงการเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    } catch (err) {
      console.error("Edit Project Error:", err);
      fire({
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถแก้ไขข้อมูลโครงการได้",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // ฟังก์ชันถอดบุคลากรออกจากโครงการ
  // ==========================================
  const handleRemoveMember = (userId, name) => {
    fire({
      title: "ยืนยันการถอดออก?",
      text: `คุณต้องการถอด "${name || "บุคลากรท่านนี้"}" ออกจากโครงการนี้หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ถอดออก",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post(
            `/regulator/remove-project-member/${id}`,
            { user_id: userId },
          );
          if (response.data && response.data.success) {
            setMembers((prev) => prev.filter((m) => m.id !== userId));
            fire({
              title: "สำเร็จ",
              text: "ถอดบุคลากรออกจากโครงการแล้ว",
              icon: "success",
              confirmButtonColor: "#10b981",
            });
          }
        } catch (err) {
          console.error("Remove Member Error:", err);
          fire({
            title: "เกิดข้อผิดพลาด",
            text: err.response?.data?.message || "ไม่สามารถถอดบุคลากรได้",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    });
  };

  // สถานะโครงการคำนวณอัตโนมัติจากจำนวนสมาชิกที่ทำแบบประเมินตนเองแล้ว
  const getStatusMeta = (status) => {
    if (status === "Completed")
      return { label: "เสร็จสิ้น", className: "completed" };
    if (status === "In Progress")
      return { label: "กำลังดำเนินการ", className: "in-progress" };
    return { label: "รอดำเนินการ", className: "pending" };
  };

  return (
    <div className="rvp-layout">
      <SidebarRegulator />

      <div className="rvp-main-content">
        <div className="rvp-container">
          <div className="rvp-top-section">
            <button className="rvp-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> ย้อนกลับ
            </button>
            <div className="rvp-header-text">
              <h1>รายละเอียดโครงการ</h1>
              <p>ข้อมูลภาพรวมและรายชื่อบุคลากรที่รับผิดชอบ</p>
            </div>
          </div>

          {loading ? (
            <div className="rvp-state-container">
              <FaSpinner className="rvp-spin" />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="rvp-state-container rvp-error">
              <p>{error}</p>
              <button onClick={() => navigate(-1)} className="rvp-btn-retry">
                ย้อนกลับไปหน้าจัดการโครงการ
              </button>
            </div>
          ) : (
            projectData && (
              <>
                {/* ข้อมูลโครงการ */}
                <div className="rvp-summary-grid">
                  <div className="rvp-card main-info">
                    <div className="rvp-card-icon-wrapper project-icon">
                      <FaProjectDiagram />
                    </div>
                    <div className="rvp-card-details">
                      <span className="rvp-label">
                        รหัสโครงการ: {projectData.project_code}
                      </span>
                      <h2 className="rvp-title">
                        {projectData.project_name}
                        <button
                          className="rvp-edit-name-btn"
                          onClick={handleOpenEditModal}
                          title="แก้ไขชื่อโครงการ"
                        >
                          <FaEdit />
                        </button>
                      </h2>
                      <span className="rvp-date-badge">
                        บันทึกเมื่อ:{" "}
                        {new Date(projectData.created_at).toLocaleDateString(
                          "th-TH",
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="rvp-card">
                    <div className="rvp-card-icon-wrapper group-icon">
                      <FaUsers />
                    </div>
                    <div className="rvp-card-details">
                      <span className="rvp-label">บุคลากรที่รับผิดชอบ</span>
                      <h2 className="rvp-title highlight">
                        {members.length} <small>คน</small>
                      </h2>
                    </div>
                  </div>

                  <div className="rvp-card">
                    <div className="rvp-card-icon-wrapper status-icon">
                      <FaCheckCircle />
                    </div>
                    <div className="rvp-card-details">
                      <span className="rvp-label">สถานะความคืบหน้า</span>
                      <span
                        className={`rvp-status-badge ${getStatusMeta(projectData.status).className}`}
                      >
                        {getStatusMeta(projectData.status).label}
                      </span>
                      <div className="rvp-status-progress-track">
                        <div
                          className="rvp-status-progress-fill"
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
                      <span className="rvp-status-fraction">
                        {projectData.completed_members || 0}/
                        {projectData.total_members || 0} คนประเมินตนเองแล้ว
                      </span>
                    </div>
                  </div>
                </div>

                {/* ข้อมูลกำกับดูแล AI เพิ่มเติม */}
                <div className="rvp-list-section">
                  <div className="rvp-list-header">
                    <h2>ข้อมูลเพิ่มเติมของโครงการ</h2>
                  </div>
                  <div className="rvp-info-grid">
                    <div className="rvp-info-item">
                      <span>ประเภทโครงการ</span>
                      <p>{projectData.project_type || "ยังไม่ระบุ"}</p>
                    </div>
                    <div className="rvp-info-item">
                      <span>ฝ่ายงานเจ้าของ (Accountable Owner)</span>
                      <p>{projectData.accountable_owner || "ยังไม่ระบุ"}</p>
                    </div>
                    <div className="rvp-info-item">
                      <span>วัตถุประสงค์ของ AI</span>
                      <p>{projectData.ai_objective || "ยังไม่ระบุ"}</p>
                    </div>
                  </div>
                </div>

                {/* รายชื่อสมาชิก */}
                <div className="rvp-list-section">
                  <div className="rvp-list-header">
                    <h2>รายชื่อผู้รับผิดชอบโครงการ</h2>
                  </div>

                  <div className="rvp-table-responsive">
                    <table className="rvp-card-table">
                      <thead>
                        <tr>
                          <th>ชื่อ-นามสกุล</th>
                          <th>อีเมลติดต่อ</th>
                          <th>รหัสผู้ใช้ (Username)</th>
                          <th className="rvp-text-center">สถานะการประเมิน</th>
                          <th className="rvp-text-center">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member, index) => (
                          <tr key={index}>
                            <td>
                              <div className="rvp-user-profile">
                                <div className="rvp-avatar">
                                  {member.name ? member.name.charAt(0) : "U"}
                                </div>
                                <span className="rvp-user-name">
                                  {member.name || "ไม่มีชื่อ"}
                                </span>
                              </div>
                            </td>
                            <td className="rvp-text-muted">
                              {member.email || "-"}
                            </td>
                            <td className="rvp-text-muted">
                              @{member.username}
                            </td>
                            <td className="rvp-text-center">
                              {member.has_assessed ? (
                                <span className="rvp-assess-badge done">
                                  <FaCheckCircle /> ประเมินแล้ว
                                </span>
                              ) : (
                                <span className="rvp-assess-badge pending">
                                  <FaRegClock /> ยังไม่ประเมิน
                                </span>
                              )}
                            </td>
                            <td className="rvp-text-center">
                              <button
                                className="rvp-btn-remove"
                                title="ถอดออกจากโครงการ"
                                onClick={() =>
                                  handleRemoveMember(member.id, member.name)
                                }
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {members.length === 0 && (
                          <tr>
                            <td colSpan="5" className="rvp-empty-state">
                              ยังไม่มีการเพิ่มบุคลากรรับผิดชอบในโครงการนี้
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ภาพรวมคะแนนประเมินจริยธรรม AI เฉพาะสมาชิกในโครงการนี้ */}
                <div className="rvp-list-section rvp-radar-section">
                  <div className="rvp-list-header">
                    <h2>ภาพรวมคะแนนประเมินจริยธรรม AI ของโครงการนี้</h2>
                    <span className="rvp-list-subtitle">
                      คำนวณจากผลประเมินตนเองของบุคลากรที่ทำแบบประเมินแล้วในโครงการนี้เท่านั้น
                    </span>
                  </div>
                  <div className="rvp-radar-body">
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
                      <div className="rvp-empty-state">
                        ยังไม่มีบุคลากรในโครงการนี้ที่ทำแบบประเมินตนเอง
                      </div>
                    )}
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* Modal แก้ไขข้อมูลโครงการ */}
      {isEditModalOpen && (
        <div className="rvp-modal-overlay">
          <div className="rvp-modal-container">
            <div className="rvp-modal-header">
              <h2>แก้ไขข้อมูลโครงการ</h2>
              <button
                className="rvp-modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="rvp-modal-body">
              <div className="rvp-form-group">
                <label>ชื่อโครงการ (AI System Name)</label>
                <input
                  type="text"
                  name="project_name"
                  placeholder="ระบุชื่อระบบ AI"
                  value={editForm.project_name}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className="rvp-form-group">
                <label>ประเภทโครงการ (ไม่บังคับ)</label>
                <input
                  type="text"
                  name="project_type"
                  placeholder="เช่น พัฒนาขึ้นเอง, ซื้อ, ฝังมากับระบบ/Software (Embedded), จ้างดำเนินการแทน (Outsource)"
                  value={editForm.project_type}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="rvp-form-group">
                <label>วัตถุประสงค์ของ AI (ไม่บังคับ)</label>
                <textarea
                  name="ai_objective"
                  placeholder="อธิบายวัตถุประสงค์การใช้งาน AI ในโครงการนี้"
                  value={editForm.ai_objective}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="rvp-form-group">
                <label>ฝ่ายงานเจ้าของ (Accountable Owner) (ไม่บังคับ)</label>
                <input
                  type="text"
                  name="accountable_owner"
                  placeholder="เช่น ฝ่ายเทคโนโลยีสารสนเทศ"
                  value={editForm.accountable_owner}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="rvp-modal-footer">
                <button
                  type="button"
                  className="rvp-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rvp-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatorViewProject;
