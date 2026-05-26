import React, { useState } from "react";
import "./style/RegulatorProjectManage.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaPlus,
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaProjectDiagram,
} from "react-icons/fa";
import Swal from "sweetalert2";

const RegulatorProjectManage = () => {
  const [projects, setProjects] = useState([
    {
      id: "PRJ-001",
      name: "ระบบตรวจสอบความโปร่งใส AI",
      manager: "สมชาย แซ่ตั้ง",
      members: 5,
      progress: 85,
      status: "Active",
    },
    {
      id: "PRJ-002",
      name: "ประเมินความปลอดภัยข้อมูล",
      manager: "วิชาญ ใจดี",
      members: 3,
      progress: 45,
      status: "Pending",
    },
    {
      id: "PRJ-003",
      name: "วิจัยจริยธรรม AI ภาครัฐ",
      manager: "มณี มีทรัพย์",
      members: 8,
      progress: 100,
      status: "Completed",
    },
  ]);
  const [search, setSearch] = useState("");

  // กรองโครงการตามคำค้นหา
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "ลบโครงการ?",
      text: "คุณต้องการลบโครงการนี้ออกจากระบบหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // สีแดงแจ้งเตือน
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบโครงการ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setProjects(projects.filter((p) => p.id !== id));
        Swal.fire({
          title: "ลบสำเร็จ!",
          text: "ข้อมูลโครงการถูกลบแล้ว",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      }
    });
  };

  return (
    <div className="regulator-portal-layout">
      <SidebarRegulator />
      <div className="regulator-portal-content">
        <div className="rpm-container">
          {/* =======================================
              Header Section
              ======================================= */}
          <div className="rpm-header">
            <div className="rpm-header-title-wrap">
              <div className="rpm-header-icon">
                <FaProjectDiagram />
              </div>
              <div>
                <h1 className="rpm-title">จัดการโครงการ</h1>
                <p className="rpm-subtitle">
                  สร้าง จัดการ และติดตามความคืบหน้าโครงการในหน่วยงานของคุณ
                </p>
              </div>
            </div>
            <button className="rpm-btn-primary">
              <FaPlus size={14} /> สร้างโครงการใหม่
            </button>
          </div>

          {/* =======================================
              Toolbar (Search & Filters)
              ======================================= */}
          <div className="rpm-toolbar">
            <div className="rpm-search-box">
              <FaSearch className="rpm-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือรหัสโครงการ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* พื้นที่สำหรับใส่ Filter ในอนาคต */}
            <div className="rpm-filter-placeholder"></div>
          </div>

          {/* =======================================
              Project Table Card
              ======================================= */}
          <div className="rpm-card">
            <div className="rpm-table-wrapper">
              <table className="rpm-table">
                <thead>
                  <tr>
                    <th>รหัสโครงการ</th>
                    <th>ชื่อโครงการ</th>
                    <th>ผู้รับผิดชอบ</th>
                    <th>สมาชิก</th>
                    <th>ความคืบหน้า</th>
                    <th>สถานะ</th>
                    <th style={{ textAlign: "center" }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id}>
                      <td className="rpm-text-muted">{proj.id}</td>
                      <td className="rpm-font-bold">{proj.name}</td>
                      <td>
                        <div className="rpm-user-cell">
                          <div className="rpm-avatar">
                            {proj.manager.charAt(0)}
                          </div>
                          <span>{proj.manager}</span>
                        </div>
                      </td>
                      <td>
                        <span className="rpm-member-badge">
                          {proj.members} คน
                        </span>
                      </td>
                      <td>
                        <div className="rpm-progress-wrap">
                          <div className="rpm-progress-track">
                            <div
                              className={`rpm-progress-fill ${proj.progress === 100 ? "completed" : ""}`}
                              style={{ width: `${proj.progress}%` }}
                            ></div>
                          </div>
                          <span className="rpm-progress-text">
                            {proj.progress}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`rpm-status-badge ${proj.status.toLowerCase()}`}
                        >
                          <span className="rpm-status-dot"></span> {proj.status}
                        </span>
                      </td>
                      <td>
                        <div className="rpm-actions">
                          <button
                            className="rpm-btn-icon assign"
                            title="เพิ่ม/จัดการสมาชิก"
                          >
                            <FaUserPlus />
                          </button>
                          <button
                            className="rpm-btn-icon edit"
                            title="แก้ไขโครงการ"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="rpm-btn-icon delete"
                            title="ลบโครงการ"
                            onClick={() => handleDelete(proj.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan="7" className="rpm-empty-state">
                        ไม่พบข้อมูลโครงการที่ค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorProjectManage;
