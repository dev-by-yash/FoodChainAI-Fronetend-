import { useState } from "react";
import axios from "axios";
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react";

export default function OCRUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState("");
  const [extractedItems, setExtractedItems] = useState([]);
  const [saved, setSaved] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setRawText("");
      setExtractedItems([]);
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

    try {
      const formData = new FormData();
      formData.append("bill", file);

      const response = await axios.post("/api/ocr/scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("OCR Response:", response.data);

      setRawText(response.data.rawText);
      setExtractedItems(response.data.extractedItems);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("OCR failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Save extracted items to database
  const handleSave = async () => {
    if (extractedItems.length === 0) {
      alert("No items to save");
      return;
    }

    try {
      const response = await axios.post("/api/ocr/save", {
        items: extractedItems,
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
      {file && !loading && extractedItems.length === 0 && (
        <button onClick={handleScan} style={scanButton}>
          [SCAN] Scan Bill
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div style={loadingSection}>
          <Loader size={32} color="#22c55e" className="spin" />
          <p>Processing OCR... Please wait</p>
        </div>
      )}

      {/* Extracted Items */}
      {extractedItems.length > 0 && (
        <div style={resultsSection}>
          <h3 style={resultsTitle}>
            <CheckCircle size={24} color="#22c55e" />
            Extracted Items ({extractedItems.length})
          </h3>

          <div style={itemsGrid}>
            {extractedItems.map((item, idx) => (
              <div key={idx} style={itemCard}>
                <div style={itemName}>{item.name}</div>
                <div style={itemQuantity}>{item.quantity} kg</div>
              </div>
            ))}
          </div>

          {!saved && (
            <button onClick={handleSave} style={saveButton}>
              [SAVE] Save to Database
            </button>
          )}

          {saved && (
            <div style={successMessage}>
              <CheckCircle size={20} color="#22c55e" />
              <span>Items saved successfully!</span>
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
