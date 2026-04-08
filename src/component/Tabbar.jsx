import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style/Tabbar.css"; // ปรับ path ให้ตรงกับโครงสร้างโฟลเดอร์ของคุณ
import logoBDE from "../assets/logo-bde.png"; // นำเข้าโลโก้

function Tabbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // ตรวจจับการเลื่อนหน้าจอเพื่อใส่เงา
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`ai-tabbar-wrapper ${isScrolled ? "shadow" : ""}`}>
      <div className="ai-tabbar-container">
        {/* --- ฝั่งซ้าย: โลโก้ --- */}
        <div className="ai-tabbar-left">
          <Link to="/" className="ai-logo-link">
            <img src={logoBDE} alt="BDE Logo" className="ai-tabbar-logo-img" />
          </Link>
        </div>

        {/* --- ตรงกลาง: เมนูลิงก์ --- */}
        <div className="ai-tabbar-center">
          <ul className="ai-tabbar-links">
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                หน้าหลัก
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={location.pathname === "/about" ? "active" : ""}
              >
                เกี่ยวกับเรา
              </Link>
            </li>
            <li>
              <Link
                to="/guideline"
                className={location.pathname === "/guideline" ? "active" : ""}
              >
                Thailand AI Ethics Guideline
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={location.pathname === "/contact" ? "active" : ""}
              >
                ติดต่อเรา
              </Link>
            </li>
          </ul>
        </div>

        {/* --- ฝั่งขวา: ปุ่มกด --- */}
        <div className="ai-tabbar-right">
          <Link to="/download" className="ai-tabbar-text-link">
            ดาวน์โหลดเอกสาร
          </Link>
          <Link to="/login" className="ai-tabbar-btn">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Tabbar;
