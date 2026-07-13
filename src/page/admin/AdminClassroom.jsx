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
  FaChalkboardTeacher,
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

      // ยิง API ไปที่หลังบ้าน
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

  const handleDelete = (rawId, title) => {
    Swal.fire({
      title: "ยืนยันการลบบทเรียน?",
      text: `คุณต้องการลบ "${title}" ใช่หรือไม่? (วิดีโอและข้อสอบในบทนี้จะถูกลบทั้งหมด)`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // เปลี่ยนให้เข้าตีม
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ยืนยันลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ยิง API สั่งลบข้อมูล
          const response = await api.delete(`/admin/classroom/delete/${rawId}`);

          if (response.data && response.data.success) {
            // ถ้ายิงผ่าน ให้ลบข้อมูลออกจากหน้าจอ
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
    <div className="acl-layout">
      <SidebarAdmin />

      <div className="acl-main-content">
        <div className="acl-container">
          <div className="acl-header">
            <div className="acl-header-title-wrap">
              <div className="acl-header-icon">
                <FaChalkboardTeacher />
              </div>
              <div>
                <h1 className="acl-title">จัดการระบบคลาสรูม</h1>
                <p className="acl-subtitle">
                  เพิ่ม แก้ไข ลบบทเรียน (วิดีโอและแบบทดสอบ)
                  สำหรับผู้ใช้งานในระบบ
                </p>
              </div>
            </div>
            <button
              className="acl-btn-primary"
              onClick={() => navigate("/admin-classroom/add")}
            >
              <FaPlus /> เพิ่มบทเรียนใหม่
            </button>
          </div>

          <div className="acl-toolbar">
            <div className="acl-search-box">
              <FaSearch className="acl-search-icon" />
              <input
                type="text"
                placeholder="ค้นหารหัส, ชื่อบทเรียน หรือบทบาทผู้ใช้..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* สามารถใส่ตัวกรอง Dropdown อื่นๆ เพิ่มตรงนี้ได้ในอนาคต */}
          </div>

          <div className="acl-table-wrapper">
            {loading ? (
              <div className="acl-state-container">
                <FaSpinner className="acl-spin" />
                <p>กำลังโหลดข้อมูลบทเรียน...</p>
              </div>
            ) : error ? (
              <div className="acl-state-container">
                <p className="acl-error-text">{error}</p>
                <button onClick={fetchChapters} className="acl-btn-retry">
                  ลองใหม่อีกครั้ง
                </button>
              </div>
            ) : (
              <table className="acl-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>รหัสบทเรียน</th>
                    <th style={{ width: "30%" }}>ชื่อบทเรียน</th>
                    <th style={{ width: "15%" }}>ส่วนประกอบ</th>
                    <th style={{ width: "15%" }}>สำหรับผู้ใช้</th>
                    <th style={{ width: "15%" }}>สถานะ</th>
                    <th className="acl-text-center" style={{ width: "10%" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChapters.map((ch, index) => (
                    <tr key={index}>
                      <td className="acl-font-bold acl-text-muted">{ch.id}</td>
                      <td className="acl-font-medium">{ch.title}</td>
                      <td>
                        <div className="acl-components-group">
                          <span className="acl-badge acl-badge-video">
                            <FaPlayCircle /> วิดีโอ
                          </span>
                          <span className="acl-badge acl-badge-quiz">
                            <FaFileAlt /> ข้อสอบ
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="acl-role-badge">{ch.targetRole}</span>
                      </td>
                      <td>
                        <span
                          className={`acl-status-tag ${
                            ch.status === "Active" ? "active" : "inactive"
                          }`}
                        >
                          <span className="acl-status-dot"></span>
                          {ch.status === "Active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </span>
                      </td>
                      <td>
                        <div className="acl-actions">
                          <button
                            className="acl-btn-action edit"
                            title="แก้ไขบทเรียน"
                            onClick={() =>
                              navigate(`/admin-classroom/edit/${ch.rawId}`)
                            }
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="acl-btn-action delete"
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
                      <td colSpan="6" className="acl-empty-state">
                        ไม่พบข้อมูลบทเรียนในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClassroom;
