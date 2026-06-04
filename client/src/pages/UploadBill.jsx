import { useState } from "react";
import axios from "axios";

export default function UploadBill() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    // ✅ Allow only images
    if (!selected.type.startsWith("image/")) {
      alert("Please upload an IMAGE only (jpg, png) [IMG]");
      return;
    }

    setFile(selected);
  };

  const upload = async () => {
    if (!file) {
      alert("Please select a file ❗");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("bill", file);

      const res = await axios.post(
        "https://foodchainai-server.onrender.com/api/food/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Response:", res.data);
      alert("✅ Bill processed & items added");
    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err.message);

      const msg =
        err.response?.data?.details ||
        err.response?.data?.error ||
        "Upload failed ❌";

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow w-96 text-center">
        <h2 className="text-xl font-bold mb-4">📸 Upload Bill</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          onClick={upload}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Upload Bill"}
        </button>
      </div>
    </div>
  );
}
