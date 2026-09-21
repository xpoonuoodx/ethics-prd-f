import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/AdminUserDetail.css";
import {
  FaArrowLeft,
  FaUser,
  FaUserShield,
  FaUserTie,
  FaBuilding,
  FaEnvelope,
  FaSpinner,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import api from "../../api/Api";

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States สำหรับแก้ไขชื่อ-นามสกุล
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Alert Modal
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
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/view-user/${id}`);

      if (response.data && response.data.success) {
        setUser(response.data.data);
      } else {
        setError("ไม่พบข้อมูลผู้ใช้งานนี้ในระบบ");
      }
    } catch (err) {
      console.error("Fetch User Detail Error:", err);
      setError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้",
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return {
          label: "ผู้ดูแลระบบสูงสุด",
          icon: <FaUserShield />,
          className: "admin",
        };
      case "regulator":
        return {
          label: "ผู้กำกับดูแล",
          icon: <FaUserTie />,
          className: "regulator",
        };
      default:
        return {
          label: "ผู้ใช้งานทั่วไป",
          icon: <FaUser />,
          className: "user",
        };
    }
  };

  const handleOpenEditModal = () => {
    setEditName(user.name);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      openAlert("warning", "ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.put(`/admin/edit-user/${id}`, {
        name: editName,
      });

      if (response.data && response.data.success) {
        setIsEditModalOpen(false);
        openAlert("success", "สำเร็จ", "แก้ไขชื่อผู้ใช้งานเรียบร้อยแล้ว");
        fetchUserDetail();
      }
    } catch (err) {
      console.error("Edit User Error:", err);
      openAlert(
        "error",
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || "ไม่สามารถแก้ไขข้อมูลได้",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-user-detail-layout">
      <SidebarAdmin />

      <div className="admin-user-detail-main-content">
        <div className="admin-user-detail-content-inner">
          <div className="admin-user-detail-top-section">
            <button
              className="admin-user-detail-back-btn"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft /> ย้อนกลับ
            </button>
            <div className="admin-user-detail-header-text">
              <h1>รายละเอียดบัญชีผู้ใช้</h1>
              <p>ข้อมูลโปรไฟล์ สิทธิ์การใช้งาน และสังกัดหน่วยงาน</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-user-detail-state-container">
              <FaSpinner className="admin-user-detail-spin" />
              <p>กำลังโหลดข้อมูลผู้ใช้...</p>
            </div>
          ) : error ? (
            <div className="admin-user-detail-state-container admin-user-detail-error">
              <p>{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="admin-user-detail-btn-retry"
              >
                ย้อนกลับไปหน้าจัดการผู้ใช้
              </button>
            </div>
          ) : (
            user && (
              <div className="admin-user-detail-profile-card">
                <div className="admin-user-detail-profile-header">
                  <div className="admin-user-detail-avatar-large">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <div className="admin-user-detail-profile-title-area">
                    <h2 className="admin-user-detail-profile-name">
                      {user.name || "ไม่มีชื่อ"}
                      <button
                        className="admin-user-detail-edit-name-btn"
                        onClick={handleOpenEditModal}
                        title="แก้ไขชื่อ-นามสกุล"
                      >
                        <FaEdit />
                      </button>
                    </h2>
                    <div className="admin-user-detail-role-wrap">
                      <span
                        className={`admin-user-detail-role-badge ${getRoleBadge(user.role).className}`}
                      >
                        {getRoleBadge(user.role).icon}{" "}
                        {getRoleBadge(user.role).label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="admin-user-detail-info-grid">
                  <div className="admin-user-detail-info-item">
                    <div className="admin-user-detail-info-icon">
                      <FaUser />
                    </div>
                    <div className="admin-user-detail-info-text">
                      <label>ชื่อผู้ใช้งาน (Username)</label>
                      <p>{user.username}</p>
                    </div>
                  </div>

                  <div className="admin-user-detail-info-item">
                    <div className="admin-user-detail-info-icon">
                      <FaEnvelope />
                    </div>
                    <div className="admin-user-detail-info-text">
                      <label>อีเมล (Email)</label>
                      <p>{user.email || "-"}</p>
                    </div>
                  </div>

                  <div className="admin-user-detail-info-item">
                    <div className="admin-user-detail-info-icon">
                      <FaBuilding />
                    </div>
                    <div className="admin-user-detail-info-text">
                      <label>สังกัดหน่วยงาน</label>
                      <p>{user.org_name || "ไม่มีสังกัด"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal แก้ไขชื่อ */}
      {isEditModalOpen && (
        <div className="admin-user-detail-modal-overlay">
          <div className="admin-user-detail-modal-content">
            <div className="admin-user-detail-modal-header">
              <h2>แก้ไขข้อมูลผู้ใช้งาน</h2>
              <button
                className="admin-user-detail-modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={handleEditSubmit}
              className="admin-user-detail-modal-body"
            >
              <div className="admin-user-detail-form-group">
                <label>ชื่อ-นามสกุล (Name)</label>
                <input
                  type="text"
                  placeholder="กรอกชื่อ-นามสกุลใหม่"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="admin-user-detail-modal-footer">
                <button
                  type="button"
                  className="admin-user-detail-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="admin-user-detail-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Alert Modal Popup */}
      {alertModal.isOpen && (
        <div className="admin-user-detail-alert-overlay" onClick={closeAlert}>
          <div
            className="admin-user-detail-alert-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`admin-user-detail-alert-icon ${alertModal.type}`}>
              {alertModal.type === "success" && <FaCheckCircle />}
              {alertModal.type === "error" && <FaTimesCircle />}
              {alertModal.type === "warning" && <FaExclamationTriangle />}
              {alertModal.type === "info" && <FaInfoCircle />}
            </div>
            <h3 className="admin-user-detail-alert-title">
              {alertModal.title}
            </h3>
            <p className="admin-user-detail-alert-desc">{alertModal.desc}</p>
            <button
              className={`admin-user-detail-alert-btn ${alertModal.type}`}
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

export default AdminUserDetail;
