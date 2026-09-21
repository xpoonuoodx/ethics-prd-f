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
import api, { getStoredUser } from "../../api/Api";

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
    allowCrossTrackTesting: false,
    groupProgress: null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const storedUser = getStoredUser();
      const userId = storedUser?.id || storedUser?.user_id;

      if (!userId) {
        console.warn("ไม่พบ User ID ใน LocalStorage");
        setLoading(false);
        return;
      }

      const response = await api.get(`/user/dashboard/${userId}`);
      if (response.data && response.data.success) {
        // merge กับค่า default เดิมเสมอ กัน crash ถ้า response ไม่มี stats/radarData ครบ
        const data = response.data.data || {};
        setDashboardData((prev) => ({
          ...prev,
          ...data,
          stats: { ...prev.stats, ...(data.stats || {}) },
          radarData: data.radarData || [],
        }));
      }
    } catch (error) {
      console.error("Fetch Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleCategory = (type) => {
    if (!type) return "users";
    const t = type.toLowerCase();
    if (t.includes("regulator")) return "regulator";
    if (t.includes("policy")) return "policy";
    if (t.includes("researcher")) return "researcher";
    if (t.includes("developer")) return "developer";
    if (t.includes("provider")) return "provider";

    return "users";
  };

  const roleCategory = getRoleCategory(dashboardData.userType);

  const roleConfig = {
    regulator: {
      title: "Regulator",
      desc: "Evaluate, Regulate and Monitor (ERM) - หลักสูตรเจาะลึกสำหรับการกำกับดูแล การประเมินความเสี่ยง และการวางนโยบายที่เกี่ยวข้องกับ AI",
      img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
      badge: "ผู้กำกับดูแลและนโยบาย",
      color: "#3b82f6",
      path: "regulator",
    },
    policy: {
      title: "Policy Maker",
      desc: "Evaluate, Regulate and Monitor (ERM) - หลักสูตรเจาะลึกสำหรับการกำกับดูแล การประเมินความเสี่ยง และการวางนโยบายที่เกี่ยวข้องกับ AI",
      img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
      badge: "ผู้กำกับดูแลและนโยบาย",
      color: "#3b82f6",
      path: "policy",
    },
    researcher: {
      title: "Researcher",
      desc: "Research and Development (R&D) - หลักสูตรสำหรับนักวิจัยเพื่อพัฒนาและวิเคราะห์ระบบ AI อย่างมีประสิทธิภาพ",
      img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop",
      badge: "นักวิจัย",
      color: "#8b5cf6",
      path: "researcher",
    },
    developer: {
      title: "Developer",
      desc: "Plan, Development, Operation, Measurement (PDOM) - หลักสูตรเชิงปฏิบัติการสำหรับนักพัฒนา เพื่อสร้างระบบ AI ที่โปร่งใสและเป็นธรรม",
      img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop",
      badge: "นักพัฒนาและผู้ให้บริการ",
      color: "#8b5cf6",
      path: "developer",
    },
    provider: {
      title: "Service Provider",
      desc: "Plan, Development, Operation, Measurement (PDOM) - หลักสูตรเชิงปฏิบัติการสำหรับนักพัฒนา เพื่อสร้างระบบ AI ที่โปร่งใสและเป็นธรรม",
      img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop",
      badge: "นักพัฒนาและผู้ให้บริการ",
      color: "#8b5cf6",
      path: "provider",
    },
    users: {
      title: "General User",
      desc: "Aware Utilize Feedback (AUF) - หลักสูตรสร้างความตระหนักรู้ เพื่อการใช้งาน AI อย่างปลอดภัยและมีความรับผิดชอบ",
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
      badge: "ผู้ใช้งานทั่วไป",
      color: "#10b981",
      path: "users",
    },
  };

  const activeRole = roleConfig[roleCategory];

  // "โครงการ" มาจาก backend เป็น string เดียวคั่นด้วย ", " (STRING_AGG) รวมถึง fallback
  // ข้อความ "ยังไม่มีโครงการที่รับผิดชอบ" ตอนไม่มีโครงการเลย ต้องแยกเป็นรายชื่อก่อนโชว์เป็น chip
  const hasOrganization =
    dashboardData.organization &&
    dashboardData.organization !== "ไม่มีสังกัดหน่วยงาน";
  const projectList =
    dashboardData.projects &&
    dashboardData.projects !== "ยังไม่มีโครงการที่รับผิดชอบ"
      ? dashboardData.projects.split(",").map((p) => p.trim()).filter(Boolean)
      : [];

  // แปลง roleCategory (6 ประเภทย่อย) ให้เป็นกลุ่มหลักสูตรจริง 3 กลุ่ม (ตรงกับ target_group
  // ในฐานข้อมูล) เพื่อรู้ว่าการ์ดของตัวเองอยู่กลุ่มไหน แล้วอีก 2 กลุ่มที่เหลือคือกลุ่มอะไรบ้าง
  const getTargetGroup = (category) => {
    if (category === "regulator" || category === "policy") return 1;
    if (["researcher", "developer", "provider"].includes(category)) return 2;
    return 3;
  };
  const ownTargetGroup = getTargetGroup(roleCategory);

  // การ์ดตัวแทนของแต่ละกลุ่มหลักสูตร (ไม่ใช่ตัวแทนของทั้ง 6 user_type ย่อยเหมือน roleConfig)
  // ใช้โชว์เป็นการ์ดเพิ่มเติมสำหรับกลุ่มที่ไม่ใช่ของตัวเอง
  const GROUP_CARD_CONFIG = {
    1: { ...roleConfig.regulator, title: "Regulator / Policy Maker" },
    2: {
      ...roleConfig.developer,
      title: "Researcher / Developer / Service Provider",
    },
    3: roleConfig.users,
  };
  const otherGroups = [1, 2, 3].filter((g) => g !== ownTargetGroup);

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
            </div>

            <button
              className="ud-btn-top-cert"
              onClick={() => navigate("/user-certificate")}
            >
              <FaCertificate className="ud-icon-cert" /> ใบประกาศนียบัตร
            </button>
          </div>

          <div className="ud-org-project-grid">
            <div className="ud-info-card">
              <div className="ud-info-card-icon org">
                <FaBuilding />
              </div>
              <div className="ud-info-card-body">
                <p className="ud-info-card-label">หน่วยงานของคุณ</p>
                <p
                  className={`ud-info-card-value ${!hasOrganization ? "muted" : ""}`}
                >
                  {dashboardData.organization}
                </p>
              </div>
            </div>

            <div className="ud-info-card">
              <div className="ud-info-card-icon proj">
                <FaFolderOpen />
              </div>
              <div className="ud-info-card-body">
                <p className="ud-info-card-label">
                  โครงการที่รับผิดชอบ
                  {projectList.length > 0 && (
                    <span className="ud-info-card-count">
                      {projectList.length}
                    </span>
                  )}
                </p>
                {projectList.length > 0 ? (
                  <div className="ud-project-chip-list">
                    {projectList.map((proj, index) => (
                      <span key={index} className="ud-project-chip">
                        {proj}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="ud-info-card-value muted">
                    ยังไม่มีโครงการที่รับผิดชอบ
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="ud-quick-stats-grid">
            <div className="ud-stat-card">
              <div className="ud-stat-icon">
                <FaClock />
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
              <div className="ud-stat-icon">
                <FaClipboardCheck />
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
              <div className="ud-stat-icon">
                <FaTrophy />
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

          {/* เรียงลงมาทีละหลักสูตร แถวละ 1 หลักสูตร (ของตัวเองขึ้นก่อน ตามด้วยอีก 2 กลุ่ม)
              แทนที่จะเป็นการ์ดใหญ่ของตัวเอง 1 ใบ + การ์ดเล็ก 2 ใบเรียงข้างกันแบบเดิม */}
          <div className="ud-courses-list">
            {[
              { group: ownTargetGroup, card: activeRole, isOwn: true },
              ...otherGroups.map((group) => ({
                group,
                card: GROUP_CARD_CONFIG[group],
                isOwn: false,
              })),
            ].map(({ group, card, isOwn }) => {
              // ถ้าเปิดโหมด "ทำแบบทดสอบข้ามหลักสูตร" ไว้ ให้โชว์ % ความคืบหน้าจริงของทุกการ์ด
              // (ไม่ใช่แค่การ์ดของหลักสูตรตัวเอง) เพราะตอนนี้ทำข้อสอบหลักสูตรอื่นได้แล้วจริง ๆ
              const showProgress =
                isOwn || dashboardData.allowCrossTrackTesting;
              const progressPercentage = isOwn
                ? dashboardData.stats.progressPercentage
                : dashboardData.groupProgress?.[group] || 0;

              return (
              <div key={group} className="ud-hero-role-card">
                <div className="ud-hero-img-wrapper">
                  <img src={card.img} alt={card.title} />
                  <span className="ud-hero-badge">
                    <FaStar color="#f59e0b" /> {card.badge}
                  </span>
                </div>
                <div className="ud-hero-content">
                  <h3 className="ud-hero-title">{card.title}</h3>
                  <p className="ud-hero-desc">{card.desc}</p>

                  {showProgress && (
                    <>
                      <div className="ud-hero-meta">
                        <div className="ud-meta-item">
                          <FaChartLine className="meta-icon" />{" "}
                          ความคืบหน้าหลักสูตร{isOwn ? "ปัจจุบัน" : "นี้"}
                        </div>
                        <div className="ud-meta-item font-bold">
                          {progressPercentage}%
                        </div>
                      </div>

                      <div className="ud-hero-progress-wrap">
                        <div
                          className="ud-mini-progress"
                          style={{ height: "10px" }}
                        >
                          <div
                            className="ud-mini-progress-fill"
                            style={{
                              width: `${progressPercentage}%`,
                              backgroundColor: card.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="ud-hero-actions">
                    <button
                      className="ud-btn-hero dark"
                      onClick={() =>
                        navigate(`/user-classroom?course=${group}`)
                      }
                    >
                      <FaPlayCircle /> เข้าสู่ห้องเรียน
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="ud-progress-layout full-width">
            <div className="ud-card">
              <div className="ud-card-header">
                <h3 className="ud-card-title">
                  ผลการประเมินธรรมาภิบาลระบบปัญญาประดิษฐ์ (AI Ethics Components
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
