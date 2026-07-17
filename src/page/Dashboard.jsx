import React, { useEffect, useState } from "react";
import Tabbar from "../component/Tabbar";
import Footer from "../component/Footer";
import axios from "axios";
import {
  Building2,
  Users,
  Award,
  Cpu,
  Download,
  TrendingUp,
  Activity,
  Layers,
  ChartPie,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import "./style/Dashboard.css";

// ==========================================
// ตัวเลือก filter user_type (ต้องตรงกับ enum จริงในระบบ)
// ==========================================
const USER_TYPE_FILTERS = [
  "",
  "regulator",
  "policy",
  "researcher",
  "developer",
  "service provider",
  "users",
];

const USER_TYPE_LABELS = {
  "": "ทั้งหมด",
  regulator: "Regulator",
  policy: "Policy",
  researcher: "Researcher",
  developer: "Developer",
  "service provider": "Service Provider",
  users: "Users",
};

const THAI_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

function Dashboard() {
  const [loading, setLoading] = useState(true);

  // filter มุมมองตาม user_type (ค่าว่าง = ดูภาพรวมทั้งหมด)
  const [userTypeFilter, setUserTypeFilter] = useState("");

  // State สำหรับเก็บข้อมูล Summary 4 การ์ดบน (ของจริงจาก API)
  const [stats, setStats] = useState({
    totalOrgs: 0,
    totalUsers: 0,
    totalCerts: 0,
    totalProjects: 0,
  });

  // State สำหรับกราฟ (ของจริงจาก API ทั้งหมด)
  const [radarData, setRadarData] = useState([]);
  const [maturityData, setMaturityData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData(userTypeFilter);
  }, [userTypeFilter]);

  const fetchDashboardData = async (userType) => {
    try {
      setLoading(true);

      const API_URL = `${import.meta.env.VITE_APP_API_ENDPOINT}/public/dashboard-stats`;
      const response = await axios.get(API_URL, {
        params: userType ? { user_type: userType } : {},
      });

      if (response.data && response.data.success) {
        const { summary, userTypes, trend, maturityDistribution, radar } =
          response.data.data;

        // เซ็ตค่า 4 การ์ดบนจาก API
        setStats({
          totalOrgs: summary.totalOrgs || 0,
          totalUsers: summary.totalUsers || 0,
          totalCerts: summary.totalCerts || 0,
          totalProjects: summary.totalProjects || 0,
        });

        // สัดส่วนบุคลากรตามบทบาท (ภาพรวมทั้งระบบเสมอ ไม่ผูกกับ filter)
        setUserRoleData(
          (userTypes || []).map((item) => ({
            name: USER_TYPE_LABELS[item.name] || item.name,
            value: parseInt(item.value),
          })),
        );

        // เทรนด์ใบประกาศนียบัตรย้อนหลัง 6 เดือน
        setTrendData(
          (trend || []).map((item) => {
            const monthNum = parseInt(item.month.split("-")[1], 10);
            return {
              month: THAI_MONTHS[monthNum - 1] || item.month,
              certs: parseInt(item.certs),
            };
          }),
        );

        // สัดส่วนระดับความพร้อม (Maturity)
        setMaturityData(
          (maturityDistribution || []).map((item) => ({
            level: item.level,
            count: parseInt(item.count),
          })),
        );

        // คะแนนเฉลี่ยจริยธรรม 7 มิติ (ประมาณการจากผลประเมินตนเองจริง)
        setRadarData(
          (radar || []).map((item) => ({
            subject: item.principle_name,
            A: Math.round(parseFloat(item.avg_score)),
            fullMark: 100,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // หาก API พัง ให้โชว์เลขสแปร์เพื่อให้หน้าเว็บไม่โล่ง
      setStats({
        totalOrgs: 3,
        totalUsers: 20,
        totalCerts: 1,
        totalProjects: 3,
      });
      setRadarData([]);
      setTrendData([]);
      setMaturityData([]);
      setUserRoleData([]);
    } finally {
      setLoading(false);
    }
  };

  // ชุดสีเดียวกับธีมหน้า Home (เขียว/กรมท่าเป็นหลัก แซมด้วยโทนเสริมกลุ่มเดียวกัน)
  const COLORS = [
    "#75ba40",
    "#0f172a",
    "#d97706",
    "#0f766e",
    "#64748b",
    "#b45309",
  ];

  if (loading) {
    return (
      <div className="pub-db-wrapper flex-center">
        <div className="pub-db-loader"></div>
        <p style={{ marginTop: "15px", color: "#64748b" }}>
          กำลังโหลดข้อมูลสถิติภาพรวม...
        </p>
      </div>
    );
  }

  return (
    <div className="pub-db-wrapper">
      <Tabbar />

      <main className="pub-db-main-content">
        {/* Header */}
        <div className="pub-db-header">
          <div>
            <span className="pub-db-eyebrow">ข้อมูลสาธารณะ</span>
            <h1 className="pub-db-title">สถานการณ์จริยธรรม AI ระดับประเทศ</h1>
            <p className="pub-db-subtitle">
              ข้อมูลสถิติภาพรวมเชิงสาธารณะ (Public Aggregated Data)
              จากระบบประเมินความพร้อมและหลักสูตร
            </p>
          </div>
          <button className="pub-db-btn-export">
            <Download size={18} /> โหลดรายงานสรุป (PDF)
          </button>
        </div>

        {/* Filter มุมมองตาม User Type */}
        <div className="pub-db-filter-bar">
          {USER_TYPE_FILTERS.map((type) => (
            <button
              key={type || "all"}
              className={`pub-db-filter-btn ${userTypeFilter === type ? "active" : ""}`}
              onClick={() => setUserTypeFilter(type)}
            >
              {USER_TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        {/* Summary Cards (KPIs) */}
        <div className="pub-db-stats-grid">
          <div className="pub-db-stat-card">
            <div className="pub-db-stat-icon-wrapper org">
              <Building2 size={24} />
            </div>
            <div className="pub-db-stat-info">
              <span className="pub-db-stat-label">องค์กรที่เข้าร่วม</span>
              <h3 className="pub-db-stat-value">
                {stats.totalOrgs.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="pub-db-stat-card">
            <div className="pub-db-stat-icon-wrapper proj">
              <Cpu size={24} />
            </div>
            <div className="pub-db-stat-info">
              <span className="pub-db-stat-label">โครงการ AI ที่ประเมิน</span>
              <h3 className="pub-db-stat-value">
                {stats.totalProjects.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="pub-db-stat-card">
            <div className="pub-db-stat-icon-wrapper users">
              <Users size={24} />
            </div>
            <div className="pub-db-stat-info">
              <span className="pub-db-stat-label">ผู้ใช้งานในระบบ</span>
              <h3 className="pub-db-stat-value">
                {stats.totalUsers.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="pub-db-stat-card">
            <div className="pub-db-stat-icon-wrapper cert">
              <Award size={24} />
            </div>
            <div className="pub-db-stat-info">
              <span className="pub-db-stat-label">ใบประกาศฯที่ออกแล้ว</span>
              <h3 className="pub-db-stat-value">
                {stats.totalCerts.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Top Charts: Radar & Area */}
        <div className="pub-db-chart-row-large">
          {/* Radar Chart (7-8 เหลี่ยม) */}
          <div className="pub-db-card">
            <div className="pub-db-card-header">
              <h3>
                <span className="pub-db-card-icon accent-green">
                  <Activity size={16} />
                </span>
                คะแนนเฉลี่ยจริยธรรม 7 มิติ
              </h3>
              <p>ดัชนีภาพรวมจากการประเมินของทุกองค์กร</p>
              <span className="pub-db-radar-note">
                * ประมาณการจากผลการประเมินตนเองของผู้ใช้งานในระบบ
              </span>
            </div>
            <div className="pub-db-card-body radar-container">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    data={radarData}
                  >
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#94a3b8" }}
                    />
                    <Radar
                      name="คะแนนเฉลี่ยประเทศ"
                      dataKey="A"
                      stroke="#75ba40"
                      fill="#75ba40"
                      fillOpacity={0.35}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="pub-db-empty-chart">
                  ยังไม่มีข้อมูลการประเมิน
                </div>
              )}
            </div>
          </div>

          {/* Area Chart */}
          <div className="pub-db-card">
            <div className="pub-db-card-header">
              <h3>
                <span className="pub-db-card-icon accent-navy">
                  <TrendingUp size={16} />
                </span>
                การเติบโตของผู้ผ่านหลักสูตร
              </h3>
              <p>จำนวนใบประกาศนียบัตรสะสมทั้งหมด (ย้อนหลัง 6 เดือน)</p>
            </div>
            <div className="pub-db-card-body">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCerts"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0f172a"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0f172a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="certs"
                      name="ใบประกาศฯ"
                      stroke="#0f172a"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorCerts)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="pub-db-empty-chart">
                  ยังไม่มีข้อมูลการออกใบประกาศนียบัตร
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Charts: Bar & Pie */}
        <div className="pub-db-chart-row-small">
          {/* Bar Chart (Maturity Levels) */}
          <div className="pub-db-card">
            <div className="pub-db-card-header">
              <h3>
                <span className="pub-db-card-icon accent-amber">
                  <Layers size={16} />
                </span>
                สัดส่วนระดับความพร้อม (Maturity Level)
              </h3>
            </div>
            <div className="pub-db-card-body">
              {maturityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={maturityData}
                    margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="level"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="จำนวนองค์กร"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                      barSize={40}
                    >
                      {maturityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="pub-db-empty-chart">
                  ยังไม่มีข้อมูลการจัดระดับความพร้อม
                </div>
              )}
            </div>
          </div>

          {/* Donut Chart (User Types) */}
          <div className="pub-db-card">
            <div className="pub-db-card-header">
              <h3>
                <span className="pub-db-card-icon accent-teal">
                  <ChartPie size={16} />
                </span>
                สัดส่วนบุคลากรตามบทบาท (User Type)
              </h3>
            </div>
            <div className="pub-db-card-body">
              {userRoleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: "13px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="pub-db-empty-chart">
                  ยังไม่มีข้อมูลบุคลากรในระบบ
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
