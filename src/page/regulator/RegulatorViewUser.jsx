import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/RegulatorViewUser.css";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
  FaSpinner,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import SidebarRegulator from "./SidebarRegulator";
import api from "../../api/Api";

const RegulatorViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States สำหรับแก้ไขชื่อ-นามสกุล และอีเมล
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
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
      const response = await api.get(`/regulator/view-user/${id}`);

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

  const handleOpenEditModal = () => {
    setEditData({
      name: user.name || "",
      email: user.email || "",
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.name.trim() || !editData.email.trim()) {
      openAlert(
        "warning",
        "ข้อมูลไม่ครบถ้วน",
        "กรุณากรอกชื่อ-นามสกุล และ อีเมล",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.put(`/regulator/edit-user/${id}`, {
        name: editData.name,
        email: editData.email,
      });

      if (response.data && response.data.success) {
        setIsEditModalOpen(false);
        openAlert("success", "สำเร็จ", "อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว");
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
    <div className="regulator-view-user-layout">
      <SidebarRegulator />

      <div className="regulator-view-user-main-content">
        <div className="regulator-view-user-content-inner">
          <div className="regulator-view-user-top-section">
            <button
              className="regulator-view-user-back-btn"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft /> ย้อนกลับ
            </button>
            <div className="regulator-view-user-header-text">
              <h1>รายละเอียดบัญชีผู้ใช้</h1>
              <p>ข้อมูลโปรไฟล์ และสิทธิ์การใช้งานภายในหน่วยงาน</p>
            </div>
          </div>

          {loading ? (
            <div className="regulator-view-user-state-container">
              <FaSpinner className="regulator-view-user-spin" />
              <p>กำลังโหลดข้อมูลผู้ใช้...</p>
            </div>
          ) : error ? (
            <div className="regulator-view-user-state-container regulator-view-user-error">
              <p>{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="regulator-view-user-btn-retry"
              >
                ย้อนกลับ
              </button>
            </div>
          ) : (
            user && (
              <div className="regulator-view-user-profile-card">
                <div className="regulator-view-user-profile-header">
                  <div className="regulator-view-user-avatar-large">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <div className="regulator-view-user-profile-title-area">
                    <h2 className="regulator-view-user-profile-name">
                      {user.name || "ไม่มีชื่อ"}
                      <button
                        className="regulator-view-user-edit-btn"
                        onClick={handleOpenEditModal}
                        title="แก้ไขชื่อและอีเมล"
                      >
                        <FaEdit />
                      </button>
                    </h2>
                    <div className="regulator-view-user-role-wrap">
                      <span className="regulator-view-user-role-badge">
                        ประเภทบัญชี: {user.user_type || "ไม่ระบุ"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="regulator-view-user-info-grid">
                  <div className="regulator-view-user-info-item">
                    <div className="regulator-view-user-info-icon">
                      <FaUser />
                    </div>
                    <div className="regulator-view-user-info-text">
                      <label>รหัสผู้ใช้ (Username)</label>
                      <p>{user.username}</p>
                    </div>
                  </div>

                  <div className="regulator-view-user-info-item">
                    <div className="regulator-view-user-info-icon">
                      <FaEnvelope />
                    </div>
                    <div className="regulator-view-user-info-text">
                      <label>อีเมลติดต่อ (Email)</label>
                      <p>{user.email || "-"}</p>
                    </div>
                  </div>

                  <div className="regulator-view-user-info-item">
                    <div className="regulator-view-user-info-icon">
                      <FaIdCard />
                    </div>
                    <div className="regulator-view-user-info-text">
                      <label>เลขประจำตัวประชาชน</label>
                      <p>{user.id_card || "-"}</p>
                    </div>
                  </div>

                  <div className="regulator-view-user-info-item">
                    <div className="regulator-view-user-info-icon">
                      <FaBuilding />
                    </div>
                    <div className="regulator-view-user-info-text">
                      <label>หน่วยงาน</label>
                      <p>{user.org_name || "ไม่ระบุ"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal แก้ไขข้อมูล (ชื่อและอีเมล) */}
      {isEditModalOpen && (
        <div className="regulator-view-user-modal-overlay">
          <div className="regulator-view-user-modal-content">
            <div className="regulator-view-user-modal-header">
              <h2>แก้ไขข้อมูลบุคลากร</h2>
              <button
                className="regulator-view-user-modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={handleEditSubmit}
              className="regulator-view-user-modal-body"
            >
              <div className="regulator-view-user-form-group">
                <label>ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  name="name"
                  placeholder="กรอกชื่อ-นามสกุล"
                  value={editData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="regulator-view-user-form-group">
                <label>อีเมลติดต่อ (Email)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="กรอกอีเมล"
                  value={editData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="regulator-view-user-modal-footer">
                <button
                  type="button"
                  className="regulator-view-user-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="regulator-view-user-btn-submit"
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
        <div className="regulator-view-user-alert-overlay" onClick={closeAlert}>
          <div
            className="regulator-view-user-alert-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`regulator-view-user-alert-icon ${alertModal.type}`}
            >
              {alertModal.type === "success" && <FaCheckCircle />}
              {alertModal.type === "error" && <FaTimesCircle />}
              {alertModal.type === "warning" && <FaExclamationTriangle />}
              {alertModal.type === "info" && <FaInfoCircle />}
            </div>
            <h3 className="regulator-view-user-alert-title">
              {alertModal.title}
            </h3>
            <p className="regulator-view-user-alert-desc">{alertModal.desc}</p>
            <button
              className={`regulator-view-user-alert-btn ${alertModal.type}`}
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

export default RegulatorViewUser;
