import React, { useState, useEffect } from "react";
import "./style/AdminMaturity.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaEdit,
  FaSlidersH,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import api from "../../api/Api";

const AdminMaturity = () => {
  const { fire } = useThemedAlert();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    level_id: "",
    level_name: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMaturityLevels();
  }, []);

  const fetchMaturityLevels = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/get-maturity-levels");
      if (response.data && response.data.success) {
        setLevels(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Maturity Levels Error:", err);
      setLevels([]);
    } finally {
      setLoading(false);
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
      is_active: lvl.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.level_name) return;

    try {
      setIsSubmitting(true);
      const response = await api.put(
        `/admin/update-maturity-level/${formData.level_id}`,
        formData,
      );

      if (response.data && response.data.success) {
        fire({
          icon: "success",
          title: "สำเร็จ",
          text: "อัปเดตเกณฑ์ระดับความพร้อมเรียบร้อยแล้ว",
          confirmButtonColor: "#10b981",
        });
        setIsModalOpen(false);
        fetchMaturityLevels();
      }
    } catch (err) {
      console.error("Update Maturity Error:", err);
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
    <div className="am-layout">
      <SidebarAdmin />

      <div className="am-main-content">
        <div className="am-container">
          <div className="am-header">
            <div className="am-header-title-wrap">
              <div className="am-header-icon">
                <FaSlidersH />
              </div>
              <div>
                <h1 className="am-title">
                  จัดการระดับความพร้อม (Maturity Levels)
                </h1>
                <p className="am-subtitle">
                  ตั้งค่าเกณฑ์ นิยาม และสถานะการเปิดใช้งานของระดับวุฒิภาวะ 1 - 5
                  หมวดมาตรฐาน
                </p>
              </div>
            </div>
          </div>

          <div className="am-table-wrapper">
            {loading ? (
              <div className="am-state-container">
                <FaSpinner className="am-spin" />
                <p>กำลังโหลดข้อมูลระดับความพร้อม...</p>
              </div>
            ) : (
              <table className="am-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>ระดับ (Level)</th>
                    <th style={{ width: "30%" }}>ชื่อระดับความพร้อม</th>
                    <th style={{ width: "40%" }}>คำอธิบายนิยามเกณฑ์</th>
                    <th style={{ width: "15%" }}>สถานะระบบ</th>
                    <th className="am-text-center" style={{ width: "10%" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((lvl) => (
                    <tr
                      key={lvl.level_id}
                      className={!lvl.is_active ? "am-row-disabled" : ""}
                    >
                      <td className="am-font-bold am-text-center">
                        <span className="am-level-number">{lvl.level_id}</span>
                      </td>
                      <td className="am-font-bold">{lvl.level_name}</td>
                      <td>
                        <p className="am-text-desc">{lvl.description || "-"}</p>
                      </td>
                      <td>
                        {lvl.is_active ? (
                          <span className="am-status-tag active">
                            <FaCheckCircle size={12} /> เปิดใช้งาน
                          </span>
                        ) : (
                          <span className="am-status-tag inactive">
                            <FaTimesCircle size={12} /> ปิดใช้งาน
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="am-actions">
                          <button
                            className="am-btn-action edit"
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

      {/* Modal แก้ไขข้อมูลเกณฑ์ประเมิน */}
      {isModalOpen && (
        <div className="am-modal-overlay">
          <div className="am-modal-container">
            <div className="am-modal-header">
              <h2>แก้ไขข้อมูลเกณฑ์ประเมิน Level {formData.level_id}</h2>
              <button
                className="am-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="am-modal-body">
              <div className="am-form-group">
                <label>ชื่อระดับความพร้อม</label>
                <input
                  type="text"
                  name="level_name"
                  value={formData.level_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="am-form-group">
                <label>คำอธิบายเกณฑ์ / นิยามความหมาย</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="ระบุรายละเอียดเกณฑ์ประเมินเชิงลึก..."
                ></textarea>
              </div>

              <div className="am-form-group am-checkbox-group">
                <label className="am-switch-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleToggleChange}
                  />
                  <span className="am-switch-slider"></span>
                </label>
                <span className="am-checkbox-text">
                  เปิดให้ใช้งานระดับนี้ในการประเมิน
                </span>
              </div>

              <div className="am-modal-footer">
                <button
                  type="button"
                  className="am-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="am-btn-submit"
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

export default AdminMaturity;
