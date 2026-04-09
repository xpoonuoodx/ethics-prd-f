import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { Phone, Mail } from "lucide-react";
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
        <h1 className="contact-page-title">ช่องทางการติดต่อ</h1>
        <p className="contact-page-subtitle">
          สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ
          ยินดีให้บริการและตอบทุกข้อสงสัยของคุณ
        </p>
      </div>

      {/* --- ส่วนเนื้อหาหลัก (Split Cards Layout แบบสมดุล) --- */}
      <main className="contact-main-content">
        {/* Card 1: สถานที่ตั้ง + แผนที่ */}
        <div className="contact-card-split">
          <div className="contact-text-side">
            <span className="contact-tag-label">OUR LOCATION</span>
            <h2 className="contact-heading">สถานที่ตั้ง</h2>
            <p className="contact-paragraph">
              <strong>
                สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ
              </strong>
              <br />
              <br />
              เลขที่ 120 หมู่ที่ 3 อาคารรัฐประศาสนภักดี (อาคารบี)
              <br />
              ศูนย์ราชการเฉลิมพระเกียรติ ๘๐ พรรษาฯ ถนนแจ้งวัฒนะ
              <br />
              แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพมหานคร 10210
            </p>
          </div>
          <div className="contact-visual-side">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.3284055273733!2d100.56300451527552!3d13.882186790263653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2833630f9a2bb%3A0xcda6b080fb925dc5!2z4Lio4Li44LiZ4Lii4LmM4Lij4Liy4LiK4LiB4Liy4Lij4LmA4LiJ4Lil4Li04Lih4Lie4Lij4Liw4LmA4LiB4Li14Lii4Lij4LiV4Li0IDgwIOCLieCij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij-Cij!5e0!3m2!1sth!2sth!4v1680000000000!5m2!1sth!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>

        {/* Card 2: โทรศัพท์ & อีเมล */}
        <div className="contact-card-split">
          <div className="contact-text-side">
            <span className="contact-tag-label">GET IN TOUCH</span>
            <h2 className="contact-heading">ติดต่อสอบถาม</h2>
            <div className="contact-info-group">
              <div className="contact-info-block">
                <Phone size={22} className="contact-small-icon" />
                <div className="contact-info-detail">
                  <h4>โทรศัพท์</h4>
                  <p>
                    ส่วนกลาง: 02-141-XXXX
                    <br />
                    สายด่วน: 1111 (ศูนย์บริการข้อมูลภาครัฐ)
                  </p>
                </div>
              </div>
              <div className="contact-info-block">
                <Mail size={22} className="contact-small-icon" />
                <div className="contact-info-detail">
                  <h4>อีเมล</h4>
                  <p>
                    ติดต่อทั่วไป: contact@onde.go.th
                    <br />
                    แจ้งปัญหา: support@onde.go.th
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-visual-side">
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1000&auto=format&fit=crop"
              alt="Contact Support"
            />
          </div>
        </div>

        {/* Card 3: เวลาทำการ */}
        <div className="contact-card-split">
          <div className="contact-text-side">
            <span className="contact-tag-label">BUSINESS HOURS</span>
            <h2 className="contact-heading">เวลาทำการ</h2>
            <p className="contact-paragraph">
              <strong>วันจันทร์ - วันศุกร์:</strong>
              <br />
              เวลา 08:30 น. - 16:30 น.
              <br />
              <br />
              <span className="contact-alert-text">
                ปิดทำการในวันเสาร์ วันอาทิตย์ และวันหยุดนักขัตฤกษ์
              </span>
            </p>
          </div>
          <div className="contact-visual-side">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
              alt="Office Hours"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
