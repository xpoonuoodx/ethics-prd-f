// อนุญาตเฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข และ . _ - (ไม่มีภาษาไทย ไม่มีช่องว่าง)
export const USERNAME_PATTERN = /^[A-Za-z0-9._-]*$/;
export const sanitizeUsername = (value) =>
  value.replace(/[^A-Za-z0-9._-]/g, "");

// อนุญาตเฉพาะอักขระภาษาอังกฤษที่พิมพ์ได้ (ตัวอักษร ตัวเลข สัญลักษณ์ เว้นวรรค) ไม่มีภาษาไทย
export const PASSWORD_PATTERN = /^[\x20-\x7E]*$/;
export const sanitizePassword = (value) => value.replace(/[^\x20-\x7E]/g, "");
