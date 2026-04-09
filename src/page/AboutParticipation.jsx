import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { UsersRound, Video, Mic, CalendarCheck } from "lucide-react";
import "./style/About.css";

function AboutParticipation() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-wrapper">
      <Tabbar />

      <section
        className="about-hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="about-hero-title">รูปแบบการเข้าร่วมประชุม</h1>
          <p className="about-hero-subtitle">
            ช่องทางและรายละเอียดสำหรับการเข้าร่วมรับฟังความคิดเห็นและอบรมเชิงปฏิบัติการ
          </p>
        </div>
      </section>

      <main className="about-main">
        <div className="about-card">
          <h2 className="about-section-title">
            <UsersRound className="icon" size={28} />
            ช่องทางการเข้าร่วม
          </h2>
          <div className="about-text-content">
            <p>
              เพื่ออำนวยความสะดวกให้กับผู้ที่สนใจเข้าร่วมโครงการจากทั่วประเทศ
              คณะผู้จัดงานได้จัดเตรียมรูปแบบการประชุมและอบรมเชิงปฏิบัติการออกเป็น
              2 รูปแบบหลัก ดังนี้:
            </p>
          </div>

          <ul className="about-list">
            <li>
              <Mic className="about-list-icon" size={24} />
              <div className="about-list-text">
                <h4>1. การประชุมแบบพบปะ (On-site / In-person)</h4>
                <p>
                  เหมาะสำหรับหน่วยงานนำร่องและผู้บริหารองค์กร
                  ที่ต้องการแลกเปลี่ยนความคิดเห็นเชิงลึก รับคำปรึกษาแบบตัวต่อตัว
                  และร่วมทำ Workshop การประเมินความพร้อม
                  (สถานที่จะแจ้งให้ทราบเมื่อลงทะเบียนสำเร็จ)
                </p>
              </div>
            </li>
            <li>
              <Video className="about-list-icon" size={24} />
              <div className="about-list-text">
                <h4>2. การประชุมผ่านระบบออนไลน์ (Online / Virtual Meeting)</h4>
                <p>
                  การถ่ายทอดสดผ่านแพลตฟอร์มออนไลน์ (เช่น Zoom หรือ Microsoft
                  Teams) สำหรับผู้สนใจทั่วไป สามารถรับชมการบรรยาย
                  ถาม-ตอบผ่านช่องแชท และรับประกาศนียบัตรอิเล็กทรอนิกส์
                </p>
              </div>
            </li>
          </ul>

          <h2 className="about-section-title" style={{ marginTop: "40px" }}>
            <CalendarCheck className="icon" size={28} />
            ขั้นตอนการลงทะเบียน
          </h2>
          <div className="about-text-content">
            <p>1. ตรวจสอบตารางกิจกรรมที่หน้า "ข่าวสารและกิจกรรม"</p>
            <p>2. กดปุ่ม "เข้าสู่ระบบ / ลงทะเบียน" ผ่านเว็บไซต์นี้</p>
            <p>
              3. เลือกกิจกรรมและรูปแบบการเข้าร่วมที่ต้องการ (On-site
              มีจำนวนจำกัด)
            </p>
            <p>4. รอรับ Email ยืนยันสิทธิ์และลิงก์สำหรับการเข้าร่วมประชุม</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutParticipation;
