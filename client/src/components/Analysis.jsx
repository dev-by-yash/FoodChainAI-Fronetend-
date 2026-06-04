import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Calendar, Filter } from "lucide-react";
import axios from "axios";

export default function Analysis() {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("waste");
  const [weeklyData, setWeeklyData] = useState([]);
  const [materialWaste, setMaterialWaste] = useState([]);
  const [metrics, setMetrics] = useState({
    totalWaste: 0,
    avgDailyWaste: 0,
    wasteCost: 0,
    efficiency: 0,
  });

  useEffect(() => {
    fetchAnalysisData();
    const interval = setInterval(fetchAnalysisData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalysisData = async () => {
    try {
      const response = await axios.get("/api/food");
      const data = response.data;

      if (data.length === 0) return;

      // Calculate metrics
      const totalPurchased = data.reduce(
        (sum, item) => sum + (Number(item["Quantity of Food"]) || 0),
        0,
      );
      const totalWaste = data.reduce(
        (sum, item) => sum + (Number(item["Wastage Food Amount"]) || 0),
        0,
      );
      const totalUsed = totalPurchased - totalWaste;
      const efficiency =
        totalPurchased > 0
          ? ((totalUsed / totalPurchased) * 100).toFixed(1)
          : 0;

      setMetrics({
        totalWaste: totalWaste,
        avgDailyWaste: (totalWaste / 7).toFixed(1),
        wasteCost: Math.round(totalWaste * 25), // Assuming ₹25 per kg
        efficiency: efficiency,
      });

      // Generate weekly data (last 7 entries)
      const recentData = data.slice(-7).map((item, index) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index % 7],
        waste: Number(item["Wastage Food Amount"]) || 0,
        usage:
          Number(item["Quantity of Food"]) -
            Number(item["Wastage Food Amount"]) || 0,
        purchase: Number(item["Quantity of Food"]) || 0,
      }));

      setWeeklyData(recentData);

      // Material-wise waste
      const materialMap = {};
      data.forEach((item) => {
        const name = item["Purchase History"] || "Unknown";
        const waste = Number(item["Wastage Food Amount"]) || 0;

        if (!materialMap[name]) {
          materialMap[name] = 0;
        }
        materialMap[name] += waste;
      });

      const materialArray = Object.entries(materialMap)
        .map(([name, value]) => ({ name, value }))
        .filter((m) => m.name !== "Unknown" && m.name !== "N/A")
        .slice(0, 5); // Top 5

      setMaterialWaste(materialArray);
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  };

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6"];

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <h1 style={title}>Advanced Analysis</h1>
          <p style={subtitle}>Deep insights into your food waste patterns</p>
        </div>
        <div style={controls}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={select}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={metricsGrid}>
        <MetricCard
          title="Total Waste"
          value={`${metrics.totalWaste} kg`}
          change="-12%"
          positive={true}
        />
        <MetricCard
          title="Avg Daily Waste"
          value={`${metrics.avgDailyWaste} kg`}
          change="+5%"
          positive={false}
        />
        <MetricCard
          title="Waste Cost"
          value={`₹${metrics.wasteCost}`}
          change="-8%"
          positive={true}
        />
        <MetricCard
          title="Efficiency"
          value={`${metrics.efficiency}%`}
          change="+3%"
          positive={true}
        />
      </div>

      {/* Charts Grid */}
      <div style={chartsGrid}>
        {/* Trend Chart */}
        <div style={chartCard}>
          <h3 style={cardTitle}>
            <TrendingUp size={20} />
            Weekly Waste Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="waste"
                stroke="#ef4444"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Material Comparison */}
        <div style={chartCard}>
          <h3 style={cardTitle}>
            <Filter size={20} />
            Material-wise Waste
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={materialWaste}>
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={chartCard}>
          <h3 style={cardTitle}>Waste Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={materialWaste}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {materialWaste.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Usage vs Purchase */}
        <div style={chartCard}>
          <h3 style={cardTitle}>Usage vs Purchase</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="purchase" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="usage" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, positive, icon }) {
  return (
    <div style={metricCard}>
      <div style={metricIcon}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={metricTitle}>{title}</p>
        <h3 style={metricValue}>{value}</h3>
      </div>
      <div style={{ ...changeBadge, color: positive ? "#22c55e" : "#ef4444" }}>
        {change}
      </div>
    </div>
  );
}

// Styles
const container = {
  minHeight: "100vh",
  background: "#0f172a",
  padding: "30px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const title = {
  fontSize: "32px",
  color: "white",
  margin: 0,
  fontWeight: "700",
};

const subtitle = {
  color: "rgba(255, 255, 255, 0.6)",
  margin: "5px 0 0 0",
};

const controls = {
  display: "flex",
  gap: "10px",
};

const select = {
  background: "#1e293b",
  color: "white",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
  outline: "none",
};

const metricsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const metricCard = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const metricIcon = {
  fontSize: "32px",
};

const metricTitle = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "14px",
  margin: "0 0 5px 0",
};

const metricValue = {
  color: "white",
  fontSize: "24px",
  fontWeight: "700",
  margin: 0,
};

const changeBadge = {
  fontSize: "14px",
  fontWeight: "600",
};

const chartsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
  gap: "20px",
};

const chartCard = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const cardTitle = {
  color: "white",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 20px 0",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
