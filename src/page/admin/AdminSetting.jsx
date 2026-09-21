import React, { useEffect, useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import { useThemedAlert } from "../../hooks/useThemedAlert";
import {
  FaCog,
  FaLock,
  FaUserShield,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaBan,
  FaCheckCircle,
} from "react-icons/fa";
import api, { getStoredUser } from "../../api/Api";
import "./style/AdminSetting.css";

const AdminSetting = () => {
  const { fire } = useThemedAlert();
  const currentUser = getStoredUser();

  const [loading, setLoading] = useState(true);

  // --- เปลี่ยนรหัสผ่าน ---
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // --- ตั้งค่าทั่วไป ---
  const [requireEmailVerification, setRequireEmailVerification] =
    useState(false);
  const [allowCrossTrackTesting, setAllowCrossTrackTesting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // --- จัดการบัญชีแอดมิน ---
  const [admins, setAdmins] = useState([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [addAdminForm, setAddAdminForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
  });
  const [savingAdmin, setSavingAdmin] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [settingsRes, adminsRes] = await Promise.all([
        api.get("/admin/settings"),
        api.get("/admin/list-admins"),
      ]);
      if (settingsRes.data?.success) {
        setRequireEmailVerification(
          !!settingsRes.data.data.require_email_verification,
        );
        setAllowCrossTrackTesting(
          !!settingsRes.data.data.allow_cross_track_testing,
        );
      }
      if (adminsRes.data?.success) {
        setAdmins(adminsRes.data.data);
      }
    } catch (error) {
      console.error("Fetch Admin Settings Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- เปลี่ยนรหัสผ่าน ----------
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      fire({
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่านให้ตรงกัน",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });
      return;
    }
    try {
      setSavingPassword(true);
      const response = await api.put("/admin/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (response.data?.success) {
        fire({
          title: "เปลี่ยนรหัสผ่านสำเร็จ",
          icon: "success",
          confirmButtonColor: "#3f6b21",
          timer: 2000,
          showConfirmButton: false,
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      fire({
        title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  // ---------- ตั้งค่าทั่วไป ----------
  const handleToggleVerification = async () => {
    const nextValue = !requireEmailVerification;
    try {
      setSavingSettings(true);
      await api.put("/admin/settings", {
        require_email_verification: nextValue,
      });
      setRequireEmailVerification(nextValue);
    } catch (error) {
      console.error("Update Settings Error:", error);
      fire({
        title: "บันทึกการตั้งค่าไม่สำเร็จ",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleCrossTrackTesting = async () => {
    const nextValue = !allowCrossTrackTesting;
    try {
      setSavingSettings(true);
      await api.put("/admin/settings", {
        allow_cross_track_testing: nextValue,
      });
      setAllowCrossTrackTesting(nextValue);
    } catch (error) {
      console.error("Update Settings Error:", error);
      fire({
        title: "บันทึกการตั้งค่าไม่สำเร็จ",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  // ---------- จัดการบัญชีแอดมิน ----------
  const handleAddAdminChange = (e) => {
    setAddAdminForm({ ...addAdminForm, [e.target.name]: e.target.value });
  };

  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingAdmin(true);
      const response = await api.post("/admin/add-admin", addAdminForm);
      if (response.data?.success) {
        fire({
          title: "เพิ่มบัญชีแอดมินสำเร็จ",
          icon: "success",
          confirmButtonColor: "#3f6b21",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowAddAdmin(false);
        setAddAdminForm({
          username: "",
          password: "",
          first_name: "",
          last_name: "",
          email: "",
        });
        fetchAll();
      }
    } catch (error) {
      fire({
        title: "เพิ่มบัญชีแอดมินไม่สำเร็จ",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSavingAdmin(false);
    }
  };

  const handleToggleAdminStatus = async (admin) => {
    const nextValue = !admin.is_active;
    fire({
      title: nextValue ? "เปิดการใช้งานบัญชีนี้?" : "ปิดการใช้งานบัญชีนี้?",
      text: `${admin.first_name_th || ""} ${admin.last_name_th || ""} (${admin.username})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextValue ? "#3f6b21" : "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: nextValue ? "เปิดการใช้งาน" : "ปิดการใช้งาน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.put(`/admin/toggle-admin/${admin.id}`, {
          is_active: nextValue,
        });
        setAdmins((prev) =>
          prev.map((a) =>
            a.id === admin.id ? { ...a, is_active: nextValue } : a,
          ),
        );
      } catch (error) {
        fire({
          title: "เปลี่ยนสถานะไม่สำเร็จ",
          text: error.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="as-layout">
        <SidebarAdmin />
        <div className="as-main-content as-flex-center">
          <FaSpinner className="as-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="as-layout">
      <SidebarAdmin />
      <div className="as-main-content">
        <div className="as-container">
          <h1 className="as-title">
            <span className="as-title-icon">
              <FaCog />
            </span>
            ตั้งค่าระบบ
          </h1>

          {/* เปลี่ยนรหัสผ่าน */}
          <div className="as-card">
            <div className="as-card-header">
              <FaLock className="as-card-header-icon" />
              <h2>เปลี่ยนรหัสผ่าน</h2>
            </div>
            <form className="as-form" onSubmit={handlePasswordSubmit}>
              <div className="as-form-row">
                <div className="as-form-group">
                  <label>รหัสผ่านเดิม</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="as-form-row as-col-2">
                <div className="as-form-group">
                  <label>รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="อย่างน้อย 8 ตัวอักษร ภาษาอังกฤษเท่านั้น"
                    required
                  />
                </div>
                <div className="as-form-group">
                  <label>ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="as-btn-primary"
                disabled={savingPassword}
              >
                {savingPassword ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
              </button>
            </form>
          </div>

          {/* ตั้งค่าทั่วไป */}
          <div className="as-card">
            <div className="as-card-header">
              <FaCog className="as-card-header-icon" />
              <h2>ตั้งค่าทั่วไป</h2>
            </div>
            <div className="as-toggle-row">
              <div>
                <p className="as-toggle-title">บังคับยืนยันอีเมลก่อนเข้าใช้งาน</p>
                <p className="as-toggle-desc">
                  ถ้าเปิดไว้ ผู้สมัครสมาชิกใหม่ต้องคลิกยืนยันในอีเมลก่อนถึงจะ login
                  เข้าระบบได้ (ปัจจุบันปิดอยู่เพื่อให้สมัครแล้วใช้งานได้ทันที)
                </p>
              </div>
              <button
                className={`as-switch ${requireEmailVerification ? "on" : ""}`}
                onClick={handleToggleVerification}
                disabled={savingSettings}
              >
                <span className="as-switch-knob"></span>
              </button>
            </div>
            <div className="as-toggle-row">
              <div>
                <p className="as-toggle-title">อนุญาตให้ทำแบบทดสอบข้ามหลักสูตร</p>
                <p className="as-toggle-desc">
                  ถ้าเปิดไว้ ผู้ใช้ทุกกลุ่ม (ผู้กำกับดูแล/นโยบาย, นักพัฒนา/นักวิจัย/ผู้ให้บริการ,
                  ทั่วไป) จะทำแบบทดสอบและรับใบเซอร์ของหลักสูตรอื่นนอกเหนือจากกลุ่มของตัวเองได้ด้วย
                  (ปัจจุบันปิดอยู่ = ทำได้เฉพาะหลักสูตรของกลุ่มตัวเองเหมือนเดิม)
                </p>
              </div>
              <button
                className={`as-switch ${allowCrossTrackTesting ? "on" : ""}`}
                onClick={handleToggleCrossTrackTesting}
                disabled={savingSettings}
              >
                <span className="as-switch-knob"></span>
              </button>
            </div>
          </div>

          {/* จัดการบัญชีแอดมิน */}
          <div className="as-card">
            <div className="as-card-header as-card-header-flex">
              <div className="as-card-header">
                <FaUserShield className="as-card-header-icon" />
                <h2>จัดการบัญชีแอดมิน</h2>
              </div>
              <button
                className="as-btn-add"
                onClick={() => setShowAddAdmin(true)}
              >
                <FaPlus /> เพิ่มแอดมินใหม่
              </button>
            </div>

            <div className="as-admin-list">
              {admins.map((admin) => {
                const isSelf = currentUser?.id === admin.id;
                return (
                  <div key={admin.id} className="as-admin-row">
                    <div className="as-admin-avatar">
                      {(admin.first_name_th || admin.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="as-admin-info">
                      <p className="as-admin-name">
                        {admin.first_name_th} {admin.last_name_th}
                        {isSelf && <span className="as-admin-you">(คุณ)</span>}
                      </p>
                      <p className="as-admin-meta">
                        @{admin.username} · {admin.email}
                      </p>
                    </div>
                    <span
                      className={`as-admin-status ${admin.is_active ? "active" : "inactive"}`}
                    >
                      {admin.is_active ? "ใช้งานอยู่" : "ถูกระงับ"}
                    </span>
                    {!isSelf && (
                      <button
                        className={`as-btn-toggle-admin ${admin.is_active ? "disable" : "enable"}`}
                        onClick={() => handleToggleAdminStatus(admin)}
                      >
                        {admin.is_active ? (
                          <>
                            <FaBan /> ปิดการใช้งาน
                          </>
                        ) : (
                          <>
                            <FaCheckCircle /> เปิดการใช้งาน
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal เพิ่มแอดมิน */}
      {showAddAdmin && (
        <div
          className="as-modal-overlay"
          onClick={() => setShowAddAdmin(false)}
        >
          <div className="as-modal" onClick={(e) => e.stopPropagation()}>
            <div className="as-modal-header">
              <h3>เพิ่มบัญชีแอดมินใหม่</h3>
              <button
                className="as-modal-close"
                onClick={() => setShowAddAdmin(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form className="as-form" onSubmit={handleAddAdminSubmit}>
              <div className="as-form-row as-col-2">
                <div className="as-form-group">
                  <label>ชื่อ</label>
                  <input
                    type="text"
                    name="first_name"
                    value={addAdminForm.first_name}
                    onChange={handleAddAdminChange}
                    required
                  />
                </div>
                <div className="as-form-group">
                  <label>นามสกุล</label>
                  <input
                    type="text"
                    name="last_name"
                    value={addAdminForm.last_name}
                    onChange={handleAddAdminChange}
                    required
                  />
                </div>
              </div>
              <div className="as-form-row as-col-2">
                <div className="as-form-group">
                  <label>ชื่อผู้ใช้งาน (Username)</label>
                  <input
                    type="text"
                    name="username"
                    value={addAdminForm.username}
                    onChange={handleAddAdminChange}
                    placeholder="ภาษาอังกฤษ ตัวเลข . _ - เท่านั้น"
                    required
                  />
                </div>
                <div className="as-form-group">
                  <label>รหัสผ่าน</label>
                  <input
                    type="password"
                    name="password"
                    value={addAdminForm.password}
                    onChange={handleAddAdminChange}
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    required
                  />
                </div>
              </div>
              <div className="as-form-row">
                <div className="as-form-group">
                  <label>อีเมล</label>
                  <input
                    type="email"
                    name="email"
                    value={addAdminForm.email}
                    onChange={handleAddAdminChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="as-btn-primary"
                disabled={savingAdmin}
              >
                {savingAdmin ? "กำลังบันทึก..." : "เพิ่มบัญชีแอดมิน"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSetting;
