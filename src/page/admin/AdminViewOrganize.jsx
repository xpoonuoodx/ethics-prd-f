import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/AdminViewOrganize.css";
import {
  FaArrowLeft,
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaProjectDiagram,
  FaSpinner,
  FaUserShield,
  FaUser,
  FaFileAlt, // เพิ่มไอคอนสำหรับโปรเจค
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import api from "../../api/Api";

const AdminViewOrganize = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState(null);
  const [orgUsers, setOrgUsers] = useState([]);
  const [orgProjects, setOrgProjects] = useState([]); // 1. เพิ่ม State สำหรับโครงการ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrganizationDetails();
  }, [id]);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/admin/view-organize/${id}`);

      if (response.data && response.data.success) {
        setOrganization(response.data.data.organization);
        // ใส่ || [] ดักไว้ เผื่อ Backend ส่งมาเป็น undefined หรือ null
        setOrgUsers(response.data.data.users || []);
        setOrgProjects(response.data.data.projects || []);
      } else {
        setError("ไม่พบข้อมูลหน่วยงานนี้ในระบบ");
      }
    } catch (err) {
      console.error("Fetch Organize Detail Error:", err);
      if (err.response && err.response.status === 404) {
        setError("ไม่พบข้อมูลหน่วยงานนี้ในระบบ");
      } else {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล โปรดลองใหม่อีกครั้ง");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return {
          label: "ผู้ดูแลระบบ",
          icon: <FaUserShield />,
          className: "admin",
        };
      case "regulator":
        return {
          label: "ผู้กำกับดูแล",
          icon: <FaUserTie />,
          className: "regulator",
        };
      default:
        return {
          label: "ผู้ใช้งานทั่วไป",
          icon: <FaUser />,
          className: "user",
        };
    }
  };

  return (
    <div className="admin-view-org-layout">
      <SidebarAdmin />

      <div className="admin-view-org-main-content">
        <div className="admin-view-org-content-inner">
          <div className="admin-view-org-top-section">
            <button
              className="admin-view-org-back-btn"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft /> ย้อนกลับ
            </button>
            <div className="admin-view-org-header-text">
              <h1>รายละเอียดหน่วยงาน</h1>
              <p>ข้อมูลภาพรวม โครงการ และบุคลากรภายในหน่วยงาน</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-view-org-state-container">
              <FaSpinner className="admin-view-org-spin" />
              <p>กำลังโหลดข้อมูลหน่วยงาน...</p>
            </div>
          ) : error ? (
            <div className="admin-view-org-state-container admin-view-org-error">
              <p>{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="admin-view-org-btn-retry"
              >
                ย้อนกลับไปหน้าจัดการหน่วยงาน
              </button>
            </div>
          ) : (
            organization && (
              <>
                {/* Cards ข้อมูลภาพรวม */}
                <div className="admin-view-org-summary-grid">
                  <div className="admin-view-org-card main-info">
                    <div className="admin-view-org-card-icon-wrapper building-icon">
                      <FaBuilding />
                    </div>
                    <div className="admin-view-org-card-details">
                      <span className="admin-view-org-label">
                        รหัสหน่วยงาน: {organization.id}
                      </span>
                      <h2 className="admin-view-org-title">
                        {organization.name}
                      </h2>
                      <span
                        className={`admin-view-org-status-badge ${organization.status === "Active" ? "active" : "inactive"}`}
                      >
                        {organization.status === "Active"
                          ? "กำลังเปิดใช้งาน"
                          : "ระงับการใช้งาน"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-view-org-card">
                    <div className="admin-view-org-card-icon-wrapper user-tie-icon">
                      <FaUserTie />
                    </div>
                    <div className="admin-view-org-card-details">
                      <span className="admin-view-org-label">
                        ผู้กำกับดูแลหน่วยงาน
                      </span>
                      <h2 className="admin-view-org-title">
                        {organization.regulatorName || "ยังไม่มีผู้ดูแล"}
                      </h2>
                    </div>
                  </div>

                  <div className="admin-view-org-card">
                    <div className="admin-view-org-card-icon-wrapper project-icon">
                      <FaProjectDiagram />
                    </div>
                    <div className="admin-view-org-card-details">
                      <span className="admin-view-org-label">
                        โครงการทั้งหมด
                      </span>
                      <h2 className="admin-view-org-title highlight">
                        {organization.totalProjects || 0} <small>โครงการ</small>
                      </h2>
                    </div>
                  </div>

                  <div className="admin-view-org-card">
                    <div className="admin-view-org-card-icon-wrapper group-icon">
                      <FaUsers />
                    </div>
                    <div className="admin-view-org-card-details">
                      <span className="admin-view-org-label">
                        ผู้ใช้งานในระบบ
                      </span>
                      <h2 className="admin-view-org-title highlight">
                        {organization.totalUsers || 0} <small>บัญชี</small>
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Table: บุคลากร */}
                <div
                  className="admin-view-org-list-section"
                  style={{ marginBottom: "30px" }}
                >
                  <div className="admin-view-org-list-header">
                    {/* แก้ไขการนับจำนวนบุคลากรให้ปลอดภัย */}
                    <h2>บุคลากรในสังกัด ({(orgUsers || []).length})</h2>
                  </div>
                  <div className="admin-view-org-table-responsive">
                    <table className="admin-view-org-table">
                      <thead>
                        <tr>
                          <th>ชื่อ-นามสกุล</th>
                          <th>อีเมลติดต่อ</th>
                          <th>รหัสผู้ใช้ (Username)</th>
                          <th>สิทธิ์การใช้งาน (Role)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* แก้ไขการ loop ให้ปลอดภัย */}
                        {(orgUsers || []).map((user, index) => {
                          const roleData = getRoleBadge(user.role);
                          return (
                            <tr key={index}>
                              <td>
                                <div className="admin-view-org-user-profile">
                                  <div className="admin-view-org-avatar">
                                    {user.name ? user.name.charAt(0) : "U"}
                                  </div>
                                  <span className="admin-view-org-user-name">
                                    {user.name || "ไม่มีชื่อ"}
                                  </span>
                                </div>
                              </td>
                              <td className="admin-view-org-col-username">
                                {user.email || "-"}
                              </td>
                              <td className="admin-view-org-col-username">
                                {user.username}
                              </td>
                              <td>
                                <span
                                  className={`admin-view-org-role-badge ${roleData.className}`}
                                >
                                  {roleData.icon} {roleData.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}

                        {/* เพิ่มการแสดงผลกรณีไม่มีบุคลากร */}
                        {(orgUsers || []).length === 0 && (
                          <tr>
                            <td
                              colSpan="4"
                              className="admin-view-org-empty-state"
                            >
                              ยังไม่มีบุคลากรในหน่วยงานนี้
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. ตารางโครงการ (ส่วนใหม่ที่เพิ่ม) */}
                <div className="admin-view-org-list-section">
                  <div className="admin-view-org-list-header">
                    {/* แก้ไขการนับจำนวนโครงการให้ปลอดภัย */}
                    <h2>โครงการในหน่วยงาน ({(orgProjects || []).length})</h2>
                  </div>
                  <div className="admin-view-org-table-responsive">
                    <table className="admin-view-org-table">
                      <thead>
                        <tr>
                          <th>ชื่อโครงการ</th>
                          <th>สถานะ</th>
                          <th>วันที่สร้าง</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* แก้ไขการ loop ให้ปลอดภัย */}
                        {(orgProjects || []).map((proj) => (
                          <tr key={proj.id}>
                            <td>
                              <div className="admin-view-org-user-profile">
                                <FaFileAlt style={{ color: "#94a3b8" }} />
                                <span className="admin-view-org-user-name">
                                  {proj.project_name}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`admin-view-org-role-badge ${proj.status === "Active" ? "regulator" : "user"}`}
                              >
                                {proj.status}
                              </span>
                            </td>
                            <td className="admin-view-org-col-username">
                              {new Date(proj.created_at).toLocaleDateString(
                                "th-TH",
                              )}
                            </td>
                          </tr>
                        ))}

                        {/* แก้ไขการเช็คไม่มีข้อมูลให้ปลอดภัย */}
                        {(orgProjects || []).length === 0 && (
                          <tr>
                            <td
                              colSpan="3"
                              className="admin-view-org-empty-state"
                            >
                              ไม่มีโครงการในหน่วยงานนี้
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminViewOrganize;
