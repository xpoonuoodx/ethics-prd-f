// Google Analytics (GA4) - โหลดแบบมีเงื่อนไขเท่านั้น (ต้องได้รับ consent หมวดวิเคราะห์ก่อน ตาม PDPA)
const GA_MEASUREMENT_ID = import.meta.env.VITE_APP_GA_MEASUREMENT_ID;

// ไม่ track หน้าที่ต้อง login (เป็นเครื่องมือภายใน ไม่ใช่ส่วนที่นับ "ผู้เข้าชมเว็บไซต์")
const EXCLUDED_PREFIXES = ["/admin-", "/user-", "/regulator-"];

export function isTrackablePath(pathname) {
  return !EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function loadGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || window.gtag) {
    return;
  }

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  // send_page_view: false เพราะเป็น SPA - ยิง page_view เองตอน route เปลี่ยนแทน (ผ่าน trackPageView)
  // กันไม่ให้นับซ้ำซ้อนกับที่ gtag.js นับให้อัตโนมัติตอนโหลดสคริปต์ครั้งแรก
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageView(pathname) {
  if (!window.gtag || !isTrackablePath(pathname)) return;
  window.gtag("event", "page_view", {
    page_path: pathname,
    page_location: window.location.href,
  });
}

// GA4 เช็คธงนี้เองทุกครั้งก่อนส่งข้อมูล (official opt-out mechanism ของ gtag.js) -
// ใช้ตอน user เปลี่ยนใจถอน consent ทีหลัง โดยไม่ต้องโหลด/ลบสคริปต์ออกจากหน้าเว็บ
export function setAnalyticsEnabled(enabled) {
  if (!GA_MEASUREMENT_ID) return;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = !enabled;
}
