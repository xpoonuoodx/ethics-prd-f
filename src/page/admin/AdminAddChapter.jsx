import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import {
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
  FaVideo,
  FaFileAlt,
  FaBookOpen,
} from "react-icons/fa";
import "./style/AdminAddChapter.css";
import api from "../../api/Api";

const AdminAddChapter = () => {
  const { fire } = useThemedAlert();
  const navigate = useNavigate();

  // State เพิ่มฟิลด์ passingPercentage (ค่าตั้งต้น 80)
  const [chapterData, setChapterData] = useState({
    title: "",
    targetRole: "",
    status: "Active",
    videoUrl: "",
    passingPercentage: "80",
  });

  const [questions, setQuestions] = useState([
    { id: 1, questionText: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChangeInfo = (e) => {
    setChapterData({ ...chapterData, [e.target.name]: e.target.value });
  };

  const handleAddQuestion = () => {
    const newId =
      questions.length > 0 ? questions[questions.length - 1].id + 1 : 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (idToRemove) => {
    setQuestions(questions.filter((q) => q.id !== idToRemove));
  };

  const handleQuestionChange = (id, field, value, optionIndex = null) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === id) {
        if (field === "questionText") {
          return { ...q, questionText: value };
        } else if (field === "options") {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        } else if (field === "correctAnswer") {
          return { ...q, correctAnswer: parseInt(value) };
        }
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !chapterData.title ||
      !chapterData.videoUrl ||
      questions.length === 0 ||
      !chapterData.passingPercentage
    ) {
      fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อบทเรียน เกณฑ์คะแนนสอบผ่าน ลิงก์วิดีโอ และแบบทดสอบอย่างน้อย 1 ข้อ",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      const payload = {
        title: chapterData.title,
        targetRole: chapterData.targetRole,
        status: chapterData.status,
        videoUrl: chapterData.videoUrl,
        passingPercentage: parseInt(chapterData.passingPercentage), // ส่งข้อมูลผ่าน Payload ไปคุมหลังบ้าน
        questions: questions,
      };

      const response = await api.post("/admin/classroom/add", payload);

      if (response.data && response.data.success) {
        fire({
          title: "บันทึกข้อมูลสำเร็จ!",
          text: "ระบบได้เพิ่มบทเรียนใหม่เรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin-classroom");
        });
      }
    } catch (error) {
      console.error("Save Chapter Error:", error);
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

  const renderVideoPreview = (url) => {
    if (!url)
      return (
        <div className="aac-video-placeholder">
          กรอกลิงก์วิดีโอเพื่อดูตัวอย่าง
        </div>
      );
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
    );
    if (ytMatch && ytMatch[1]) {
      return (
        <iframe
          className="aac-video-iframe"
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="YouTube video preview"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      );
    }
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return (
        <iframe
          className="aac-video-iframe"
          src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
          title="Google Drive video preview"
          allow="autoplay"
        ></iframe>
      );
    }
    return (
      <video className="aac-video-iframe" controls>
        <source src={url} />
        เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้
      </video>
    );
  };

  return (
    <div className="aac-layout">
      <SidebarAdmin />
      <div className="aac-main-content">
        <div className="aac-container">
          <div className="aac-header">
            <div className="aac-header-title-wrap">
              <div className="aac-header-icon">
                <FaBookOpen />
              </div>
              <div>
                <h1 className="aac-title">เพิ่มบทเรียนใหม่</h1>
                <p className="aac-subtitle">
                  สร้างเนื้อหาวิดีโอและแบบทดสอบสำหรับผู้ใช้งานระบบ
                </p>
              </div>
            </div>
            <div className="aac-header-actions">
              <button
                className="aac-btn-secondary"
                onClick={() => navigate("/admin-classroom")}
              >
                <FaArrowLeft /> กลับ
              </button>
              <button className="aac-btn-primary" onClick={handleSave}>
                <FaSave /> บันทึกบทเรียน
              </button>
            </div>
          </div>

          <form className="aac-form">
            <div className="aac-form-card">
              <div className="aac-card-header">
                <FaVideo className="aac-card-icon" />
                <h2>ข้อมูลบทเรียนและวิดีโอ</h2>
              </div>

              <div className="aac-form-row">
                <div className="aac-form-group">
                  <label>
                    ชื่อบทเรียน <span className="aac-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={chapterData.title}
                    onChange={handleChangeInfo}
                    placeholder="เช่น บทที่ 1: จริยธรรม AI เบื้องต้น"
                  />
                </div>
              </div>

              <div className="aac-form-row aac-col-2">
                <div className="aac-form-group">
                  <label>
                    สำหรับกลุ่มผู้ใช้งาน <span className="aac-required">*</span>
                  </label>
                  <select
                    name="targetRole"
                    value={chapterData.targetRole}
                    onChange={handleChangeInfo}
                  >
                    <option value="" disabled>
                      -- เลือกกลุ่มผู้ใช้งาน --
                    </option>
                    <option value="Group 1">
                      กลุ่มที่ 1 (Regulator, Policy)
                    </option>
                    <option value="Group 2">
                      กลุ่มที่ 2 (Researcher, Developer, Service Provider)
                    </option>
                    <option value="Group 3">กลุ่มที่ 3 (User)</option>
                  </select>
                </div>
                <div className="aac-form-group">
                  <label>สถานะการใช้งาน</label>
                  <select
                    name="status"
                    value={chapterData.status}
                    onChange={handleChangeInfo}
                  >
                    <option value="Active">เปิดใช้งาน</option>
                    <option value="Inactive">ปิดใช้งาน (ร่าง)</option>
                  </select>
                </div>
              </div>

              {/* เพิ่มช่องกรอกเกณฑ์การสอบผ่านระดับเปอร์เซ็นต์ */}
              <div className="aac-form-row aac-col-2">
                <div className="aac-form-group">
                  <label>
                    เกณฑ์คะแนนสอบผ่านขั้นต่ำ (%){" "}
                    <span className="aac-required">*</span>
                  </label>
                  <select
                    name="passingPercentage"
                    value={chapterData.passingPercentage}
                    onChange={handleChangeInfo}
                  >
                    <option value="50">50%</option>
                    <option value="60">60%</option>
                    <option value="70">70%</option>
                    <option value="80">80%</option>
                    <option value="90">90%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>

              <div className="aac-form-row">
                <div className="aac-form-group">
                  <label>
                    ลิงก์วิดีโอ (URL) <span className="aac-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="videoUrl"
                    value={chapterData.videoUrl}
                    onChange={handleChangeInfo}
                    placeholder="เช่น ลิงก์ YouTube, Google Drive, AWS S3 (.mp4)"
                  />
                </div>
              </div>

              <div className="aac-video-preview-container">
                <label className="aac-preview-label">ตัวอย่างวิดีโอ:</label>
                <div className="aac-video-preview-wrapper">
                  {renderVideoPreview(chapterData.videoUrl)}
                </div>
              </div>
            </div>

            <div className="aac-form-card">
              <div className="aac-card-header-flex">
                <div className="aac-card-header-title">
                  <FaFileAlt className="aac-card-icon" />
                  <h2>จัดการแบบทดสอบ</h2>
                </div>
                <button
                  type="button"
                  className="aac-btn-add-question"
                  onClick={handleAddQuestion}
                >
                  <FaPlus /> เพิ่มข้อสอบ
                </button>
              </div>

              {questions.map((q, qIndex) => (
                <div key={q.id} className="aac-question-box">
                  <div className="aac-question-header">
                    <h3>ข้อที่ {qIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        className="aac-btn-remove"
                        onClick={() => handleRemoveQuestion(q.id)}
                      >
                        <FaTrash /> ลบข้อนี้
                      </button>
                    )}
                  </div>

                  <div className="aac-form-group">
                    <label>คำถาม</label>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          q.id,
                          "questionText",
                          e.target.value,
                        )
                      }
                      placeholder="พิมพ์คำถามที่นี่..."
                    />
                  </div>

                  <div className="aac-options-grid">
                    {q.options.map((opt, optIndex) => (
                      <div
                        key={optIndex}
                        className={`aac-option-item ${q.correctAnswer === optIndex ? "is-correct" : ""}`}
                      >
                        <div className="aac-radio-container">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === optIndex}
                            onChange={(e) =>
                              handleQuestionChange(
                                q.id,
                                "correctAnswer",
                                e.target.value,
                              )
                            }
                            value={optIndex}
                          />
                          <label>ตัวเลือกที่ {optIndex + 1}</label>
                        </div>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleQuestionChange(
                              q.id,
                              "options",
                              e.target.value,
                              optIndex,
                            )
                          }
                          placeholder={`คำตอบตัวเลือกที่ ${optIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="aac-bottom-actions">
              <button
                type="button"
                className="aac-btn-save-large"
                onClick={handleSave}
              >
                <FaSave /> บันทึกข้อมูลบทเรียนทั้งหมด
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddChapter;
