import api from "../api/Api";

const VISITOR_KEY = "ai-ethic-visitor-id";
const SESSION_KEY = "ai-ethic-home-visit-counted";
export const VISIT_RECORDED_EVENT = "ai-ethic-visit-recorded";

// รหัสผู้เข้าชม (สุ่มสร้างเองในเบราว์เซอร์ ไม่ผูกกับบัญชีผู้ใช้) ใช้นับผู้เข้าชมไม่ซ้ำ
const getVisitorId = () => {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};

// นับการเข้าหน้าโฮม 1 ครั้งต่อ session ของเบราว์เซอร์ (รีเฟรช/กลับมาหน้าโฮมซ้ำใน session เดิมไม่นับเพิ่ม)
// ถ้าเบราว์เซอร์บล็อก storage หรือเรียก API ไม่สำเร็จ จะข้ามไปเงียบ ๆ ไม่กระทบการใช้งานหน้าเว็บ
export const trackHomeVisit = async () => {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    await api.post("/public/visit", { visitorId: getVisitorId() });
    window.dispatchEvent(new Event(VISIT_RECORDED_EVENT));
  } catch (err) {
    console.warn("Track visit failed:", err);
  }
};
