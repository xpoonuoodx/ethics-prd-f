import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
  FaVideo,
  FaFileAlt,
  FaSpinner,
} from "react-icons/fa";
import "./style/AdminEditChapter.css"; // ไฟล์สไตล์

const AdminEditChapter = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // รับค่า id จาก URL

  const [loading, setLoading] = useState(true);

  // State สำหรับข้อมูลทั่วไปและวิดีโอ
  const [chapterData, setChapterData] = useState({
    title: "",
    targetRole: "บทบาทที่ 1",
    status: "Active",
    videoUrl: "",
  });

  // State สำหรับแบบทดสอบ
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchChapterData();
  }, [id]);

  // จำลองการดึงข้อมูลบทเรียนเดิมจาก Backend เพื่อมาแสดงในฟอร์ม
  const fetchChapterData = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800)); // หน่วงเวลาให้เห็น Loading

      // Mock Data: สมมติว่านี่คือข้อมูลที่ดึงมาจาก Database ตาม id
      setChapterData({
        title: `บทที่ 1: จริยธรรม AI เบื้องต้น (รหัส ${id})`,
        targetRole: "",
        status: "Active",
        videoUrl: "https://www.youtube.com/watch?v=mockvideo",
      });

      setQuestions([
        {
          id: 1,
          questionText: "AI ย่อมาจากอะไร?",
          options: [
            "Artificial Intelligence",
            "Automated Information",
            "Advanced Interface",
            "Animal Instinct",
          ],
          correctAnswer: 0,
        },
        {
          id: 2,
          questionText: "ข้อใดคือความเสี่ยงของ AI?",
          options: [
            "การทำงานเร็วขึ้น",
            "ความลำเอียงของข้อมูล (Bias)",
            "ช่วยลดต้นทุน",
            "ถูกทุกข้อ",
          ],
          correctAnswer: 1,
        },
      ]);
    } catch (error) {
      console.error("Error fetching chapter data:", error);
      Swal.fire("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลบทเรียนได้", "error");
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

  const handleSave = (e) => {
    e.preventDefault();
    if (!chapterData.title || !chapterData.videoUrl || questions.length === 0) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อบทเรียน ลิงก์วิดีโอ และแบบทดสอบอย่างน้อย 1 ข้อ",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    // เมื่อบันทึกการแก้ไขสำเร็จ
    Swal.fire({
      title: "อัปเดตข้อมูลสำเร็จ!",
      text: "ระบบได้บันทึกการแก้ไขบทเรียนเรียบร้อยแล้ว",
      icon: "success",
      confirmButtonColor: "#10b981",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      navigate("/admin-classroom");
    });
  };

  return (
    <div className="admin-edit-chapter-layout">
      <SidebarAdmin />

      <div className="admin-edit-chapter-main">
        <div className="admin-edit-chapter-inner">
          <div className="edit-chapter-header">
            <button
              className="btn-back"
              onClick={() => navigate("/admin-classroom")}
            >
              <FaArrowLeft /> กลับ
            </button>
            <div className="header-title">
              <h1>แก้ไขบทเรียน</h1>
              <p>แก้ไขเนื้อหาวิดีโอและแบบทดสอบ รหัส: {id}</p>
            </div>
            <button className="btn-save-top" onClick={handleSave}>
              <FaSave /> บันทึกการแก้ไข
            </button>
          </div>

          {loading ? (
            <div className="edit-loading-state">
              <FaSpinner className="spin-icon" />
              <p>กำลังโหลดข้อมูลบทเรียน...</p>
            </div>
          ) : (
            <form className="edit-chapter-form">
              {/* ข้อมูลบทเรียนและวิดีโอ */}
              <div className="form-card">
                <h2 className="card-title">
                  <FaVideo className="title-icon" /> ข้อมูลบทเรียนและวิดีโอ
                </h2>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>
                      ชื่อบทเรียน <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={chapterData.title}
                      onChange={handleChangeInfo}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>
                      สำหรับกลุ่มผู้ใช้งาน <span className="required">*</span>
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
                  <div className="form-group">
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

                <div className="form-group-row">
                  <div className="form-group">
                    <label>
                      ลิงก์วิดีโอ (URL) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="videoUrl"
                      value={chapterData.videoUrl}
                      onChange={handleChangeInfo}
                    />
                  </div>
                </div>
              </div>

              {/* จัดการแบบทดสอบ */}
              <div className="form-card">
                <div className="card-header-flex">
                  <h2 className="card-title">
                    <FaFileAlt className="title-icon" /> จัดการแบบทดสอบ
                  </h2>
                  <button
                    type="button"
                    className="btn-add-question"
                    onClick={handleAddQuestion}
                  >
                    <FaPlus /> เพิ่มข้อสอบ
                  </button>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={q.id} className="question-box">
                    <div className="question-box-header">
                      <h3>ข้อที่ {qIndex + 1}</h3>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-question"
                          onClick={() => handleRemoveQuestion(q.id)}
                        >
                          <FaTrash /> ลบข้อนี้
                        </button>
                      )}
                    </div>

                    <div className="form-group">
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

                    <div className="options-grid">
                      {q.options.map((opt, optIndex) => (
                        <div
                          key={optIndex}
                          className={`option-item ${q.correctAnswer === optIndex ? "is-correct" : ""}`}
                        >
                          <div className="radio-container">
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

              <div className="bottom-actions">
                <button
                  type="button"
                  className="btn-save-large"
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
