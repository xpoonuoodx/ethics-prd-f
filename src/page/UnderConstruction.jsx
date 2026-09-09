import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import "./style/Contact.css"; 

function Manual() {
  // เลื่อนหน้าจอขึ้นบนสุดเมื่อโหลดหน้านี้
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-wrapper">
      {/* 1. เมนู */}
      <Tabbar />

      {/* 2. ส่วน Header: หัวข้อคู่มือ และ 3. คำบรรยายใต้คู่มือ */}
      <div className="contact-header-clean">
        <h1 className="contact-page-title">คู่มือระบบ AI Ethics</h1>
        <p className="contact-page-subtitle">
          สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ
        </p>
      </div>

      {/* --- ส่วนเนื้อหาหลัก: คลิปวิดีโอจาก YouTube --- */}
      <main className="contact-main-content" style={{ padding: "20px 0px" }}>
        
        {/* เอา className เดิมออก และคุมสัดส่วนด้วย style นี้แทน */}
        <div 
          style={{ 
            width: "100%",
            maxWidth: "1024px", /* ปรับความกว้างสูงสุดตรงนี้ */
            margin: "0 auto",
            aspectRatio: "16/9", /* บังคับสัดส่วนวิดีโอให้เป็นสี่เหลี่ยมผืนผ้าปกติ */
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#000", /* รองพื้นสีดำให้ดูเป็นกรอบวิดีโอ */
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)" /* เพิ่มเงาให้ดูมีมิติ (ลบออกได้ถ้าไม่ชอบ) */
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/oOcWs15sm40" // ✅ จิมมี่แก้ลิงก์วิดีโอเป็นตัวใหม่ให้ตรงนี้ครับ
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="คู่มือการใช้งานระบบ AI Ethics"
          ></iframe>
        </div>

      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}

export default Manual;