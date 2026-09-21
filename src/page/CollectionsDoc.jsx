import React, { useState, useEffect } from "react";
import Tabbar from "../component/Tabbar"; // เช็ค Path ให้ตรงกับโปรเจคของคุณ
import Footer from "../component/Footer"; // เช็ค Path ให้ตรงกับโปรเจคของคุณ
import { Download, Search, FileText } from "lucide-react";
import "./style/CollectionsDoc.css";

// IMPORT รูปหน้าปกและไฟล์ PDF ของคุณจากโฟลเดอร์ assets
// import cover1 from "../assets/images/cover1.png";
// import pdfGuideline from "../assets/pdf/ai-ethics-guideline.pdf";
// ... นำเข้าให้ครบตามที่มี

// ข้อมูลจำลองเอกสาร (ในของจริงคุณสามารถดึงจาก API หรือดึงมาจากไฟล์เดียวกับหน้า Home ได้เลย)
// ==========================================
// 1. IMPORT ไฟล์รูปภาพและ PDF จาก assets เข้ามาโดยตรง
// ==========================================
// ตัวอย่างการ import รูปหน้าปก
import cover1 from "../assets/image1.png"; 
import cover2 from "../assets/image2.png";
import cover3 from "../assets/image3.png";
import cover4 from "../assets/image4.png";
import cover5 from "../assets/image5.jpg"; 
import cover6 from "../assets/image6.jpg";
import cover7 from "../assets/image7.jpg";


// ตัวอย่างการ import ไฟล์ PDF
import pdfGuideline from "../assets/pdf/v64_74.pdf";
import pdfRisk from "../assets/pdf/Digital-Thailand-AI-Ethics-Principle-and-Guideline.pdf";
import pdfSummary from "../assets/pdf/AI Operating Model สำหรับองค์กรไทย.pdf";
import pdfChecklist from "../assets/pdf/คู่มือการออกแบบ_Human-AI_Workflow_สำหรับภาครัฐไทย.pdf";
import pdf5 from "../assets/pdf/คำตอบ AI มาจากไหน5.pdf";
import pdf6 from "../assets/pdf/Agentic AI สำหรับระบบแจ้งข้อมูลประชาชน6.pdf";
import pdf7 from "../assets/pdf/การออกแบบโครงสร้างองค์กร ที่ใช้ AI Agent  copy 7.pdf";

const allDocuments = [
  {
      id: 1,
      title: "Thailand AI Ethics Guideline",
      desc: "เอกสารแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ Thailand AI Ethics Guideline",
      image: cover1, // เปลี่ยนเป็นลิงก์รูปหน้าปกจริง
      fileUrl: pdfGuideline // เปลี่ยนเป็น path ไฟล์ PDF ของคุณ
    },
    {
      id: 2,
      title: "Digital Thailand - AI Ethics Guideline",
      desc: "เอกสารหลักการและแนวทางจริยธรรมปัญญาประดิษฐ์ของประเทศไทย (Digital Thailand - AI Ethics Guideline)",
      image: cover2,
      fileUrl: pdfRisk
    },
    {
      id: 3,
      title: "AI Operating Model สำหรับองค์กรไทย",
      desc: "แนวทางการออกแบบ Al Operating Model สำหรับองค์กรไทย จาก Al Use Case สู่การปรับวิธีสร้างคุณค่าขององค์กร",
      image: cover3,
      fileUrl: pdfSummary
    },
    {
      id: 4,
      title: "คู่มือการออกแบบ Human AI Workflow",
      desc: "การออกแบบ Human-AI Workflow สำหรับภาครัฐไทย",
      image: cover4,
      fileUrl: pdfChecklist
    },
    {
      id: 5,
      title: "คำตอบทองAI เกิดจากอะไร",
      desc: "ทำไม Prompt เพียงอย่างเดียว จึงไม่รับประกันคำตอบที่ดี จากโมเดลและข้อมูล สู่กฎควบคุม และการตรวจสอบโดยมนุษย์",
      image: cover5,
      fileUrl: pdf5
    },
    {
      id: 6,
      title: "จากข้อมูลสู่บริการที่สำเร็จ",
      desc: "Agentic Al สำหรับการให้ข้อมูลและคำแนะนำแก่ประชาชน",
      image: cover6,
      fileUrl: pdf6
    },
    {
      id: 7,
      title: "การออกแบบการทำงานของ คน และ AI Agent สำหรับองค์กร",
      desc: "แนวทางการออกแบบการทำงานของ คน และ AI Agent สำหรับองค์กร เพื่อให้เกิดความร่วมมือและการทำงานที่มีประสิทธิภาพ",
      image: cover7,
      fileUrl: pdf7
    },
];

const CollectionsDoc = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // เลื่อนจอขึ้นบนสุดเมื่อโหลดหน้าเว็บ
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ฟังก์ชันกรองเอกสารตามคำค้นหา
  const filteredDocs = allDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cd-wrapper">
      <Tabbar />

      <main className="cd-main-content">
        <div className="cd-container">
          
          {/* ส่วนหัวของหน้า */}
          <div className="cd-header">
            <div className="cd-header-icon">
              <FileText size={32} strokeWidth={1.5} />
            </div>
            <h1 className="cd-title">คลังเอกสารและคู่มือ</h1>
            <p className="cd-subtitle">
              รวบรวมเอกสาร แนวปฏิบัติ และคู่มือทั้งหมดที่เกี่ยวข้องกับจริยธรรมปัญญาประดิษฐ์
              คุณสามารถค้นหาและดาวน์โหลดไฟล์ PDF ไปศึกษาได้ฟรี
            </p>

            {/* ช่องค้นหา */}
            <div className="cd-search-box">
              <Search className="cd-search-icon" size={20} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อเอกสาร หรือเนื้อหา..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* ส่วนแสดงรายการการ์ดเอกสาร (ขนาดออริจินัล) */}
          <div className="cd-document-grid">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <div key={doc.id} className="cd-document-card">
                  <div className="cd-document-img-wrapper">
                    <img src={doc.image} alt={doc.title} className="cd-document-img" />
                  </div>
                  
                  <div className="cd-document-info">
                    <h3 className="cd-document-title">{doc.title}</h3>
                    <p className="cd-document-desc">{doc.desc}</p>
                    
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cd-btn-download"
                      download
                    >
                      <Download size={18} strokeWidth={2} /> ดาวน์โหลด PDF
                    </a>
                  </div>
                </div>
              ))
            ) : (
              // แสดงเมื่อค้นหาไม่เจอ
              <div className="cd-empty-state">
                <p>ไม่พบเอกสารที่ตรงกับ "{searchTerm}"</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollectionsDoc;