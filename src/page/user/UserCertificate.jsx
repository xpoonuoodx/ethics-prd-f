import React, { useEffect, useState } from "react";
import SidebarUser from "./SidebarUser";
import { FaCertificate, FaDownload, FaSpinner, FaTrophy } from "react-icons/fa";
import api from "../../api/Api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./style/UserCertificate.css";

const UserCertificate = () => {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [userName, setUserName] = useState("");
  const [downloadingId, setDownloadingId] = useState(null); // เช็คว่ากำลังโหลดอันไหน

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
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
    const certElement = document.getElementById(
      `cert-template-${cert.chapterId}`,
    );
    if (!certElement) return;

    try {
      setDownloadingId(cert.chapterId);
      // ทำให้โชว์ชั่วคราวเพื่อเรนเดอร์ลง Canvas
      certElement.style.display = "block";
      const canvas = await html2canvas(certElement, {
        scale: 2,
        useCORS: true,
      });
      certElement.style.display = "none"; // ซ่อนกลับ

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${cert.chapterTitle}.pdf`);
    } catch (error) {
      console.error("Download Error:", error);
    } finally {
      setDownloadingId(null);
    }
  };

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
        <div className="ucert-admin-container">
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
                    <div className="ucert-item-card" key={cert.chapterId}>
                      <div className="ucert-item-icon bg-yellow-light text-yellow">
                        <FaCertificate />
                      </div>
                      <div className="ucert-item-details">
                        <h4 className="ucert-course-title">
                          {cert.chapterTitle}
                        </h4>
                        <p className="ucert-meta">
                          ได้คะแนน:{" "}
                          <strong>
                            {cert.score}/{cert.totalQuestions}
                          </strong>
                        </p>
                        <p className="ucert-meta">
                          วันที่ออกเอกสาร: {cert.passDate}
                        </p>
                      </div>
                      <button
                        className="ucert-btn-download"
                        onClick={() => handleDownload(cert)}
                        disabled={downloadingId === cert.chapterId}
                      >
                        {downloadingId === cert.chapterId ? (
                          <FaSpinner className="spin" />
                        ) : (
                          <FaDownload />
                        )}
                        {downloadingId === cert.chapterId
                          ? " กำลังโหลด..."
                          : " โหลดเอกสาร PDF"}
                      </button>

                      {/* --- DOM ที่ซ่อนไว้สำหรับสร้าง PDF ให้แต่ละใบ --- */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-9999px",
                          top: "-9999px",
                        }}
                      >
                        <div
                          id={`cert-template-${cert.chapterId}`}
                          className="ures-certificate-template"
                          style={{ display: "none" }}
                        >
                          <div className="cert-border">
                            <div className="cert-header">
                              <div className="cert-logo">AI ETHIC PORTAL</div>
                              <h2>CERTIFICATE OF COMPLETION</h2>
                              <p>ประกาศนียบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า</p>
                            </div>
                            <div className="cert-body">
                              <h1 className="cert-name">{userName}</h1>
                              <p>ได้ผ่านการทดสอบและสำเร็จหลักสูตร</p>
                              <h3 className="cert-course">
                                {cert.chapterTitle}
                              </h3>
                            </div>
                            <div className="cert-footer">
                              <div className="cert-date">
                                <span>วันที่สำเร็จการศึกษา</span>
                                <p>{cert.passDate}</p>
                              </div>
                              <div className="cert-signature">
                                <div className="signature-line"></div>
                                <span>ผู้อำนวยการโครงการ (Director)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ------------------------------------------- */}
                    </div>
                  ))
                ) : (
                  <div className="ucert-empty-state">
                    คุณยังไม่มีใบประกาศนียบัตร
                    (กรุณาทำแบบทดสอบให้ผ่านเกณฑ์เพื่อรับใบประกาศฯ)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCertificate;
