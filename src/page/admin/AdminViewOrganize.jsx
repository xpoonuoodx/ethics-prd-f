import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/AdminViewOrganize.css";
import {
  FaArrowLeft,
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaProjectDiagram,
  FaSpinner,
  FaUserShield,
  FaUser,
  FaFileAlt,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import api from "../../api/Api";

const AdminViewOrganize = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState(null);
  const [orgUsers, setOrgUsers] = useState([]);
  const [orgProjects, setOrgProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // States สำหรับแก้ไขชื่อหน่วยงาน
  // ==========================================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOrgName, setEditOrgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // Custom Alert Modal State
  // ==========================================
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    desc: "",
  });

  const openAlert = (type, title, desc) => {
    setAlertModal({ isOpen: true, type, title, desc });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrganizationDetails();
  }, [id]);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/admin/view-organize/${id}`);

      if (response.data && response.data.success) {
        setOrganization(response.data.data.organization);
        setOrgUsers(response.data.data.users || []);
        setOrgProjects(response.data.data.projects || []);
      } else {
        setError("ไม่พบข้อมูลหน่วยงานนี้ในระบบ");
      }
    } catch (err) {
      console.error("Fetch Organize Detail Error:", err);
      if (err.response && err.response.status === 404) {
        setError("ไม่พบข้อมูลหน่วยงานนี้ในระบบ");
      } else {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล โปรดลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return {
          label: "ผู้ดูแลระบบ",
          icon: <FaUserShield />,
          className: "admin-view-org-badge-admin",
        };
      case "regulator":
        return {
          label: "ผู้กำกับดูแล",
          icon: <FaUserTie />,
          className: "admin-view-org-badge-regulator",
        };
      default:
        return {
          label: "ผู้ใช้งานทั่วไป",
          icon: <FaUser />,
          className: "admin-view-org-badge-user",
        };
    }
  };

  // ==========================================
  // ฟังก์ชันจัดการการแก้ไขหน่วยงาน
  // ==========================================
  const handleOpenEditModal = () => {
    setEditOrgName(organization.name);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editOrgName.trim()) {
      openAlert("warning", "ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อหน่วยงาน");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.put(`/admin/edit-organize/${id}`, {
        org_name: editOrgName,
      });

      if (response.data && response.data.success) {
        setIsEditModalOpen(false);
        openAlert("success", "สำเร็จ", "แก้ไขชื่อหน่วยงานเรียบร้อยแล้ว");
        fetchOrganizationDetails();
      }
    } catch (err) {
      console.error("Edit Organization Error:", err);
      openAlert(
        "error",
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || "ไม่สามารถแก้ไขชื่อหน่วยงานได้",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-view-org-layout">
      <SidebarAdmin />

      <div className="admin-view-org-main-content">
        <div className="admin-view-org-content-inner">
          <div className="admin-view-org-top-section">
            <button
              className="admin-view-org-back-btn"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft /> ย้อนกลับ
            </button>
            <div className="admin-view-org-header-text">
              <h1>รายละเอียดหน่วยงาน</h1>
              <p>ข้อมูลภาพรวม โครงการ และบุคลากรภายในหน่วยงาน</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-view-org-state-container">
              <FaSpinner className="admin-view-org-spin" />
              <p>กำลังโหลดข้อมูลหน่วยงาน...</p>
            </div>
          ) : error ? (
            <div className="admin-view-org-state-container admin-view-org-error">
              <p>{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="admin-view-org-btn-retry"
              >
                ย้อนกลับไปหน้าจัดการหน่วยงาน
              </button>
            </div>
          ) : (
            organization && (
              <>
                {/* Cards ข้อมูลภาพรวม */}
                <div className="admin-view-org-summary-grid">
                  <div className="admin-view-org-card admin-view-org-main-info">
                    <div className="admin-view-org-card-icon-wrapper admin-view-org-building-icon">
                      <FaBuilding />
                    </div>
                    <div className="admin-view-org-card-details">
                      <span className="admin-view-org-label">
                        รหัสหน่วยงาน: {organization.id}
                      </span>
                      <h2 className="admin-view-org-title">
                        {organization.name}
                        <button
                          className="admin-view-org-edit-name-btn"
                          onClick={handleOpenEditModal}
                          title="แก้ไขชื่อหน่วยงาน"
                        >
                          <FaEdit />
                        </button>
                      </h2>
                      <span
                        className={`admin-view-org-status-badge ${
                          organization.status === "Active"
                            ? "admin-view-org-active"
                            : "admin-view-org-inactive"
                        }`}
                      >
                        {organization.status === "Active"
                          ? "กำลังเปิดใช้งาน"
                          : "ระงับการใช้งาน"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-view-org-card">
                    <div className="admin-view-org-card-icon-wrapper admin-view-org-user-tie-icon">
                      <FaUserTie />
                    </div>
                    <div className="admin-view-org-card-details">
                      <span className="admin-view-org-label">
                        ผู้กำกับดูแลหน่วยงาน
                      </span>
                      <h2 className="admin-view-org-title">
                        {organization.regulatorName || "ยังไม่มีผู้ดูแล"}
                      </h2>
                    </div>
                  </div>

                  <div className="admin-view-org-card">
                    <div className="admin-view-org-card-icon-wrapper admin-view-org-project-icon">
                      <FaProjectDiagram />
                    </div>
                    <div className="admin-view-org-card-details">
                      <span className="admin-view-org-label">
                        โครงการทั้งหมด
                      </span>
                      <h2 className="admin-view-org-title admin-view-org-highlight">
                        {organization.totalProjects || 0} <small>โครงการ</small>
                      </h2>
                    </div>
                  </div>

                  <div className="admin-view-org-card">
                    <div className="admin-view-org-card-icon-wrapper admin-view-org-group-icon">
                      <FaUsers />
                    </div>
                    <div className="admin-view-org-card-details">
                      <span className="admin-view-org-label">
                        ผู้ใช้งานในระบบ
                      </span>
                      <h2 className="admin-view-org-title admin-view-org-highlight">
                        {organization.totalUsers || 0} <small>บัญชี</small>
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Table: บุคลากร */}
                <div
                  className="admin-view-org-list-section"
                  style={{ marginBottom: "30px" }}
                >
                  <div className="admin-view-org-list-header">
                    <h2>บุคลากรในสังกัด ({(orgUsers || []).length})</h2>
                  </div>
                  <div className="admin-view-org-table-responsive">
                    <table className="admin-view-org-table">
                      <thead>
                        <tr>
                          <th>ชื่อ-นามสกุล</th>
                          <th>อีเมลติดต่อ</th>
                          <th>รหัสผู้ใช้ (Username)</th>
                          <th>สิทธิ์การใช้งาน (Role)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(orgUsers || []).map((user, index) => {
                          const roleData = getRoleBadge(user.role);
                          return (
                            <tr key={index}>
                              <td>
                                <div className="admin-view-org-user-profile">
                                  <div className="admin-view-org-avatar">
                                    {user.name ? user.name.charAt(0) : "U"}
                                  </div>
                                  <span className="admin-view-org-user-name">
                                    {user.name || "ไม่มีชื่อ"}
                                  </span>
                                </div>
                              </td>
                              <td className="admin-view-org-col-username">
                                {user.email || "-"}
                              </td>
                              <td className="admin-view-org-col-username">
                                {user.username}
                              </td>
                              <td>
                                <span
                                  className={`admin-view-org-role-badge ${roleData.className}`}
                                >
                                  {roleData.icon} {roleData.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}

                        {(orgUsers || []).length === 0 && (
                          <tr>
                            <td
                              colSpan="4"
                              className="admin-view-org-empty-state"
                            >
                              ยังไม่มีบุคลากรในหน่วยงานนี้
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ตารางโครงการ */}
                <div className="admin-view-org-list-section">
                  <div className="admin-view-org-list-header">
                    <h2>โครงการในหน่วยงาน ({(orgProjects || []).length})</h2>
                  </div>
                  <div className="admin-view-org-table-responsive">
                    <table className="admin-view-org-table">
                      <thead>
                        <tr>
                          <th>ชื่อโครงการ</th>
                          <th style={{ textAlign: "center" }}>จำนวน (คน)</th>
                          <th>รายชื่อผู้รับผิดชอบ</th>
                          <th>สถานะ</th>
                          <th>วันที่สร้าง</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(orgProjects || []).map((proj) => (
                          <tr key={proj.id}>
                            <td>
                              <div className="admin-view-org-user-profile">
                                <FaFileAlt style={{ color: "#94a3b8" }} />
                                <span className="admin-view-org-user-name">
                                  {proj.project_name}
                                </span>
                              </div>
                            </td>
                            {/* จำนวนบุคลากรในโครงการ */}
                            <td style={{ textAlign: "center" }}>
                              <span
                                className="admin-view-org-role-badge"
                                style={{
                                  background: "#f1f5f9",
                                  color: "#475569",
                                }}
                              >
                                {proj.member_count || 0}
                              </span>
                            </td>
                            {/* ป้ายชื่อรายชื่อบุคลากร */}
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "6px",
                                }}
                              >
                                {proj.members && proj.members.length > 0 ? (
                                  proj.members.map((m, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        background: "#e0e7ff",
                                        color: "#3730a3",
                                        padding: "4px 10px",
                                        borderRadius: "50px",
                                        fontSize: "11px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {m.name && m.name.trim() !== ""
                                        ? m.name
                                        : m.username}
                                    </span>
                                  ))
                                ) : (
                                  <span
                                    style={{
                                      color: "#94a3b8",
                                      fontSize: "12px",
                                    }}
                                  >
                                    - ยังไม่มีบุคลากร -
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`admin-view-org-role-badge ${
                                  proj.status === "Active"
                                    ? "admin-view-org-badge-regulator"
                                    : "admin-view-org-badge-user"
                                }`}
                              >
                                {proj.status}
                              </span>
                            </td>
                            <td className="admin-view-org-col-username">
                              {new Date(proj.created_at).toLocaleDateString(
                                "th-TH",
                              )}
                            </td>
                          </tr>
                        ))}

                        {(orgProjects || []).length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              className="admin-view-org-empty-state"
                            >
                              ไม่มีโครงการในหน่วยงานนี้
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

      {/* ==========================================
          Modal แก้ไขข้อมูลหน่วยงาน 
          ========================================== */}
      {isEditModalOpen && (
        <div className="admin-view-org-modal-overlay">
          <div className="admin-view-org-modal-content">
            <div className="admin-view-org-modal-header">
              <h2>แก้ไขข้อมูลหน่วยงาน</h2>
              <button
                className="admin-view-org-modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={handleEditSubmit}
              className="admin-view-org-modal-body"
            >
              <div className="admin-view-org-form-group">
                <label>ชื่อหน่วยงาน (Organization Name)</label>
                <input
                  type="text"
                  placeholder="กรอกชื่อหน่วยงานใหม่"
                  value={editOrgName}
                  onChange={(e) => setEditOrgName(e.target.value)}
                  required
                />
              </div>
              <div className="admin-view-org-modal-footer">
                <button
                  type="button"
                  className="admin-view-org-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="admin-view-org-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          Custom Alert Modal Popup 
          ========================================== */}
      {alertModal.isOpen && (
        <div className="admin-view-org-modal-overlay" onClick={closeAlert}>
          <div
            className="admin-view-org-alert-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`admin-view-org-alert-icon admin-view-org-alert-${alertModal.type}`}
            >
              {alertModal.type === "success" && <FaCheckCircle />}
              {alertModal.type === "error" && <FaTimesCircle />}
              {alertModal.type === "warning" && <FaExclamationTriangle />}
              {alertModal.type === "info" && <FaInfoCircle />}
            </div>
            <h3 className="admin-view-org-alert-title">{alertModal.title}</h3>
            <p className="admin-view-org-alert-desc">{alertModal.desc}</p>
            <button
              className={`admin-view-org-alert-btn admin-view-org-alert-${alertModal.type}`}
              onClick={closeAlert}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewOrganize;
