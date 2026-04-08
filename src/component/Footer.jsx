import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, ShieldCheck } from "lucide-react";
import "./style/Footer.css";
import logoBDE from "../assets/logo-bde.png";

function Footer() {
  return (
    <footer className="ai-footer">
      <div className="ai-footer-container">
        <div className="ai-footer-main-grid">
          {/* คอลัมน์ 1: Logo & About (กว้างหน่อยเพื่อความสมดุล) */}
          <div className="ai-footer-col col-about">
            <img src={logoBDE} alt="BDE Logo" className="footer-logo-img" />
            <p className="footer-about-text">
              โครงการสร้างความเข้าใจและส่งเสริมการใช้แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
              (Thailand AI Ethics Guideline)
              เพื่อสังคมดิจิทัลที่ปลอดภัยและยั่งยืน
            </p>
            <div className="footer-social-row">
              <a href="#" className="social-link-item">
                <Globe size={20} />
              </a>
            </div>
          </div>

          {/* คอลัมน์ 2: Quick Links */}
          <div className="ai-footer-col">
            <h4 className="footer-title">เมนูหลัก</h4>
            <ul className="footer-nav">
              <li>
                <Link to="/">หน้าหลัก</Link>
              </li>
              <li>
                <Link to="/dashboard">แดชบอร์ด</Link>
              </li>
              <li>
                <Link to="/about">เกี่ยวกับเรา</Link>
              </li>
              <li>
                <Link to="/guideline">AI Ethics Guideline</Link>
              </li>
            </ul>
          </div>

          {/* คอลัมน์ 3: Contact */}
          <div className="ai-footer-col">
            <h4 className="footer-title">ติดต่อเรา</h4>
            <ul className="footer-contact-list">
              <li>
                <Mail size={16} className="f-icon" />{" "}
                <span>contact@onde.go.th</span>
              </li>
              <li>
                <Phone size={16} className="f-icon" /> <span>02-141-XXXX</span>
              </li>
              <li>
                <MapPin size={16} className="f-icon" />{" "}
                <span>สดช. หลักสี่ กรุงเทพฯ</span>
              </li>
            </ul>
          </div>

          {/* คอลัมน์ 4: Safety & PDPA (จัดกลุ่มใหม่ให้ดูเป็นระเบียบ) */}
          <div className="ai-footer-col col-safety">
            <h4 className="footer-title">ความปลอดภัย</h4>
            <div className="footer-pdpa-card">
              <ShieldCheck size={24} color="#75ba40" />
              <div className="pdpa-text">
                <strong>PDPA Compliant</strong>
                <p>ระบบรองรับการคุ้มครองข้อมูลส่วนบุคคลตามมาตรฐานสากล</p>
              </div>
            </div>
          </div>
        </div>

        {/* ส่วนล่างสุด: Copyright */}
        <div className="ai-footer-bottom">
          <div className="copyright-content">
            <p>© 2026 Thailand AI Ethics Guideline. All rights reserved.</p>
            <div className="legal-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="sep">•</span>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
