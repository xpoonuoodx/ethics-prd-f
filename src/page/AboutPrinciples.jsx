import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { Target, Scale, ShieldCheck, Eye, Users } from "lucide-react";
import "./style/About.css";

function AboutPrinciples() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-wrapper">
      <Tabbar />

      <section
        className="about-hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-kicker">หลักการและเป้าหมาย</span>
          <h1 className="about-hero-title">หลักการ และวัตถุประสงค์</h1>
          <p className="about-hero-subtitle">
            เป้าหมายหลักในการสร้างสภาพแวดล้อมที่ปลอดภัยและเป็นธรรมสำหรับการใช้งาน
            AI
          </p>
        </div>
      </section>

      <main className="about-main">
        <div className="about-card">
          <h2 className="about-section-title">
            <Target className="icon" size={28} />
            วัตถุประสงค์โครงการ
          </h2>
          <div className="about-text-content">
            <p>
              โครงการนี้จัดทำขึ้นเพื่อสร้างความตระหนักรู้และส่งเสริมให้เกิดการนำแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ไปประยุกต์ใช้อย่างเป็นรูปธรรม
              โดยมุ่งเน้นการสร้างสมดุลระหว่างการพัฒนานวัตกรรมและการคุ้มครองสิทธิของประชาชน
            </p>
          </div>

          <h2 className="about-section-title" style={{ marginTop: "40px" }}>
            <Scale className="icon" size={28} />
            หลักการสำคัญ 4 ประการ
          </h2>
          <ul className="about-list">
            <li>
              <Eye className="about-list-icon" size={24} />
              <div className="about-list-text">
                <h4>ความโปร่งใสและอธิบายได้ (Transparency & Explainability)</h4>
                <p>
                  ระบบ AI ควรสามารถอธิบายหลักการทำงานและกระบวนการตัดสินใจได้
                  เพื่อให้เกิดความน่าเชื่อถือและตรวจสอบได้
                </p>
              </div>
            </li>
            <li>
              <ShieldCheck className="about-list-icon" size={24} />
              <div className="about-list-text">
                <h4>
                  ความมั่นคงปลอดภัยและความเป็นส่วนตัว (Security & Privacy)
                </h4>
                <p>
                  ต้องมีมาตรการป้องกันความเสี่ยงด้านไซเบอร์
                  และปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
                  อย่างเคร่งครัด
                </p>
              </div>
            </li>
            <li>
              <Scale className="about-list-icon" size={24} />
              <div className="about-list-text">
                <h4>
                  ความเป็นธรรมและลดความลำเอียง (Fairness & Non-discrimination)
                </h4>
                <p>
                  ออกแบบระบบเพื่อลดอคติที่อาจเกิดขึ้นจากข้อมูล
                  เพื่อให้การตัดสินใจของ AI เป็นธรรมกับทุกกลุ่มคนในสังคม
                </p>
              </div>
            </li>
            <li>
              <Users className="about-list-icon" size={24} />
              <div className="about-list-text">
                <h4>ความรับผิดชอบ (Accountability)</h4>
                <p>
                  ต้องระบุผู้รับผิดชอบที่ชัดเจนหากระบบ AI
                  ก่อให้เกิดผลกระทบหรือความเสียหายต่อผู้ใช้งานหรือสังคม
                </p>
              </div>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPrinciples;
