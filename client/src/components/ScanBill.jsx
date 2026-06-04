import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, CheckCircle, Loader, AlertCircle } from "lucide-react";

export default function ScanBill() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState("");
  const [billData, setBillData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");

  // Check server status on mount
  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    try {
      await axios.get("/api/food");
      setServerStatus("online");
    } catch (error) {
      setServerStatus("offline");
      console.error("Server check failed:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setRawText("");
      setBillData(null);
      setSaved(false);
    }
  };

  // Scan bill with OCR
  const handleScan = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);
    console.log("Starting OCR scan...");

    try {
      const formData = new FormData();
      formData.append("bill", file);

      console.log("Sending request to /api/ocr/scan");

      const response = await axios.post("/api/ocr/scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 second timeout
      });

      console.log("OCR Response:", response.data);

      if (response.data.success) {
        setRawText(response.data.rawText);
        setBillData(response.data.billData);

        if (
          !response.data.billData ||
          response.data.billData["Quantity of Food"] === 0
        ) {
          alert("No data extracted. Please check the raw OCR text below.");
        }
      } else {
        alert("OCR completed but no data extracted");
      }
    } catch (error) {
      console.error("OCR Error:", error);

      if (error.code === "ECONNABORTED") {
        alert(
          "Request timeout. OCR is taking too long. Try a smaller/clearer image.",
        );
      } else if (error.response) {
        alert(
          "Server error: " + (error.response?.data?.error || error.message),
        );
      } else if (error.request) {
        alert(
          "Cannot connect to server. Make sure backend is running on port 5000.",
        );
      } else {
        alert("OCR failed: " + error.message);
      }
    } finally {
      setLoading(false);
      console.log("OCR scan completed");
    }
  };

  // Save extracted bill data to database
  const handleSave = async () => {
    if (!billData) {
      alert("No data to save");
      return;
    }

    try {
      const response = await axios.post("/api/ocr/save", {
        billData: billData,
      });

      console.log("Save Response:", response.data);
      alert(response.data.message);
      setSaved(true);
    } catch (error) {
      console.error("Save Error:", error);
      alert(
        "Failed to save: " + (error.response?.data?.error || error.message),
      );
    }
  };

  return (
    <div style={container}>
      <h1 style={title}>📸 OCR Bill Scanner</h1>
      <p style={subtitle}>Upload a bill image to extract material data</p>

      {/* Server Status */}
      {serverStatus === "offline" && (
        <div style={errorBanner}>
          <AlertCircle size={20} />
          <span>
            Backend server is offline. Please start the server on port 5000.
          </span>
        </div>
      )}

      {serverStatus === "online" && (
        <div style={successBanner}>
          <CheckCircle size={20} />
          <span>Server connected</span>
        </div>
      )}

      {/* Upload Section */}
      <div style={uploadSection}>
        <label style={uploadLabel}>
          <Upload size={48} color="#22c55e" />
          <span style={uploadText}>Click to upload bill image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {file && (
          <div style={fileInfo}>
            <CheckCircle size={20} color="#22c55e" />
            <span>{file.name}</span>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div style={previewSection}>
          <img src={preview} alt="Bill preview" style={previewImage} />
        </div>
      )}

      {/* Scan Button */}
      {file && !loading && !billData && (
        <button onClick={handleScan} style={scanButton}>
          [SCAN] Scan Bill
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div style={loadingSection}>
          <Loader
            size={32}
            color="#22c55e"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <p>Processing OCR... Please wait</p>
        </div>
      )}

      {/* Extracted Bill Data */}
      {billData && (
        <div style={resultsSection}>
          <h3 style={resultsTitle}>
            <CheckCircle size={24} color="#22c55e" />
            Extracted Bill Data
          </h3>

          <div style={dataGrid}>
            <DataField label="Event Type" value={billData["Event Type"]} />
            <DataField
              label="Location"
              value={billData["Geographical Location"]}
            />
            <DataField
              label="Type of Food"
              value={billData["Purchase History"]}
            />
            <DataField label="Quantity" value={billData["Quantity of Food"]} />
            <DataField
              label="Wastage Amount"
              value={billData["Wastage Food Amount"]}
            />
            <DataField label="Price" value={billData["Pricing"]} />
            <DataField
              label="Bill Info"
              value={billData["Storage Conditions"]}
            />
            <DataField label="Date" value={billData["Seasonality"]} />
          </div>

          {!saved && (
            <button onClick={handleSave} style={saveButton}>
              [SAVE] Save to Database
            </button>
          )}

          {saved && (
            <div style={successMessage}>
              <CheckCircle size={20} color="#22c55e" />
              <span>Bill data saved successfully! Check the dashboard.</span>
            </div>
          )}
        </div>
      )}

      {/* Raw Text (Optional) */}
      {rawText && (
        <details style={detailsSection}>
          <summary style={detailsSummary}>View Raw OCR Text</summary>
          <pre style={rawTextBox}>{rawText}</pre>
        </details>
      )}
    </div>
  );
}

