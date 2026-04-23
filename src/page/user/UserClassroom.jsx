import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import { FaPlayCircle, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import "./style/UserClassroom.css";

const UserClassroom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "user";

  const [courseData, setCourseData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    // กำหนดเนื้อหาแบบจำลองตาม Role
    if (role === "regulator") {
      setCourseData({
        title: "หลักสูตรสำหรับผู้วางนโยบาย (Regulator)",
        desc: "เรียนรู้แนวทางการกำกับดูแลและการสร้างนโยบาย AI ที่สอดคล้องกับหลักจริยธรรมระดับชาติ",
        modules: [
          {
            id: 1,
            title: "พื้นฐานนโยบาย AI และการกำกับดูแล",
            duration: "15 นาที",
            completed: true,
          },
          {
            id: 2,
            title: "กฎหมายและข้อบังคับที่เกี่ยวข้อง (PDPA & AI Act)",
            duration: "25 นาที",
            completed: false,
          },
          {
            id: 3,
            title: "กรณีศึกษา: การบังคับใช้นโยบายระดับสากล",
            duration: "20 นาที",
            completed: false,
          },
        ],
      });
    } else if (role === "provider") {
      setCourseData({
        title: "หลักสูตรสำหรับนักพัฒนา (Provider)",
        desc: "เรียนรู้การออกแบบและพัฒนาโมเดล AI ที่มีความโปร่งใส อธิบายได้ และลดความลำเอียง",
        modules: [
          {
            id: 1,
            title: "การออกแบบ AI อย่างรับผิดชอบ (Responsible AI)",
            duration: "20 นาที",
            completed: true,
          },
          {
            id: 2,
            title: "การตรวจสอบและลดความลำเอียงในชุดข้อมูล (Bias Mitigation)",
            duration: "30 นาที",
            completed: true,
          },
          {
            id: 3,
            title: "ความปลอดภัยและความมั่นคงของระบบ AI",
            duration: "25 นาที",
            completed: false,
          },
        ],
      });
    } else {
      setCourseData({
        title: "หลักสูตรสำหรับผู้ใช้งานทั่วไป (User)",
        desc: "สร้างความตระหนักรู้และเข้าใจผลกระทบของการใช้งาน AI ในชีวิตประจำวัน",
        modules: [
          {
            id: 1,
            title: "ทำความรู้จัก AI และผลกระทบในชีวิตประจำวัน",
            duration: "10 นาที",
            completed: false,
          },
          {
            id: 2,
            title: "รู้เท่าทัน AI และการปกป้องข้อมูลส่วนบุคคล",
            duration: "15 นาที",
            completed: false,
          },
          {
            id: 3,
            title:
              "จริยธรรมการใช้งาน AI เครื่องมือสร้างเนื้อหา (Generative AI)",
            duration: "20 นาที",
            completed: false,
          },
        ],
      });
    }
  }, [role]);

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="ucl-container">
          <button
            className="ucl-back-btn"
            onClick={() => navigate("/user-select-role?type=learn")}
          >
            <FaArrowLeft /> เปลี่ยนสายงาน
          </button>

          <div className="ucl-header">
            <h1 className="ucl-title">{courseData.title}</h1>
            <p className="ucl-subtitle">{courseData.desc}</p>
          </div>

          <div className="ucl-content-layout">
            {/* ส่วนวิดีโอหลัก */}
            <div className="ucl-video-section">
              <div className="ucl-video-player">
                {/* ใส่รูปปกหลอก หรือ iframe วิดีโอ */}
                <div className="ucl-video-placeholder">
                  <FaPlayCircle className="ucl-play-icon" />
                  <p>กดเพื่อเล่นวิดีโอบทเรียน</p>
                </div>
              </div>
              <h2 className="ucl-current-module-title">
                บทเรียนที่ 1: แนะนำเบื้องต้น
              </h2>
              <p className="ucl-current-module-desc">
                ทำความเข้าใจภาพรวมและวัตถุประสงค์ของบทเรียนในหมวดหมู่นี้
              </p>
            </div>

            {/* ส่วนรายการบทเรียน */}
            <div className="ucl-playlist-section">
              <h3 className="ucl-playlist-title">เนื้อหาในหลักสูตร</h3>
              <ul className="ucl-modules-list">
                {courseData.modules?.map((mod) => (
                  <li
                    key={mod.id}
                    className={`ucl-module-item ${mod.completed ? "completed" : ""}`}
                  >
                    <div className="ucl-module-status">
                      {mod.completed ? (
                        <FaCheckCircle className="text-green" />
                      ) : (
                        <FaPlayCircle className="text-gray" />
                      )}
                    </div>
                    <div className="ucl-module-info">
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

export default UserClassroom;
