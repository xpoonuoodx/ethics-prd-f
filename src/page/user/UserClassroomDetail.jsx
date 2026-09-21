import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaPlayCircle,
  FaArrowLeft,
  FaClipboardList,
  FaSpinner,
  FaBookOpen,
  FaCheck,
} from "react-icons/fa";
import api from "../../api/Api";
import "./style/UserClassroomDetail.css";

const UserClassroomDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      navigate("/user-classroom");
    }
  }, [lessonId, navigate]);

  const fetchChapterDetail = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/user/chapter/${id}`);
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

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="ucd-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />
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
                  <p className="ucd-desc-text">
                    ไม่มีรายละเอียดเพิ่มเติมสำหรับบทเรียนนี้
                    (กรุณาศึกษาเนื้อหาจากวิดีโอด้านบนเป็นหลัก)
                  </p>
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
                        onClick={() =>
                          navigate(`/user-test?lesson=${lessonId}`)
                        }
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

export default UserClassroomDetail;
