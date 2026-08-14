import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import defaultLogo from "../assets/logo-bde.png";
import "./style/CertificateTemplate.css";

// รูปพื้นหลัง/โลโก้/ลายเซ็นที่ admin วาง URL จากภายนอกไว้ (เช่น cdn.phototourl.com) มักไม่ได้ส่ง
// header Access-Control-Allow-Origin กลับมา หน้าเว็บเลยโชว์รูปได้ปกติ (แค่ paint ไม่ต้องขอ CORS)
// แต่ html2canvas ต้องอ่านพิกเซลจริงตอนแปลงเป็น PDF เลยได้ภาพว่างเปล่า - พร็อกซีผ่าน backend
// ของเราเอง (ที่แปะ Access-Control-Allow-Origin: * ให้) แก้ปัญหานี้ได้
const proxiedImageUrl = (url) => {
  if (!url) return url;
  const apiBase = import.meta.env.VITE_APP_API_ENDPOINT || "";
  return `${apiBase}/public/proxy-image?url=${encodeURIComponent(url)}`;
};

// แม่แบบใบประกาศนียบัตร ใช้ร่วมกันระหว่างหน้า User และ Regulator (เดิมโค้ดซ้ำกันทั้งไฟล์)
// รับค่าจาก certificate_settings ของ course_group นั้น ๆ ผ่าน prop `cert`
const CertificateTemplate = ({ cert, userName }) => {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  // เลขที่ใบเซอร์รันตาม user_type เช่น dev-2600001 (ดู back-ai-ethic/utils/certNumber.js)
  // ใบเก่าก่อนมีระบบนี้จะไม่มี certNumber เลย fallback กลับไปใช้รูปแบบเดิมจาก id แทน
  const refNo =
    cert.certNumber || `AI-CERT-${String(cert.certId).padStart(3, "0")}`;

  // QR ต้องเข้ารหัสเป็น URL เต็ม ไม่ใช่ข้อความเปล่า ๆ ถึงจะสแกนแล้วเด้งไปหน้าตรวจสอบอัตโนมัติได้
  // รองรับเฉพาะใบที่มี certNumber จริง (เลขรูปแบบใหม่) เท่านั้น ใบเก่ายังไม่มีหน้าตรวจสอบรองรับ
  // เลยปล่อยเป็นข้อความเดิมไป (ตามที่ตกลงกันไว้ - ยังไม่ทำ verify ใบเก่า)
  const qrContent = cert.certNumber
    ? `${window.location.origin}/verify/${cert.certNumber}`
    : refNo;

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(qrContent, {
      margin: 1,
      width: 200,
      color: { dark: "#111827" },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [qrContent]);

  return (
    <div
      className="cert-tpl"
      style={
        cert.background_url
          ? {
              backgroundImage: `url(${proxiedImageUrl(cert.background_url)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {!cert.background_url && (
        <>
          <span className="cert-tpl-badge cert-tpl-badge-left"></span>
          <span className="cert-tpl-badge cert-tpl-badge-right"></span>
          <span className="cert-tpl-arc"></span>
        </>
      )}

      {/* กลุ่มเนื้อหาหลัก ห่อไว้เพื่อจัดกึ่งกลางแนวตั้งในพื้นที่เหนือ footer แทนที่จะชิดขอบบนสุด */}
      <div className="cert-tpl-main">
        <div className="cert-tpl-header">
          <img
            src={cert.logo_url ? proxiedImageUrl(cert.logo_url) : defaultLogo}
            alt="Logo"
            className="cert-tpl-logo"
          />
          <h2 className="cert-tpl-issuer">
            {cert.issuer_name || "AI Ethics Platform"}
          </h2>
          <p className="cert-tpl-grant-line">ขอมอบประกาศนียบัตรไว้เพื่อแสดงว่า</p>
        </div>

        <div className="cert-tpl-body">
          <h1 className="cert-tpl-name">{userName}</h1>
          <h3 className="cert-tpl-course">{cert.course_name}</h3>
          {cert.description && (
            <p className="cert-tpl-description">{cert.description}</p>
          )}
        </div>

        <p className="cert-tpl-date-line">
          ให้ไว้ ณ วันที่{" "}
          <span className="cert-tpl-date-value">{cert.passDate}</span>
        </p>
      </div>

      <div className="cert-tpl-footer">
        <div className="cert-tpl-signature">
          {cert.signature_url ? (
            <img
              src={proxiedImageUrl(cert.signature_url)}
              alt="Signature"
              className="cert-tpl-signature-img"
            />
          ) : (
            <div className="cert-tpl-signature-line"></div>
          )}
          <span className="cert-tpl-signatory-name">
            ({cert.signatory_name || "ผู้อำนวยการโครงการ"})
          </span>
          {cert.signatory_position && (
            <span className="cert-tpl-signatory-position">
              {cert.signatory_position}
            </span>
          )}
        </div>

        <div className="cert-tpl-qr-box">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" />
          ) : (
            <span>QR CODE</span>
          )}
        </div>
      </div>

      <div className="cert-tpl-ref">Reference No: {refNo}</div>
    </div>
  );
};

export default CertificateTemplate;
