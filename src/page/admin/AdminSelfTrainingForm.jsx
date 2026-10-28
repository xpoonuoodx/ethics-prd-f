import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import {
  FaArrowLeft,
  FaSave,
  FaYoutube,
  FaAlignLeft,
  FaSpinner,
} from "react-icons/fa";
import "./style/AdminSelfTrainingForm.css";
import api from "../../api/Api";

// ดึง YouTube video id จากลิงก์หลายรูปแบบ - regex ชุดเดียวกับที่ AdminAddChapter.jsx ใช้
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
  );
  return match ? match[1] : null;
};

// หน้าเดียวใช้ร่วมกันทั้งเพิ่มและแก้ไข (ต่างจาก Classroom ที่แยกไฟล์ Add/Edit เพราะหน้านี้
// มีแค่ 3 ฟิลด์ ไม่มีแบบทดสอบผูกอยู่ด้วย แยกไฟล์แล้วจะซ้ำซ้อนโดยไม่จำเป็น)
const AdminSelfTrainingForm = () => {
  const { fire } = useThemedAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isEditMode) {
      fetchVideoData();
    }
  }, [id]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/self-training/${id}`);
      if (response.data && response.data.success) {
        const { title, youtubeUrl, description } = response.data.data;
        setFormData({ title, youtubeUrl, description: description || "" });
      }
    } catch (error) {
      console.error("Fetch Self Training Video Error:", error);
      fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลวิดีโอได้",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.youtubeUrl) {
      fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อวิดีโอและลิงก์ YouTube",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      const response = isEditMode
        ? await api.put(`/admin/self-training/edit/${id}`, formData)
        : await api.post("/admin/self-training/add", formData);

      if (response.data && response.data.success) {
        fire({
          title: "บันทึกข้อมูลสำเร็จ!",
          text: isEditMode
            ? "แก้ไขวิดีโอเรียบร้อยแล้ว"
            : "เพิ่มวิดีโอใหม่เรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin-self-training");
        });
      }
    } catch (error) {
      console.error("Save Self Training Video Error:", error);
      fire({
        title: "เกิดข้อผิดพลาด",
        text:
          error.response?.data?.message ||
          "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const ytId = getYouTubeId(formData.youtubeUrl);

  if (loading) {
    return (
      <div className="asf-layout">
        <SidebarAdmin />
        <div className="asf-main-content asf-flex-center">
          <FaSpinner className="asf-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="asf-layout">
      <SidebarAdmin />
      <div className="asf-main-content">
        <div className="asf-container">
          <div className="asf-header">
            <div className="asf-header-title-wrap">
              <div className="asf-header-icon">
                <FaYoutube />
              </div>
              <div>
                <h1 className="asf-title">
                  {isEditMode ? "แก้ไขวิดีโออบรมออนไลน์" : "เพิ่มวิดีโออบรมออนไลน์ใหม่"}
                </h1>
                <p className="asf-subtitle">
                  ใส่ลิงก์วิดีโอ YouTube พร้อมชื่อและรายละเอียด
                </p>
              </div>
            </div>
            <div className="asf-header-actions">
              <button
                className="asf-btn-secondary"
                onClick={() => navigate("/admin-self-training")}
              >
                <FaArrowLeft /> กลับ
              </button>
              <button className="asf-btn-primary" onClick={handleSave}>
                <FaSave /> บันทึกวิดีโอ
              </button>
            </div>
          </div>

          <form className="asf-form">
            <div className="asf-form-card">
              <div className="asf-card-header">
                <FaYoutube className="asf-card-icon" />
                <h2>ข้อมูลวิดีโอ</h2>
              </div>

              <div className="asf-form-row">
                <div className="asf-form-group">
                  <label>
                    ชื่อวิดีโอ <span className="asf-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="เช่น แนวทางการประเมินจริยธรรม AI เบื้องต้น"
                  />
                </div>
              </div>

              <div className="asf-form-row">
                <div className="asf-form-group">
                  <label>
                    ลิงก์ YouTube <span className="asf-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="เช่น https://www.youtube.com/watch?v=xxxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="asf-video-preview-container">
                <label className="asf-preview-label">ตัวอย่างวิดีโอ:</label>
                <div className="asf-video-preview-wrapper">
                  {ytId ? (
                    <iframe
                      className="asf-video-iframe"
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title="YouTube video preview"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="asf-video-placeholder">
                      กรอกลิงก์ YouTube ที่ถูกต้องเพื่อดูตัวอย่าง
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="asf-form-card">
              <div className="asf-card-header">
                <FaAlignLeft className="asf-card-icon" />
                <h2>รายละเอียดวิดีโอ</h2>
              </div>
              <div className="asf-form-row">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="อธิบายเนื้อหาของวิดีโอนี้ เช่น หัวข้อที่ครอบคลุม จุดสำคัญที่ควรรู้ ฯลฯ (ไม่บังคับกรอก)"
                  className="asf-description-textarea"
                />
              </div>
            </div>

            <div className="asf-bottom-actions">
              <button
                type="button"
                className="asf-btn-save-large"
                onClick={handleSave}
              >
                <FaSave /> บันทึกข้อมูลวิดีโอ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSelfTrainingForm;
