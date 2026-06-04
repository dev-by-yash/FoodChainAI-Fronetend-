import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, TrendingUp, Plus, Scan, Heart, Package, Brain } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/materials", label: "Materials", icon: Package },
    { path: "/predictions", label: "AI Predictions", icon: Brain },
    { path: "/analysis", label: "Analysis", icon: TrendingUp },
    { path: "/add", label: "Add Data", icon: Plus },
    { path: "/scan", label: "Scan Bill", icon: Scan },
    { path: "/ngo", label: "Donations", icon: Heart },
  ];

  return (
    <nav style={navContainer}>
      <div style={navContent}>
        <div style={logoSection}>
          <Package size={32} color="#22c55e" />
          <h2 style={logoText}>FoodChain AI</h2>
        </div>
        
        <div style={navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...navLink,
                  ...(isActive(item.path) ? activeNavLink : {}),
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

const navContainer = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const navContent = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "0 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "70px",
};

const logoSection = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logoText = {
  color: "white",
  fontSize: "24px",
  fontWeight: "700",
  margin: 0,
  background: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const navLinks = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const navLink = {
  color: "rgba(255, 255, 255, 0.7)",
  textDecoration: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

const activeNavLink = {
  background: "rgba(34, 197, 94, 0.15)",
  color: "#22c55e",
  boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)",
};