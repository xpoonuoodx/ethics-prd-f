import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import {
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
  FaVideo,
  FaFileAlt,
  FaSpinner,
  FaEdit,
} from "react-icons/fa";
import "./style/AdminEditChapter.css";
import api from "../../api/Api";

const AdminEditChapter = () => {
  const { fire } = useThemedAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [chapterData, setChapterData] = useState({
    title: "",
    targetRole: "บทบาทที่ 1",
    status: "Active",
    videoUrl: "",
    passingPercentage: "80", // เพิ่มสถานะเกณฑ์ผ่าน
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchChapterData();
  }, [id]);

  const fetchChapterData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/classroom/${id}`);

      if (response.data && response.data.success) {
        const {
          title,
          targetRole,
          status,
          videoUrl,
          questions,
          passingPercentage,
        } = response.data.data;

        // นำค่าเกณฑ์ผ่านมาเก็บใน state ดักจับด้วย
        setChapterData({
          title,
          targetRole,
          status,
          videoUrl,
          passingPercentage: passingPercentage?.toString() || "80",
        });

        if (questions && questions.length > 0) {
          setQuestions(questions);
        } else {
          setQuestions([
            {
              id: 1,
              questionText: "",
              options: ["", "", "", ""],
              correctAnswer: 0,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      fire({
        title: "ข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลบทเรียนได้",
        icon: "error",
        confirmButtonColor: "#ef4444",
      }).then(() => {
        navigate("/admin-classroom");
      });
    } finally {
      setLoading(false);
    }
  };

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
        if (field === "questionText") return { ...q, questionText: value };
        else if (field === "options") {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        } else if (field === "correctAnswer")
          return { ...q, correctAnswer: parseInt(value) };
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
        passingPercentage: parseInt(chapterData.passingPercentage), // ส่งข้อมูลผ่าน PUT API
        questions: questions,
      };

      const response = await api.put(`/admin/classroom/edit/${id}`, payload);

      if (response.data && response.data.success) {
        fire({
          title: "อัปเดตข้อมูลสำเร็จ!",
          text: "ระบบได้บันทึกการแก้ไขบทเรียนเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin-classroom");
        });
      }
    } catch (error) {
      console.error("Edit Chapter Error:", error);
      fire({
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลได้",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const renderVideoPreview = (url) => {
    if (!url)
      return (
        <div className="aec-video-placeholder">
          กรอกลิงก์วิดีโอเพื่อดูตัวอย่าง
        </div>
      );
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
    );
    if (ytMatch && ytMatch[1]) {
      return (
        <iframe
          className="aec-video-iframe"
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
          className="aec-video-iframe"
          src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
          title="Google Drive video preview"
          allow="autoplay"
        ></iframe>
      );
    }
    return (
      <video className="aec-video-iframe" controls>
        <source src={url} />
        เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอนี้
      </video>
    );
  };

  return (
    <div className="aec-layout">
      <SidebarAdmin />
      <div className="aec-main-content">
        <div className="aec-container">
          <div className="aec-header">
            <div className="aec-header-title-wrap">
              <div className="aec-header-icon">
                <FaEdit />
              </div>
              <div>
                <h1 className="aec-title">แก้ไขบทเรียน</h1>
                <p className="aec-subtitle">
                  แก้ไขเนื้อหาวิดีโอและแบบทดสอบ (รหัส: {id})
                </p>
              </div>
            </div>
            <div className="aec-header-actions">
              <button
                className="aec-btn-secondary"
                onClick={() => navigate("/admin-classroom")}
              >
                <FaArrowLeft /> กลับ
              </button>
              <button className="aec-btn-primary" onClick={handleSave}>
                <FaSave /> บันทึกการแก้ไข
              </button>
            </div>
          </div>

          {loading ? (
            <div className="aec-state-container">
              <FaSpinner className="aec-spin" />
              <p>กำลังโหลดข้อมูลบทเรียน...</p>
            </div>
          ) : (
            <form className="aec-form">
              <div className="aec-form-card">
                <div className="aec-card-header">
                  <FaVideo className="aec-card-icon" />
                  <h2>ข้อมูลบทเรียนและวิดีโอ</h2>
                </div>

                <div className="aec-form-row">
                  <div className="aec-form-group">
                    <label>
                      ชื่อบทเรียน <span className="aec-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={chapterData.title}
                      onChange={handleChangeInfo}
                    />
                  </div>
                </div>

                <div className="aec-form-row aac-col-2">
                  <div className="aec-form-group">
                    <label>
                      สำหรับกลุ่มผู้ใช้งาน{" "}
                      <span className="aec-required">*</span>
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
                  <div className="aec-form-group">
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

                {/* อัปเดตช่องแก้ไขเกณฑ์ผ่านการสอบ */}
                <div className="aec-form-row aac-col-2">
                  <div className="aec-form-group">
                    <label>
                      เกณฑ์คะแนนสอบผ่านขั้นต่ำ (%){" "}
                      <span className="aec-required">*</span>
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

                <div className="aec-form-row">
                  <div className="aec-form-group">
                    <label>
                      ลิงก์วิดีโอ (URL) <span className="aec-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="videoUrl"
                      value={chapterData.videoUrl}
                      onChange={handleChangeInfo}
                    />
                  </div>
                </div>

                <div className="aec-video-preview-container">
                  <label className="aec-preview-label">ตัวอย่างวิดีโอ:</label>
                  <div className="aec-video-preview-wrapper">
                    {renderVideoPreview(chapterData.videoUrl)}
                  </div>
                </div>
              </div>

              <div className="aec-form-card">
                <div className="aec-card-header-flex">
                  <div className="aec-card-header-title">
                    <FaFileAlt className="aec-card-icon" />
                    <h2>จัดการแบบทดสอบ</h2>
                  </div>
                  <button
                    type="button"
                    className="aec-btn-add-question"
                    onClick={handleAddQuestion}
                  >
                    {" "}
                    <FaPlus /> เพิ่มข้อสอบ
                  </button>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={q.id} className="aec-question-box">
                    <div className="aec-question-header">
                      <h3>ข้อที่ {qIndex + 1}</h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          className="aec-btn-remove"
                          onClick={() => handleRemoveQuestion(q.id)}
                        >
                          <FaTrash /> ลบข้อนี้
                        </button>
                      )}
                    </div>

                    <div className="aec-form-group">
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
                      />
                    </div>

                    <div className="aec-options-grid">
                      {q.options.map((opt, optIndex) => (
                        <div
                          key={optIndex}
                          className={`aec-option-item ${q.correctAnswer === optIndex ? "is-correct" : ""}`}
                        >
                          <div className="aec-radio-container">
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
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="aec-bottom-actions">
                <button
                  type="button"
                  className="aec-btn-save-large"
                  onClick={handleSave}
                >
                  <FaSave /> บันทึกการแก้ไขข้อมูล
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditChapter;
