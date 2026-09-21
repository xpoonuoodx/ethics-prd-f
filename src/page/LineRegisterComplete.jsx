import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import api from "../api/Api";
import { useThemedAlert } from "../hooks/useThemedAlert";
import { sanitizePhone } from "../utils/validators";
import { USER_TYPE_OPTIONS } from "../constants/registerOptions";
import logo from "../assets/logo-bde.png";

// แยก "ชื่อ display" เดี่ยว ๆ ที่ LINE ให้มา ออกเป็นชื่อจริง/นามสกุลแบบคร่าว ๆ (เว้นวรรคแรก)
// เป็นแค่ค่าเริ่มต้นให้ผู้ใช้แก้ไขเองอีกที ไม่ได้การันตีว่าแยกถูกทุกกรณี (โดยเฉพาะชื่อไทย)
const splitDisplayName = (displayName) => {
  if (!displayName) return { firstName: "", lastName: "" };
  const parts = displayName.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
};

// หน้า "ยืนยันข้อมูลก่อนสมัคร" - แสดงตอนสมัครผ่าน LINE ครั้งแรก (บัญชียังไม่เคยมีในระบบ)
// ดึงรูป + ชื่อ display (และอีเมลถ้า LINE ให้มา) มา prefill แต่ "เบอร์โทรศัพท์ดึงจาก LINE
// ไม่ได้เลย" (LINE ไม่มี scope ให้เบอร์โทร) ต้องกรอกเองเสมอ ส่วนชื่อ/นามสกุลก็ต้องให้ผู้ใช้
// ตรวจสอบ/แก้เอง เพราะ LINE ให้มาเป็นชื่อ display ก้อนเดียว ไม่ได้แยกชื่อ-นามสกุลมาให้
const LineRegisterComplete = ({ pendingId }) => {
  const navigate = useNavigate();
  const { fire } = useThemedAlert();

  const [loadingPending, setLoadingPending] = useState(true);
  const [pendingError, setPendingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [pictureUrl, setPictureUrl] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    user_type: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPending = async () => {
    try {
      setLoadingPending(true);
      const response = await api.get(`/auth/line/pending/${pendingId}`);
      const data = response.data.data;
      const { firstName, lastName } = splitDisplayName(data.display_name);
      setFormData((prev) => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        email: data.email || "",
      }));
      setPictureUrl(data.picture_url || "");
    } catch (error) {
      setPendingError(
        error.response?.data?.message ||
          "ลิงก์หมดอายุหรือไม่ถูกต้อง กรุณาเริ่มสมัครผ่าน LINE ใหม่อีกครั้ง",
      );
    } finally {
      setLoadingPending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? sanitizePhone(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      return fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อจริงและนามสกุลให้ครบถ้วน",
        confirmButtonColor: "#75ba40",
      });
    }
    if (!formData.email.trim()) {
      return fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาระบุอีเมล",
        confirmButtonColor: "#75ba40",
      });
    }
    if (formData.phone.length < 9) {
      return fire({
        icon: "warning",
        title: "รูปแบบข้อมูลไม่ถูกต้อง",
        text: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 9-10 หลัก ขึ้นต้นด้วย 0)",
        confirmButtonColor: "#75ba40",
      });
    }
    if (!formData.user_type) {
      return fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณาเลือกประเภทผู้ใช้งาน",
        confirmButtonColor: "#75ba40",
      });
    }
    if (!consentChecked) {
      return fire({
        icon: "warning",
        title: "กรุณายืนยันความยินยอม",
        text: "กรุณาติ๊กยินยอมให้จัดเก็บและใช้ข้อมูลส่วนบุคคลก่อนสมัครสมาชิก",
        confirmButtonColor: "#75ba40",
      });
    }

    try {
      setSubmitting(true);
      const response = await api.post("/auth/line/complete-register", {
        pending_id: pendingId,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        user_type: formData.user_type,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ",
        text: "ยินดีต้อนรับเข้าสู่ระบบ",
        confirmButtonColor: "#75ba40",
      }).then(() => {
        navigate("/user-dashboard");
      });
    } catch (error) {
      fire({
        icon: "error",
        title: "สมัครสมาชิกไม่สำเร็จ",
        text:
          error.response?.data?.message ||
          "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
        confirmButtonColor: "#75ba40",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPending) {
    return (
      <div className="auth-register-container">
        <div className="auth-register-left line-register-loading">
          <FaSpinner className="line-register-spin" />
        </div>
      </div>
    );
  }

  if (pendingError) {
    return (
      <div className="auth-register-container">
        <div className="auth-register-left line-register-loading">
          <FaExclamationTriangle className="line-register-error-icon" />
          <p>{pendingError}</p>
          <a href="/login" className="auth-register-back-btn">
            กลับสู่หน้าเข้าสู่ระบบ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-register-container">
      <div className="auth-register-left">
        <div className="auth-register-form-wrapper">
          <img src={logo} alt="BDE Logo" className="auth-register-logo" />

          <span className="auth-register-kicker">สมัครผ่าน LINE</span>
          <h2>ยืนยันข้อมูลก่อนสมัครสมาชิก</h2>
          <p className="auth-register-subtitle">
            ดึงข้อมูลบางส่วนมาจากบัญชี LINE ของคุณแล้ว กรุณาตรวจสอบและกรอกข้อมูลที่เหลือให้ครบถ้วน
          </p>

          <form onSubmit={handleSubmit}>
            {pictureUrl && (
              <div className="line-register-avatar-preview">
                <img src={pictureUrl} alt="รูปโปรไฟล์ LINE" />
              </div>
            )}

            <div className="line-register-warning">
              กรุณาตรวจสอบชื่อ - นามสกุล และเบอร์โทรศัพท์ของท่านให้ถูกต้อง
              เนื่องจากจะต้องถูกนำไปเป็นข้อมูลในการออกประกาศนียบัตร
              ในกรณีที่ท่านสอบผ่าน
            </div>

            <div className="auth-register-form-grid">
              <div className="auth-register-input-group">
                <label htmlFor="first_name">ชื่อจริง</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
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
                  name="last_name"
                  placeholder="กรอกนามสกุล"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="email">อีเมล</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-register-input-group">
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="เช่น 0812345678"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-register-input-group auth-register-full-width">
                <label htmlFor="user_type">ประเภทผู้ใช้งาน</label>
                <select
                  id="user_type"
                  name="user_type"
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
            </div>

            <label className="auth-register-consent">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
              />
              <span>
                ข้าพเจ้ายินยอมให้จัดเก็บ รวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
                (เช่น ชื่อ-นามสกุล อีเมล เบอร์โทรศัพท์)
                เพื่อวัตถุประสงค์ในการลงทะเบียนสมาชิกและให้บริการ
                ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
              </span>
            </label>

            <button
              type="submit"
              className="auth-register-submit-btn"
              disabled={submitting || !consentChecked}
              style={{ opacity: submitting || !consentChecked ? 0.7 : 1 }}
            >
              {submitting ? "กำลังสมัครสมาชิก..." : "ยืนยันและสมัครสมาชิก"}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-register-right">
        <div className="auth-register-image-overlay">
          <div className="auth-register-hero-content">
            <div className="auth-register-glass-card">
              <span className="auth-register-glass-kicker">THAILAND AI ETHICS</span>
              <h3>เกือบเสร็จแล้ว</h3>
              <p>
                แค่ตรวจสอบข้อมูลให้ถูกต้องอีกนิดเดียว ก็พร้อมเริ่มเรียนรู้และประเมินตนเองได้ทันที
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineRegisterComplete;
