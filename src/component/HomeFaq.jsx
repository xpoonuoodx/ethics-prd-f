import React, { useState } from "react";
import {
  HelpCircle,
  UserCircle,
  BookOpen,
  Lightbulb,
  Plus,
  Minus,
} from "lucide-react";
import "./style/HomeFaq.css";

// หมวดหมู่และคำถามที่พบบ่อย (แก้ไขเนื้อหาได้ที่นี่)
// คำตอบ (a) เป็น array ของบล็อก: string = ย่อหน้า, { h } = หัวข้อย่อย, { ul: [...] } = รายการ, { note } = หมายเหตุ
const FAQ_TABS = [
  {
    key: "general",
    label: "คำถามทั่วไป",
    icon: HelpCircle,
    items: [
      {
        q: "แพลตฟอร์มนี้คืออะไร",
        a: [
          "แพลตฟอร์มจริยธรรมปัญญาประดิษฐ์ (AI Ethics) เป็นระบบเรียนรู้และประเมินความพร้อมด้านจริยธรรม AI สำหรับหน่วยงานและบุคลากร",
          "ผู้ใช้สามารถเรียนบทเรียน ทำแบบทดสอบ ใช้เครื่องมือประเมิน และรับใบประกาศนียบัตรได้ในที่เดียว",
        ],
      },
      {
        q: "ใครสามารถใช้งานแพลตฟอร์มได้บ้าง",
        a: [
          "บุคลากรของหน่วยงานที่เข้าร่วมโครงการ ทั้งผู้กำกับดูแลหน่วยงานและผู้ใช้งานทั่วไป โดยสิทธิ์การใช้งานจะแตกต่างกันตามบทบาท",
        ],
      },
      {
        q: "การใช้งานมีค่าใช้จ่ายหรือไม่",
        a: ["ไม่มีค่าใช้จ่ายในการลงทะเบียนและใช้งานแพลตฟอร์ม"],
      },
    ],
  },
  {
    key: "start",
    label: "เริ่มต้นใช้งานและบัญชี",
    icon: UserCircle,
    items: [
      {
        q: "ความแตกต่างระหว่างการสมัครในนาม “ประชาชน” และ “หน่วยงาน”",
        a: [
          { h: "การสมัครในนามประชาชน" },
          {
            ul: [
              "เหมาะสำหรับบุคคลทั่วไปที่ต้องการศึกษา เรียนรู้ หรือทดลองใช้เครื่องมือ",
              "การใช้งานมุ่งเน้นการประเมินหรือเรียนรู้ในระดับบุคคล",
              "ข้อมูลที่บันทึกไม่ควรถูกตีความว่าเป็นผลการประเมินอย่างเป็นทางการขององค์กร เว้นแต่ระบบกำหนดไว้เป็นอย่างอื่น",
            ],
          },
          { h: "การสมัครในนามหน่วยงาน" },
          {
            ul: [
              "เหมาะสำหรับองค์กรหรือหน่วยงานที่ต้องการใช้ระบบเพื่อประเมินระบบหรือโครงการ AI ขององค์กร",
              "อาจมีการบันทึกข้อมูลที่เกี่ยวข้องกับองค์กร ระบบ AI โครงการ หรือผู้รับผิดชอบ",
              "ผลการประเมินสามารถใช้เป็นข้อมูลประกอบการกำกับดูแลและพัฒนาแนวปฏิบัติภายในองค์กร",
            ],
          },
          {
            note: "ควรเลือกประเภทสมาชิกให้ตรงกับวัตถุประสงค์การใช้งาน เนื่องจากการทดลองใช้ในนามบุคคลกับการประเมินระบบ AI ขององค์กรมีบริบทและความรับผิดชอบที่แตกต่างกัน",
          },
        ],
      },
      {
        q: "สมัครสมาชิกและเข้าสู่ระบบอย่างไร",
        a: [
          "กดปุ่ม “ลงทะเบียน / เข้าสู่ระบบ” ที่มุมขวาบน กรอกข้อมูลตามแบบฟอร์ม หรือเข้าสู่ระบบผ่านบัญชี LINE ได้",
        ],
      },
      {
        q: "ลืมรหัสผ่านต้องทำอย่างไร",
        a: [
          "กดลิงก์ “ลืมรหัสผ่าน” ในหน้าเข้าสู่ระบบ หรือติดต่อผู้กำกับดูแลของหน่วยงานเพื่อขอความช่วยเหลือ",
        ],
      },
      {
        q: "จะเปลี่ยนชื่อหรือข้อมูลส่วนตัวได้อย่างไร",
        a: ["เข้าสู่ระบบแล้วไปที่หน้าข้อมูลส่วนตัวเพื่อแก้ไขข้อมูลของคุณ"],
      },
    ],
  },
  {
    key: "learn",
    label: "เรียนรู้เกี่ยวกับ AI",
    icon: BookOpen,
    items: [
      {
        q: "ต้องเรียนและสอบอย่างไรจึงจะได้ใบประกาศนียบัตร",
        a: [
          "เรียนบทเรียนในระบบการเรียนรู้ให้ครบ แล้วทำแบบทดสอบให้ผ่านเกณฑ์ที่กำหนด ระบบจะออกใบประกาศนียบัตรให้อัตโนมัติ",
        ],
      },
      {
        q: "ตรวจสอบความถูกต้องของใบประกาศนียบัตรได้อย่างไร",
        a: [
          "สแกน QR Code บนใบประกาศนียบัตร เพื่อเข้าสู่หน้าตรวจสอบความถูกต้องของใบประกาศฯ",
        ],
      },
    ],
  },
  {
    key: "trouble",
    label: "แก้ปัญหาการใช้งาน",
    icon: Lightbulb,
    items: [
      {
        q: "เข้าสู่ระบบไม่ได้ ต้องทำอย่างไร",
        a: [
          "ตรวจสอบชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง หากยังไม่สามารถเข้าได้ ให้ติดต่อผู้กำกับดูแลหน่วยงานหรือผู้ดูแลระบบ",
        ],
      },
      {
        q: "พบปัญหาการใช้งานจะติดต่อได้ที่ไหน",
        a: ["สามารถแจ้งปัญหาได้ที่หน้า “ติดต่อเรา” ในเมนูด้านบนของเว็บไซต์"],
      },
    ],
  },
];

