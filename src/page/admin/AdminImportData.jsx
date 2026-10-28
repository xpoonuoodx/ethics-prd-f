import React, { useEffect, useState } from "react";
import "./style/AdminDataTools.css";
import {
  FaFileImport,
  FaDownload,
  FaUpload,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaPen,
  FaSave,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import api from "../../api/Api";

const TEMPLATE_FIELDS = [
  "ชื่อ",
  "นามสกุล",
  "อีเมล",
  "เบอร์โทรศัพท์",
  "ประเภทผู้ใช้งาน (user_type)",
  "รหัสหน่วยงาน (ไม่บังคับ)",
];

const USER_TYPE_LABELS = {
  regulator: "ผู้กำกับดูแล",
  policy: "ผู้วางนโยบาย",
  researcher: "นักวิจัย",
  developer: "นักพัฒนา",
  "service provider": "ผู้ให้บริการ",
  users: "ผู้ใช้งานทั่วไป",
};

const ITEMS_PER_PAGE = 12;

const AdminImportData = () => {
  const { fire } = useThemedAlert();

  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const [importedUsers, setImportedUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [revealedIds, setRevealedIds] = useState(new Set());

  const [editingId, setEditingId] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchImportedUsers = async () => {
    try {
      setLoadingList(true);
      setListError(null);
      const response = await api.get("/admin/imported-users");
      if (response.data && response.data.success) {
        setImportedUsers(response.data.data);
      } else {
        setListError("ไม่สามารถโหลดข้อมูลได้");
      }
    } catch (err) {
      console.error("Fetch Imported Users Error:", err);
      setListError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
      );
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchImportedUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      const response = await api.get("/admin/import-users-template", {
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "import-users-template.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download Import Template Error:", err);
      fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดาวน์โหลดเทมเพลตได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!file) return;
    try {
      setImporting(true);
      setImportResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/admin/import-users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.success) {
        setImportResult(response.data.data);
        setFile(null);
        if (response.data.data.insertedCount > 0) {
          fetchImportedUsers();
        }
      }
    } catch (err) {
      console.error("Import Users Error:", err);
      fire({
        title: "เกิดข้อผิดพลาด",
        text:
          err.response?.data?.message || "ไม่สามารถนำเข้าข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setImporting(false);
    }
  };

  const toggleReveal = (id) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditUsername(user.username || "");
    setEditPassword(user.temp_password || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditUsername("");
    setEditPassword("");
  };

  const saveEdit = async (id) => {
    try {
      setSavingEdit(true);
      const response = await api.put(`/admin/imported-users/${id}/credentials`, {
        username: editUsername.trim(),
        password: editPassword,
      });
      if (response.data && response.data.success) {
        setImportedUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, username: editUsername.trim(), temp_password: editPassword }
              : u,
          ),
        );
        setEditingId(null);
        fire({
          title: "บันทึกสำเร็จ",
          text: "แก้ไขข้อมูลเข้าสู่ระบบเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
    } catch (err) {
      console.error("Update Imported User Credentials Error:", err);
      fire({
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถแก้ไขข้อมูลได้",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredUsers = importedUsers.filter((u) => {
    const haystack = `${u.first_name_th || ""} ${u.last_name_th || ""} ${u.email || ""} ${u.username || ""}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="adt-layout">
      <SidebarAdmin />

      <div className="adt-main-content">
        <div className="adt-container">
          <div className="adt-header">
            <div className="adt-header-icon">
              <FaFileImport />
            </div>
            <div>
              <h1 className="adt-title">นำเข้าข้อมูล</h1>
              <p className="adt-subtitle">
                นำเข้าข้อมูลผู้ใช้งานจากไฟล์ Excel เข้าสู่ระบบ
              </p>
            </div>
          </div>

          <div className="adt-card">
            <h2 className="adt-card-title">1. เทมเพลตสำหรับนำเข้าข้อมูล</h2>
            <ul className="adt-field-list">
              {TEMPLATE_FIELDS.map((field) => (
                <li key={field}>
                  <span className="adt-field-dot"></span>
                  {field}
                </li>
              ))}
            </ul>
            <div className="adt-note">
              ไม่ต้องกรอก Username / Password ในไฟล์ — ระบบจะสุ่มสร้างให้อัตโนมัติทุกแถว
              สามารถดูและแก้ไขได้ที่ตารางด้านล่างหลังนำเข้าสำเร็จ
              <br />
              ทุกคนที่นำเข้าสำเร็จจะได้รับใบประกาศกลุ่มผู้ใช้งานทั่วไป (กลุ่ม 3)
              ให้อัตโนมัติทันที โดยวันที่ออกใบประกาศจะตรงกับวันที่นำเข้าข้อมูล
            </div>
            <button
              className="adt-btn-secondary"
              onClick={handleDownloadTemplate}
              disabled={downloadingTemplate}
            >
              {downloadingTemplate ? (
                <>
                  <FaSpinner className="adt-spin" /> กำลังสร้างไฟล์...
                </>
              ) : (
                <>
                  <FaDownload /> ดาวน์โหลดเทมเพลตเปล่า
                </>
              )}
            </button>
          </div>

          <div className="adt-card">
            <h2 className="adt-card-title">2. อัปโหลดไฟล์ข้อมูล</h2>
            <div className="adt-upload-row">
              <label className="adt-file-label">
                <FaUpload />
                เลือกไฟล์ Excel (.xlsx)
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
              </label>
              {file && <span className="adt-file-name">{file.name}</span>}
              <button
                className="adt-btn-primary"
                onClick={handleImport}
                disabled={!file || importing}
              >
                {importing ? (
                  <>
                    <FaSpinner className="adt-spin" /> กำลังนำเข้า...
                  </>
                ) : (
                  <>
                    <FaFileImport /> นำเข้าข้อมูล
                  </>
                )}
              </button>
            </div>

            {importResult && (
              <div style={{ marginTop: "22px" }}>
                <div className="adt-result-summary">
                  <span className="adt-result-pill success">
                    <FaCheckCircle /> เพิ่มสำเร็จ {importResult.insertedCount} คน
                  </span>
                  {importResult.skippedCount > 0 && (
                    <span className="adt-result-pill warning">
                      <FaExclamationTriangle /> ข้ามไป {importResult.skippedCount}{" "}
                      แถว
                    </span>
                  )}
                </div>

                {importResult.skipped.length > 0 && (
                  <div className="adt-skip-table-wrapper">
                    <table className="adt-skip-table">
                      <thead>
                        <tr>
                          <th>แถวที่</th>
                          <th>ชื่อ-นามสกุล</th>
                          <th>อีเมล</th>
                          <th>สาเหตุที่ข้าม</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.skipped.map((s, i) => (
                          <tr key={i}>
                            <td>{s.row}</td>
                            <td>
                              {s.firstName || s.lastName
                                ? `${s.firstName} ${s.lastName}`
                                : "-"}
                            </td>
                            <td>{s.email || "-"}</td>
                            <td>{s.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="adt-card">
            <h2 className="adt-card-title">ผู้ใช้งานที่นำเข้าโดยแอดมิน</h2>

            <div className="adt-toolbar">
              <div className="adt-search-box">
                <FaSearch className="adt-search-icon" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, อีเมล หรือ username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="adt-table-wrapper">
              {loadingList ? (
                <div className="adt-state-container">
                  <FaSpinner className="adt-spin" size={26} />
                  <p>กำลังโหลดข้อมูล...</p>
                </div>
              ) : listError ? (
                <div className="adt-state-container">
                  <p className="adt-error-text">{listError}</p>
                  <button onClick={fetchImportedUsers} className="adt-btn-secondary">
                    ลองใหม่อีกครั้ง
                  </button>
                </div>
              ) : (
                <table className="adt-data-table">
                  <thead>
                    <tr>
                      <th>ชื่อ-นามสกุล</th>
                      <th>อีเมล</th>
                      <th>เบอร์โทร</th>
                      <th>ประเภทผู้ใช้งาน</th>
                      <th>หน่วยงาน</th>
                      <th>Username</th>
                      <th>Password</th>
                      <th>วันที่นำเข้า</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((u) => {
                      const isEditing = editingId === u.id;
                      const isRevealed = revealedIds.has(u.id);
                      return (
                        <tr key={u.id}>
                          <td className="adt-font-medium">
                            {u.first_name_th} {u.last_name_th}
                          </td>
                          <td className="adt-text-muted">{u.email}</td>
                          <td className="adt-text-muted">{u.mobile || "-"}</td>
                          <td className="adt-text-muted">
                            {USER_TYPE_LABELS[u.user_type] || u.user_type}
                          </td>
                          <td className="adt-text-muted">
                            {u.org_name || "-"}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                className="adt-inline-input"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                              />
                            ) : (
                              <span className="adt-credential-cell">
                                {u.username}
                              </span>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                className="adt-inline-input"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                              />
                            ) : (
                              <span className="adt-credential-cell">
                                {isRevealed ? u.temp_password : "••••••••"}
                                <button
                                  className="adt-icon-btn"
                                  title={isRevealed ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                                  onClick={() => toggleReveal(u.id)}
                                >
                                  {isRevealed ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </span>
                            )}
                          </td>
                          <td className="adt-text-muted">
                            {new Date(u.imported_at).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td>
                            <div className="adt-actions">
                              {isEditing ? (
                                <>
                                  <button
                                    className="adt-icon-btn save"
                                    title="บันทึก"
                                    disabled={savingEdit}
                                    onClick={() => saveEdit(u.id)}
                                  >
                                    <FaSave />
                                  </button>
                                  <button
                                    className="adt-icon-btn cancel"
                                    title="ยกเลิก"
                                    disabled={savingEdit}
                                    onClick={cancelEdit}
                                  >
                                    <FaTimes />
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="adt-icon-btn"
                                  title="แก้ไข Username/Password"
                                  onClick={() => startEdit(u)}
                                >
                                  <FaPen />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="9" className="adt-empty-state">
                          ยังไม่มีผู้ใช้งานที่นำเข้าในระบบ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {!loadingList && !listError && totalPages > 1 && (
                <div className="adt-pagination">
                  <button
                    className="adt-page-btn"
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
                        <span key={`ellipsis-${i}`} className="adt-page-ellipsis">
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          className={`adt-page-btn ${
                            page === safeCurrentPage ? "active" : ""
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}

                  <button
                    className="adt-page-btn"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminImportData;
