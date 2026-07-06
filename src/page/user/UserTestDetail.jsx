import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaArrowLeft,
  FaClipboardList,
  FaClock,
  FaListUl,
  FaStar,
  FaPlay,
  FaSpinner,
} from "react-icons/fa";
import api from "../../api/Api";
import "./style/UserTestDetail.css";

const UserTestDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const chapterId = queryParams.get("chapter");

  const [loading, setLoading] = useState(true);
  const [chapterInfo, setChapterInfo] = useState({});
  const [questions, setQuestions] = useState([]);

  const [step, setStep] = useState("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!chapterId) {
      navigate("/user-test");
      return;
    }
    fetchQuestions();
  }, [chapterId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user/test-questions/${chapterId}`);
      if (response.data && response.data.success) {
        setChapterInfo(response.data.data.chapter);
        setQuestions(response.data.data.questions);
      }
    } catch (error) {
      console.error("Fetch Questions Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setStep("quiz");
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
  };

  const handleNext = async () => {
    let currentScore = score;
    // ตรวจคำตอบว่าตรงกับ answer (index ที่ถูกหลังจากสลับช้อยส์) หรือไม่
    if (selectedAnswer === questions[currentQuestion].answer) {
      currentScore += 1;
      setScore(currentScore);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      submitTest(currentScore);
    }
  };

  const submitTest = async (finalScore) => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id || storedUser?.user_id;

      const payload = {
        userId,
        chapterId,
        score: finalScore,
        totalQuestions: questions.length,
        passingPercentage: chapterInfo.passing_percentage,
      };

      const response = await api.post(`/user/test-submit`, payload);
      if (response.data && response.data.success) {
        // นำทางไปหน้าสรุปผล (UserResult) เพื่อโชว์เซอติฟิเคท
        navigate("/user-result", {
          state: {
            resultData: response.data.data,
            chapterInfo: chapterInfo,
          },
        });
      }
    } catch (error) {
      console.error("Submit Test Error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกผลสอบ");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="utd-admin-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="utd-admin-container">
          {step !== "quiz" && (
            <button
              className="utd-back-btn"
              onClick={() => navigate("/user-test")}
            >
              <FaArrowLeft /> ย้อนกลับหน้ารายการ
            </button>
          )}

          {step === "intro" && (
            <div className="utd-card fade-in center-content">
              <div className="utd-icon-box bg-blue-light text-blue">
                <FaClipboardList />
              </div>
              <h2 className="utd-title">แบบทดสอบ: {chapterInfo.title}</h2>
              <p className="utd-desc">
                โปรดอ่านคำถามอย่างละเอียดและเลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว
                เมื่อส่งคำตอบระบบจะบันทึกคะแนนที่ดีที่สุดของคุณโดยอัตโนมัติ
              </p>

              <div className="utd-stats-grid">
                <div className="utd-stat-item">
                  <div className="stat-icon bg-blue-light text-blue">
                    <FaListUl />
                  </div>
                  <div className="stat-text">
                    <span>จำนวนคำถาม</span>
                    <h4>{questions.length} ข้อ</h4>
                  </div>
                </div>
                <div className="utd-stat-item">
                  <div className="stat-icon bg-orange-light text-orange">
                    <FaClock />
                  </div>
                  <div className="stat-text">
                    <span>เกณฑ์การผ่าน</span>
                    <h4>{chapterInfo.passing_percentage}%</h4>
                  </div>
                </div>
                <div className="utd-stat-item">
                  <div className="stat-icon bg-green-light text-green">
                    <FaStar />
                  </div>
                  <div className="stat-text">
                    <span>คะแนนเต็ม</span>
                    <h4>{questions.length} คะแนน</h4>
                  </div>
                </div>
              </div>

              <button
                className="utd-btn-primary large"
                onClick={handleStartQuiz}
                disabled={questions.length === 0}
              >
                <FaPlay /> เริ่มทำแบบทดสอบ
              </button>
            </div>
          )}

          {step === "quiz" && questions.length > 0 && (
            <div className="utd-card fade-in">
              <div className="utd-quiz-header">
                <h3>{chapterInfo.title}</h3>
                <span className="utd-progress-badge">
                  ข้อที่ {currentQuestion + 1} / {questions.length}
                </span>
              </div>

              <div className="utd-question-box">
                <h4>{questions[currentQuestion].q}</h4>
              </div>

              <div className="utd-options-list">
                {questions[currentQuestion].options.map((opt, index) => (
                  <label
                    key={index}
                    className={`utd-option-item ${selectedAnswer === index ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="quizOption"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => setSelectedAnswer(index)}
                    />
                    <span className="opt-text">{opt}</span>
                  </label>
                ))}
              </div>

              <div className="utd-quiz-footer">
                <button
                  className="utd-btn-primary"
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion + 1 === questions.length
                    ? "ส่งคำตอบและบันทึกคะแนน"
                    : "ข้อต่อไป"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTestDetail;
