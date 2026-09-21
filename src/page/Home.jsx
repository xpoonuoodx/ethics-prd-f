import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  ArrowRight,
  Calendar,
  FileText,
  Target,
  ShieldCheck,
  Scale,
  Download,
} from "lucide-react";
import "./style/Home.css";

// นำเข้ารูปภาพพื้นหลังส่วนความสำคัญ
import ethicAiImg from "../assets/ethic-ai.png";

// ==========================================
// ข้อมูล Data ต่างๆ (Export ออกมาเพื่อให้หน้า NewsDetail ดึงไปใช้ด้วย)
// ==========================================
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


export const slideData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop",
    title: "เครื่องมือประเมินความพร้อม AI",
    subtitle:
      "ทดสอบและประเมินระบบ AI ขององค์กรคุณ ว่าสอดคล้องกับหลักจริยธรรมหรือไม่ ด้วยชุดเครื่องมือประเมินมาตรฐาน",
    buttons: [
      { label: "เริ่มการประเมิน", link: "/login" },
      { label: "ศึกษาคู่มือการประเมิน", link: null },
    ],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop",
    title: "แนวทางจริยธรรมปัญญาประดิษฐ์ของประเทศไทย",
    subtitle:
      "สมัครเข้าร่วมโครงการอบรมจริยธรรม ปัญญาประดิษฐ์ (หลักสูตรออนไลน์)",
    buttons: [
      { label: "อ่านรายละเอียดเพิ่มเติม", link: null },
      { label: "สมัครเข้าร่วมโครงการ", link: "/register" },
    ],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1920&auto=format&fit=crop",
    title: "รางวัลยกย่องบุคคลและองค์กรดีเด่น",
    subtitle:
      "สํานักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ มอบรางวัลยกย่องบุคคลและองค์กรที่มีการนําแนวทางจริยธรรมปัญญาประดิษฐ์มาประยุกต์ใช้งานดีเด่น เพื่อเป็นแบบอย่างในการแปลงแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ไปสู่การปฏิบัติอย่างเป็นรูปธรรม",
    buttons: [{ label: "อ่านรายละเอียดเพิ่มเติม", link: null }],
  },
];

export const newsData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    title: "สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ",
    desc: "มอบรางวัลยกย่องบุคคลและองค์กรที่มีการนำแนวทางจริยธรรมปัญญาประดิษฐ์มาประยุกต์ใช้งานดีเด่น",
    date: "12 เม.ย. 2569",
    category: "ข่าวประกาศ",
    content:
      "รายละเอียดข่าวฉบับเต็มของ สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ... (เนื้อหาจำลองเพิ่มเติม)",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
    title: "สดช. มอบรางวัลยกย่องบุคคลและองค์กร",
    desc: "ที่มีการนำแนวทางจริยธรรมปัญญาประดิษฐ์มาประยุกต์ใช้งานดีเด่น เพื่อเป็นแบบอย่างในการแปลงแนวปฏิบัติ...",
    date: "10 เม.ย. 2569",
    category: "กิจกรรม",
    content:
      "รายละเอียดข่าวฉบับเต็มของ สดช. มอบรางวัลยกย่องบุคคลและองค์กร... (เนื้อหาจำลองเพิ่มเติม)",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    title: "กำหนดตารางจัดอบรมในจังหวัดต่างๆ",
    desc: "สำหรับท่านที่ลงชื่อเข้าอบรมภาคปฏิบัติไว้โปรด Login เข้าระบบเพื่อตรวจสอบและลงทะเบียน",
    date: "05 เม.ย. 2569",
    category: "อบรมสัมมนา",
    content:
      "รายละเอียดข่าวฉบับเต็มของ กำหนดตารางจัดอบรมในจังหวัดต่างๆ... (เนื้อหาจำลองเพิ่มเติม)",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1488229297570-58520851e868?q=80&w=600&auto=format&fit=crop",
    title: "เปิดตัวระบบตรวจสอบความพร้อม AI สำหรับองค์กร",
    desc: "องค์กรสามารถเข้าใช้เครื่องมือออนไลน์เพื่อประเมินความเสี่ยงและจริยธรรมการใช้ AI ได้ฟรี",
    date: "01 เม.ย. 2569",
    category: "ข่าวประกาศ",
    content:
      "รายละเอียดข่าวฉบับเต็มของ เปิดตัวระบบตรวจสอบความพร้อม AI สำหรับองค์กร... (เนื้อหาจำลองเพิ่มเติม)",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
    title: "ประชุมรับฟังความคิดเห็นสาธารณะ",
    desc: "สรุปผลการรับฟังความคิดเห็นต่อ (ร่าง) แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ เพิ่มเติมปี 2569",
    date: "28 มี.ค. 2569",
    category: "ข่าวประกาศ",
    content:
      "รายละเอียดข่าวฉบับเต็มของ ประชุมรับฟังความคิดเห็นสาธารณะ... (เนื้อหาจำลองเพิ่มเติม)",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    title: "เวิร์กชอป AI สำหรับนิสิตนักศึกษา",
    desc: "เปิดรับสมัครเยาวชนรุ่นใหม่เข้าร่วมเรียนรู้วิธีการเขียนโปรแกรม AI อย่างมีจริยธรรมและรับผิดชอบ",
    date: "20 มี.ค. 2569",
    category: "กิจกรรม",
    content:
      "รายละเอียดข่าวฉบับเต็มของ เวิร์กชอป AI สำหรับนิสิตนักศึกษา... (เนื้อหาจำลองเพิ่มเติม)",
  },
];

