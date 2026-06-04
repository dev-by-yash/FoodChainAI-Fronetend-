import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Materials from "./components/Materials";
import Predictions from "./components/Predictions";
import Analysis from "./components/Analysis";
import AddData from "./components/AddData";
import ScanBill from "./components/ScanBill";
import NGO from "./components/NGO";

function App() {
  return (
    <BrowserRouter>
      <div style={{ background: "#0f172a", minHeight: "100vh" }}>
        <Navbar />

        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/add" element={<AddData />} />
            <Route path="/scan" element={<ScanBill />} />
            <Route path="/ngo" element={<NGO />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;