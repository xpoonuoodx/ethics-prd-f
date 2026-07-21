import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/AdminComponentActivities.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTasks,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import api from "../../api/Api";

const AdminComponentActivities = () => {
  const { componentId } = useParams();
  const navigate = useNavigate();

  const [component, setComponent] = useState(null);
  const [activities, setActivities] = useState([]);
  const [maturityLevels, setMaturityLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    id: null,
    activity_text: "",
    maturity_level: "",
    sort_order: "0",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
    fetchMaturityLevels();
  }, [componentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/admin/get-component-activities/${componentId}`,
      );
      if (response.data && response.data.success) {
        setComponent(response.data.data.component);
        setActivities(response.data.data.activities);
      } else {
        setError("ไม่พบหัวข้อการประเมินนี้ในระบบ");
      }
    } catch (err) {
      console.error("Fetch Component Activities Error:", err);
      setError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
      );
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

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      activity_text: "",
      maturity_level: "",
      sort_order: String(activities.length),
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (activity) => {
    setIsEditing(true);
    setFormData({
      id: activity.id,
      activity_text: activity.activity_text,
      maturity_level: activity.maturity_level.toString(),
      sort_order: (activity.sort_order ?? 0).toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.activity_text.trim() || formData.maturity_level === "") {
      openAlert(
        "warning",
        "ข้อมูลไม่ครบถ้วน",
        "กรุณากรอกข้อความกิจกรรมและเลือกระดับความพร้อม",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      let response;

      if (isEditing) {
        response = await api.put(
          `/admin/update-component-activity/${formData.id}`,
          formData,
        );
      } else {
        response = await api.post("/admin/add-component-activity", {
          ...formData,
          component_id: componentId,
        });
      }

      if (response.data && response.data.success) {
        setIsModalOpen(false);
        openAlert(
          "success",
          "สำเร็จ",
          isEditing ? "แก้ไข Activity สำเร็จ" : "เพิ่ม Activity ใหม่สำเร็จ",
        );
        fetchData();
      }
    } catch (err) {
      console.error("Submit Activity Error:", err);
      openAlert(
        "error",
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (activity) => {
    openAlert(
      "warning",
      "ยืนยันการลบ?",
      `คุณต้องการลบ Activity นี้ใช่หรือไม่: "${activity.activity_text}"`,
      true,
      async () => {
        closeAlert();
        try {
          const response = await api.delete(
            `/admin/delete-component-activity/${activity.id}`,
          );
          if (response.data && response.data.success) {
            openAlert("success", "ลบสำเร็จ!", "ลบ Activity ออกจากระบบเรียบร้อย");
            fetchData();
          }
        } catch (err) {
          console.error("Delete Activity Error:", err);
          openAlert(
            "error",
            "เกิดข้อผิดพลาด",
            err.response?.data?.message || "ไม่สามารถลบข้อมูลได้",
          );
        }
      },
    );
  };

  // ตัวเลือกระดับความพร้อม จำกัดไม่ให้เกิน MAX Maturity ของ Component นี้
  const levelOptions = maturityLevels.filter(
    (lv) => !component || lv.level_id <= component.max_maturity_level,
  );

  return (
    <div className="aca-layout">
      <SidebarAdmin />

      <div className="aca-main-content">
        <div className="aca-container">
          <button className="aca-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> กลับไปหน้าหัวข้อการประเมิน
          </button>

          {loading ? (
            <div className="aca-state-container">
              <FaSpinner className="aca-spin" />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="aca-state-container aca-error">
              <p>{error}</p>
            </div>
          ) : (
            component && (
              <>
                <div className="aca-header">
                  <div className="aca-header-title-wrap">
                    <div className="aca-header-icon">
                      <FaTasks />
                    </div>
                    <div>
                      <span className="aca-component-code">
                        {component.id} · {component.role}
                      </span>
                      <h1 className="aca-title">{component.title}</h1>
                      <p className="aca-subtitle">
                        กำหนด Activities ของหัวข้อนี้ พร้อมระบุว่าแต่ละกิจกรรมอยู่ในระดับความพร้อม (Maturity Level) ใด — สูงสุด Level {component.max_maturity_level}
                      </p>
                    </div>
                  </div>
                  <button className="aca-btn-primary" onClick={handleAddClick}>
                    <FaPlus /> เพิ่ม Activity
                  </button>
                </div>

                <div className="aca-table-wrapper">
                  <table className="aca-card-table">
                    <thead>
                      <tr>
                        <th style={{ width: "60%" }}>Activity</th>
                        <th className="aca-text-center" style={{ width: "15%" }}>
                          Maturity Level
                        </th>
                        <th className="aca-text-center" style={{ width: "10%" }}>
                          ลำดับ
                        </th>
                        <th className="aca-text-center" style={{ width: "15%" }}>
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => (
                        <tr key={activity.id}>
                          <td className="aca-font-medium">
                            {activity.activity_text}
                          </td>
                          <td className="aca-text-center">
                            <span className="aca-level-badge">
                              Lv. {activity.maturity_level}
                            </span>
                          </td>
                          <td className="aca-text-center aca-text-muted">
                            {activity.sort_order}
                          </td>
                          <td>
                            <div className="aca-actions">
                              <button
                                className="aca-btn-action edit"
                                title="แก้ไข Activity"
                                onClick={() => handleEditClick(activity)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="aca-btn-action delete"
                                title="ลบ Activity"
                                onClick={() => handleDelete(activity)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {activities.length === 0 && (
                        <tr>
                          <td colSpan="4" className="aca-empty-state">
                            ยังไม่มี Activity ในหัวข้อนี้ กด "เพิ่ม Activity" เพื่อเริ่มต้น
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* Modal เพิ่ม/แก้ไข Activity */}
      {isModalOpen && (
        <div className="aca-modal-overlay">
          <div className="aca-modal-container">
            <div className="aca-modal-header">
              <h2>{isEditing ? "แก้ไข Activity" : "เพิ่ม Activity ใหม่"}</h2>
              <button
                className="aca-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="aca-modal-body">
              <div className="aca-form-group">
                <label>ข้อความกิจกรรม (Activity)</label>
                <textarea
                  name="activity_text"
                  placeholder="ระบุรายละเอียดกิจกรรม เช่น ศึกษาและทำความเข้าใจบริบทจริยธรรมปัญญาประดิษฐ์..."
                  value={formData.activity_text}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="aca-form-group">
                <label>ระดับความพร้อม (Maturity Level)</label>
                <select
                  name="maturity_level"
                  value={formData.maturity_level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกระดับความพร้อม --
                  </option>
                  {levelOptions.map((lv) => (
                    <option key={lv.level_id} value={lv.level_id}>
                      Level {lv.level_id} - {lv.level_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="aca-form-group">
                <label>ลำดับการแสดงผล (Sort Order)</label>
                <input
                  type="number"
                  name="sort_order"
                  min="0"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                />
                <small className="aca-form-hint">
                  ใช้จัดลำดับก่อน-หลังเมื่อ Activities อยู่ระดับเดียวกัน (ไม่บังคับ)
                </small>
              </div>

              <div className="aca-modal-footer">
                <button
                  type="button"
                  className="aca-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="aca-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {alertModal.isOpen && (
        <div className="aca-alert-overlay" onClick={closeAlert}>
          <div
            className="aca-alert-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="aca-alert-close" onClick={closeAlert}>
              <FaTimes />
            </button>

            <div className={`aca-alert-icon-wrapper ${alertModal.type}`}>
              {alertModal.type === "success" && <FaCheckCircle />}
              {alertModal.type === "error" && <FaTimesCircle />}
              {alertModal.type === "warning" && <FaExclamationTriangle />}
              {alertModal.type === "info" && <FaInfoCircle />}
            </div>

            <h3 className="aca-alert-title">{alertModal.title}</h3>
            <p className="aca-alert-desc">{alertModal.desc}</p>

            <div className="aca-alert-actions">
              {alertModal.showCancel && (
                <button className="aca-alert-btn cancel" onClick={closeAlert}>
                  ยกเลิก
                </button>
              )}
              <button
                className={`aca-alert-btn ${alertModal.type}`}
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

export default AdminComponentActivities;
