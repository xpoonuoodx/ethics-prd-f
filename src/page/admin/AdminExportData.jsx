import React, { useEffect, useState } from "react";
import "./style/AdminDataTools.css";
import {
  FaFileExcel,
  FaSpinner,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import api from "../../api/Api";

const EXPORT_FIELDS = [
  "ชื่อ",
  "นามสกุล",
  "อีเมล",
  "เบอร์โทรศัพท์",
  "ประเภทผู้ใช้งาน (user_type)",
  "สถานะใบประกาศ (ได้รับแล้ว / ยังไม่ได้รับ)",
  "รายชื่อใบประกาศที่ได้รับทั้งหมด",
];

const AdminExportData = () => {
  const { fire } = useThemedAlert();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/export-users-summary");
      if (response.data && response.data.success) {
        setSummary(response.data.data);
      } else {
        setError("ไม่สามารถโหลดข้อมูลสรุปได้");
      }
    } catch (err) {
      console.error("Fetch Export Summary Error:", err);
      setError(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSummary();
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.get("/admin/export-users-excel", {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = blobUrl;
      link.download = `users-export-${dateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Export Users Excel Error:", err);
      fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถส่งออกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setExporting(false);
    }
  };

  const withoutCert = summary
    ? Math.max(0, summary.totalUsers - summary.usersWithCertificate)
    : 0;

  return (
    <div className="adt-layout">
      <SidebarAdmin />

      <div className="adt-main-content">
        <div className="adt-container">
          <div className="adt-header">
            <div className="adt-header-icon">
              <FaFileExcel />
            </div>
            <div>
              <h1 className="adt-title">ส่งออกข้อมูลผู้ใช้งาน</h1>
              <p className="adt-subtitle">
                ส่งออกรายชื่อผู้ใช้งานและสถานะใบประกาศเป็นไฟล์ Excel
              </p>
            </div>
          </div>

          {loading ? (
            <div className="adt-state-container">
              <FaSpinner className="adt-spin" size={28} />
              <p>กำลังโหลดข้อมูลสรุป...</p>
            </div>
          ) : error ? (
            <div className="adt-state-container">
              <p className="adt-error-text">{error}</p>
              <button onClick={fetchSummary} className="adt-btn-export">
                ลองใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            <>
              <div className="adt-stats-grid">
                <div className="adt-stat-card">
                  <div className="adt-stat-icon total">
                    <FaUsers />
                  </div>
                  <div>
                    <span className="adt-stat-label">ผู้ใช้งานทั้งหมด</span>
                    <span className="adt-stat-value">
                      {summary.totalUsers}
                    </span>
                  </div>
                </div>

                <div className="adt-stat-card">
                  <div className="adt-stat-icon with-cert">
                    <FaUserCheck />
                  </div>
                  <div>
                    <span className="adt-stat-label">ได้รับใบประกาศแล้ว</span>
                    <span className="adt-stat-value">
                      {summary.usersWithCertificate}
                    </span>
                  </div>
                </div>

                <div className="adt-stat-card">
                  <div className="adt-stat-icon without-cert">
                    <FaUserTimes />
                  </div>
                  <div>
                    <span className="adt-stat-label">ยังไม่ได้รับใบประกาศ</span>
                    <span className="adt-stat-value">{withoutCert}</span>
                  </div>
                </div>
              </div>

              <div className="adt-card">
                <h2 className="adt-card-title">ข้อมูลที่จะได้รับในไฟล์ Excel</h2>
                <ul className="adt-field-list">
                  {EXPORT_FIELDS.map((field) => (
                    <li key={field}>
                      <span className="adt-field-dot"></span>
                      {field}
                    </li>
                  ))}
                </ul>

                <div className="adt-note">
                  ไฟล์ที่ส่งออกจะรวมเฉพาะผู้ใช้งานที่มีสิทธิ์เป็น "ผู้ใช้งานทั่วไป" เท่านั้น ไม่รวมผู้กำกับดูแลระบบและผู้ดูแลระบบ
                </div>

                <button
                  className="adt-btn-export"
                  onClick={handleExport}
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <FaSpinner className="adt-spin" /> กำลังสร้างไฟล์...
                    </>
                  ) : (
                    <>
                      <FaFileExcel /> ส่งออกเป็นไฟล์ Excel (.xlsx)
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminExportData;
