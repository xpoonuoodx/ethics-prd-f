import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { Users } from "lucide-react";
import "./style/About.css";

// หน้า "ทำเนียบรุ่น" (Public) - ตอนนี้สร้างโครงหน้าไว้เฉยๆ ก่อน (ยังไม่ดึงข้อมูลจริง)
// รอคุยรายละเอียดว่าจะดึงข้อมูลอะไรมาแสดง แล้วค่อยกลับมาต่อ
function Alumni() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-wrapper">
      <Tabbar />

      <section
        className="about-hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-kicker">Thailand AI Ethics</span>
          <h1 className="about-hero-title">ทำเนียบรุ่น</h1>
          <p className="about-hero-subtitle">
            รวมรายชื่อผู้ผ่านการอบรมและได้รับใบประกาศนียบัตรจริยธรรมปัญญาประดิษฐ์
          </p>
        </div>
      </section>

      <main className="about-main">
        <div className="about-card">
          <h2 className="about-section-title">
            <div className="icon-wrapper">
              <Users className="icon" size={24} strokeWidth={2.5} />
            </div>
            เร็วๆ นี้
          </h2>
          <div className="about-text-content">
            <p>หน้านี้กำลังอยู่ระหว่างการพัฒนา</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Alumni;
