import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaArrowLeft,
  FaPlay,
  FaClipboardList,
  FaChartBar,
  FaCheckCircle,
  FaSpinner,
  FaBookOpen,
} from "react-icons/fa";
import api from "../../api/Api";
import "./style/UserClassroom.css";

const UserClassroom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [courseData, setCourseData] = useState({
    courseTitle: "กำลังโหลดข้อมูล...",
    courseDesc: "",
    chapters: [],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchClassroomData();
  }, []);

  const fetchClassroomData = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id || storedUser?.user_id;

      if (!userId) {
        console.warn("ไม่พบ User ID");
        setLoading(false);
        return;
      }

      const response = await api.get(`/user/classroom/${userId}`);
      if (response.data && response.data.success) {
        setCourseData(response.data.data);
      }
    } catch (error) {
      console.error("Fetch Classroom Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearn = (chapterId) => {
    navigate(`/user-classroom-detail?lesson=${chapterId}`);
  };

  const handleStartTest = (chapterId) => {
    navigate(`/user-test?lesson=${chapterId}`);
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="ucl-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />

      <div className="user-portal-content">
        <div className="ucl-admin-container">
          <div className="ucl-header">
            <button
              className="ucl-back-btn"
              onClick={() => navigate("/user-dashboard")}
            >
              <FaArrowLeft /> กลับสู่แดชบอร์ด
            </button>
            <h1 className="ucl-title">{courseData.courseTitle}</h1>
            <p className="ucl-subtitle">{courseData.courseDesc}</p>
          </div>

          <div className="ucl-card">
            <div className="ucl-card-header">
              <h3>
                <FaBookOpen className="text-blue" />{" "}
                รายวิชาและสื่อการเรียนรู้ทั้งหมด
              </h3>
            </div>

            <div className="ucl-card-body">
              <div className="ucl-lessons-wrapper">
                {courseData.chapters.length > 0 ? (
                  courseData.chapters.map((lesson, index) => {
                    const isCompleted = lesson.isPassed;
                    return (
                      <div key={lesson.chapterId} className="ucl-lesson-row">
                        <div className="ucl-lesson-info">
                          <div
                            className={`ucl-lesson-icon-box ${isCompleted ? "bg-green-light text-green" : "bg-blue-light text-blue"}`}
                          >
                            {isCompleted ? <FaCheckCircle /> : <FaPlay />}
                          </div>
                          <div className="ucl-lesson-details">
                            <span className="ucl-lesson-index">
                              บทที่ {index + 1}
                            </span>
                            <h3 className="ucl-lesson-name">
                              {lesson.chapterTitle}
                            </h3>
                          </div>
                        </div>

                        <div className="ucl-lesson-actions">
                          <button
                            className="ucl-btn-primary"
                            onClick={() => handleStartLearn(lesson.chapterId)}
                          >
                            <FaPlay />{" "}
                            {isCompleted ? "ทบทวนบทเรียน" : "เริ่มเรียน"}
                          </button>

                          <button
                            className="ucl-btn-success"
                            onClick={() => handleStartTest(lesson.chapterId)}
                          >
                            <FaClipboardList /> ทำแบบทดสอบ
                          </button>

                          <button
                            className="ucl-btn-outline"
                            disabled={lesson.userScore === null}
                          >
                            <FaChartBar />{" "}
                            {lesson.userScore !== null
                              ? `คะแนน: ${lesson.userScore}/${lesson.totalQuestions}`
                              : "ยังไม่มีคะแนน"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="ucl-empty-state">
                    ขณะนี้ยังไม่มีสื่อการเรียนรู้สำหรับกลุ่มของคุณ
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserClassroom;
