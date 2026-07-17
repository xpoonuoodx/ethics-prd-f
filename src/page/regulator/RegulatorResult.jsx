import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaDownload,
  FaRedo,
  FaBookOpen,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getStoredUser } from "../../api/Api";
import "./style/RegulatorResult.css";

const RegulatorResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const certRef = useRef(null);

  const resultData = location.state?.resultData;
  const chapterInfo = location.state?.chapterInfo;
  const [userName, setUserName] = useState("ชื่อ-นามสกุล");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!resultData || !chapterInfo) {
      navigate("/regulator-test");
    }
    const user = getStoredUser();
    if (user) setUserName(user.name || user.firstname || "Student");
  }, [resultData, chapterInfo, navigate]);

  if (!resultData || !chapterInfo) return null;

  const isChapterPassed = resultData.isPassed;
  const isAllPassed = resultData.isAllPassed;
  const certSettings = resultData.certSettings || {}; // ดึง Setting มาใช้งาน

  const handleDownloadPDF = async () => {
    const input = certRef.current;
    if (!input) return;

    try {
      setIsGenerating(true);
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_AIEthics_${userName}.pdf`);
    } catch (error) {
      console.error("PDF Generation Failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="user-portal-layout">
      <SidebarRegulator />
      <div className="user-portal-content">
        <div className="ures-admin-container">
          <button
            className="ures-back-btn"
            onClick={() => navigate("/regulator-test")}
          >
            <FaArrowLeft /> กลับหน้ารายการแบบทดสอบ
          </button>

          <div className="ures-main-card">
            <div className="ures-status-icon">
              {isChapterPassed ? (
                <FaCheckCircle className="text-green" />
              ) : (
                <FaTimesCircle className="text-red" />
              )}
            </div>

            <h1 className="ures-title">
              {!isChapterPassed
                ? "คุณยังทำคะแนนไม่ถึงเกณฑ์ที่กำหนด"
                : isAllPassed
                  ? "ยินดีด้วย! คุณสอบผ่านครบทุกบทเรียนแล้ว"
                  : "ยินดีด้วย! คุณสอบผ่านบทเรียนนี้แล้ว"}
            </h1>

            <p className="ures-subtitle">บทเรียน: {chapterInfo.title}</p>

            {!isAllPassed && isChapterPassed && (
              <p
                style={{
                  color: "#f59e0b",
                  fontSize: "14px",
                  marginTop: "10px",
                  fontWeight: "600",
                }}
              >
                * กรุณาทำแบบทดสอบในบทอื่นๆ ให้ผ่านครบถ้วนเพื่อรับใบประกาศนียบัตร
              </p>
            )}

            <div className="ures-score-board">
              <div className="ures-score-col">
                <span className="ures-label">คะแนนที่ได้</span>
                <div className="ures-score-value text-blue">
                  {resultData.score} <span>/ {resultData.totalQuestions}</span>
                </div>
              </div>
              <div className="ures-score-divider"></div>
              <div className="ures-score-col">
                <span className="ures-label">คิดเป็นร้อยละ</span>
                <div className="ures-score-value">
                  {resultData.scorePercentage.toFixed(0)}%
                </div>
              </div>
              <div className="ures-score-divider"></div>
              <div className="ures-score-col">
                <span className="ures-label">เกณฑ์การผ่าน</span>
                <div className="ures-score-value text-muted">
                  {chapterInfo.passing_percentage}%
                </div>
              </div>
            </div>

            <div className="ures-actions">
              {!isChapterPassed ? (
                <button
                  className="ures-btn-primary"
                  onClick={() =>
                    navigate(`/regulator-test-detail?chapter=${chapterInfo.id}`)
                  }
                >
                  <FaRedo /> ทำแบบทดสอบอีกครั้ง
                </button>
              ) : isAllPassed ? (
                <>
                  <button
                    className="ures-btn-success"
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      "กำลังสร้างเอกสาร..."
                    ) : (
                      <>
                        <FaDownload /> ดาวน์โหลดใบประกาศนียบัตร
                      </>
                    )}
                  </button>
                  <button
                    className="ures-btn-outline"
                    onClick={() => navigate("/regulator-certificate")}
                  >
                    ดูประกาศนียบัตรทั้งหมด
                  </button>
                </>
              ) : (
                <button
                  className="ures-btn-primary"
                  onClick={() => navigate("/regulator-test")}
                >
                  <FaBookOpen /> ไปทำบทเรียนอื่นต่อ
                </button>
              )}
            </div>
          </div>

          {/* =======================================
              TEMPLATE ใบประกาศนียบัตร (ดึงค่า Dynamic)
              ======================================= */}
          {isAllPassed && (
            <div className="ures-cert-preview-section">
              <h3 className="ures-preview-title">
                ตัวอย่างใบประกาศนียบัตรหลักสูตรสมบูรณ์
              </h3>
              <div className="ures-cert-wrapper">
                <div className="ures-certificate-template" ref={certRef}>
                  <div
                    className="cert-border"
                    style={{
                      backgroundImage: certSettings.background_url
                        ? `url(${certSettings.background_url})`
                        : "radial-gradient(#f1f5f9 1px, transparent 1px)",
                      backgroundSize: certSettings.background_url
                        ? "cover"
                        : "20px 20px",
                      backgroundPosition: "center",
                      border: certSettings.background_url
                        ? "none"
                        : "10px solid #0f172a",
                    }}
                  >
                    <div className="cert-header">
                      {certSettings.logo_url ? (
                        <img
                          src={certSettings.logo_url}
                          alt="Logo"
                          className="cert-custom-logo"
                        />
                      ) : (
                        <div className="cert-logo">AI ETHIC PORTAL</div>
                      )}
                      <h2>CERTIFICATE OF COMPLETION</h2>
                      <p>ประกาศนียบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า</p>
                    </div>
                    <div className="cert-body">
                      <h1 className="cert-name">{userName}</h1>
                      <p>ได้ผ่านการทดสอบและสำเร็จหลักสูตร</p>
                      <h3 className="cert-course">
                        {certSettings.course_name || "AI Ethics Management"}
                      </h3>
                    </div>
                    <div className="cert-footer">
                      <div className="cert-date">
                        <span>วันที่สำเร็จการศึกษา</span>
                        <p>
                          {new Date().toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="cert-signature">
                        {certSettings.signature_url ? (
                          <img
                            src={certSettings.signature_url}
                            alt="Signature"
                            className="cert-custom-signature"
                          />
                        ) : (
                          <div className="signature-line"></div>
                        )}
                        <span>
                          {certSettings.signatory_name ||
                            "ผู้อำนวยการโครงการ (Director)"}
                        </span>
                        {certSettings.signatory_position && (
                          <span style={{ fontSize: "12px", marginTop: "2px" }}>
                            {certSettings.signatory_position}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* รหัสอ้างอิง */}
                    <div className="ures-cert-ref">
                      Reference No: AI-CERT-
                      {String(certSettings.certId || 0).padStart(3, "0")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegulatorResult;
