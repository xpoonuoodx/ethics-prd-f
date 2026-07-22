import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import "./style/RegulatorUserManage.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaUser,
  FaUsers,
  FaTimes,
  FaSpinner,
  FaEye, // เพิ่มไอคอนตา
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import api from "../../api/Api";
import { sanitizeUsername, sanitizePassword } from "../../utils/validators";

const RegulatorUserManage = () => {
  const { fire } = useThemedAlert();
  const navigate = useNavigate(); // เรียกใช้งาน navigate
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State เพิ่ม user_type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    id_card: "",
    user_type: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/regulator/get-users");
      if (response.data && response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
      fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลบุคลากรได้",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "id_card") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "username") {
      setFormData((prev) => ({ ...prev, [name]: sanitizeUsername(value) }));
    } else if (name === "password") {
      setFormData((prev) => ({ ...prev, [name]: sanitizePassword(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.id_card ||
      !formData.user_type
    ) {
      fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    if (formData.id_card.length !== 13) {
      fire({
        icon: "warning",
        title: "รูปแบบข้อมูลไม่ถูกต้อง",
        text: "เลขประจำตัวประชาชนต้องมี 13 หลัก",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/regulator/add-user", formData);
      if (response.data && response.data.success) {
        fire({
          icon: "success",
          title: "สำเร็จ",
          text: "เพิ่มบุคลากรใหม่เรียบร้อยแล้ว",
          confirmButtonColor: "#10b981",
        });
        setIsModalOpen(false);
        setFormData({
          name: "",
          email: "",
          username: "",
          password: "",
          id_card: "",
          user_type: "",
        });
        setShowPassword(false);
        fetchUsers();
      }
    } catch (err) {
      console.error("Add User Error:", err);
      fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถเพิ่มข้อมูลได้",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, name) => {
    fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบบัญชีของ "${name}" ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/regulator/delete-user/${id}`);
          if (response.data && response.data.success) {
            setUsers(users.filter((u) => u.id !== id));
            fire({
              title: "ลบสำเร็จ!",
              text: "ข้อมูลถูกนำออกจากระบบแล้ว",
              icon: "success",
              confirmButtonColor: "#10b981",
            });
          }
        } catch (err) {
          fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบข้อมูลได้",
            confirmButtonColor: "#0f172a",
          });
        }
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.id_card || "").includes(search),
  );

  // กลับไปหน้า 1 เสมอเมื่อค้นหาเปลี่ยน กันโชว์หน้าว่างเปล่าค้างอยู่
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );
  const rangeStart =
    filteredUsers.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredUsers.length,
  );

  return (
    <div className="rum-layout">
      <SidebarRegulator />

      <div className="rum-main-content">
        <div className="rum-container">
          <div className="rum-header">
            <div className="rum-header-title-wrap">
              <div className="rum-header-icon">
                <FaUsers />
              </div>
              <div>
                <h1 className="rum-title">จัดการบุคลากร</h1>
                <p className="rum-subtitle">
                  เพิ่มและบริหารจัดการสิทธิ์ผู้ใช้งานภายในหน่วยงานของคุณ
                </p>
              </div>
            </div>
            <button
              className="rum-btn-add"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus /> เพิ่มบุคลากร
            </button>
          </div>

          <div className="rum-toolbar">
            <div className="rum-search-box">
              <FaSearch className="rum-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาจากชื่อ, อีเมล หรือเลขประจำตัว..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="rum-list-count">
              {filteredUsers.length === 0
                ? "0 คน"
                : `แสดง ${rangeStart}-${rangeEnd} จาก ${filteredUsers.length} คน`}
            </span>
          </div>

          <div className="rum-table-wrapper">
            {loading ? (
              <div className="rum-state-container">
                <FaSpinner className="rum-spin" />
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <table className="rum-card-table">
                <thead>
                  <tr>
                    <th>ชื่อ - นามสกุล</th>
                    <th>อีเมล</th>
                    <th>Username</th>
                    <th>ประเภทผู้ใช้งาน (Type)</th>
                    <th className="rum-text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="rum-user-profile">
                          <div className="rum-avatar">
                            {user.name ? user.name.charAt(0) : "U"}
                          </div>
                          <span className="rum-user-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="rum-text-muted">{user.email || "-"}</td>
                      <td className="rum-text-muted">{user.username}</td>
                      <td>
                        <span className="rum-role-badge">
                          {user.user_type || "ไม่ระบุ"}
                        </span>
                      </td>
                      <td>
                        <div className="rum-actions">
                          {/* เพิ่มปุ่มดูรายละเอียด */}
                          <button
                            className="rum-btn-action view"
                            title="ดูรายละเอียด"
                            onClick={() =>
                              navigate(`/regulator-view-user/${user.id}`)
                            }
                          >
                            <FaEye />
                          </button>
                          <button
                            className="rum-btn-action delete"
                            title="ลบบัญชี"
                            onClick={() => handleDelete(user.id, user.name)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="rum-empty-state">
                        ไม่พบข้อมูลบุคลากรในหน่วยงาน
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {!loading && totalPages > 1 && (
              <div className="rum-pagination">
                <button
                  className="rum-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - safeCurrentPage) <= 1,
                  )
                  .reduce((acc, page, i, arr) => {
                    if (i > 0 && page - arr[i - 1] > 1) acc.push("...");
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((page, i) =>
                    page === "..." ? (
                      <span key={`ellipsis-${i}`} className="rum-page-ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`rum-page-btn ${
                          page === safeCurrentPage ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}

                <button
                  className="rum-page-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safeCurrentPage === totalPages}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal เพิ่มบุคลากร */}
      {isModalOpen && (
        <div className="rum-modal-overlay">
          <div
            className="rum-modal-container"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="rum-modal-header">
              <h2>เพิ่มบุคลากรใหม่</h2>
              <button
                className="rum-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="rum-modal-body">
              <div className="rum-form-group">
                <label>ชื่อ-นามสกุล (ภาษาไทย)</label>
                <input
                  type="text"
                  name="name"
                  placeholder="เช่น สมชาย ใจดี"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="rum-form-group">
                <label>เลขประจำตัวประชาชน 13 หลัก</label>
                <input
                  type="text"
                  name="id_card"
                  placeholder="เช่น 1234567890123"
                  value={formData.id_card}
                  onChange={handleInputChange}
                  maxLength="13"
                  required
                />
              </div>

              <div className="rum-form-group">
                <label>อีเมลติดต่อ</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="rum-form-group">
                <label>รหัสผู้ใช้ (Username)</label>
                <input
                  type="text"
                  name="username"
                  placeholder="ภาษาอังกฤษหรือตัวเลข"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <span className="rum-field-hint">
                  ภาษาอังกฤษ/ตัวเลข/. _ - เท่านั้น
                </span>
              </div>

              <div className="rum-form-group">
                <label>รหัสผ่าน (Password)</label>
                <div className="rum-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="ตั้งรหัสผ่านเริ่มต้น"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="rum-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <span className="rum-field-hint">ห้ามใช้ภาษาไทย</span>
              </div>

              <div className="rum-form-group">
                <label>ประเภทผู้ใช้งาน (User Type)</label>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกประเภท --
                  </option>
                  <option value="regulator">Regulator (ผู้กำกับดูแล)</option>
                  <option value="policy">Policy (ผู้วางนโยบาย)</option>
                  <option value="researcher">Researcher (นักวิจัย)</option>
                  <option value="developer">Developer (นักพัฒนา)</option>
                  <option value="service provider">
                    Service Provider (ผู้ให้บริการ)
                  </option>
                  <option value="users">Users (ผู้ใช้งานทั่วไป)</option>
                </select>
              </div>

              <div className="rum-modal-footer">
                <button
                  type="button"
                  className="rum-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rum-btn-submit"
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

export default RegulatorUserManage;
