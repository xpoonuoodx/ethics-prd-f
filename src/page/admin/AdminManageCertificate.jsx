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
  FaDownload,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "./style/AdminManageCertificate.css";
import api from "../../api/Api";
import CertificateTemplate, {
  DEFAULT_DURATION_TEXT,
  DEFAULT_WORKSHOP_DURATION_TEXT,
} from "../../component/CertificateTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const EMPTY_FORM = {
  course_name: "",
  duration_text: "",
  background_url: "",
  logo_url: "",
  signatory_name: "",
  signatory_position: "",
  signature_url: "",
  issuer_name: "",
  description: "",
};

const WORKSHOP_GROUP = 4;

// ช่องที่ CertificateTemplate ยังไม่ได้อ่านไปใช้จริง (กรอกแล้วบันทึกได้ แต่ใบประกาศไม่เปลี่ยน)
// จึงซ่อนไว้เป็นค่าเริ่มต้น กดปุ่ม "แสดงช่องที่ยังไม่ได้ใช้งาน" ถึงจะเห็น
// ถ้า template เริ่มใช้ช่องไหนแล้ว ให้เอาช่องนั้นออกจากรายการนี้และเอา showUnused ที่ครอบช่องนั้นออก
const UNUSED_FIELD_LABELS = [
  "คำอธิบายใต้ชื่อหลักสูตร",
  "ลิงก์รูปภาพลายเซ็น",
  "ลิงก์รูปภาพโลโก้องค์กร",
];

