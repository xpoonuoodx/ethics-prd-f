import React, { useState } from "react";
import "./style/Register.css"; // อย่าลืมสร้างไฟล์นี้ในโฟลเดอร์ style
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import logo from "../assets/logo-bde.png"; // นำเข้าโลโก้
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State สำหรับเก็บข้อมูลฟอร์มทั้งหมดตามที่ Backend ต้องการ
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    id_card: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "", // ใช้เช็คฝั่งหน้าบ้านเฉยๆ
  });

  // ฟังก์ชันจัดการเมื่อพิมพ์ข้อมูลในช่องต่างๆ
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณาตรวจสอบรหัสผ่านและการยืนยันรหัสผ่านอีกครั้ง",
        confirmButtonColor: "#75ba40",
      });
    }

    setLoading(true);

    try {
      // 2. ส่งข้อมูลไปที่ API
      const API_URL = `${import.meta.env.VITE_APP_API_ENDPOINT}/register`;

      const response = await axios.post(API_URL, {
        id_card: formData.id_card,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      // 3. เมื่อสำเร็จ แจ้งเตือนและพากลับไปหน้า Login
      Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ!",
        text: response.data.message || "กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน",
        confirmButtonColor: "#75ba40",
      }).then(() => {
        window.location.href = "/login"; // เด้งไปหน้า login
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

  return (
    <div className="auth-register-container">
      {/* ส่วนซ้าย: ฟอร์มลงทะเบียน */}
      <div className="auth-register-left">
        <a href="/login" className="auth-register-back-btn">
          <FaArrowLeft /> กลับสู่หน้าเข้าสู่ระบบ
        </a>

        <div className="auth-register-form-wrapper">
          <img src={logo} alt="BDE Logo" className="auth-register-logo" />

          <h2>สร้างบัญชีผู้ใช้งาน</h2>
          <p className="auth-register-subtitle">
            กรอกข้อมูลด้านล่างเพื่อลงทะเบียนเข้าใช้งานระบบ
          </p>

          <form onSubmit={handleRegister}>
            {/* Grid 2 คอลัมน์ สำหรับฟอร์ม */}
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
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="08X-XXX-XXXX"
                  maxLength="10"
                  value={formData.phone}
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

      {/* ส่วนขวา: รูปภาพ */}
      <div className="auth-register-right">
        <div className="auth-register-image-overlay"></div>
      </div>
    </div>
  );
};

export default Register;
