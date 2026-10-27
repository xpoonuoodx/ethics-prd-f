import React, { useEffect, useState } from "react";
import SidebarUser from "./SidebarUser";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import {
  FaChalkboardTeacher,
  FaCertificate,
  FaCheckCircle,
  FaEdit,
  FaExternalLinkAlt,
  FaRegCircle,
  FaSpinner,
} from "react-icons/fa";
import ThaiDateField from "../../component/ThaiDateField";
import { formatThaiDate } from "../../utils/thaiDate";
import api from "../../api/Api";
import "./style/UserCertificate.css";

const MAX_SUBMISSIONS = 2;

const labelStyle = { display: "block", fontWeight: 600, marginBottom: 6 };
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  fontFamily: "inherit",
  boxSizing: "border-box",
};
const primaryBtn = {
  background: "#0f172a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "10px 24px",
  fontFamily: "inherit",
  fontWeight: 600,
  cursor: "pointer",
};
const ghostBtn = {
  ...primaryBtn,
  background: "#fff",
  color: "#0f172a",
  border: "1px solid #e2e8f0",
};

const UserOnsite = () => {
  const { fire } = useThemedAlert();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [certIssued, setCertIssued] = useState(false); // ส่งครบทุกวันแล้ว ระบบออกใบประกาศฯ ให้แล้ว

  // ฟอร์มส่งใหม่
  const [trainingDate, setTrainingDate] = useState("");
  const [url, setUrl] = useState("");

  // pop up แก้ไขรายการที่ส่งไปแล้ว
  const [editing, setEditing] = useState(null); // { id, training_date, url }

  const fetchSubmissions = async () => {
    try {
      const res = await api.get("/user/onsite");
      if (res.data?.success) {
        setSubmissions(res.data.data);
        setCertIssued(Boolean(res.data.certIssued));
      }
    } catch (error) {
      console.error("Fetch Onsite Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSubmissions();
  }, []);

  const showError = (error, title) =>
    fire({
      title,
      text:
        error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      icon: "error",
      confirmButtonColor: "#ef4444",
    });

  const showSuccess = (title) =>
    fire({
      title,
      icon: "success",
      confirmButtonColor: "#3f6b21",
      timer: 2000,
      showConfirmButton: false,
    });

  const isFull = submissions.length >= MAX_SUBMISSIONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trainingDate) {
      fire({
        title: "กรุณาเลือกวันที่อบรม",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }
    try {
      setSaving(true);
      await api.post("/user/onsite", { training_date: trainingDate, url });
      setTrainingDate("");
      setUrl("");
      await fetchSubmissions();
      showSuccess("บันทึกสำเร็จ");
    } catch (error) {
      showError(error, "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/user/onsite/${editing.id}`, {
        training_date: editing.training_date,
        url: editing.url,
      });
      setEditing(null);
      await fetchSubmissions();
      showSuccess("แก้ไขสำเร็จ");
    } catch (error) {
      showError(error, "แก้ไขไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="ucert-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="ures-admin-container">
          <div className="ucert-header">
            <h1 className="ucert-title">กิจกรรมฝึกอบรมหลักสูตรจริยธรรมปัญญาประดิษฐ์ในภาคปฏิบัติ (Workshop)</h1>
            <p className="ucert-subtitle">
              เลือกวันที่อบรม กรอกลิงก์ แล้วกดบันทึก (ส่งได้ไม่เกิน{" "}
              {MAX_SUBMISSIONS} วัน)
            </p>
          </div>

          {/* ฟอร์มส่งใหม่ */}
          <div className="ucert-card" style={{ marginBottom: 24 }}>
            <div className="ucert-card-header">
              <h3>
                <FaChalkboardTeacher /> ส่งลิงก์วันอบรม
              </h3>
            </div>
            <div className="ucert-card-body">
              {isFull ? (
                <p className="ucert-meta" style={{ margin: 0 }}>
                  ส่งครบ {MAX_SUBMISSIONS} วันแล้ว
                  หากต้องการแก้ไขให้กด "แก้ไข" ที่วันนั้นในรายการด้านล่าง
                </p>
              ) : null}
              {isFull && certIssued && (
                <a
                  href="/user-certificate"
                  style={{
                    ...primaryBtn,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 14,
                    textDecoration: "none",
                  }}
                >
                  <FaCertificate /> ไปที่หน้าใบประกาศนียบัตร
                </a>
              )}
              {!isFull && (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 16 }}>
                    <label htmlFor="onsite-date" style={labelStyle}>
                      วันที่อบรม
                    </label>
                    <ThaiDateField
                      id="onsite-date"
                      title="เลือกวันที่อบรม"
                      value={trainingDate}
                      onChange={setTrainingDate}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label htmlFor="onsite-url" style={labelStyle}>
                      ลิงก์
                    </label>
                    <input
                      id="onsite-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                      required
                      style={inputStyle}
                    />
                  </div>
                  <button type="submit" disabled={saving} style={primaryBtn}>
                    {saving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* สถานะการส่ง */}
          <div className="ucert-card">
            <div className="ucert-card-header">
              <h3>
                สถานะการส่ง ({submissions.length}/{MAX_SUBMISSIONS})
              </h3>
            </div>
            <div className="ucert-card-body">
              <div className="ucert-grid">
                {Array.from({ length: MAX_SUBMISSIONS }, (_, i) => {
                  const item = submissions[i];
                  return (
                    <div className="ucert-item-card" key={i}>
                      <div
                        className="ucert-item-icon"
                        style={{ color: item ? "#16a34a" : "#94a3b8" }}
                      >
                        {item ? <FaCheckCircle /> : <FaRegCircle />}
                      </div>
                      <div className="ucert-item-details">
                        {item ? (
                          <>
                            <h4 className="ucert-course-title">
                              {formatThaiDate(item.training_date)}
                            </h4>
                            <p
                              className="ucert-meta"
                              style={{ color: "#16a34a", fontWeight: 600 }}
                            >
                              ส่งแล้ว
                            </p>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ucert-meta"
                            >
                              เปิดลิงก์ <FaExternalLinkAlt size={12} />
                            </a>
                            <div style={{ marginTop: 8 }}>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditing({
                                    id: item.id,
                                    training_date: item.training_date,
                                    url: item.url,
                                  })
                                }
                                style={{
                                  ...ghostBtn,
                                  padding: "5px 14px",
                                  fontSize: 13,
                                }}
                              >
                                <FaEdit /> แก้ไข
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h4 className="ucert-course-title">
                              วันที่ {i + 1}
                            </h4>
                            <p className="ucert-meta">ยังไม่ส่ง</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* pop up แก้ไข */}
      {editing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="แก้ไขวันอบรม"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1500,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <form
            onSubmit={handleEditSave}
            style={{
              width: "100%",
              maxWidth: 420,
              background: "#fff",
              borderRadius: 20,
              padding: 22,
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            <h3 style={{ margin: "0 0 16px", color: "#0f172a" }}>
              แก้ไขวันอบรม
            </h3>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="edit-date" style={labelStyle}>
                วันที่อบรม
              </label>
              <ThaiDateField
                id="edit-date"
                title="เลือกวันที่อบรม"
                value={editing.training_date}
                onChange={(v) => setEditing({ ...editing, training_date: v })}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="edit-url" style={labelStyle}>
                ลิงก์
              </label>
              <input
                id="edit-url"
                type="url"
                value={editing.url}
                onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                placeholder="https://..."
                required
                style={inputStyle}
              />
            </div>
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                type="button"
                onClick={() => setEditing(null)}
                style={ghostBtn}
              >
                ยกเลิก
              </button>
              <button type="submit" disabled={saving} style={primaryBtn}>
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserOnsite;
