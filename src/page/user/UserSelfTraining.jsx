import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaArrowLeft,
  FaSpinner,
  FaYoutube,
  FaPlayCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import api from "../../api/Api";
import "./style/UserSelfTraining.css";

// ดึง YouTube video id จากลิงก์หลายรูปแบบ - ใช้ดึงรูป thumbnail มาแสดงเป็นการ์ด
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
  );
  return match ? match[1] : null;
};

const UserSelfTraining = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/self-training");
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
    navigate(`/user-self-training-detail?video=${id}`);
  };

  const totalPages = Math.max(1, Math.ceil(videos.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedVideos = videos.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="ust-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="ust-container">
          <div className="ust-header">
            <button
              className="ust-back-btn"
              onClick={() => navigate("/user-dashboard")}
            >
              <FaArrowLeft /> กลับสู่แดชบอร์ด
            </button>
            <h1 className="ust-title">
              <span className="ust-title-icon">
                <FaYoutube />
              </span>
              อบรมออนไลน์ด้วยตัวเอง
            </h1>
            <p className="ust-subtitle">
              เรียนรู้เพิ่มเติมได้ทุกที่ทุกเวลาผ่านวิดีโอที่ระบบเตรียมไว้ให้
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="ust-empty-state">
              ขณะนี้ยังไม่มีวิดีโออบรมออนไลน์ในระบบ
            </div>
          ) : (
            <div className="ust-list">
              {paginatedVideos.map((v) => {
                const ytId = getYouTubeId(v.youtubeUrl);
                return (
                  <div
                    key={v.id}
                    className="ust-row"
                    onClick={() => handleOpenVideo(v.id)}
                  >
                    <div className="ust-row-thumb-wrapper">
                      {ytId ? (
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                          alt={v.title}
                          className="ust-row-thumb"
                        />
                      ) : (
                        <div className="ust-row-thumb ust-thumb-empty">
                          <FaPlayCircle />
                        </div>
                      )}
                      <div className="ust-play-overlay">
                        <FaPlayCircle />
                      </div>
                    </div>
                    <div className="ust-row-body">
                      <h3 className="ust-row-title">{v.title}</h3>
                      {v.description && (
                        <p className="ust-row-desc">{v.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="ust-pagination">
              <button
                className="ust-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
              >
                <FaChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - safeCurrentPage) <= 1,
                )
                .reduce((acc, page, i, arr) => {
                  if (i > 0 && page - arr[i - 1] > 1) acc.push("...");
                  acc.push(page);
                  return acc;
                }, [])
                .map((page, i) =>
                  page === "..." ? (
                    <span key={`ellipsis-${i}`} className="ust-page-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      className={`ust-page-btn ${
                        page === safeCurrentPage ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ),
                )}

              <button
                className="ust-page-btn"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safeCurrentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSelfTraining;
