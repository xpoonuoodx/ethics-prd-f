// Helper ที่ใช้ร่วมกันระหว่างหน้าภาพรวมโครงการกับหน้ารายละเอียดโครงการฝั่ง Admin

// สีไอคอนวนตามชื่อหน่วยงาน ให้แต่ละการ์ด/แบนเนอร์ดูแยกจากกันง่าย
const AVATAR_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export const getAvatarColor = (name) => {
  const str = name || "?";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// เวลาแบบสัมพัทธ์ ("3 วันที่แล้ว")
export const timeAgoTh = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  if (diffYear > 0) return `${diffYear} ปีที่แล้ว`;
  if (diffMonth > 0) return `${diffMonth} เดือนที่แล้ว`;
  if (diffDay > 0) return `${diffDay} วันที่แล้ว`;
  if (diffHour > 0) return `${diffHour} ชม.ที่แล้ว`;
  if (diffMin > 0) return `${diffMin} นาทีที่แล้ว`;
  return "เมื่อสักครู่";
};
