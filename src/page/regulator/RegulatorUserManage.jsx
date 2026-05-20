import React, { useState, useEffect } from "react";
import "./style/RegulatorUserManage.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUserTie,
  FaUser,
} from "react-icons/fa";
import Swal from "sweetalert2";

const RegulatorUserManage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "สมชาย รักงาน",
      email: "somchai@reg.go.th",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "วิชาญ ใจดี",
      email: "wichan@reg.go.th",
      role: "Staff",
      status: "Active",
    },
    {
      id: 3,
      name: "มณี มีทรัพย์",
      email: "manee@reg.go.th",
      role: "Staff",
      status: "Inactive",
    },
    {
      id: 4,
      name: "สมหญิง รักงาน",
      email: "somying@reg.go.th",
      role: "Admin",
      status: "Active",
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบข้อมูล",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter((u) => u.id !== id));
        Swal.fire("ลบสำเร็จ!", "ข้อมูลถูกลบออกแล้ว", "success");
      }
    });
  };

  return (
    <div className="regulator-portal-layout">
      <SidebarRegulator />
      <div className="regulator-portal-content">
        <div className="rum-container">
          <div className="rum-header">
            <div>
              <h1 className="rum-title">จัดการบุคลากร</h1>
              <p className="rum-subtitle">
                ดูรายชื่อและบริหารจัดการสิทธิ์ผู้ใช้งานภายในหน่วยงาน
              </p>
            </div>
            <button className="rum-btn-add">
              <FaPlus /> เพิ่มบุคลากร
            </button>
          </div>

          <div className="rum-toolbar">
            <div className="rum-search-box">
              <FaSearch className="rum-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อบุคลากร..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="rum-filter-select">
              <option>ทุกสถานะ</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="rum-card">
            <div className="rum-table-wrapper">
              <table className="rum-table">
                <thead>
                  <tr>
                    <th>ชื่อ - นามสกุล</th>
                    <th>อีเมล</th>
                    <th>บทบาท</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="rum-user-cell">
                          <div className="rum-avatar">
                            {user.name.charAt(0)}
                          </div>
                          <span className="rum-user-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="rum-text-muted">{user.email}</td>
                      <td>
                        <span
                          className={`rum-role-badge ${user.role.toLowerCase()}`}
                        >
                          {user.role === "Admin" ? (
                            <FaUserShield />
                          ) : (
                            <FaUser />
                          )}{" "}
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`rum-status-badge ${user.status.toLowerCase()}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="rum-actions">
                          <button className="rum-btn-edit">
                            <FaEdit />
                          </button>
                          <button
                            className="rum-btn-delete"
                            onClick={() => handleDelete(user.id)}
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

export default RegulatorUserManage;
