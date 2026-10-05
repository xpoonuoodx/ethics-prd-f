import React, { useState, useEffect, useCallback } from "react";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import {
  FaUserGraduate,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import api from "../../api/Api";
import { formatThaiDateRange } from "../../utils/thaiDate";
import ThaiDatePicker from "../../component/ThaiDatePicker";
import "./style/AdminAlumni.css";

const EMPTY_FORM = {
  name: "",
  start_date: "",
  end_date: "",
  description: "",
};

// หน้าแอดมินจัดการ "รุ่น" ของทำเนียบรุ่น - กำหนดชื่อรุ่นและช่วงวันที่ ผู้ที่ได้รับใบประกาศฯ
// ภายในช่วงวันที่นั้นจะไปแสดงในรุ่นนี้ที่หน้า /alumni (ชื่อถูกปิดบังบางส่วน)
const AdminAlumni = () => {
  const { fire } = useThemedAlert();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/alumni-batches");
      setBatches(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Alumni Batches Error:", err);
      fire("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลรุ่นได้", "error");
    } finally {
      setLoading(false);
    }
  }, [fire]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBatches();
  }, [fetchBatches]);

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (batch) => {
    setEditingId(batch.id);
    setFormData({
      name: batch.name,
      start_date: String(batch.startDate).slice(0, 10),
      end_date: String(batch.endDate).slice(0, 10),
      description: batch.description || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // เลือกวันที่เริ่มเลยวันที่สิ้นสุดที่เลือกไว้ -> ดึงวันที่สิ้นสุดตามมาให้ ไม่ปล่อยให้ช่วงวันที่กลับด้าน
  const handleStartDateChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      start_date: value,
      end_date: prev.end_date && prev.end_date < value ? value : prev.end_date,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.start_date || !formData.end_date) {
      fire(
        "ข้อมูลไม่ครบถ้วน",
        "กรุณาระบุชื่อรุ่น วันที่เริ่ม และวันที่สิ้นสุด",
        "warning",
      );
      return;
    }
    if (formData.start_date > formData.end_date) {
      fire("ช่วงวันที่ไม่ถูกต้อง", "วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด", "warning");
      return;
    }

    try {
      setIsSaving(true);
      if (editingId) {
        await api.put(`/admin/alumni-batches/${editingId}`, formData);
      } else {
        await api.post("/admin/alumni-batches", formData);
      }
      setModalOpen(false);
      fire({
        title: "บันทึกสำเร็จ!",
        text: editingId ? "แก้ไขรุ่นเรียบร้อยแล้ว" : "เพิ่มรุ่นเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 1800,
        showConfirmButton: false,
      });
      fetchBatches();
    } catch (err) {
      console.error("Save Alumni Batch Error:", err);
      fire(
        "เกิดข้อผิดพลาด",
        err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (batch) => {
    fire({
      title: "ยืนยันการลบรุ่น?",
      text: `ลบรุ่น "${batch.name}" ออกจากทำเนียบรุ่น (ใบประกาศฯ ของผู้ใช้จะไม่ถูกลบ)`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบรุ่น",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.delete(`/admin/alumni-batches/${batch.id}`);
        fire("สำเร็จ!", "ลบรุ่นเรียบร้อยแล้ว", "success");
        fetchBatches();
      } catch (err) {
        console.error("Delete Alumni Batch Error:", err);
        fire(
          "ผิดพลาด",
          err.response?.data?.message || "ไม่สามารถลบรุ่นได้",
          "error",
        );
      }
    });
  };

  return (
    <div className="aal-layout">
      <SidebarAdmin />

      <div className="aal-main-content">
        <div className="aal-container">
          <div className="aal-header">
            <div className="aal-header-title-wrap">
              <div className="aal-header-icon">
                <FaUserGraduate />
              </div>
              <div>
                <h1 className="aal-title">จัดการทำเนียบรุ่น</h1>
                <p className="aal-subtitle">
                  กำหนดชื่อรุ่นและช่วงวันที่ ผู้ที่ได้รับใบประกาศฯ ในช่วงวันที่นั้นจะแสดงในรุ่นนี้ที่หน้าทำเนียบรุ่น
                </p>
              </div>
            </div>
            <button className="aal-btn-primary" onClick={openCreate}>
              <FaPlus /> เพิ่มรุ่น
            </button>
          </div>

          <div className="aal-card">
            {loading ? (
              <div className="aal-empty">
                <FaSpinner className="aal-spin" /> กำลังโหลดข้อมูล...
              </div>
            ) : batches.length === 0 ? (
              <div className="aal-empty">
                ยังไม่มีรุ่น กด &quot;เพิ่มรุ่น&quot; เพื่อสร้างรุ่นแรก
              </div>
            ) : (
              <div className="aal-table-wrap">
                <table className="aal-table">
                  <thead>
                    <tr>
                      <th>ชื่อรุ่น</th>
                      <th>ช่วงวันที่</th>
                      <th className="aal-center">ผู้ได้รับใบประกาศฯ</th>
                      <th className="aal-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr key={batch.id}>
                        <td>
                          <div className="aal-batch-name">{batch.name}</div>
                          {batch.description && (
                            <div className="aal-batch-desc">
                              {batch.description}
                            </div>
                          )}
                        </td>
                        <td>
                          {formatThaiDateRange(batch.startDate, batch.endDate)}
                        </td>
                        <td className="aal-center">{batch.alumniCount} คน</td>
                        <td className="aal-center">
                          <div className="aal-actions">
                            <button
                              className="aal-icon-btn"
                              title="แก้ไข"
                              onClick={() => openEdit(batch)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="aal-icon-btn danger"
                              title="ลบ"
                              onClick={() => handleDelete(batch)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="aal-modal-backdrop" onClick={closeModal}>
          <form
            className="aal-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSave}
          >
            <div className="aal-modal-header">
              <h2>{editingId ? "แก้ไขรุ่น" : "เพิ่มรุ่น"}</h2>
              <button
                type="button"
                className="aal-icon-btn"
                onClick={closeModal}
                aria-label="ปิด"
              >
                <FaTimes />
              </button>
            </div>

            <div className="aal-form-group">
              <label htmlFor="aal-name">
                ชื่อรุ่น <span className="aal-required">*</span>
              </label>
              <input
                id="aal-name"
                type="text"
                name="name"
                maxLength={255}
                placeholder="เช่น รุ่นที่ 1"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="aal-form-row">
              <div className="aal-form-group">
                <label htmlFor="aal-start">
                  วันที่เริ่ม <span className="aal-required">*</span>
                </label>
                <ThaiDatePicker
                  id="aal-start"
                  value={formData.start_date}
                  onChange={handleStartDateChange}
                />
              </div>
              <div className="aal-form-group">
                <label htmlFor="aal-end">
                  วันที่สิ้นสุด <span className="aal-required">*</span>
                </label>
                <ThaiDatePicker
                  id="aal-end"
                  align="right"
                  value={formData.end_date}
                  min={formData.start_date || undefined}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, end_date: value }))
                  }
                />
              </div>
            </div>

            <div className="aal-form-group">
              <label htmlFor="aal-desc">คำอธิบาย (ไม่บังคับ)</label>
              <textarea
                id="aal-desc"
                name="description"
                rows={3}
                placeholder="เช่น สถานที่หรือรายละเอียดของรุ่น"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <p className="aal-hint">
              ช่วงวันที่ของแต่ละรุ่นห้ามทับกัน นับจากวันที่ผู้ใช้ได้รับใบประกาศฯ (เวลาไทย)
            </p>

            <div className="aal-modal-footer">
              <button
                type="button"
                className="aal-btn-secondary"
                onClick={closeModal}
                disabled={isSaving}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="aal-btn-primary"
                disabled={isSaving}
              >
                {isSaving ? <FaSpinner className="aal-spin" /> : null}
                {isSaving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminAlumni;
