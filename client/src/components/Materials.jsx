import { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
} from "lucide-react";
import axios from "axios";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
    const interval = setInterval(fetchMaterials, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMaterials = async () => {
    try {
      // Fetch real data from database
      const response = await axios.get("/api/food");
      const data = response.data;

      // Group by food type and calculate totals
      const materialMap = {};

      data.forEach((item) => {
        const name = item["Purchase History"] || "Unknown";
        const quantity = Number(item["Quantity of Food"]) || 0;
        const waste = Number(item["Wastage Food Amount"]) || 0;

        if (!materialMap[name]) {
          materialMap[name] = {
            name,
            purchased: 0,
            used: 0,
            waste: 0,
            wastePercent: 0,
            trend: "stable",
            count: 0,
          };
        }

        materialMap[name].purchased += quantity;
        materialMap[name].waste += waste;
        materialMap[name].used += quantity - waste;
        materialMap[name].count += 1;
      });

      // Calculate percentages and trends
      const materialsArray = Object.values(materialMap).map((m) => {
        m.wastePercent = m.purchased > 0 ? (m.waste / m.purchased) * 100 : 0;
        // Simple trend based on waste percentage
        m.trend =
          m.wastePercent > 15 ? "up" : m.wastePercent < 10 ? "down" : "stable";
        return m;
      });

      setMaterials(materialsArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    if (filter === "high-waste") return m.wastePercent > 15;
    if (filter === "low-waste") return m.wastePercent <= 15;
    return true;
  });

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <h1 style={title}>Raw Materials</h1>
          <p style={subtitle}>Track and manage your inventory</p>
        </div>
        <button style={addButton} onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Add Material
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={filterTabs}>
        <button
          style={{ ...filterTab, ...(filter === "all" ? activeFilterTab : {}) }}
          onClick={() => setFilter("all")}
        >
          All Materials
        </button>
        <button
          style={{
            ...filterTab,
            ...(filter === "high-waste" ? activeFilterTab : {}),
          }}
          onClick={() => setFilter("high-waste")}
        >
          High Waste
        </button>
        <button
          style={{
            ...filterTab,
            ...(filter === "low-waste" ? activeFilterTab : {}),
          }}
          onClick={() => setFilter("low-waste")}
        >
          Low Waste
        </button>
      </div>

      {/* Materials Grid */}
      <div style={grid}>
        {filteredMaterials.map((material) => (
          <MaterialCard key={material.name} material={material} />
        ))}
      </div>
    </div>
  );
}

function MaterialCard({ material }) {
  const getTrendIcon = () => {
    if (material.trend === "up")
      return <TrendingUp size={20} color="#ef4444" />;
    if (material.trend === "down")
      return <TrendingDown size={20} color="#22c55e" />;
    return <div style={{ width: 20, height: 20 }} />;
  };

  const getWasteColor = () => {
    if (material.wastePercent > 15) return "#ef4444";
    if (material.wastePercent > 10) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div style={card}>
      <div style={cardHeader}>
        <div style={materialIcon}>
          <Package size={24} color="#22c55e" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={materialName}>{material.name}</h3>
          <div style={trendBadge}>
            {getTrendIcon()}
            <span style={{ fontSize: "12px", opacity: 0.8 }}>
              {material.trend === "up"
                ? "Increasing"
                : material.trend === "down"
                  ? "Decreasing"
                  : "Stable"}
            </span>
          </div>
        </div>
        {material.wastePercent > 15 && (
          <AlertTriangle size={20} color="#ef4444" />
        )}
      </div>

      <div style={statsGrid}>
        <div style={stat}>
          <span style={statLabel}>Purchased</span>
          <span style={statValue}>{material.purchased} kg</span>
        </div>
        <div style={stat}>
          <span style={statLabel}>Used</span>
          <span style={statValue}>{material.used} kg</span>
        </div>
        <div style={stat}>
          <span style={statLabel}>Waste</span>
          <span style={{ ...statValue, color: getWasteColor() }}>
            {material.waste} kg
          </span>
        </div>
      </div>

      <div style={progressBar}>
        <div
          style={{
            ...progressFill,
            width: `${material.wastePercent}%`,
            background: getWasteColor(),
          }}
        />
      </div>
      <p style={wasteText}>
        <span style={{ color: getWasteColor(), fontWeight: "600" }}>
          {material.wastePercent.toFixed(1)}%
        </span>{" "}
        waste rate
      </p>
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

const addButton = {
  background: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
  transition: "all 0.3s ease",
};

const filterTabs = {
  display: "flex",
  gap: "10px",
  marginBottom: "30px",
};

const filterTab = {
  background: "rgba(255, 255, 255, 0.05)",
  color: "rgba(255, 255, 255, 0.7)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const activeFilterTab = {
  background: "rgba(34, 197, 94, 0.15)",
  color: "#22c55e",
  borderColor: "#22c55e",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "20px",
};

const card = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  transition: "all 0.3s ease",
};

const cardHeader = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "20px",
};

const materialIcon = {
  background: "rgba(34, 197, 94, 0.15)",
  padding: "12px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const materialName = {
  color: "white",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 5px 0",
};

const trendBadge = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: "rgba(255, 255, 255, 0.7)",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "15px",
  marginBottom: "20px",
};

const stat = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const statLabel = {
  fontSize: "12px",
  color: "rgba(255, 255, 255, 0.5)",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const statValue = {
  fontSize: "18px",
  color: "white",
  fontWeight: "600",
};

const progressBar = {
  width: "100%",
  height: "8px",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "4px",
  overflow: "hidden",
  marginBottom: "10px",
};

const progressFill = {
  height: "100%",
  transition: "width 0.3s ease",
  borderRadius: "4px",
};

const wasteText = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.7)",
  margin: 0,
};
