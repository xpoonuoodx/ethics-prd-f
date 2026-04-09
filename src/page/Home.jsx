import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import "./style/Home.css";

// นำเข้ารูปภาพพื้นหลังส่วนความสำคัญ
import ethicAiImg from "../assets/ethic-ai.png";

// ==========================================
// ข้อมูล Data ต่างๆ
// ==========================================

const slideData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop",
    title: "เครื่องมือประเมินความพร้อม AI",
    subtitle:
      "ทดสอบและประเมินระบบ AI ขององค์กรคุณ ว่าสอดคล้องกับหลักจริยธรรมหรือไม่ ด้วยชุดเครื่องมือประเมินมาตรฐาน",
    buttons: ["เริ่มการประเมิน", "ศึกษาคู่มือการประเมิน"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop",
    title: "แนวทางจริยธรรมปัญญาประดิษฐ์ของประเทศไทย",
    subtitle:
      "สมัครเข้าร่วมโครงการอบรมจริยธรรม ปัญญาประดิษฐ์ (หลักสูตรออนไลน์)",
    buttons: ["อ่านรายละเอียดเพิ่มเติม", "สมัครเข้าร่วมโครงการ"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1920&auto=format&fit=crop",
    title: "รางวัลยกย่องบุคคลและองค์กรดีเด่น",
    subtitle:
      "สํานักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ มอบรางวัลยกย่องบุคคลและองค์กรที่มีการนําแนวทางจริยธรรมปัญญาประดิษฐ์มาประยุกต์ใช้งานดีเด่น เพื่อเป็นแบบอย่างในการแปลงแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ไปสู่การปฏิบัติอย่างเป็นรูปธรรม",
    buttons: ["อ่านรายละเอียดเพิ่มเติม"],
  },
];

