import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import api from "../api/Api";
import "./style/VerifyCertificate.css";

// หน้าตรวจสอบใบประกาศนียบัตร - เปิดสาธารณะ ไม่ต้อง login (เข้าถึงผ่านการสแกน QR บนตัวใบเซอร์)
const VerifyCertificate = () => {
  const { certNumber } = useParams();
  const [status, setStatus] = useState("loading"); // loading | valid | invalid
  const [data, setData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const verify = async () => {
      try {
        const response = await api.get(
          `/public/verify-certificate/${certNumber}`,
        );
        if (response.data && response.data.success) {
          setData(response.data.data);
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch (err) {
        console.error("Verify Certificate Error:", err);
        setStatus("invalid");
      }
    };

    verify();
  }, [certNumber]);

  return (
    <div className="vc-layout">
      <div className="vc-container">
        {status === "loading" && (
          <div className="vc-loading">
            <FaSpinner className="vc-spin" />
            <p>กำลังตรวจสอบใบประกาศนียบัตร...</p>
          </div>
        )}

        {status === "valid" && data && (
          <>
            <div className="vc-icon-wrapper valid">
              <FaCheckCircle className="vc-icon" />
            </div>
            <h1 className="vc-title">ใบประกาศนียบัตรนี้ถูกต้อง</h1>
            <p className="vc-subtitle">ตรวจสอบกับฐานข้อมูลระบบเรียบร้อยแล้ว</p>

            <div className="vc-details">
              <div className="vc-detail-row">
                <span className="vc-detail-label">ผู้ได้รับ</span>
                <span className="vc-detail-value">{data.userName || "-"}</span>
              </div>
              <div className="vc-detail-row">
                <span className="vc-detail-label">หลักสูตร</span>
                <span className="vc-detail-value">
                  {data.courseName || "-"}
                </span>
              </div>
              <div className="vc-detail-row">
                <span className="vc-detail-label">วันที่ออกใบประกาศ</span>
                <span className="vc-detail-value">
                  {data.issuedDate || "-"}
                </span>
              </div>
              <div className="vc-detail-row">
                <span className="vc-detail-label">หน่วยงานผู้ออก</span>
                <span className="vc-detail-value">
                  {data.issuerName || "-"}
                </span>
              </div>
              <div className="vc-detail-row">
                <span className="vc-detail-label">ผู้ลงนาม</span>
                <span className="vc-detail-value">
                  {data.signatoryName || "-"}
                  {data.signatoryPosition ? ` (${data.signatoryPosition})` : ""}
                </span>
              </div>
              <div className="vc-detail-row">
                <span className="vc-detail-label">เลขที่ใบประกาศ</span>
                <span className="vc-detail-value vc-mono">
                  {data.certNumber}
                </span>
              </div>
            </div>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="vc-icon-wrapper invalid">
              <FaTimesCircle className="vc-icon" />
            </div>
            <h1 className="vc-title">ไม่พบข้อมูลใบประกาศนี้ในระบบ</h1>
            <p className="vc-subtitle">
              กรุณาตรวจสอบเลขที่ใบประกาศอีกครั้ง หรือติดต่อหน่วยงานผู้ออกใบประกาศ
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
