import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, Check, X, Cookie } from "lucide-react";
import logoBde from "../assets/logo-bde.png";
import { getConsent, setConsent } from "../utils/cookieConsent";
import {
  loadGoogleAnalytics,
  setAnalyticsEnabled,
  isTrackablePath,
} from "../utils/analytics";
import "./style/CookieConsentBanner.css";

function CookieConsentBanner() {
  const location = useLocation();
  const [promptOpen, setPromptOpen] = useState(() => !getConsent());
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(() => !!getConsent()?.analytics);

  useEffect(() => {
    const consent = getConsent();
    if (consent?.analytics) loadGoogleAnalytics();
  }, []);

  // โชว์เฉพาะหน้า public เท่านั้น - ใช้ exclusion list เดียวกับที่ GA ไม่ track หน้า
  // /admin-*, /user-*, /regulator-* (หน้าเครื่องมือภายในที่ต้อง login ไม่ต้องมี banner คุกกี้)
  if (!isTrackablePath(location.pathname)) return null;

  const finish = (analytics) => {
    setConsent({ analytics });
    if (analytics) loadGoogleAnalytics();
    setAnalyticsEnabled(analytics); // รองรับกรณีเปลี่ยนใจทีหลังผ่านปุ่มลอย (ไม่ใช่แค่ครั้งแรก)
    setAnalyticsOn(analytics);
    setPromptOpen(false);
    setShowSettings(false);
  };

  const acceptAll = () => finish(true);
  const rejectNonEssential = () => finish(false);
  const saveSettings = () => finish(analyticsOn);

  const openSettingsAgain = () => {
    setAnalyticsOn(!!getConsent()?.analytics);
    setShowSettings(true);
  };

  // เคยตัดสินใจไปแล้ว (ไม่ใช่รอบแรก) และตอนนี้ไม่ได้เปิด modal อยู่ -> โชว์ปุ่มลอยไว้กลับมาเปลี่ยนใจได้เสมอ
  if (!promptOpen && !showSettings) {
    return (
      <button
        type="button"
        className="cc-reopen-btn"
        onClick={openSettingsAgain}
        aria-label="ตั้งค่าคุกกี้"
        title="ตั้งค่าคุกกี้"
      >
        <Cookie size={20} />
      </button>
    );
  }

  return (
    <div className="cc-overlay">
      {!showSettings ? (
        <div className="cc-bar">
          {/* <img src={logoBde} alt="BDE" className="cc-bar-logo" /> */}
          <p className="cc-bar-text">
            เว็บไซต์นี้ใช้คุกกี้เพื่อให้แน่ใจว่าเว็บไซต์ทำงานได้อย่างถูกต้อง
            และเพื่อวิเคราะห์การใช้งานเว็บไซต์
            คุณสามารถเลือกประเภทคุกกี้ที่ต้องการอนุญาตได้
          </p>
          <div className="cc-bar-actions">
            <button
              type="button"
              className="cc-btn cc-btn-text"
              onClick={() => setShowSettings(true)}
            >
              ตั้งค่า
            </button>
            <button
              type="button"
              className="cc-btn cc-btn-outline"
              onClick={rejectNonEssential}
            >
              ปฏิเสธคุกกี้ที่ไม่จำเป็น
            </button>
            <button
              type="button"
              className="cc-btn cc-btn-primary"
              onClick={acceptAll}
            >
              ยอมรับทั้งหมด
            </button>
          </div>
        </div>
      ) : (
        <div className="cc-modal-backdrop">
          <div className="cc-modal">
            <div className="cc-modal-header">
              <h3>ตั้งค่าคุกกี้</h3>
              <button
                type="button"
                className="cc-modal-close"
                onClick={() => setShowSettings(false)}
                aria-label="ปิด"
              >
                <X size={18} />
              </button>
            </div>

            <div className="cc-modal-body">
              <p className="cc-modal-intro">
                เราใช้คุกกี้เพื่อให้แน่ใจว่าเว็บไซต์ทำงานได้อย่างถูกต้อง
                และเพื่อวิเคราะห์การใช้งานเว็บไซต์
                คุณสามารถเลือกประเภทคุกกี้ที่ต้องการอนุญาตได้ด้านล่าง
              </p>

              <div className="cc-category">
                <div className="cc-category-head">
                  <span className="cc-category-title">
                    <ChevronDown size={16} /> คุกกี้ที่จำเป็น
                  </span>
                  <span className="cc-toggle cc-toggle-locked">
                    <Check size={12} />
                  </span>
                </div>
                <p className="cc-category-desc">
                  การปิดการใช้งานคุกกี้ประเภทนี้
                  จะส่งผลให้ท่านไม่สามารถใช้บริการในสาระสำคัญของเว็บไซต์
                </p>
              </div>

              <div className="cc-category">
                <div className="cc-category-head">
                  <span className="cc-category-title">
                    <ChevronDown size={16} /> คุกกี้เพื่อการวิเคราะห์
                  </span>
                  <button
                    type="button"
                    className={`cc-toggle ${analyticsOn ? "cc-toggle-on" : "cc-toggle-off"}`}
                    onClick={() => setAnalyticsOn((v) => !v)}
                    aria-pressed={analyticsOn}
                  >
                    {analyticsOn ? <Check size={12} /> : <X size={12} />}
                  </button>
                </div>
                <p className="cc-category-desc">
                  คุกกี้ประเภทนี้เก็บรวบรวมข้อมูลการเข้าใช้งานเว็บไซต์ของท่าน
                  เช่น หน้าเว็บที่ท่านเข้าชม
                  เพื่อช่วยให้เราพัฒนาประสิทธิภาพการใช้งานเว็บไซต์ให้ดียิ่งขึ้น
                  (Google Analytics)
                </p>
              </div>
            </div>

            <div className="cc-modal-footer">
              <button
                type="button"
                className="cc-btn cc-btn-primary cc-btn-full"
                onClick={acceptAll}
              >
                ยอมรับทั้งหมด
              </button>
              <button
                type="button"
                className="cc-btn cc-btn-outline cc-btn-full"
                onClick={rejectNonEssential}
              >
                ปฏิเสธคุกกี้ที่ไม่จำเป็น
              </button>
              <button
                type="button"
                className="cc-btn cc-btn-text cc-btn-full"
                onClick={saveSettings}
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CookieConsentBanner;
