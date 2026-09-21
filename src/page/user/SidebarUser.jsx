import React, { useState } from "react";
import "./style/SidebarUser.css";
import {
  FaHome,
  FaBookOpen,
  FaClipboardCheck,
  FaTools,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCertificate,
} from "react-icons/fa";
import { getStoredUser } from "../../api/Api";
import logoBde from "../../assets/logo-bde.png";

const SidebarUser = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = getStoredUser();

  const getInitials = (name) => {
    if (!name) return "US";
    return name.substring(0, 2).toUpperCase();
  };

  // ตอนนี้ role=user ทุกคนเรียนได้ทุกหลักสูตรเหมือนกันหมด เลยต้องมีป้ายบอกว่าบัญชีนี้
  // สังกัด user_type ไหน (จับคู่ badge เดียวกับที่ใช้ในหน้า UserDashboard) กัน sidebar
  // หน้าตาเหมือนกันหมดจนงงว่ากำลังใช้บัญชีฐานไหนอยู่
  const getUserTypeBadge = (userType) => {
    const t = (userType || "").toLowerCase();
    if (t.includes("regulator") || t.includes("policy"))
      return "ผู้กำกับดูแลและนโยบาย";
    if (t.includes("researcher")) return "นักวิจัย";
    if (t.includes("developer") || t.includes("provider"))
      return "นักพัฒนาและผู้ให้บริการ";
    return "ผู้ใช้งานทั่วไป";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    window.location.href = "/login";
  };

  // ตรวจสอบ URL ปัจจุบันเพื่อให้เมนูขึ้นแถบ Active ถูกหน้า
  const currentPath = window.location.pathname + window.location.search;

  return (
    <>
      {/* ปุ่ม Toggle สำหรับหน้าจอมือถือ */}
      <button className="su-mobile-toggle" onClick={toggleMobileSidebar}>
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay พื้นหลังเวลาเปิดเมนูบนมือถือ */}
      {isMobileOpen && (
        <div className="su-mobile-overlay" onClick={toggleMobileSidebar}></div>
      )}

      {/* ตัว Sidebar */}
      <aside
        className={`su-container ${isOpen ? "open" : "closed"} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* ================= Header ================= */}
        <div className="su-header">
          <div className={`su-brand ${!isOpen && "hidden"}`}>
            <img src={logoBde} alt="BDE" className="su-brand-logo" />
          </div>

          {/* <button className="su-desktop-toggle" onClick={toggleSidebar}>
            <FaGripLinesVertical />
          </button> */}
        </div>

        {/* ================= Main Menu ================= */}
        {/* สีเดียวทั้งหมด (เขียวแบรนด์ BDE #74C042) ไม่ใช้สีต่างกันต่อเมนูแบบที่เคยลองไปแล้ว */}
        <nav className="su-menu">
          <a
            href="/user-dashboard"
            className={`su-menu-item ${
              currentPath === "/user-dashboard" ? "active" : ""
            }`}
            title="แดชบอร์ด"
          >
            <span className="su-icon-badge">
              <FaHome className="su-icon" />
            </span>
            <span className={`su-text ${!isOpen && "hidden"}`}>แดชบอร์ด</span>
          </a>

          <a
            href="/user-classroom"
            className={`su-menu-item ${
              currentPath.includes("type=learn") ||
              currentPath.includes("classroom")
                ? "active"
                : ""
            }`}
            title="สื่อการเรียนรู้"
          >
            <span className="su-icon-badge">
              <FaBookOpen className="su-icon" />
            </span>
            <span className={`su-text ${!isOpen && "hidden"}`}>
              สื่อการเรียนรู้
            </span>
          </a>

          <a
            href="/user-test"
            className={`su-menu-item ${
              currentPath.includes("type=test") ||
              currentPath.includes("user-test")
                ? "active"
                : ""
            }`}
            title="แบบทดสอบ"
          >
            <span className="su-icon-badge">
              <FaClipboardCheck className="su-icon" />
            </span>
            <span className={`su-text ${!isOpen && "hidden"}`}>แบบทดสอบ</span>
          </a>

          <a
            href="/user-tools"
            className={`su-menu-item ${
              currentPath === "/user-tools" ? "active" : ""
            }`}
            title="เครื่องมือ"
          >
            <span className="su-icon-badge">
              <FaTools className="su-icon" />
            </span>
            <span className={`su-text ${!isOpen && "hidden"}`}>เครื่องมือ</span>
          </a>

          <a
            href="/user-certificate"
            className={`su-menu-item ${
              currentPath === "/user-certificate" ? "active" : ""
            }`}
            title="ใบประกาศนียบัตร"
          >
            <span className="su-icon-badge">
              <FaCertificate className="su-icon" />
            </span>
            <span className={`su-text ${!isOpen && "hidden"}`}>ใบประกาศนียบัตร</span>
          </a>

          {/* <a
            href="/user-download"
            className={`su-menu-item ${
              currentPath === "/user-download" ? "active" : ""
            }`}
            title="ดาวน์โหลดเอกสาร"
          >
            <FaFileDownload className="su-icon" />
            <span className={`su-text ${!isOpen && "hidden"}`}>
              ดาวน์โหลดเอกสาร
            </span>
          </a> */}
        </nav>

        {/* ================= Footer ================= */}
        <div className="su-footer">
          <div className="su-bottom-menu">
            <a
              href="/user-profile"
              className={`su-menu-item ${
                currentPath === "/user-profile" ? "active" : ""
              }`}
              title="ข้อมูลส่วนตัว"
            >
              <span className="su-icon-badge">
                <FaUserCircle className="su-icon" />
              </span>
              <span className={`su-text ${!isOpen && "hidden"}`}>
                ข้อมูลส่วนตัว
              </span>
            </a>
            <button
              onClick={handleLogout}
              className="su-menu-item su-logout-btn"
              title="ออกจากระบบ"
            >
              <FaSignOutAlt className="su-icon" />
              <span className={`su-text ${!isOpen && "hidden"}`}>
                ออกจากระบบ
              </span>
            </button>
          </div>

          <div
            className="su-user-card"
            title={`${user?.name || "ผู้ใช้งาน"} (${user?.username || ""})`}
          >
            <div className="su-avatar">
              {user?.profile_image_url ? (
                <img src={user.profile_image_url} alt={user?.name || "ผู้ใช้งาน"} />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className={`su-user-info ${!isOpen && "hidden"}`}>
              <p className="su-user-name">{user?.name || "ผู้ใช้งานระบบ"}</p>
              <span className="su-user-type-badge">
                {getUserTypeBadge(user?.user_type)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarUser;
