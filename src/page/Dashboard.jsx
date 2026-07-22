import React, { useEffect, useRef, useState } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  CalendarDays,
  Download,
  Loader2,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  User,
  Code2,
  UserRound,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./style/Dashboard.css";

// สีและไอคอนประจำ 3 กลุ่มบทบาท ใช้ร่วมกันทั้งกราฟ Gauge, การ์ดหลักสูตร และแผงข้อมูลหลักสูตรสถิตย์
const ROLE_META = {
  executive: { color: "#2563eb", icon: User },
  developer: { color: "#16a34a", icon: Code2 },
  general: { color: "#7c3aed", icon: UserRound },
};

// Legend อธิบายระดับคะแนน (ค่าคงที่เชิงอธิบาย ใช้ตีความ % ของ Gauge ไม่ผูกกับข้อมูลจริง)
const SCORE_BANDS = [
  { label: "ระดับ 5 (ดีเยี่ยม)", range: "80-100%", color: "#16a34a" },
  { label: "ระดับ 4 (ดี)", range: "60-79%", color: "#84cc16" },
  { label: "ระดับ 3 (ปานกลาง)", range: "40-59%", color: "#eab308" },
  { label: "ระดับ 2 (ต้องปรับปรุง)", range: "20-39%", color: "#f97316" },
  { label: "ระดับ 1 (ต้องเร่งแก้ไข)", range: "0-19%", color: "#ef4444" },
];

// รายชื่อหลักสูตร 3 กลุ่ม เป็นข้อมูลสถิตย์ (ระบบเก็บเนื้อหาเป็นรายบท ไม่มีชื่อ "หลักสูตร" รวมเก็บไว้ในฐานข้อมูล)
const COURSE_INFO = [
  {
    key: "executive",
    title: "หลักสูตรจริยธรรมปัญญาประดิษฐ์ สำหรับผู้บริหาร ผู้กำหนด และผู้กำกับนโยบาย",
  },
  {
    key: "developer",
    title: "หลักสูตรจริยธรรมปัญญาประดิษฐ์ สำหรับนักวิจัย นักพัฒนา และโปรแกรมเมอร์",
  },
  {
    key: "general",
    title: "หลักสูตรจริยธรรมปัญญาประดิษฐ์ สำหรับผู้ใช้งานทั่วไป และผู้มีผลกระทบ",
  },
];

const SECTOR_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#0d9488",
  "#16a34a",
  "#f97316",
  "#64748b",
  "#cbd5e1",
];

