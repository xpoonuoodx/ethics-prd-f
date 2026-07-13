import React, { useState, useEffect } from "react";
import "./style/AdminComponent.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCube,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import api from "../../api/Api";

const AdminComponent = () => {
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal States สำหรับ เพิ่ม/แก้ไข
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // Custom Alert Modal State (แทนที่ Swal)
  // ==========================================
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info", // "success", "error", "warning", "info"
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

  const [formData, setFormData] = useState({
    id: "",
    role: "",
    title: "",
    max_maturity_level: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/get-components");
      if (response.data && response.data.success) {
        setComponents(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Components Error:", err);
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({ id: "", role: "", title: "", max_maturity_level: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (comp) => {
    setIsEditing(true);
    setFormData({
      id: comp.id,
      role: comp.role,
      title: comp.title,
      max_maturity_level: comp.max_maturity_level.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id ||
      !formData.role ||
      !formData.title ||
      formData.max_maturity_level === ""
    ) {
      openAlert(
        "warning",
        "ข้อมูลไม่ครบถ้วน",
        "กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      let response;

      if (isEditing) {
        response = await api.put(
          `/admin/update-component/${formData.id}`,
          formData,
        );
      } else {
        response = await api.post("/admin/add-component", formData);
      }

      if (response.data && response.data.success) {
        setIsModalOpen(false);
        openAlert(
          "success",
          "สำเร็จ",
          isEditing
            ? "แก้ไขข้อมูลหัวข้อสำเร็จ"
            : "สร้างหัวข้อการประเมินใหม่สำเร็จ",
        );
        fetchComponents();
      }
    } catch (err) {
      console.error("Submit Component Error:", err);
      openAlert(
        "error",
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (comp) => {
    openAlert(
      "warning",
      "ยืนยันการลบ?",
      `คุณต้องการลบหัวข้อ "${comp.id} - ${comp.title}" ใช่หรือไม่? ข้อมูลที่เชื่อมโยงอยู่จะได้รับผลกระทบ`,
      true,
      async () => {
        closeAlert();
        try {
          const response = await api.delete(
            `/admin/delete-component/${comp.id}`,
          );
          if (response.data && response.data.success) {
            openAlert(
              "success",
              "ลบสำเร็จ!",
              "ลบหัวข้อการประเมินออกจากระบบเรียบร้อย",
            );
            fetchComponents();
          }
        } catch (err) {
          console.error("Delete Component Error:", err);
          openAlert(
            "error",
            "เกิดข้อผิดพลาด",
            err.response?.data?.message || "ไม่สามารถลบข้อมูลได้",
          );
        }
      },
    );
  };

  // กรองข้อมูลด้วยช่อง Search และ Dropdown Role
  const filteredComponents = components.filter((c) => {
    const matchSearch =
      (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.id || "").toLowerCase().includes(search.toLowerCase());

    const matchRole =
      filterRole === "all" ||
      (c.role || "").toLowerCase() === filterRole.toLowerCase();

    return matchSearch && matchRole;
  });

  return (
    <div className="ac-layout">
      <SidebarAdmin />

      <div className="ac-main-content">
        <div className="ac-container">
          <div className="ac-header">
            <div className="ac-header-title-wrap">
              <div className="ac-header-icon">
                <FaCube />
              </div>
              <div>
                <h1 className="ac-title">
                  จัดการหัวข้อการประเมิน (Components)
                </h1>
                <p className="ac-subtitle">
                  ตั้งค่าหมวดหมู่หัวข้อย่อย แยกตามประเภทบทบาทผู้ใช้งาน
                  และระดับความพร้อมสูงสุด
                </p>
              </div>
            </div>
            <button className="ac-btn-primary" onClick={handleAddClick}>
              <FaPlus /> เพิ่มหัวข้อใหม่
            </button>
          </div>

          {/* Toolbar: กรองข้อมูล และ ค้นหา */}
          <div className="ac-toolbar-wrap">
            <div className="ac-filter-box">
              <select
                className="ac-filter-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">ทุกประเภทผู้ใช้ (ทั้งหมด)</option>
                <option value="regulator">Regulator</option>
                <option value="policy">Policy</option>
                <option value="researcher">Researcher</option>
                <option value="developer">Developer</option>
                <option value="service provider">Service Provider</option>
                <option value="users">Users</option>
              </select>
            </div>

            <div className="ac-search-box">
              <FaSearch className="ac-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาด้วยรหัส หรือ ชื่อหัวข้อประเมิน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ac-table-wrapper">
            {loading ? (
              <div className="ac-state-container">
                <FaSpinner className="ac-spin" />
                <p>กำลังโหลดข้อมูลหัวข้อการประเมิน...</p>
              </div>
            ) : (
              <table className="ac-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "12%" }}>รหัสหัวข้อ</th>
                    <th style={{ width: "23%" }}>ประเภทผู้ใช้ (User Type)</th>
                    <th style={{ width: "45%" }}>
                      ชื่อหัวข้อประเมิน (Component Title)
                    </th>
                    <th className="ac-text-center" style={{ width: "10%" }}>
                      MAX Maturity
                    </th>
                    <th className="ac-text-center" style={{ width: "10%" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComponents.map((comp, index) => (
                    <tr key={`${comp.id}-${index}`}>
                      <td className="ac-font-bold ac-text-muted">{comp.id}</td>
                      <td>
                        <span className="ac-role-badge">{comp.role}</span>
                      </td>
                      <td className="ac-font-medium">{comp.title}</td>
                      <td className="ac-text-center">
                        <span className="ac-level-badge">
                          Lv. {comp.max_maturity_level}
                        </span>
                      </td>
                      <td>
                        <div className="ac-actions">
                          <button
                            className="ac-btn-action edit"
                            title="แก้ไขข้อมูล"
                            onClick={() => handleEditClick(comp)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="ac-btn-action delete"
                            title="ลบข้อมูล"
                            onClick={() => handleDelete(comp)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredComponents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="ac-empty-state">
                        ไม่พบข้อมูลหัวข้อการประเมินในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          Modal เพิ่ม/แก้ไข ข้อมูล 
          ========================================== */}
      {isModalOpen && (
        <div className="ac-modal-overlay">
          <div className="ac-modal-container">
            <div className="ac-modal-header">
              <h2>
                {isEditing
                  ? "แก้ไขข้อมูลหัวข้อการประเมิน"
                  : "สร้างหัวข้อการประเมินใหม่"}
              </h2>
              <button
                className="ac-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ac-modal-body">
              <div className="ac-form-group">
                <label>รหัสหัวข้อ (Component ID)</label>
                <input
                  type="text"
                  name="id"
                  placeholder="เช่น ERM01, PDOM01"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={isEditing}
                  required
                />
                {isEditing && (
                  <small className="ac-form-hint">
                    ไม่สามารถแก้ไขรหัสผ่านหน้านี้ได้
                  </small>
                )}
              </div>

              <div className="ac-form-group">
                <label>ประเภทผู้ใช้งาน (Target User Type)</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกประเภทบทบาท --
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

              <div className="ac-form-group">
                <label>ชื่อหัวข้อประเมิน (Title)</label>
                <textarea
                  name="title"
                  placeholder="ระบุชื่อแนวทางปฏิบัติหรือหัวข้อประเมิน..."
                  value={formData.title}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="ac-form-group">
                <label>ระดับความพร้อมสูงสุด (MAX Maturity Level)</label>
                <select
                  name="max_maturity_level"
                  value={formData.max_maturity_level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกระดับสูงสุด --
                  </option>
                  <option value="0">Level 0</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                  <option value="5">Level 5</option>
                </select>
              </div>

              <div className="ac-modal-footer">
                <button
                  type="button"
                  className="ac-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="ac-btn-submit"
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
          Custom Alert Modal Popup (แทน Swal)
          ========================================== */}
      {alertModal.isOpen && (
        <div className="ac-alert-overlay" onClick={closeAlert}>
          <div
            className="ac-alert-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ac-alert-close" onClick={closeAlert}>
              <FaTimes />
            </button>

            <div className={`ac-alert-icon-wrapper ${alertModal.type}`}>
              {alertModal.type === "success" && <FaCheckCircle />}
              {alertModal.type === "error" && <FaTimesCircle />}
              {alertModal.type === "warning" && <FaExclamationTriangle />}
              {alertModal.type === "info" && <FaInfoCircle />}
            </div>

            <h3 className="ac-alert-title">{alertModal.title}</h3>
            <p className="ac-alert-desc">{alertModal.desc}</p>

            <div className="ac-alert-actions">
              {alertModal.showCancel && (
                <button className="ac-alert-btn cancel" onClick={closeAlert}>
                  ยกเลิก
                </button>
              )}
              <button
                className={`ac-alert-btn ${alertModal.type}`}
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

export default AdminComponent;
