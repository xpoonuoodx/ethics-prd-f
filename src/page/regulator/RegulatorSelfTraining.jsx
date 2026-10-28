import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarRegulator from "./SidebarRegulator";
import { FaArrowLeft, FaSpinner, FaYoutube, FaPlayCircle } from "react-icons/fa";
import api from "../../api/Api";
import "./style/RegulatorSelfTraining.css";

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
  );
  return match ? match[1] : null;
};

const RegulatorSelfTraining = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/regulator/self-training");
      if (response.data && response.data.success) {
        setVideos(response.data.data.videos || []);
      }
    } catch (error) {
      console.error("Fetch Self Training Videos Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVideo = (id) => {
    navigate(`/regulator-self-training-detail?video=${id}`);
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarRegulator />
        <div className="user-portal-content flex-center">
          <FaSpinner className="rst-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarRegulator />
      <div className="user-portal-content">
        <div className="rst-container">
          <div className="rst-header">
            <button
              className="rst-back-btn"
              onClick={() => navigate("/regulator-dashboard")}
            >
              <FaArrowLeft /> กลับสู่แดชบอร์ด
            </button>
            <h1 className="rst-title">
              <span className="rst-title-icon">
                <FaYoutube />
              </span>
              อบรมออนไลน์ด้วยตัวเอง
            </h1>
            <p className="rst-subtitle">
              เรียนรู้เพิ่มเติมได้ทุกที่ทุกเวลาผ่านวิดีโอที่ระบบเตรียมไว้ให้
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="rst-empty-state">
              ขณะนี้ยังไม่มีวิดีโออบรมออนไลน์ในระบบ
            </div>
          ) : (
            <div className="rst-grid">
              {videos.map((v) => {
                const ytId = getYouTubeId(v.youtubeUrl);
                return (
                  <div
                    key={v.id}
                    className="rst-card"
                    onClick={() => handleOpenVideo(v.id)}
                  >
                    <div className="rst-thumb-wrapper">
                      {ytId ? (
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                          alt={v.title}
                          className="rst-thumb"
                        />
                      ) : (
                        <div className="rst-thumb rst-thumb-empty">
                          <FaPlayCircle />
                        </div>
                      )}
                      <div className="rst-play-overlay">
                        <FaPlayCircle />
                      </div>
                    </div>
                    <div className="rst-card-body">
                      <h3 className="rst-card-title">{v.title}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegulatorSelfTraining;
