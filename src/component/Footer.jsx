import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Eye } from "lucide-react";
import { FaGlobe, FaFacebookF } from "react-icons/fa"; // ลบ Twitter, LinkedIn ออก

import "./style/Footer.css";
import logoBDE from "../assets/logo-bde.png";
import api from "../api/Api";
import { VISIT_RECORDED_EVENT } from "../utils/visitTracker";

function Footer() {
  const [visitStats, setVisitStats] = useState(null);

  // โหลดสถิติการเข้าใช้งาน และโหลดซ้ำเมื่อหน้าโฮมบันทึกการเข้าชมเสร็จ
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/public/visit-stats");
        setVisitStats(res.data?.data || null);
      } catch (err) {
        console.warn("Fetch visit stats failed:", err);
      }
    };
    fetchStats();
    window.addEventListener(VISIT_RECORDED_EVENT, fetchStats);
    return () => window.removeEventListener(VISIT_RECORDED_EVENT, fetchStats);
  }, []);

  return (
    <footer className="ai-footer">
      <div className="ai-footer-container">
        <div className="ai-footer-main-grid">
          
          {/* คอลัมน์ 1: Logo & About */}
          <div className="ai-footer-col col-about">
            <div className="footer-logo-wrapper">
              <img src={logoBDE} alt="BDE Logo" className="footer-logo-img" />
            </div>
            <p className="footer-about-text">
              การสร้างความเข้าใจและส่งเสริมการใช้แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
              (Thailand AI Ethics Guideline)
              เพื่อสังคมดิจิทัลที่ปลอดภัยและยั่งยืน
            </p>
            {/* ย้าย Social Icon ออกจากตรงนี้ไปคอลัมน์ 3 แล้ว */}
          </div>

          {/* คอลัมน์ 2: Quick Links */}
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

          {/* คอลัมน์ 3: Contact & Social */}
          <div className="ai-footer-col">
            <h4 className="footer-title">
              ติดต่อเรา
              <span className="title-underline"></span>
            </h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>
                 เลขที่ 120 หมู่ 3 ชั้น 3 และ 5 ศูนย์ราชการฯ แจ้งวัฒนะ (อาคาร ซี)
                 ซอยแจ้งวัฒนะ 7 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง
                 เขตหลักสี่ กรุงเทพฯ 10210
                </span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>02-1421032 | Fax 0 2143 7962 </span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>saraban@bde.go.th</span>
              </li>
            </ul>
            
            {/* 👈 ย้าย Social Icon มาไว้ใต้ข้อมูลติดต่อ และเหลือแค่ Web กับ Facebook */}
            <div className="footer-social-row">
              {/* เปลี่ยน "#" เป็นลิงก์เว็บไซต์ของคุณ */}
              <a href="https://www.bde.go.th/" target="_blank" rel="noreferrer" className="social-link-item" aria-label="Website">
                <FaGlobe size={16} />
              </a>
              {/* เปลี่ยน "#" เป็นลิงก์ Facebook ของคุณ */}
              <a href="https://www.facebook.com/profile.php?id=61593099377543" target="_blank" rel="noreferrer" className="social-link-item" aria-label="Facebook">
                <FaFacebookF size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* ส่วนล่างสุด: Copyright */}
        <div className="ai-footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} Thailand AI Ethics Guideline. All rights reserved.
          </p>
          {visitStats && (
            <p className="footer-visit-stats">
              <Eye size={14} />
              <span>เข้าชมวันนี้ {visitStats.today.toLocaleString("th-TH")}</span>
              <span className="sep">•</span>
              <span>ทั้งหมด {visitStats.total.toLocaleString("th-TH")} ครั้ง</span>
              <span className="sep">•</span>
              <span>
                ผู้เข้าชม {visitStats.uniqueVisitors.toLocaleString("th-TH")} คน
              </span>
            </p>
          )}
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