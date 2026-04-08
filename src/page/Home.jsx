import React, { useState, useEffect } from "react";
import Tabbar from "../component/Tabbar"; // ปรับ path ให้ตรงกับของคุณ
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./style/Home.css"; // ปรับ path ให้ตรงกับของคุณ

// ข้อมูลสำหรับแต่ละแบนเนอร์
const slideData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1920&auto=format&fit=crop",
    title: "รางวัลยกย่องบุคคลและองค์กรดีเด่น",
    subtitle:
      "สํานักงานคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ มอบรางวัลยกย่องบุคคลและองค์กรที่มีการนําแนวทางจริยธรรมปัญญาประดิษฐ์มาประยุกต์ใช้งานดีเด่น เพื่อเป็นแบบอย่างในการแปลงแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ไปสู่การปฏิบัติอย่างเป็นรูปธรรม",
    buttons: ["อ่านรายละเอียดเพิ่มเติม"],
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
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop",
    title: "เครื่องมือประเมินความพร้อม AI",
    subtitle:
      "ทดสอบและประเมินระบบ AI ขององค์กรคุณ ว่าสอดคล้องกับหลักจริยธรรมหรือไม่ ด้วยชุดเครื่องมือประเมินมาตรฐาน",
    buttons: ["เริ่มการประเมิน", "ศึกษาคู่มือการประเมิน"],
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // ฟังก์ชันเลื่อนแบนเนอร์ถัดไป
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));
  };

  // ฟังก์ชันเลื่อนแบนเนอร์ก่อนหน้า
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  };

  // ให้สไลด์เลื่อนอัตโนมัติทุกๆ 6 วินาที
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="hm-wrapper">
      <Tabbar />

      {/* --- ส่วนแบนเนอร์สไลด์ --- */}
      <section className="hm-hero-slider">
        {slideData.map((slide, index) => (
          <div
            key={slide.id}
            className={`hm-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* เลเยอร์สีเข้มทับรูปเพื่อให้ข้อความสีขาวอ่านง่าย */}
            <div className="hm-slide-overlay"></div>

            <div className="hm-slide-content">
              <h1 className="hm-slide-title">{slide.title}</h1>
              <p className="hm-slide-subtitle">{slide.subtitle}</p>

              {/* เรนเดอร์ปุ่มตามที่มีใน Array ข้อมูล */}
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

        {/* ปุ่มลูกศรซ้าย-ขวา */}
        <button className="hm-slider-arrow left" onClick={prevSlide}>
          <ChevronLeft size={36} />
        </button>
        <button className="hm-slider-arrow right" onClick={nextSlide}>
          <ChevronRight size={36} />
        </button>

        {/* จุดนำทาง (Dots) ด้านล่าง */}
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
    </div>
  );
};

export default Home;
