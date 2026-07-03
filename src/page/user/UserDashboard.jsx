import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/UserDashboard.css";
import SidebarUser from "./SidebarUser";
import {
  FaPlayCircle,
  FaClipboardCheck,
  FaBookOpen,
  FaClock,
  FaStar,
  FaChartLine,
  FaTrophy,
  FaLightbulb,
  FaCertificate,
  FaSpinner,
  FaBuilding,
  FaFolderOpen,
} from "react-icons/fa";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import api from "../../api/Api";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    name: "Loading...",
    userType: "user",
    organization: "",
    projects: "",
    stats: {
      totalAttempts: 0,
      passedChapters: 0,
      certificates: 0,
      progressPercentage: 0,
    },
    radarData: [],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.id || storedUser?.user_id;

      if (!userId) {
        console.warn("ไม่พบ User ID ใน LocalStorage");
        setLoading(false);
        return;
      }

      const response = await api.get(`/user/dashboard/${userId}`);
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Fetch Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleCategory = (type) => {
    if (!type) return "user";
    const t = type.toLowerCase();
    if (t.includes("regulator") || t.includes("policy")) return "regulator";
    if (
      t.includes("provider") ||
      t.includes("developer") ||
      t.includes("researcher")
    )
      return "provider";
    return "user";
  };

  const roleCategory = getRoleCategory(dashboardData.userType);

  const roleConfig = {
    regulator: {
      title: "Regulator / Policy Maker",
      desc: "Evaluate, Regulate and Monitor (ERM) - หลักสูตรเจาะลึกสำหรับการกำกับดูแล การประเมินความเสี่ยง และการวางนโยบายที่เกี่ยวข้องกับ AI",
      img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
      badge: "ผู้กำกับดูแลและนโยบาย",
      color: "#3b82f6",
      path: "regulator",
    },
    provider: {
      title: "Developer / Service Provider",
      desc: "Plan, Development, Operation, Measurement (PDOM) - หลักสูตรเชิงปฏิบัติการสำหรับนักพัฒนา เพื่อสร้างระบบ AI ที่โปร่งใสและเป็นธรรม",
      img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop",
      badge: "นักพัฒนาและผู้ให้บริการ",
      color: "#8b5cf6",
      path: "provider",
    },
    user: {
      title: "General User",
      desc: "Aware Utilize Feedback (AUF) - หลักสูตรสร้างความตระหนักรู้ เพื่อการใช้งาน AI อย่างปลอดภัยและมีความรับผิดชอบ",
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
      badge: "ผู้ใช้งานทั่วไป",
      color: "#10b981",
      path: "user",
    },
  };

  const activeRole = roleConfig[roleCategory];

  // แมปข้อมูลสำหรับ Recharts (ป้องกัน NaN และดึงชื่อเต็มไว้โชว์ Tooltip)
  const formattedRadarData = dashboardData.radarData.map((item) => {
    const rawLevel =
      item.maturityLevel !== undefined
        ? item.maturityLevel
        : item.maturitylevel;
    const rawName = item.componentName || item.componentname || "ไม่ระบุชื่อ";
    const maxLevel = item.maxMaturity || item.maxmaturity || 5;
    const parsedLevel = parseInt(rawLevel) || 0;

    return {
      subject: rawName.length > 15 ? rawName.substring(0, 15) + "..." : rawName, // ตัดคำเพื่อไม่ให้ล้นแกนกราฟ
      fullSubjectName: rawName, // เก็บชื่อเต็มไว้โชว์ตอนเอาเมาส์ชี้
      level: parsedLevel,
      maxMark: parseInt(maxLevel),
    };
  });

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div
          className="user-portal-content"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaSpinner
            className="text-blue"
            style={{ fontSize: "40px", animation: "spin 1s linear infinite" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />

      <div className="user-portal-content">
        <div className="ud-container">
          <div className="ud-header-wrapper">
            <div className="ud-simple-header">
              <h1 className="ud-greeting-title">
                ยินดีต้อนรับ, {dashboardData.name}
              </h1>
              <p className="ud-greeting-subtitle">
                สถานะปัจจุบันของคุณคือ{" "}
                <strong style={{ color: activeRole.color }}>
                  {activeRole.title}
                </strong>{" "}
                ดูภาพรวมความก้าวหน้าและเรียนรู้ต่อได้เลย
              </p>

              <div className="ud-user-meta-tags">
                <span className="ud-meta-tag org-tag">
                  <FaBuilding /> {dashboardData.organization}
                </span>
                <span className="ud-meta-tag proj-tag">
                  <FaFolderOpen /> {dashboardData.projects}
                </span>
              </div>
            </div>

            <button
              className="ud-btn-top-cert"
              onClick={() => navigate("/user-certificate")}
            >
              <FaCertificate className="ud-icon-cert" /> ใบประกาศนียบัตร
            </button>
          </div>

          <div className="ud-quick-stats-grid">
            <div className="ud-stat-card">
              <div className="ud-stat-icon bg-blue-light">
                <FaClock className="text-blue" />
              </div>
              <div className="ud-stat-info">
                <p className="ud-stat-label">จำนวนการทำข้อสอบรวม</p>
                <h4 className="ud-stat-value">
                  {dashboardData.stats.totalAttempts}{" "}
                  <span className="ud-stat-unit">ครั้ง</span>
                </h4>
              </div>
            </div>
            <div className="ud-stat-card">
              <div className="ud-stat-icon bg-green-light">
                <FaClipboardCheck className="text-green" />
              </div>
              <div className="ud-stat-info">
                <p className="ud-stat-label">บทเรียนที่สอบผ่าน</p>
                <h4 className="ud-stat-value">
                  {dashboardData.stats.passedChapters}{" "}
                  <span className="ud-stat-unit">บท</span>
                </h4>
              </div>
            </div>
            <div className="ud-stat-card">
              <div className="ud-stat-icon bg-purple-light">
                <FaTrophy className="text-purple" />
              </div>
              <div className="ud-stat-info">
                <p className="ud-stat-label">ใบประกาศนียบัตรที่ได้รับ</p>
                <h4 className="ud-stat-value">
                  {dashboardData.stats.certificates}{" "}
                  <span className="ud-stat-unit">ใบ</span>
                </h4>
              </div>
            </div>
          </div>

          <h2 className="ud-section-heading" style={{ marginBottom: "20px" }}>
            <FaBookOpen
              className="text-blue"
              style={{ marginRight: "8px", color: activeRole.color }}
            />{" "}
            เส้นทางการเรียนรู้ของคุณ (My Learning Path)
          </h2>

          <div className="ud-hero-role-card">
            <div className="ud-hero-img-wrapper">
              <img src={activeRole.img} alt={activeRole.title} />
              <span className="ud-hero-badge">
                <FaStar color="#f59e0b" /> {activeRole.badge}
              </span>
            </div>
            <div className="ud-hero-content">
              <h3 className="ud-hero-title">{activeRole.title}</h3>
              <p className="ud-hero-desc">{activeRole.desc}</p>

              <div className="ud-hero-meta">
                <div className="ud-meta-item">
                  <FaChartLine className="meta-icon" />{" "}
                  ความคืบหน้าหลักสูตรปัจจุบัน
                </div>
                <div className="ud-meta-item font-bold">
                  {dashboardData.stats.progressPercentage}%
                </div>
              </div>

              <div className="ud-hero-progress-wrap">
                <div className="ud-mini-progress" style={{ height: "10px" }}>
                  <div
                    className="ud-mini-progress-fill"
                    style={{
                      width: `${dashboardData.stats.progressPercentage}%`,
                      backgroundColor: activeRole.color,
                    }}
                  ></div>
                </div>
              </div>

              <div className="ud-hero-actions">
                <button
                  className="ud-btn-hero dark"
                  onClick={() => navigate(`/user-classroom`)}
                >
                  <FaPlayCircle /> เข้าสู่ห้องเรียน
                </button>
                <button
                  className="ud-btn-hero outline"
                  onClick={() => navigate(`/user-classroom`)}
                >
                  <FaClipboardCheck /> เริ่มทำแบบทดสอบ
                </button>
              </div>
            </div>
          </div>

          <div className="ud-progress-layout full-width">
            <div className="ud-card">
              <div className="ud-card-header">
                <h3 className="ud-card-title">
                  ผลการประเมินธรรมาภิบาลระบบปัญญาประดิษฐ์ (AI Ethic Components
                  Maturity Analysis)
                </h3>
              </div>
              <div className="ud-card-body" style={{ height: "400px" }}>
                {formattedRadarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      data={formattedRadarData}
                    >
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "#4b5563",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 5]}
                        tick={true}
                        axisLine={false}
                      />
                      <Radar
                        name="ระดับความพร้อม"
                        dataKey="level"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        fill="#3b82f6"
                        fillOpacity={0.35}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        }}
                        formatter={(value, name, props) => [
                          `Level ${value} / ${props.payload.maxMark}`, // แสดงคะแนนเต็มตามฐานข้อมูล (4 หรือ 5)
                          "ระดับความสอดคล้องตามเกณฑ์หลักการ",
                        ]}
                        labelFormatter={(label, payload) => {
                          // แสดงชื่อเต็มในกล่อง Tooltip (ไม่โดนตัดคำ)
                          if (payload && payload.length > 0) {
                            return payload[0].payload.fullSubjectName;
                          }
                          return label;
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="ud-radar-empty">
                    ระบบกำลังรองรับการเพิ่มข้อมูลโครงสร้าง Component ใหม่ในอนาคต
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ud-section-spacer">
            <h2 className="ud-section-heading">
              <FaLightbulb
                className="text-yellow"
                style={{ marginRight: "8px" }}
              />{" "}
              แนะนำสำหรับคุณ (Smart Recommendations)
            </h2>
            <p className="ud-section-subheading">
              ระบบวิเคราะห์แนะนำบทเรียนเพิ่มเติมตามเกณฑ์ภาพรวมเพื่อยกระดับทักษะความตระหนักรู้ด้าน
              AI
            </p>

            <div className="ud-recom-card">
              <div className="ud-recom-icon-wrap">
                <FaLightbulb className="text-yellow" />
              </div>
              <div className="ud-recom-details">
                <h4>
                  หลักสูตรเสริม: การลดอคติและสร้างความเป็นธรรมใน AI (Bias
                  Mitigation)
                </h4>
                <p>
                  เนื้อหาเจาะลึกเกี่ยวกับการตรวจสอบชุดข้อมูลและการปรับแต่งอัลกอริทึมเพื่อป้องกันผลกระทบเชิงลบ
                </p>
              </div>
              <button
                className="ud-btn-outline"
                onClick={() => navigate(`/user-classroom`)}
              >
                <FaPlayCircle /> ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
