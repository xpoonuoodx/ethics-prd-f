import React, { useState, useEffect } from "react";
import "./style/AdminOrganize.css";
import {
  FaBuilding,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import api from "../../api/Api";
import Swal from "sweetalert2";

const AdminOrganize = () => {
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/organize");

      if (response.data && response.data.success) {
        setOrganizations(response.data.data.organizations);
      } else {
        setError("ไม่สามารถโหลดข้อมูลหน่วยงานได้");
      }
    } catch (err) {
      console.error("Fetch Organizations Error:", err);
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
    fetchOrganizations();
  }, []);

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "ยืนยันการลบหน่วยงาน?",
      text: `คุณต้องการลบหน่วยงาน "${name}" ใช่หรือไม่ ข้อมูลที่เกี่ยวข้องจะถูกลบทั้งหมด`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ยืนยันลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setOrganizations(organizations.filter((org) => org.id !== id));
        Swal.fire({
          title: "ลบข้อมูลสำเร็จ",
          text: "ข้อมูลหน่วยงานถูกนำออกจากระบบแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    });
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.regulatorName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-organize-layout">
      <SidebarAdmin />

      <div className="admin-organize-main-content">
        <div className="admin-organize-content-inner">
          <div className="admin-organize-top-section">
            <div className="admin-organize-header-text">
              <h1>จัดการหน่วยงานทั้งหมด</h1>
              <p>
                เพิ่ม แก้ไข ลบ และควบคุมดูแลระบบหน่วยงานผู้เช่าใช้ทั้งหมดในระบบ
              </p>
            </div>

            <div className="admin-organize-action-bar">
              <div className="admin-organize-search-pill">
                <FaSearch className="admin-organize-search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหารหัส, ชื่อหน่วยงาน, ผู้ดูแล..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="admin-organize-btn-dark">
                <FaPlus /> เพิ่มหน่วยงาน
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-organize-state-container">
              <FaSpinner className="admin-organize-spin" />
              <p>กำลังโหลดข้อมูลหน่วยงาน...</p>
            </div>
          ) : error ? (
            <div className="admin-organize-state-container admin-organize-error">
              <p>{error}</p>
              <button
                onClick={fetchOrganizations}
                className="admin-organize-btn-retry"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            <div className="admin-organize-list-section">
              <div className="admin-organize-list-header">
                <h2>รายการหน่วยงานผู้เช่าใช้</h2>
                <span className="admin-organize-list-count">
                  {filteredOrganizations.length} หน่วยงาน
                </span>
              </div>

              <div className="admin-organize-table-responsive">
                <table className="admin-organize-card-table">
                  <thead>
                    <tr>
                      <th>รหัสหน่วยงาน</th>
                      <th>ชื่อหน่วยงาน</th>
                      <th>ผู้กำกับดูแล (Regulator)</th>
                      <th className="admin-organize-text-center">โครงการ</th>
                      <th className="admin-organize-text-center">ผู้ใช้งาน</th>
                      <th>สถานะ</th>
                      <th className="admin-organize-text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrganizations.map((org, index) => (
                      <tr key={index} className="admin-organize-table-row">
                        <td className="admin-organize-col-id">{org.id}</td>
                        <td className="admin-organize-col-name">{org.name}</td>
                        <td>
                          <div className="admin-organize-user-profile">
                            <div className="admin-organize-avatar">
                              {org.regulatorName.charAt(0)}
                            </div>
                            <div className="admin-organize-user-text">
                              <span className="admin-organize-user-name">
                                {org.regulatorName}
                              </span>
                              <span className="admin-organize-user-role">
                                ผู้กำกับดูแล
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="admin-organize-text-center">
                          <span className="admin-organize-bold-number">
                            {org.totalProjects}
                          </span>
                        </td>
                        <td className="admin-organize-text-center">
                          <span className="admin-organize-bold-number">
                            {org.totalUsers}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`admin-organize-badge admin-organize-status-${org.status.toLowerCase()}`}
                          >
                            <span className="admin-organize-badge-dot"></span>
                            {org.status === "Active"
                              ? "ใช้งานปกติ"
                              : "ระงับการใช้งาน"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-organize-action-buttons">
                            <button
                              className="admin-organize-btn-action-icon admin-organize-edit"
                              title="แก้ไขข้อมูล"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="admin-organize-btn-action-icon admin-organize-delete"
                              title="ลบหน่วยงาน"
                              onClick={() => handleDelete(org.id, org.name)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredOrganizations.length === 0 && (
                      <tr>
                        <td colSpan="7" className="admin-organize-empty-state">
                          ไม่พบข้อมูลหน่วยงานในระบบ
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

export default AdminOrganize;
