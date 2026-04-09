import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { BookOpen, Lightbulb } from "lucide-react";
import "./style/About.css";

function AboutBackground() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-wrapper">
      <Tabbar />

      <section
        className="about-hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="about-hero-title">ที่มา และความสำคัญ</h1>
          <p className="about-hero-subtitle">
            จุดเริ่มต้นของกรอบแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์เพื่อการพัฒนาที่ยั่งยืนในประเทศไทย
          </p>
        </div>
      </section>

      <main className="about-main">
        <div className="about-card">
          <h2 className="about-section-title">
            <BookOpen className="icon" size={28} />
            บริบทและการเปลี่ยนแปลง
          </h2>
          <div className="about-text-content">
            <p>
              ในยุคปัจจุบัน เทคโนโลยีปัญญาประดิษฐ์ (Artificial Intelligence: AI)
              ได้เข้ามามีบทบาทสำคัญในการขับเคลื่อนเศรษฐกิจและสังคมทั่วโลก
              อย่างไรก็ตาม นอกเหนือจากประโยชน์มหาศาลที่ได้รับ
              ยังมีความท้าทายและความเสี่ยงที่อาจเกิดขึ้นจากการใช้ AI
              อย่างไม่เหมาะสม เช่น การละเมิดความเป็นส่วนตัว
              ความลำเอียงของอัลกอริทึม และผลกระทบต่อตลาดแรงงาน
            </p>
            <p>
              ด้วยเหตุนี้ ประเทศไทยจึงเล็งเห็นความจำเป็นเร่งด่วนในการกำหนด{" "}
              <strong>
                "แนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ (Thailand AI Ethics Guideline)"
              </strong>
              เพื่อเป็นเข็มทิศนำทางให้กับหน่วยงานภาครัฐ ภาคเอกชน
              และสถาบันการศึกษา ในการวิจัย พัฒนา และประยุกต์ใช้เทคโนโลยี AI
              อย่างมีความรับผิดชอบ
            </p>
          </div>
        </div>

        <div className="about-card">
          <h2 className="about-section-title">
            <Lightbulb className="icon" size={28} />
            ข้อสั่งการคณะรัฐมนตรี
          </h2>
          <div className="about-text-content">
            <p>
              ตามหนังสือสำนักเลขาธิการคณะรัฐมนตรีที่ นร 0505/ว 74 ลงวันที่ 4
              กุมภาพันธ์ 2564 แจ้งว่า กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม
              ได้ขอให้คณะรัฐมนตรีรับทราบแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
              และให้หน่วยงานราชการใช้เป็นแนวทางปฏิบัติ ในการพัฒนา ส่งเสริม
              และนำไปใช้ในทางที่ถูกต้อง คณะรัฐมนตรีได้มีมติเมื่อวันที่ 2
              กุมภาพันธ์ 2564 รับทราบและเห็นชอบตามที่เสนอ
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutBackground;
