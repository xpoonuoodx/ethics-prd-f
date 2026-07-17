import React, { useState, useEffect } from "react";
import "./style/AdminDashboard.css";
import {
  FaBuilding,
  FaUsers,
  FaProjectDiagram,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaUserShield,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import api, { getStoredUser } from "../../api/Api";

const AdminDashboard = () => {
  const user = getStoredUser();

  // State สำหรับเก็บข้อมูลที่ดึงมาจากหลังบ้าน
  const [summary, setSummary] = useState({
    totalOrganizations: 0,
    totalRegulators: 0,
    totalProjects: 0,
    totalUsers: 0,
  });
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // ฟังก์ชันยิง API ดึงข้อมูลจากหลังบ้าน
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/admin/dashboard");

      if (response.data && response.data.success) {
        const { summary, organizations } = response.data.data || {};
        setSummary(
          summary || {
            totalOrganizations: 0,
            totalRegulators: 0,
            totalProjects: 0,
            totalUsers: 0,
          },
        );
        setOrganizations(organizations || []);
      } else {
        setError("ไม่สามารถดึงข้อมูลภาพรวมระบบได้");
      }
    } catch (err) {
      console.error("Fetch Dashboard Error:", err);
      setError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อหลังบ้าน",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  // กรองตารางหน่วยงานตามคำค้นหา (กัน crash เมื่อบางฟิลด์เป็น null/ไม่ใช่ string เช่น regulatorName ที่ยังไม่ได้ตั้งค่า)
  const filteredOrganizations = organizations.filter((org) => {
    const term = searchTerm.toLowerCase();
    return (
      String(org.name ?? "").toLowerCase().includes(term) ||
      String(org.id ?? "").toLowerCase().includes(term) ||
      String(org.regulatorName ?? "").toLowerCase().includes(term)
    );
  });

  // กลับไปหน้า 1 เสมอเมื่อค้นหาเปลี่ยน กันโชว์หน้าว่างเปล่าค้างอยู่
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrganizations.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedOrganizations = filteredOrganizations.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );
  const rangeStart =
    filteredOrganizations.length === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredOrganizations.length,
  );

  return (
    <div className="admin-layout">
      {/* Sidebar ด้านซ้าย */}
      <SidebarAdmin />

      {/* Content Area ด้านขวา */}
      <div className="admin-main-content">
        <div className="admin-content-inner">
          {/* =======================================
              Header & Top Actions
              ======================================= */}
          <div className="admin-top-section">
            <div className="admin-header-text">
              <h1>ยินดีต้อนรับคุณ, {user?.name || "หน่วยงาน"}</h1>
              <p>ภาพรวมและสถิติการใช้งานระบบจัดการหน่วยงานทั้งหมด</p>
            </div>

            <div className="admin-action-bar">
              <div className="admin-search-pill">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหารหัส, ชื่อหน่วยงาน, ผู้ดูแล..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* <button className="admin-btn-dark">
                <FaPlus /> เพิ่มหน่วยงาน
              </button> */}
            </div>
          </div>

          {/* =======================================
              แสดงสถานะ Loading / Error
              ======================================= */}
          {loading ? (
            <div className="admin-state-container">
              <FaSpinner className="admin-spin" />
              <p>กำลังโหลดข้อมูลระบบ...</p>
            </div>
          ) : error ? (
            <div className="admin-state-container error">
              <p>{error}</p>
              <button onClick={fetchDashboardData} className="admin-btn-retry">
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            <>
              {/* =======================================
                  Stats Grid: การ์ดสถิติมินิมอล
                  ======================================= */}
              <div className="admin-stats-container">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-emerald-light">
                    <FaBuilding className="text-emerald" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">หน่วยงานทั้งหมด</span>
                    <span className="stat-value">
                      {summary.totalOrganizations}
                    </span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-blue-light">
                    <FaUserShield className="text-blue" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">ผู้กำกับดูแลระบบ</span>
                    <span className="stat-value">
                      {summary.totalRegulators}
                    </span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-purple-light">
                    <FaProjectDiagram className="text-purple" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">โครงการทั้งหมด</span>
                    <span className="stat-value">{summary.totalProjects}</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-icon bg-orange-light">
                    <FaUsers className="text-orange" />
                  </div>
                  <div className="admin-stat-details">
                    <span className="stat-label">ผู้ใช้งานรวม</span>
                    <span className="stat-value">{summary.totalUsers}</span>
                  </div>
                </div>
              </div>

              {/* =======================================
                  Data Table: ตารางรายชื่อสไตล์ Card Rows
                  ======================================= */}
              <div className="admin-list-section">
                <div className="admin-list-header">
                  <h2>รายชื่อหน่วยงานในระบบ</h2>
                  <span className="admin-list-count">
                    {filteredOrganizations.length === 0
                      ? "0 รายการ"
                      : `แสดง ${rangeStart}-${rangeEnd} จาก ${filteredOrganizations.length} รายการ`}
                  </span>
                </div>

                <div className="admin-table-responsive">
                  <table className="admin-card-table">
                    <thead>
                      <tr>
                        <th>รหัสหน่วยงาน</th>
                        <th>ชื่อหน่วยงาน</th>
                        <th>ผู้กำกับดูแล (Regulator)</th>
                        <th className="text-center">โครงการ</th>
                        <th className="text-center">ผู้ใช้งาน</th>
                        <th>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrganizations.map((org, index) => (
                        <tr key={index} className="admin-table-row">
                          <td className="col-id">{org.id}</td>
                          <td className="col-name">{org.name}</td>
                          <td>
                            <div className="admin-user-profile">
                              <div className="admin-avatar">
                                {org.regulatorName.charAt(0)}
                              </div>
                              <div className="admin-user-text">
                                <span className="user-name">
                                  {org.regulatorName}
                                </span>
                                <span className="user-role">Regulator</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="admin-bold-number">
                              {org.totalProjects}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="admin-bold-number">
                              {org.totalUsers}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`admin-badge ${org.status.toLowerCase()}`}
                            >
                              <span className="badge-dot"></span>
                              {org.status === "Active"
                                ? "ใช้งานปกติ"
                                : "ระงับการใช้งาน"}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {filteredOrganizations.length === 0 && (
                        <tr>
                          <td colSpan="6" className="admin-empty-state">
                            ไม่พบข้อมูลหน่วยงานที่ค้นหา
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="admin-pagination">
                    <button
                      className="admin-page-btn"
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
                          <span
                            key={`ellipsis-${i}`}
                            className="admin-page-ellipsis"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={page}
                            className={`admin-page-btn ${
                              page === safeCurrentPage ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ),
                      )}

                    <button
                      className="admin-page-btn"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
