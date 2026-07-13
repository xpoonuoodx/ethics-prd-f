import React, { useState, useEffect } from "react";
import "./style/AdminCertificate.css";
import SidebarAdmin from "./SidebarAdmin";
import { FaAward, FaSearch, FaTrash, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api/Api";

const AdminCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/certificates");
      if (response.data && response.data.success) {
        setCertificates(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Certificates Error:", err);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, userName, groupNum) => {
    Swal.fire({
      title: "ยืนยันการเพิกถอนสิทธิ์?",
      text: `คุณต้องการลบประวัติใบประกาศนียบัตรของ "${userName}" (หลักสูตรกลุ่มที่ ${groupNum}) ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "เพิกถอน/ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/admin/certificates/delete/${id}`);
          if (response.data && response.data.success) {
            Swal.fire(
              "สำเร็จ!",
              "เพิกถอนประวัติใบประกาศนียบัตรเรียบร้อย",
              "success",
            );
            fetchCertificates();
          }
        } catch (err) {
          console.error("Delete Certificate Error:", err);
          Swal.fire("ผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        }
      }
    });
  };

  const filteredCertificates = certificates.filter(
    (c) =>
      (c.userName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.userEmail || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.orgName || "").toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="act-layout">
      <SidebarAdmin />

      <div className="act-main-content">
        <div className="act-container">
          <div className="act-header">
            <div className="act-header-title-wrap">
              <div className="act-header-icon">
                <FaAward />
              </div>
              <div>
                <h1 className="act-title">จัดการประวัติใบประกาศนียบัตร</h1>
                <p className="act-subtitle">
                  ตรวจสอบรายชื่อผู้ใช้งานที่เรียนและทำแบบทดสอบผ่านเกณฑ์ครบถ้วนแยกตามหลักสูตร
                </p>
              </div>
            </div>
          </div>

          <div className="act-toolbar">
            <div className="act-search-box">
              <FaSearch className="act-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้ใช้, อีเมล หรือหน่วยงาน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="act-table-wrapper">
            {loading ? (
              <div className="act-state-container">
                <FaSpinner className="act-spin" />
                <p>กำลังโหลดรายชื่อผู้ได้รับใบประกาศนียบัตร...</p>
              </div>
            ) : (
              <table className="act-card-table">
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>ชื่อ-นามสกุล / อีเมล</th>
                    <th style={{ width: "25%" }}>หน่วยงาน / องค์กร</th>
                    <th style={{ width: "20%" }}>หลักสูตรที่ได้รับ</th>
                    <th style={{ width: "20%" }}>วันที่ได้รับสิทธิ์</th>
                    {/* <th className="act-text-center" style={{ width: "10%" }}>
                      จัดการ
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.certId}>
                      <td>
                        <div className="act-user-name">{cert.userName}</div>
                        <div className="act-user-email">{cert.userEmail}</div>
                      </td>
                      <td className="act-font-medium">{cert.orgName || "-"}</td>
                      <td>
                        <span className="act-course-badge">
                          หลักสูตรกลุ่มที่ {cert.courseGroup}
                        </span>
                      </td>
                      <td className="act-text-muted">
                        {formatDate(cert.issuedAt)}
                      </td>
                      {/* <td>
                        <div className="act-actions">
                          <button
                            className="act-btn-action delete"
                            title="เพิกถอนสิทธิ์ใบประกาศฯ"
                            onClick={() =>
                              handleDelete(
                                cert.certId,
                                cert.userName,
                                cert.courseGroup,
                              )
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}

                  {filteredCertificates.length === 0 && (
                    <tr>
                      <td colSpan="5" className="act-empty-state">
                        ไม่พบข้อมูลรายชื่อผู้ได้รับใบประกาศนียบัตรในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCertificate;
