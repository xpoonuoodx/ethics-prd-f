import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaArrowLeft,
  FaSpinner,
  FaUserCircle,
  FaIdBadge,
  FaCamera,
} from "react-icons/fa";
import api, { getStoredUser } from "../../api/Api";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import { sanitizePhone } from "../../utils/validators";
import "./style/RegulatorProfile.css";

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const getInitials = (name) => {
  if (!name) return "RG";
  return name.substring(0, 2).toUpperCase();
};

const RegulatorProfile = () => {
  const navigate = useNavigate();
  const { fire } = useThemedAlert();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [account, setAccount] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/regulator/profile");
      if (response.data && response.data.success) {
        const data = response.data.data;
        setAccount(data);
        setFormData({
          first_name: data.first_name_th || "",
          last_name: data.last_name_th || "",
          email: data.email || "",
          mobile: data.mobile || "",
        });
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "mobile" ? sanitizePhone(value) : value,
    }));
  };

  const handleImageButtonClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      fire({
        icon: "warning",
        title: "ไฟล์ไม่ถูกต้อง",
        text: "รองรับเฉพาะไฟล์รูปภาพ .jpg .png .webp เท่านั้น",
        confirmButtonColor: "#3f6b21",
      });
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      fire({
        icon: "warning",
        title: "ไฟล์มีขนาดใหญ่เกินไป",
        text: "ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB",
        confirmButtonColor: "#3f6b21",
      });
      e.target.value = "";
      return;
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploadingImage(true);
      const response = await api.post("/regulator/profile-image", uploadData);
      if (response.data && response.data.success) {
        const newUrl = response.data.data.profile_image_url;
        setAccount((prev) => ({ ...prev, profile_image_url: newUrl }));

        const storedUser = getStoredUser();
        if (storedUser) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...storedUser, profile_image_url: newUrl }),
          );
        }

        fire({
          title: "เปลี่ยนรูปโปรไฟล์สำเร็จ",
          icon: "success",
          confirmButtonColor: "#3f6b21",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      fire({
        title: "อัปโหลดรูปไม่สำเร็จ",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile.length < 9) {
      return fire({
        icon: "warning",
        title: "รูปแบบข้อมูลไม่ถูกต้อง",
        text: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 9-10 หลัก ขึ้นต้นด้วย 0)",
        confirmButtonColor: "#3f6b21",
      });
    }

    try {
      setSaving(true);
      const response = await api.put("/regulator/profile", formData);
      if (response.data && response.data.success) {
        fire({
          title: "บันทึกข้อมูลสำเร็จ",
          icon: "success",
          confirmButtonColor: "#3f6b21",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchProfile();
      }
    } catch (error) {
      fire({
        title: "บันทึกข้อมูลไม่สำเร็จ",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarRegulator />
        <div className="user-portal-content rp-flex-center">
          <FaSpinner className="rp-loading-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarRegulator />
      <div className="user-portal-content">
        <div className="rp-container">
          <button
            className="rp-back-btn"
            onClick={() => navigate("/regulator-dashboard")}
          >
            <FaArrowLeft /> กลับสู่แดชบอร์ด
          </button>

          <div className="rp-header">
            <h1 className="rp-title">ข้อมูลส่วนตัว</h1>
            <p className="rp-subtitle">
              ดูและแก้ไขข้อมูลส่วนตัวของบัญชีคุณ
            </p>
          </div>

          {/* รูปโปรไฟล์ */}
          <div className="rp-card">
            <div className="rp-card-header">
              <FaCamera className="rp-card-header-icon" />
              <h2>รูปโปรไฟล์</h2>
            </div>
            <div className="rp-avatar-row">
              <div className="rp-avatar-preview">
                {account?.profile_image_url ? (
                  <img src={account.profile_image_url} alt="รูปโปรไฟล์" />
                ) : (
                  <span>{getInitials(account?.first_name_th)}</span>
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="rp-btn-outline"
                  onClick={handleImageButtonClick}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
                </button>
                <p className="rp-avatar-hint">
                  ไฟล์ .jpg .png .webp ขนาดไม่เกิน 2MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  hidden
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลบัญชี (แก้ไขไม่ได้) */}
          <div className="rp-card">
            <div className="rp-card-header">
              <FaIdBadge className="rp-card-header-icon" />
              <h2>ข้อมูลบัญชี</h2>
            </div>
            <div className="rp-account-grid">
              <div className="rp-account-item">
                <label>รหัสผู้ใช้งาน</label>
                <p>{account?.user_code || "-"}</p>
              </div>
              <div className="rp-account-item">
                <label>ชื่อผู้ใช้งาน (Username)</label>
                <p>{account?.username || "-"}</p>
              </div>
              <div className="rp-account-item">
                <label>หน่วยงาน</label>
                <p>{account?.org_name || "-"}</p>
              </div>
            </div>
          </div>

          {/* แก้ไขข้อมูลส่วนตัว */}
          <div className="rp-card">
            <div className="rp-card-header">
              <FaUserCircle className="rp-card-header-icon" />
              <h2>แก้ไขข้อมูลส่วนตัว</h2>
            </div>
            <form className="rp-form" onSubmit={handleSubmit}>
              <div className="rp-form-row rp-col-2">
                <div className="rp-form-group">
                  <label>ชื่อจริง</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="rp-form-group">
                  <label>นามสกุล</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="rp-form-row rp-col-2">
                <div className="rp-form-group">
                  <label>อีเมล</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="rp-form-group">
                  <label>เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="เช่น 0812345678"
                    maxLength="10"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="rp-btn-primary"
                disabled={saving}
              >
                {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorProfile;
