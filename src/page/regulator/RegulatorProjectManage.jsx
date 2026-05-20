import React, { useState } from "react";
import "./style/RegulatorProjectManage.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaPlus,
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaFolder,
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "ลบโครงการ?",
      text: "คุณต้องการลบโครงการนี้ออกจากระบบหรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบโครงการ",
    }).then((result) => {
      if (result.isConfirmed) {
        setProjects(projects.filter((p) => p.id !== id));
        Swal.fire("ลบสำเร็จ!", "ข้อมูลโครงการถูกลบแล้ว", "success");
      }
    });
  };

  return (
    <div className="regulator-portal-layout">
      <SidebarRegulator />
      <div className="regulator-portal-content">
        <div className="rpm-container">
          <div className="rpm-header">
            <div>
              <h1 className="rpm-title">จัดการโครงการ (Project Management)</h1>
              <p className="rpm-subtitle">
                สร้าง จัดการ และกำหนดผู้รับผิดชอบโครงการในหน่วยงาน
              </p>
            </div>
            <button className="rpm-btn-primary">
              <FaPlus /> สร้างโครงการใหม่
            </button>
          </div>

          <div className="rpm-toolbar">
            <div className="rpm-search-box">
              <FaSearch className="rpm-icon" />
              <input type="text" placeholder="ค้นหาชื่อโครงการ..." />
            </div>
          </div>

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
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj) => (
                    <tr key={proj.id}>
                      <td className="rpm-text-muted">{proj.id}</td>
                      <td className="rpm-font-bold">{proj.name}</td>
                      <td>{proj.manager}</td>
                      <td>{proj.members} คน</td>
                      <td>
                        <div className="rpm-progress-track">
                          <div
                            className="rpm-progress-fill"
                            style={{ width: `${proj.progress}%` }}
                          ></div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`rpm-status-badge ${proj.status.toLowerCase()}`}
                        >
                          {proj.status}
                        </span>
                      </td>
                      <td>
                        <div className="rpm-actions">
                          <button
                            className="rpm-btn-icon assign"
                            title="เพิ่มสมาชิก"
                          >
                            <FaUserPlus />
                          </button>
                          <button className="rpm-btn-icon edit" title="แก้ไข">
                            <FaEdit />
                          </button>
                          <button
                            className="rpm-btn-icon delete"
                            title="ลบ"
                            onClick={() => handleDelete(proj.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
