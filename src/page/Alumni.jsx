import React, { useEffect, useState } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { Award } from "lucide-react";
import { alumniBatches } from "../data/alumniList";
import { maskName } from "../utils/maskName";
import "./style/About.css";
import "./style/Alumni.css";

// หน้า "ทำเนียบรุ่น" (Public) - แสดงรายชื่อผู้ผ่านการอบรมแยกตามรุ่น จากรายชื่อคงที่ใน src/data/alumniList.js
// ชื่อ-นามสกุลถูกปิดบังบางส่วน (เช่น "สม*** ใจ***") ก่อนแสดง
// (ปิดการดึงข้อมูลจากหน้าจัดการทำเนียบรุ่นของแอดมินชั่วคราว)
function Alumni() {
  const batches = alumniBatches;
  const [selectedId, setSelectedId] = useState(batches[0]?.id ?? null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedBatch = batches.find((b) => b.id === selectedId);
  const alumni = (selectedBatch?.alumni || []).map((p, i) => ({
    firstName: maskName(p.firstName),
    lastName: maskName(p.lastName),
    no: i + 1,
  }));

  return (
    <div className="about-wrapper">
      <Tabbar />

      <section
        className="about-hero"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop')`,
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-kicker">Thailand AI Ethics</span>
          <h1 className="about-hero-title">ทำเนียบรุ่น</h1>
          <p className="about-hero-subtitle">
            รวมรายชื่อผู้ผ่านการอบรมและได้รับใบประกาศนียบัตรจริยธรรมปัญญาประดิษฐ์
          </p>
        </div>
      </section>

      <main className="about-main alu-main">
        {batches.length === 0 ? (
          <div className="about-card alu-state">
            <p>ยังไม่มีข้อมูลทำเนียบรุ่น</p>
          </div>
        ) : (
          <>
            <div className="alu-batch-tabs" role="tablist">
              {batches.map((batch) => (
                <button
                  key={batch.id}
                  role="tab"
                  aria-selected={batch.id === selectedId}
                  className={`alu-batch-tab ${batch.id === selectedId ? "active" : ""}`}
                  onClick={() => setSelectedId(batch.id)}
                >
                  {batch.name}
                </button>
              ))}
            </div>

            {selectedBatch && (
              <div className="about-card alu-card">
                <h2 className="alu-title">{selectedBatch.name}</h2>
                <div className="alu-meta">
                  <span>
                    <Award size={16} />
                    ผู้ผ่านการอบรม {alumni.length} คน
                  </span>
                </div>

                {alumni.length === 0 ? (
                  <p className="alu-empty">
                    ยังไม่มีผู้ได้รับใบประกาศฯ ในรุ่นนี้
                  </p>
                ) : (
                  <ol className="alu-list">
                    {alumni.map((person) => (
                      <li key={person.no}>
                        <span className="alu-no">{person.no}.</span>
                        <span className="alu-name">
                          {person.firstName} {person.lastName}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Alumni;
