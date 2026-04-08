import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./style/Tabbar.css";
import logoBDE from "../assets/logo-bde.png";

function Tabbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  // ปิดเมนูเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`ai-tabbar-wrapper ${isScrolled ? "shadow" : ""}`}>
      <div className="ai-tabbar-container">
        {/* --- ฝั่งซ้าย: โลโก้ --- */}
        <div className="ai-tabbar-left">
          <Link to="/" className="ai-logo-link">
            <img src={logoBDE} alt="BDE Logo" className="ai-tabbar-logo-img" />
          </Link>
        </div>

        {/* --- ตรงกลาง: เมนูลิงก์ (Desktop) --- */}
        <div className="ai-tabbar-center-desktop">
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
                to="/dashboard"
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                แดชบอร์ด
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

        {/* --- ฝั่งขวา: ปุ่มกด (Desktop) --- */}
        <div className="ai-tabbar-right-desktop">
          <Link to="/download" className="ai-tabbar-text-link">
            ดาวน์โหลดเอกสาร
          </Link>
          <Link to="/login" className="ai-tabbar-btn">
            เข้าสู่ระบบ
          </Link>
        </div>

        {/* --- ปุ่ม Hamburger (Mobile Only) --- */}
        <button
          className="ai-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>

        {/* --- Side Menu (Mobile Only) --- */}
        <div className={`ai-mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="ai-mobile-menu-header">
            <img src={logoBDE} alt="Logo" className="ai-mobile-logo-small" />
            <button
              className="ai-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={28} />
            </button>
          </div>

          <ul className="ai-mobile-nav-links">
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
              <Link to="/guideline">Thailand AI Ethics Guideline</Link>
            </li>
            <li>
              <Link to="/contact">ติดต่อเรา</Link>
            </li>
          </ul>

          <div className="ai-mobile-footer">
            <Link to="/download" className="ai-mobile-download-link">
              ดาวน์โหลดเอกสาร
            </Link>
            <Link to="/login" className="ai-mobile-login-btn">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>

        {/* Overlay ข้ามหน้าจอ */}
        {isMobileMenuOpen && (
          <div
            className="ai-mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </div>
    </nav>
  );
}

export default Tabbar;
