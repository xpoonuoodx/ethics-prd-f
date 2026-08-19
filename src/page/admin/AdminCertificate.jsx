import React, { useState, useEffect } from "react";
import "./style/AdminCertificate.css";
import SidebarAdmin from "./SidebarAdmin";
import {
  FaAward,
  FaSearch,
  FaTrash,
  FaSpinner,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import api from "../../api/Api";
import CertificateTemplate from "../../component/CertificateTemplate";

const AdminCertificate = () => {
  const { fire } = useThemedAlert();
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [previewCert, setPreviewCert] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/certificates");
      if (response.data && response.data.success) {
        setCertificates(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Certificates Error:", err);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, userName, groupNum) => {
    fire({
      title: "ยืนยันการเพิกถอนสิทธิ์?",
      text: `คุณต้องการลบประวัติใบประกาศนียบัตรของ "${userName}" (หลักสูตรกลุ่มที่ ${groupNum}) ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "เพิกถอน/ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/admin/certificates/delete/${id}`);
          if (response.data && response.data.success) {
            fire(
              "สำเร็จ!",
              "เพิกถอนประวัติใบประกาศนียบัตรเรียบร้อย",
              "success",
            );
            fetchCertificates();
          }
        } catch (err) {
          console.error("Delete Certificate Error:", err);
          fire("ผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        }
      }
    });
  };

  const filteredCertificates = certificates.filter(
    (c) =>
      (c.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.userEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.orgName || "").toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bangkok",
    });
  };

  // วันที่แบบไม่มีเวลา สำหรับโชว์บนตัวใบประกาศเอง (ใบเซอร์ไม่ต้องมีนาฬิกากำกับ)
  const formatCertDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Bangkok",
    });
  };

  return (
    <div className="act-layout">
      <SidebarAdmin />

      <div className="act-main-content">
        <div className="act-container">
          <div className="act-header">
            <div className="act-header-title-wrap">
              <div className="act-header-icon">
                <FaAward />
              </div>
              <div>
                <h1 className="act-title">จัดการประวัติใบประกาศนียบัตร</h1>
                <p className="act-subtitle">
                  ตรวจสอบรายชื่อผู้ใช้งานที่เรียนและทำแบบทดสอบผ่านเกณฑ์ครบถ้วนแยกตามหลักสูตร
                </p>
              </div>
            </div>
          </div>

          <div className="act-toolbar">
            <div className="act-search-box">
              <FaSearch className="act-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้ใช้, อีเมล หรือหน่วยงาน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="act-table-wrapper">
            {loading ? (
              <div className="act-state-container">
                <FaSpinner className="act-spin" />
                <p>กำลังโหลดรายชื่อผู้ได้รับใบประกาศนียบัตร...</p>
              </div>
            ) : (
              <table className="act-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>ชื่อ-นามสกุล / อีเมล</th>
                    <th style={{ width: "25%" }}>หน่วยงาน / องค์กร</th>
                    <th style={{ width: "20%" }}>หลักสูตรที่ได้รับ</th>
                    <th style={{ width: "20%" }}>วันที่ได้รับสิทธิ์</th>
                    <th className="act-text-center" style={{ width: "10%" }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.certId}>
                      <td>
                        <div className="act-user-name">{cert.userName}</div>
                        <div className="act-user-email">{cert.userEmail}</div>
                      </td>
                      <td className="act-font-medium">{cert.orgName || "-"}</td>
                      <td>
                        <span className="act-course-badge">
                          หลักสูตรกลุ่มที่ {cert.courseGroup}
                        </span>
                      </td>
                      <td className="act-text-muted">
                        {formatDate(cert.issuedAt)}
                      </td>
                      <td>
                        <div className="act-actions">
                          <button
                            className="act-btn-action view"
                            title="ดูตัวอย่างใบประกาศฯ"
                            onClick={() => setPreviewCert(cert)}
                          >
                            <FaEye />
                          </button>
                          {/* <button
                            className="act-btn-action delete"
                            title="เพิกถอนสิทธิ์ใบประกาศฯ"
                            onClick={() =>
                              handleDelete(
                                cert.certId,
                                cert.userName,
                                cert.courseGroup,
                              )
                            }
                          >
                            <FaTrash />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredCertificates.length === 0 && (
                    <tr>
                      <td colSpan="5" className="act-empty-state">
                        ไม่พบข้อมูลรายชื่อผู้ได้รับใบประกาศนียบัตรในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal ดูตัวอย่างใบประกาศนียบัตร */}
      {previewCert && (
        <div
          className="act-preview-overlay"
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="act-preview-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="act-preview-header">
              <h3>ตัวอย่างใบประกาศนียบัตร - {previewCert.userName}</h3>
              <button
                className="act-preview-close"
                onClick={() => setPreviewCert(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="act-preview-body">
              <div className="act-certificate-frame">
                <CertificateTemplate
                  cert={{
                    certId: previewCert.certId,
                    certNumber: previewCert.certNumber,
                    course_name:
                      previewCert.courseName || "AI Ethics Management",
                    background_url: previewCert.backgroundUrl,
                    logo_url: previewCert.logoUrl,
                    signature_url: previewCert.signatureUrl,
                    signatory_name: previewCert.signatoryName,
                    signatory_position: previewCert.signatoryPosition,
                    issuer_name: previewCert.issuerName,
                    description: previewCert.description,
                    passDate: formatCertDate(previewCert.issuedAt),
                  }}
                  userName={previewCert.userName}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificate;
