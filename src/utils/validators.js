// อนุญาตเฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และ . _ - (ไม่มีภาษาไทย ไม่มีช่องว่าง)
export const USERNAME_PATTERN = /^[A-Za-z0-9._-]*$/;
export const sanitizeUsername = (value) =>
  value.replace(/[^A-Za-z0-9._-]/g, "");

// อนุญาตเฉพาะอักขระภาษาอังกฤษที่พิมพ์ได้ (ตัวอักษร ตัวเลข สัญลักษณ์ เว้นวรรค) ไม่มีภาษาไทย
export const PASSWORD_PATTERN = /^[\x20-\x7E]*$/;
export const sanitizePassword = (value) => value.replace(/[^\x20-\x7E]/g, "");

// เบอร์มือถือไทย: ตัวเลขล้วน ขึ้นต้นด้วย 0 (จำกัด 10 หลักตอนพิมพ์ ฝั่ง backend ยอมรับ 9-10 หลัก)
export const PHONE_PATTERN = /^0\d{0,9}$/;
export const sanitizePhone = (value) => value.replace(/[^0-9]/g, "").slice(0, 10);
