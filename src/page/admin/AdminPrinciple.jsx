import React, { useState, useEffect } from "react";
import "./style/AdminPrinciple.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaBook,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import api from "../../api/Api";

const AdminPrinciple = () => {
  const { fire } = useThemedAlert();
  const [principles, setPrinciples] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State สำหรับเพิ่ม/แก้ไข
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPrinciples();
  }, []);

  // ฟังก์ชันดึงข้อมูล (เตรียมไว้สำหรับเชื่อมต่อ API หลังบ้าน)
  const fetchPrinciples = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/get-principles");
      if (response.data && response.data.success) {
        setPrinciples(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Principles Error:", err);
      // หากหลังบ้านยังไม่เสร็จ จะเซ็ตค่าว่างไว้ก่อนไม่ให้หน้าเว็บค้าง
      setPrinciples([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // เปิดป๊อปอัปสำหรับ "เพิ่มข้อมูลใหม่"
  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({ id: "", name: "", description: "" });
    setIsModalOpen(true);
  };

  // เปิดป๊อปอัปสำหรับ "แก้ไขข้อมูล"
  const handleEditClick = (principle) => {
    setIsEditing(true);
    setFormData({
      id: principle.id,
      name: principle.name,
      description: principle.description || "",
    });
    setIsModalOpen(true);
  };

  // บันทึกข้อมูล (รองรับทั้งเพิ่มใหม่และแก้ไข)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id || !formData.name) {
      fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกรหัสและชื่อหลักการให้ครบถ้วน",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      let response;
      if (isEditing) {
        // อัปเดตข้อมูลเดิม
        response = await api.put(
          `/admin/update-principle/${formData.id}`,
          formData,
        );
      } else {
        // เพิ่มข้อมูลใหม่
        response = await api.post("/admin/add-principle", formData);
      }

      if (response.data && response.data.success) {
        fire({
          icon: "success",
          title: "สำเร็จ",
          text: isEditing
            ? "อัปเดตข้อมูลเรียบร้อยแล้ว"
            : "เพิ่มข้อมูลเรียบร้อยแล้ว",
          confirmButtonColor: "#10b981",
        });
        setIsModalOpen(false);
        fetchPrinciples(); // โหลดตารางใหม่
      }
    } catch (err) {
      console.error("Submit Principle Error:", err);
      fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ลบข้อมูล
  const handleDelete = (id, name) => {
    fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบหลักการ "${name}" ใช่หรือไม่? หากลบไปแล้วข้อมูลที่เชื่อมโยงอยู่จะได้รับผลกระทบ`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/admin/delete-principle/${id}`);
          if (response.data && response.data.success) {
            fire({
              title: "ลบสำเร็จ!",
              text: "ข้อมูลถูกนำออกจากระบบแล้ว",
              icon: "success",
              confirmButtonColor: "#10b981",
            });
            fetchPrinciples(); // โหลดตารางใหม่
          }
        } catch (err) {
          console.error("Delete Principle Error:", err);
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

  // กรองข้อมูลตามการค้นหา
  const filteredPrinciples = principles.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.id || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="ap-layout">
      <SidebarAdmin />

      <div className="ap-main-content">
        <div className="ap-container">
          <div className="ap-header">
            <div className="ap-header-title-wrap">
              <div className="ap-header-icon">
                <FaBook />
              </div>
              <div>
                <h1 className="ap-title">จัดการหลักการ (Principles)</h1>
                <p className="ap-subtitle">
                  กำหนดหลักการและกรอบจริยธรรม AI เพื่อใช้เป็นเกณฑ์ในการประเมิน
                </p>
              </div>
            </div>
            <button className="ap-btn-primary" onClick={handleAddClick}>
              <FaPlus /> เพิ่มหลักการใหม่
            </button>
          </div>

          <div className="ap-toolbar">
            <div className="ap-search-box">
              <FaSearch className="ap-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาด้วยรหัส หรือชื่อหลักการ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ap-table-wrapper">
            {loading ? (
              <div className="ap-state-container">
                <FaSpinner className="ap-spin" />
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <table className="ap-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>รหัส (ID)</th>
                    <th style={{ width: "30%" }}>ชื่อหลักการ</th>
                    <th style={{ width: "45%" }}>รายละเอียด</th>
                    <th className="ap-text-center" style={{ width: "10%" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrinciples.map((principle) => (
                    <tr key={principle.id}>
                      <td className="ap-font-medium ap-text-muted">
                        {principle.id}
                      </td>
                      <td className="ap-font-bold">{principle.name}</td>
                      <td>
                        <span className="ap-text-desc">
                          {principle.description || "-"}
                        </span>
                      </td>
                      <td>
                        <div className="ap-actions">
                          <button
                            className="ap-btn-action edit"
                            title="แก้ไขข้อมูล"
                            onClick={() => handleEditClick(principle)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="ap-btn-action delete"
                            title="ลบข้อมูล"
                            onClick={() =>
                              handleDelete(principle.id, principle.name)
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredPrinciples.length === 0 && (
                    <tr>
                      <td colSpan="4" className="ap-empty-state">
                        ไม่พบข้อมูลหลักการในระบบ
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
        <div className="ap-modal-overlay">
          <div className="ap-modal-container">
            <div className="ap-modal-header">
              <h2>{isEditing ? "แก้ไขข้อมูลหลักการ" : "เพิ่มหลักการใหม่"}</h2>
              <button
                className="ap-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ap-modal-body">
              <div className="ap-form-group">
                <label>รหัสหลักการ (ID)</label>
                <input
                  type="text"
                  name="id"
                  placeholder="เช่น P01, P02"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={isEditing} // ล็อกไว้ไม่ให้แก้ ID ถ้าระบบเป็นการอัปเดต
                  required
                />
                {isEditing && (
                  <small className="ap-form-hint">ไม่สามารถแก้ไขรหัสได้</small>
                )}
              </div>

              <div className="ap-form-group">
                <label>ชื่อหลักการ (Principle Name)</label>
                <input
                  type="text"
                  name="name"
                  placeholder="เช่น Transparency, Fairness"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="ap-form-group">
                <label>คำอธิบาย (Description)</label>
                <textarea
                  name="description"
                  placeholder="อธิบายความหมายหรือขอบเขตของหลักการนี้"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>

              <div className="ap-modal-footer">
                <button
                  type="button"
                  className="ap-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="ap-btn-submit"
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

export default AdminPrinciple;
