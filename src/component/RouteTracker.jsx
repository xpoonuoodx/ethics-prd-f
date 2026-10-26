import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

// ยิง GA page_view ทุกครั้งที่ path เปลี่ยน - จำเป็นเพราะเป็น SPA (ไม่มีการโหลดหน้าใหม่จริง
// gtag.js จึงนับ pageview อัตโนมัติแค่ครั้งแรกที่เข้าเว็บเท่านั้น)
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

export default RouteTracker;
