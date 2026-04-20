import React from "react";
import { Link } from "react-router-dom";
/* นำเข้าไอคอนจาก lucide-react (เอา ChevronRight ออกเพื่อให้เรียบง่ายตามเรฟเฟอเรนซ์) */
import { Mail, Phone, MapPin } from "lucide-react";
/* นำเข้าไอคอน Social จาก react-icons */
import { FaGlobe, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

import "./style/Footer.css";
import logoBDE from "../assets/logo-bde.png";

function Footer() {
  return (
    <footer className="ai-footer">
      <div className="ai-footer-container">
        <div className="ai-footer-main-grid">
          {/* คอลัมน์ 1: Logo & About */}
          <div className="ai-footer-col col-about">
            <div className="footer-logo-wrapper">
              {/* โลโก้ปรับขนาดเล็กลงแล้วผ่าน CSS */}
              <img src={logoBDE} alt="BDE Logo" className="footer-logo-img" />
            </div>
            <p className="footer-about-text">
              โครงการสร้างความเข้าใจและส่งเสริมการใช้แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
              (Thailand AI Ethics Guideline)
              เพื่อสังคมดิจิทัลที่ปลอดภัยและยั่งยืน
            </p>
            <div className="footer-social-row">
              <a href="#" className="social-link-item" aria-label="Website">
                <FaGlobe size={16} />
              </a>
              <a href="#" className="social-link-item" aria-label="Facebook">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="social-link-item" aria-label="Twitter">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="social-link-item" aria-label="LinkedIn">
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          {/* คอลัมน์ 2: Quick Links (ดีไซน์เรียบง่ายตามเรฟ) */}
          <div className="ai-footer-col">
            <h4 className="footer-title">
              เมนูหลัก
              <span className="title-underline"></span>
            </h4>
            <ul className="footer-nav">
              <li>
                <Link to="/">หน้าหลัก</Link>
              </li>
              <li>
                <Link to="/dashboard">แดชบอร์ด</Link>
              </li>
              <li>
                <Link to="/guideline">AI Ethics Guideline</Link>
              </li>
              <li>
                <Link to="/contact">ติดต่อเรา</Link>
              </li>
            </ul>
          </div>

          {/* คอลัมน์ 3: Contact */}
          <div className="ai-footer-col">
            <h4 className="footer-title">
              ติดต่อเรา
              <span className="title-underline"></span>
            </h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>
                  สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ (สดช.)
                  หลักสี่ กรุงเทพฯ
                </span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>02-141-XXXX</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>contact@onde.go.th</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ส่วนล่างสุด: Copyright */}
        <div className="ai-footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} Thailand AI Ethics Guideline. All
            rights reserved.
          </p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="sep">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
