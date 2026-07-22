import React, { useState, useEffect } from "react";
import "./style/AdminImpact.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaEdit,
  FaExclamationTriangle,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import api from "../../api/Api";

const AdminImpact = () => {
  const { fire } = useThemedAlert();
  const [levels, setLevels] = useState([]);
  const [maturityLevels, setMaturityLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    level_id: "",
    level_name: "",
    description: "",
    base_maturity_level: "",
    is_active: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchImpactLevels();
    fetchMaturityLevels();
  }, []);

  const fetchImpactLevels = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/get-impact-levels");
      if (response.data && response.data.success) {
        setLevels(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Impact Levels Error:", err);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaturityLevels = async () => {
    try {
      const response = await api.get("/admin/get-maturity-levels");
      if (response.data && response.data.success) {
        setMaturityLevels(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Maturity Levels Error:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleEditClick = (lvl) => {
    setFormData({
      level_id: lvl.level_id,
      level_name: lvl.level_name,
      description: lvl.description || "",
      base_maturity_level: lvl.base_maturity_level,
      is_active: lvl.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.level_name || formData.base_maturity_level === "") return;

    try {
      setIsSubmitting(true);
      const response = await api.put(
        `/admin/update-impact-level/${formData.level_id}`,
        formData,
      );

      if (response.data && response.data.success) {
        fire({
          icon: "success",
          title: "สำเร็จ",
          text: "อัปเดตเกณฑ์ระดับผลกระทบเรียบร้อยแล้ว",
          confirmButtonColor: "#10b981",
        });
        setIsModalOpen(false);
        fetchImpactLevels();
      }
    } catch (err) {
      console.error("Update Impact Error:", err);
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

  return (
    <div className="aimp-layout">
      <SidebarAdmin />

      <div className="aimp-main-content">
        <div className="aimp-container">
          <div className="aimp-header">
            <div className="aimp-header-title-wrap">
              <div className="aimp-header-icon">
                <FaExclamationTriangle />
              </div>
              <div>
                <h1 className="aimp-title">จัดการระดับผลกระทบ (Impact Levels)</h1>
                <p className="aimp-subtitle">
                  ตั้งค่าเกณฑ์ นิยาม และ Maturity Level อ้างอิง สำหรับผู้ใช้งานทั่วไปที่ไม่มีหน่วยงานสังกัด
                  (ใช้แทนการเลือก Maturity Level ในเครื่องมือประเมิน)
                </p>
              </div>
            </div>
          </div>

          <div className="aimp-table-wrapper">
            {loading ? (
              <div className="aimp-state-container">
                <FaSpinner className="aimp-spin" />
                <p>กำลังโหลดข้อมูลระดับผลกระทบ...</p>
              </div>
            ) : (
              <table className="aimp-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>ระดับ (Level)</th>
                    <th style={{ width: "20%" }}>ชื่อระดับผลกระทบ</th>
                    <th style={{ width: "35%" }}>คำอธิบายนิยามเกณฑ์</th>
                    <th style={{ width: "15%" }}>Base of Maturity Level</th>
                    <th style={{ width: "10%" }}>สถานะระบบ</th>
                    <th className="aimp-text-center" style={{ width: "10%" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((lvl) => (
                    <tr
                      key={lvl.level_id}
                      className={!lvl.is_active ? "aimp-row-disabled" : ""}
                    >
                      <td className="aimp-font-bold aimp-text-center">
                        <span className="aimp-level-number">{lvl.level_id}</span>
                      </td>
                      <td className="aimp-font-bold">{lvl.level_name}</td>
                      <td>
                        <p className="aimp-text-desc">{lvl.description || "-"}</p>
                      </td>
                      <td>
                        <span className="aimp-base-badge">
                          {lvl.base_maturity_name ||
                            `Level ${lvl.base_maturity_level}`}
                        </span>
                      </td>
                      <td>
                        {lvl.is_active ? (
                          <span className="aimp-status-tag active">
                            <FaCheckCircle size={12} /> เปิดใช้งาน
                          </span>
                        ) : (
                          <span className="aimp-status-tag inactive">
                            <FaTimesCircle size={12} /> ปิดใช้งาน
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="aimp-actions">
                          <button
                            className="aimp-btn-action edit"
                            title="แก้ไขเกณฑ์ประเมิน"
                            onClick={() => handleEditClick(lvl)}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal แก้ไขข้อมูลเกณฑ์ผลกระทบ */}
      {isModalOpen && (
        <div className="aimp-modal-overlay">
          <div className="aimp-modal-container">
            <div className="aimp-modal-header">
              <h2>แก้ไขข้อมูลเกณฑ์ผลกระทบ Level {formData.level_id}</h2>
              <button
                className="aimp-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="aimp-modal-body">
              <div className="aimp-form-group">
                <label>ชื่อระดับผลกระทบ</label>
                <input
                  type="text"
                  name="level_name"
                  value={formData.level_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="aimp-form-group">
                <label>คำอธิบายเกณฑ์ / นิยามความหมาย</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="ระบุรายละเอียดเกณฑ์ผลกระทบเชิงลึก..."
                ></textarea>
              </div>

              <div className="aimp-form-group">
                <label>Base of Maturity Level</label>
                <select
                  name="base_maturity_level"
                  value={formData.base_maturity_level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือก Maturity Level อ้างอิง --
                  </option>
                  {maturityLevels.map((m) => (
                    <option key={m.level_id} value={m.level_id}>
                      {m.level_name}
                    </option>
                  ))}
                </select>
                <span className="aimp-form-hint">
                  เมื่อผู้ใช้เลือกระดับผลกระทบนี้ ระบบจะใช้ Maturity Level ที่เลือกไว้
                  ในการจับคู่หัวข้อประเมินและคำแนะนำเบื้องหลังทั้งหมด
                </span>
              </div>

              <div className="aimp-form-group aimp-checkbox-group">
                <label className="aimp-switch-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleToggleChange}
                  />
                  <span className="aimp-switch-slider"></span>
                </label>
                <span className="aimp-checkbox-text">
                  เปิดให้ใช้งานระดับนี้ในการประเมิน
                </span>
              </div>

              <div className="aimp-modal-footer">
                <button
                  type="button"
                  className="aimp-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="aimp-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImpact;