const newsData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
    title: "สำนักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ",
    desc: "มอบรางวัลยกย่องบุคคลและองค์กรที่มีการนำแนวทางจริยธรรมปัญญาประดิษฐ์มาประยุกต์ใช้งานดีเด่น",
    date: "12 เม.ย. 2569",
    category: "ข่าวประกาศ",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
    title: "สดช. มอบรางวัลยกย่องบุคคลและองค์กร",
    desc: "ที่มีการนำแนวทางจริยธรรมปัญญาประดิษฐ์มาประยุกต์ใช้งานดีเด่น เพื่อเป็นแบบอย่างในการแปลงแนวปฏิบัติ...",
    date: "10 เม.ย. 2569",
    category: "กิจกรรม",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
    title: "กำหนดตารางจัดอบรมในจังหวัดต่างๆ",
    desc: "สำหรับท่านที่ลงชื่อเข้าอบรมภาคปฏิบัติไว้โปรด Login เข้าระบบเพื่อตรวจสอบและลงทะเบียน",
    date: "05 เม.ย. 2569",
    category: "อบรมสัมมนา",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1488229297570-58520851e868?q=80&w=600&auto=format&fit=crop",
    title: "เปิดตัวระบบตรวจสอบความพร้อม AI สำหรับองค์กร",
    desc: "องค์กรสามารถเข้าใช้เครื่องมือออนไลน์เพื่อประเมินความเสี่ยงและจริยธรรมการใช้ AI ได้ฟรี",
    date: "01 เม.ย. 2569",
    category: "ข่าวประกาศ",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
    title: "ประชุมรับฟังความคิดเห็นสาธารณะ",
    desc: "สรุปผลการรับฟังความคิดเห็นต่อ (ร่าง) แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ เพิ่มเติมปี 2569",
    date: "28 มี.ค. 2569",
    category: "ข่าวประกาศ",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    title: "เวิร์กชอป AI สำหรับนิสิตนักศึกษา",
    desc: "เปิดรับสมัครเยาวชนรุ่นใหม่เข้าร่วมเรียนรู้วิธีการเขียนโปรแกรม AI อย่างมีจริยธรรมและรับผิดชอบ",
    date: "20 มี.ค. 2569",
    category: "กิจกรรม",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsIndex, setNewsIndex] = useState(0); // State สำหรับเลื่อนข่าวสาร

  // Slider แบนเนอร์หลัก
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  };

  // Slider ข่าวสาร (เลื่อนครั้งละ 1 ใบ)
  const nextNews = () => {
    // ปรับเงื่อนไขตามจำนวนที่โชว์บนหน้าจอ (คอมโชว์ 4 ใบ มี 6 ใบ เลื่อนได้สูงสุด index 2)
    if (newsIndex < newsData.length - 4) {
      setNewsIndex(newsIndex + 1);
    }
  };
  const prevNews = () => {
    if (newsIndex > 0) {
      setNewsIndex(newsIndex - 1);
    }
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
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
            <div className="hm-slide-overlay"></div>
            <div className="hm-slide-content">
              <h1 className="hm-slide-title">{slide.title}</h1>
              <p className="hm-slide-subtitle">{slide.subtitle}</p>
              <div className="hm-slide-actions">
                {slide.buttons.map((btnText, i) => (
                  <button
                    key={i}
                    className={i === 0 ? "hm-btn-primary" : "hm-btn-secondary"}
                  >
                    {btnText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        <button className="hm-slider-arrow left" onClick={prevSlide}>
          <ChevronLeft />
        </button>
        <button className="hm-slider-arrow right" onClick={nextSlide}>
          <ChevronRight />
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

      {/* 2. ส่วนวิดีโอแนะนำโครงการ */}
      <section className="hm-section hm-featured-video-section">
        <div className="hm-container text-center">
          <span className="hm-badge">วิดีโอแนะนำ</span>
          <h2 className="hm-section-title">รับชมวิดีโอแนะนำโครงการ</h2>
          <p className="hm-section-subtitle">
            ทำความรู้จักกับแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ของประเทศไทย
          </p>
          <div className="hm-video-featured-wrapper">
            <div className="hm-video-placeholder large">
              <iframe
                src="https://player.vimeo.com/video/703220222?title=0&byline=0&portrait=0"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0 }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ส่วนความสำคัญของ Ethical AI */}
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
          </div>
        </div>
      </section>

      {/* 3. ส่วนกรอบแนวคิดนโยบาย (Split Layout) */}
      <section className="hm-section hm-policy-section">
        <div className="hm-container">
          <div className="hm-policy-header text-center">
            <h2 className="hm-section-title">
              กรอบแนวคิด นโยบายในการดำเนินโครงการ
            </h2>
            <p className="hm-section-subtitle">
              จุดเริ่มต้นและเป้าหมายหลักของการสร้างมาตรฐานจริยธรรมปัญญาประดิษฐ์ในประเทศไทย
            </p>
          </div>
          <div className="hm-policy-horizontal-card">
            <div className="hm-policy-card-img">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
                alt="Instruction"
              />
            </div>
            <div className="hm-policy-card-info">
              <span className="hm-policy-step-tag">POLICY GUIDELINE</span>
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
            className="hm-policy-horizontal-card"
            style={{ marginTop: "30px" }}
          >
            <div className="hm-policy-card-img">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
                alt="Goals"
              />
            </div>
            <div className="hm-policy-card-info">
              <span className="hm-policy-step-tag">STRATEGIC GOAL</span>
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
              <h2 className="hm-section-title">ข่าวสารและกิจกรรมต่างๆ</h2>
              {/* <p className="hm-section-subtitle">
                ติดตามความเคลื่อนไหว กิจกรรมอบรม และประกาศรางวัลล่าสุด
              </p> */}
            </div>
            <div className="hm-news-nav-btns">
              <button
                className="hm-news-nav-btn"
                onClick={prevNews}
                disabled={newsIndex === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="hm-news-nav-btn"
                onClick={nextNews}
                disabled={newsIndex >= newsData.length - 4}
              >
                <ChevronRight size={20} />
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
                      <span className="hm-news-category">{news.category}</span>
                    </div>
                    <div className="hm-news-info">
                      <div className="hm-news-date">
                        <Calendar size={14} /> {news.date}
                      </div>
                      <h3 className="hm-news-title">{news.title}</h3>
                      <p className="hm-news-desc">{news.desc}</p>
                      <button className="hm-news-btn">อ่านเพิ่มเติม</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hm-news-view-all">
            <button className="hm-btn-outline">ดูข่าวสารทั้งหมด</button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
