import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarUser from "./SidebarUser";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClipboardList,
  FaPlay,
  FaSpinner,
  FaTimesCircle,
  FaFileAlt,
} from "react-icons/fa";
import api, { getStoredUser } from "../../api/Api";
import "./style/UserTest.css";

// ป้ายชื่อหลักสูตรตาม target_group (1/2/3) ใช้กับ tab เลือกหลักสูตรตอนเปิดโหมดสอบข้ามหลักสูตร
const TRACK_LABELS = {
  1: "ผู้กำกับดูแล / นโยบาย",
  2: "นักพัฒนา / นักวิจัย / ผู้ให้บริการ",
  3: "ทั่วไป",
};

const UserTest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testList, setTestList] = useState([]);
  // ค่าจาก backend ว่า admin เปิดโหมด "สอบข้ามหลักสูตร" ไว้ไหม และตอนนี้กำลังดูหลักสูตรไหนอยู่
  const [meta, setMeta] = useState({
    targetGroup: null,
    ownTargetGroup: null,
    allowCrossTrackTesting: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTestsList();
  }, []);

  const fetchTestsList = async (targetGroup) => {
    try {
      setLoading(true);
      const storedUser = getStoredUser();
      const userId = storedUser?.id || storedUser?.user_id;

      if (!userId) {
        console.warn("ไม่พบ User ID ใน LocalStorage");
        return;
      }

      const query = targetGroup ? `?targetGroup=${targetGroup}` : "";
      const response = await api.get(`/user/tests/${userId}${query}`);
      if (response.data && response.data.success) {
        setTestList(response.data.data);
        if (response.data.meta) {
          setMeta(response.data.meta);
        }
      }
    } catch (error) {
      console.error("Fetch Tests Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-portal-layout">
        <SidebarUser />
        <div className="user-portal-content utest-flex-center">
          <FaSpinner className="utest-loading-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="user-portal-layout">
      <SidebarUser />
      <div className="user-portal-content">
        <div className="utest-container">
          <button
            className="utest-back-btn"
            onClick={() => navigate("/user-dashboard")}
          >
            <FaArrowLeft /> กลับสู่แดชบอร์ด
          </button>

          <div className="utest-header">
            <h1 className="utest-title">แบบประเมินและทดสอบความรู้</h1>
            <p className="utest-subtitle">
              เลือกแบบทดสอบประจำบทเรียนเพื่อประเมินความรู้และรับใบประกาศนียบัตร
            </p>
          </div>

          {meta.allowCrossTrackTesting && (
            <div className="utest-track-tabs">
              {[1, 2, 3].map((group) => (
                <button
                  key={group}
                  className={`utest-track-tab ${meta.targetGroup === group ? "active" : ""}`}
                  onClick={() => fetchTestsList(group)}
                >
                  {TRACK_LABELS[group]}
                  {meta.ownTargetGroup === group && (
                    <span className="utest-track-tab-own">หลักสูตรของคุณ</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="utest-card">
            <div className="utest-card-header">
              <h3>
                <FaFileAlt className="utest-text-blue" /> รายการแบบทดสอบหลักสูตรทั้งหมด
              </h3>
            </div>

            <div className="utest-card-body">
              <div className="utest-list-wrapper">
                {testList.length > 0 ? (
                  testList.map((test, index) => (
                    <div
                      key={test.chapterId}
                      className={`utest-list-row ${test.isPassed ? "utest-row-passed" : ""}`}
                    >
                      {/* ข้อมูลเนื้อหาฝั่งซ้าย */}
                      <div className="utest-list-info">
                        <div
                          className={`utest-list-icon ${test.isPassed ? "utest-bg-green-light utest-text-green" : test.attemptCount > 0 ? "utest-bg-red-light utest-text-red" : "utest-bg-blue-light utest-text-blue"}`}
                        >
                          {test.isPassed ? (
                            <FaCheckCircle />
                          ) : test.attemptCount > 0 ? (
                            <FaTimesCircle />
                          ) : (
                            <FaClipboardList />
                          )}
                        </div>
                        <div className="utest-list-details">
                          <span className="utest-list-index">
                            บททดสอบที่ {index + 1}
                          </span>
                          <h3 className="utest-list-name">
                            {test.chapterTitle}
                          </h3>
                          <p className="utest-list-meta">
                            จำนวน: <strong>{test.totalQuestions} ข้อ</strong> |
                            เกณฑ์ผ่าน:{" "}
                            <strong>{test.passingPercentage}%</strong>
                          </p>
                        </div>
                      </div>

                      {/* วิดเจ็ตและปุ่มฝั่งขวา (ชิดขวาหน้าจอแบบถาวร) */}
                      <div className="utest-list-actions">
                        <div className="utest-score-badge">
                          คะแนนที่ดีที่สุด:{" "}
                          <strong>
                            {test.bestScore}/{test.totalQuestions}
                          </strong>
                        </div>

                        <button
                          className={`utest-btn-action ${test.isPassed ? "utest-btn-outline" : "utest-btn-primary"}`}
                          onClick={() =>
                            navigate(
                              `/user-test-detail?chapter=${test.chapterId}`,
                            )
                          }
                          disabled={test.totalQuestions === 0}
                        >
                          {test.isPassed ? "ทำแบบทดสอบซ้ำ" : "เริ่มทำแบบทดสอบ"}{" "}
                          <FaPlay style={{ fontSize: "11px" }} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="utest-empty-state">
                    ไม่มีแบบทดสอบในระบบสำหรับหลักสูตรนี้
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTest;