// สามหลักการสำคัญที่กล่าวถึงในย่อหน้า "ความสำคัญของ Ethical AI" ด้านล่าง
const pillars = [
  {
    icon: Target,
    title: "ความรับผิดชอบ",
    desc: "AI ต้องดำเนินงานภายใต้การกำกับดูแลที่ตรวจสอบได้",
  },
  {
    icon: ShieldCheck,
    title: "ความปลอดภัย",
    desc: "ลดความเสี่ยงและผลกระทบที่อาจเกิดกับผู้ใช้งาน",
  },
  {
    icon: Scale,
    title: "ความเป็นธรรม",
    desc: "ไม่สร้างอคติหรือความเหลื่อมล้ำต่อกลุ่มใดกลุ่มหนึ่ง",
  },
];

// จับคู่หมวดข่าวกับสีธีมของเว็บ เพื่อให้แยกประเภทข่าวได้ไวขึ้นด้วยสายตา
const newsCategoryClass = {
  ข่าวประกาศ: "navy",
  กิจกรรม: "green",
  อบรมสัมมนา: "amber",
};

// ข้อมูลสำหรับไฟล์เอกสารดาวน์โหลด
export const documentData = [
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

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsIndex, setNewsIndex] = useState(0);
  const navigate = useNavigate();

  // Slider แบนเนอร์หลัก
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  };

  // Slider ข่าวสาร (เลื่อนครั้งละ 1 ใบ)
  const nextNews = () => {
    if (newsIndex < newsData.length - 4) {
      setNewsIndex(newsIndex + 1);
    }
  };
  const prevNews = () => {
    if (newsIndex > 0) {
      setNewsIndex(newsIndex - 1);
    }
  };

  // ฟังก์ชันพากดไปหน้ารายละเอียดข่าว
  const handleReadMore = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 6000); // ปรับเวลาสไลด์ให้นานขึ้นนิดนึงเพื่อความหรูหรา
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="hm-wrapper">
      <Tabbar />

      {/* 1. แบนเนอร์สไลด์ */}
      <section className="hm-hero-slider">
        {slideData.map((slide, index) => (
          <div
            key={slide.id}
            className={`hm-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* ปรับ Overlay ให้เป็น Gradient แทนสีดำทึบ */}
            <div className="hm-slide-overlay"></div>
            <div className="hm-slide-content">
              <h1 className="hm-slide-title">{slide.title}</h1>
              <p className="hm-slide-subtitle">{slide.subtitle}</p>
              <div className="hm-slide-actions">
                {slide.buttons.map((btn, i) => (
                  <button
                    key={i}
                    className={i === 0 ? "hm-btn-primary" : "hm-btn-secondary"}
                    onClick={btn.link ? () => navigate(btn.link) : undefined}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        <button className="hm-slider-arrow left" onClick={prevSlide}>
          <ChevronLeft size={28} strokeWidth={1.5} />
        </button>
        <button className="hm-slider-arrow right" onClick={nextSlide}>
          <ChevronRight size={28} strokeWidth={1.5} />
        </button>
        <div className="hm-slider-dots">
          {slideData.map((_, index) => (
            <div
              key={index}
              className={`hm-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </section>

      {/* =========================================
          ส่วนเอกสารดาวน์โหลด (แบบการ์ดขนาดเล็ก)
      ========================================= */}
      <section className="hm-section hm-document-section">
        <div className="hm-container">
          <div className="hm-document-header text-center">
            <span className="hm-eyebrow hm-eyebrow-center">เอกสารอ้างอิง</span>
            <h2 className="hm-section-title">ดาวน์โหลดเอกสารที่เกี่ยวข้อง</h2>
          </div>

          <div className="hm-document-grid">
            {documentData.map((doc) => (
              <div key={doc.id} className="hm-document-card">
                {/* รูปหน้าปกเอกสาร */}
                <div className="hm-document-img-wrapper">
                  <img src={doc.image} alt={doc.title} className="hm-document-img" />
                </div>
                
                {/* ข้อมูลและปุ่มดาวน์โหลด */}
                <div className="hm-document-info">
                  <h3 className="hm-document-title">{doc.title}</h3>
                  <p className="hm-document-desc">{doc.desc}</p>
                  
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hm-btn-download-sm"
                    download
                  >
                    <Download size={16} strokeWidth={2} /> ดาวน์โหลด PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* 👇 ส่วนที่เพิ่มใหม่: ปุ่มไปหน้าเอกสารทั้งหมด 👇 */}
          <div className="hm-document-more-action">
            <button 
              className="hm-btn-view-all" 
              onClick={() => navigate('/collections-doc')} /* เปลี่ยน '/documents' เป็น URL หน้าเอกสารของคุณ */
            >
              ดูเอกสารทั้งหมด <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
          {/* 👆 สิ้นสุดส่วนที่เพิ่มใหม่ 👆 */}
        </div>
      </section>
      {/* ========================================= */}

      {/* 2. ส่วนวิดีโอแนะนำโครงการ (ปรับเป็น YouTube) */}
      <section className="hm-section hm-featured-video-section">
        <div className="hm-container text-center">
          <span className="hm-badge">
            <PlayCircle size={16} strokeWidth={2} /> วิดีโอแนะนำ
          </span>
          <h2 className="hm-section-title">รับชมวิดีโอแนะนำโครงการ</h2>
          <p className="hm-section-subtitle">
            ทำความรู้จักกับแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ของประเทศไทย
          </p>
          <div className="hm-video-featured-wrapper">
            <div className="hm-video-placeholder large">
              {/* เปลี่ยนเป็น YouTube Embed Link */}
              <iframe
                src="https://www.youtube.com/embed/fPcKUhoWIuw?rel=0"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0 }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ส่วนความสำคัญของ Ethical AI */}
      <section
        className="hm-importance-section"
        style={{ backgroundImage: `url(${ethicAiImg})` }}
      >
        <div className="hm-importance-overlay"></div>
        <div className="hm-importance-content">
          <div className="hm-importance-text-box">
            <h2>ความสำคัญของ Ethical AI</h2>
            <p>
              เทคโนโลยีปัญญาประดิษฐ์ในปัจจุบัน มีการพัฒนาให้มีความชาญฉลาด
              และมีประสิทธิภาพมากขึ้นเรื่อยๆ จนก่อให้เกิดความกังวลว่า AI
              จะมีโอกาสเข้ามาแทนที่งานในหลายด้านของมนุษย์ การสร้างกรอบจริยธรรม
              (Ethics) จึงเป็นกลไกสำคัญที่จะกำกับดูแลให้ AI
              ถูกนำมาใช้อย่างมีความรับผิดชอบ ปลอดภัย และเป็นธรรมต่อทุกคน
            </p>
            <button className="hm-btn-readmore">
              อ่านเพิ่มเติม <ArrowRight size={18} />
            </button>

            <div className="hm-pillars-row">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="hm-pillar-chip">
                  <div className="hm-pillar-icon">
                    <pillar.icon size={20} strokeWidth={1.75} />
                  </div>
                  <div className="hm-pillar-text">
                    <strong>{pillar.title}</strong>
                    <span>{pillar.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. ส่วนกรอบแนวคิดนโยบาย (Split Layout) */}
      <section className="hm-section hm-policy-section">
        <div className="hm-container">
          <div className="hm-policy-header text-center">
            <span className="hm-eyebrow hm-eyebrow-center">
              แนวทางการดำเนินงาน
            </span>
            <h2 className="hm-section-title">
              กรอบแนวคิด นโยบายในการดำเนินโครงการ
            </h2>
            <p className="hm-section-subtitle">
              จุดเริ่มต้นและเป้าหมายหลักของการสร้างมาตรฐานจริยธรรมปัญญาประดิษฐ์ในประเทศไทย
            </p>
          </div>

          <div className="hm-policy-horizontal-card">
            <div className="hm-policy-card-img">
              <span className="hm-policy-step-number">01</span>
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
                alt="Instruction"
              />
            </div>
            <div className="hm-policy-card-info">
              <span className="hm-policy-step-tag">
                <FileText size={14} strokeWidth={2.25} /> POLICY GUIDELINE
              </span>
              <h3 className="hm-policy-card-title">ข้อสั่งการคณะรัฐมนตรี</h3>
              <p className="hm-policy-card-desc">
                ตามหนังสือสำนักเลขาธิการคณะรัฐมนตรีที่ นร 0505/ว 74 ลงวันที่ 4
                กุมภาพันธ์ 2564 เรื่อง แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ (Thailand
                AI Ethics Guideline) แจ้งว่า กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม
                ได้ขอให้คณะรัฐมนตรีรับทราบแนวปฏิบัติฯ
                และให้หน่วยงานราชการใช้เป็นแนวทางปฏิบัติ...
              </p>
            </div>
          </div>

          <div
            className="hm-policy-horizontal-card reverse"
            style={{ marginTop: "40px" }}
          >
            <div className="hm-policy-card-img">
              <span className="hm-policy-step-number">02</span>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
                alt="Goals"
              />
            </div>
            <div className="hm-policy-card-info">
              <span className="hm-policy-step-tag">
                <Target size={14} strokeWidth={2.25} /> STRATEGIC GOAL
              </span>
              <h3 className="hm-policy-card-title">เป้าหมายและแนวทางปฏิบัติ</h3>
              <p className="hm-policy-card-desc">
                มติ ครม. มอบหมาย ให้กระทรวงดิจิทัลฯ
                เร่งสร้างความเข้าใจที่ชัดเจนกับหน่วยงานที่เกี่ยวข้อง
                ในประเด็นหลักคิด นิยาม และแนวทางการแปลงจริยธรรมสู่การปฏิบัติ
                โดยให้พิจารณากำหนดหน่วยงานนำร่องในระยะแรก...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ส่วนข่าวสารและกิจกรรม (ปรับปรุงให้เลื่อนได้) */}
      <section className="hm-section hm-news-section">
        <div className="hm-container">
          <div className="hm-news-header-flex">
            <div>
              <span className="hm-eyebrow">อัปเดตล่าสุด</span>
              <h2 className="hm-section-title">ข่าวสารและกิจกรรมต่างๆ</h2>
            </div>
            <div className="hm-news-nav-btns">
              <button
                className="hm-news-nav-btn"
                onClick={prevNews}
                disabled={newsIndex === 0}
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
              <button
                className="hm-news-nav-btn"
                onClick={nextNews}
                disabled={newsIndex >= newsData.length - 4}
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="hm-news-slider-container">
            <div
              className="hm-news-track"
              style={{ transform: `translateX(-${newsIndex * (100 / 4)}%)` }}
            >
              {newsData.map((news) => (
                <div key={news.id} className="hm-news-card-wrapper">
                  <div className="hm-news-card">
                    <div className="hm-news-img-wrapper">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="hm-news-img"
                      />
                      <span
                        className={`hm-news-category ${
                          newsCategoryClass[news.category] || "navy"
                        }`}
                      >
                        {news.category}
                      </span>
                    </div>
                    <div className="hm-news-info">
                      <div className="hm-news-date">
                        <Calendar size={14} /> {news.date}
                      </div>
                      <h3 className="hm-news-title">{news.title}</h3>
                      <p className="hm-news-desc">{news.desc}</p>

                      <button
                        className="hm-news-btn"
                        onClick={() => handleReadMore(news.id)}
                      >
                        อ่านเพิ่มเติม{" "}
                        <ArrowRight size={14} className="icon-right" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
