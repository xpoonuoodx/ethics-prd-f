import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/UserTools.css";
import SidebarUser from "./SidebarUser";
import {
  FaPlus,
  FaTrash,
  FaEye,
  FaSpinner,
  FaLayerGroup,
} from "react-icons/fa";
import api, { getStoredUser } from "../../api/Api";
import { useThemedAlert } from "../../hooks/useThemedAlert";

const UserTools = () => {
  const { fire } = useThemedAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchToolsHistory();
  }, []);

  const fetchToolsHistory = async () => {
    try {
      setLoading(true);
      const storedUser = getStoredUser();
      const userId = storedUser?.id || storedUser?.user_id;
      if (!userId) return;

      const response = await api.get(`/user/tool-history-list/${userId}`);
      if (response.data && response.data.success) {
        setTools(response.data.data);
      }
    } catch (error) {
      console.error("Fetch Tools History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    fire({
      title: "ยืนยันการลบข้อมูล?",
      text: "รายการนี้จะถูกลบออกจากระบบอย่างถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/user/tool-history-delete/${id}`);
          if (response.data && response.data.success) {
            setTools(tools.filter((t) => t.id !== id));
            fire("ลบสำเร็จ", "ข้อมูลถูกลบออกจากระบบแล้ว", "success");
          }
        } catch (error) {
          fire("ผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
        }
      }
    });
  };

  const handleView = (toolData) => {
    navigate("/user-tools-result", {
      state: { resultData: toolData, isHistory: true },
    });
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content flex-center">
          <FaSpinner className="ut-spin-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="ut-minimal-container">
          <div className="ut-minimal-header">
            <div>
              <h1 className="ut-title">จัดการเครื่องมือประเมิน</h1>
              <p className="ut-subtitle">
                ภาพรวมและประวัติการประเมินความพร้อม AI ของคุณ
              </p>
            </div>
            <button
              className="ut-btn-primary"
              onClick={() => navigate("/user-tools-create")}
            >
              <FaPlus /> สร้างเครื่องมือใหม่
            </button>
          </div>

          {/* สถิติ 3 กล่องบน */}
          <div className="ut-stats-row">
            <div className="ut-stat-card">
              <div className="ut-stat-icon bg-blue-light text-blue">
                <FaLayerGroup />
              </div>
              <div className="ut-stat-info">
                <span>ประวัติทั้งหมด</span>
                <h3>{tools.length}</h3>
              </div>
            </div>
          </div>

          <div className="ut-list-section">
            <div className="ut-list-header-row">
              <h3>
                รายการประเมินในระบบ{" "}
                <span className="ut-badge-count">{tools.length} รายการ</span>
              </h3>
            </div>

            {/* Header Columns */}
            <div className="ut-list-cols">
              <span className="col-id">รหัสอ้างอิง</span>
              <span className="col-role">สายงานผู้ประเมิน</span>
              <span className="col-level">ระดับเป้าหมาย</span>
              <span className="col-date">วันที่ประเมิน</span>
              <span className="col-action text-center">จัดการ</span>
            </div>

            {/* List Rows */}
            <div className="ut-list-wrapper">
              {tools.length > 0 ? (
                tools.map((tool) => (
                  <div className="ut-list-row" key={tool.id}>
                    <div className="col-id font-bold text-dark">
                      DOC-{tool.id}
                    </div>
                    <div className="col-role">
                      {tool.userType?.toUpperCase()}
                    </div>
                    <div className="col-level">
                      <span className="ut-status-pill">
                        <div className="dot bg-green"></div>{" "}
                        {tool.maturity?.level_name || "ไม่ระบุ"}
                      </span>
                    </div>
                    <div className="col-date text-muted">{tool.date}</div>
                    <div className="col-action ut-action-group">
                      <button
                        className="ut-btn-icon view"
                        onClick={() => handleView(tool)}
                        title="ดูข้อมูล"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="ut-btn-icon delete"
                        onClick={() => handleDelete(tool.id)}
                        title="ลบ"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="ut-empty-row">
                  ไม่มีประวัติการสร้างเครื่องมือในระบบ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTools;
