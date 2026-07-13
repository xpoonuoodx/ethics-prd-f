import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import "./style/AdminManageUser.css";
import {
  FaSearch,
  FaPlus,
  FaSpinner,
  FaEye, // เปลี่ยนไอคอนเป็นรูปตา
  FaTrash,
  FaTimes,
  FaUserShield,
  FaUser,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import api from "../../api/Api";

const AdminManageUser = () => {
  const navigate = useNavigate(); // เรียกใช้ navigate
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // Custom Alert Modal State (แทนที่ Swal)
  // ==========================================
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    desc: "",
    showCancel: false,
    onConfirm: null,
  });

  const openAlert = (
    type,
    title,
    desc,
    showCancel = false,
    onConfirm = null,
  ) => {
    setAlertModal({ isOpen: true, type, title, desc, showCancel, onConfirm });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  // State ของฟอร์ม
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    id_card: "",
    role: "regulator",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/get-users");

      if (response.data && response.data.success) {
        setUsers(response.data.data);
      } else {
        setError("ไม่สามารถโหลดข้อมูลผู้ใช้งานได้");
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setError(
        err.response?.data?.message ||
          "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.password ||
      !formData.name ||
      !formData.email ||
      !formData.id_card
    ) {
      openAlert(
        "warning",
        "ข้อมูลไม่ครบถ้วน",
        "กรุณากรอกข้อมูลสำคัญให้ครบทุกช่อง",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/admin/add-user", formData);

      if (response.data && response.data.success) {
        setIsModalOpen(false);
        setFormData({
          username: "",
          password: "",
          name: "",
          email: "",
          id_card: "",
          role: "regulator",
        });
        openAlert("success", "สำเร็จ", "เพิ่มผู้ใช้งานใหม่เรียบร้อยแล้ว");
        fetchUsers();
      }
    } catch (err) {
      console.error("Add User Error:", err);
      openAlert(
        "error",
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || "ไม่สามารถเพิ่มผู้ใช้งานได้",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, name) => {
    openAlert(
      "warning",
      "ยืนยันการลบบัญชี?",
      `คุณต้องการลบบัญชีผู้ใช้ "${name}" ใช่หรือไม่ ข้อมูลจะไม่สามารถกู้คืนได้`,
      true,
      async () => {
        closeAlert();
        try {
          const response = await api.delete(`/admin/delete-user/${id}`);
          if (response.data && response.data.success) {
            openAlert(
              "success",
              "ลบข้อมูลสำเร็จ",
              "บัญชีผู้ใช้ถูกนำออกจากระบบแล้ว",
            );
            fetchUsers();
          }
        } catch (err) {
          console.error("Delete User Error:", err);
          openAlert(
            "error",
            "เกิดข้อผิดพลาด",
            err.response?.data?.message || "ไม่สามารถลบข้อมูลได้",
          );
        }
      },
    );
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

  const filteredUsers = users.filter((u) => {
    const searchStr = searchTerm.toLowerCase();
    const matchName = u.name ? u.name.toLowerCase().includes(searchStr) : false;
    const matchUsername = u.username
      ? u.username.toLowerCase().includes(searchStr)
      : false;
    const matchOrg = u.org_name
      ? u.org_name.toLowerCase().includes(searchStr)
      : false;
    return matchName || matchUsername || matchOrg;
  });

  return (
    <div className="admin-manage-user-layout">
      <SidebarAdmin />

      <div className="admin-manage-user-main-content">
        <div className="admin-manage-user-content-inner">
          <div className="admin-manage-user-top-section">
            <div className="admin-manage-user-header-text">
              <h1>จัดการผู้ใช้งานระบบ</h1>
              <p>ควบคุมบัญชีผู้ใช้ กำหนดสิทธิ์ และระบุหน่วยงานสังกัด</p>
            </div>

            <div className="admin-manage-user-action-bar">
              <div className="admin-manage-user-search-pill">
                <FaSearch className="admin-manage-user-search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, ชื่อผู้ใช้, หน่วยงาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                className="admin-manage-user-btn-dark"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus /> เพิ่มผู้ใช้งาน
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-manage-user-state-container">
              <FaSpinner className="admin-manage-user-spin" />
              <p>กำลังโหลดข้อมูลผู้ใช้งาน...</p>
            </div>
          ) : error ? (
            <div className="admin-manage-user-state-container admin-manage-user-error">
              <p>{error}</p>
              <button
                onClick={fetchUsers}
                className="admin-manage-user-btn-retry"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            <div className="admin-manage-user-list-section">
              <div className="admin-manage-user-list-header">
                <h2>รายชื่อบัญชีผู้ใช้งานทั้งหมด</h2>
                <span className="admin-manage-user-list-count">
                  {filteredUsers.length} บัญชี
                </span>
              </div>

              <div className="admin-manage-user-table-responsive">
                <table className="admin-manage-user-card-table">
                  <thead>
                    <tr>
                      <th>ชื่อ-นามสกุล</th>
                      <th>ชื่อผู้ใช้ (Username)</th>
                      <th>สิทธิ์การใช้งาน (Role)</th>
                      <th>หน่วยงานที่สังกัด</th>
                      <th className="admin-manage-user-text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, index) => {
                      const roleData = getRoleBadge(u.role);
                      return (
                        <tr key={index} className="admin-manage-user-table-row">
                          <td>
                            <div className="admin-manage-user-profile">
                              <div className="admin-manage-user-avatar">
                                {u.name ? u.name.charAt(0) : "U"}
                              </div>
                              <div className="admin-manage-user-text">
                                <span className="admin-manage-user-name">
                                  {u.name || "ไม่มีชื่อ"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="admin-manage-user-col-username">
                            {u.username}
                          </td>
                          <td>
                            <span
                              className={`admin-manage-user-role-badge ${roleData.className}`}
                            >
                              {roleData.icon} {roleData.label}
                            </span>
                          </td>
                          <td className="admin-manage-user-col-org">
                            {u.org_name || (
                              <span className="admin-manage-user-empty-text">
                                ไม่มีสังกัด
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="admin-manage-user-action-buttons">
                              {/* เปลี่ยนเป็นปุ่มไปหน้า Detail */}
                              <button
                                className="admin-manage-user-btn-action-icon admin-manage-user-edit"
                                title="ดูรายละเอียด"
                                onClick={() =>
                                  navigate(`/admin-user-detail/${u.id}`)
                                }
                              >
                                <FaEye />
                              </button>
                              <button
                                className="admin-manage-user-btn-action-icon admin-manage-user-delete"
                                title="ลบบัญชี"
                                onClick={() => handleDelete(u.id, u.name)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="admin-manage-user-empty-state"
                        >
                          ไม่พบข้อมูลผู้ใช้งานในระบบ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal สำหรับการเพิ่มผู้ใช้งาน */}
      {isModalOpen && (
        <div className="admin-manage-user-modal-overlay">
          <div className="admin-manage-user-modal-container">
            <div className="admin-manage-user-modal-header">
              <h2>สร้างบัญชีผู้ใช้ใหม่</h2>
              <button
                className="admin-manage-user-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleAddSubmit}
              className="admin-manage-user-modal-body"
            >
              <div className="admin-manage-user-form-group">
                <label>ชื่อ-นามสกุล (ผู้ใช้งาน)</label>
                <input
                  type="text"
                  name="name"
                  placeholder="กรอกชื่อ-นามสกุลจริง"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-manage-user-form-row">
                <div className="admin-manage-user-form-group admin-manage-user-half-width">
                  <label>อีเมล (Email)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="กรอกอีเมลติดต่อ"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="admin-manage-user-form-group admin-manage-user-half-width">
                  <label>รหัสประจำตัวประชาชน</label>
                  <input
                    type="text"
                    name="id_card"
                    placeholder="เลขบัตรประชาชน 13 หลัก"
                    value={formData.id_card}
                    onChange={handleInputChange}
                    maxLength="13"
                    required
                  />
                </div>
              </div>

              <div className="admin-manage-user-form-row">
                <div className="admin-manage-user-form-group admin-manage-user-half-width">
                  <label>ชื่อผู้ใช้งาน (Username)</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="สำหรับเข้าสู่ระบบ"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="admin-manage-user-form-group admin-manage-user-half-width">
                  <label>รหัสผ่าน (Password)</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="ตั้งรหัสผ่าน"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="admin-manage-user-form-group">
                <label>สิทธิ์การใช้งาน (Role)</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="regulator">
                    ผู้กำกับดูแลหน่วยงาน (Organizer)
                  </option>
                  <option value="admin">ผู้ดูแลระบบสูงสุด (Admin)</option>
                </select>
              </div>

              <div className="admin-manage-user-modal-footer">
                <button
                  type="button"
                  className="admin-manage-user-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="admin-manage-user-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังสร้างบัญชี..." : "สร้างบัญชีผู้ใช้"}
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
        <div className="admin-manage-user-alert-overlay" onClick={closeAlert}>
          <div
            className="admin-manage-user-alert-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-manage-user-alert-close"
              onClick={closeAlert}
            >
              <FaTimes />
            </button>

            <div
              className={`admin-manage-user-alert-icon-wrapper ${alertModal.type}`}
            >
              {alertModal.type === "success" && <FaCheckCircle />}
              {alertModal.type === "error" && <FaTimesCircle />}
              {alertModal.type === "warning" && <FaExclamationTriangle />}
              {alertModal.type === "info" && <FaInfoCircle />}
            </div>

            <h3 className="admin-manage-user-alert-title">
              {alertModal.title}
            </h3>
            <p className="admin-manage-user-alert-desc">{alertModal.desc}</p>

            <div className="admin-manage-user-alert-actions">
              {alertModal.showCancel && (
                <button
                  className="admin-manage-user-alert-btn cancel"
                  onClick={closeAlert}
                >
                  ยกเลิก
                </button>
              )}
              <button
                className={`admin-manage-user-alert-btn ${alertModal.type}`}
                onClick={() => {
                  if (alertModal.onConfirm) {
                    alertModal.onConfirm();
                  } else {
                    closeAlert();
                  }
                }}
              >
                {alertModal.showCancel ? "ยืนยันการลบ" : "ตกลง"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUser;
