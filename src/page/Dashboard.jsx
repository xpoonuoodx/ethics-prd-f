import React, { useEffect } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import {
  BarChart3,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Building2,
  Search,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
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
import "./style/Dashboard.css";

function Dashboard() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ----------------------------------------
  // ข้อมูลจำลองสำหรับกราฟต่างๆ (Mock Data)
  // ----------------------------------------

  // 1. ข้อมูลกราฟเส้น (Area Chart): แนวโน้มองค์กร
  const areaChartData = [
    { name: "Apr 15", value: 45 },
    { name: "Apr 16", value: 38 },
    { name: "Apr 17", value: 65 },
    { name: "Apr 18", value: 48 },
    { name: "Apr 19", value: 55 },
    { name: "Apr 20", value: 40 },
    { name: "Apr 21", value: 62 },
    { name: "Apr 22", value: 58 },
  ];

  // 2. ข้อมูลกราฟวงกลม (Pie Chart)
  const pieChartData = [
    { name: "เทคโนโลยี & IT", value: 400 },
    { name: "การเงิน & ธนาคาร", value: 300 },
    { name: "สาธารณสุข", value: 200 },
    { name: "การศึกษา", value: 150 },
    { name: "อื่นๆ", value: 200 },
  ];
  const COLORS = ["#f97316", "#8b5cf6", "#3b82f6", "#10b981", "#9ca3af"];

  // 3. ข้อมูลกราฟแท่ง (Bar Chart)
  const barChartData = [
    { category: "โปร่งใส", score: 85 },
    { category: "ปลอดภัย", score: 92 },
    { category: "เป็นธรรม", score: 78 },
    { category: "ส่วนตัว", score: 88 },
    { category: "รับผิดชอบ", score: 82 },
  ];

  // 4. ข้อมูล Progress Bar
  const progressData = [
    { label: "ความโปร่งใสและอธิบายได้", percent: 85, color: "#f97316" },
    { label: "ความมั่นคงปลอดภัย", percent: 92, color: "#8b5cf6" },
    { label: "ความเป็นธรรมและลดความลำเอียง", percent: 78, color: "#3b82f6" },
    { label: "การคุ้มครองข้อมูลส่วนบุคคล", percent: 88, color: "#10b981" },
  ];

  // 5. ข้อมูลกิจกรรมล่าสุด (รูปแบบตาราง)
  const tableActivities = [
    {
      id: 1,
      campaign: "ผ่านการประเมินความพร้อม AI",
      start: "Apr 1, 2026",
      end: "Apr 30, 2026",
      impressions: "500,000",
      engagements: "35,000",
      creator: "บริษัท เอไอ โซลูชั่น จำกัด",
      cost: "$15,000",
      status: "Active",
    },
    {
      id: 2,
      campaign: "ส่งรายงานความเสี่ยงระบบสินเชื่อ",
      start: "May 1, 2026",
      end: "May 31, 2026",
      impressions: "-",
      engagements: "-",
      creator: "ธนาคารไทยนวัตกรรม",
      cost: "$12,000",
      status: "Planned",
    },
    {
      id: 3,
      campaign: "ลงทะเบียนเข้าร่วมโครงการนำร่อง",
      start: "Mar 15, 2026",
      end: "Apr 15, 2026",
      impressions: "200,000",
      engagements: "10,000",
      creator: "มหาวิทยาลัยเทคโนโลยี",
      cost: "$8,000",
      status: "Completed",
    },
    {
      id: 4,
      campaign: "อัปเดตข้อมูล PDPA Policy",
      start: "Feb 1, 2026",
      end: "Mar 1, 2026",
      impressions: "150,000",
      engagements: "7,500",
      creator: "โรงพยาบาลศูนย์สุขภาพ",
      cost: "$5,000",
      status: "Completed",
    },
  ];

  return (
    <div className="db-wrapper">
      <Tabbar />

      <main className="db-main-content">
        {/* =======================================
            TOP SECTION: HEADER & EXPORT BUTTON
            ======================================= */}
        <div className="db-header">
          <div>
            <h1 className="db-title">แดชบอร์ดภาพรวมโครงการ</h1>
            <p className="db-subtitle">
              สถิติและข้อมูลการดำเนินงานด้านแนวปฏิบัติจริยธรรมปัญญาประดิษฐ์
            </p>
          </div>
          <button className="db-btn-export">
            <Download size={18} /> Export Data
          </button>
        </div>

        {/* =======================================
            TOP SECTION: STATS (2x2) & AREA CHART
            ======================================= */}
        <div className="db-top-layout">
          {/* ฝั่งซ้าย: Stat Cards 4 ใบ */}
          <div className="db-stats-grid">
            {/* Card 1 */}
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-title">องค์กรที่เข้าร่วม</span>
                <div className="db-stat-icon orange-bg">
                  <Building2 size={16} className="orange-icon" />
                </div>
              </div>
              <div className="db-stat-value">1,250</div>
              <div className="db-stat-trend positive">
                <TrendingUp size={14} /> +12% <span>from last week</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-title">คะแนนความพร้อม</span>
                <div className="db-stat-icon purple-bg">
                  <BarChart3 size={16} className="purple-icon" />
                </div>
              </div>
              <div className="db-stat-value">84.5</div>
              <div className="db-stat-trend positive">
                <TrendingUp size={14} /> +3.12% <span>from last week</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-title">ผู้ผ่านการอบรม</span>
                <div className="db-stat-icon blue-bg">
                  <BookOpen size={16} className="blue-icon" />
                </div>
              </div>
              <div className="db-stat-value">8,430</div>
              <div className="db-stat-trend negative">
                <TrendingUp size={14} style={{ transform: "rotate(180deg)" }} />{" "}
                -0.56% <span>from last week</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="db-stat-card">
              <div className="db-stat-header">
                <span className="db-stat-title">เคสความเสี่ยง</span>
                <div className="db-stat-icon gray-bg">
                  <AlertTriangle size={16} className="gray-icon" />
                </div>
              </div>
              <div className="db-stat-value">14</div>
              <div className="db-stat-trend positive">
                <TrendingUp size={14} /> +2.65% <span>from last week</span>
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: Area Chart */}
          <div className="db-chart-main-card">
            <div className="db-chart-header">
              <h3 className="db-chart-title">ภาพรวมโครงการ (Performance)</h3>
              <div className="db-chart-filters">
                <select className="db-select">
                  <option>ภาพรวมรายสัปดาห์</option>
                  <option>ภาพรวมรายเดือน</option>
                </select>
                <div className="db-date-range">
                  <CalendarIcon size={14} /> 15 - 22 Apr 2026
                </div>
              </div>
            </div>
            <div className="db-chart-area-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={areaChartData}
                  margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* =======================================
            MIDDLE SECTION: PIE, BAR, PROGRESS
            ======================================= */}
        <div className="db-middle-layout">
          <div className="db-card">
            <div className="db-card-header-simple">
              <h3 className="db-card-title-simple">สัดส่วนตามอุตสาหกรรม</h3>
            </div>
            <div className="db-card-body" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
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

          <div className="db-card">
            <div className="db-card-header-simple">
              <h3 className="db-card-title-simple">คะแนนประเมินเฉลี่ย</h3>
            </div>
            <div className="db-card-body" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4b5563", fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(139, 92, 246, 0.05)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="db-card">
            <div className="db-card-header-simple">
              <h3 className="db-card-title-simple">
                ความคืบหน้าตามหลักจริยธรรม
              </h3>
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

        {/* =======================================
            BOTTOM SECTION: DATA TABLE LIST
            ======================================= */}
        <div className="db-table-card">
          <div className="db-table-header-main">
            <div className="db-table-title-wrap">
              <h3 className="db-table-title">รายการอัปเดตล่าสุด</h3>
              <span className="db-table-count">({tableActivities.length})</span>
            </div>
            {/* เอาปุ่ม 'จัดการข้อมูล' ออกตามคำขอ */}
          </div>

          <div className="db-table-toolbar">
            <div className="db-search-box">
              <Search size={16} className="db-search-icon" />
              <input
                type="text"
                placeholder="ค้นหารายการ..."
                className="db-search-input"
              />
            </div>
            <div className="db-filter-group">
              <button className="db-btn-filter">
                All Status <ChevronDownIcon size={14} />
              </button>
              <button className="db-btn-filter">
                <Filter size={14} /> Filters <ChevronDownIcon size={14} />
              </button>
            </div>
            <div className="db-sort-group">
              <span className="db-sort-label">Sort by:</span>
              <select className="db-sort-select">
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>

          <div className="db-table-wrapper">
            <table className="db-table">
              <thead>
                <tr>
                  <th width="30%">หัวข้อการดำเนินการ</th>
                  <th width="15%">วันที่เริ่ม</th>
                  <th width="15%">วันสิ้นสุด</th>
                  <th width="25%">องค์กร / หน่วยงาน</th>
                  <th width="15%">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {tableActivities.map((act) => (
                  <tr key={act.id}>
                    <td>
                      <div className="db-cell-campaign">
                        <div
                          className={`db-toggle ${act.status === "Active" ? "on" : "off"}`}
                        ></div>
                        <span className="db-campaign-name">{act.campaign}</span>
                      </div>
                    </td>
                    <td className="db-cell-text">{act.start}</td>
                    <td className="db-cell-text">{act.end}</td>
                    <td>
                      <div className="db-cell-creator">
                        <div className="db-avatar-mock">
                          {act.creator.charAt(0)}
                        </div>
                        <span className="db-cell-text">{act.creator}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`db-badge ${act.status.toLowerCase()}`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Custom Mini Icons for UI Matching
const CalendarIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const ChevronDownIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default Dashboard;
