// แปลงวันที่ "YYYY-MM-DD" (ที่ backend ส่งมาตรง ๆ จากคอลัมน์ DATE) เป็นข้อความภาษาไทยปี พ.ศ.
// ไม่ผ่าน new Date() เพื่อกัน timezone เลื่อนวัน
const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const parse = (value) => {
  const [y, m, d] = String(value).slice(0, 10).split("-").map(Number);
  return { year: y + 543, month: m - 1, day: d };
};

export const formatThaiDate = (value) => {
  if (!value) return "-";
  const { year, month, day } = parse(value);
  return `${day} ${THAI_MONTHS[month]} ${year}`;
};

// ย่อช่วงวันที่ให้สั้นที่สุดเท่าที่ทำได้ เช่น "15-17 ตุลาคม 2569", "30 ตุลาคม - 2 พฤศจิกายน 2569"
export const formatThaiDateRange = (start, end) => {
  if (!start || !end) return "-";
  const s = parse(start);
  const e = parse(end);
  if (s.year === e.year && s.month === e.month) {
    return s.day === e.day
      ? `${s.day} ${THAI_MONTHS[s.month]} ${s.year}`
      : `${s.day}-${e.day} ${THAI_MONTHS[s.month]} ${s.year}`;
  }
  if (s.year === e.year) {
    return `${s.day} ${THAI_MONTHS[s.month]} - ${e.day} ${THAI_MONTHS[e.month]} ${s.year}`;
  }
  return `${formatThaiDate(start)} - ${formatThaiDate(end)}`;
};
