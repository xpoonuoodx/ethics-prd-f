import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/AdminSelfTraining.css";
import {
  FaSearch,
  FaPlus,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaYoutube,
  FaPlayCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import api from "../../api/Api";

// ดึง YouTube video id จากลิงก์หลายรูปแบบ (youtu.be, watch?v=, embed/ ฯลฯ) - ใช้ regex
// ชุดเดียวกับที่ AdminAddChapter.jsx ใช้สำหรับพรีวิววิดีโอ
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/,
  );
  return match ? match[1] : null;
};

const AdminSelfTraining = () => {
  const { fire } = useThemedAlert();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/admin/self-training");

      if (response.data && response.data.success) {
        setVideos(response.data.data.videos);
      } else {
        setError("ไม่สามารถโหลดข้อมูลวิดีโอได้");
      }
    } catch (err) {
      console.error("Fetch Self Training Videos Error:", err);
      setError(
        err.response?.data?.message ||
          "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVideos();
  }, []);

  const handleDelete = (id, title) => {
    fire({
      title: "ยืนยันการลบวิดีโอ?",
      text: `คุณต้องการลบ "${title}" ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ยืนยันลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/admin/self-training/delete/${id}`);

          if (response.data && response.data.success) {
            setVideos(videos.filter((v) => v.id !== id));

            fire({
              title: "ลบข้อมูลสำเร็จ",
              text: "วิดีโอถูกนำออกจากระบบแล้ว",
              icon: "success",
              confirmButtonColor: "#10b981",
            });
          }
        } catch (error) {
          console.error("Delete Self Training Video Error:", error);
          fire({
            title: "เกิดข้อผิดพลาด",
            text:
              error.response?.data?.message ||
              "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    });
  };

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // กลับไปหน้า 1 เสมอเมื่อค้นหาเปลี่ยน กันโชว์หน้าว่างเปล่าค้างอยู่
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVideos.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedVideos = filteredVideos.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="ast-layout">
      <SidebarAdmin />

      <div className="ast-main-content">
        <div className="ast-container">
          <div className="ast-header">
            <div className="ast-header-title-wrap">
              <div className="ast-header-icon">
                <FaYoutube />
              </div>
              <div>
                <h1 className="ast-title">จัดการการอบรมออนไลน์ด้วยตัวเอง</h1>
                <p className="ast-subtitle">
                  เพิ่ม แก้ไข ลบวิดีโอ YouTube สำหรับให้ผู้ใช้งานเรียนรู้ด้วยตัวเอง
                </p>
              </div>
            </div>
            <button
              className="ast-btn-primary"
              onClick={() => navigate("/admin-self-training/add")}
            >
              <FaPlus /> เพิ่มวิดีโอ
            </button>
          </div>

          <div className="ast-toolbar">
            <div className="ast-search-box">
              <FaSearch className="ast-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อวิดีโอ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="ast-table-wrapper">
            {loading ? (
              <div className="ast-state-container">
                <FaSpinner className="ast-spin" />
                <p>กำลังโหลดข้อมูลวิดีโอ...</p>
              </div>
            ) : error ? (
              <div className="ast-state-container">
                <p className="ast-error-text">{error}</p>
                <button onClick={fetchVideos} className="ast-btn-retry">
                  ลองใหม่อีกครั้ง
                </button>
              </div>
            ) : (
              <table className="ast-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>วิดีโอ</th>
                    <th style={{ width: "40%" }}>ชื่อวิดีโอ</th>
                    <th style={{ width: "20%" }}>วันที่เพิ่ม</th>
                    <th className="ast-text-center" style={{ width: "20%" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVideos.map((v) => {
                    const ytId = getYouTubeId(v.youtubeUrl);
                    return (
                      <tr key={v.id}>
                        <td>
                          <div className="ast-thumb-wrap">
                            {ytId ? (
                              <img
                                src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                                alt={v.title}
                                className="ast-thumb"
                              />
                            ) : (
                              <div className="ast-thumb ast-thumb-empty">
                                <FaPlayCircle />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="ast-font-medium">{v.title}</td>
                        <td className="ast-text-muted">
                          {new Date(v.createdAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td>
                          <div className="ast-actions">
                            <button
                              className="ast-btn-action edit"
                              title="แก้ไขวิดีโอ"
                              onClick={() =>
                                navigate(`/admin-self-training/edit/${v.id}`)
                              }
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="ast-btn-action delete"
                              title="ลบวิดีโอ"
                              onClick={() => handleDelete(v.id, v.title)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredVideos.length === 0 && (
                    <tr>
                      <td colSpan="4" className="ast-empty-state">
                        ยังไม่มีวิดีโออบรมออนไลน์ในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {!loading && !error && totalPages > 1 && (
              <div className="ast-pagination">
                <button
                  className="ast-page-btn"
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
                      <span key={`ellipsis-${i}`} className="ast-page-ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`ast-page-btn ${
                          page === safeCurrentPage ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}

                <button
                  className="ast-page-btn"
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
    </div>
  );
};

export default AdminSelfTraining;
