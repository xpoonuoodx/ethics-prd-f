import React, { useState, useEffect } from "react";
import "./style/AdminOrganize.css";
import {
  FaBuilding,
  FaSearch,
  FaPlus,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import api from "../../api/Api";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import { useNavigate } from "react-router-dom"; // เพิ่ม useNavigate

// กลุ่มอุตสาหกรรมของหน่วยงาน
const SECTOR_OPTIONS = [
  { value: "government", label: "ภาครัฐ" },
  { value: "finance", label: "การเงินและการธนาคาร" },
  { value: "healthcare", label: "สาธารณสุข" },
  { value: "education", label: "การศึกษา" },
  { value: "industry", label: "อุตสาหกรรม" },
  { value: "commerce", label: "พาณิชย์และบริการ" },
  { value: "other", label: "อื่นๆ" },
];
const SECTOR_LABELS = SECTOR_OPTIONS.reduce((acc, opt) => {
  acc[opt.value] = opt.label;
  return acc;
}, {});

const AdminOrganize = () => {
  const { fire } = useThemedAlert();
  const navigate = useNavigate(); // เรียกใช้งาน useNavigate
  const [organizations, setOrganizations] = useState([]);
  const [regulators, setRegulators] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    regulatorName: "",
    status: "Active",
    sector: "",
  });

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/get-organize");

      if (response.data && response.data.success) {
        setOrganizations(response.data.data);
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

  const fetchRegulators = async () => {
    try {
      const response = await api.get("/admin/get-regulators");
      if (response.data && response.data.success) {
        setRegulators(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Regulators Error:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrganizations();
    fetchRegulators();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id || !formData.name) {
      fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกรหัสและชื่อหน่วยงานให้ครบถ้วน",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    if (!formData.sector) {
      fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาเลือกกลุ่มอุตสาหกรรม (Sector) ของหน่วยงาน",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/admin/add-organize", formData);

      if (response.data && response.data.success) {
        fire({
          title: "สำเร็จ",
          text: "เพิ่มหน่วยงานใหม่เรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
        setIsModalOpen(false);
        setFormData({
          id: "",
          name: "",
          regulatorName: "",
          status: "Active",
          sector: "",
        });
        fetchOrganizations();
      }
    } catch (err) {
      console.error("Add Organization Error:", err);
      fire({
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถเพิ่มหน่วยงานได้",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await fire({
      title: "ยืนยันการลบหน่วยงาน?",
      text: `คุณต้องการลบหน่วยงาน "${name}" ใช่หรือไม่ ข้อมูลที่เกี่ยวข้องจะถูกลบทั้งหมด`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ยืนยันลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        // 💡 ยิง API ไปที่หลังบ้าน
        const response = await api.delete(`/admin/delete-organize/${id}`);

        if (response.data && response.data.success) {
          // อัปเดต State เฉพาะเมื่อลบในฐานข้อมูลสำเร็จแล้ว
          setOrganizations(organizations.filter((org) => org.id !== id));

          fire({
            title: "ลบข้อมูลสำเร็จ",
            text: "ข้อมูลหน่วยงานถูกนำออกจากระบบแล้ว",
            icon: "success",
            confirmButtonColor: "#10b981",
          });
        }
      } catch (error) {
        console.error("Delete Error:", error);
        fire({
          title: "เกิดข้อผิดพลาด",
          text: error.response?.data?.message || "ไม่สามารถลบข้อมูลได้",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const filteredOrganizations = organizations.filter((org) => {
    const searchStr = searchTerm.toLowerCase();

    const matchName = org.name
      ? org.name.toLowerCase().includes(searchStr)
      : false;
    const matchId = org.id
      ? String(org.id).toLowerCase().includes(searchStr)
      : false;
    const matchRegulator = org.regulatorName
      ? org.regulatorName.toLowerCase().includes(searchStr)
      : false;

    return matchName || matchId || matchRegulator;
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

              <button
                className="admin-organize-btn-dark"
                onClick={() => setIsModalOpen(true)}
              >
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
                <h2>รายการหน่วยงาน</h2>
                <span className="admin-organize-list-count">
                  {filteredOrganizations.length === 0
                    ? "0 หน่วยงาน"
                    : `แสดง ${rangeStart}-${rangeEnd} จาก ${filteredOrganizations.length} หน่วยงาน`}
                </span>
              </div>

              <div className="admin-organize-table-responsive">
                <table className="admin-organize-card-table">
                  <thead>
                    <tr>
                      <th>รหัสหน่วยงาน</th>
                      <th>ชื่อหน่วยงาน</th>
                      <th>ผู้กำกับดูแล (Regulator)</th>
                      <th>Sector</th>
                      <th className="admin-organize-text-center">โครงการ</th>
                      <th className="admin-organize-text-center">ผู้ใช้งาน</th>
                      <th>สถานะ</th>
                      <th className="admin-organize-text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrganizations.map((org, index) => (
                      <tr key={index} className="admin-organize-table-row">
                        <td className="admin-organize-col-id">
                          {org.id || "-"}
                        </td>
                        <td className="admin-organize-col-name">
                          {org.name || "ไม่มีชื่อหน่วยงาน"}
                        </td>
                        <td>
                          <div className="admin-organize-user-profile">
                            <div className="admin-organize-avatar">
                              {org.regulatorName &&
                              org.regulatorName !== "ยังไม่มีผู้ดูแล"
                                ? org.regulatorName.charAt(0)
                                : "-"}
                            </div>
                            <div className="admin-organize-user-text">
                              <span className="admin-organize-user-name">
                                {org.regulatorName || "ยังไม่มีผู้ดูแล"}
                              </span>
                              <span className="admin-organize-user-role">
                                ผู้กำกับดูแล
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {org.sector ? (
                            <span className="admin-organize-sector-badge">
                              {SECTOR_LABELS[org.sector] || org.sector}
                            </span>
                          ) : (
                            <span className="admin-organize-sector-badge empty">
                              ไม่ระบุ
                            </span>
                          )}
                        </td>
                        <td className="admin-organize-text-center">
                          <span className="admin-organize-bold-number">
                            {org.totalProjects || 0}
                          </span>
                        </td>
                        <td className="admin-organize-text-center">
                          <span className="admin-organize-bold-number">
                            {org.totalUsers || 0}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`admin-organize-badge admin-organize-status-${org.status ? org.status.toLowerCase() : "inactive"}`}
                          >
                            <span className="admin-organize-badge-dot"></span>
                            {org.status === "Active"
                              ? "ใช้งานปกติ"
                              : "ระงับการใช้งาน"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-organize-action-buttons">
                            {/* เพิ่ม onClick สำหรับไปหน้า View Details */}
                            <button
                              className="admin-organize-btn-action-icon admin-organize-edit"
                              title="ดูรายละเอียด/จัดการ"
                              onClick={() =>
                                navigate(`/admin-view-organize/${org.id}`)
                              }
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
                        <td colSpan="8" className="admin-organize-empty-state">
                          ไม่พบข้อมูลหน่วยงานในระบบ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="admin-organize-pagination">
                  <button
                    className="admin-organize-page-btn"
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
                          className="admin-organize-page-ellipsis"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          className={`admin-organize-page-btn ${
                            page === safeCurrentPage ? "active" : ""
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}

                  <button
                    className="admin-organize-page-btn"
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
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="admin-organize-modal-overlay">
          <div className="admin-organize-modal-container">
            <div className="admin-organize-modal-header">
              <h2>เพิ่มหน่วยงานใหม่</h2>
              <button
                className="admin-organize-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleAddSubmit}
              className="admin-organize-modal-body"
            >
              <div className="admin-organize-form-group">
                <label>รหัสหน่วยงาน</label>
                <input
                  type="text"
                  name="id"
                  placeholder="เช่น ORG-001"
                  value={formData.id}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-organize-form-group">
                <label>ชื่อหน่วยงาน</label>
                <input
                  type="text"
                  name="name"
                  placeholder="กรอกชื่อหน่วยงาน"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* <div className="admin-organize-form-group">
                <label>ชื่อผู้กำกับดูแล (Regulator)</label>
                <input
                  type="text"
                  name="regulatorName"
                  list="regulator-list"
                  placeholder="เลือกหรือพิมพ์ชื่อผู้กำกับดูแล (เว้นว่างได้)"
                  value={formData.regulatorName}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <datalist id="regulator-list">
                  {regulators.map((reg, idx) => (
                    <option key={idx} value={reg.name} />
                  ))}
                </datalist>
              </div> */}

              <div className="admin-organize-form-group">
                <label>กลุ่มอุตสาหกรรม (Sector)</label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกกลุ่มอุตสาหกรรม --
                  </option>
                  {SECTOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-organize-form-group">
                <label>สถานะเริ่มต้น</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">ใช้งานปกติ</option>
                  <option value="Inactive">ระงับการใช้งาน</option>
                </select>
              </div>

              <div className="admin-organize-modal-footer">
                <button
                  type="button"
                  className="admin-organize-btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="admin-organize-btn-submit"
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

export default AdminOrganize;