// Gauge วงกลมเต็มวง (โดนัท progress ring) ใช้ร่วมกันทั้งกราฟระดับความพร้อม (ใหญ่) และอัตราผ่านหลักสูตร (เล็ก)
function CircleGauge({ value, color, size = 150, valueFontSize = 26 }) {
  const data = [
    { name: "value", value },
    { name: "remainder", value: Math.max(100 - value, 0) },
  ];
  return (
    <div className="pub-db-gauge-wrap" style={{ height: size }}>
      <ResponsiveContainer width="100%" height={size}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius="72%"
            outerRadius="100%"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pub-db-gauge-center-full">
        <span
          className="pub-db-gauge-value"
          style={{ color, fontSize: valueFontSize }}
        >
          {value}%
        </span>
      </div>
    </div>
  );
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

  const [summary, setSummary] = useState(null);
  const [sectorDistribution, setSectorDistribution] = useState([]);
  const [roleStats, setRoleStats] = useState([]);
  const [courseStats, setCourseStats] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const API_URL = `${import.meta.env.VITE_APP_API_ENDPOINT}/public/dashboard-stats`;
      const response = await axios.get(API_URL);

      if (response.data && response.data.success) {
        const data = response.data.data;
        setSummary(data.summary);
        setSectorDistribution(data.sectorDistribution || []);
        setRoleStats(data.roleStats || []);
        setCourseStats(data.courseStats || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setSummary(null);
      setSectorDistribution([]);
      setRoleStats([]);
      setCourseStats([]);
    } finally {
      setLoading(false);
    }
  };

  // ดาวน์โหลดรายงานเป็น PDF จริงจากเนื้อหาที่แสดงบนหน้าจอ (capture DOM -> รูปภาพ -> ตัดหน้า A4)
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fafbfc",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`AI-Ethics-Dashboard-Report_${dateStr}.pdf`);
    } catch (error) {
      console.error("Download PDF Error:", error);
    } finally {
      setDownloading(false);
    }
  };

  const now = new Date();
  const dateLabel = now.toLocaleDateString("th-TH-u-ca-buddhist", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const DeltaTag = ({ pct }) => {
    if (pct === 0) return <span className="pub-db-delta neutral">ไม่เปลี่ยนแปลง</span>;
    const isUp = pct > 0;
    return (
      <span className={`pub-db-delta ${isUp ? "up" : "down"}`}>
        {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {isUp ? "+" : ""}
        {pct}% จากเดือนก่อน
      </span>
    );
  };

  const sectorTotal = sectorDistribution.reduce((s, x) => s + x.count, 0);

  if (loading) {
    return (
      <div className="pub-db-wrapper flex-center">
        <div className="pub-db-loader"></div>
        <p style={{ marginTop: "15px", color: "#64748b" }}>
          กำลังโหลดข้อมูลสถิติภาพรวม...
        </p>
      </div>
    );
  }

  return (
    <div className="pub-db-wrapper">
      <Tabbar />

      <main className="pub-db-main-content" ref={reportRef}>
        {/* Header Banner */}
        <div className="pub-db-header-banner">
          <div className="pub-db-header-inner">
            <div className="pub-db-brand">
              <div>
                <h1 className="pub-db-title">AI REGISTRY ประเทศไทย</h1>
                <p className="pub-db-subtitle">
                  ภาพรวมการพัฒนาปัญญาประดิษฐ์ตามแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ของประเทศไทย
                  (AI Ethics Guideline)
                </p>
              </div>
            </div>
            <div className="pub-db-header-actions">
              <span className="pub-db-date-pill">
                <CalendarDays size={15} />
                {dateLabel} {timeLabel} น.
              </span>
              <button
                className="pub-db-btn-export"
                onClick={handleDownloadPDF}
                disabled={downloading}
              >
                {downloading ? (
                  <Loader2 size={17} className="pub-db-spin-icon" />
                ) : (
                  <Download size={17} />
                )}
                {downloading ? "กำลังสร้างไฟล์..." : "ดาวน์โหลดรายงาน"}
              </button>
            </div>
          </div>
        </div>

        <div className="pub-db-body">
          {/* KPI Cards (5 การ์ด) */}
          <div className="pub-db-stats-grid">
            <div className="pub-db-stat-card">
              <div className="pub-db-stat-icon-wrapper blue">
                <Cpu size={22} />
              </div>
              <div className="pub-db-stat-info">
                <span className="pub-db-stat-label">โครงการ AI ที่ขึ้นทะเบียน</span>
                <h3 className="pub-db-stat-value">
                  {(summary?.totalProjects || 0).toLocaleString()}
                  <small> โครงการ</small>
                </h3>
                <DeltaTag pct={summary?.totalProjectsDeltaPct || 0} />
              </div>
            </div>

            <div className="pub-db-stat-card">
              <div className="pub-db-stat-icon-wrapper green">
                <CheckCircle2 size={22} />
              </div>
              <div className="pub-db-stat-info">
                <span className="pub-db-stat-label">โครงการที่ปฏิบัติตาม AI Ethics</span>
                <h3 className="pub-db-stat-value">
                  {(summary?.compliantProjects || 0).toLocaleString()}
                  <small> โครงการ</small>
                </h3>
                <span className="pub-db-delta neutral">
                  {summary?.compliantPct || 0}% ของทั้งหมด
                </span>
              </div>
            </div>

            <div className="pub-db-stat-card">
              <div className="pub-db-stat-icon-wrapper purple">
                <AlertTriangle size={22} />
              </div>
              <div className="pub-db-stat-info">
                <span className="pub-db-stat-label">โครงการที่ต้องปรับปรุงตาม AI Ethics</span>
                <h3 className="pub-db-stat-value">
                  {(summary?.needsImprovementProjects || 0).toLocaleString()}
                  <small> โครงการ</small>
                </h3>
                <span className="pub-db-delta neutral">
                  {summary?.needsImprovementPct || 0}% ของทั้งหมด
                </span>
              </div>
            </div>

            <div className="pub-db-stat-card">
              <div className="pub-db-stat-icon-wrapper orange">
                <Clock size={22} />
              </div>
              <div className="pub-db-stat-info">
                <span className="pub-db-stat-label">อยู่ระหว่างประเมิน</span>
                <h3 className="pub-db-stat-value">
                  {(summary?.underAssessmentProjects || 0).toLocaleString()}
                  <small> โครงการ</small>
                </h3>
                <span className="pub-db-delta neutral">
                  {summary?.underAssessmentPct || 0}% ของทั้งหมด
                </span>
              </div>
            </div>

            <div className="pub-db-stat-card">
              <div className="pub-db-stat-icon-wrapper teal">
                <Users size={22} />
              </div>
              <div className="pub-db-stat-info">
                <span className="pub-db-stat-label">ผู้ใช้งานทั้งหมด</span>
                <h3 className="pub-db-stat-value">
                  {(summary?.totalUsers || 0).toLocaleString()}
                  <small> คน</small>
                </h3>
                <DeltaTag pct={summary?.totalUsersDeltaPct || 0} />
              </div>
            </div>
          </div>

          {/* Row 2: สัดส่วนภาคส่วน + ระดับความพร้อมตามบทบาท */}
          <div className="pub-db-row-2">
            <div className="pub-db-card pub-db-sector-card">
              <div className="pub-db-card-header">
                <h3>สถิติโครงการ AI จำแนกตามภาคส่วน</h3>
              </div>
              {sectorDistribution.length > 0 ? (
                <div className="pub-db-sector-body">
                  <div className="pub-db-sector-chart-wrap">
                    <ResponsiveContainer width="100%" height={230}>
                      <PieChart>
                        <Pie
                          data={sectorDistribution}
                          dataKey="count"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          innerRadius={64}
                          outerRadius={92}
                          paddingAngle={2}
                        >
                          {sectorDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "10px",
                            border: "none",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pub-db-sector-center">
                      <span className="pub-db-sector-total">
                        {sectorTotal.toLocaleString()}
                      </span>
                      <span className="pub-db-sector-total-label">โครงการ</span>
                    </div>
                  </div>
                  <ul className="pub-db-sector-legend">
                    {sectorDistribution.map((s, index) => (
                      <li key={s.sector}>
                        <span
                          className="pub-db-sector-dot"
                          style={{
                            background: SECTOR_COLORS[index % SECTOR_COLORS.length],
                          }}
                        />
                        <span className="pub-db-sector-name">{s.label}</span>
                        <span className="pub-db-sector-count">
                          {s.count.toLocaleString()} (
                          {sectorTotal > 0
                            ? Math.round((s.count / sectorTotal) * 1000) / 10
                            : 0}
                          %)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="pub-db-empty-chart">ยังไม่มีข้อมูลโครงการในระบบ</div>
              )}
            </div>

            <div className="pub-db-card pub-db-role-card">
              <div className="pub-db-card-header">
                <h3>สถานภาพจริยธรรมปัญญาประดิษฐ์ของไทย จำแนกตามบทบาท</h3>
              </div>
              <div className="pub-db-role-grid">
                {roleStats.map((role, idx) => {
                  const meta = ROLE_META[role.key] || ROLE_META.general;
                  const Icon = meta.icon;
                  return (
                    <div
                      className={`pub-db-role-col ${idx > 0 ? "with-divider" : ""}`}
                      key={role.key}
                    >
                      <div className="pub-db-role-head">
                        <span
                          className="pub-db-role-icon"
                          style={{ background: `${meta.color}1a`, color: meta.color }}
                        >
                          <Icon size={17} />
                        </span>
                        <span className="pub-db-role-name">{role.label}</span>
                      </div>
                      <CircleGauge
                        value={role.avgScorePct}
                        color={meta.color}
                        size={150}
                        valueFontSize={26}
                      />
                      <span className="pub-db-role-caption">ระดับประเภท</span>
                      <ul className="pub-db-score-legend">
                        {SCORE_BANDS.map((band) => (
                          <li key={band.label}>
                            <span
                              className="pub-db-score-dot"
                              style={{ background: band.color }}
                            />
                            {band.label}
                            <span className="pub-db-score-range">{band.range}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: สถานภาพการเรียนรู้ + ข้อมูลหลักสูตร */}
          <div className="pub-db-row-3">
            <div className="pub-db-course-block">
              <h2 className="pub-db-section-title">
                สถานภาพการเรียนรู้ AI Ethics (Course Online)
              </h2>
              <div className="pub-db-course-cards-grid">
                {courseStats.map((course, idx) => {
                  const meta = ROLE_META[course.key] || ROLE_META.general;
                  const Icon = meta.icon;
                  const notPassedPct =
                    course.registered > 0
                      ? Math.round((course.notPassed / course.registered) * 1000) / 10
                      : 0;
                  return (
                    <div className="pub-db-card pub-db-course-card" key={course.key}>
                      <div className="pub-db-course-card-head">
                        <span
                          className="pub-db-course-num"
                          style={{ background: meta.color }}
                        >
                          {idx + 1}
                        </span>
                        <h4>{course.label}</h4>
                      </div>
                      <div className="pub-db-course-registered">
                        <Icon size={15} />
                        ผู้ลงทะเบียน <strong>{course.registered.toLocaleString()}</strong>{" "}
                        คน
                      </div>
                      <CircleGauge
                        value={course.passRate}
                        color={meta.color}
                        size={120}
                        valueFontSize={22}
                      />
                      <span className="pub-db-course-caption">อัตราผ่าน</span>
                      <div className="pub-db-course-legend">
                        <span className="pass">
                          <span className="pub-db-score-dot" style={{ background: "#16a34a" }} />
                          ผ่านเกณฑ์ (≥80%) {course.passed.toLocaleString()} คน (
                          {course.passRate}%)
                        </span>
                        <span className="fail">
                          <span className="pub-db-score-dot" style={{ background: "#ef4444" }} />
                          ไม่ผ่านเกณฑ์ {course.notPassed.toLocaleString()} คน (
                          {notPassedPct}%)
                        </span>
                      </div>
                      <span className="pub-db-course-footnote">
                        ต้องมีคะแนน ≥ 80% จึงจะได้รับใบประกาศนียบัตร
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pub-db-course-info-block">
              <h2 className="pub-db-section-title">
                ข้อมูลหลักสูตรออนไลน์ AI Ethics (3 หลักสูตร)
              </h2>
              <div className="pub-db-card pub-db-info-card">
                <ul className="pub-db-info-list">
                  {COURSE_INFO.map((info, idx) => {
                    const meta = ROLE_META[info.key] || ROLE_META.general;
                    const Icon = meta.icon;
                    return (
                      <li key={info.key}>
                        <span
                          className="pub-db-info-num"
                          style={{ background: meta.color }}
                        >
                          {idx + 1}
                        </span>
                        <span className="pub-db-info-icon" style={{ color: meta.color }}>
                          <Icon size={16} />
                        </span>
                        <span className="pub-db-info-title">{info.title}</span>
                        <span className="pub-db-info-badge">เกณฑ์ผ่าน ≥ 80%</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
