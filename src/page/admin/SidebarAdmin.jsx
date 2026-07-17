import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./style/SidebarAdmin.css";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaThLarge,
  FaBuilding,
  FaUsers,
  FaUserShield,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaClipboardCheck, // ไอคอนสำหรับจัดการการประเมิน
  FaChevronDown, // ไอคอนลูกศรชี้ลง
  FaChevronRight, // ไอคอนลูกศรชี้ขวา
  FaAtlas,
  FaCertificate,
  FaPalette,
} from "react-icons/fa";
import { getStoredUser } from "../../api/Api";

const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(true);

  // State สำหรับจัดการ Dropdown เมนูการประเมิน
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const location = useLocation();
  const user = getStoredUser() || {
    name: "ผู้ดูแลระบบ",
  };

  // Responsive: จัดการเปิด/ปิด Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // เช็คว่าหน้าปัจจุบันอยู่ในกลุ่ม "จัดการการประเมิน" หรือไม่
  // ถ้าใช่ ให้กาง Dropdown อัตโนมัติเมื่อโหลดหน้า
  useEffect(() => {
    if (
      location.pathname.includes("/admin-maturity") ||
      location.pathname.includes("/admin-impact") ||
      location.pathname.includes("/admin-principle") ||
      location.pathname.includes("/admin-component") ||
      location.pathname.includes("/admin-mapping") ||
      location.pathname.includes("/admin-guideline")
    ) {
      setIsAssessmentOpen(true);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // ถ้าปิด Sidebar ให้ปิด Dropdown ด้วยเพื่อความสวยงาม
    if (isOpen) {
      setIsAssessmentOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  // เช็คเพื่อทำให้เมนูแม่ (จัดการการประเมิน) เป็นสี Active หากอยู่ในหน้าลูก
  const isAssessmentActive =
    location.pathname.includes("/admin-maturity") ||
    location.pathname.includes("/admin-impact") ||
    location.pathname.includes("/admin-principle") ||
    location.pathname.includes("/admin-component") ||
    location.pathname.includes("/admin-mapping") ||
    location.pathname.includes("/admin-guideline");

  return (
    <>
      {isOpen && (
        <div
          className="admin-sidebar-mobile-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <button className="admin-sidebar-mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`admin-sidebar-container ${isOpen ? "open" : "closed"}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand-wrapper">
            <div className="admin-brand-logo-box">
              <span>E</span>
            </div>
            <h2 className={`admin-sidebar-brand-name ${!isOpen && "hidden"}`}>
              EthicAdmin
            </h2>
          </div>

          {!isOpen && (
            <button
              className="admin-sidebar-expand-btn"
              onClick={toggleSidebar}
            >
              <FaAngleDoubleRight />
            </button>
          )}
        </div>

        <div className="admin-sidebar-nav-scroll">
          <Link
            to="/admin-dashboard"
            className={`admin-sidebar-item ${isActive("/admin-dashboard")}`}
          >
            <FaThLarge className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              หน้าหลัก
            </span>
          </Link>

          <div className={`admin-sidebar-category ${!isOpen && "hidden"}`}>
            การจัดการหลัก
          </div>

          <Link
            to="/admin-organize"
            className={`admin-sidebar-item ${isActive("/admin-organize")}`}
          >
            <FaBuilding className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              หน่วยงานทั้งหมด
            </span>
          </Link>

          <Link
            to="/admin-user"
            className={`admin-sidebar-item ${isActive("/admin-user")}`}
          >
            <FaUsers className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              ผู้ใช้งานระบบ
            </span>
          </Link>

          {/* <Link
            to="/admin/roles"
            className={`admin-sidebar-item ${isActive("/admin/roles")}`}
          >
            <FaUserShield className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              สิทธิ์การใช้งาน
            </span>
          </Link> */}

          {/* =====================================
              ส่วนที่เพิ่มใหม่: จัดการการประเมิน (Dropdown)
              ===================================== */}
          <div className="admin-sidebar-dropdown">
            <div
              className={`admin-sidebar-item ${isAssessmentActive ? "active" : ""}`}
              onClick={() => {
                setIsAssessmentOpen(!isAssessmentOpen);
                if (!isOpen) setIsOpen(true); // ถ้า Sidebar หดอยู่ พอกดให้กางออกด้วย
              }}
              style={{ cursor: "pointer" }}
            >
              <FaClipboardCheck className="admin-menu-icon" />
              <span
                className={`admin-menu-text ${!isOpen && "hidden"}`}
                style={{ flex: 1 }}
              >
                จัดการการประเมิน
              </span>
              <div className={`admin-menu-caret ${!isOpen && "hidden"}`}>
                {isAssessmentOpen ? (
                  <FaChevronDown size={12} />
                ) : (
                  <FaChevronRight size={12} />
                )}
              </div>
            </div>

            {/* เมนูย่อย (Sub-menus) */}
            {isAssessmentOpen && isOpen && (
              <div className="admin-sidebar-submenus">
                <Link
                  to="/admin-mapping"
                  className={`admin-sidebar-subitem ${isActive("/admin-mapping")}`}
                >
                  <span className="admin-subitem-dot"></span>
                  <span className="admin-subitem-text">
                    ผังการประเมิน (Mapping)
                  </span>
                </Link>
                <Link
                  to="/admin-guideline"
                  className={`admin-sidebar-subitem ${isActive("/admin-guideline")}`}
                >
                  <span className="admin-subitem-dot"></span>
                  <span className="admin-subitem-text">แนวทางการพัฒนา</span>
                </Link>
                <Link
                  to="/admin-maturity"
                  className={`admin-sidebar-subitem ${isActive("/admin-maturity")}`}
                >
                  <span className="admin-subitem-dot"></span>
                  <span className="admin-subitem-text">Maturity Level</span>
                </Link>

                <Link
                  to="/admin-impact"
                  className={`admin-sidebar-subitem ${isActive("/admin-impact")}`}
                >
                  <span className="admin-subitem-dot"></span>
                  <span className="admin-subitem-text">Impact Level</span>
                </Link>

                <Link
                  to="/admin-principle"
                  className={`admin-sidebar-subitem ${isActive("/admin-principle")}`}
                >
                  <span className="admin-subitem-dot"></span>
                  <span className="admin-subitem-text">Principles</span>
                </Link>

                <Link
                  to="/admin-component"
                  className={`admin-sidebar-subitem ${isActive("/admin-component")}`}
                >
                  <span className="admin-subitem-dot"></span>
                  <span className="admin-subitem-text">Components</span>
                </Link>
              </div>
            )}
          </div>
          {/* ===================================== */}

          {/* <div className={`admin-sidebar-category ${!isOpen && "hidden"}`}>
            ระบบส่วนหลัง
          </div>

          <Link
            to="/admin/reports"
            className={`admin-sidebar-item ${isActive("/admin/reports")}`}
          >
            <FaFileAlt className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              รายงานสรุป
            </span>
          </Link> */}

          <div className={`admin-sidebar-category ${!isOpen && "hidden"}`}>
            สื่อการเรียนการสอน
          </div>

          <Link
            to="/admin-classroom"
            className={`admin-sidebar-item ${isActive("/admin-classroom")}`}
          >
            <FaAtlas className="admin-menu-icon" />
            <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
              จัดการสื่อการเรียนรู้
            </span>
          </Link>

          <div className={`admin-sidebar-category ${!isOpen && "hidden"}`}>
            ใบประกาศ
          </div>

          <Link
            to="/admin-certificate"
            className={`admin-sidebar-item ${isActive("/admin-certificate")}`}
          >
            <FaCertificate
              className="admin-menu-icon"
            />
            <span className="admin-menu-text">ผู้ได้รับใบประกาศฯ</span>
          </Link>

          <Link
            to="/admin-manage-certificate"
            className={`admin-sidebar-item ${isActive("/admin-manage-certificate")}`}
          >
            <FaPalette
              className="admin-menu-icon"
            />
            <span className="admin-menu-text">ตั้งค่าแม่แบบใบประกาศ</span>
          </Link>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-bottom-menus">
            <Link
              to="/admin/settings"
              className={`admin-sidebar-item ${isActive("/admin/settings")}`}
            >
              <FaCog className="admin-menu-icon" />
              <span className={`admin-menu-text ${!isOpen && "hidden"}`}>
                ตั้งค่าระบบ
              </span>
            </Link>
          </div>

          <div className="admin-sidebar-user-section">
            <button
              onClick={handleLogout}
              className="admin-user-pill-btn"
              title="ออกจากระบบ"
            >
              <div className="admin-user-avatar">
                <FaUserCircle size={28} color="#94a3b8" />
              </div>
              <div className={`admin-user-info ${!isOpen && "hidden"}`}>
                <span className="admin-user-name">
                  {user?.name || "ผู้ดูแลระบบ"}
                </span>
                <p>ผู้ดูแลระบบ</p>
              </div>
              <div className={`admin-user-logout-icon ${!isOpen && "hidden"}`}>
                <FaSignOutAlt />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
