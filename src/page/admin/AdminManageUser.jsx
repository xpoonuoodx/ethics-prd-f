import React, { useState, useEffect } from "react";
import "./style/AdminManageUser.css";
import {
  FaSearch,
  FaPlus,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUserShield,
  FaUser,
  FaUserTie,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import api from "../../api/Api";
import Swal from "sweetalert2";

const AdminManageUser = () => {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // เพิ่ม email และ id_card ใน State ของฟอร์ม
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    id_card: "",
    role: "user",
    org_id: "",
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

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/admin/get-organize");
      if (response.data && response.data.success) {
        setOrganizations(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Organizations Error:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
    fetchOrganizations();
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

    // ดักจับการกรอกข้อมูลพื้นฐานให้ครบ
    if (
      !formData.username ||
      !formData.password ||
      !formData.name ||
      !formData.email ||
      !formData.id_card
    ) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลสำคัญให้ครบทุกช่อง",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/admin/add-user", formData);

      if (response.data && response.data.success) {
        Swal.fire({
          title: "สำเร็จ",
          text: "เพิ่มผู้ใช้งานใหม่เรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
        setIsModalOpen(false);
        setFormData({
          username: "",
          password: "",
          name: "",
          email: "",
          id_card: "",
          role: "user",
          org_id: "",
        });
        fetchUsers();
      }
    } catch (err) {
      console.error("Add User Error:", err);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถเพิ่มผู้ใช้งานได้",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "ยืนยันการลบบัญชี?",
      text: `คุณต้องการลบบัญชีผู้ใช้ "${name}" ใช่หรือไม่ ข้อมูลจะไม่สามารถกู้คืนได้`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ยืนยันลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((user) => user.id !== id));
        Swal.fire({
          title: "ลบข้อมูลสำเร็จ",
          text: "บัญชีผู้ใช้ถูกนำออกจากระบบแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    });
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
                              <button
                                className="admin-manage-user-btn-action-icon admin-manage-user-edit"
                                title="แก้ไขข้อมูล"
                              >
                                <FaEdit />
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

              {/* เพิ่มข้อมูลอีเมลและรหัสประชาชน แบ่งครึ่งจอเพื่อความสวยงาม */}
              <div className="admin-manage-user-form-row">
                <div className="admin-manage-user-form-group half-width">
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
                <div className="admin-manage-user-form-group half-width">
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
                <div className="admin-manage-user-form-group half-width">
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
                <div className="admin-manage-user-form-group half-width">
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
                  <option value="user">ผู้ใช้งานทั่วไป (User)</option>
                  <option value="regulator">
                    ผู้กำกับดูแลหน่วยงาน (Regulator)
                  </option>
                  <option value="admin">ผู้ดูแลระบบสูงสุด (Admin)</option>
                </select>
              </div>

              {formData.role !== "admin" && (
                <div className="admin-manage-user-form-group">
                  <label>สังกัดหน่วยงาน</label>
                  <select
                    name="org_id"
                    value={formData.org_id}
                    onChange={handleInputChange}
                  >
                    <option value="">-- ไม่ระบุสังกัด --</option>
                    {organizations.map((org, idx) => (
                      <option key={idx} value={org.id}>
                        {org.name} ({org.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
    </div>
  );
};

export default AdminManageUser;
