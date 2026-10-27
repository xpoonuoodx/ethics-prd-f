import React, { useEffect, useRef } from "react";
import "./style/ThaiDateSelect.css";

const MONTHS = [
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

const ITEM_HEIGHT = 36;
const pad = (n) => String(n).padStart(2, "0");
const todayValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// วงล้อเลื่อนหนึ่งคอลัมน์ - เลื่อนแล้วหยุด (snap) ที่แถวกลาง แถวนั้นคือค่าที่เลือก
const Wheel = ({ items, value, onChange, className, label }) => {
  const ref = useRef(null);
  const timer = useRef(null);
  const index = Math.max(
    0,
    items.findIndex((it) => it.value === value),
  );

  // ค่าเปลี่ยนจากข้างนอก (เช่น เติมค่าเดิม) ให้เลื่อนวงล้อตาม
  useEffect(() => {
    const el = ref.current;
    if (el && Math.round(el.scrollTop / ITEM_HEIGHT) !== index) {
      el.scrollTop = index * ITEM_HEIGHT;
    }
  }, [index, items.length]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const i = Math.min(
        items.length - 1,
        Math.max(0, Math.round(el.scrollTop / ITEM_HEIGHT)),
      );
      if (items[i].value !== value) onChange(items[i].value);
    }, 80);
  };

  return (
    <div
      ref={ref}
      className={`tds-col ${className || ""}`}
      onScroll={handleScroll}
      role="listbox"
      aria-label={label}
    >
      {items.map((it, i) => (
        <div
          key={it.value}
          role="option"
          aria-selected={i === index}
          className={`tds-item ${i === index ? "selected" : ""}`}
          onClick={() => {
            if (ref.current) {
              ref.current.scrollTo({
                top: i * ITEM_HEIGHT,
                behavior: "smooth",
              });
            }
          }}
        >
          {it.label}
        </div>
      ))}
    </div>
  );
};

// เลือกวันที่แบบวงล้อ 3 คอลัมน์ (เดือน / วัน / ปี พ.ศ.) แบบ date picker บน iOS
// value/onChange เป็นสตริง "YYYY-MM-DD" (ค.ศ.) ถ้า value ว่างจะเริ่มที่วันนี้ ปีให้เลือกจากปีที่แล้วถึงอีก 5 ปีข้างหน้า
const ThaiDateSelect = ({ id, value, onChange }) => {
  const [y, m, d] = (value || todayValue()).split("-").map(Number);
  const thisYear = new Date().getFullYear();
  const yearFrom = Math.min(thisYear - 1, y);
  const yearTo = Math.max(thisYear + 5, y);

  const emit = (ny, nm, nd) => {
    const maxDay = new Date(ny, nm, 0).getDate();
    onChange(`${ny}-${pad(nm)}-${pad(Math.min(nd, maxDay))}`);
  };

  const monthItems = MONTHS.map((name, i) => ({ value: i + 1, label: name }));
  const dayItems = Array.from(
    { length: new Date(y, m, 0).getDate() },
    (_, i) => ({ value: i + 1, label: String(i + 1) }),
  );
  const yearItems = Array.from(
    { length: yearTo - yearFrom + 1 },
    (_, i) => ({ value: yearFrom + i, label: String(yearFrom + i + 543) }),
  );

  return (
    <div id={id} className="tds-wrap">
      <div className="tds-band" />
      <Wheel
        label="เดือน"
        className="tds-month"
        items={monthItems}
        value={m}
        onChange={(nm) => emit(y, nm, d)}
      />
      <Wheel
        label="วัน"
        items={dayItems}
        value={d}
        onChange={(nd) => emit(y, m, nd)}
      />
      <Wheel
        label="ปี"
        items={yearItems}
        value={y}
        onChange={(ny) => emit(ny, m, d)}
      />
    </div>
  );
};

export default ThaiDateSelect;
