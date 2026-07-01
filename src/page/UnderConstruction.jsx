import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/UnderConstruction.css";
import { FaTools, FaArrowLeft } from "react-icons/fa";

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div className="uc-layout">
      <div className="uc-container">
        <div className="uc-icon-wrapper">
          <FaTools className="uc-icon" />
        </div>

        <h1 className="uc-title">ระบบกำลังอยู่ในช่วงพัฒนา</h1>
        <p className="uc-subtitle">
          ฟังก์ชันในหน้านี้กำลังอยู่ระหว่างการออกแบบและพัฒนา
          จะเปิดให้บริการในเร็วๆ นี้ ขออภัยในความไม่สะดวกครับ
        </p>

        <div className="uc-actions">
          <button className="uc-btn-back" onClick={() => navigate(-1)}>
            <FaArrowLeft /> กลับไปยังหน้าก่อนหน้า
          </button>

          {/* หากต้องการปุ่มกลับหน้าหลัก สามารถใช้ปุ่มด้านล่างนี้แทน หรือใช้คู่กันก็ได้ */}
          {/* <button className="uc-btn-home" onClick={() => navigate("/")}>
            กลับสู่หน้าหลัก
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
