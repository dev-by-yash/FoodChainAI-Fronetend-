import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react";
import DataTable from "./DataTable";

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [waste, setWaste] = useState(0);
  const [saved, setSaved] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [avgWastePercent, setAvgWastePercent] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  // 🔥 Dynamic Chart State
  const [xAxisKey, setXAxisKey] = useState("Event Type");
  const [metric, setMetric] = useState("Wastage Food Amount");
  const [dynamicData, setDynamicData] = useState([]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [xAxisKey, metric]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/food");
      const data = await res.json();

      if (!data.length) return;

      const latestData = [...data].reverse();

      let totalQty = 0;
      let totalWaste = 0;
      let percentSum = 0;

      const graph = latestData.slice(0, 20).map((item, i) => {
        const q = Number(item["Quantity of Food"]) || 0;
        const w = Number(item["Wastage Food Amount"]) || 0;

        const percent = q ? (w / q) * 100 : 0;

        totalQty += q;
        totalWaste += w;
        percentSum += percent;

        return {
          index: i + 1,
          quantity: q,
          waste: w,
          wastePercent: percent.toFixed(1),
        };
      });

      // 🔥 Dynamic Chart Calculation
      const dynamicMap = {};

      latestData.forEach((item) => {
        const key = item[xAxisKey] || "Unknown";
        const value = Number(item[metric]) || 0;

        if (!dynamicMap[key]) dynamicMap[key] = 0;

        dynamicMap[key] += value;
      });

      const dynamicChart = Object.keys(dynamicMap).map((k) => ({
        name: k,
        value: dynamicMap[k],
      }));

      setDynamicData(dynamicChart);

      setTotal(totalQty);
      setWaste(totalWaste);
      setSaved(totalQty - totalWaste);
      setChartData(graph);

      setAvgWastePercent((percentSum / graph.length).toFixed(1));

      setPieData([
        { name: "Consumed", value: totalQty - totalWaste },
        { name: "Wasted", value: totalWaste },
      ]);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("[ERROR] Fetch error:", err);
    }
  };

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <h1 style={title}>Food Waste Analytics Dashboard</h1>
          <p style={updateText}>Last Updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Cards */}
      <div style={grid}>
        <Card
          title="Total Food"
          value={`${total} kg`}
          color="#3b82f6"
          icon={<Package size={24} />}
          trend="+5%"
        />
        <Card
          title="Total Waste"
          value={`${waste} kg`}
          color="#ef4444"
          icon={<AlertTriangle size={24} />}
          trend="-12%"
          positive
        />
        <Card
          title="Food Saved"
          value={`${saved} kg`}
          color="#22c55e"
          icon={<TrendingUp size={24} />}
          trend="+8%"
          positive
        />
        <Card
          title="Avg Waste %"
          value={`${avgWastePercent}%`}
          color="#f59e0b"
          icon={<TrendingDown size={24} />}
          trend="-3%"
          positive
        />
      </div>

      {/* 🔥 Dynamic Controls */}
      <div style={controls}>
        <div style={controlGroup}>
          <label style={controlLabel}>X-Axis: </label>
          <select
            value={xAxisKey}
            onChange={(e) => setXAxisKey(e.target.value)}
            style={select}
          >
            <option>Event Type</option>
            <option>Seasonality</option>
            <option>Geographical Location</option>
            <option>Pricing</option>
            <option>Preparation Method</option>
          </select>
        </div>

        <div style={controlGroup}>
          <label style={controlLabel}>Metric: </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            style={select}
          >
            <option value="Wastage Food Amount">Waste</option>
            <option value="Quantity of Food">Quantity</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div style={chartGrid}>
        {/* Waste Trend */}
        <div style={card}>
          <h3 style={cardTitle}>Waste Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="waste"
                stroke="#ef4444"
                strokeWidth={3}
              />
              <XAxis dataKey="index" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={tooltipStyle} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Food vs Waste */}
         <div style={card}>
          <h3 style={cardTitle}>Food vs Waste</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="index" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="quantity" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="waste" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🔥 Dynamic Chart */}
        <div style={card}>
          <h3 style={cardTitle}>Dynamic Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dynamicData}>
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div style={card}>
          <h3 style={cardTitle}>Waste Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80} label>
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable />
    </div>
  );
}

// Card
function Card({ title, value, color, icon, trend, positive }) {
  return (
    <div style={{ ...card, border: `1px solid ${color}30` }}>
      <div style={cardHeader}>
        <div style={{ ...iconBox, background: `${color}20`, color }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={cardTitleSmall}>{title}</h3>
          <p style={{ ...number, color }}>{value}</p>
        </div>
        {trend && (
          <div
            style={{ ...trendBadge, color: positive ? "#22c55e" : "#ef4444" }}
          >
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const container = {
  padding: "30px",
  background: "#0f172a",
  color: "white",
  minHeight: "100vh",
};

const header = {
  marginBottom: "30px",
};

const title = {
  fontSize: "32px",
  marginBottom: "5px",
  fontWeight: "700",
  color: "white",
};

const updateText = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "14px",
  margin: 0,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const controls = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
};

const controlGroup = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const controlLabel = {
  color: "white",
  fontSize: "14px",
  fontWeight: "500",
};

const select = {
  background: "#1e293b",
  color: "white",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "10px 15px",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
  outline: "none",
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const card = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const iconBox = {
  padding: "12px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardTitleSmall = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.6)",
  margin: "0 0 5px 0",
  fontWeight: "500",
};

const number = {
  fontSize: "28px",
  fontWeight: "700",
  margin: 0,
};

const trendBadge = {
  fontSize: "14px",
  fontWeight: "600",
};

const cardTitle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "20px",
  color: "white",
};

const tooltipStyle = {
  background: "#1e293b",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  color: "white",
};
