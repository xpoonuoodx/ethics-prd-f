import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/UserTools.css";
import SidebarUser from "./SidebarUser";
import {
  FaPlus,
  FaPlayCircle,
  FaTrash,
  FaChevronUp,
  FaChevronDown,
  FaTimes,
  FaCalendarAlt,
  FaChartPie,
  FaLayerGroup,
} from "react-icons/fa";
import Swal from "sweetalert2";

const UserTools = () => {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [expandedIds, setExpandedIds] = useState([1]); // เก็บ ID ของการ์ดที่ถูกกางออก

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ----------------------------------------
  // ข้อมูลจำลอง (Mock Data)
  // ----------------------------------------
  const [tools, setTools] = useState([
    {
      id: 1,
      createdAt: "22/04/2026",
      maturityLevel: "ระดับ 3",
      progress: "0/9",
      roleTitle: "องค์ประกอบที่ 1 : Regulator/Policy",
      roleDesc: "Evaluate, Regulate and Monitor (ERM)",
      principleTitle: "หลักการทางจริยธรรมปัญญาประดิษฐ์",
      principleDesc:
        "ความสามารถในการแข่งขันและการพัฒนาอย่างยั่งยืน\n(Competitiveness and Sustainability Development)",
      subItem:
        "องค์ประกอบที่ 1 : Regulator/Policy Evaluate, Regulate and Monitor (ERM)",
    },
    {
      id: 2,
      createdAt: "15/03/2026",
      maturityLevel: "ระดับ 2",
      progress: "4/9",
      roleTitle: "องค์ประกอบที่ 2 : Service Provider",
      roleDesc: "Plan, Development, Operation, Measurement (PDOM)",
      principleTitle: "หลักการทางจริยธรรมปัญญาประดิษฐ์",
      principleDesc:
        "ความโปร่งใสและความสามารถในการอธิบายได้\n(Transparency and Explainability)",
      subItem:
        "องค์ประกอบที่ 2 : Service Provider Plan, Development, Operation...",
    },
    {
      id: 3,
      createdAt: "15/03/2026",
      maturityLevel: "ระดับ 2",
      progress: "4/9",
      roleTitle: "องค์ประกอบที่ 2 : Service Provider",
      roleDesc: "Plan, Development, Operation, Measurement (PDOM)",
      principleTitle: "หลักการทางจริยธรรมปัญญาประดิษฐ์",
      principleDesc:
        "ความโปร่งใสและความสามารถในการอธิบายได้\n(Transparency and Explainability)",
      subItem:
        "องค์ประกอบที่ 2 : Service Provider Plan, Development, Operation...",
    },
    {
      id: 4,
      createdAt: "15/03/2026",
      maturityLevel: "ระดับ 2",
      progress: "4/9",
      roleTitle: "องค์ประกอบที่ 2 : Service Provider",
      roleDesc: "Plan, Development, Operation, Measurement (PDOM)",
      principleTitle: "หลักการทางจริยธรรมปัญญาประดิษฐ์",
      principleDesc:
        "ความโปร่งใสและความสามารถในการอธิบายได้\n(Transparency and Explainability)",
      subItem:
        "องค์ประกอบที่ 2 : Service Provider Plan, Development, Operation...",
    },
  ]);

  // ฟังก์ชันยืด-หดการ์ด
  const toggleExpand = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((item) => item !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  // ฟังก์ชันลบเครื่องมือ
  const handleDelete = (id) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบเครื่องมือประเมินนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบเครื่องมือ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setTools(tools.filter((t) => t.id !== id));
        Swal.fire({
          title: "ลบสำเร็จ!",
          text: "ข้อมูลเครื่องมือถูกลบแล้ว",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      }
    });
  };

  return (
    <div className="user-portal-layout">
      {/* วาง Sidebar ไว้ด้านซ้าย */}
      <SidebarUser />

      {/* ส่วนเนื้อหาหลักด้านขวา */}
      <div className="user-portal-content">
        <div className="ut-v2-container">
          {/* =======================================
              ส่วนหัว (Header & Actions) ดีไซน์ใหม่
              ======================================= */}
          <div className="ut-v2-header-section">
            <div className="ut-v2-title-box">
              <h1 className="ut-v2-title">เครื่องมือของฉัน</h1>
              <p className="ut-v2-subtitle">
                ประวัติและการจัดการเครื่องมือประเมินความพร้อม AI
                สำหรับโครงการของคุณ
              </p>
            </div>
            <div className="ut-v2-actions-box">
              <button
                className="ut-v2-btn-video"
                onClick={() => setShowVideoModal(true)}
              >
                <FaPlayCircle size={18} /> วิธีการสร้าง
              </button>
              <button
                className="ut-v2-btn-create"
                onClick={() => navigate("/user-tools-create")}
              >
                <FaPlus size={14} /> สร้างเครื่องมือ
              </button>
            </div>
          </div>

          {/* =======================================
              รายการเครื่องมือ (Grid Layout)
              ======================================= */}
          <div className="ut-v2-grid-wrapper">
            {tools.map((tool) => {
              const isExpanded = expandedIds.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  className={`ut-v2-card ${isExpanded ? "expanded" : ""}`}
                >
                  {/* Badges (แทนที่ Header สีทึบ) */}
                  <div className="ut-v2-card-badges">
                    <span className="ut-v2-badge date">
                      <FaCalendarAlt /> {tool.createdAt}
                    </span>
                    <span className="ut-v2-badge level">
                      <FaLayerGroup /> {tool.maturityLevel}
                    </span>
                    <span className="ut-v2-badge progress">
                      <FaChartPie /> {tool.progress}
                    </span>
                  </div>

                  {/* Main Info */}
                  <div className="ut-v2-card-main">
                    <p className="ut-v2-role-label">บทบาทการประเมิน</p>
                    <h3 className="ut-v2-role-title">{tool.roleTitle}</h3>
                    <p className="ut-v2-role-desc">{tool.roleDesc}</p>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="ut-v2-card-details fade-in-down">
                      <div className="ut-v2-divider"></div>
                      <div className="ut-v2-principle-box">
                        <p className="ut-v2-principle-label">
                          หลักการทางจริยธรรม
                        </p>
                        <h4 className="ut-v2-principle-title">
                          {tool.principleTitle}
                        </h4>
                        <p className="ut-v2-principle-desc whitespace-pre-line">
                          {tool.principleDesc}
                        </p>
                      </div>
                      <div className="ut-v2-subitem-box">{tool.subItem}</div>
                    </div>
                  )}

                  {/* Actions (ปุ่มยืดหด และลบ) */}
                  <div className="ut-v2-card-footer">
                    <button
                      className="ut-v2-btn-toggle"
                      onClick={() => toggleExpand(tool.id)}
                    >
                      {isExpanded ? (
                        <>
                          ซ่อนรายละเอียด <FaChevronUp />
                        </>
                      ) : (
                        <>
                          ดูรายละเอียด <FaChevronDown />
                        </>
                      )}
                    </button>

                    <button
                      className="ut-v2-btn-delete"
                      onClick={() => handleDelete(tool.id)}
                      title="ลบข้อมูล"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}

            {tools.length === 0 && (
              <div className="ut-v2-empty-state">
                <div className="ut-v2-empty-icon">
                  <FaLayerGroup />
                </div>
                <h3>ยังไม่มีเครื่องมือประเมิน</h3>
                <p>คลิกที่ปุ่ม "สร้างเครื่องมือ" ด้านบนเพื่อเริ่มต้น</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =======================================
          Video Modal (ป๊อปอัปดูวิธีการสร้าง)
          ======================================= */}
      {showVideoModal && (
        <div
          className="ut-modal-overlay"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="ut-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ut-modal-header">
              <h3>วิธีการสร้างเครื่องมือประเมิน</h3>
              <button
                className="ut-modal-close"
                onClick={() => setShowVideoModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="ut-modal-body">
              {/* ใช้ iframe YouTube จำลองวิดีโอ */}
              <div className="ut-video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/mqLhEpib-Yg?rel=0"
                  title="Tutorial Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTools;
