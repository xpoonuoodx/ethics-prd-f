import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { Phone, Mail, MapPin } from "lucide-react";
import "./style/Contact.css";

function Contact() {
  // เลื่อนหน้าจอขึ้นบนสุดเมื่อโหลดหน้านี้
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-wrapper">
      <Tabbar />

      {/* --- ส่วน Header --- */}
      <div className="contact-header-clean">
        <h1 className="contact-page-title">ติดต่อเรา</h1>
        <p className="contact-page-subtitle">
          สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ
          ยินดีให้บริการและตอบทุกข้อสงสัยของคุณ
        </p>
      </div>

      {/* --- ส่วนเนื้อหาหลัก --- */}
      <main className="contact-main-content">
        {/* 1. ส่วนการ์ด 3 ใบ (เรียงแนวนอนตามรูปเรฟ) */}
        <div className="contact-cards-row">
          {/* Card 1: โทรศัพท์ (สีเข้ม) */}
          <div className="contact-box box-dark">
            <div className="box-title-row">
              <div className="box-icon-circle">
                <Phone size={24} className="box-icon" />
              </div>
              <h2 className="box-title">02-141-XXXX</h2>
            </div>
            <p className="box-desc">
              สายด่วนศูนย์บริการข้อมูลภาครัฐ 1111
              <br />
              ให้บริการในวันและเวลาราชการ
              <br />
              (08:30 - 16:30 น.)
            </p>
          </div>

          {/* Card 2: อีเมล (สีอ่อน) */}
          <div className="contact-box box-light">
            <div className="box-title-row">
              <div className="box-icon-circle">
                <Mail size={24} className="box-icon" />
              </div>
              <h2 className="box-title">contact@onde.go.th</h2>
            </div>
            <p className="box-desc">
              ส่งอีเมลเพื่อติดต่อสอบถามข้อมูลทั่วไป แจ้งปัญหาการใช้งานระบบ
              หรือส่งเอกสารที่เกี่ยวข้อง
            </p>
          </div>

          {/* Card 3: สถานที่ตั้ง (สีขาว) */}
          <div className="contact-box box-white">
            <div className="box-title-row">
              <div className="box-icon-circle">
                <MapPin size={24} className="box-icon" />
              </div>
              <h2 className="box-title">ศูนย์ราชการฯ แจ้งวัฒนะ</h2>
            </div>
            <p className="box-desc">
              เลขที่ 120 หมู่ 3 อาคารรัฐประศาสนภักดี (อาคารบี) แขวงทุ่งสองห้อง
              เขตหลักสี่ กรุงเทพมหานคร 10210
            </p>
          </div>
        </div>

        {/* 2. ส่วนแผนที่ (กว้างเต็มกรอบ โค้งมน) */}
        <div className="contact-map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.3496987556735!2d100.5629169148318!3d13.877864490266014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2832c3f8f94d7%3A0x6e2c349071b782b4!2sGovernment%20Complex%20Building%20B!5e0!3m2!1sen!2sth!4v1680000000000!5m2!1sen!2sth"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
