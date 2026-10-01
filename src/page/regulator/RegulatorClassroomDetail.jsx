import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaPlayCircle,
  FaArrowLeft,
  FaClipboardList,
  FaSpinner,
  FaBookOpen,
  FaCheck,
} from "react-icons/fa";
import DOMPurify from "dompurify";
import api from "../../api/Api";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import "./style/RegulatorClassroomDetail.css";

const RegulatorClassroomDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fire } = useThemedAlert();
  const queryParams = new URLSearchParams(location.search);
  const lessonId = queryParams.get("lesson");

  const [loading, setLoading] = useState(true);
  const [chapterData, setChapterData] = useState({
    title: "กำลังโหลดข้อมูล...",
    video_url: "",
    canTakeTest: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lessonId) {
      fetchChapterDetail(lessonId);
    } else {
      navigate("/regulator-classroom");
    }
  }, [lessonId, navigate]);

  const fetchChapterDetail = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/regulator/chapter/${id}`);
      if (response.data && response.data.success) {
        setChapterData(response.data.data);
      } else {
        setChapterData({
          title: "ไม่พบข้อมูลบทเรียน",
          video_url: "",
        });
      }
    } catch (error) {
      console.error("Fetch Chapter Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeID(chapterData.video_url);

  // เดิมกดปุ่มนี้แล้วพาไปหน้ารายการแบบทดสอบทั้งหมด ต้องมาหาเองอีกทีว่าอันไหนตรงกับบทที่เพิ่งดู
  // ตอนนี้เด้ง popup ยืนยันก่อน แล้วพาตรงไปหน้าแบบทดสอบของบทเรียนนี้เลย (รหัสบทเรียนกับรหัสที่ใช้
  // ดึงคำถามแบบทดสอบ คือ id เดียวกัน ไม่ต้องเลือกเองอีกต่อไป)
  const handleStartTest = () => {
    fire({
      icon: "warning",
      title: "ยืนยันการทำแบบทดสอบ",
      text: "คุณแน่ใจหรือไม่ว่าต้องการเริ่มทำแบบทดสอบของบทเรียนนี้",
      showCancelButton: true,
      confirmButtonText: "เริ่มทำแบบทดสอบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3f6b21",
      cancelButtonColor: "#94a3b8",
    }).then((result) => {
      if (result.isConfirmed) {
        // push ปกติ (เหตุผลเดียวกับ UserClassroomDetail.jsx) - ปุ่มย้อนกลับในหน้าแบบทดสอบ
        // ใช้ navigate(-1) ซึ่งรองรับทั้งทางเข้าผ่านหน้าวิดีโอและทางลัดจากหน้ารายการได้ถูกต้อง
        navigate(`/regulator-test-detail?chapter=${lessonId}`);
      }
    });
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarRegulator />
        <div className="user-portal-content flex-center">
          <FaSpinner className="ucd-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarRegulator />
      <div className="user-portal-content">
        <div className="ucd-admin-container">
          <div className="ucd-header">
            <button className="ucd-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> กลับหน้ารายการสื่อการเรียนรู้
            </button>
            <h1 className="ucd-title">{chapterData.title}</h1>
            <p className="ucd-subtitle">
              ศึกษาเนื้อหาในวิดีโอให้ครบถ้วน เพื่อเตรียมพร้อมสำหรับการทดสอบ
            </p>
          </div>

          <div className="ucd-split-layout">
            {/* ซ้าย: วิดีโอและรายละเอียด */}
            <div className="ucd-main-col">
              <div className="ucd-video-card">
                <div className="ucd-video-wrapper">
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="ucd-iframe"
                    ></iframe>
                  ) : (
                    <div className="ucd-video-empty">
                      <FaPlayCircle className="empty-icon" />
                      <p>ไม่มีวิดีโอสำหรับบทเรียนนี้ หรือลิงก์ไม่ถูกต้อง</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="ucd-details-card mt-20">
                <div className="ucd-card-header">
                  <h3>
                    <FaBookOpen className="text-blue" /> รายละเอียดบทเรียน
                  </h3>
                </div>
                <div className="ucd-card-body">
                  {chapterData.description ? (
                    // description มาจาก WYSIWYG editor ฝั่งแอดมิน (Quill) เก็บเป็น HTML
                    // ต้อง sanitize ด้วย DOMPurify ก่อนเสมอ กัน stored XSS ก่อน render จริง
                    <div
                      className="ucd-desc-text ucd-markdown"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(chapterData.description),
                      }}
                    />
                  ) : (
                    <p className="ucd-desc-text">
                      ไม่มีรายละเอียดเพิ่มเติมสำหรับบทเรียนนี้
                      (กรุณาศึกษาเนื้อหาจากวิดีโอด้านบนเป็นหลัก)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ขวา: ขั้นตอนและแบบทดสอบ */}
            <div className="ucd-side-col">
              <div className="ucd-steps-card">
                <div className="ucd-card-header">
                  <h3>ขั้นตอนการเรียนรู้</h3>
                </div>
                <div className="ucd-card-body">
                  <ul className="ucd-stepper">
                    <li className="step-item active">
                      <div className="step-circle">
                        <FaPlayCircle />
                      </div>
                      <div className="step-text">
                        <h4>ขั้นที่ 1: สื่อการเรียนรู้</h4>
                        <p>รับชมวิดีโอและทำความเข้าใจ</p>
                      </div>
                    </li>
                    {chapterData.canTakeTest && (
                      <li className="step-item">
                        <div className="step-circle">
                          <FaClipboardList />
                        </div>
                        <div className="step-text">
                          <h4>ขั้นที่ 2: แบบทดสอบ</h4>
                          <p>ทดสอบความรู้เก็บคะแนน</p>
                        </div>
                      </li>
                    )}
                  </ul>

                  {chapterData.canTakeTest ? (
                    <>
                      <div className="ucd-alert-box">
                        เมื่อศึกษาเนื้อหาเสร็จสิ้น
                        ให้คลิกปุ่มด้านล่างเพื่อทำการทดสอบ
                      </div>

                      <button
                        className="ucd-btn-success"
                        onClick={handleStartTest}
                      >
                        <FaClipboardList size={16} /> เข้าสู่แบบทดสอบ
                      </button>
                    </>
                  ) : (
                    <div className="ucd-alert-box">
                      บทเรียนนี้เป็นของหลักสูตรอื่น ดูวิดีโอเพื่อเรียนรู้ได้
                      แต่ทำแบบทดสอบได้เฉพาะหลักสูตรของกลุ่มผู้ใช้งานของคุณเท่านั้น
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorClassroomDetail;
