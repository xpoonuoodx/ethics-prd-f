import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
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
import CertificateTemplate from "../../component/CertificateTemplate";
import "./style/UserResult.css";

const UserResult = () => {
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
      navigate("/user-test");
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
      <SidebarUser />
      <div className="user-portal-content">
        <div className="ures-admin-container">
          <button
            className="ures-back-btn"
            onClick={() => navigate("/user-test")}
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
                    navigate(`/user-test-detail?chapter=${chapterInfo.id}`)
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
                    onClick={() => navigate("/user-certificate")}
                  >
                    ดูประกาศนียบัตรทั้งหมด
                  </button>
                </>
              ) : (
                <button
                  className="ures-btn-primary"
                  onClick={() => navigate("/user-test")}
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
                  <CertificateTemplate
                    cert={{
                      certId: certSettings.certId || 0,
                      certNumber: certSettings.certNumber,
                      course_name:
                        certSettings.course_name || "AI Ethics Management",
                      background_url: certSettings.background_url,
                      logo_url: certSettings.logo_url,
                      signature_url: certSettings.signature_url,
                      signatory_name: certSettings.signatory_name,
                      signatory_position: certSettings.signatory_position,
                      issuer_name: certSettings.issuer_name,
                      description: certSettings.description,
                      passDate: new Date().toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "Asia/Bangkok",
                      }),
                    }}
                    userName={userName}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserResult;
