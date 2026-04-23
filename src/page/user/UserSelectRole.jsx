import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import { FaUserShield, FaCode, FaUserAlt } from "react-icons/fa";
import "./style/UserSelectRole.css";

const UserSelectRole = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ตรวจสอบว่าผู้ใช้กดมาจากเมนูไหน (learn = เรียน, test = สอบ)
  const queryParams = new URLSearchParams(location.search);
  const actionType = queryParams.get("type") || "learn";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectRole = (role) => {
    if (actionType === "test") {
      navigate(`/user-test?role=${role}`);
    } else {
      navigate(`/user-classroom?role=${role}`);
    }
  };

  return (
    <div className="user-portal-layout">
      <SidebarUser />

      <div className="user-portal-content">
        <div className="usr-container">
          {/* ================= Header ================= */}
          <div className="usr-header">
            <h1 className="usr-title">
              {actionType === "test"
                ? "เลือกบทบาทเพื่อทำแบบทดสอบ"
                : "เลือกบทบาทเพื่อเข้าสู่บทเรียน"}
            </h1>
            <p className="usr-subtitle">
              กรุณาเลือกสายงานที่ตรงกับคุณ
              เพื่อให้ระบบแสดงเนื้อหาที่เหมาะสมที่สุด
            </p>
          </div>

          {/* ================= Cards ================= */}
          <div className="usr-cards-wrapper">
            {/* Card 1: Regulator */}
            <div
              className="usr-card"
              onClick={() => handleSelectRole("regulator")}
            >
              <div
                className="usr-card-bg"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop')",
                }}
              ></div>
              <div className="usr-card-overlay">
                <FaUserShield className="usr-card-icon" />
                <h3 className="usr-card-title">Regulator</h3>
                <p className="usr-card-desc">
                  ผู้วางนโยบาย /<br />
                  หน่วยงานรัฐ /<br />
                  ผู้กำกับดูแล
                </p>
              </div>
            </div>

            {/* Card 2: Provider */}
            <div
              className="usr-card"
              onClick={() => handleSelectRole("provider")}
            >
              <div
                className="usr-card-bg"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop')",
                }}
              ></div>
              <div className="usr-card-overlay">
                <FaCode className="usr-card-icon" />
                <h3 className="usr-card-title">Provider</h3>
                <p className="usr-card-desc">
                  นักพัฒนา /<br />
                  วิศวกร /<br />
                  ผู้ให้บริการ AI
                </p>
              </div>
            </div>

            {/* Card 3: User */}
            <div className="usr-card" onClick={() => handleSelectRole("user")}>
              <div
                className="usr-card-bg"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop')",
                }}
              ></div>
              <div className="usr-card-overlay">
                <FaUserAlt className="usr-card-icon" />
                <h3 className="usr-card-title">User</h3>
                <p className="usr-card-desc">
                  ผู้ใช้งานทั่วไป /<br />
                  ประชาชน /<br />
                  ผู้ประยุกต์ใช้ AI
                </p>
              </div>
            </div>
          </div>
          {/* ================= End Cards ================= */}
        </div>
      </div>
    </div>
  );
};

export default UserSelectRole;
