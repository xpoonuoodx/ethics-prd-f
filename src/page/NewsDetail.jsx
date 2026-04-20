import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tabbar from "../component/Tabbar"; // ปรับ path ถ้าไม่ตรง
import Footer from "../component/Footer";
import { Calendar, ArrowLeft } from "lucide-react";
import { newsData } from "./Home"; // นำเข้า Mock Data จากไฟล์ Home
import "./style/NewsDetail.css";

const NewsDetail = () => {
  const { id } = useParams(); // รับค่า ID จาก URL
  const navigate = useNavigate();

  // หาข่าวที่มี ID ตรงกับ URL
  const newsItem = newsData.find((item) => item.id === parseInt(id));

  // ทำให้เลื่อนขึ้นไปบนสุดเสมอเมื่อเข้ามาหน้านี้
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!newsItem) {
    return (
      <div className="nd-wrapper">
        <Tabbar />
        <div className="nd-error-container">
          <h2>ไม่พบข้อมูลข่าวสารที่คุณต้องการ</h2>
          <button onClick={() => navigate("/")} className="nd-back-btn">
            กลับสู่หน้าหลัก
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="nd-wrapper">
      <Tabbar />

      <main className="nd-main-content">
        <div className="nd-container">
          <button onClick={() => navigate("/")} className="nd-back-link">
            <ArrowLeft size={18} /> ย้อนกลับ
          </button>

          <div className="nd-header">
            <span className="nd-category-badge">{newsItem.category}</span>
            <h1 className="nd-title">{newsItem.title}</h1>
            <div className="nd-meta">
              <Calendar size={16} /> <span>{newsItem.date}</span>
            </div>
          </div>

          <div className="nd-image-wrapper">
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="nd-featured-image"
            />
          </div>

          <div className="nd-article-body">
            <p className="nd-lead-text">{newsItem.desc}</p>

            {/* เนื้อหาข่าวจำลอง */}
            <div className="nd-article-content">
              <p>{newsItem.content}</p>
              <p>
                คณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ
                เล็งเห็นถึงความสำคัญของการนำเทคโนโลยีปัญญาประดิษฐ์ (AI)
                มาประยุกต์ใช้งานในภาคส่วนต่างๆ ทั้งภาครัฐและเอกชน
                โดยมุ่งเน้นการสร้างความสมดุลระหว่างนวัตกรรมและจริยธรรม
                เพื่อให้เกิดประโยชน์สูงสุดแก่ประเทศชาติและประชาชน
              </p>
              <h3>เป้าหมายของโครงการ</h3>
              <ul>
                <li>สร้างความตระหนักรู้ด้านจริยธรรม AI</li>
                <li>ส่งเสริมการพัฒนาระบบ AI ที่โปร่งใสและตรวจสอบได้</li>
                <li>คุ้มครองข้อมูลส่วนบุคคลและสิทธิของประชาชน</li>
              </ul>
              <p>
                ทั้งนี้ ทางสำนักงานฯ
                จะมีการจัดกิจกรรมและเวิร์กชอปเพื่อให้ความรู้และสร้างเครือข่ายความร่วมมือต่อไป...
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsDetail;