// DataField Component
function DataField({ label, value }) {
  return (
    <div style={dataField}>
      <span style={dataLabel}>{label}:</span>
      <span style={dataValue}>{value || "N/A"}</span>
    </div>
  );
}

// Styles
const container = {
  minHeight: "100vh",
  background: "#0f172a",
  padding: "30px",
  color: "white",
};

const title = {
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 5px 0",
};

const subtitle = {
  color: "rgba(255, 255, 255, 0.6)",
  margin: "0 0 30px 0",
};

const uploadSection = {
  marginBottom: "30px",
};

const uploadLabel = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
  padding: "60px",
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "2px dashed rgba(34, 197, 94, 0.5)",
  borderRadius: "16px",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const uploadText = {
  fontSize: "16px",
  color: "rgba(255, 255, 255, 0.8)",
};

const fileInfo = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "15px",
  padding: "12px 20px",
  background: "rgba(34, 197, 94, 0.15)",
  borderRadius: "8px",
  color: "#22c55e",
};

const previewSection = {
  marginBottom: "30px",
  textAlign: "center",
};

const previewImage = {
  maxWidth: "400px",
  maxHeight: "400px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const scanButton = {
  width: "100%",
  padding: "15px",
  background: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "30px",
};

const loadingSection = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
  padding: "40px",
  color: "rgba(255, 255, 255, 0.7)",
};

const resultsSection = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "30px",
};

const resultsTitle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "20px",
};

const dataGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px",
  marginBottom: "20px",
};

const dataField = {
  background: "rgba(255, 255, 255, 0.05)",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const dataLabel = {
  display: "block",
  fontSize: "12px",
  color: "rgba(255, 255, 255, 0.6)",
  marginBottom: "5px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const dataValue = {
  display: "block",
  fontSize: "16px",
  color: "white",
  fontWeight: "600",
};

const itemsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "15px",
  marginBottom: "20px",
};

const itemCard = {
  background: "rgba(34, 197, 94, 0.1)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
};

const itemName = {
  fontSize: "18px",
  fontWeight: "600",
  color: "white",
  marginBottom: "8px",
};

const itemQuantity = {
  fontSize: "16px",
  color: "#22c55e",
  fontWeight: "500",
};

const saveButton = {
  width: "100%",
  padding: "15px",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const successMessage = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "15px",
  background: "rgba(34, 197, 94, 0.15)",
  borderRadius: "8px",
  color: "#22c55e",
  fontWeight: "600",
};

const detailsSection = {
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  padding: "15px",
};

const detailsSummary = {
  cursor: "pointer",
  fontWeight: "600",
  marginBottom: "10px",
};

const rawTextBox = {
  background: "#000",
  padding: "15px",
  borderRadius: "8px",
  color: "#22c55e",
  fontSize: "12px",
  overflow: "auto",
  maxHeight: "200px",
};

const errorBanner = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "15px",
  background: "rgba(239, 68, 68, 0.15)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
  borderRadius: "8px",
  color: "#ef4444",
  marginBottom: "20px",
  fontWeight: "500",
};

const successBanner = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px",
  background: "rgba(34, 197, 94, 0.15)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "8px",
  color: "#22c55e",
  marginBottom: "20px",
  fontSize: "14px",
};
