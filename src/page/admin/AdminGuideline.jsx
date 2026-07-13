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
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import api from "../../api/Api";

const AdminGuideline = () => {
  const [guidelines, setGuidelines] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // เพิ่ม State สำหรับ Dropdown Filter
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      openAlert(
        "warning",
        "ข้อมูลไม่ครบถ้วน",
        "กรุณาระบุประเภทผู้ใช้งานและระดับความพร้อม",
      );
      return;
    }

    try {
      setIsSubmitting(true);
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
        openAlert(
          "success",
          "สำเร็จ",
          isEditing
            ? "อัปเดตข้อมูลเรียบร้อยแล้ว"
            : "เพิ่มแนวทางการพัฒนาใหม่สำเร็จ",
        );
        setIsModalOpen(false);
        fetchAllGuidelines();
      }
    } catch (err) {
      console.error("Save Guideline Error:", err);
      openAlert(
        "error",
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, type, level) => {
    openAlert(
      "warning",
      "ยืนยันการลบ?",
      `คุณต้องการลบข้อมูลของ ${type} (Level ${level}) ใช่หรือไม่?`,
      true,
      async () => {
        closeAlert();
        try {
          const response = await api.delete(`/admin/delete-guideline/${id}`);
          if (response.data && response.data.success) {
            openAlert("success", "ลบสำเร็จ!", "ข้อมูลถูกนำออกจากระบบแล้ว");
            fetchAllGuidelines();
          }
        } catch (err) {
          console.error("Delete Error:", err);
          openAlert("error", "ผิดพลาด", "ไม่สามารถลบข้อมูลได้");
        }
      },
    );
  };

  // กรองข้อมูลด้วยช่อง Search และ Dropdown Type
  const filteredGuidelines = guidelines.filter((g) => {
    const matchSearch =
      (g.user_type || "").toLowerCase().includes(search.toLowerCase()) ||
      (g.analysis || "").toLowerCase().includes(search.toLowerCase());

    const matchType =
      filterType === "all" ||
      (g.user_type || "").toLowerCase() === filterType.toLowerCase();

    return matchSearch && matchType;
  });

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

          {/* ส่วนของ Toolbar ที่เพิ่ม Dropdown เข้ามา */}
          <div className="ag-toolbar-wrap">
            <div className="ag-filter-box">
              <select
                className="ag-filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
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

            <div className="ag-search-box">
              <FaSearch className="ag-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาข้อความวิเคราะห์..."
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
                        ไม่พบข้อมูลแนวทางการพัฒนาในระบบ
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
                    <option value="provider">
                      Service Provider (ผู้ให้บริการ)
                    </option>
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

      {/* ==========================================
          Custom Alert Modal Popup 
          ========================================== */}
      {alertModal.isOpen && (
        <div className="ag-alert-overlay" onClick={closeAlert}>
          <div
            className="ag-alert-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ag-alert-close" onClick={closeAlert}>
              <FaTimes />
            </button>

            <div className={`ag-alert-icon-wrapper ${alertModal.type}`}>
              {alertModal.type === "success" && <FaCheckCircle />}
              {alertModal.type === "error" && <FaTimesCircle />}
              {alertModal.type === "warning" && <FaExclamationTriangle />}
              {alertModal.type === "info" && <FaInfoCircle />}
            </div>

            <h3 className="ag-alert-title">{alertModal.title}</h3>
            <p className="ag-alert-desc">{alertModal.desc}</p>

            <div className="ag-alert-actions">
              {alertModal.showCancel && (
                <button className="ag-alert-btn cancel" onClick={closeAlert}>
                  ยกเลิก
                </button>
              )}
              <button
                className={`ag-alert-btn ${alertModal.type}`}
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

export default AdminGuideline;
