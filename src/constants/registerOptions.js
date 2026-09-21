// ตัวเลือกประเภทผู้ใช้งานตอนสมัครสมาชิก - แยกไว้ไฟล์นี้เพื่อให้ Register.jsx (ฟอร์มสมัครปกติ)
// และ LineRegisterComplete.jsx (ฟอร์มยืนยันข้อมูลตอนสมัครผ่าน LINE) ใช้ชุดเดียวกันได้ โดยไม่ต้อง
// import ข้ามกันเอง (import ข้ามกันจะเกิด circular import เพราะ Register.jsx เป็นคน render
// LineRegisterComplete ด้วย)
export const USER_TYPE_OPTIONS = [
  { value: "regulator", label: "Regulator (ผู้กำกับดูแล)" },
  { value: "policy", label: "Policy (ผู้วางนโยบาย)" },
  { value: "researcher", label: "Researcher (นักวิจัย)" },
  { value: "developer", label: "Developer (นักพัฒนา)" },
  { value: "service provider", label: "Service Provider (ผู้ให้บริการ)" },
  { value: "users", label: "Users (ผู้ใช้งานทั่วไป)" },
];
