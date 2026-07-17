import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaArrowLeft,
  FaPrint,
  FaSearch,
  FaThumbsUp,
  FaExclamationTriangle,
  FaLightbulb,
  FaRoad,
  FaCubes,
  FaFileAlt,
  FaUserTie,
  FaLayerGroup,
} from "react-icons/fa";
import "./style/RegulatorToolsResult.css";

const RegulatorToolsResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state?.resultData;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!resultData) navigate("/regulator-tools");
  }, [resultData, navigate]);

  if (!resultData) return null;
  const guide = resultData.guideline;

  return (
    <div className="user-portal-layout">
      <SidebarRegulator />
      <div className="user-portal-content">
        <div className="utr-minimal-container">
          {/* Header */}
          <div className="utr-top-actions">
            <button
              className="utr-back-btn"
              onClick={() => navigate("/regulator-tools")}
            >
              <FaArrowLeft /> กลับ
            </button>
            <button className="utr-print-btn" onClick={() => window.print()}>
              <FaPrint /> พิมพ์เอกสาร
            </button>
          </div>

          {/* 3 Summary Cards (Like Dashboard) */}
          <div className="utr-summary-grid">
            <div className="utr-sum-card">
              <div className="sum-icon bg-blue-light">
                <FaFileAlt className="text-blue" />
              </div>
              <div className="sum-info">
                <span>รหัสอ้างอิงเอกสาร</span>
                <h3>DOC-{resultData.id || "NEW"}</h3>
              </div>
            </div>
            <div className="utr-sum-card">
              <div className="sum-icon bg-green-light">
                <FaLayerGroup className="text-green" />
              </div>
              <div className="sum-info">
                <span>{resultData.impact ? "ระดับผลกระทบ" : "ระดับความพร้อม"}</span>
                <h3>
                  {resultData.impact
                    ? resultData.impact.level_name
                    : resultData.maturity?.level_name}
                </h3>
              </div>
            </div>
            <div className="utr-sum-card">
              <div className="sum-icon bg-purple-light">
                <FaUserTie className="text-purple" />
              </div>
              <div className="sum-info">
                <span>สายงานวิเคราะห์</span>
                <h3>{resultData.userType?.toUpperCase()}</h3>
              </div>
            </div>
          </div>

          <div className="utr-content-layout">
            {/* Left Column: Principles & Components */}
            <div className="utr-left-col">
              <div className="utr-white-card">
                <h3 className="card-title">
                  หลักการที่ถูกเลือก ({resultData.principles?.length})
                </h3>
                <div className="utr-tags">
                  {resultData.principles?.map((p) => (
                    <span key={p.id} className="pill-tag">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="utr-white-card mt-20">
                <h3 className="card-title">
                  <FaCubes className="text-blue" /> องค์ประกอบที่พบ
                </h3>
                <div className="utr-comp-list">
                  {resultData.components?.map((comp) => (
                    <div key={comp.id} className="comp-item">
                      <strong>[{comp.id}]</strong> {comp.title}
                    </div>
                  ))}
                  {(!resultData.components ||
                    resultData.components.length === 0) && (
                    <div className="comp-empty">ไม่มีองค์ประกอบในเกณฑ์นี้</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Guidelines */}
            <div className="utr-right-col">
              <h2 className="utr-section-title">
                ผลการวิเคราะห์และแนวทางปฏิบัติ
              </h2>

              {guide ? (
                <div className="utr-guides-stack">
                  <div className="utr-guide-card">
                    <div className="guide-icon bg-blue-light text-blue">
                      <FaSearch />
                    </div>
                    <div className="guide-content">
                      <h4>การวิเคราะห์ภาพรวม (Analysis)</h4>
                      <p>{guide.analysis || "-"}</p>
                    </div>
                  </div>

                  <div className="utr-guide-card">
                    <div className="guide-icon bg-green-light text-green">
                      <FaThumbsUp />
                    </div>
                    <div className="guide-content">
                      <h4>จุดแข็ง (Strengths)</h4>
                      <p>{guide.strengths || "-"}</p>
                    </div>
                  </div>

                  <div className="utr-guide-card">
                    <div className="guide-icon bg-orange-light text-orange">
                      <FaExclamationTriangle />
                    </div>
                    <div className="guide-content">
                      <h4>ช่องว่างที่ต้องพัฒนา (Gaps)</h4>
                      <p>{guide.gaps || "-"}</p>
                    </div>
                  </div>

                  <div className="utr-guide-card">
                    <div className="guide-icon bg-red-light text-red">
                      <FaExclamationTriangle />
                    </div>
                    <div className="guide-content">
                      <h4>ความเสี่ยง (Risks)</h4>
                      <p>{guide.risks || "-"}</p>
                    </div>
                  </div>

                  <div className="utr-guide-card">
                    <div className="guide-icon bg-purple-light text-purple">
                      <FaLightbulb />
                    </div>
                    <div className="guide-content">
                      <h4>ข้อเสนอแนะ (Recommendations)</h4>
                      <p>{guide.recommendations || "-"}</p>
                    </div>
                  </div>

                  <div className="utr-guide-card">
                    <div className="guide-icon bg-gray-light text-dark">
                      <FaRoad />
                    </div>
                    <div className="guide-content">
                      <h4>แผนงาน (Roadmap)</h4>
                      <p>{guide.roadmap || "-"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="utr-empty-state">
                  ยังไม่มีข้อมูลแนวทางปฏิบัติสำหรับระดับความพร้อมนี้
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorToolsResult;
