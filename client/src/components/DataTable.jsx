import { useEffect, useState } from "react";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/food");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter data
  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  if (data.length === 0) return <p>Loading data...</p>;

  // Get column names dynamically
  const columns = Object.keys(data[0]);

  
}

// Styles
const thStyle = {
  border: "1px solid #334155",
  padding: "10px",
  textAlign: "left",
  background: "#0f172a"
};

const tdStyle = {
  border: "1px solid #334155",
  padding: "8px"
};