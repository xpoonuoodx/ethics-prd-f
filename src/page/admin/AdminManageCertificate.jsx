import React, { useState, useEffect } from "react";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import {
  FaPalette,
  FaSave,
  FaSpinner,
  FaImage,
  FaPenNib,
  FaIdBadge,
} from "react-icons/fa";
import "./style/AdminManageCertificate.css";
import api from "../../api/Api";
import CertificateTemplate from "../../component/CertificateTemplate";

const EMPTY_FORM = {
  course_name: "",
  background_url: "",
  logo_url: "",
  signatory_name: "",
  signatory_position: "",
  signature_url: "",
  issuer_name: "",
  description: "",
};

const AdminManageCertificate = () => {
  const { fire } = useThemedAlert();
  const [selectedGroup, setSelectedGroup] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State สำหรับเก็บฟอร์ม
  const [formData, setFormData] = useState(EMPTY_FORM);

  // โหลดข้อมูลเมื่อเลือกกลุ่มหลักสูตรใหม่
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSettings(selectedGroup);
  }, [selectedGroup]);

  const fetchSettings = async (groupId) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/certificate-settings/${groupId}`);

      if (response.data && response.data.success && response.data.data) {
        const data = response.data.data;
        setFormData({
          course_name: data.course_name || "",
          background_url: data.background_url || "",
          logo_url: data.logo_url || "",
          signatory_name: data.signatory_name || "",
          signatory_position: data.signatory_position || "",
          signature_url: data.signature_url || "",
          issuer_name: data.issuer_name || "",
          description: data.description || "",
        });
      } else {
        // ถ้ายังไม่มีข้อมูล ให้เคลียร์ฟอร์ม
        setFormData(EMPTY_FORM);
      }
    } catch (err) {
      console.error("Fetch Settings Error:", err);
      fire("ข้อผิดพลาด", "ไม่สามารถโหลดการตั้งค่าแม่แบบได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.signatory_name || !formData.signatory_position) {
      fire({
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกชื่อและตำแหน่งของผู้ลงนามให้ครบถ้วน",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        course_group: selectedGroup,
        ...formData,
      };

      const response = await api.post("/admin/certificate-settings", payload);

      if (response.data && response.data.success) {
        fire({
          title: "บันทึกสำเร็จ!",
          text: `อัปเดตแม่แบบใบประกาศฯ ของกลุ่มที่ ${selectedGroup} เรียบร้อยแล้ว`,
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Save Settings Error:", error);
      fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ดึงชื่อหลักสูตรมาโชว์ในกล่องพรีวิว
  const getCourseName = () => {
    if (selectedGroup === 1)
      return "หลักสูตรการกำกับดูแลและนโยบายจริยธรรมปัญญาประดิษฐ์";
    if (selectedGroup === 2)
      return "หลักสูตรแนวปฏิบัติและการพัฒนาปัญญาประดิษฐ์อย่างมีจริยธรรม";
    return "หลักสูตรความตระหนักรู้ด้านจริยธรรมปัญญาประดิษฐ์สำหรับผู้ใช้งาน";
  };

  return (
    <div className="amc-layout">
      <SidebarAdmin />

      <div className="amc-main-content">
        <div className="amc-container">
          <div className="amc-header">
            <div className="amc-header-title-wrap">
              <div className="amc-header-icon">
                <FaPalette />
              </div>
              <div>
                <h1 className="amc-title">ตั้งค่าแม่แบบใบประกาศนียบัตร</h1>
                <p className="amc-subtitle">
                  จัดการชื่อผู้ลงนาม ลายเซ็น และภาพพื้นหลัง แยกตามหลักสูตร
                </p>
              </div>
            </div>

            <button
              className="amc-btn-primary"
              onClick={handleSave}
              disabled={isSaving || loading}
            >
              {isSaving ? <FaSpinner className="amc-spin-small" /> : <FaSave />}
              {isSaving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
            </button>
          </div>

          <div className="amc-toolbar">
            <label className="amc-toolbar-label">
              เลือกหลักสูตรที่ต้องการตั้งค่าแม่แบบ:
            </label>
            <div className="amc-radio-group">
              {[1, 2, 3].map((group) => (
                <label
                  key={group}
                  className={`amc-radio-label ${selectedGroup === group ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="courseGroup"
                    value={group}
                    checked={selectedGroup === group}
                    onChange={() => setSelectedGroup(group)}
                  />
                  กลุ่มที่ {group}{" "}
                  {group === 1
                    ? "(Regulator/Policy)"
                    : group === 2
                      ? "(Developer/Researcher)"
                      : "(User)"}
                </label>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="amc-state-container">
              <FaSpinner className="amc-spin" />
              <p>กำลังโหลดข้อมูลการตั้งค่า...</p>
            </div>
          ) : (
            <div className="amc-grid-layout">
              {/* ฝั่งซ้าย: ฟอร์มกรอกข้อมูล */}
              <div className="amc-form-section">
                <div className="amc-form-card">
                  <div className="amc-card-header">
                    <FaPenNib className="amc-card-icon" />
                    <h2>ข้อมูลบนใบประกาศ (Certificate Details)</h2>
                  </div>

                  <div className="amc-form-group">
                    <label>
                      ชื่อหน่วยงานผู้ออกใบประกาศ (ขึ้นหัวใบ)
                    </label>
                    <input
                      type="text"
                      name="issuer_name"
                      value={formData.issuer_name}
                      onChange={handleInputChange}
                      placeholder="เช่น สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ"
                    />
                  </div>
                  <div className="amc-form-group">
                    <label>
                      ชื่อหลักสูตรที่จะแสดงบนใบประกาศ{" "}
                      <span className="amc-required">*</span>
                    </label>
                    <textarea
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleInputChange}
                      placeholder={
                        "เช่น จริยธรรมปัญญาประดิษฐ์สำหรับผู้บริหาร ผู้กำหนดนโยบาย และผู้กำกับติดตาม\n(AI Ethics for Executives, Policymakers and Regulators)"
                      }
                      rows={2}
                    />
                    <small className="amc-hint">
                      ขึ้นบรรทัดใหม่ได้ถ้าอยากใส่ชื่อภาษาอังกฤษกำกับไว้บรรทัดที่ 2
                    </small>
                  </div>
                  <div className="amc-form-group">
                    <label>คำอธิบายใต้ชื่อหลักสูตร</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="เช่น ได้ผ่านการอบรมหลักสูตรด้านจริยธรรมปัญญาประดิษฐ์ เพื่อเสริมสร้างความรู้ด้านการกำกับดูแล..."
                      rows={2}
                    />
                  </div>
                  <div className="amc-card-header">
                    <FaPenNib className="amc-card-icon" />
                    <h2>ข้อมูลผู้ลงนาม (Signatory)</h2>
                  </div>

                  <div className="amc-form-group">
                    <label>
                      ชื่อ-นามสกุล ผู้ลงนาม{" "}
                      <span className="amc-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="signatory_name"
                      value={formData.signatory_name}
                      onChange={handleInputChange}
                      placeholder="เช่น ศ.ดร. สมชาย ใจดี"
                    />
                  </div>
                  <div className="amc-form-group">
                    <label>
                      ตำแหน่ง ผู้ลงนาม <span className="amc-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="signatory_position"
                      value={formData.signatory_position}
                      onChange={handleInputChange}
                      placeholder="เช่น ประธานคณะกรรมการขับเคลื่อนจริยธรรม AI"
                    />
                  </div>
                  <div className="amc-form-group">
                    <label>ลิงก์รูปภาพลายเซ็น (URL - พื้นหลังโปร่งใส)</label>
                    <input
                      type="text"
                      name="signature_url"
                      value={formData.signature_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/signature.png"
                    />
                  </div>
                </div>

                <div className="amc-form-card">
                  <div className="amc-card-header">
                    <FaImage className="amc-card-icon" />
                    <h2>รูปภาพและพื้นหลัง (Images)</h2>
                  </div>
                  <div className="amc-form-group">
                    <label>ลิงก์รูปภาพพื้นหลังใบเซอร์ (Background URL)</label>
                    <input
                      type="text"
                      name="background_url"
                      value={formData.background_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/certificate-bg.png"
                    />
                    <small className="amc-hint">
                      แนะนำสัดส่วน A4 แนวนอน (297 x 210 mm)
                    </small>
                  </div>
                  <div className="amc-form-group">
                    <label>ลิงก์รูปภาพโลโก้องค์กร (Logo URL)</label>
                    <input
                      type="text"
                      name="logo_url"
                      value={formData.logo_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
              </div>

              {/* ฝั่งขวา: กล่องพรีวิว (จำลอง A4) */}
              <div className="amc-preview-section">
                <div className="amc-form-card">
                  <div className="amc-card-header">
                    <FaIdBadge className="amc-card-icon" />
                    <h2>ตัวอย่างการแสดงผล (Preview)</h2>
                  </div>
                  <div className="amc-preview-wrapper">
                    {/* ใช้ component จริงตัวเดียวกับที่ผู้ใช้เห็นตอนโหลด PDF (CertificateTemplate)
                        แค่ย่อขนาดด้วย CSS scale เพื่อให้พรีวิวตรงกับของจริง 100% ไม่ใช่ mockup แยก */}
                    <div className="amc-cert-preview-scale">
                      <div className="amc-cert-preview-inner">
                        <CertificateTemplate
                          cert={{
                            certId: 0,
                            course_name:
                              formData.course_name || "กรุณาพิมพ์ชื่อหลักสูตร...",
                            background_url: formData.background_url,
                            logo_url: formData.logo_url,
                            signatory_name: formData.signatory_name,
                            signatory_position: formData.signatory_position,
                            signature_url: formData.signature_url,
                            issuer_name: formData.issuer_name,
                            description: formData.description,
                            passDate: "1 มกราคม 2569",
                          }}
                          userName="นายทดสอบ ระบบดีเยี่ยม"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="amc-preview-note">
                    * พรีวิวนี้คือหน้าตาเดียวกับที่ผู้ใช้จะเห็นตอนดาวน์โหลด PDF จริง
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageCertificate;
