import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/Login.css";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaTimes,
  FaTools,
  FaTimesCircle,
  FaCheckCircle,
  FaBuilding,
  FaUser,
} from "react-icons/fa";
import logo from "../assets/logo-bde.png";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegisterChoiceOpen, setIsRegisterChoiceOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 1. สร้าง State แบบรวมศูนย์ สำหรับจัดการ Popup ทุกประเภทในหน้า Login
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info", // "info" หรือ "error"
    title: "",
    desc: "",
  });

  // ฟังก์ชันช่วยเปิด-ปิด Popup
  const openModal = (type, title, desc) => {
    setModal({ isOpen: true, type, title, desc });
  };
  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  // เช็ค query param ที่ backend ส่งกลับมาหลังกดยืนยันอีเมลจากลิงก์ (/login?status=verified หรือ ?error=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const error = params.get("error");

    if (status === "verified") {
      openModal(
        "success",
        "ยืนยันอีเมลสำเร็จ",
        "บัญชีของคุณพร้อมใช้งานแล้ว กรุณาเข้าสู่ระบบ",
      );
      window.history.replaceState({}, "", "/login");
    } else if (error === "invalid_token") {
      openModal(
        "error",
        "ลิงก์ยืนยันไม่ถูกต้อง",
        "ลิงก์ยืนยันอีเมลนี้ไม่ถูกต้องหรือถูกใช้งานไปแล้ว",
      );
      window.history.replaceState({}, "", "/login");
    } else if (error === "server_error") {
      openModal(
        "error",
        "เกิดข้อผิดพลาด",
        "ไม่สามารถยืนยันอีเมลได้ กรุณาลองใหม่อีกครั้ง",
      );
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const API_URL = `${import.meta.env.VITE_APP_API_ENDPOINT}/auth/login`;

      const response = await axios.post(API_URL, {
        username: username,
        password: password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      let targetUrl = "/user-dashboard";

      if (
        user.role === "admin" ||
        (user.roles && user.roles.includes("admin"))
      ) {
        targetUrl = "/admin-dashboard";
      } else if (
        user.role === "regulator" ||
        (user.roles && user.roles.includes("regulator"))
      ) {
        targetUrl = "/regulator-dashboard";
      }

      navigate(targetUrl);
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";

      // 2. เรียกใช้ Custom Popup แจ้งเตือน Error
      openModal("error", "เข้าสู่ระบบไม่สำเร็จ", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleThaiDLogin = () => {
    // 3. เรียกใช้ Custom Popup แจ้งเตือน Info
    openModal(
      "info",
      "กำลังทำการพัฒนา",
      "ขออภัยในความไม่สะดวก ระบบการเข้าสู่ระบบด้วย ThaID กำลังอยู่ในขั้นตอนการพัฒนาระบบ",
    );
  };

  return (
    <div className="premium-login-container">
      {/* ================= ส่วนซ้าย: ฟอร์มเข้าสู่ระบบ ================= */}
      <div className="premium-login-left">
        <div className="premium-login-top-nav">
          <a href="/" className="premium-back-btn">
            <FaArrowLeft size={14} /> กลับสู่หน้าหลัก
          </a>
        </div>

        <div className="premium-form-wrapper">
          <div className="premium-brand-header">
            <img src={logo} alt="BDE Logo" className="premium-logo" />
          </div>

          <div className="premium-form-header">
            <h2>เข้าสู่ระบบ</h2>
            <p>ยินดีต้อนรับ กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อในระบบ</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="premium-input-group">
              <label htmlFor="username">ชื่อผู้ใช้งาน (Username)</label>
              <input
                type="text"
                id="username"
                placeholder="กรอกชื่อผู้ใช้งานของคุณ"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="premium-input-group">
              <label htmlFor="password">รหัสผ่าน</label>
              <div className="premium-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="premium-toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* <div className="premium-form-options">
              <a href="/forgot-password" className="premium-forgot-pass">
                ลืมรหัสผ่านใช่หรือไม่?
              </a>
            </div> */}

            <button
              type="submit"
              className="premium-submit-btn"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <div className="premium-register-prompt">
            <p>
              ยังไม่มีบัญชีผู้ใช้งาน?{" "}
              <button
                type="button"
                className="premium-register-link"
                onClick={() => setIsRegisterChoiceOpen(true)}
              >
                ลงทะเบียนที่นี่
              </button>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "25px 0 20px 0",
            }}
          >
            <div style={{ flex: 1, borderBottom: "1px solid #e2e8f0" }}></div>
            <span
              style={{
                padding: "0 15px",
                color: "#94a3b8",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              หรือ
            </span>
            <div style={{ flex: 1, borderBottom: "1px solid #e2e8f0" }}></div>
          </div>

          <button
            type="button"
            onClick={handleThaiDLogin}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "12px",
              backgroundColor: "#1e293b",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
            }}
          >
            {/* <img
              src="https://www.bora.dopa.go.th/wp-content/uploads/2023/03/ThaID-Logo-1024x1024.png"
              alt="ThaID Logo"
              style={{
                width: "26px",
                height: "26px",
                objectFit: "contain",
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "2px",
              }}
            /> */}
            เข้าสู่ระบบด้วย ThaID
          </button>
        </div>
      </div>

      {/* ================= ส่วนขวา: รูปภาพและข้อความต้อนรับ ================= */}
      <div className="premium-login-right">
        <div className="premium-image-overlay">
          <div className="premium-hero-content">
            <div className="premium-glass-card">
              <h3>Thailand AI Ethics Guideline</h3>
              <p>
                โครงการสร้างความเข้าใจและส่งเสริมการใช้แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
                เพื่อสังคมดิจิทัลที่ปลอดภัยและยั่งยืน
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. Dynamic Custom Modal Popup ================= */}
      {modal.isOpen && (
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div
            className="custom-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="custom-modal-close" onClick={closeModal}>
              <FaTimes />
            </button>

            {/* ไอคอนและสีจะเปลี่ยนไปตาม type */}
            <div className={`custom-modal-icon-wrapper ${modal.type}`}>
              {modal.type === "error" ? (
                <FaTimesCircle />
              ) : modal.type === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaTools />
              )}
            </div>

            <h3 className="custom-modal-title">{modal.title}</h3>
            <p className="custom-modal-desc">{modal.desc}</p>

            <button
              className={`custom-modal-btn ${modal.type}`}
              onClick={closeModal}
            >
              {modal.type === "error" ? "ตกลง" : "รับทราบ"}
            </button>
          </div>
        </div>
      )}

      {/* ================= 5. Popup เลือกประเภทการลงทะเบียน ================= */}
      {isRegisterChoiceOpen && (
        <div
          className="custom-modal-overlay"
          onClick={() => setIsRegisterChoiceOpen(false)}
        >
          <div
            className="register-choice-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="custom-modal-close"
              onClick={() => setIsRegisterChoiceOpen(false)}
            >
              <FaTimes />
            </button>

            <h3 className="custom-modal-title">เลือกประเภทการลงทะเบียน</h3>
            <p className="custom-modal-desc">
              กรุณาเลือกรูปแบบบัญชีที่ต้องการสมัครใช้งาน
            </p>

            <div className="register-choice-options">
              <button
                type="button"
                className="register-choice-card"
                onClick={() => navigate("/register?type=organization")}
              >
                <div className="register-choice-icon">
                  <FaBuilding />
                </div>
                <span className="register-choice-title">
                  สมัครในฐานะหน่วยงาน
                </span>
                <span className="register-choice-desc">
                  สำหรับหน่วยงานที่ต้องการเข้าร่วมและกำกับดูแลโครงการ AI
                </span>
              </button>

              <button
                type="button"
                className="register-choice-card"
                onClick={() => navigate("/register?type=individual")}
              >
                <div className="register-choice-icon">
                  <FaUser />
                </div>
                <span className="register-choice-title">
                  สมัครในนามประชาชนทั่วไป
                </span>
                <span className="register-choice-desc">
                  สำหรับบุคคลทั่วไปที่ต้องการเรียนรู้และประเมินตนเอง
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
