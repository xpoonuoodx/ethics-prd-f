import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { formatThaiDate } from "../utils/thaiDate";
import "./style/ThaiDatePicker.css";

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
const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const POPOVER_WIDTH = 288;
const POPOVER_HEIGHT = 340;

const pad = (n) => String(n).padStart(2, "0");
const toValue = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parseValue = (value) => {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return { y, m: m - 1, d };
};
const todayValue = () => {
  const now = new Date();
  return toValue(now.getFullYear(), now.getMonth(), now.getDate());
};

// ปฏิทินเลือกวันที่ภาษาไทย (แสดงปี พ.ศ.) - value/onChange เป็นสตริง "YYYY-MM-DD" (ค.ศ.) เหมือน
// <input type="date"> เลยเอาไปแทนกันได้ ไม่ต้องแก้ส่วนที่ส่งให้ backend - ไม่ใช้ native date input
// เพราะหน้าตา/ภาษา/รูปแบบวันที่ขึ้นกับ browser และ OS ของผู้ใช้ ทำให้ไม่เป็นไทยและกดปฏิทินไม่ชัดเจน
// min = วันที่เร็วที่สุดที่เลือกได้ (YYYY-MM-DD) ส่วน align="right" ให้ปฏิทินชิดขอบขวาของช่อง
const ThaiDatePicker = ({
  id,
  value,
  onChange,
  min,
  placeholder = "เลือกวันที่",
  align = "left",
}) => {
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [view, setView] = useState(() => {
    const base = parseValue(value) || parseValue(min) || parseValue(todayValue());
    return { y: base.y, m: base.m };
  });

  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // ชิดซ้ายหรือขวาของช่อง แล้วกันไม่ให้ล้นขอบจอ / เปิดขึ้นด้านบนถ้าด้านล่างไม่พอ
    let left = align === "right" ? rect.right - POPOVER_WIDTH : rect.left;
    left = Math.min(left, window.innerWidth - POPOVER_WIDTH - 8);
    left = Math.max(left, 8);
    let top = rect.bottom + 6;
    if (top + POPOVER_HEIGHT > window.innerHeight && rect.top - POPOVER_HEIGHT - 6 > 0) {
      top = rect.top - POPOVER_HEIGHT - 6;
    }
    setPosition({ top, left });
  }, [align]);

  const openPicker = () => {
    const base = parseValue(value) || parseValue(min) || parseValue(todayValue());
    setView({ y: base.y, m: base.m });
    place();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (e) => {
      if (
        popoverRef.current?.contains(e.target) ||
        triggerRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    // ปฏิทินเป็น position: fixed - ถ้าหน้า/กล่องข้างใต้เลื่อนหรือจอเปลี่ยนขนาด ตำแหน่งจะเพี้ยน เลยปิดไปเลย
    const handleClose = () => setOpen(false);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("resize", handleClose);
    window.addEventListener("scroll", handleClose, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, [open]);

  const shiftMonth = (delta) => {
    setView((prev) => {
      const total = prev.y * 12 + prev.m + delta;
      return { y: Math.floor(total / 12), m: total % 12 };
    });
  };

  const selectDay = (day) => {
    onChange(toValue(view.y, view.m, day));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const today = todayValue();

  return (
    <div className="tdp-wrap">
      <button
        type="button"
        id={id}
        ref={triggerRef}
        className={`tdp-trigger ${value ? "" : "placeholder"}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
      >
        <span>{value ? formatThaiDate(value) : placeholder}</span>
        <FaCalendarAlt className="tdp-trigger-icon" />
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="tdp-popover"
          role="dialog"
          aria-label="เลือกวันที่"
          style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
        >
          <div className="tdp-header">
            <button
              type="button"
              className="tdp-nav"
              aria-label="เดือนก่อนหน้า"
              onClick={() => shiftMonth(-1)}
            >
              <FaChevronLeft />
            </button>
            <div className="tdp-month">
              {MONTHS[view.m]} {view.y + 543}
            </div>
            <button
              type="button"
              className="tdp-nav"
              aria-label="เดือนถัดไป"
              onClick={() => shiftMonth(1)}
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="tdp-grid">
            {WEEKDAYS.map((w) => (
              <div key={w} className="tdp-weekday">
                {w}
              </div>
            ))}
            {cells.map((day, index) => {
              if (day === null) return <div key={`blank-${index}`} />;
              const dayValue = toValue(view.y, view.m, day);
              const disabled = Boolean(min) && dayValue < min;
              const classes = ["tdp-day"];
              if (dayValue === value) classes.push("selected");
              if (dayValue === today) classes.push("today");
              return (
                <button
                  key={day}
                  type="button"
                  className={classes.join(" ")}
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="tdp-footer">
            <button
              type="button"
              className="tdp-link"
              disabled={Boolean(min) && today < min}
              onClick={() => {
                onChange(today);
                setOpen(false);
              }}
            >
              วันนี้
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThaiDatePicker;
