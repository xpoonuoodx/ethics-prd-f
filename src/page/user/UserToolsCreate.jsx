import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/UserToolsCreate.css";
import SidebarUser from "./SidebarUser";
import {
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaCogs,
  FaSpinner,
} from "react-icons/fa";
import api, { getStoredUser } from "../../api/Api";
import { useThemedAlert } from "../../hooks/useThemedAlert";

const UserToolsCreate = () => {
  const { fire } = useThemedAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [maturities, setMaturities] = useState([]);
  const [principles, setPrinciples] = useState([]);
  const [selectedMaturity, setSelectedMaturity] = useState(null);
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);
  const [levelType, setLevelType] = useState("maturity"); // "maturity" | "impact" (ไม่มีหน่วยงานสังกัด)

  useEffect(() => {
    fetchSetupOptions();
  }, []);

  const fetchSetupOptions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/tool-setup");
      if (response.data && response.data.success) {
        setMaturities(response.data.data.maturities);
        setPrinciples(response.data.data.principles);
        setLevelType(response.data.data.levelType || "maturity");
      }
    } catch (error) {
      fire("ผิดพลาด", "ไม่สามารถดึงข้อมูลเกณฑ์ตั้งต้นได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const togglePrinciple = (id) => {
    setSelectedPrinciples((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedMaturity)
      return fire("แจ้งเตือน", "กรุณาเลือกระดับเป้าหมาย", "warning");
    if (currentStep === 2 && selectedPrinciples.length === 0)
      return fire(
        "แจ้งเตือน",
        "กรุณาเลือกหลักการอย่างน้อย 1 ข้อ",
        "warning",
      );
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate("/user-tools");
  };

  const handleGenerateAndSave = async () => {
    try {
      setLoading(true);
      const storedUser = getStoredUser();
      const userId = storedUser?.id || storedUser?.user_id;
      const response = await api.post("/user/generate-tool", {
        userId,
        maturityId: selectedMaturity,
        principleIds: selectedPrinciples,
      });
      if (response.data && response.data.success) {
        navigate("/user-tools-result", {
          state: { resultData: response.data.data, isHistory: false },
        });
      }
    } catch (error) {
      fire("ผิดพลาด", "เกิดข้อผิดพลาดในการสร้างเครื่องมือ", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="utc-spin" />
        </div>
      </div>
    );
  }

  const activeMaturityObj = maturities.find(
    (m) => m.level_id === selectedMaturity,
  );

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="utc-minimal-container">
          <div className="utc-header">
            <button className="utc-back-btn" onClick={handleBack}>
              <FaArrowLeft /> ย้อนกลับ
            </button>
            <div>
              <h1 className="utc-title">สร้างเครื่องมือประเมินใหม่</h1>
              <p className="utc-subtitle">
                กำหนดขอบเขตและหลักการเพื่อสร้างแบบประเมินที่ตรงกับระบบของคุณ
              </p>
            </div>
          </div>

          <div className="utc-stepper-bar">
            <div className={`utc-step ${currentStep >= 1 ? "active" : ""}`}>
              1. {levelType === "impact" ? "ระดับผลกระทบ" : "ระดับความพร้อม"}
            </div>
            <div className={`utc-step ${currentStep >= 2 ? "active" : ""}`}>
              2. หลักการจริยธรรม
            </div>
            <div className={`utc-step ${currentStep >= 3 ? "active" : ""}`}>
              3. ยืนยันข้อมูล
            </div>
          </div>

          <div className="utc-form-card">
            <div className="utc-form-body">
              {currentStep === 1 && (
                <div className="utc-step-wrap">
                  <h2 className="utc-step-title">
                    {levelType === "impact"
                      ? "เลือกระดับผลกระทบเป้าหมาย"
                      : "เลือกระดับความพร้อมเป้าหมาย"}
                  </h2>
                  <div className="utc-radio-grid">
                    {maturities.map((item) => (
                      <label
                        key={item.level_id}
                        className={`utc-radio-card ${selectedMaturity === item.level_id ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          checked={selectedMaturity === item.level_id}
                          onChange={() => setSelectedMaturity(item.level_id)}
                        />
                        <div className="card-info">
                          <h4>{item.level_name}</h4>
                          <p>{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="utc-step-wrap">
                  <h2 className="utc-step-title">
                    เลือกหลักการทางจริยธรรมที่ครอบคลุม
                  </h2>
                  <div className="utc-checkbox-list">
                    {principles.map((item) => (
                      <label
                        key={item.id}
                        className={`utc-checkbox-card ${selectedPrinciples.includes(item.id) ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPrinciples.includes(item.id)}
                          onChange={() => togglePrinciple(item.id)}
                        />
                        <div className="card-info">
                          <h4>{item.name}</h4>
                          <p>{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="utc-step-wrap">
                  <h2 className="utc-step-title">สรุปและตรวจสอบข้อมูล</h2>
                  <div className="utc-summary-box">
                    <div className="sum-row">
                      <span>ระดับเป้าหมาย:</span>{" "}
                      <strong>{activeMaturityObj?.level_name}</strong>
                    </div>
                    <div className="sum-row">
                      <span>จำนวนหลักการ:</span>{" "}
                      <strong>{selectedPrinciples.length} หลักการ</strong>
                    </div>
                    <div className="sum-row tag-wrap">
                      {principles
                        .filter((p) => selectedPrinciples.includes(p.id))
                        .map((p) => (
                          <span key={p.id} className="sum-tag">
                            {p.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="utc-form-footer">
              {currentStep < 3 ? (
                <button className="utc-btn-next" onClick={handleNext}>
                  ถัดไป <FaArrowRight />
                </button>
              ) : (
                <button
                  className="utc-btn-submit"
                  onClick={handleGenerateAndSave}
                >
                  <FaCogs /> ประมวลผลและสร้างคู่มือ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserToolsCreate;
