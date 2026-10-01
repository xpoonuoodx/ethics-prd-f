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
  Building2,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./style/Dashboard.css";

// สีและไอคอนประจำ 3 กลุ่มบทบาท ใช้ร่วมกันทั้งกราฟ Gauge, การ์ดหลักสูตร และแผงข้อมูลหลักสูตรสถิตย์
// ใช้โทนสดใสแบบ infographic (แดงกุหลาบ/ฟ้า/ส้มทอง) ให้ตัดกันชัดเจนบนวง gauge หนา ๆ
const ROLE_META = {
  executive: { color: "#e11d48", icon: User },
  developer: { color: "#2563eb", icon: Code2 },
  general: { color: "#f59e0b", icon: UserRound },
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
// ดีไซน์วงหนา ปลายมน สีสด ตามภาพอ้างอิงที่ต้องการ (ใช้ cornerRadius + paddingAngle ของ recharts
// จำลองปลายมน แทนการ stroke-linecap ตรง ๆ ซึ่ง Pie/Cell ไม่รองรับ)
function CircleGauge({ value, color, size = 150, valueFontSize = 26 }) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  const data = [
    { name: "value", value: safeValue },
    { name: "remainder", value: Math.max(100 - safeValue, 0) },
  ];
  // เว้นช่องว่าง/มนปลายเฉพาะตอนไม่ใช่ 0% หรือ 100% เต็มวง กันเกิดรอยหักแปลก ๆ ตอนสุดขอบ
  const isPartial = safeValue > 0 && safeValue < 100;
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
            innerRadius="68%"
            outerRadius="100%"
            cornerRadius={isPartial ? 10 : 0}
            paddingAngle={isPartial ? 4 : 0}
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#eef1f6" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pub-db-gauge-center-full">
        <span
          className="pub-db-gauge-value"
          style={{ color, fontSize: valueFontSize }}
        >
          {safeValue}
          <span className="pub-db-gauge-percent-sign">%</span>
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

          {/* Hero section: 3 gauge ใหญ่ระดับความพร้อมตามบทบาท - จุดสนใจหลักของหน้า
              (legend เกณฑ์คะแนนแชร์ร่วมกันแถวเดียวด้านล่าง แทนที่จะพิมพ์ซ้ำ 3 รอบเหมือนก่อน) */}
          <div className="pub-db-card pub-db-hero-gauge-card">
            <div className="pub-db-card-header">
              <h3>สถานภาพจริยธรรมปัญญาประดิษฐ์ของไทย จำแนกตามบทบาท</h3>
            </div>
            <div className="pub-db-hero-gauge-grid">
              {roleStats.map((role) => {
                const meta = ROLE_META[role.key] || ROLE_META.general;
                const Icon = meta.icon;
                return (
                  <div className="pub-db-hero-gauge-col" key={role.key}>
                    <CircleGauge
                      value={role.avgScorePct}
                      color={meta.color}
                      size={190}
                      valueFontSize={36}
                    />
                    <div className="pub-db-role-head">
                      <span
                        className="pub-db-role-icon"
                        style={{ background: `${meta.color}1a`, color: meta.color }}
                      >
                        <Icon size={17} />
                      </span>
                      <span className="pub-db-role-name">{role.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pub-db-score-legend-shared">
              {SCORE_BANDS.map((band) => (
                <span className="pub-db-score-legend-item" key={band.label}>
                  <span className="pub-db-score-dot" style={{ background: band.color }} />
                  {band.label} <em>({band.range})</em>
                </span>
              ))}
            </div>
          </div>

          {/* Row 2: อัตราผ่านตามหลักสูตร (กว้าง) + สัดส่วนภาคส่วน (แคบ) */}
          <div className="pub-db-row-2">
            <div className="pub-db-card pub-db-course-rate-card">
              <div className="pub-db-card-header">
                <h3>อัตราผ่านเกณฑ์ AI Ethics ตามหลักสูตร (Course Online)</h3>
              </div>
              <div className="pub-db-course-cards-grid">
                {courseStats.map((course, idx) => {
                  const meta = ROLE_META[course.key] || ROLE_META.general;
                  const Icon = meta.icon;
                  const notPassedPct =
                    course.registered > 0
                      ? Math.round((course.notPassed / course.registered) * 1000) / 10
                      : 0;
                  return (
                    <div className="pub-db-course-card" key={course.key}>
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
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pub-db-card pub-db-sector-card">
              <div className="pub-db-card-header pub-db-card-header-icon-row">
                <span className="pub-db-card-header-icon">
                  <Building2 size={17} />
                </span>
                <h3>สถิติโครงการ AI จำแนกตามภาคส่วน</h3>
              </div>
              {sectorDistribution.length > 0 ? (
                <div className="pub-db-sector-body">
                  <div className="pub-db-sector-chart-wrap">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={sectorDistribution}
                          dataKey="count"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          innerRadius={66}
                          outerRadius={92}
                          cornerRadius={8}
                          paddingAngle={3}
                          stroke="none"
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
                    {sectorDistribution.map((s, index) => {
                      const pct =
                        sectorTotal > 0
                          ? Math.round((s.count / sectorTotal) * 1000) / 10
                          : 0;
                      const color = SECTOR_COLORS[index % SECTOR_COLORS.length];
                      return (
                        <li key={s.sector}>
                          <div className="pub-db-sector-row-top">
                            <span
                              className="pub-db-sector-dot"
                              style={{ background: color }}
                            />
                            <span className="pub-db-sector-name">{s.label}</span>
                            <span className="pub-db-sector-pct">{pct}%</span>
                          </div>
                          <div className="pub-db-sector-bar-track">
                            <div
                              className="pub-db-sector-bar-fill"
                              style={{ width: `${pct}%`, background: color }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="pub-db-empty-chart">ยังไม่มีข้อมูลโครงการในระบบ</div>
              )}
            </div>
          </div>

          {/* ข้อมูลหลักสูตร - เต็มความกว้าง จัดเป็นการ์ดแนวนอน 3 คอลัมน์ */}
          <div className="pub-db-course-info-block">
            <h2 className="pub-db-section-title">
              ข้อมูลหลักสูตรออนไลน์ AI Ethics (3 หลักสูตร)
            </h2>
            <div className="pub-db-info-grid">
              {COURSE_INFO.map((info, idx) => {
                const meta = ROLE_META[info.key] || ROLE_META.general;
                const Icon = meta.icon;
                return (
                  <div className="pub-db-card pub-db-info-card" key={info.key}>
                    <div className="pub-db-info-card-head">
                      <span
                        className="pub-db-info-num"
                        style={{ background: meta.color }}
                      >
                        {idx + 1}
                      </span>
                      <span className="pub-db-info-icon" style={{ color: meta.color }}>
                        <Icon size={18} />
                      </span>
                    </div>
                    <p className="pub-db-info-title">{info.title}</p>
                    <span className="pub-db-info-badge">เกณฑ์ผ่าน ≥ 80%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
