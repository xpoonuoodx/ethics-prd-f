import React, { useEffect, useState } from "react";
import SidebarUser from "./SidebarUser";
import {
  FaCertificate,
  FaDownload,
  FaEye,
  FaSpinner,
  FaTrophy,
  FaTimes,
} from "react-icons/fa";
import api, { getStoredUser } from "../../api/Api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./style/UserCertificate.css";

const UserCertificate = () => {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [userName, setUserName] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = getStoredUser();
    if (user) {
      setUserName(user.name || user.firstname || "Student");
      fetchCertificates(user.id || user.user_id);
    }
  }, []);

  const fetchCertificates = async (userId) => {
    try {
      const response = await api.get(`/user/certificates/${userId}`);
      if (response.data && response.data.success) {
        setCertificates(response.data.data);
      }
    } catch (error) {
      console.error("Fetch Certificates Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cert) => {
    const certElement = document.getElementById(`cert-template-${cert.certId}`);
    if (!certElement) return;

    try {
      setDownloadingId(cert.certId);
      certElement.style.display = "block";
      const canvas = await html2canvas(certElement, {
        scale: 2,
        useCORS: true,
      });
      certElement.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${cert.course_name || "AI_Ethics"}.pdf`);
    } catch (error) {
      console.error("Download Error:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  // แม่แบบใบประกาศนียบัตร ดึงค่าตาม course_group ของใบเซอนั้นๆ (ไม่ใช่ user_type ปัจจุบันของผู้ใช้)
  // ใช้ร่วมกันทั้งตอน capture เป็น PDF และตอนโชว์ preview
  const renderCertBorder = (cert) => (
    <div
      className="ucert-cert-border"
      style={{
        backgroundImage: cert.background_url
          ? `url(${cert.background_url})`
          : "radial-gradient(#f1f5f9 1px, transparent 1px)",
        backgroundSize: cert.background_url ? "cover" : "20px 20px",
        backgroundPosition: "center",
        border: cert.background_url ? "none" : "10px solid #0f172a",
      }}
    >
      <div className="ucert-cert-header">
        {cert.logo_url ? (
          <img src={cert.logo_url} alt="Logo" className="ucert-custom-logo" />
        ) : (
          <div className="ucert-cert-logo">AI ETHIC PORTAL</div>
        )}
        <h2>CERTIFICATE OF COMPLETION</h2>
        <p>ประกาศนียบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า</p>
      </div>
      <div className="ucert-cert-body">
        <h1 className="ucert-cert-name">{userName}</h1>
        <p>ได้ผ่านการทดสอบและสำเร็จหลักสูตร</p>
        <h3 className="ucert-cert-course">{cert.course_name}</h3>
      </div>
      <div className="ucert-cert-footer">
        <div className="ucert-cert-date">
          <span>วันที่สำเร็จการศึกษา</span>
          <p>{cert.passDate}</p>
        </div>
        <div className="ucert-cert-signature">
          {cert.signature_url ? (
            <img
              src={cert.signature_url}
              alt="Signature"
              className="ucert-custom-signature"
            />
          ) : (
            <div className="ucert-signature-line"></div>
          )}
          <span>{cert.signatory_name || "ผู้อำนวยการโครงการ (Director)"}</span>
          {cert.signatory_position && (
            <span style={{ fontSize: "12px", marginTop: "2px" }}>
              {cert.signatory_position}
            </span>
          )}
        </div>
      </div>
      <div className="ucert-cert-ref">
        Reference No: AI-CERT-{String(cert.certId).padStart(3, "0")}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="ucert-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="ures-admin-container">
          <div className="ucert-header">
            <h1 className="ucert-title">ใบประกาศนียบัตรของฉัน</h1>
            <p className="ucert-subtitle">
              รวบรวมหลักฐานการผ่านการประเมินและหลักสูตรของคุณทั้งหมด
            </p>
          </div>

          <div className="ucert-card">
            <div className="ucert-card-header">
              <h3>
                <FaTrophy className="text-yellow" /> รางวัลและประกาศนียบัตร (
                {certificates.length})
              </h3>
            </div>
            <div className="ucert-card-body">
              <div className="ucert-grid">
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <div className="ucert-item-card" key={cert.certId}>
                      <div className="ucert-item-icon bg-yellow-light text-yellow">
                        <FaCertificate />
                      </div>
                      <div className="ucert-item-details">
                        <h4 className="ucert-course-title">
                          {cert.course_name}
                        </h4>
                        <p className="ucert-meta">
                          สอบผ่านครบ:{" "}
                          <strong>
                            {cert.score}/{cert.totalQuestions} บทเรียน
                          </strong>
                        </p>
                        <p className="ucert-meta">
                          วันที่ออกเอกสาร: {cert.passDate}
                        </p>
                        <p
                          className="ucert-meta"
                          style={{ fontSize: "12px", color: "#94a3b8" }}
                        >
                          รหัสอ้างอิง: AI-CERT-
                          {String(cert.certId).padStart(3, "0")}
                        </p>
                      </div>
                      <div className="ucert-item-actions">
                        <button
                          className="ucert-btn-preview"
                          onClick={() => setPreviewCert(cert)}
                        >
                          <FaEye /> ดูตัวอย่าง
                        </button>
                        <button
                          className="ucert-btn-download"
                          onClick={() => handleDownload(cert)}
                          disabled={downloadingId === cert.certId}
                        >
                          {downloadingId === cert.certId ? (
                            <FaSpinner className="spin" />
                          ) : (
                            <FaDownload />
                          )}
                          {downloadingId === cert.certId
                            ? " กำลังโหลด..."
                            : " โหลดเอกสาร PDF"}
                        </button>
                      </div>

                      {/* --- DOM ที่ซ่อนไว้สำหรับสร้าง PDF (ดึงค่าแม่แบบมาใช้) --- */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-9999px",
                          top: "-9999px",
                        }}
                      >
                        <div
                          id={`cert-template-${cert.certId}`}
                          className="ucert-certificate-template"
                          style={{ display: "none" }}
                        >
                          {renderCertBorder(cert)}
                        </div>
                      </div>
                      {/* ------------------------------------------- */}
                    </div>
                  ))
                ) : (
                  <div className="ucert-empty-state">
                    คุณยังไม่มีใบประกาศนียบัตร
                    <br />
                    <span
                      style={{
                        fontSize: "13px",
                        marginTop: "5px",
                        display: "inline-block",
                      }}
                    >
                      (กรุณาทำแบบทดสอบให้ผ่านเกณฑ์ให้ครบทุกบทเรียนเพื่อรับใบประกาศฯ)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal ดูตัวอย่างใบประกาศนียบัตร */}
      {previewCert && (
        <div
          className="ucert-preview-overlay"
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="ucert-preview-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ucert-preview-header">
              <h3>ตัวอย่างใบประกาศนียบัตร</h3>
              <button
                className="ucert-preview-close"
                onClick={() => setPreviewCert(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="ucert-preview-body">
              <div
                className="ucert-certificate-template"
                style={{ display: "block" }}
              >
                {renderCertBorder(previewCert)}
              </div>
            </div>
            <div className="ucert-preview-footer">
              <button
                className="ucert-btn-download"
                onClick={() => handleDownload(previewCert)}
                disabled={downloadingId === previewCert.certId}
              >
                {downloadingId === previewCert.certId ? (
                  <FaSpinner className="spin" />
                ) : (
                  <FaDownload />
                )}
                {downloadingId === previewCert.certId
                  ? " กำลังโหลด..."
                  : " โหลดเอกสาร PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCertificate;
