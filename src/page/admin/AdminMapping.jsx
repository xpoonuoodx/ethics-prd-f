import React, { useState, useEffect } from "react";
import "./style/AdminMapping.css";
import SidebarAdmin from "./SidebarAdmin";
import { FaProjectDiagram, FaSave, FaSpinner, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api/Api";

const AdminMapping = () => {
  const [selectedRole, setSelectedRole] = useState("regulator"); // ค่าเริ่มต้นตั้งเป็น regulator

  const [principles, setPrinciples] = useState([]);
  const [components, setComponents] = useState([]);

  // เก็บ State ว่าคู่ไหนโดนติ๊กบ้าง (Key เป็น 'componentId_principleId', Value เป็น boolean)
  const [checkedMap, setCheckedMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMappingData(selectedRole);
  }, [selectedRole]);

  const fetchMappingData = async (role) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/get-mapping-matrix?role=${role}`);

      if (response.data && response.data.success) {
        const {
          principles: p,
          components: c,
          mappings: m,
        } = response.data.data;

        setPrinciples(p);
        setComponents(c);

        // นำข้อมูล mappings (จาก DB) มาแปลงเป็น object ให้เช็คง่ายๆ
        const newCheckedMap = {};
        m.forEach((mapping) => {
          newCheckedMap[`${mapping.component_id}_${mapping.principle_id}`] =
            true;
        });
        setCheckedMap(newCheckedMap);
      }
    } catch (err) {
      console.error("Fetch Mapping Error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลผังการประเมินได้",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // เมื่อแอดมินติ๊ก/เอาติ๊กออก
  const handleCheckboxChange = (compId, prinId) => {
    const key = `${compId}_${prinId}`;
    setCheckedMap((prev) => ({
      ...prev,
      [key]: !prev[key], // สลับค่า true / false
    }));
  };

  const handleSave = async () => {
    // แปลง checkedMap กลับไปเป็น Array [{component_id, principle_id}] เพื่อส่งให้ Backend
    const mappingsToSave = [];
    Object.keys(checkedMap).forEach((key) => {
      if (checkedMap[key] === true) {
        const [compId, prinId] = key.split("_");

        // เช็คก่อนว่า compId นี้ อยู่ในตารางปัจจุบันที่กำลังแสดงหรือไม่
        // (เพื่อป้องกันการไปล้างข้อมูลของ Role อื่น ที่ไม่ได้แสดงบนหน้าจอ)
        const isCompInCurrentView = components.some((c) => c.id === compId);

        if (isCompInCurrentView) {
          mappingsToSave.push({ component_id: compId, principle_id: prinId });
        }
      }
    });

    try {
      setIsSaving(true);
      const response = await api.post("/admin/save-mapping-matrix", {
        role: selectedRole,
        mappings: mappingsToSave,
      });

      if (response.data && response.data.success) {
        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          text: "อัปเดตผังความสัมพันธ์เรียบร้อยแล้ว",
          confirmButtonColor: "#10b981",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Save Mapping Error:", err);
      Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="amap-layout">
      <SidebarAdmin />

      <div className="amap-main-content">
        <div className="amap-container">
          <div className="amap-header">
            <div className="amap-header-title-wrap">
              <div className="amap-header-icon">
                <FaProjectDiagram />
              </div>
              <div>
                <h1 className="amap-title">
                  ผังโครงสร้างการประเมิน (Mapping Matrix)
                </h1>
                <p className="amap-subtitle">
                  จับคู่หัวข้อการประเมิน (Components) เข้ากับ หลักการจริยธรรม
                  (Principles)
                </p>
              </div>
            </div>
          </div>

          {/* ส่วนตัวเลือกตัวกรอง และ ปุ่ม Save */}
          <div className="amap-toolbar">
            <div className="amap-filter-group">
              <label>เลือกประเภทผู้ใช้งานเป้าหมาย:</label>
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="amap-role-select"
              >
                <option value="regulator">Regulator (ผู้กำกับดูแล)</option>
                <option value="policy">Policy (ผู้วางนโยบาย)</option>
                <option value="researcher">Researcher (นักวิจัย)</option>
                <option value="developer">Developer (นักพัฒนา)</option>
                <option value="service provider">Service Provider (ผู้ให้บริการ)</option>
                <option value="users">Users (ผู้ใช้งานทั่วไป)</option>
              </select>
            </div>

            <button
              className="amap-btn-save"
              onClick={handleSave}
              disabled={isSaving || loading}
            >
              {isSaving ? <FaSpinner className="amap-spin" /> : <FaSave />}
              {isSaving ? "กำลังบันทึก..." : "บันทึกผังการประเมิน"}
            </button>
          </div>

          <div className="amap-card">
            {loading ? (
              <div className="amap-state-container">
                <FaSpinner className="amap-spin-large" />
                <p>กำลังโหลดตาราง Matrix...</p>
              </div>
            ) : components.length === 0 ? (
              <div className="amap-empty-state">
                ยังไม่มีการสร้างข้อมูล Components สำหรับผู้ใช้งานประเภทนี้
                <br />
                กรุณาไปที่เมนู "จัดการ Components" เพื่อสร้างข้อมูลตั้งต้นก่อน
              </div>
            ) : (
              <div className="amap-table-responsive">
                <table className="amap-matrix-table">
                  <thead>
                    <tr>
                      <th className="amap-th-component" rowSpan="2">
                        หัวข้อการประเมิน (Components)
                      </th>
                      <th className="amap-th-group" colSpan={principles.length}>
                        หลักการจริยธรรม (Principles)
                      </th>
                      <th className="amap-th-max" rowSpan="2">
                        Max
                        <br />
                        Maturity
                      </th>
                    </tr>
                    <tr>
                      {principles.map((p) => (
                        <th
                          key={p.id}
                          className="amap-th-principle"
                          title={p.name}
                        >
                          <div className="amap-vertical-text">
                            <span>{p.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {components.map((comp) => (
                      <tr key={comp.id}>
                        <td className="amap-td-title">
                          <div className="amap-comp-id">{comp.id}</div>
                          <div className="amap-comp-name">{comp.title}</div>
                        </td>

                        {/* ลูปสร้าง Checkbox ให้แต่ละ Principle */}
                        {principles.map((p) => {
                          const isChecked =
                            checkedMap[`${comp.id}_${p.id}`] || false;
                          return (
                            <td
                              key={`${comp.id}_${p.id}`}
                              className={`amap-td-check ${isChecked ? "active" : ""}`}
                              onClick={() =>
                                handleCheckboxChange(comp.id, p.id)
                              }
                            >
                              <div
                                className={`amap-checkbox ${isChecked ? "checked" : ""}`}
                              >
                                {isChecked && <FaCheck size={12} />}
                              </div>
                            </td>
                          );
                        })}

                        <td className="amap-td-max">
                          {comp.max_maturity_level}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMapping;
