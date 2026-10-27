import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import ThaiDateSelect from "./ThaiDateSelect";
import { formatThaiDate } from "../utils/thaiDate";

const pad = (n) => String(n).padStart(2, "0");
const todayValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// ช่องเลือกวันที่ - กดแล้วเปิด pop up วงล้อเลือกวันที่ กด "ตกลง" ถึงจะบันทึกค่า (กด "ยกเลิก" หรือพื้นหลังคือไม่เปลี่ยน)
// value/onChange เป็นสตริง "YYYY-MM-DD" (ค.ศ.) ว่าง = ยังไม่ได้เลือก
const ThaiDateField = ({ id, value, onChange, title = "เลือกวันที่" }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const openModal = () => {
    setDraft(value || todayValue());
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        id={id}
        onClick={openModal}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          background: "#fff",
          fontFamily: "inherit",
          fontSize: 15,
          color: value ? "#0f172a" : "#94a3b8",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>{value ? formatThaiDate(value) : "เลือกวันที่"}</span>
        <FaCalendarAlt style={{ color: "#64748b" }} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <h3 style={{ margin: "0 0 4px", fontSize: 18, color: "#0f172a" }}>
              {title}
            </h3>
            <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: 14 }}>
              {formatThaiDate(draft)}
            </p>
            <ThaiDateSelect value={draft} onChange={setDraft} />
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  padding: "9px 20px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(draft);
                  setOpen(false);
                }}
                style={{
                  padding: "9px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: "#0f172a",
                  color: "#fff",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThaiDateField;
