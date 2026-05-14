import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import { FaPlayCircle, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import "./style/UserClassroomDetail.css";

const UserClassroomDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "user";
  const lessonId = queryParams.get("lesson");

  const [courseData, setCourseData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    // ข้อมูลจำลองสำหรับเพลย์ลิสต์
    setCourseData({
      title: `สื่อการเรียนรู้สายงาน: ${role.toUpperCase()}`,
      desc: "ดูวิดีโอให้จบเพื่อปลดล็อกแบบทดสอบประจำบทเรียน",
      modules: [
        {
          id: 1,
          title: "แนะนำเบื้องต้นและวัตถุประสงค์",
          duration: "15 นาที",
          completed: true,
        },
        {
          id: 2,
          title: "เนื้อหาหลักประจำบทเรียน",
          duration: "25 นาที",
          completed: false,
        },
        {
          id: 3,
          title: "สรุปและกรณีศึกษา",
          duration: "20 นาที",
          completed: false,
        },
      ],
    });
  }, [role, lessonId]);

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="ucd-container">
          <button
            className="ucd-back-btn"
            onClick={() => navigate(`/user-classroom?role=${role}`)}
          >
            <FaArrowLeft /> กลับหน้ารายการตัวชี้วัด
          </button>

          <div className="ucd-header">
            <h1 className="ucd-title">{courseData.title}</h1>
            <p className="ucd-subtitle">{courseData.desc}</p>
          </div>

          <div className="ucd-content-layout">
            {/* ส่วนวิดีโอหลัก */}
            <div className="ucd-video-section">
              <div className="ucd-video-player">
                {/* ใส่รูปปกหลอก หรือ iframe วิดีโอ */}
                <div className="ucd-video-placeholder">
                  <FaPlayCircle className="ucd-play-icon" />
                  <p>กำลังเล่นวิดีโอรหัส: {lessonId}</p>
                </div>
              </div>
              <h2 className="ucd-current-module-title">
                เนื้อหาหลักประจำบทเรียน
              </h2>
              <p className="ucd-current-module-desc">
                ทำความเข้าใจภาพรวมและวัตถุประสงค์ของบทเรียนในหมวดหมู่นี้
              </p>
            </div>

            {/* ส่วนรายการวิดีโอย่อย (Playlist) */}
            <div className="ucd-playlist-section">
              <h3 className="ucd-playlist-title">วิดีโอในบทเรียนนี้</h3>
              <ul className="ucd-modules-list">
                {courseData.modules?.map((mod) => (
                  <li
                    key={mod.id}
                    className={`ucd-module-item ${mod.completed ? "completed" : ""}`}
                  >
                    <div className="ucd-module-status">
                      {mod.completed ? (
                        <FaCheckCircle className="text-green" />
                      ) : (
                        <FaPlayCircle className="text-gray" />
                      )}
                    </div>
                    <div className="ucd-module-info">
                      <h4>{mod.title}</h4>
                      <span>{mod.duration}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserClassroomDetail;
