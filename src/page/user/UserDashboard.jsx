import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/UserDashboard.css";
import SidebarUser from "./SidebarUser";
import {
  FaPlayCircle,
  FaClipboardCheck,
  FaBookOpen,
  FaFileAlt,
  FaClock,
  FaStar,
  FaChartLine,
  FaTrophy,
  FaLightbulb,
  FaArrowRight,
  FaCertificate,
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

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserData(storedUser);
  }, []);

  // ----------------------------------------
  // ข้อมูลจำลองความพร้อม (Mock Data ฐานเต็ม 5)
  // ----------------------------------------
  const readinessData = [
    { subject: "ความโปร่งใส", score: 4.5, fullMark: 5 },
    { subject: "ความปลอดภัย", score: 4.2, fullMark: 5 },
    { subject: "ความเป็นธรรม", score: 3.8, fullMark: 5 }, // จุดอ่อนที่นำไปใช้แนะนำคอร์ส
    { subject: "ความเป็นส่วนตัว", score: 4.8, fullMark: 5 },
    { subject: "ความรับผิดชอบ", score: 4.0, fullMark: 5 },
    { subject: "จริยธรรม", score: 4.6, fullMark: 5 },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "ทำแบบทดสอบสาย Provider (นักพัฒนา)",
      type: "assessment",
      date: "วันนี้, 10:30 น.",
      status: "ผ่านแล้ว",
      score: "Level 4",
    },
    {
      id: 2,
      title: "เรียนรู้โมดูล: จริยธรรม AI พื้นฐาน (User)",
      type: "learning",
      date: "เมื่อวาน, 14:00 น.",
      status: "เรียนจบแล้ว",
      score: null,
    },
    {
      id: 3,
      title: "ทำแบบทดสอบสาย Regulator (ผู้วางนโยบาย)",
      type: "assessment",
      date: "18 เม.ย. 2569",
      status: "ยังไม่ผ่าน",
      score: "Level 2",
    },
  ];

  return (
    <div className="user-portal-layout">
      {/* Sidebar ด้านซ้าย */}
      <SidebarUser />

      {/* เนื้อหาหลัก (ขยายเต็มจอ) */}
      <div className="user-portal-content">
        <div className="ud-container">
          {/* =======================================
              ส่วนหัวทักทาย และปุ่มใบประกาศมุมขวาบน
              ======================================= */}
          <div className="ud-header-wrapper">
            <div className="ud-simple-header">
              <h1 className="ud-greeting-title">
                ยินดีต้อนรับ, {userData?.name || "Somchai"}
              </h1>
              <p className="ud-greeting-subtitle">
                เลือกบทบาทของคุณเพื่อดูระดับความพร้อม (Maturity Level 1-5)
                และเข้าสู่การเรียนรู้
              </p>
            </div>

            <button
              className="ud-btn-top-cert"
              onClick={() => navigate("/user-certificate")}
            >
              <FaCertificate className="ud-icon-cert" /> ใบประกาศนียบัตร
            </button>
          </div>

          {/* =======================================
              1. แถบสรุปสถิติด่วน (Quick Stats)
              ======================================= */}
          <div className="ud-quick-stats-grid">
            <div className="ud-stat-card">
              <div className="ud-stat-icon bg-blue-light">
                <FaClock className="text-blue" />
              </div>
              <div className="ud-stat-info">
                <p className="ud-stat-label">ชั่วโมงเรียนสะสม</p>
                <h4 className="ud-stat-value">
                  12.5 <span className="ud-stat-unit">ชม.</span>
                </h4>
              </div>
            </div>
            <div className="ud-stat-card">
              <div className="ud-stat-icon bg-green-light">
                <FaClipboardCheck className="text-green" />
              </div>
              <div className="ud-stat-info">
                <p className="ud-stat-label">แบบทดสอบที่ผ่าน</p>
                <h4 className="ud-stat-value">
                  2 <span className="ud-stat-unit">หมวด</span>
                </h4>
              </div>
            </div>
            <div className="ud-stat-card">
              <div className="ud-stat-icon bg-purple-light">
                <FaTrophy className="text-purple" />
              </div>
              <div className="ud-stat-info">
                <p className="ud-stat-label">ใบประกาศนียบัตร</p>
                <h4 className="ud-stat-value">
                  2 <span className="ud-stat-unit">ใบ</span>
                </h4>
              </div>
            </div>
          </div>

          {/* =======================================
              2. แนะนำให้เรียนต่อ (Continue Learning)
              ======================================= */}
          <div className="ud-action-banner">
            <div className="ud-banner-content">
              <span className="ud-banner-badge">เรียนค้างไว้</span>
              <div className="ud-banner-text">
                <h3>กฎหมายและข้อบังคับที่เกี่ยวข้อง (PDPA & AI Act)</h3>
                <p>สายงาน: Regulator • ความคืบหน้า 50%</p>
              </div>
            </div>
            <button className="ud-btn-banner">
              เรียนต่อ <FaArrowRight />
            </button>
          </div>

          {/* =======================================
              การ์ดบทบาท 3 ใบ (Recipe Card Design)
              ======================================= */}
          <div className="ud-recipe-cards-grid">
            {/* Card 1: Regulator */}
            <div className="ud-recipe-card">
              <div className="ud-recipe-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop"
                  alt="Regulator"
                />
                <span className="ud-recipe-badge">
                  <FaStar color="#f59e0b" /> หน่วยงานรัฐ
                </span>
              </div>
              <div className="ud-recipe-content">
                <h3 className="ud-recipe-title">Regulator/Policy</h3>
                <p className="ud-recipe-desc">
                  Evaluate, Regulate and Monitor (ERM)
                </p>

                <div className="ud-recipe-divider"></div>

                <div className="ud-recipe-meta">
                  <div className="ud-meta-item">
                    <FaChartLine className="meta-icon" /> Maturity Level
                  </div>
                  <div className="ud-meta-divider"></div>
                  <div className="ud-meta-item progress-wrap">
                    <div className="ud-mini-progress">
                      <div
                        className="ud-mini-progress-fill"
                        style={{ width: "80%", backgroundColor: "#3b82f6" }}
                      ></div>
                    </div>
                  </div>
                  <div className="ud-meta-divider"></div>
                  <div className="ud-meta-item font-bold">4 / 5</div>
                </div>

                <div className="ud-recipe-actions">
                  <button
                    className="ud-btn-half dark"
                    onClick={() => navigate("/user-classroom?role=regulator")}
                  >
                    <FaPlayCircle /> สื่อการเรียนรู้
                  </button>
                  <button className="ud-btn-half outline">
                    <FaClipboardCheck /> แบบทดสอบ
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Provider */}
            <div className="ud-recipe-card">
              <div className="ud-recipe-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop"
                  alt="Provider"
                />
                <span className="ud-recipe-badge">
                  <FaStar color="#f59e0b" /> นักพัฒนา
                </span>
              </div>
              <div className="ud-recipe-content">
                <h3 className="ud-recipe-title">
                  Researcher/Developer/Service Provider
                </h3>
                <p className="ud-recipe-desc">
                  Plan, Development, Operation, Measurement (PDOM)
                </p>

                <div className="ud-recipe-divider"></div>

                <div className="ud-recipe-meta">
                  <div className="ud-meta-item">
                    <FaChartLine className="meta-icon" /> Maturity Level
                  </div>
                  <div className="ud-meta-divider"></div>
                  <div className="ud-meta-item progress-wrap">
                    <div className="ud-mini-progress">
                      <div
                        className="ud-mini-progress-fill"
                        style={{ width: "40%", backgroundColor: "#8b5cf6" }}
                      ></div>
                    </div>
                  </div>
                  <div className="ud-meta-divider"></div>
                  <div className="ud-meta-item font-bold">2 / 5</div>
                </div>

                <div className="ud-recipe-actions">
                  <button
                    className="ud-btn-half dark"
                    onClick={() => navigate("/user-classroom?role=provider")}
                  >
                    <FaPlayCircle /> สื่อการเรียนรู้
                  </button>
                  <button className="ud-btn-half outline">
                    <FaClipboardCheck /> แบบทดสอบ
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: User */}
            <div className="ud-recipe-card">
              <div className="ud-recipe-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
                  alt="User"
                />
                <span className="ud-recipe-badge">
                  <FaStar color="#f59e0b" /> ผู้ใช้งานทั่วไป
                </span>
              </div>
              <div className="ud-recipe-content">
                <h3 className="ud-recipe-title">Users </h3>
                <p className="ud-recipe-desc">Aware Utilize Feedback (AUF)</p>

                <div className="ud-recipe-divider"></div>

                <div className="ud-recipe-meta">
                  <div className="ud-meta-item">
                    <FaChartLine className="meta-icon" /> Maturity Level
                  </div>
                  <div className="ud-meta-divider"></div>
                  <div className="ud-meta-item progress-wrap">
                    <div className="ud-mini-progress">
                      <div
                        className="ud-mini-progress-fill"
                        style={{ width: "100%", backgroundColor: "#10b981" }}
                      ></div>
                    </div>
                  </div>
                  <div className="ud-meta-divider"></div>
                  <div className="ud-meta-item font-bold">5 / 5</div>
                </div>

                <div className="ud-recipe-actions">
                  <button
                    className="ud-btn-half dark"
                    onClick={() => navigate("/user-classroom?role=user")}
                  >
                    <FaPlayCircle /> สื่อการเรียนรู้
                  </button>
                  <button className="ud-btn-half outline">
                    <FaClipboardCheck /> แบบทดสอบ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =======================================
              ส่วนกราฟ 6 เหลี่ยม และกิจกรรมล่าสุด
              ======================================= */}
          <div className="ud-progress-layout">
            <div className="ud-card">
              <div className="ud-card-header">
                <h3 className="ud-card-title">
                  ภาพรวมระดับความพร้อม (Overall Maturity Level)
                </h3>
              </div>
              <div className="ud-card-body" style={{ height: "350px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    data={readinessData}
                  >
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#4b5563", fontSize: 13 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 5]}
                      tick={true}
                      axisLine={false}
                    />
                    <Radar
                      name="Maturity Level"
                      dataKey="score"
                      stroke="#75ba40"
                      strokeWidth={2}
                      fill="#75ba40"
                      fillOpacity={0.5}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [
                        `Level ${value}`,
                        "ระดับความพร้อม",
                      ]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="ud-card">
              <div className="ud-card-header">
                <h3 className="ud-card-title">ประวัติกิจกรรมล่าสุด</h3>
              </div>
              <div className="ud-card-body ud-p-0">
                <ul className="ud-activity-list">
                  {recentActivities.map((act) => (
                    <li key={act.id} className="ud-activity-item">
                      <div className="ud-activity-icon">
                        {act.type === "assessment" ? (
                          <FaFileAlt size={18} className="text-purple" />
                        ) : (
                          <FaBookOpen size={18} className="text-blue" />
                        )}
                      </div>
                      <div className="ud-activity-details">
                        <p className="ud-activity-name">{act.title}</p>
                        <div className="ud-activity-meta">
                          <span className="ud-date">
                            <FaClock size={12} /> {act.date}
                          </span>
                          {act.score && (
                            <span className="ud-score">ผล: {act.score}</span>
                          )}
                        </div>
                      </div>
                      <div className="ud-activity-status">
                        <span
                          className={`ud-badge ${act.status === "ผ่านแล้ว" || act.status === "เรียนจบแล้ว" ? "success" : "warning"}`}
                        >
                          {act.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* =======================================
              3. Smart Recommendations
              ======================================= */}
          <div className="ud-section-spacer">
            <h2 className="ud-section-heading">
              <FaLightbulb
                className="text-yellow"
                style={{ marginRight: "8px" }}
              />{" "}
              แนะนำสำหรับคุณ (Smart Recommendations)
            </h2>
            <p className="ud-section-subheading">
              ระบบวิเคราะห์จากคะแนนกราฟด้าน "ความเป็นธรรม" (3.8/5)
              ที่ยังสามารถพัฒนาได้อีก
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
              <button className="ud-btn-outline">
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
