import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaPlayCircle,
  FaCheckCircle,
  FaArrowLeft,
  FaClipboardList,
} from "react-icons/fa";
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

    // 1. กำหนด YouTube Video ID ตาม Role
    let youtubeVideoId = "";
    if (role === "regulator") {
      // ใส่ Video ID ของ YouTube สำหรับ Regulator
      youtubeVideoId = "mqLhEpib-Yg";
    } else if (role === "provider") {
      youtubeVideoId = "mqLhEpib-Yg"; // ตัวอย่าง ID สำหรับ Provider
    } else {
      youtubeVideoId = "mqLhEpib-Yg"; // ตัวอย่าง ID สำหรับ User ทั่วไป
    }

    // 2. เซ็ตข้อมูลจำลองสำหรับเพลย์ลิสต์
    setCourseData({
      title: `สื่อการเรียนรู้สายงาน: ${role.toUpperCase()}`,
      desc: "ดูวิดีโอให้จบเพื่อปลดล็อกแบบทดสอบประจำบทเรียน",
      videoId: youtubeVideoId,
      modules: [
        {
          id: 1,
          title: "เนื้อหาหลักประจำบทเรียน",
          duration: "25 นาที",
          completed: true,
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
              <div
                className="ucd-video-player"
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "16px",
                  background: "#000",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                {courseData.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${courseData.videoId}?rel=0&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  ></iframe>
                ) : (
                  <div className="ucd-video-placeholder">
                    <FaPlayCircle className="ucd-play-icon" />
                    <p>กำลังเล่นวิดีโอรหัส: {lessonId}</p>
                  </div>
                )}
              </div>

              <div className="ucd-current-module-info">
                <div>
                  <h2 className="ucd-current-module-title">
                    เนื้อหาหลักประจำบทเรียน
                  </h2>
                  <p className="ucd-current-module-desc">
                    ทำความเข้าใจภาพรวมและวัตถุประสงค์ของบทเรียนในหมวดหมู่นี้
                    เมื่อเรียนจบแล้วสามารถกดทำแบบทดสอบเพื่อเก็บคะแนนได้ทันที
                  </p>
                </div>
              </div>
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

              {/* ส่วนท้ายของ Playlist สำหรับปุ่มทำแบบทดสอบ */}
              <div className="ucd-playlist-footer">
                <button
                  className="ucd-btn-take-test"
                  onClick={() =>
                    navigate(`/user-test?role=${role}&lesson=${lessonId}`)
                  }
                >
                  <FaClipboardList size={18} /> ทำแบบทดสอบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserClassroomDetail;
