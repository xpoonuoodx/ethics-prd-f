import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import "./style/Tabbar.css";
import logoBDE from "../assets/logo-bde.png";

function Tabbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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
    setIsAboutOpen(false);
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

            {/* --- เมนูเกี่ยวกับเรา (แบบ Dropdown) --- */}
            <li className="ai-dropdown-container">
              <Link
              // to="/about"
              // className={location.pathname.includes("/about") ? "active" : ""}
              >
                เกี่ยวกับเรา{" "}
                <ChevronDown size={14} className="ai-dropdown-arrow" />
              </Link>
              <ul className="ai-dropdown-menu">
                <li>
                  <Link to="/about/background">ที่มา และความสำคัญ</Link>
                </li>
                <li>
                  <Link to="/about/principles">หลักการ และวัตถุประสงค์</Link>
                </li>
                <li>
                  <Link to="/about/process">ขั้นตอนการดำเนินการ</Link>
                </li>
                <li>
                  <Link to="/about/participation">รูปแบบการเข้าร่วมประชุม</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                to="/guideline"
                className={location.pathname === "/guideline" ? "active" : ""}
              >
                คู่มือระบบ AI Ethics
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
          {/* เพิ่มปุ่มสมัครเข้าร่วมโครงการ */}
          <Link to="/register" className="ai-tabbar-outline-btn">
            สมัครเข้าร่วมโครงการ
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

            {/* --- เมนูเกี่ยวกับเรา มือถือ (แบบ Accordion กดเพื่อกาง) --- */}
            <li className="ai-mobile-dropdown-container">
              <div
                className="ai-mobile-dropdown-header"
                onClick={() => setIsAboutOpen(!isAboutOpen)}
              >
                <span
                  className={
                    location.pathname.includes("/about") ? "active" : ""
                  }
                >
                  เกี่ยวกับเรา
                </span>
                <ChevronDown
                  size={20}
                  className={`ai-mobile-arrow ${isAboutOpen ? "open" : ""}`}
                />
              </div>
              <ul
                className={`ai-mobile-dropdown-menu ${isAboutOpen ? "open" : ""}`}
              >
                <li>
                  <Link
                    to="/about/background"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ที่มา และความสำคัญ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/principles"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    หลักการ และวัตถุประสงค์
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/process"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ขั้นตอนการดำเนินการ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/participation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    รูปแบบการเข้าร่วมประชุม
                  </Link>
                </li>
              </ul>
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
            {/* เพิ่มปุ่มสมัครเข้าร่วมโครงการในมือถือ */}
            <Link to="/register" className="ai-mobile-outline-btn">
              สมัครเข้าร่วมโครงการ
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
