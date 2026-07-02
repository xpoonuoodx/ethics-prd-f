import React, { useState, useEffect } from "react";
import "./style/AdminGuideline.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaLightbulb,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api/Api";

const AdminGuideline = () => {
  const [guidelines, setGuidelines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    user_type: "",
    level_id: "",
    analysis: "",
    strengths: "",
    gaps: "",
    risks: "",
    recommendations: "",
    roadmap: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllGuidelines();
  }, []);

  const fetchAllGuidelines = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/get-all-guidelines");
      if (response.data && response.data.success) {
        setGuidelines(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Guidelines Error:", err);
      setGuidelines([]);
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
    setFormData({
      id: "",
      user_type: "",
      level_id: "",
      analysis: "",
      strengths: "",
      gaps: "",
      risks: "",
      recommendations: "",
      roadmap: "",
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      user_type: item.user_type,
      level_id: item.level_id.toString(),
      analysis: item.analysis || "",
      strengths: item.strengths || "",
      gaps: item.gaps || "",
      risks: item.risks || "",
      recommendations: item.recommendations || "",
      roadmap: item.roadmap || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_type || formData.level_id === "") {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาระบุประเภทผู้ใช้งานและระดับความพร้อม",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // ใช้ API เดิมที่เป็น Upsert ได้เลย
      const response = await api.post("/admin/save-guideline", {
        user_type: formData.user_type,
        level_id: parseInt(formData.level_id),
        analysis: formData.analysis,
        strengths: formData.strengths,
        gaps: formData.gaps,
        risks: formData.risks,
        recommendations: formData.recommendations,
        roadmap: formData.roadmap,
      });

      if (response.data && response.data.success) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: isEditing
            ? "อัปเดตข้อมูลเรียบร้อยแล้ว"
            : "เพิ่มแนวทางการพัฒนาใหม่สำเร็จ",
          confirmButtonColor: "#10b981",
        });
        setIsModalOpen(false);
        fetchAllGuidelines();
      }
    } catch (err) {
      console.error("Save Guideline Error:", err);
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

  const handleDelete = (id, type, level) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบข้อมูลของ ${type} (Level ${level}) ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/admin/delete-guideline/${id}`);
          if (response.data && response.data.success) {
            Swal.fire("ลบสำเร็จ!", "ข้อมูลถูกนำออกจากระบบแล้ว", "success");
            fetchAllGuidelines();
          }
        } catch (err) {
          console.error("Delete Error:", err);
          Swal.fire("ผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        }
      }
    });
  };

  // กรองข้อมูลตาม Search
  const filteredGuidelines = guidelines.filter(
    (g) =>
      (g.user_type || "").toLowerCase().includes(search.toLowerCase()) ||
      (g.analysis || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="ag-layout">
      <SidebarAdmin />

      <div className="ag-main-content">
        <div className="ag-container">
          <div className="ag-header">
            <div className="ag-header-title-wrap">
              <div className="ag-header-icon">
                <FaLightbulb />
              </div>
              <div>
                <h1 className="ag-title">แนวทางการพัฒนา (Guidelines)</h1>
                <p className="ag-subtitle">
                  จัดการผลวิเคราะห์และข้อเสนอแนะ
                  แยกตามบทบาทผู้ใช้และระดับความพร้อม
                </p>
              </div>
            </div>
            <button className="ag-btn-primary" onClick={handleAddClick}>
              <FaPlus /> เพิ่มข้อมูลใหม่
            </button>
          </div>

          <div className="ag-toolbar">
            <div className="ag-search-box">
              <FaSearch className="ag-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาบทบาท หรือข้อความวิเคราะห์..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ag-table-wrapper">
            {loading ? (
              <div className="ag-state-container">
                <FaSpinner className="ag-spin" />
                <p>กำลังโหลดข้อมูลแนวทางการพัฒนา...</p>
              </div>
            ) : (
              <table className="ag-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>ประเภทผู้ใช้ (User Type)</th>
                    <th className="ag-text-center" style={{ width: "15%" }}>
                      Maturity Level
                    </th>
                    <th style={{ width: "50%" }}>ผลการวิเคราะห์ (Analysis)</th>
                    <th className="ag-text-center" style={{ width: "15%" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuidelines.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="ag-role-badge">{item.user_type}</span>
                      </td>
                      <td className="ag-text-center">
                        <span className="ag-level-badge">
                          Level {item.level_id}
                        </span>
                      </td>
                      <td>
                        <p className="ag-text-desc">{item.analysis || "-"}</p>
                      </td>
                      <td>
                        <div className="ag-actions">
                          <button
                            className="ag-btn-action edit"
                            title="แก้ไขข้อมูล"
                            onClick={() => handleEditClick(item)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="ag-btn-action delete"
                            title="ลบข้อมูล"
                            onClick={() =>
                              handleDelete(
                                item.id,
                                item.user_type,
                                item.level_id,
                              )
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredGuidelines.length === 0 && (
                    <tr>
                      <td colSpan="4" className="ag-empty-state">
                        ยังไม่มีข้อมูลแนวทางการพัฒนาในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal เพิ่ม/แก้ไข แบบเลื่อนได้ (Scrollable) */}
      {isModalOpen && (
        <div className="ag-modal-overlay">
          <div className="ag-modal-container">
            <div className="ag-modal-header">
              <h2>
                {isEditing ? "แก้ไขแนวทางการพัฒนา" : "เพิ่มแนวทางการพัฒนาใหม่"}
              </h2>
              <button
                className="ag-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="ag-modal-body">
              <div className="ag-form-row">
                <div className="ag-form-group">
                  <label>ประเภทผู้ใช้งานเป้าหมาย</label>
                  <select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleInputChange}
                    required
                    disabled={isEditing} // ล็อกไว้ตอนแก้ไขกันเซฟแล้ว Key เพี้ยน
                  >
                    <option value="" disabled>
                      -- เลือกบทบาท --
                    </option>
                    <option value="regulator">Regulator (ผู้กำกับดูแล)</option>
                    <option value="policy">Policy (ผู้วางนโยบาย)</option>
                    <option value="researcher">Researcher (นักวิจัย)</option>
                    <option value="developer">Developer (นักพัฒนา)</option>
                    <option value="users">Users (ผู้ใช้งานทั่วไป)</option>
                  </select>
                </div>

                <div className="ag-form-group">
                  <label>ระดับความพร้อม</label>
                  <select
                    name="level_id"
                    value={formData.level_id}
                    onChange={handleInputChange}
                    required
                    disabled={isEditing}
                  >
                    <option value="" disabled>
                      -- เลือกระดับ --
                    </option>
                    <option value="0">Level 0: ขาดความพร้อม</option>
                    <option value="1">Level 1: Initial</option>
                    <option value="2">Level 2: Developing</option>
                    <option value="3">Level 3: Defined</option>
                    <option value="4">Level 4: Quantitatively Managed</option>
                    <option value="5">Level 5: Optimizing</option>
                  </select>
                </div>
              </div>
              {isEditing && (
                <small
                  className="ag-form-hint"
                  style={{ marginBottom: "15px", display: "block" }}
                >
                  * ไม่สามารถเปลี่ยนบทบาทหรือระดับได้ในโหมดแก้ไข
                </small>
              )}

              <div className="ag-form-group">
                <label>ผลการวิเคราะห์ (Analysis)</label>
                <textarea
                  name="analysis"
                  value={formData.analysis}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="สรุปผลการวิเคราะห์..."
                ></textarea>
              </div>

              <div className="ag-form-row">
                <div className="ag-form-group">
                  <label>จุดแข็ง (Strengths)</label>
                  <textarea
                    name="strengths"
                    value={formData.strengths}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                <div className="ag-form-group">
                  <label>ช่องว่าง (Gaps)</label>
                  <textarea
                    name="gaps"
                    value={formData.gaps}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="ag-form-group">
                <label>ความเสี่ยง (Risks)</label>
                <textarea
                  name="risks"
                  value={formData.risks}
                  onChange={handleInputChange}
                  rows="2"
                ></textarea>
              </div>

              <div className="ag-form-group">
                <label>ข้อเสนอแนะ (Recommendations)</label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleInputChange}
                  rows="2"
                ></textarea>
              </div>

              <div className="ag-form-group">
                <label>แผนพัฒนา (Roadmap)</label>
                <textarea
                  name="roadmap"
                  value={formData.roadmap}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="0-6 เดือน: ... &#10;6-12 เดือน: ..."
                ></textarea>
              </div>

              <div className="ag-modal-footer">
                <button
                  type="button"
                  className="ag-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="ag-btn-submit"
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

export default AdminGuideline;
