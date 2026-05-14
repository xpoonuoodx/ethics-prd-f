import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaArrowLeft,
  FaPlay,
  FaClipboardList,
  FaChartBar,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import "./style/UserClassroom.css";

const UserClassroom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "user";

  const [courseData, setCourseData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    // กำหนดเนื้อหาแบบจำลองตาม Role โดยแบ่งตาม "ตัวชี้วัด"
    if (role === "regulator") {
      setCourseData({
        title: "หลักสูตรสำหรับผู้วางนโยบาย (Regulator)",
        desc: "เรียนรู้แนวทางการกำกับดูแลและการสร้างนโยบาย AI ที่สอดคล้องกับหลักจริยธรรมระดับชาติ",
        indicators: [
          {
            id: "ind-1",
            title: "ตัวชี้วัดที่ 1: ความโปร่งใสและตรวจสอบได้",
            lessons: [
              {
                id: 101,
                title: "พื้นฐานนโยบาย AI และการกำกับดูแล",
                status: "completed",
                score: "9/10",
              },
              {
                id: 102,
                title: "กฎหมายและข้อบังคับที่เกี่ยวข้อง (PDPA & AI Act)",
                status: "pending",
                score: null,
              },
              {
                id: 102,
                title: "กฎหมายและข้อบังคับที่เกี่ยวข้อง (PDPA & AI Act)",
                status: "pending",
                score: null,
              },
              {
                id: 102,
                title: "กฎหมายและข้อบังคับที่เกี่ยวข้อง (PDPA & AI Act)",
                status: "pending",
                score: null,
              },
              {
                id: 102,
                title: "กฎหมายและข้อบังคับที่เกี่ยวข้อง (PDPA & AI Act)",
                status: "pending",
                score: null,
              },
              
            ],
          },
          {
            id: "ind-2",
            title: "ตัวชี้วัดที่ 2: ความเป็นธรรมและลดความลำเอียง",
            lessons: [
              {
                id: 103,
                title: "กรณีศึกษา: การบังคับใช้นโยบายระดับสากล",
                status: "locked",
                score: null,
              },
            ],
          },
        ],
      });
    } else if (role === "provider") {
      setCourseData({
        title: "หลักสูตรสำหรับนักพัฒนา (Provider)",
        desc: "เรียนรู้การออกแบบและพัฒนาโมเดล AI ที่มีความโปร่งใส อธิบายได้ และลดความลำเอียง",
        indicators: [
          {
            id: "ind-1",
            title: "ตัวชี้วัดที่ 1: การออกแบบ AI อย่างรับผิดชอบ",
            lessons: [
              {
                id: 201,
                title: "จริยธรรมสำหรับนักพัฒนา AI เบื้องต้น",
                status: "completed",
                score: "10/10",
              },
              {
                id: 202,
                title: "การตรวจสอบและลดความลำเอียงในชุดข้อมูล",
                status: "pending",
                score: null,
              },
            ],
          },
          {
            id: "ind-2",
            title: "ตัวชี้วัดที่ 2: ความปลอดภัยและความมั่นคง",
            lessons: [
              {
                id: 203,
                title: "การป้องกัน Model Extraction และ Data Poisoning",
                status: "locked",
                score: null,
              },
            ],
          },
        ],
      });
    } else {
      setCourseData({
        title: "หลักสูตรสำหรับผู้ใช้งานทั่วไป (User)",
        desc: "สร้างความตระหนักรู้และเข้าใจผลกระทบของการใช้งาน AI ในชีวิตประจำวัน",
        indicators: [
          {
            id: "ind-1",
            title: "ตัวชี้วัดที่ 1: การรู้เท่าทันเทคโนโลยี AI",
            lessons: [
              {
                id: 301,
                title: "ทำความรู้จัก AI และผลกระทบในชีวิตประจำวัน",
                status: "completed",
                score: "8/10",
              },
              {
                id: 302,
                title: "การใช้งาน AI สร้างเนื้อหา (Generative AI) อย่างปลอดภัย",
                status: "pending",
                score: null,
              },
            ],
          },
          {
            id: "ind-2",
            title: "ตัวชี้วัดที่ 2: การปกป้องข้อมูลส่วนบุคคล",
            lessons: [
              {
                id: 303,
                title: "การให้ข้อมูลส่วนตัวกับระบบ AI และความเสี่ยง",
                status: "locked",
                score: null,
              },
            ],
          },
        ],
      });
    }
  }, [role]);

  // ฟังก์ชันนำทางไปหน้าเรียนวิดีโอ
  const handleStartLearn = (lessonId) => {
    navigate(`/user-classroom-detail?role=${role}&lesson=${lessonId}`);
  };

  // ฟังก์ชันนำทางไปหน้าทำแบบทดสอบ (ส่งไป UserTest)
  const handleStartTest = (lessonId) => {
    navigate(`/user-test?role=${role}&lesson=${lessonId}`);
  };

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

          <div className="ucl-indicators-list">
            {courseData.indicators?.map((indicator) => (
              <div key={indicator.id} className="ucl-indicator-card">
                <h2 className="ucl-indicator-title">{indicator.title}</h2>

                <div className="ucl-lessons-wrapper">
                  {indicator.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`ucl-lesson-row ${lesson.status}`}
                    >
                      <div className="ucl-lesson-info">
                        <div className="ucl-lesson-icon">
                          {lesson.status === "completed" && (
                            <FaCheckCircle className="text-green" />
                          )}
                          {lesson.status === "pending" && (
                            <FaPlay className="text-blue" />
                          )}
                          {lesson.status === "locked" && (
                            <FaLock className="text-gray" />
                          )}
                        </div>
                        <h3 className="ucl-lesson-name">{lesson.title}</h3>
                      </div>

                      <div className="ucl-lesson-actions">
                        <button
                          className="ucl-btn-action learn"
                          disabled={lesson.status === "locked"}
                          onClick={() => handleStartLearn(lesson.id)}
                        >
                          <FaPlay /> เริ่มเรียน
                        </button>

                        <button
                          className="ucl-btn-action test"
                          disabled={lesson.status === "locked"}
                          onClick={() => handleStartTest(lesson.id)}
                        >
                          <FaClipboardList /> ทำแบบทดสอบ
                        </button>

                        <button
                          className="ucl-btn-action score"
                          disabled={!lesson.score}
                        >
                          <FaChartBar />{" "}
                          {lesson.score
                            ? `ผลคะแนน ${lesson.score}`
                            : "ยังไม่มีคะแนน"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserClassroom;
