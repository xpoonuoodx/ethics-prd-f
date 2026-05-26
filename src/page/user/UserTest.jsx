import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaListUl,
  FaStar,
  FaPlay,
} from "react-icons/fa";
import "./style/UserTest.css";

const UserTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "user";

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // เพิ่ม State ควบคุมการเริ่มแบบทดสอบ

  useEffect(() => {
    window.scrollTo(0, 0);
    // คำถามจำลองตามสายงาน
    if (role === "regulator") {
      setQuestions([
        {
          q: "หลักการใดสำคัญที่สุดในการออกนโยบาย AI?",
          options: [
            "ทำกำไรสูงสุด",
            "ความโปร่งใสและเป็นธรรม",
            "ใช้เทคโนโลยีใหม่ล่าสุด",
            "ลดพนักงาน",
          ],
          answer: 1,
        },
        {
          q: "หน่วยงานรัฐควรจัดการข้อมูลประชาชนอย่างไร?",
          options: [
            "ขายให้เอกชน",
            "เปิดเผยทั้งหมด",
            "ปกป้องตามหลัก PDPA",
            "ไม่ต้องจัดการ",
          ],
          answer: 2,
        },
      ]);
    } else if (role === "provider") {
      setQuestions([
        {
          q: "การลดอคติ (Bias) ในโมเดล AI ควรทำเมื่อใด?",
          options: [
            "หลังเปิดใช้งาน",
            "ไม่ต้องทำ",
            "ในทุกขั้นตอนการพัฒนา",
            "เมื่อมีคนฟ้องร้อง",
          ],
          answer: 2,
        },
        {
          q: "ระบบ AI ควรมีความสามารถในการอธิบายผลลัพธ์ (Explainability) หรือไม่?",
          options: [
            "จำเป็นอย่างยิ่ง",
            "ไม่จำเป็น",
            "แค่บางครั้ง",
            "ทำให้ระบบช้าลง",
          ],
          answer: 0,
        },
      ]);
    } else {
      setQuestions([
        {
          q: "เมื่อพบเห็น AI สร้างภาพปลอม (Deepfake) ควรทำอย่างไร?",
          options: [
            "แชร์ต่อ",
            "ตรวจสอบแหล่งที่มาก่อนเชื่อ",
            "บันทึกเก็บไว้",
            "ส่งให้เพื่อนทันที",
          ],
          answer: 1,
        },
        {
          q: "ข้อมูลส่วนบุคคลประเภทใดที่ไม่ควรให้ AI เก็บโดยไม่จำเป็น?",
          options: [
            "สีที่ชอบ",
            "เลขบัตรประชาชน",
            "งานอดิเรก",
            "ประเภทสัตว์เลี้ยง",
          ],
          answer: 1,
        },
      ]);
    }
  }, [role]);

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="ut-container">
          <button className="ut-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> ย้อนกลับ
          </button>

          {!quizStarted && !showResult ? (
            // =======================================
            // หน้า Intro ก่อนเริ่มทำแบบทดสอบ
            // =======================================
            <div className="ut-intro-card fade-in">
              <div className="ut-intro-icon-wrapper">
                <FaClipboardList />
              </div>
              <h2 className="ut-intro-title">รายละเอียดแบบทดสอบ</h2>
              <p className="ut-intro-desc">
                แบบประเมินความรู้และความพร้อมสาย{" "}
                <strong>{role.toUpperCase()}</strong> <br />
                โปรดอ่านคำถามอย่างละเอียดและเลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว
              </p>

              <div className="ut-intro-grid">
                <div className="ut-intro-item">
                  <div className="ut-intro-item-icon bg-blue">
                    <FaListUl />
                  </div>
                  <div className="ut-intro-item-text">
                    <span>จำนวนคำถาม</span>
                    <h4>{questions.length} ข้อ</h4>
                  </div>
                </div>
                <div className="ut-intro-item">
                  <div className="ut-intro-item-icon bg-orange">
                    <FaClock />
                  </div>
                  <div className="ut-intro-item-text">
                    <span>เวลาจำกัด</span>
                    <h4>15 นาที</h4>
                  </div>
                </div>
                <div className="ut-intro-item">
                  <div className="ut-intro-item-icon bg-green">
                    <FaStar />
                  </div>
                  <div className="ut-intro-item-text">
                    <span>คะแนนเต็ม</span>
                    <h4>{questions.length} คะแนน</h4>
                  </div>
                </div>
              </div>

              <div className="ut-intro-footer">
                <button className="ut-btn-start" onClick={handleStartQuiz}>
                  <FaPlay /> เริ่มทำแบบทดสอบ
                </button>
              </div>
            </div>
          ) : showResult ? (
            // =======================================
            // หน้า Result สรุปผลคะแนน
            // =======================================
            <div className="ut-result-card fade-in">
              <FaCheckCircle className="ut-result-icon" />
              <h2>คุณทำแบบทดสอบเสร็จแล้ว!</h2>
              <p>
                คุณได้คะแนน {score} จาก {questions.length} คะแนน
              </p>
              <button
                className="ut-btn-primary mt-4"
                onClick={() => navigate("/user-dashboard")}
              >
                กลับสู่หน้าแดชบอร์ด
              </button>
            </div>
          ) : (
            // =======================================
            // หน้าทำแบบทดสอบ (Quiz)
            // =======================================
            <div className="ut-quiz-card fade-in">
              <div className="ut-quiz-header">
                <h3>แบบประเมินความพร้อมสาย {role.toUpperCase()}</h3>
                <span className="ut-progress">
                  ข้อที่ {currentQuestion + 1} / {questions.length}
                </span>
              </div>

              {questions.length > 0 && (
                <>
                  <div className="ut-question-box">
                    <h4>{questions[currentQuestion].q}</h4>
                  </div>

                  <div className="ut-options-list">
                    {questions[currentQuestion].options.map((opt, index) => (
                      <label
                        key={index}
                        className={`ut-option-item ${selectedAnswer === index ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="quiz"
                          value={index}
                          checked={selectedAnswer === index}
                          onChange={() => setSelectedAnswer(index)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>

                  <div className="ut-quiz-footer">
                    <button
                      className="ut-btn-primary"
                      onClick={handleNext}
                      disabled={selectedAnswer === null}
                    >
                      {currentQuestion + 1 === questions.length
                        ? "ส่งคำตอบ"
                        : "ข้อต่อไป"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTest;
