import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarRegulator from "./SidebarRegulator";
import { FaPlayCircle, FaArrowLeft, FaSpinner, FaAlignLeft } from "react-icons/fa";
import api from "../../api/Api";
import "./style/RegulatorSelfTrainingDetail.css";

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const RegulatorSelfTrainingDetail = () => {
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
      navigate("/regulator-self-training");
    }
  }, [videoId, navigate]);

  const fetchVideoDetail = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/regulator/self-training/${id}`);
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
        <SidebarRegulator />
        <div className="user-portal-content flex-center">
          <FaSpinner className="rsd-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarRegulator />
      <div className="user-portal-content">
        <div className="rsd-container">
          <div className="rsd-header">
            <button className="rsd-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> กลับหน้ารายการวิดีโอ
            </button>
            <h1 className="rsd-title">{video.title}</h1>
          </div>

          <div className="rsd-video-card">
            <div className="rsd-video-wrapper">
              {ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rsd-iframe"
                ></iframe>
              ) : (
                <div className="rsd-video-empty">
                  <FaPlayCircle className="empty-icon" />
                  <p>ไม่มีวิดีโอสำหรับรายการนี้ หรือลิงก์ไม่ถูกต้อง</p>
                </div>
              )}
            </div>
          </div>

          <div className="rsd-details-card">
            <div className="rsd-card-header">
              <h3>
                <FaAlignLeft className="text-red" /> รายละเอียดวิดีโอ
              </h3>
            </div>
            <div className="rsd-card-body">
              {video.description ? (
                <p className="rsd-desc-text">{video.description}</p>
              ) : (
                <p className="rsd-desc-text rsd-desc-empty">
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

export default RegulatorSelfTrainingDetail;
