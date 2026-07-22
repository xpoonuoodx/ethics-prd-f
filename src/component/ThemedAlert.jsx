import React, { useCallback, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import { ThemedAlertContext } from "../hooks/useThemedAlert";
import "./style/ThemedAlert.css";

const ICONS = {
  success: <FaCheckCircle />,
  error: <FaTimesCircle />,
  warning: <FaExclamationTriangle />,
  info: <FaInfoCircle />,
  question: <FaQuestionCircle />,
};

const INITIAL_STATE = {
  isOpen: false,
  icon: "info",
  title: "",
  text: "",
  showCancelButton: false,
  showConfirmButton: true,
  confirmButtonText: "ตกลง",
  cancelButtonText: "ยกเลิก",
};

export const ThemedAlertProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE);
  const resolverRef = useRef(null);
  const timerRef = useRef(null);

  const settle = useCallback((result) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setState((prev) => ({ ...prev, isOpen: false }));
    resolverRef.current?.(result);
    resolverRef.current = null;
  }, []);

  // รองรับทั้งรูปแบบ fire({ icon, title, text, ... }) และ fire(title, text, icon) แบบเดียวกับ Swal.fire
  const fire = useCallback(
    (optionsOrTitle, text, icon) => {
      const options =
        typeof optionsOrTitle === "string"
          ? { title: optionsOrTitle, text, icon }
          : optionsOrTitle || {};

      return new Promise((resolve) => {
        resolverRef.current = resolve;
        setState({
          isOpen: true,
          icon: options.icon || "info",
          title: options.title || "",
          text: options.text || "",
          showCancelButton: !!options.showCancelButton,
          showConfirmButton: options.showConfirmButton !== false,
          confirmButtonText: options.confirmButtonText || "ตกลง",
          cancelButtonText: options.cancelButtonText || "ยกเลิก",
        });

        if (options.timer) {
          timerRef.current = setTimeout(() => {
            settle({ isConfirmed: false, isDismissed: true, isTimer: true });
          }, options.timer);
        }
      });
    },
    [settle],
  );

  const handleConfirm = () =>
    settle({ isConfirmed: true, isDismissed: false });
  const handleCancel = () =>
    settle({ isConfirmed: false, isDismissed: true });

  return (
    <ThemedAlertContext.Provider value={{ fire }}>
      {children}
      {state.isOpen && (
        <div className="ta-overlay" onClick={handleCancel}>
          <div className="ta-content" onClick={(e) => e.stopPropagation()}>
            <button className="ta-close" onClick={handleCancel}>
              <FaTimes />
            </button>

            <div className={`ta-icon-wrapper ${state.icon}`}>
              {ICONS[state.icon] || ICONS.info}
            </div>

            {state.title && <h3 className="ta-title">{state.title}</h3>}
            {state.text && <p className="ta-desc">{state.text}</p>}

            {(state.showConfirmButton || state.showCancelButton) && (
              <div className="ta-actions">
                {state.showCancelButton && (
                  <button className="ta-btn cancel" onClick={handleCancel}>
                    {state.cancelButtonText}
                  </button>
                )}
                {state.showConfirmButton && (
                  <button
                    className={`ta-btn ${state.icon}`}
                    onClick={handleConfirm}
                  >
                    {state.confirmButtonText}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ThemedAlertContext.Provider>
  );
};
