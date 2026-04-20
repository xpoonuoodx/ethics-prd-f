import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar"; // ปรับ path ให้ตรงกับโฟลเดอร์ของคุณ
import Footer from "../component/Footer"; // ปรับ path ให้ตรงกับโฟลเดอร์ของคุณ
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Building2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./style/Dashboard.css"; // ปรับ path ให้ตรงกับโฟลเดอร์ของคุณ

function Dashboard() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ----------------------------------------
  // ข้อมูลจำลองสำหรับกราฟต่างๆ (Mock Data)
  // ----------------------------------------

  // 1. ข้อมูลกราฟเส้น (Line Chart): แนวโน้มองค์กรที่เข้าร่วมรายเดือน
  const lineChartData = [
    { month: "ม.ค.", participants: 120 },
    { month: "ก.พ.", participants: 250 },
    { month: "มี.ค.", participants: 480 },
    { month: "เม.ย.", participants: 750 },
    { month: "พ.ค.", participants: 980 },
    { month: "มิ.ย.", participants: 1250 },
  ];

  // 2. ข้อมูลกราฟวงกลม (Pie Chart): สัดส่วนองค์กรตามอุตสาหกรรม
  const pieChartData = [
    { name: "เทคโนโลยี & IT", value: 400 },
    { name: "การเงิน & ธนาคาร", value: 300 },
    { name: "สาธารณสุข", value: 200 },
    { name: "การศึกษา", value: 150 },
    { name: "อื่นๆ", value: 200 },
  ];
  const COLORS = ["#75ba40", "#3b82f6", "#f59e0b", "#8b5cf6", "#9ca3af"];

  // 3. ข้อมูลกราฟแท่ง (Bar Chart): คะแนนเฉลี่ยตามหมวดหมู่
  const barChartData = [
    { category: "ความโปร่งใส", score: 85 },
    { category: "ความปลอดภัย", score: 92 },
    { category: "ความเป็นธรรม", score: 78 },
    { category: "ความเป็นส่วนตัว", score: 88 },
    { category: "ความรับผิดชอบ", score: 82 },
  ];

  // 4. ข้อมูล Progress Bar
  const progressData = [
    {
      label: "ความโปร่งใสและอธิบายได้ (Transparency)",
      percent: 85,
      color: "#75ba40",
    },
    {
      label: "ความมั่นคงปลอดภัย (Security & Safety)",
      percent: 92,
      color: "#3b82f6",
    },
    {
      label: "ความเป็นธรรมและลดความลำเอียง (Fairness)",
      percent: 78,
      color: "#f59e0b",
    },
    {
      label: "การคุ้มครองข้อมูลส่วนบุคคล (Privacy)",
      percent: 88,
      color: "#10b981",
    },
  ];

  // 5. ข้อมูลกิจกรรมล่าสุด
  const recentActivities = [
    {
      id: 1,
      org: "บริษัท เอไอ โซลูชั่น จำกัด",
      action: "ผ่านการประเมินความพร้อม AI",
      date: "10 เม.ย. 2569",
      status: "สำเร็จ",
    },
    {
      id: 2,
      org: "ธนาคารไทยนวัตกรรม",
      action: "ส่งรายงานความเสี่ยงระบบสินเชื่อ",
      date: "08 เม.ย. 2569",
      status: "รอตรวจสอบ",
    },
    {
      id: 3,
      org: "มหาวิทยาลัยเทคโนโลยี",
      action: "ลงทะเบียนเข้าร่วมโครงการนำร่อง",
      date: "05 เม.ย. 2569",
      status: "สำเร็จ",
    },
    {
      id: 4,
      org: "โรงพยาบาลศูนย์สุขภาพ",
      action: "อัปเดตข้อมูล PDPA Policy",
      date: "02 เม.ย. 2569",
      status: "กำลังดำเนินการ",
    },
  ];

  return (
    <div className="db-wrapper">
      <Tabbar />

      <main className="db-main-content">
        {/* --- ส่วนหัวข้อ --- */}
        <div className="db-header">
          <div>
            <h1 className="db-title">แดชบอร์ดภาพรวมโครงการ</h1>
            <p className="db-subtitle">
              สถิติและข้อมูลการดำเนินงานด้านแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
            </p>
          </div>
          <button className="db-btn-export">ดาวน์โหลดรายงาน (PDF)</button>
        </div>

        {/* --- ส่วนการ์ดสถิติ 4 ใบ --- */}
        <div className="db-stats-grid">
          <div className="db-stat-card">
            <div
              className="db-stat-icon-wrapper"
              style={{
                backgroundColor: "rgba(117, 186, 64, 0.1)",
                color: "#75ba40",
              }}
            >
              <Building2 size={28} />
            </div>
            <div className="db-stat-info">
              <p className="db-stat-label">องค์กรที่เข้าร่วมประเมิน</p>
              <h3 className="db-stat-value">1,250</h3>
              <p className="db-stat-trend positive">
                <TrendingUp size={14} /> +12% จากเดือนที่แล้ว
              </p>
            </div>
          </div>

          <div className="db-stat-card">
            <div
              className="db-stat-icon-wrapper"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
              }}
            >
              <BarChart3 size={28} />
            </div>
            <div className="db-stat-info">
              <p className="db-stat-label">คะแนนความพร้อมเฉลี่ย</p>
              <h3 className="db-stat-value">84.5 / 100</h3>
              <p className="db-stat-trend positive">
                <TrendingUp size={14} /> +3.2 คะแนน
              </p>
            </div>
          </div>

          <div className="db-stat-card">
            <div
              className="db-stat-icon-wrapper"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                color: "#f59e0b",
              }}
            >
              <BookOpen size={28} />
            </div>
            <div className="db-stat-info">
              <p className="db-stat-label">ผู้ผ่านการอบรมหลักสูตร</p>
              <h3 className="db-stat-value">8,430</h3>
              <p className="db-stat-trend positive">
                <TrendingUp size={14} /> +450 คนในสัปดาห์นี้
              </p>
            </div>
          </div>

          <div className="db-stat-card">
            <div
              className="db-stat-icon-wrapper"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
              }}
            >
              <AlertTriangle size={28} />
            </div>
            <div className="db-stat-info">
              <p className="db-stat-label">เคสความเสี่ยงที่พบ</p>
              <h3 className="db-stat-value">14</h3>
              <p className="db-stat-trend negative">
                <TrendingUp size={14} style={{ transform: "rotate(180deg)" }} />{" "}
                -2 เคส จากเดือนที่แล้ว
              </p>
            </div>
          </div>
        </div>

        {/* --- ส่วนกราฟ แถวที่ 1 (Line & Pie) --- */}
        <div className="db-charts-row-1">
          {/* กราฟเส้น */}
          <div className="db-card">
            <div className="db-card-header">
              <h3 className="db-card-title">แนวโน้มองค์กรที่เข้าร่วมประเมิน</h3>
            </div>
            <div className="db-card-body" style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#374151" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="participants"
                    name="จำนวนองค์กร"
                    stroke="#75ba40"
                    strokeWidth={4}
                    dot={{
                      r: 4,
                      fill: "#75ba40",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* กราฟวงกลม */}
          <div className="db-card">
            <div className="db-card-header">
              <h3 className="db-card-title">สัดส่วนตามอุตสาหกรรม</h3>
            </div>
            <div
              className="db-card-body"
              style={{
                height: "350px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- ส่วนกราฟ แถวที่ 2 (Bar & Progress) --- */}
        <div className="db-charts-row-2">
          {/* กราฟแท่ง */}
          <div className="db-card">
            <div className="db-card-header">
              <h3 className="db-card-title">คะแนนประเมินเฉลี่ยตามหมวดหมู่</h3>
            </div>
            <div className="db-card-body" style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#374151", fontWeight: 500 }}
                    width={100}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(117, 186, 64, 0.05)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="score"
                    name="คะแนนเฉลี่ย"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="db-card">
            <div className="db-card-header">
              <h3 className="db-card-title">ความคืบหน้าตามหลักการ AI Ethics</h3>
            </div>
            <div className="db-card-body">
              <div className="db-progress-list">
                {progressData.map((item, index) => (
                  <div key={index} className="db-progress-item">
                    <div className="db-progress-info">
                      <span className="db-progress-label">{item.label}</span>
                      <span className="db-progress-percent">
                        {item.percent}%
                      </span>
                    </div>
                    <div className="db-progress-bar-bg">
                      <div
                        className="db-progress-bar-fill"
                        style={{
                          width: `${item.percent}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- ส่วนแถวที่ 3 (ตารางกิจกรรมล่าสุด) --- */}
        <div className="db-card db-full-width">
          <div className="db-card-header">
            <h3 className="db-card-title">ความเคลื่อนไหวล่าสุด</h3>
            <button className="db-btn-link">ดูทั้งหมด</button>
          </div>
          <div className="db-card-body">
            <ul className="db-activity-list">
              {recentActivities.map((act) => (
                <li key={act.id} className="db-activity-item">
                  <div className="db-activity-icon">
                    <CheckCircle
                      size={20}
                      color={act.status === "สำเร็จ" ? "#10b981" : "#9ca3af"}
                    />
                  </div>
                  <div className="db-activity-details">
                    <p className="db-activity-org">{act.org}</p>
                    <p className="db-activity-action">{act.action}</p>
                  </div>
                  <div className="db-activity-meta">
                    <span
                      className={`db-status-badge ${act.status === "สำเร็จ" ? "success" : act.status === "รอตรวจสอบ" ? "warning" : "processing"}`}
                    >
                      {act.status}
                    </span>
                    <span className="db-activity-date">{act.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
