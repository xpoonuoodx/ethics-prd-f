import React, { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import "./style/WelcomePopup2.css";

// 💡 เปลี่ยน URL รูปภาพและลิงก์ Google Form ตรงนี้ได้เลยครับ
const POPUP_IMAGE = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"; 
const GOOGLE_FORM_LINK = "https://forms.gle/jXyxHfLYLXqsEyMB9";

const WelcomePopup2 = () => {
  const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
    // ใช้ sessionStorage แทน localStorage
    const hasSeenPopup = sessionStorage.getItem("hasSeenWelcomePopup");
    
    // ถ้ายังไม่เคยเห็นใน session นี้ ให้หน่วงเวลา 1 วินาทีแล้วเด้งขึ้นมา
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // บันทึกค่าลง sessionStorage เพื่อไม่ให้เด้งซ้ำจนกว่าจะปิดเบราว์เซอร์
    sessionStorage.setItem("hasSeenWelcomePopup", "true");
  };

  // ถ้า isOpen เป็น false ไม่ต้องแสดงอะไร
  if (!isOpen) return null;

  return (
    <div className="popup2-overlay" onClick={handleClose}>
      {/* ใส่ e.stopPropagation() เพื่อไม่ให้คลิกโดนเนื้อหาแล้ว popup ปิดเอง */}
      <div className="popup2-content" onClick={(e) => e.stopPropagation()}>
        
        {/* ปุ่มกากบาทมุมขวาบน */}
        <button className="popup2-close-btn" onClick={handleClose}>
          <X size={24} />
        </button>

        {/* รูปภาพแบนเนอร์ด้านบน */}
        <div className="popup2-image-wrapper">
          <img src={POPUP_IMAGE} alt="Invitation Banner" className="popup2-image" />
          <div className="popup2-image-overlay"></div>
        </div>

        {/* เนื้อหาและปุ่ม */}
        <div className="popup2-body">
          <span className="popup2-badge">🔥 เปิดรับสมัครแล้ว!</span>
          <h2 className="popup2-title">ขอเชิญเข้าร่วมโครงการอบรม จริยธรรมปัญญาประดิษฐ์ (AI Ethics)</h2>
          <p className="popup2-desc">
            ร่วมเป็นส่วนหนึ่งในการขับเคลื่อนสังคมดิจิทัลที่ปลอดภัย 
            เปิดรับสมัครผู้ที่สนใจเข้าร่วมอบรมและประเมินความพร้อม AI สำหรับองค์กร ลงทะเบียนได้แล้ววันนี้!
          </p>
          
          <div className="popup2-actions">
            <a 
              href={GOOGLE_FORM_LINK} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="popup2-btn-primary"
              onClick={handleClose} // ถ้ากดลิงก์ไปแล้ว ก็ให้ปิด popup ไปด้วยเลย
            >
              ลงทะเบียนผ่าน Google Form <ExternalLink size={18} />
            </a >
            <button className="popup2-btn-secondary" onClick={handleClose}>
              ไว้คราวหน้า
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomePopup2;