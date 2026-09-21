import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaArrowLeft,
  FaPlay,
  FaCheckCircle,
  FaSpinner,
  FaBookOpen,
} from "react-icons/fa";
import api, { getStoredUser } from "../../api/Api";
import "./style/RegulatorClassroom.css";

const RegulatorClassroom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // เรียนได้ทุกหลักสูตรไม่ว่าจะเป็น user_type ไหน (การทำข้อสอบยังจำกัดตาม user_type
  // เดิมอยู่ที่หน้า "แบบทดสอบ" ใน sidebar) เก็บเป็น array ของหลักสูตร ไม่ใช่หลักสูตรเดียวแบบเดิม
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchClassroomData();
  }, []);

  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(location.search);
    const targetCourse = params.get("course");
    if (targetCourse) {
      const el = document.getElementById(`ucl-course-${targetCourse}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, location.search]);

  const fetchClassroomData = async () => {
    try {
      setLoading(true);
      const storedUser = getStoredUser();
      const userId = storedUser?.id || storedUser?.user_id;

      if (!userId) {
        console.warn("ไม่พบ User ID");
        setLoading(false);
        return;
      }

      const response = await api.get(`/regulator/classroom/${userId}`);
      if (response.data && response.data.success) {
        setCourses(response.data.data.courses || []);
      }
    } catch (error) {
      console.error("Fetch Classroom Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearn = (chapterId) => {
    navigate(`/regulator-classroom-detail?lesson=${chapterId}`);
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarRegulator />
        <div className="user-portal-content flex-center">
          <FaSpinner className="ucl-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarRegulator />

      <div className="user-portal-content">
        <div className="ucl-admin-container">
          <div className="ucl-header">
            <button
              className="ucl-back-btn"
              onClick={() => navigate("/regulator-dashboard")}
            >
              <FaArrowLeft /> กลับสู่แดชบอร์ด
            </button>
            <h1 className="ucl-title">สื่อการเรียนรู้ทั้งหมด</h1>
            <p className="ucl-subtitle">
              เรียนได้ทุกหลักสูตรไม่ว่าคุณจะเป็นผู้ใช้งานกลุ่มไหน
              ส่วนการทำแบบทดสอบและรับใบประกาศนียบัตรไปที่เมนู "แบบทดสอบ"
            </p>
          </div>

          <div className="ucl-courses-wrapper">
            {courses.map((course) => (
              <div
                key={course.targetGroup}
                id={`ucl-course-${course.targetGroup}`}
                className="ucl-card"
              >
                <div className="ucl-card-header">
                  <h3>
                    <FaBookOpen className="text-blue" /> {course.courseTitle}
                  </h3>
                  <p className="ucl-course-desc">{course.courseDesc}</p>
                </div>

                <div className="ucl-card-body">
                  <div className="ucl-lessons-wrapper">
                    {course.chapters.length > 0 ? (
                      course.chapters.map((lesson, index) => {
                        const isCompleted = lesson.isPassed;
                        return (
                          <div
                            key={lesson.chapterId}
                            className="ucl-lesson-row"
                          >
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
                                onClick={() =>
                                  handleStartLearn(lesson.chapterId)
                                }
                              >
                                <FaPlay />{" "}
                                {isCompleted ? "ทบทวนบทเรียน" : "เริ่มเรียน"}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="ucl-empty-state">
                        ขณะนี้ยังไม่มีสื่อการเรียนรู้สำหรับหลักสูตรนี้
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorClassroom;
