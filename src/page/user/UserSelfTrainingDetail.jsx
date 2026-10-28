import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import { FaPlayCircle, FaArrowLeft, FaSpinner, FaAlignLeft } from "react-icons/fa";
import api from "../../api/Api";
import "./style/UserSelfTrainingDetail.css";

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const UserSelfTrainingDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const videoId = queryParams.get("video");

  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState({ title: "กำลังโหลดข้อมูล...", youtubeUrl: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (videoId) {
      fetchVideoDetail(videoId);
    } else {
      navigate("/user-self-training");
    }
  }, [videoId, navigate]);

  const fetchVideoDetail = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/user/self-training/${id}`);
      if (response.data && response.data.success) {
        setVideo(response.data.data);
      } else {
        setVideo({ title: "ไม่พบข้อมูลวิดีโอ", youtubeUrl: "" });
      }
    } catch (error) {
      console.error("Fetch Self Training Video Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const ytId = getYouTubeId(video.youtubeUrl);

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="usd-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="usd-container">
          <div className="usd-header">
            <button className="usd-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> กลับหน้ารายการวิดีโอ
            </button>
            <h1 className="usd-title">{video.title}</h1>
          </div>

          <div className="usd-video-card">
            <div className="usd-video-wrapper">
              {ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="usd-iframe"
                ></iframe>
              ) : (
                <div className="usd-video-empty">
                  <FaPlayCircle className="empty-icon" />
                  <p>ไม่มีวิดีโอสำหรับรายการนี้ หรือลิงก์ไม่ถูกต้อง</p>
                </div>
              )}
            </div>
          </div>

          <div className="usd-details-card">
            <div className="usd-card-header">
              <h3>
                <FaAlignLeft className="text-red" /> รายละเอียดวิดีโอ
              </h3>
            </div>
            <div className="usd-card-body">
              {video.description ? (
                <p className="usd-desc-text">{video.description}</p>
              ) : (
                <p className="usd-desc-text usd-desc-empty">
                  ไม่มีรายละเอียดเพิ่มเติมสำหรับวิดีโอนี้
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelfTrainingDetail;
