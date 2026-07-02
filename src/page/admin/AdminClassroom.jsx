import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/AdminClassroom.css";
import {
  FaSearch,
  FaPlus,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaPlayCircle,
  FaFileAlt,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import Swal from "sweetalert2";
import api from "../../api/Api";

const AdminClassroom = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);

      // ยิง API ไปที่หลังบ้าน (แก้ path ให้ตรงกับที่คุณตั้งไว้ใน Backend)
      const response = await api.get("/admin/classroom");

      if (response.data && response.data.success) {
        setChapters(response.data.data.chapters);
      } else {
        setError("ไม่สามารถโหลดข้อมูลคลาสรูมได้");
      }
    } catch (err) {
      console.error("Fetch Chapters Error:", err);
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
    fetchChapters();
  }, []);

  // 1. แก้ไขฟังก์ชัน handleDelete
  const handleDelete = (rawId, title) => {
    Swal.fire({
      title: "ยืนยันการลบบทเรียน?",
      text: `คุณต้องการลบ "${title}" ใช่หรือไม่? (วิดีโอและข้อสอบในบทนี้จะถูกลบทั้งหมด)`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ยืนยันลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ยิง API สั่งลบข้อมูล
          const response = await api.delete(`/admin/classroom/delete/${rawId}`);

          if (response.data && response.data.success) {
            // ถ้ายิงผ่าน ให้ลบข้อมูลออกจากหน้าจอ (กรอง rawId ออกไป)
            setChapters(chapters.filter((ch) => ch.rawId !== rawId));

            Swal.fire({
              title: "ลบข้อมูลสำเร็จ",
              text: "บทเรียนถูกนำออกจากระบบแล้ว",
              icon: "success",
              confirmButtonColor: "#10b981",
            });
          }
        } catch (error) {
          console.error("Delete Chapter Error:", error);
          Swal.fire({
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

  const filteredChapters = chapters.filter(
    (ch) =>
      ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.targetRole.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-classroom-layout">
      <SidebarAdmin />

      <div className="admin-classroom-main-content">
        <div className="admin-classroom-content-inner">
          <div className="admin-classroom-top-section">
            <div className="admin-classroom-header-text">
              <h1>จัดการระบบคลาสรูม</h1>
              <p>
                เพิ่ม แก้ไข ลบบทเรียน (1 บทเรียนประกอบด้วยวิดีโอและแบบทดสอบ)
                สำหรับผู้ใช้งานในระบบ
              </p>
            </div>

            <div className="admin-classroom-action-bar">
              <div className="admin-classroom-search-pill">
                <FaSearch className="admin-classroom-search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหารหัส, ชื่อบทเรียน, บทบาท..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                className="admin-classroom-btn-dark"
                onClick={() => navigate("/admin-classroom/add")}
              >
                <FaPlus /> เพิ่มบทเรียนใหม่
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-classroom-state-container">
              <FaSpinner className="admin-classroom-spin" />
              <p>กำลังโหลดข้อมูลบทเรียน...</p>
            </div>
          ) : error ? (
            <div className="admin-classroom-state-container admin-classroom-error">
              <p>{error}</p>
              <button
                onClick={fetchChapters}
                className="admin-classroom-btn-retry"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            <div className="admin-classroom-list-section">
              <div className="admin-classroom-list-header">
                <h2>รายการบทเรียนทั้งหมด</h2>
                <span className="admin-classroom-list-count">
                  {filteredChapters.length} บทเรียน
                </span>
              </div>

              <div className="admin-classroom-table-responsive">
                <table className="admin-classroom-card-table">
                  <thead>
                    <tr>
                      <th>รหัสบทเรียน</th>
                      <th>ชื่อบทเรียน</th>
                      <th>ส่วนประกอบ</th>
                      <th>สำหรับผู้ใช้</th>
                      <th>สถานะ</th>
                      <th className="admin-classroom-text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChapters.map((ch, index) => (
                      <tr key={index} className="admin-classroom-table-row">
                        <td className="admin-classroom-col-id">{ch.id}</td>
                        <td className="admin-classroom-col-name">{ch.title}</td>
                        <td>
                          {/* นำ Badge ทั้งสองมาแสดงรวมกันในคอลัมน์เดียว */}
                          <div className="admin-classroom-components-group">
                            <span className="admin-classroom-type-badge type-video">
                              <FaPlayCircle /> วิดีโอ
                            </span>
                            <span className="admin-classroom-type-badge type-quiz">
                              <FaFileAlt /> ข้อสอบ
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="admin-classroom-role-text">
                            {ch.targetRole}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`admin-classroom-badge admin-classroom-status-${ch.status.toLowerCase()}`}
                          >
                            <span className="admin-classroom-badge-dot"></span>
                            {ch.status === "Active"
                              ? "เปิดใช้งาน"
                              : "ปิดใช้งาน"}
                          </span>
                        </td>
                        <td>
                          {/* แก้ไขปุ่ม Action ทั้งสองปุ่ม ให้ส่ง ch.rawId ไปแทน ch.id */}
                          <div className="admin-classroom-action-buttons">
                            <button
                              className="admin-classroom-btn-action-icon admin-classroom-edit"
                              title="แก้ไขบทเรียน"
                              onClick={() =>
                                navigate(`/admin-classroom/edit/${ch.rawId}`)
                              }
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="admin-classroom-btn-action-icon admin-classroom-delete"
                              title="ลบบทเรียน"
                              onClick={() => handleDelete(ch.rawId, ch.title)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredChapters.length === 0 && (
                      <tr>
                        <td colSpan="6" className="admin-classroom-empty-state">
                          ไม่พบข้อมูลบทเรียนในระบบ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClassroom;
