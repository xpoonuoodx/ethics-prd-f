import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
// cer-frame.jpg = รูปพื้นหลัง "เฉพาะกรอบตกแต่ง + ลายเซ็น" เท่านั้น (ไม่มีโลโก้/ข้อความ bake ไว้แล้ว
// ต่างจากเวอร์ชันก่อนหน้า) โลโก้ทั้งสองและข้อความทั้งหมดตอนนี้เป็น element จริงที่ coded ไว้ด้านล่าง
// เพื่อให้คมชัดเสมอไม่ขึ้นกับความละเอียดของไฟล์รูป - ดูที่มาที่ src/assets/certificate/README.md
import certFrameBg from "../assets/certificate/cer-frame.jpg";
// ใช้เวอร์ชัน raster (PNG) แทน logo-de.svg ตัวจริง - html2canvas (ใช้ตอนสร้าง PDF) แสดงผล SVG
// เชิงซ้อนที่มี gradient/defs เยอะแบบนี้ไม่ได้ ได้ช่องว่างเปล่า ๆ แทนโลโก้ (bug ของ html2canvas
// เอง) เลย render SVG ตัวจริงเป็น PNG ความละเอียดสูงไว้ล่วงหน้าแทน หน้าตาเหมือนกันทุกประการ
import logoDe from "../assets/certificate/logo-de-raster.png";
// โลโก้ตัวที่ 2 เปลี่ยนจาก logo-bde.png (เวอร์ชันภาษาอังกฤษ ตัวยาวแนวนอน) เป็น logo-bde2.svg
// (เวอร์ชันภาษาไทย 2 บรรทัด - ตรงกับตัวที่ bake อยู่ในรูปใบเซอร์ต้นฉบับ) เหตุผลที่ต้อง render
// เป็น raster PNG ไว้ล่วงหน้าเหมือนกับ logo-de: html2canvas แสดงผล SVG นี้ไม่ได้ตอน export PDF
import logoBde from "../assets/certificate/logo-bde2-raster.png";
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

  // ใช้รูปพื้นหลังที่แอดมินตั้งเอง (background_url) ถ้ามี ไม่งั้น fallback เป็น cer-frame.jpg
  // (กรอบ+ลายเซ็นเปล่า ๆ) - ถ้าแอดมินจะใส่ background_url เองต้องเป็นรูป "เฉพาะกรอบ" แบบเดียวกัน
  // ไม่งั้นข้อความที่ coded ไว้ด้านล่างจะไปซ้อนทับข้อความที่ bake อยู่ในรูปเดิมของแอดมิน
  const backgroundImg = cert.background_url
    ? proxiedImageUrl(cert.background_url)
    : certFrameBg;

  return (
    <div
      className="cert-tpl"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* โลโก้ 2 อัน - ของจริงที่ใช้อยู่แล้วทั้งเว็บ (ไม่ใช่ pixel ที่ bake ในรูป) เลยคมชัดเสมอ
          ห่อด้วย flex row เดียวกัน (align-items:center) แทนการ fix top/left แยกแต่ละอัน
          เพื่อให้อยู่บรรทัดเดียวกัน (กึ่งกลางแนวตั้งเทียบกันเองเสมอ ไม่ว่าอัตราส่วนแต่ละโลโก้จะ
          ต่างกันแค่ไหน) และอยู่กึ่งกลางหน้ากระดาษจริง ๆ ในฐานะกลุ่มเดียว ไม่ใช่กึ่งกลางแยกกันคนละอัน */}
      <div className="cert-tpl-logo-row">
        <img src={logoDe} alt="DE Seal" className="cert-tpl-logo-de" />
        <img src={logoBde} alt="BDE Logo" className="cert-tpl-logo-bde" />
      </div>

      <div className="cert-tpl-title">ประกาศนียบัตร</div>
      <div className="cert-tpl-grant-line">ให้ไว้เพื่อแสดงว่า</div>

      <div className="cert-tpl-overlay-name">{userName}</div>

      <div className="cert-tpl-pass-line">
        ได้ผ่านการอบรม ด้วยระบบการเรียนออนไลน์ในบทเรียน
      </div>
      <div className="cert-tpl-overlay-course">{cert.course_name}</div>

      <div className="cert-tpl-issuer-line">
        โดย{cert.issuer_name || "สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ"}
      </div>

      <div className="cert-tpl-date-line">
        <span>ให้ ณ วันที่</span>
        <span className="cert-tpl-overlay-date">{cert.passDate}</span>
      </div>

      {/* ลายเซ็น (รูปขีดเขียนจริง + เส้นใต้) เป็นส่วนหนึ่งของ cer-frame.jpg อยู่แล้ว ไม่ต้องวาดซ้ำ
          เหลือแค่ชื่อ+ตำแหน่งผู้ลงนามที่ต้อง coded ทับ (ดึงจาก certificate_settings เหมือนเดิม) */}
      <div className="cert-tpl-signatory-name">
        {cert.signatory_name || "นายเวทางค์ พ่วงทรัพย์"}
      </div>
      <div className="cert-tpl-signatory-position">
        {cert.signatory_position ||
          "เลขาธิการคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ"}
      </div>

      <div className="cert-tpl-overlay-ref">Ref: {refNo}</div>
      <div className="cert-tpl-overlay-qr">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code" />
        ) : (
          <span>QR</span>
        )}
      </div>
    </div>
  );
};

export default CertificateTemplate;
