import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaArrowLeft,
  FaPlay,
  FaCheckCircle,
  FaSpinner,
  FaBookOpen,
} from "react-icons/fa";
import api, { getStoredUser } from "../../api/Api";
import "./style/UserClassroom.css";

// สีประจำแต่ละหลักสูตรตามกลุ่ม (target_group) ใช้สีชุดเดียวกับที่การ์ดในหน้า Dashboard
// ใช้อยู่แล้ว เพื่อให้เห็นแล้วรู้ทันทีว่าเป็นหลักสูตรเดียวกัน ไม่ว่าจะดูจากหน้าไหน
const COURSE_ACCENTS = {
  1: { color: "#3b82f6", soft: "#dbeafe" },
  2: { color: "#8b5cf6", soft: "#ede9fe" },
  3: { color: "#10b981", soft: "#d1fae5" },
};

const UserClassroom = () => {
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
    // ถ้ามาจากปุ่ม "เข้าสู่ห้องเรียน" ของหลักสูตรใดหลักสูตรหนึ่งบนหน้า dashboard
    // ให้เลื่อนไปยังหัวข้อหลักสูตรนั้นให้อัตโนมัติ (?course=1|2|3)
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

      const response = await api.get(`/user/classroom/${userId}`);
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
    navigate(`/user-classroom-detail?lesson=${chapterId}`);
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
            <h1 className="ucl-title">
              <span className="ucl-title-icon">
                <FaBookOpen />
              </span>
              สื่อการเรียนรู้ทั้งหมด
            </h1>
            <p className="ucl-subtitle">
              เรียนได้ทุกหลักสูตรไม่ว่าคุณจะเป็นผู้ใช้งานกลุ่มไหน
              ส่วนการทำแบบทดสอบและรับใบประกาศนียบัตรไปที่เมนู "แบบทดสอบ"
            </p>
          </div>

          <div className="ucl-courses-wrapper">
            {courses.map((course) => {
              const accent =
                COURSE_ACCENTS[course.targetGroup] || COURSE_ACCENTS[3];
              return (
                <div
                  key={course.targetGroup}
                  id={`ucl-course-${course.targetGroup}`}
                  className="ucl-card"
                  style={{
                    "--course-color": accent.color,
                    "--course-color-soft": accent.soft,
                  }}
                >
                  <div className="ucl-card-header">
                    <h3>
                      <span className="ucl-card-icon-badge">
                        <FaBookOpen />
                      </span>
                      {course.courseTitle}
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
                                  className={`ucl-lesson-icon-box ${isCompleted ? "completed" : ""}`}
                                >
                                  {isCompleted ? (
                                    <FaCheckCircle />
                                  ) : (
                                    <FaPlay />
                                  )}
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserClassroom;
