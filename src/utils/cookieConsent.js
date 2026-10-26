// จัดการสถานะการยินยอมใช้คุกกี้ (PDPA) - เก็บไว้ใน localStorage ฝั่งผู้ใช้เอง
const STORAGE_KEY = "cookie_consent";

export function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setConsent({ analytics }) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        necessary: true,
        analytics: !!analytics,
        updatedAt: Date.now(),
      }),
    );
  } catch {
    // localStorage ใช้ไม่ได้ (เช่น private mode บางเบราว์เซอร์) - ปล่อยผ่าน ไม่ critical
  }
}
