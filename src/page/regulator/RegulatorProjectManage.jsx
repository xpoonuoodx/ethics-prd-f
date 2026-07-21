import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import "./style/RegulatorProjectManage.css";
import SidebarRegulator from "./SidebarRegulator";
import {
  FaPlus,
  FaSearch,
  FaUserPlus,
  FaTrash,
  FaProjectDiagram,
  FaTimes,
  FaSpinner,
  FaEye, // เพิ่มไอคอนดวงตา
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api/Api";

const RegulatorProjectManage = () => {
  const navigate = useNavigate(); // เรียกใช้ navigate
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [orgUsers, setOrgUsers] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    project_code: "",
    project_name: "",
  });

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects();
    fetchOrgUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/regulator/get-projects");
      if (response.data && response.data.success) {
        setProjects(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Projects Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgUsers = async () => {
    try {
      const response = await api.get("/regulator/get-users");
      if (response.data && response.data.success) {
        setOrgUsers(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
    }
  };

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectForm.project_code || !projectForm.project_name) return;

    try {
      setIsSubmitting(true);
      const response = await api.post("/regulator/add-project", projectForm);
      if (response.data && response.data.success) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "สร้างโครงการใหม่เรียบร้อยแล้ว",
          confirmButtonColor: "#10b981",
        });
        setIsProjectModalOpen(false);
        setProjectForm({ project_code: "", project_name: "" });
        fetchProjects();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถสร้างโครงการได้",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssignModal = (projectId) => {
    setSelectedProjectId(projectId);
    setSelectedUserId("");
    setIsAssignModalOpen(true);
  };

  const handleAssignUser = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      setIsSubmitting(true);
      const response = await api.post("/regulator/assign-user", {
        project_id: selectedProjectId,
        user_id: selectedUserId,
      });

      if (response.data && response.data.success) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "เพิ่มบุคลากรเข้าโครงการเรียบร้อยแล้ว",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsAssignModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถเพิ่มบุคลากรได้",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบโครงการ "${name}" หรือไม่? ข้อมูลที่เกี่ยวข้องจะหายไปทั้งหมด`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบโครงการ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/regulator/delete-project/${id}`);
          if (response.data && response.data.success) {
            setProjects(projects.filter((p) => p.id !== id));
            Swal.fire({
              title: "ลบสำเร็จ!",
              text: "โครงการถูกนำออกจากระบบแล้ว",
              icon: "success",
              confirmButtonColor: "#10b981",
            });
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบโครงการได้",
            confirmButtonColor: "#0f172a",
          });
        }
      }
    });
  };

  // สถานะโครงการคำนวณอัตโนมัติจากจำนวนสมาชิกที่ทำแบบประเมินตนเองแล้ว
  const getStatusMeta = (status) => {
    if (status === "Completed")
      return { label: "เสร็จสิ้น", className: "completed" };
    if (status === "In Progress")
      return { label: "กำลังดำเนินการ", className: "in-progress" };
    return { label: "รอดำเนินการ", className: "pending" };
  };

  const filteredProjects = projects.filter(
    (p) =>
      (p.project_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.project_code || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="rpm-layout">
      <SidebarRegulator />
      <div className="rpm-main-content">
        <div className="rpm-container">
          <div className="rpm-header">
            <div className="rpm-header-title-wrap">
              <div className="rpm-header-icon">
                <FaProjectDiagram />
              </div>
              <div>
                <h1 className="rpm-title">จัดการโครงการ</h1>
                <p className="rpm-subtitle">
                  สร้างและติดตามความคืบหน้าโครงการทั้งหมดในหน่วยงานของคุณ
                </p>
              </div>
            </div>
            <button
              className="rpm-btn-primary"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <FaPlus /> สร้างโครงการใหม่
            </button>
          </div>

          <div className="rpm-toolbar">
            <div className="rpm-search-box">
              <FaSearch className="rpm-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือรหัสโครงการ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rpm-table-wrapper">
            {loading ? (
              <div className="rpm-state-container">
                <FaSpinner className="rpm-spin" />
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <table className="rpm-card-table">
                <thead>
                  <tr>
                    <th>รหัสโครงการ</th>
                    <th>ชื่อโครงการ</th>
                    <th>วันที่บันทึก</th>
                    <th className="rpm-text-center">จำนวนผู้รับผิดชอบ</th>
                    <th>สถานะ</th>
                    <th className="rpm-text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id}>
                      <td className="rpm-text-muted">{proj.project_code}</td>
                      <td className="rpm-font-bold">{proj.project_name}</td>
                      <td className="rpm-text-muted">
                        {new Date(proj.created_at).toLocaleDateString("th-TH")}
                      </td>
                      <td className="rpm-text-center">
                        <span className="rpm-member-badge">
                          {proj.total_members || 0} คน
                        </span>
                      </td>
                      <td>
                        <span
                          className={`rpm-status-badge ${getStatusMeta(proj.status).className}`}
                        >
                          {getStatusMeta(proj.status).label}
                        </span>
                        <div className="rpm-status-fraction">
                          {proj.completed_members || 0}/
                          {proj.total_members || 0} คนประเมินแล้ว
                        </div>
                      </td>
                      <td>
                        <div className="rpm-actions">
                          {/* ปุ่มดูรายละเอียดโครงการ */}
                          <button
                            className="rpm-btn-action view"
                            title="ดูรายละเอียดโครงการ"
                            onClick={() =>
                              navigate(`/regulator-view-project/${proj.id}`)
                            }
                          >
                            <FaEye />
                          </button>
                          {/* ปุ่มเพิ่มคนเข้าโครงการ */}
                          <button
                            className="rpm-btn-action assign"
                            title="เพิ่มบุคลากรเข้าโครงการ"
                            onClick={() => openAssignModal(proj.id)}
                          >
                            <FaUserPlus />
                          </button>
                          {/* ปุ่มลบโครงการ */}
                          <button
                            className="rpm-btn-action delete"
                            title="ลบโครงการ"
                            onClick={() =>
                              handleDelete(proj.id, proj.project_name)
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan="6" className="rpm-empty-state">
                        ไม่พบข้อมูลโครงการในหน่วยงาน
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: สร้างโครงการใหม่ */}
      {isProjectModalOpen && (
        <div className="rpm-modal-overlay">
          <div className="rpm-modal-container">
            <div className="rpm-modal-header">
              <h2>สร้างโครงการใหม่</h2>
              <button
                className="rpm-modal-close"
                onClick={() => setIsProjectModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="rpm-modal-body">
              <div className="rpm-form-group">
                <label>รหัสโครงการ</label>
                <input
                  type="text"
                  name="project_code"
                  placeholder="เช่น PRJ-2026-001"
                  value={projectForm.project_code}
                  onChange={handleProjectInputChange}
                  required
                />
              </div>
              <div className="rpm-form-group">
                <label>ชื่อโครงการ (AI System Name)</label>
                <input
                  type="text"
                  name="project_name"
                  placeholder="ระบุชื่อระบบ AI"
                  value={projectForm.project_name}
                  onChange={handleProjectInputChange}
                  required
                />
              </div>
              <div className="rpm-modal-footer">
                <button
                  type="button"
                  className="rpm-btn-cancel"
                  onClick={() => setIsProjectModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rpm-btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังสร้าง..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: เพิ่มคนเข้าโครงการ */}
      {isAssignModalOpen && (
        <div className="rpm-modal-overlay">
          <div className="rpm-modal-container">
            <div className="rpm-modal-header">
              <h2>เพิ่มบุคลากรรับผิดชอบ</h2>
              <button
                className="rpm-modal-close"
                onClick={() => setIsAssignModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAssignUser} className="rpm-modal-body">
              <div className="rpm-form-group">
                <label>เลือกบุคลากรจากหน่วยงานของคุณ</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    -- เลือกรายชื่อบุคลากร --
                  </option>
                  {orgUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} (@{user.username})
                    </option>
                  ))}
                </select>
              </div>
              <div className="rpm-modal-footer">
                <button
                  type="button"
                  className="rpm-btn-cancel"
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rpm-btn-submit"
                  disabled={isSubmitting || orgUsers.length === 0}
                >
                  {isSubmitting ? "กำลังเพิ่ม..." : "เพิ่มเข้าโครงการ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatorProjectManage;
