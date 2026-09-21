import React, { useState, useEffect } from "react";
// 👈 นำเข้าไอคอน ZoomIn เพิ่มเติม
import { X, ExternalLink, ZoomIn } from "lucide-react"; 
import "./style/WelcomePopup.css";
import schedulePoster from "../assets/poster_Schedule.png"; // นำเข้ารูปโปสเตอร์กำหนดการ


const GOOGLE_FORM_LINK = "https://forms.gle/your_google_form_link_here";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  // 👈 1. สร้าง State สำหรับควบคุมรูปเต็มจอ
  const [isFullscreen, setIsFullscreen] = useState(false); 

  useEffect(() => {
    // const hasSeenPopup = localStorage.getItem("hasSeenWelcomePopup");
    // if (!hasSeenPopup) {
    //   const timer = setTimeout(() => setIsOpen(true), 1000);
    //   return () => clearTimeout(timer);
    // }
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcomePopup", "true");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="popup-overlay" onClick={handleClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          
          <button className="popup-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>

          <div className="popup-body-scrollable">
            <div className="popup-header-text">
              <span className="popup-badge">🔥 เปิดรับสมัครแล้ว!</span>
              <h2 className="popup-title">ขอเชิญเข้าร่วมโครงการอบรม จริยธรรม AI</h2>
              <p className="popup-desc">
                ร่วมเป็นส่วนหนึ่งในการขับเคลื่อนสังคมดิจิทัลที่ปลอดภัย 
                ตรวจสอบกำหนดการด้านล่างและลงทะเบียนได้แล้ววันนี้!
              </p>
            </div>

            {/* 🌟 2. เพิ่ม onClick และส่วนแสดงไอคอนแว่นขยายตอนเอาเมาส์ชี้ */}
            <div 
              className="popup-poster-container" 
              onClick={() => setIsFullscreen(true)}
            >
              <img 
                src={schedulePoster} 
                alt="โปสเตอร์กำหนดการ" 
                className="popup-poster-image" 
              />
              <div className="popup-poster-hover">
                <ZoomIn size={32} />
                <span>คลิกเพื่อขยาย</span>
              </div>
            </div>
            
            <div className="popup-actions">
              <a 
                href={GOOGLE_FORM_LINK} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="popup-btn-primary"
                onClick={handleClose}
              >
                ลงทะเบียนผ่าน Google Form <ExternalLink size={18} />
              </a>
              <button className="popup-btn-secondary" onClick={handleClose}>
                ปิด / ไว้คราวหน้า
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 3. เลเยอร์แสดงรูปเต็มจอ (โชว์เมื่อ isFullscreen เป็น true) */}
      {isFullscreen && (
        <div className="fullscreen-overlay" onClick={() => setIsFullscreen(false)}>
          <button className="fullscreen-close-btn">
            <X size={24} />
          </button>
          <img 
            src={schedulePoster} 
            alt="โปสเตอร์เต็มจอ" 
            className="fullscreen-image" 
            onClick={(e) => e.stopPropagation()} /* ป้องกันกดโดนรูปแล้วปิด */
          />
        </div>
      )}
    </>
  );
};

export default WelcomePopup;