const HomeFaq = () => {
  const [activeTab, setActiveTab] = useState(FAQ_TABS[0].key);
  const [openIndex, setOpenIndex] = useState(0);

  const current = FAQ_TABS.find((t) => t.key === activeTab);

  const changeTab = (key) => {
    setActiveTab(key);
    setOpenIndex(0);
  };

  return (
    <section className="hm-section hm-faq-section" id="faq">
      <div className="hm-faq-container">
        <div className="hm-faq-head">
          <h2 className="hm-faq-title">คำถามที่พบบ่อย</h2>
          <p className="hm-faq-subtitle">
            รวมคำตอบเรื่องการลงทะเบียน การใช้งาน การเรียนรู้ และใบประกาศนียบัตร
          </p>
        </div>

        <div className="hm-faq-tabs" role="tablist">
          {FAQ_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              className={`hm-faq-tab ${activeTab === key ? "active" : ""}`}
              onClick={() => changeTab(key)}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="hm-faq-list">
          {current.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className={`hm-faq-item ${isOpen ? "open" : ""}`}>
                <button
                  className="hm-faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span className="hm-faq-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hm-faq-q-text">{item.q}</span>
                  {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                {isOpen && (
                  <div className="hm-faq-answer">
                    {item.a.map((block, k) => {
                      if (typeof block === "string")
                        return <p key={k}>{block}</p>;
                      if (block.h)
                        return (
                          <h4 key={k} className="hm-faq-answer-h">
                            {block.h}
                          </h4>
                        );
                      if (block.ul)
                        return (
                          <ul key={k}>
                            {block.ul.map((li) => (
                              <li key={li}>{li}</li>
                            ))}
                          </ul>
                        );
                      return (
                        <p key={k} className="hm-faq-answer-note">
                          <strong>หมายเหตุ : </strong>
                          {block.note}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFaq;
