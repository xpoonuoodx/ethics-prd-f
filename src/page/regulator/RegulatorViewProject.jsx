import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style/RegulatorViewProject.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaArrowLeft,
  FaProjectDiagram,
  FaUsers,
  FaSpinner,
  FaUserTie,
} from "react-icons/fa";
import api from "../../api/Api";

const RegulatorViewProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/regulator/view-project/${id}`);

      if (response.data && response.data.success) {
        setProjectData(response.data.data.project);
        setMembers(response.data.data.members || []);
      } else {
        setError("ไม่พบข้อมูลโครงการนี้");
      }
    } catch (err) {
      console.error("Fetch Project Detail Error:", err);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูลโครงการ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rvp-layout">
      <SidebarRegulator />

      <div className="rvp-main-content">
        <div className="rvp-container">
          <div className="rvp-top-section">
            <button className="rvp-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> ย้อนกลับ
            </button>
            <div className="rvp-header-text">
              <h1>รายละเอียดโครงการ</h1>
              <p>ข้อมูลภาพรวมและรายชื่อบุคลากรที่รับผิดชอบ</p>
            </div>
          </div>

          {loading ? (
            <div className="rvp-state-container">
              <FaSpinner className="rvp-spin" />
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : error ? (
            <div className="rvp-state-container rvp-error">
              <p>{error}</p>
              <button onClick={() => navigate(-1)} className="rvp-btn-retry">
                ย้อนกลับไปหน้าจัดการโครงการ
              </button>
            </div>
          ) : (
            projectData && (
              <>
                {/* ข้อมูลโครงการ */}
                <div className="rvp-summary-grid">
                  <div className="rvp-card main-info">
                    <div className="rvp-card-icon-wrapper project-icon">
                      <FaProjectDiagram />
                    </div>
                    <div className="rvp-card-details">
                      <span className="rvp-label">
                        รหัสโครงการ: {projectData.project_code}
                      </span>
                      <h2 className="rvp-title">{projectData.project_name}</h2>
                      <span className="rvp-date-badge">
                        บันทึกเมื่อ:{" "}
                        {new Date(projectData.created_at).toLocaleDateString(
                          "th-TH",
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="rvp-card">
                    <div className="rvp-card-icon-wrapper group-icon">
                      <FaUsers />
                    </div>
                    <div className="rvp-card-details">
                      <span className="rvp-label">บุคลากรที่รับผิดชอบ</span>
                      <h2 className="rvp-title highlight">
                        {members.length} <small>คน</small>
                      </h2>
                    </div>
                  </div>
                </div>

                {/* รายชื่อสมาชิก */}
                <div className="rvp-list-section">
                  <div className="rvp-list-header">
                    <h2>รายชื่อผู้รับผิดชอบโครงการ</h2>
                  </div>

                  <div className="rvp-table-responsive">
                    <table className="rvp-card-table">
                      <thead>
                        <tr>
                          <th>ชื่อ-นามสกุล</th>
                          <th>อีเมลติดต่อ</th>
                          <th>รหัสผู้ใช้ (Username)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member, index) => (
                          <tr key={index}>
                            <td>
                              <div className="rvp-user-profile">
                                <div className="rvp-avatar">
                                  {member.name ? member.name.charAt(0) : "U"}
                                </div>
                                <span className="rvp-user-name">
                                  {member.name || "ไม่มีชื่อ"}
                                </span>
                              </div>
                            </td>
                            <td className="rvp-text-muted">
                              {member.email || "-"}
                            </td>
                            <td className="rvp-text-muted">
                              @{member.username}
                            </td>
                          </tr>
                        ))}

                        {members.length === 0 && (
                          <tr>
                            <td colSpan="3" className="rvp-empty-state">
                              ยังไม่มีการเพิ่มบุคลากรรับผิดชอบในโครงการนี้
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

export default RegulatorViewProject;
