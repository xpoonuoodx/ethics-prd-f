import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./style/Register.css";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaBuilding,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import logo from "../assets/logo-bde.png";
import axios from "axios";
import Swal from "sweetalert2";
import { sanitizeUsername, sanitizePassword } from "../utils/validators";

const USER_TYPE_OPTIONS = [
  { value: "regulator", label: "Regulator (ผู้กำกับดูแล)" },
  { value: "policy", label: "Policy (ผู้วางนโยบาย)" },
  { value: "researcher", label: "Researcher (นักวิจัย)" },
  { value: "developer", label: "Developer (นักพัฒนา)" },
  { value: "service provider", label: "Service Provider (ผู้ให้บริการ)" },
  { value: "users", label: "Users (ผู้ใช้งานทั่วไป)" },
];

const Register = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const accountType = searchParams.get("type"); // "organization" | "individual" | null

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    id_card: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    user_type: "",
    org_name: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    let finalValue = value;
    if (id === "username") finalValue = sanitizeUsername(value);
    if (id === "password" || id === "confirmPassword")
      finalValue = sanitizePassword(value);

    setFormData({
      ...formData,
      [id]: finalValue,
    });
  };

  const isOrganization = accountType === "organization";

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณาตรวจสอบรหัสผ่านและการยืนยันรหัสผ่านอีกครั้ง",
        confirmButtonColor: "#75ba40",
      });
    }

    if (!formData.user_type) {
      return Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาเลือกประเภทผู้ใช้งาน",
        confirmButtonColor: "#75ba40",
      });
    }

    if (isOrganization && !formData.org_name.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อหน่วยงาน",
        confirmButtonColor: "#75ba40",
      });
    }

    setLoading(true);

    try {
      const API_URL = `${import.meta.env.VITE_APP_API_ENDPOINT}/auth/register`;

      const response = await axios.post(API_URL, {
        account_type: accountType,
        id_card: formData.id_card,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        user_type: formData.user_type,
        ...(isOrganization ? { org_name: formData.org_name.trim() } : {}),
      });

      Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ!",
        text: response.data.message || "กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน",
        confirmButtonColor: "#75ba40",
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (error) {
      console.error("Register Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";

      Swal.fire({
        icon: "error",
        title: "ลงทะเบียนไม่สำเร็จ",
        text: errorMessage,
        confirmButtonColor: "#75ba40",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // หน้าจอเลือกประเภทการลงทะเบียน (ยังไม่ได้เลือก type)
  // ==========================================
  if (!isOrganization && accountType !== "individual") {
    return (
      <div className="auth-register-container">
        <div className="auth-register-left">
          <a href="/login" className="auth-register-back-btn">
            <FaArrowLeft /> กลับสู่หน้าเข้าสู่ระบบ
          </a>

          <div className="auth-register-form-wrapper">
            <img src={logo} alt="BDE Logo" className="auth-register-logo" />
            <span className="auth-register-kicker">ลงทะเบียนใช้งาน</span>
            <h2>เลือกประเภทการลงทะเบียน</h2>
            <p className="auth-register-subtitle">
              กรุณาเลือกรูปแบบบัญชีที่ต้องการสมัครใช้งาน
            </p>

            <div className="auth-register-choice-options">
              <button
                type="button"
                className="auth-register-choice-card"
                onClick={() => setSearchParams({ type: "organization" })}
              >
                <div className="auth-register-choice-icon">
                  <FaBuilding />
                </div>
                <span className="auth-register-choice-title">
                  สมัครในฐานะหน่วยงาน
                </span>
                <span className="auth-register-choice-desc">
                  สำหรับหน่วยงานที่ต้องการเข้าร่วมและกำกับดูแลโครงการ AI
                </span>
              </button>

              <button
                type="button"
                className="auth-register-choice-card"
                onClick={() => setSearchParams({ type: "individual" })}
              >
                <div className="auth-register-choice-icon">
                  <FaUser />
                </div>
                <span className="auth-register-choice-title">
                  สมัครในนามประชาชนทั่วไป
                </span>
                <span className="auth-register-choice-desc">
                  สำหรับบุคคลทั่วไปที่ต้องการเรียนรู้และประเมินตนเอง
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="auth-register-right">
          <div className="auth-register-image-overlay">
            <div className="auth-register-hero-content">
              <div className="auth-register-glass-card">
                <span className="auth-register-glass-kicker">
                  THAILAND AI ETHICS
                </span>
                <h3>ร่วมเป็นส่วนหนึ่งของ AI ที่มีจริยธรรม</h3>
                <p>
                  ไม่ว่าจะสมัครในนามหน่วยงานหรือบุคคลทั่วไป
                  ทุกบัญชีสามารถประเมินความพร้อมและเรียนรู้แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ได้ทันที
                </p>
                <ul className="auth-register-glass-checklist">
                  <li>
                    <FaCheckCircle size={16} /> ใช้งานได้ฟรีทุกฟีเจอร์
                  </li>
                  <li>
                    <FaCheckCircle size={16} /> รับใบประกาศนียบัตรเมื่อผ่านเกณฑ์
                  </li>
                  <li>
                    <FaCheckCircle size={16} /> ยืนยันตัวตนผ่านอีเมลอย่างปลอดภัย
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ฟอร์มลงทะเบียนจริง
  // ==========================================
  return (
    <div className="auth-register-container">
      <div className="auth-register-left">
        <button
          type="button"
          className="auth-register-back-btn"
          onClick={() => setSearchParams({})}
        >
          <FaArrowLeft /> เปลี่ยนประเภทการสมัคร
        </button>

        <div className="auth-register-form-wrapper">
          <img src={logo} alt="BDE Logo" className="auth-register-logo" />

          <span className="auth-register-kicker">
            {isOrganization ? "บัญชีหน่วยงาน" : "บัญชีบุคคลทั่วไป"}
          </span>
          <h2>
            {isOrganization ? "ลงทะเบียนในฐานะหน่วยงาน" : "ลงทะเบียนบุคคลทั่วไป"}
          </h2>
          <p className="auth-register-subtitle">
            {isOrganization
              ? "กรอกข้อมูลด้านล่างเพื่อลงทะเบียนหน่วยงานและบัญชีผู้กำกับดูแล"
              : "กรอกข้อมูลด้านล่างเพื่อลงทะเบียนเข้าใช้งานระบบ"}
          </p>

          <form onSubmit={handleRegister}>
            <div className="auth-register-form-grid">
              <div className="auth-register-input-group">
                <label htmlFor="first_name">ชื่อจริง</label>
                <input
                  type="text"
                  id="first_name"
                  placeholder="กรอกชื่อจริง"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="last_name">นามสกุล</label>
                <input
                  type="text"
                  id="last_name"
                  placeholder="กรอกนามสกุล"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="id_card">เลขประจำตัวประชาชน</label>
                <input
                  type="text"
                  id="id_card"
                  placeholder="เลข 13 หลัก"
                  maxLength="13"
                  value={formData.id_card}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="email">อีเมล</label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="username">ชื่อผู้ใช้งาน (Username)</label>
                <input
                  type="text"
                  id="username"
                  placeholder="ตั้งชื่อผู้ใช้งาน"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <span className="auth-register-field-hint">
                  ใช้ได้เฉพาะภาษาอังกฤษ ตัวเลข และ . _ - (ห้ามใช้ภาษาไทย)
                </span>
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="user_type">ประเภทผู้ใช้งาน (User Type)</label>
                <select
                  id="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกประเภท --
                  </option>
                  {USER_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="password">รหัสผ่าน</label>
                <div className="auth-register-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="ตั้งรหัสผ่าน"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="auth-register-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <span className="auth-register-field-hint">
                  ใช้ได้เฉพาะภาษาอังกฤษ ตัวเลข และสัญลักษณ์ (ห้ามใช้ภาษาไทย)
                </span>
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                <div className="auth-register-password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="auth-register-toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {isOrganization && (
                <div className="auth-register-input-group auth-register-full-width">
                  <label htmlFor="org_name">ชื่อหน่วยงานของท่าน</label>
                  <input
                    type="text"
                    id="org_name"
                    placeholder="กรอกชื่อหน่วยงาน"
                    value={formData.org_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="auth-register-submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
            </button>
          </form>

          <p className="auth-register-login-link">
            มีบัญชีผู้ใช้งานอยู่แล้ว? <a href="/login">เข้าสู่ระบบที่นี่</a>
          </p>
        </div>
      </div>

      <div className="auth-register-right">
        <div className="auth-register-image-overlay">
          <div className="auth-register-hero-content">
            <div className="auth-register-glass-card">
              <span className="auth-register-glass-kicker">
                THAILAND AI ETHICS
              </span>
              <h3>ร่วมเป็นส่วนหนึ่งของ AI ที่มีจริยธรรม</h3>
              <p>
                ไม่ว่าจะสมัครในนามหน่วยงานหรือบุคคลทั่วไป
                ทุกบัญชีสามารถประเมินความพร้อมและเรียนรู้แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ได้ทันที
              </p>
              <ul className="auth-register-glass-checklist">
                <li>
                  <FaCheckCircle size={16} /> ใช้งานได้ฟรีทุกฟีเจอร์
                </li>
                <li>
                  <FaCheckCircle size={16} /> รับใบประกาศนียบัตรเมื่อผ่านเกณฑ์
                </li>
                <li>
                  <FaCheckCircle size={16} /> ยืนยันตัวตนผ่านอีเมลอย่างปลอดภัย
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
