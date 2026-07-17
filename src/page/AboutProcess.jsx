import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { Workflow } from "lucide-react";
import "./style/About.css";

function AboutProcess() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-wrapper">
      <Tabbar />

      <section
        className="about-hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-kicker">ขั้นตอนการทำงาน</span>
          <h1 className="about-hero-title">ขั้นตอนการดำเนินการ</h1>
          <p className="about-hero-subtitle">
            กระบวนการแปลงแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์ไปสู่การปฏิบัติจริง
          </p>
        </div>
      </section>

      <main className="about-main">
        <div className="about-card">
          <h2 className="about-section-title">
            <Workflow className="icon" size={28} />
            แผนการดำเนินงาน
          </h2>
          <div className="about-text-content">
            <p>
              กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม
              ได้กำหนดโรดแมปการดำเนินงานเพื่อสร้างความพร้อมให้กับหน่วยงานต่างๆ
              ดังนี้:
            </p>
          </div>

          <ul className="about-list">
            <li>
              <span className="about-step-badge">01</span>
              <div className="about-list-text">
                <h4>ระยะที่ 1: สร้างความตระหนักรู้ (Awareness)</h4>
                <p>
                  จัดสัมมนา เผยแพร่ความรู้ และสร้างความเข้าใจในประเด็นหลักคิด
                  นิยาม ของแนวปฏิบัติจริยธรรม AI ให้กับหน่วยงานภาครัฐและเอกชน
                </p>
              </div>
            </li>
            <li>
              <span className="about-step-badge">02</span>
              <div className="about-list-text">
                <h4>ระยะที่ 2: โครงการนำร่อง (Pilot Project)</h4>
                <p>
                  พิจารณากำหนดหน่วยงานที่มีความพร้อมเพื่อเป็นหน่วยงานนำร่องในการนำหลักจริยธรรมไปบังคับใช้ในการพัฒนาบริการของตนเอง
                </p>
              </div>
            </li>
            <li>
              <span className="about-step-badge">03</span>
              <div className="about-list-text">
                <h4>ระยะที่ 3: ประเมินและวัดผล (Evaluation)</h4>
                <p>
                  ประเมินผลการดำเนินงานของหน่วยงานนำร่อง รับฟังปัญหา อุปสรรค
                  และรวบรวมข้อเสนอแนะเพื่อปรับปรุงชุดเครื่องมือ
                </p>
              </div>
            </li>
            <li>
              <span className="about-step-badge">04</span>
              <div className="about-list-text">
                <h4>ระยะที่ 4: ขยายผล (Expansion)</h4>
                <p>
                  ขยายผลการดำเนินการไปยังหน่วยงานอื่นๆ ในวงกว้าง
                  พร้อมจัดทำเกณฑ์มาตรฐานการประเมินเพื่อมอบรางวัลองค์กรดีเด่นต่อไป
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

export default AboutProcess;
