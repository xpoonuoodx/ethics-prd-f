import React, { useEffect, useState } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import { Users, CalendarDays, Award } from "lucide-react";
import api from "../api/Api";
import { formatThaiDateRange } from "../utils/thaiDate";
import "./style/About.css";
import "./style/Alumni.css";

// หน้า "ทำเนียบรุ่น" (Public) - แสดงรายชื่อผู้ได้รับใบประกาศฯ แยกตามรุ่น (แอดมินกำหนดชื่อรุ่น/ช่วงวันที่
// ที่ /admin-alumni) ชื่อ-นามสกุลถูกปิดบังบางส่วนจาก backend แล้ว (เช่น "สม*** ใจ***")
function Alumni() {
  const [batches, setBatches] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [alumniByBatch, setAlumniByBatch] = useState({});
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingAlumni, setLoadingAlumni] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBatches = async () => {
      try {
        const res = await api.get("/public/alumni");
        const data = res.data?.data || [];
        setBatches(data);
        // เปิดรุ่นล่าสุด (backend เรียงใหม่สุดก่อน) เป็นค่าเริ่มต้น
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (err) {
        console.error("Fetch Alumni Batches Error:", err);
        setError("ไม่สามารถโหลดข้อมูลทำเนียบรุ่นได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoadingBatches(false);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedId === null || alumniByBatch[selectedId]) return;
    let cancelled = false;
    const fetchAlumni = async () => {
      try {
        setLoadingAlumni(true);
        setError("");
        const res = await api.get(`/public/alumni/${selectedId}`);
        if (!cancelled) {
          setAlumniByBatch((prev) => ({
            ...prev,
            [selectedId]: res.data?.data?.alumni || [],
          }));
        }
      } catch (err) {
        console.error("Fetch Batch Alumni Error:", err);
        if (!cancelled) setError("ไม่สามารถโหลดรายชื่อผู้จบของรุ่นนี้ได้");
      } finally {
        if (!cancelled) setLoadingAlumni(false);
      }
    };
    fetchAlumni();
    return () => {
      cancelled = true;
    };
  }, [selectedId, alumniByBatch]);

  const selectedBatch = batches.find((b) => b.id === selectedId);
  const alumni = alumniByBatch[selectedId] || [];

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
        {loadingBatches ? (
          <div className="about-card alu-state">กำลังโหลดข้อมูล...</div>
        ) : error && batches.length === 0 ? (
          <div className="about-card alu-state">{error}</div>
        ) : batches.length === 0 ? (
          <div className="about-card alu-state">
            <Users size={32} strokeWidth={1.5} />
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
                    <CalendarDays size={16} />
                    {formatThaiDateRange(
                      selectedBatch.startDate,
                      selectedBatch.endDate,
                    )}
                  </span>
                  <span>
                    <Award size={16} />
                    ผู้ได้รับใบประกาศฯ {selectedBatch.alumniCount} คน
                  </span>
                </div>
                {selectedBatch.description && (
                  <p className="alu-desc">{selectedBatch.description}</p>
                )}

                {error ? (
                  <p className="alu-error">{error}</p>
                ) : loadingAlumni && !alumniByBatch[selectedId] ? (
                  <p className="alu-empty">กำลังโหลดรายชื่อ...</p>
                ) : alumni.length === 0 ? (
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
