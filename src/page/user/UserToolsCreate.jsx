import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/UserToolsCreate.css";
import SidebarUser from "./SidebarUser";
import {
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaBalanceScale,
  FaShieldAlt,
  FaUserLock,
  FaSearch,
  FaClipboardList,
  FaCogs,
  FaSitemap,
  FaChartLine,
  FaDatabase,
  FaExclamationTriangle,
  FaEye,
  FaRegCircle,
  FaCheckCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

const UserToolsCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // State สำหรับ Step 1 (Multi-select)
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);

  // State สำหรับ Step 2
  const [activeTab, setActiveTab] = useState("maturity"); // 'maturity' | 'impact'
  const [selectedMaturity, setSelectedMaturity] = useState(null); // Single select
  const [selectedImpact, setSelectedImpact] = useState(null); // Single select

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // ----------------------------------------
  // ข้อมูลจำลอง (Mock Data)
  // ----------------------------------------

  // ข้อมูล Step 1: เลือกหลักการ (6 กล่อง)
  const principlesData = [
    {
      id: "p1",
      icon: <FaEye />,
      title: "ความโปร่งใสและความสามารถในการอธิบายได้",
      desc: "ระบบ AI ต้องสามารถอธิบายกระบวนการตัดสินใจและมีความโปร่งใสต่อผู้ใช้งาน",
    },
    {
      id: "p2",
      icon: <FaBalanceScale />,
      title: "ความเป็นธรรมและลดความลำเอียง",
      desc: "ป้องกันและลดอคติในชุดข้อมูลและอัลกอริทึม เพื่อให้เกิดความเป็นธรรมแก่ทุกกลุ่ม",
    },
    {
      id: "p3",
      icon: <FaShieldAlt />,
      title: "ความมั่นคงปลอดภัย",
      desc: "ระบบต้องมีความทนทานต่อการโจมตีทางไซเบอร์และทำงานได้อย่างปลอดภัย",
    },
    {
      id: "p4",
      icon: <FaUserLock />,
      title: "การคุ้มครองข้อมูลส่วนบุคคล",
      desc: "เคารพสิทธิความเป็นส่วนตัวและปฏิบัติตามกฎหมาย PDPA อย่างเคร่งครัด",
    },
    {
      id: "p5",
      icon: <FaCheck />,
      title: "ความน่าเชื่อถือ",
      desc: "ผลลัพธ์จาก AI ต้องมีความแม่นยำ สม่ำเสมอ และเชื่อถือได้ในการนำไปใช้งาน",
    },
    {
      id: "p6",
      icon: <FaClipboardList />,
      title: "ความรับผิดชอบ",
      desc: "ต้องมีผู้รับผิดชอบที่ชัดเจนเมื่อระบบ AI ก่อให้เกิดผลกระทบหรือความเสียหาย",
    },
  ];

  // ข้อมูล Step 2 (Tab 1): เป้าหมายระดับการปฏิบัติ (6 กล่อง)
  const maturityData = [
    {
      id: "m1",
      icon: <FaSitemap />,
      title: "นโยบายและการกำกับดูแล",
      desc: "การกำหนดโครงสร้างการบริหารจัดการ AI ภายในองค์กร",
    },
    {
      id: "m2",
      icon: <FaDatabase />,
      title: "การจัดการข้อมูล",
      desc: "มาตรฐานการเก็บรวบรวมและการรักษาคุณภาพของชุดข้อมูล",
    },
    {
      id: "m3",
      icon: <FaCogs />,
      title: "การพัฒนาและการทดสอบ",
      desc: "แนวปฏิบัติในการสร้างและทดสอบโมเดลก่อนนำไปใช้งานจริง",
    },
    {
      id: "m4",
      icon: <FaExclamationTriangle />,
      title: "การประเมินความเสี่ยง",
      desc: "การวิเคราะห์และจัดการความเสี่ยงที่อาจเกิดขึ้นจากระบบ AI",
    },
    {
      id: "m5",
      icon: <FaChartLine />,
      title: "การติดตามและตรวจสอบ",
      desc: "การเฝ้าระวังประสิทธิภาพของระบบ AI อย่างต่อเนื่อง",
    },
    {
      id: "m6",
      icon: <FaSearch />,
      title: "การประเมินผลกระทบ",
      desc: "การประเมินผลกระทบต่อสิทธิมนุษยชนและสังคม",
    },
  ];

  // ข้อมูล Step 2 (Tab 2): เป้าหมายระดับผลกระทบ (4 ระดับ)
  const impactData = [
    {
      id: "i1",
      level: "ระดับ 1",
      title: "ผลกระทบต่อองค์กรน้อย",
      desc: "ระบบ AI ที่ใช้ภายในงานทั่วไป ไม่กระทบต่อการตัดสินใจสำคัญ",
    },
    {
      id: "i2",
      level: "ระดับ 2",
      title: "ผลกระทบต่อองค์กรปานกลาง",
      desc: "ระบบ AI ที่ช่วยสนับสนุนการทำงานและเพิ่มประสิทธิภาพ",
    },
    {
      id: "i3",
      level: "ระดับ 3",
      title: "ผลกระทบต่อองค์กรมาก",
      desc: "ระบบ AI ที่มีผลต่อกลยุทธ์ ธุรกิจ หรือความปลอดภัยขององค์กร",
    },
    {
      id: "i4",
      level: "ระดับ 4",
      title: "ผลกระทบต่อสาธารณะในวงกว้าง",
      desc: "ระบบ AI ที่ให้บริการประชาชนหรือมีผลกระทบต่อสังคมส่วนรวม",
    },
  ];

  // ----------------------------------------
  // Functions
  // ----------------------------------------
  const togglePrinciple = (id) => {
    if (selectedPrinciples.includes(id)) {
      setSelectedPrinciples(selectedPrinciples.filter((pId) => pId !== id));
    } else {
      setSelectedPrinciples([...selectedPrinciples, id]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (selectedPrinciples.length === 0) {
        Swal.fire("แจ้งเตือน", "กรุณาเลือกหลักการอย่างน้อย 1 ข้อ", "warning");
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1);
    else navigate("/user-tools");
  };

  const handleSave = () => {
    if (!selectedMaturity || !selectedImpact) {
      Swal.fire("แจ้งเตือน", "กรุณาเลือกเกณฑ์ให้ครบทั้ง 2 หน้าต่าง", "warning");
      return;
    }
    Swal.fire({
      title: "บันทึกสำเร็จ!",
      text: "ระบบได้สร้างเครื่องมือประเมินเรียบร้อยแล้ว",
      icon: "success",
      confirmButtonColor: "#3b82f6",
    }).then(() => {
      navigate("/user-tools");
    });
  };

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="utc-v2-container">
          <div className="utc-v2-split-layout">
            {/* =======================================
                LEFT SIDE: Wizard Sidebar
                ======================================= */}
            <div className="utc-v2-sidebar">
              <div className="utc-v2-sidebar-header">
                <button className="utc-v2-back-btn" onClick={handleBack}>
                  <FaArrowLeft /> กลับ
                </button>
                <h1 className="utc-v2-title">สร้างเครื่องมือใหม่</h1>
                <p className="utc-v2-subtitle">
                  ปฏิบัติตาม 2
                  ขั้นตอนนี้เพื่อสร้างและตั้งค่าเครื่องมือประเมินของคุณ
                </p>
              </div>

              <div className="utc-v2-vertical-stepper">
                {/* Step 1 Indicator */}
                <div
                  className={`utc-v2-step-item ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}
                >
                  <div className="utc-v2-step-indicator">
                    {currentStep > 1 ? <FaCheck /> : "1"}
                  </div>
                  <div className="utc-v2-step-content">
                    <h4>เลือกหลักการ</h4>
                    <p>กำหนดหลักการจริยธรรม</p>
                  </div>
                </div>

                <div
                  className={`utc-v2-step-connector ${currentStep > 1 ? "active" : ""}`}
                ></div>

                {/* Step 2 Indicator */}
                <div
                  className={`utc-v2-step-item ${currentStep === 2 ? "active" : ""}`}
                >
                  <div className="utc-v2-step-indicator">2</div>
                  <div className="utc-v2-step-content">
                    <h4>กำหนดเกณฑ์</h4>
                    <p>เป้าหมายและผลกระทบ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* =======================================
                RIGHT SIDE: Main Content Form
                ======================================= */}
            <div className="utc-v2-main-form">
              <div className="utc-v2-form-card">
                {/* ---------------- STEP 1 ---------------- */}
                {currentStep === 1 && (
                  <div className="utc-v2-step-container fade-in-up">
                    <div className="utc-v2-form-header">
                      <h2>หลักการประเมิน</h2>
                      <p>
                        เลือกหลักการทางจริยธรรมที่เกี่ยวข้องกับโครงการนี้
                        (เลือกได้มากกว่า 1)
                      </p>
                    </div>

                    <div className="utc-v2-list-group">
                      {principlesData.map((item) => {
                        const isSelected = selectedPrinciples.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            className={`utc-v2-list-item ${isSelected ? "selected" : ""}`}
                            onClick={() => togglePrinciple(item.id)}
                          >
                            <div className="utc-v2-list-icon">{item.icon}</div>
                            <div className="utc-v2-list-info">
                              <h3>{item.title}</h3>
                              <p>{item.desc}</p>
                            </div>
                            <div className="utc-v2-list-action">
                              {isSelected ? (
                                <FaCheckCircle className="utc-v2-check-icon selected" />
                              ) : (
                                <FaRegCircle className="utc-v2-check-icon" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 2 ---------------- */}
                {currentStep === 2 && (
                  <div className="utc-v2-step-container fade-in-up">
                    <div className="utc-v2-form-header">
                      <h2>กำหนดเป้าหมายและเกณฑ์การประเมิน</h2>
                      <p>
                        โปรดเลือกข้อมูลให้ครบถ้วนทั้ง 2 แท็บ เพื่อดำเนินการต่อ
                      </p>
                    </div>

                    {/* Segmented Control (Tabs ใหม่) */}
                    <div className="utc-v2-segmented-control">
                      <button
                        className={`utc-v2-segment-btn ${activeTab === "maturity" ? "active" : ""}`}
                        onClick={() => setActiveTab("maturity")}
                      >
                        ระดับการปฏิบัติ (Maturity)
                      </button>
                      <button
                        className={`utc-v2-segment-btn ${activeTab === "impact" ? "active" : ""}`}
                        onClick={() => setActiveTab("impact")}
                      >
                        ระดับผลกระทบ (Impact)
                      </button>
                    </div>

                    {/* Content: Maturity */}
                    {activeTab === "maturity" && (
                      <div className="utc-v2-tab-content fade-in-up">
                        <div className="utc-v2-grid-2col">
                          {maturityData.map((item) => {
                            const isSelected = selectedMaturity === item.id;
                            return (
                              <div
                                key={item.id}
                                className={`utc-v2-grid-card ${isSelected ? "selected" : ""}`}
                                onClick={() => setSelectedMaturity(item.id)}
                              >
                                <div className="utc-v2-grid-header">
                                  <div className="utc-v2-grid-icon">
                                    {item.icon}
                                  </div>
                                  <div
                                    className={`utc-v2-radio ${isSelected ? "active" : ""}`}
                                  ></div>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Content: Impact */}
                    {activeTab === "impact" && (
                      <div className="utc-v2-tab-content fade-in-up">
                        <div className="utc-v2-impact-timeline">
                          {impactData.map((item) => {
                            const isSelected = selectedImpact === item.id;
                            return (
                              <div
                                key={item.id}
                                className={`utc-v2-impact-item ${isSelected ? "selected" : ""}`}
                                onClick={() => setSelectedImpact(item.id)}
                              >
                                <div className="utc-v2-impact-badge">
                                  {item.level}
                                </div>
                                <div className="utc-v2-impact-content">
                                  <h3>{item.title}</h3>
                                  <p>{item.desc}</p>
                                </div>
                                <div
                                  className={`utc-v2-radio ${isSelected ? "active" : ""}`}
                                ></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- FOOTER ACTIONS ---------------- */}
                <div className="utc-v2-form-footer">
                  <span className="utc-v2-step-counter">
                    ขั้นตอนที่ {currentStep} จาก 2
                  </span>

                  <div className="utc-v2-footer-btns">
                    {currentStep === 1 ? (
                      <button
                        className="utc-v2-btn-primary"
                        onClick={handleNext}
                      >
                        ถัดไป <FaArrowRight />
                      </button>
                    ) : (
                      <button
                        className="utc-v2-btn-success"
                        onClick={handleSave}
                      >
                        <FaSave /> ยืนยันการสร้าง
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserToolsCreate;
