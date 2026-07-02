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
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api/Api";

const AdminComponent = () => {
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง",
        confirmButtonColor: "#0f172a",
      });
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
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: isEditing
            ? "แก้ไขข้อมูลหัวข้อสำเร็จ"
            : "สร้างหัวข้อการประเมินใหม่สำเร็จ",
          confirmButtonColor: "#10b981",
        });
        setIsModalOpen(false);
        fetchComponents();
      }
    } catch (err) {
      console.error("Submit Component Error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบหัวข้อ "${id} - ${title}" ใช่หรือไม่? ข้อมูลการประเมินที่เชื่อมโยงอยู่จะได้รับผลกระทบ`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/admin/delete-component/${id}`);
          if (response.data && response.data.success) {
            Swal.fire({
              title: "ลบสำเร็จ!",
              text: "ลบหัวข้อการประเมินออกจากระบบเรียบร้อย",
              icon: "success",
              confirmButtonColor: "#10b981",
            });
            fetchComponents();
          }
        } catch (err) {
          console.error("Delete Component Error:", err);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: err.response?.data?.message || "ไม่สามารถลบข้อมูลได้",
            confirmButtonColor: "#0f172a",
          });
        }
      }
    });
  };

  const filteredComponents = components.filter(
    (c) =>
      (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.role || "").toLowerCase().includes(search.toLowerCase()),
  );

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

          <div className="ac-toolbar">
            <div className="ac-search-box">
              <FaSearch className="ac-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาด้วยรหัส, ชื่อหัวข้อ หรือประเภทผู้ใช้..."
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
                  {filteredComponents.map((comp) => (
                    <tr key={comp.id}>
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
                            onClick={() => handleDelete(comp.id, comp.title)}
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

      {/* Modal เพิ่ม/แก้ไข ข้อมูล */}
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
    </div>
  );
};

export default AdminComponent;
