import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaDownload,
  FaRedo,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./style/UserResult.css";

const UserResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const certRef = useRef(null); // Reference สำหรับจับภาพทำ PDF

  const resultData = location.state?.resultData;
  const chapterInfo = location.state?.chapterInfo;
  const [userName, setUserName] = useState("ชื่อ-นามสกุล");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!resultData || !chapterInfo) {
      navigate("/user-test");
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserName(user.name || user.firstname || "Student");
  }, [resultData, chapterInfo, navigate]);

  if (!resultData) return null;

  // ฟังก์ชันดาวน์โหลด PDF
  const handleDownloadPDF = async () => {
    const input = certRef.current;
    if (!input) return;

    try {
      setIsGenerating(true);
      // จับภาพ HTML เป็น Canvas
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      // สร้าง PDF แนวนอน (Landscape) ขนาด A4
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${chapterInfo.title}.pdf`);
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
              {resultData.isPassed ? (
                <FaCheckCircle className="text-green" />
              ) : (
                <FaTimesCircle className="text-red" />
              )}
            </div>

            <h1 className="ures-title">
              {resultData.isPassed
                ? "ยินดีด้วย! คุณสอบผ่าน"
                : "คุณยังทำคะแนนไม่ถึงเกณฑ์ที่กำหนด"}
            </h1>
            <p className="ures-subtitle">บทเรียน: {chapterInfo.title}</p>

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
              {!resultData.isPassed ? (
                <button
                  className="ures-btn-primary"
                  onClick={() =>
                    navigate(`/user-test-detail?chapter=${chapterInfo.id}`)
                  }
                >
                  <FaRedo /> ทำแบบทดสอบอีกครั้ง
                </button>
              ) : (
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
              )}
            </div>
          </div>

          {/* =======================================
              TEMPLATE ใบประกาศนียบัตร (ซ่อนไว้สำหรับดึงเป็น PDF)
              ======================================= */}
          {resultData.isPassed && (
            <div className="ures-cert-preview-section">
              <h3 className="ures-preview-title">ตัวอย่างใบประกาศนียบัตร</h3>
              <div className="ures-cert-wrapper">
                <div className="ures-certificate-template" ref={certRef}>
                  <div className="cert-border">
                    <div className="cert-header">
                      <div className="cert-logo">AI ETHIC PORTAL</div>
                      <h2>CERTIFICATE OF COMPLETION</h2>
                      <p>ประกาศนียบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า</p>
                    </div>
                    <div className="cert-body">
                      <h1 className="cert-name">{userName}</h1>
                      <p>ได้ผ่านการทดสอบและสำเร็จหลักสูตร</p>
                      <h3 className="cert-course">{chapterInfo.title}</h3>
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
                        <div className="signature-line"></div>
                        <span>ผู้อำนวยการโครงการ (Director)</span>
                      </div>
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

export default UserResult;