// workshop = true คือหน้าตั้งค่าแม่แบบของกลุ่มที่ 4 (Workshop) ที่แยกเป็นซับเมนูในไซด์บาร์
// ส่วนหน้าปกติเลือกได้เฉพาะกลุ่มที่ 1-3
const CertificateSettingsPage = ({ workshop }) => {
  const { fire } = useThemedAlert();
  const [selectedGroup, setSelectedGroup] = useState(
    workshop ? WORKSHOP_GROUP : 1,
  );
  const [loading, setLoading] = useState(false);
  // โหลดแม่แบบของกลุ่มที่เลือกไม่สำเร็จ - ต้องปิดปุ่มบันทึกไว้ ไม่งั้นฟอร์มที่ค้าง/ว่างอยู่
  // จะถูกบันทึกทับแม่แบบของกลุ่มนั้นโดยไม่ตั้งใจ
  const [loadError, setLoadError] = useState(false);
  // เพิ่มค่าทุกครั้งที่กด "ลองใหม่" เพื่อให้ effect โหลดข้อมูลกลุ่มเดิมซ้ำ
  const [reloadCount, setReloadCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [downloadingBlank, setDownloadingBlank] = useState(false);
  // แสดง/ซ่อนช่องที่ยังไม่ได้ใช้งานในใบประกาศ (ค่าที่เคยบันทึกไว้ยังอยู่ใน formData แม้ซ่อนอยู่
  // จึงถูกส่งกลับไปตอนบันทึกตามเดิม ไม่หาย)
  const [showUnused, setShowUnused] = useState(false);

  // State สำหรับเก็บฟอร์ม
  const [formData, setFormData] = useState(EMPTY_FORM);

  // โหลดข้อมูลเมื่อเลือกกลุ่มหลักสูตรใหม่
  // cancelled: ถ้าผู้ใช้สลับกลุ่มระหว่างรอ response ของกลุ่มก่อนหน้า ผลที่ตอบกลับมาช้า
  // จะถูกทิ้ง ไม่ให้ไปเขียนทับฟอร์มของกลุ่มที่เลือกอยู่ตอนนี้
  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    const fetchSettings = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const response = await api.get(
          `/admin/certificate-settings/${selectedGroup}`,
        );
        if (cancelled) return;

        if (response.data && response.data.success && response.data.data) {
          const data = response.data.data;
          setFormData({
            course_name: data.course_name || "",
            duration_text: data.duration_text || "",
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
        if (cancelled) return;
        console.error("Fetch Settings Error:", err);
        // ล้างฟอร์มทิ้ง ไม่ให้ค้างข้อมูลของกลุ่มก่อนหน้าแล้วดูเหมือนเป็นของกลุ่มนี้
        setFormData(EMPTY_FORM);
        setLoadError(true);
        fire("ข้อผิดพลาด", "ไม่สามารถโหลดการตั้งค่าแม่แบบได้", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      cancelled = true;
    };
  }, [selectedGroup, reloadCount, fire]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // กันบันทึกตอนข้อมูลของกลุ่มที่เลือกยังโหลดไม่เสร็จ/โหลดไม่สำเร็จ
    if (loading || loadError) return;
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

  // ดาวน์โหลดใบเซอร์ตัวอย่างแบบไม่มีชื่อ-วันที่ (เผื่อให้แอดมินเอาไปตรวจ/โชว์แม่แบบจริงได้
  // โดยไม่ผูกกับผู้รับคนใดคนหนึ่ง) ใช้ element เต็มขนาดจริงที่ซ่อนไว้ด้านล่าง (ไม่ใช่กล่อง preview
  // ที่ย่อด้วย CSS scale ด้านบน) แคปเจอร์ด้วย html2canvas แบบเดียวกับตอนผู้ใช้โหลด PDF จริง
  // (ดู UserCertificate.jsx) เพื่อให้ได้ไฟล์ความละเอียดเท่าของจริง ไม่เบลอ
  const handleDownloadBlank = async () => {
    const certElement = document.getElementById("amc-cert-blank-template");
    if (!certElement) return;

    try {
      setDownloadingBlank(true);
      certElement.style.display = "block";
      const canvas = await html2canvas(certElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      certElement.style.display = "none";

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      const groupLabel = workshop ? "Workshop" : `กลุ่มที่${selectedGroup}`;
      pdf.save(`ใบเซอร์ตัวอย่าง_${groupLabel}.pdf`);
    } catch (error) {
      console.error("Download Blank Certificate Error:", error);
      fire("เกิดข้อผิดพลาด", "ไม่สามารถดาวน์โหลดใบเซอร์ตัวอย่างได้", "error");
    } finally {
      setDownloadingBlank(false);
    }
  };

  // ดึงชื่อหลักสูตรมาโชว์ในกล่องพรีวิว
  const getCourseName = () => {
    if (selectedGroup === 1)
      return "หลักสูตรการกำกับดูแลและนโยบายจริยธรรมปัญญาประดิษฐ์";
    if (selectedGroup === 2)
      return "หลักสูตรแนวปฏิบัติและการพัฒนาปัญญาประดิษฐ์อย่างมีจริยธรรม";
    if (selectedGroup === 4) return "กิจกรรมฝึกอบรมหลักสูตรจริยธรรมปัญญาประดิษฐ์ในภาคปฏิบัติ (Workshop)";
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
                <h1 className="amc-title">
                  ตั้งค่าแม่แบบใบประกาศนียบัตร{workshop ? " (Workshop)" : ""}
                </h1>
                <p className="amc-subtitle">
                  จัดการชื่อผู้ลงนาม ลายเซ็น และภาพพื้นหลัง แยกตามหลักสูตร
                </p>
              </div>
            </div>

            <button
              className="amc-btn-primary"
              onClick={handleSave}
              disabled={isSaving || loading || loadError}
            >
              {isSaving ? <FaSpinner className="amc-spin-small" /> : <FaSave />}
              {isSaving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
            </button>
          </div>

          {!workshop && (
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
          )}

          {loading ? (
            <div className="amc-state-container">
              <FaSpinner className="amc-spin" />
              <p>กำลังโหลดข้อมูลการตั้งค่า...</p>
            </div>
          ) : loadError ? (
            <div className="amc-state-container">
              <p>
                ไม่สามารถโหลดแม่แบบของกลุ่มที่ {selectedGroup} ได้
                จึงปิดการบันทึกไว้เพื่อกันข้อมูลเดิมถูกเขียนทับ
              </p>
              <button
                type="button"
                className="amc-btn-outline"
                onClick={() => setReloadCount((n) => n + 1)}
              >
                ลองใหม่
              </button>
            </div>
          ) : (
            <div className="amc-grid-layout">
              {/* ฝั่งซ้าย: ฟอร์มกรอกข้อมูล */}
              <div className="amc-form-section">
                {/* แม่แบบนี้ไม่ถูก snapshot ไว้กับใบที่ออกไปแล้ว (ตาราง certificates เก็บแค่ผู้ใช้/กลุ่ม/เลขที่)
                    ทุกหน้าที่แสดงใบประกาศ join certificate_settings สด ๆ ตามกลุ่ม ดังนั้นบันทึกแล้ว
                    ใบเก่าของผู้ใช้ทุกคนในกลุ่มนี้เปลี่ยนตามทันที ตั้งใจให้เป็นแบบนี้ */}
                <p className="amc-apply-note">
                  เมื่อบันทึก การเปลี่ยนแปลงแม่แบบจะมีผลกับใบประกาศที่ออกไปแล้วของผู้ใช้ทุกคนในกลุ่มนี้ด้วย
                </p>

                <div className="amc-unused-bar">
                  <p className="amc-unused-text">
                    มี {UNUSED_FIELD_LABELS.length} ช่องที่ยังไม่มีผลกับใบประกาศ (
                    {UNUSED_FIELD_LABELS.join(", ")}){" "}
                    {showUnused ? "กำลังแสดงอยู่" : "จึงซ่อนไว้"}
                  </p>
                  <button
                    type="button"
                    className="amc-btn-outline"
                    onClick={() => setShowUnused((prev) => !prev)}
                    aria-expanded={showUnused}
                  >
                    {showUnused ? <FaEyeSlash /> : <FaEye />}
                    {showUnused
                      ? "ซ่อนช่องที่ยังไม่ได้ใช้งาน"
                      : "แสดงช่องที่ยังไม่ได้ใช้งาน"}
                  </button>
                </div>

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
                    <label>ชื่อหลักสูตรที่จะแสดงบนใบประกาศ</label>
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
                    <label>ระยะเวลาการฝึกอบรม</label>
                    <input
                      type="text"
                      name="duration_text"
                      value={formData.duration_text}
                      onChange={handleInputChange}
                      placeholder={
                        selectedGroup === WORKSHOP_GROUP
                          ? DEFAULT_WORKSHOP_DURATION_TEXT
                          : DEFAULT_DURATION_TEXT
                      }
                    />
                    <small className="amc-hint">
                      {selectedGroup === WORKSHOP_GROUP
                        ? 'แสดงในใบเป็น "(ระยะเวลาการฝึกอบรม จำนวน ...)"'
                        : 'แสดงในใบเป็น "ระยะเวลาการฝึกอบรมรวม ..."'}{" "}
                      เว้นว่างไว้เพื่อใช้ค่าเริ่มต้น (
                      {selectedGroup === WORKSHOP_GROUP
                        ? DEFAULT_WORKSHOP_DURATION_TEXT
                        : DEFAULT_DURATION_TEXT}
                      )
                    </small>
                  </div>
                  {showUnused && (
                    <div className="amc-form-group">
                      <label>
                        คำอธิบายใต้ชื่อหลักสูตร{" "}
                        <span className="amc-unused-tag">
                          ยังไม่มีผลกับใบประกาศ
                        </span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="เช่น ได้ผ่านการอบรมหลักสูตรด้านจริยธรรมปัญญาประดิษฐ์ เพื่อเสริมสร้างความรู้ด้านการกำกับดูแล..."
                        rows={2}
                      />
                    </div>
                  )}
                  <div className="amc-card-header">
                    <FaPenNib className="amc-card-icon" />
                    <h2>ข้อมูลผู้ลงนาม (Signatory)</h2>
                  </div>

                  <div className="amc-form-group">
                    <label>
                      ชื่อ-นามสกุล ผู้ลงนาม
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
                      ตำแหน่ง ผู้ลงนาม
                    </label>
                    <input
                      type="text"
                      name="signatory_position"
                      value={formData.signatory_position}
                      onChange={handleInputChange}
                      placeholder="เช่น ประธานคณะกรรมการขับเคลื่อนจริยธรรม AI"
                    />
                  </div>
                  {showUnused && (
                    <div className="amc-form-group">
                      <label>
                        ลิงก์รูปภาพลายเซ็น (URL - พื้นหลังโปร่งใส){" "}
                        <span className="amc-unused-tag">
                          ยังไม่มีผลกับใบประกาศ
                        </span>
                      </label>
                      <input
                        type="text"
                        name="signature_url"
                        value={formData.signature_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/signature.png"
                      />
                    </div>
                  )}
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
                  {showUnused && (
                    <div className="amc-form-group">
                      <label>
                        ลิงก์รูปภาพโลโก้องค์กร (Logo URL){" "}
                        <span className="amc-unused-tag">
                          ยังไม่มีผลกับใบประกาศ
                        </span>
                      </label>
                      <input
                        type="text"
                        name="logo_url"
                        value={formData.logo_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ฝั่งขวา: กล่องพรีวิว (จำลอง A4) */}
              <div className="amc-preview-section">
                <div className="amc-form-card">
                  <div className="amc-card-header amc-card-header-with-action">
                    <div className="amc-card-header-left">
                      <FaIdBadge className="amc-card-icon" />
                      <h2>ตัวอย่างการแสดงผล (Preview)</h2>
                    </div>
                    <button
                      type="button"
                      className="amc-btn-outline"
                      onClick={handleDownloadBlank}
                      disabled={downloadingBlank || loading}
                    >
                      {downloadingBlank ? (
                        <FaSpinner className="amc-spin-small" />
                      ) : (
                        <FaDownload />
                      )}
                      {downloadingBlank
                        ? "กำลังสร้างไฟล์..."
                        : "ดาวน์โหลดใบเซอร์ตัวอย่าง (ไม่มีชื่อ)"}
                    </button>
                  </div>
                  <div className="amc-preview-wrapper">
                    {/* ใช้ component จริงตัวเดียวกับที่ผู้ใช้เห็นตอนโหลด PDF (CertificateTemplate)
                        แค่ย่อขนาดด้วย CSS scale เพื่อให้พรีวิวตรงกับของจริง 100% ไม่ใช่ mockup แยก */}
                    <div className="amc-cert-preview-scale">
                      <div className="amc-cert-preview-inner">
                        <CertificateTemplate
                          cert={{
                            certId: 0,
                            courseGroup: selectedGroup,
                            trainingStart: "2026-11-05",
                            trainingEnd: "2026-11-06",
                            course_name:
                              formData.course_name || "กรุณาพิมพ์ชื่อหลักสูตร...",
                            duration_text: formData.duration_text,
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

                  {/* --- DOM ที่ซ่อนไว้สำหรับสร้างไฟล์ตัวอย่างแบบไม่มีชื่อ-วันที่ (เต็มขนาดจริง
                      ไม่ถูกย่อด้วย CSS scale เหมือนกล่อง preview ด้านบน) ข้อมูลอื่นแสดงครบทุกช่อง
                      ตามที่กรอกไว้ในฟอร์ม --- */}
                  <div
                    style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
                  >
                    <div id="amc-cert-blank-template" className="amc-cert-blank-template">
                      <CertificateTemplate
                        cert={{
                          certId: 0,
                          courseGroup: selectedGroup,
                          trainingStart: "",
                          trainingEnd: "",
                          course_name:
                            formData.course_name || "กรุณาพิมพ์ชื่อหลักสูตร...",
                          duration_text: formData.duration_text,
                          background_url: formData.background_url,
                          logo_url: formData.logo_url,
                          signatory_name: formData.signatory_name,
                          signatory_position: formData.signatory_position,
                          signature_url: formData.signature_url,
                          issuer_name: formData.issuer_name,
                          description: formData.description,
                          passDate: "",
                        }}
                        userName=""
                      />
                    </div>
                  </div>
                  {/* ------------------------------------------- */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// สองเส้นทาง (/admin-manage-certificate กับ /admin-manage-certificate-workshop) เรนเดอร์ component
// ตัวเดียวกันในตำแหน่งเดียวกัน React เลยใช้ instance เดิมซ้ำเวลากดสลับซับเมนู ทำให้ state
// (selectedGroup / ฟอร์ม) ไม่ถูกรีเซ็ต แล้วหน้า Workshop จะแก้และบันทึกข้อมูลของกลุ่ม 1 แทน
// ใส่ key ตาม workshop เพื่อบังคับให้ remount ใหม่ทุกครั้งที่สลับ
const AdminManageCertificate = ({ workshop = false }) => (
  <CertificateSettingsPage
    key={workshop ? "workshop" : "main"}
    workshop={workshop}
  />
);

export default AdminManageCertificate;
