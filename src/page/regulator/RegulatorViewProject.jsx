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
} from "react-icons/fa";
import api from "../../api/Api";
import Swal from "sweetalert2";

const RegulatorViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // States สำหรับแก้ไขชื่อโครงการ
  // ==========================================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProjectName, setEditProjectName] = useState("");
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
  // ฟังก์ชันจัดการการแก้ไขชื่อโครงการ
  // ==========================================
  const handleOpenEditModal = () => {
    setEditProjectName(projectData.project_name);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProjectName.trim()) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อโครงการ",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.put(`/regulator/edit-project/${id}`, {
        project_name: editProjectName.trim(),
      });

      if (response.data && response.data.success) {
        setProjectData((prev) => ({
          ...prev,
          project_name: editProjectName.trim(),
        }));
        setIsEditModalOpen(false);
        Swal.fire({
          title: "สำเร็จ",
          text: "แก้ไขชื่อโครงการเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    } catch (err) {
      console.error("Edit Project Error:", err);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถแก้ไขชื่อโครงการได้",
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
    Swal.fire({
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
            Swal.fire({
              title: "สำเร็จ",
              text: "ถอดบุคลากรออกจากโครงการแล้ว",
              icon: "success",
              confirmButtonColor: "#10b981",
            });
          }
        } catch (err) {
          console.error("Remove Member Error:", err);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: err.response?.data?.message || "ไม่สามารถถอดบุคลากรได้",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    });
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
                            <td colSpan="4" className="rvp-empty-state">
                              ยังไม่มีการเพิ่มบุคลากรรับผิดชอบในโครงการนี้
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* Modal แก้ไขชื่อโครงการ */}
      {isEditModalOpen && (
        <div className="rvp-modal-overlay">
          <div className="rvp-modal-container">
            <div className="rvp-modal-header">
              <h2>แก้ไขชื่อโครงการ</h2>
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
                  placeholder="ระบุชื่อระบบ AI"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  required
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
