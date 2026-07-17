import React, { useState, useEffect } from "react";
import "./style/RegulatorOrganizeManage.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaBuilding,
  FaUsers,
  FaUserShield,
  FaProjectDiagram,
  FaCertificate,
  FaEdit,
  FaSpinner,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/Api";
import Swal from "sweetalert2";

const RegulatorOrganizeManage = () => {
  const navigate = useNavigate();

  const [orgData, setOrgData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRegulators: 0,
    totalMembers: 0,
    totalProjects: 0,
    totalCertificates: 0,
  });
  const [regulators, setRegulators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOrgName, setEditOrgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrganizationInfo();
  }, []);

  const fetchOrganizationInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/regulator/organization-info");

      if (response.data && response.data.success) {
        setOrgData(response.data.data.organization);
        setStats(response.data.data.stats);
        setRegulators(response.data.data.regulators || []);
      } else {
        setError("ไม่พบข้อมูลหน่วยงานของคุณ");
      }
    } catch (err) {
      console.error("Fetch Organization Info Error:", err);
      setError(
        err.response?.data?.message ||
          "เกิดข้อผิดพลาดในการโหลดข้อมูลหน่วยงาน",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditOrgName(orgData.org_name);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editOrgName.trim()) {
      Swal.fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อหน่วยงาน",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.put("/regulator/organization-info", {
        org_name: editOrgName.trim(),
      });

      if (response.data && response.data.success) {
        setOrgData((prev) => ({ ...prev, org_name: editOrgName.trim() }));
        setIsEditModalOpen(false);
        Swal.fire({
          title: "สำเร็จ",
          text: "แก้ไขชื่อหน่วยงานเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    } catch (err) {
      console.error("Edit Organization Info Error:", err);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถแก้ไขชื่อหน่วยงานได้",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rom-layout">
      <SidebarRegulator />

      <div className="rom-main-content">
        <div className="rom-container">
          <div className="rom-top-section">
            <div className="rom-header-text">
              <h1>ข้อมูลหน่วยงาน</h1>
              <p>ข้อมูลภาพรวมของหน่วยงานที่คุณสังกัด และผู้กำกับดูแลในหน่วยงาน</p>
            </div>
          </div>

          {loading ? (
            <div className="rom-state-container">
              <FaSpinner className="rom-spin" />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="rom-state-container rom-error">
              <p>{error}</p>
              <button
                onClick={fetchOrganizationInfo}
                className="rom-btn-retry"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            orgData && (
              <>
                {/* โปรไฟล์หน่วยงาน */}
                <div className="rom-profile-card">
                  <div className="rom-profile-icon">
                    <FaBuilding />
                  </div>
                  <div className="rom-profile-details">
                    <span className="rom-org-code">
                      รหัสหน่วยงาน: {orgData.org_code}
                    </span>
                    <h2 className="rom-org-name">
                      {orgData.org_name}
                      <button
                        className="rom-edit-btn"
                        onClick={handleOpenEditModal}
                        title="แก้ไขชื่อหน่วยงาน"
                      >
                        <FaEdit />
                      </button>
                    </h2>
                    <div className="rom-profile-meta">
                      <span
                        className={`rom-status-badge ${
                          orgData.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        <span className="rom-status-dot"></span>
                        {orgData.status === "Active"
                          ? "ใช้งานปกติ"
                          : "ระงับการใช้งาน"}
                      </span>
                      <span className="rom-joined-date">
                        เข้าร่วมระบบเมื่อ{" "}
                        {new Date(orgData.created_at).toLocaleDateString(
                          "th-TH",
                        )}
                      </span>
                    </div>
                    <span className="rom-status-hint">
                      * การระงับ/เปิดใช้งานหน่วยงานเป็นสิทธิ์ของผู้ดูแลระบบ
                      (Admin) เท่านั้น
                    </span>
                  </div>
                </div>

                {/* สถิติภาพรวม */}
                <div className="rom-stats-grid">
                  <div className="rom-stat-card accent-blue">
                    <div className="rom-stat-icon blue-icon">
                      <FaUsers />
                    </div>
                    <div className="rom-stat-details">
                      <span className="rom-stat-label">ผู้ใช้งานทั้งหมด</span>
                      <span className="rom-stat-value">
                        {stats.totalUsers}
                      </span>
                    </div>
                  </div>

                  <div className="rom-stat-card accent-teal">
                    <div className="rom-stat-icon teal-icon">
                      <FaUserShield />
                    </div>
                    <div className="rom-stat-details">
                      <span className="rom-stat-label">ผู้กำกับดูแล</span>
                      <span className="rom-stat-value">
                        {stats.totalRegulators}
                      </span>
                    </div>
                  </div>

                  <div className="rom-stat-card accent-purple">
                    <div className="rom-stat-icon purple-icon">
                      <FaProjectDiagram />
                    </div>
                    <div className="rom-stat-details">
                      <span className="rom-stat-label">โครงการทั้งหมด</span>
                      <span className="rom-stat-value">
                        {stats.totalProjects}
                      </span>
                    </div>
                  </div>

                  <div className="rom-stat-card accent-orange">
                    <div className="rom-stat-icon orange-icon">
                      <FaCertificate />
                    </div>
                    <div className="rom-stat-details">
                      <span className="rom-stat-label">
                        ใบประกาศนียบัตรที่ออกแล้ว
                      </span>
                      <span className="rom-stat-value">
                        {stats.totalCertificates}
                      </span>
                    </div>
                  </div>
                </div>

                {/* รายชื่อผู้กำกับดูแลหน่วยงาน */}
                <div className="rom-list-section">
                  <div className="rom-list-header">
                    <h2>ผู้กำกับดูแลหน่วยงาน (Regulator)</h2>
                    <span className="rom-list-count">
                      {regulators.length} คน
                    </span>
                  </div>

                  <div className="rom-table-responsive">
                    <table className="rom-card-table">
                      <thead>
                        <tr>
                          <th>ชื่อ-นามสกุล</th>
                          <th>อีเมลติดต่อ</th>
                          <th>รหัสผู้ใช้ (Username)</th>
                          <th>เข้าร่วมเมื่อ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regulators.map((r) => (
                          <tr key={r.id}>
                            <td>
                              <div className="rom-user-profile">
                                <div className="rom-avatar">
                                  {r.name ? r.name.charAt(0) : "U"}
                                </div>
                                <span className="rom-user-name">
                                  {r.name || "ไม่มีชื่อ"}
                                </span>
                              </div>
                            </td>
                            <td className="rom-text-muted">
                              {r.email || "-"}
                            </td>
                            <td className="rom-text-muted">
                              @{r.username}
                            </td>
                            <td className="rom-text-muted">
                              {new Date(r.created_at).toLocaleDateString(
                                "th-TH",
                              )}
                            </td>
                          </tr>
                        ))}

                        {regulators.length === 0 && (
                          <tr>
                            <td colSpan="4" className="rom-empty-state">
                              ยังไม่มีผู้กำกับดูแลในหน่วยงานนี้
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ทางลัดไปหน้าจัดการที่เกี่ยวข้อง */}
                <div className="rom-quicklinks">
                  <button
                    className="rom-quicklink-card"
                    onClick={() => navigate("/regulator-user-manage")}
                  >
                    <div className="rom-quicklink-icon">
                      <FaUsers />
                    </div>
                    <div className="rom-quicklink-text">
                      <strong>จัดการผู้ใช้งาน</strong>
                      <span>ดู แก้ไข เพิ่ม-ลบบัญชีผู้ใช้ในหน่วยงาน</span>
                    </div>
                    <FaArrowRight className="rom-quicklink-arrow" />
                  </button>

                  <button
                    className="rom-quicklink-card"
                    onClick={() => navigate("/regulator-project-manage")}
                  >
                    <div className="rom-quicklink-icon">
                      <FaProjectDiagram />
                    </div>
                    <div className="rom-quicklink-text">
                      <strong>จัดการโครงการ</strong>
                      <span>ดู แก้ไข เพิ่ม-ลบโครงการในหน่วยงาน</span>
                    </div>
                    <FaArrowRight className="rom-quicklink-arrow" />
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* Modal แก้ไขชื่อหน่วยงาน */}
      {isEditModalOpen && (
        <div className="rom-modal-overlay">
          <div className="rom-modal-container">
            <div className="rom-modal-header">
              <h2>แก้ไขชื่อหน่วยงาน</h2>
              <button
                className="rom-modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="rom-modal-body">
              <div className="rom-form-group">
                <label>ชื่อหน่วยงาน</label>
                <input
                  type="text"
                  value={editOrgName}
                  onChange={(e) => setEditOrgName(e.target.value)}
                  required
                />
              </div>
              <div className="rom-modal-footer">
                <button
                  type="button"
                  className="rom-btn-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rom-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatorOrganizeManage;
