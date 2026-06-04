import { useState, useEffect } from "react";
import { Heart, MapPin, Phone, Mail, Package, Send } from "lucide-react";

export default function NGO() {
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [foodTypes, setFoodTypes] = useState([]);
  const [availableWaste, setAvailableWaste] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    ngo: "",
    typeOfFood: "",
    quantity: "",
    date: new Date().toISOString().split("T")[0], // Default to today
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Statistics state
  const [statistics, setStatistics] = useState({
    totalDonated: 0,
    ngoPartners: 0,
    thisMonth: 0,
    livesImpacted: 0,
  });
  // 🔽 Default fallback food types
  const defaultFoodTypes = [
    "Cooked Food",
    "Raw Vegetables",
    "Fruits",
    "Dairy Products",
    "Bakery Items",
    "Packaged Food",
    "Rice & Grains",
    "Sweets",
  ];

  // 🔽 Merge API + fallback
  const combinedFoodTypes = foodTypes.length > 0 ? foodTypes : defaultFoodTypes;

  // API base URL
  const API_BASE_URL = "https://foodchainai-server.onrender.com";

  // Fetch NGOs from API
  const fetchNGOs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/ngos`);

      if (!response.ok) {
        throw new Error(`Failed to fetch NGOs: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setNgos(data.data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching NGOs:", err);
      setError(`Unable to load NGOs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations from API
  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/donations`);

      if (!response.ok) {
        throw new Error(`Failed to fetch donations: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setDonations(data.data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError(`Unable to load donations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableWaste = async (typeOfFood) => {
    if (!typeOfFood || typeOfFood.trim() === "") {
      setAvailableWaste(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/waste/material/${encodeURIComponent(typeOfFood)}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch waste data: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setAvailableWaste(data.totalWaste ?? 0);
      } else {
        setAvailableWaste(0);
      }
    } catch (err) {
      console.error("Error fetching waste availability:", err);
      setAvailableWaste(null);
    }
  };

  const fetchFoodTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/waste/types`);
      if (!response.ok) {
        throw new Error(`Failed to fetch food types: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.types)) {
        setFoodTypes(data.types);
      } else {
        setFoodTypes([]);
      }
    } catch (err) {
      console.error("Error fetching food types:", err);
      setFoodTypes([]);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchNGOs();
    fetchDonations();
    fetchFoodTypes();
  }, []);

  useEffect(() => {
    if (formData.typeOfFood && formData.typeOfFood.trim() !== "") {
      fetchAvailableWaste(formData.typeOfFood);
    } else {
      setAvailableWaste(null);
    }
  }, [formData.typeOfFood]);

  // Calculate statistics whenever donations change
  useEffect(() => {
    calculateStatistics();
  }, [donations]);

  // Calculate statistics from donations data
  const calculateStatistics = () => {
    if (!donations || donations.length === 0) {
      setStatistics({
        totalDonated: 0,
        ngoPartners: 0,
        thisMonth: 0,
        livesImpacted: 0,
      });
      return;
    }

    // Calculate total donated quantity by summing all donatedQuantity values
    const totalDonated = donations.reduce((sum, donation) => {
      return sum + (donation.donatedQuantity || 0);
    }, 0);

    // Count unique recipient NGOs from donations array
    const uniqueRecipients = new Set(
      donations.map((donation) => donation.recipient),
    );
    const ngoPartners = uniqueRecipients.size;

    // Calculate current month donations by filtering by date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const thisMonth = donations
      .filter((donation) => {
        const donationDate = new Date(donation.date);
        return (
          donationDate.getMonth() === currentMonth &&
          donationDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, donation) => {
        return sum + (donation.donatedQuantity || 0);
      }, 0);

    // Calculate lives impacted by multiplying total quantity by 2
    const livesImpacted = totalDonated * 2;

    setStatistics({
      totalDonated,
      ngoPartners,
      thisMonth,
      livesImpacted,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    setShowDonateModal(false);
    setFormData({
      ngo: "",
      typeOfFood: "",
      quantity: "",
      date: new Date().toISOString().split("T")[0],
    });
    setFormErrors({});
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!formData.ngo || formData.ngo.trim() === "") {
      errors.ngo = "Please select an NGO";
    }

    if (!formData.typeOfFood || formData.typeOfFood.trim() === "") {
      errors.typeOfFood = "Please select the type of food";
    }

    if (!formData.quantity || formData.quantity === "") {
      errors.quantity = "Please enter a quantity";
    } else if (parseFloat(formData.quantity) <= 0) {
      errors.quantity = "Quantity must be greater than 0";
    } else if (
      availableWaste !== null &&
      availableWaste !== undefined &&
      parseFloat(formData.quantity) > availableWaste
    ) {
      errors.quantity = `Only ${availableWaste.toFixed(1)} kg of waste is available for ${formData.typeOfFood}.`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          typeOfFood: formData.typeOfFood,
          materialName: formData.typeOfFood,
          donatedQuantity: parseFloat(formData.quantity),
          recipient: formData.ngo,
          date: formData.date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to create donation: ${response.status}`,
        );
      }

      const data = await response.json();

      if (data.success) {
        // Close modal and reset form
        handleCancel();

        // Refresh donation history
        await fetchDonations();
      } else {
        throw new Error("Failed to create donation");
      }
    } catch (err) {
      console.error("Error creating donation:", err);
      setError(`Unable to create donation: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const displayedDonations = showAllDonations
    ? donations
    : donations.slice(0, 6);

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <h1 style={title}>Donation Management</h1>
          <p style={subtitle}>
            Connect with NGOs and reduce waste through donations
          </p>
        </div>
        <button style={donateButton} onClick={() => setShowDonateModal(true)}>
          <Send size={20} />
          New Donation
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={errorBanner}>
          <span style={errorIcon}>!</span>
          <span style={errorText}>{error}</span>
          <button style={errorCloseButton} onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={loadingBanner}>
          <span style={loadingText}>Loading data...</span>
        </div>
      )}

      {/* Stats */}
      <div style={statsGrid}>
        <StatCard
          title="Total Donated"
          value={`${statistics.totalDonated.toFixed(1)} kg`}
          icon="[]"
          color="#22c55e"
        />
        <StatCard
          title="NGO Partners"
          value={statistics.ngoPartners.toString()}
          icon="[=]"
          color="#3b82f6"
        />
        <StatCard
          title="This Month"
          value={`${statistics.thisMonth.toFixed(1)} kg`}
          icon="[D]"
          color="#f59e0b"
        />
        <StatCard
          title="Lives Impacted"
          value={`~${Math.round(statistics.livesImpacted)}`}
          icon="[*]"
          color="#ef4444"
        />
      </div>

      {/* Recent Donations */}
      <div style={section}>
        <h2 style={sectionTitle}>Recent Donations</h2>
        {donations.length === 0 ? (
          <div style={emptyState}>
            <Package size={48} color="rgba(255, 255, 255, 0.3)" />
            <p style={emptyStateText}>No donation history</p>
            <p style={emptyStateSubtext}>
              Start making a difference by creating your first donation
            </p>
          </div>
        ) : (
          <>
            <div style={donationsGrid}>
              {displayedDonations.map((donation) => (
                <DonationCard
                  key={donation._id || donation.id}
                  donation={donation}
                />
              ))}
            </div>
            {donations.length > 6 && (
              <div style={seeMoreContainer}>
                <button
                  type="button"
                  style={seeMoreButton}
                  onClick={() => setShowAllDonations((prev) => !prev)}
                >
                  {showAllDonations ? "Show less" : "See more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* NGO Partners */}
      <div style={section}>
        <h2 style={sectionTitle}>NGO Partners</h2>
        <div style={ngosGrid}>
          {ngos.map((ngo, idx) => (
            <NGOCard key={idx} ngo={ngo} />
          ))}
        </div>
      </div>

      {/* Donation Form Modal */}
      {showDonateModal && (
        <div style={modalOverlay} onClick={handleCancel}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h2 style={modalTitle}>New Donation</h2>
              <button style={modalCloseButton} onClick={handleCancel}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NGO Dropdown */}
              <div style={formGroup}>
                <label style={formLabel}>Select NGO *</label>
                <select
                  name="ngo"
                  value={formData.ngo}
                  onChange={handleInputChange}
                  style={{
                    ...formInput,
                    ...(formErrors.ngo ? formInputError : {}),
                  }}
                >
                  <option value="">-- Select an NGO --</option>
                  {ngos.map((ngo, idx) => (
                    <option key={idx} value={ngo.name}>
                      {ngo.name}
                    </option>
                  ))}
                </select>
                {formErrors.ngo && (
                  <span style={errorMessage}>{formErrors.ngo}</span>
                )}
              </div>

              {/* Food Type Input */}
              {/* Food Type Input */}
              <div style={formGroup}>
                <label style={formLabel}>Type of Food *</label>

                <select
                  name="typeOfFood"
                  value={formData.typeOfFood}
                  onChange={handleInputChange}
                  style={{
                    ...formInput,
                    ...(formErrors.typeOfFood ? formInputError : {}),
                  }}
                >
                  <option value="">-- Select food type --</option>

                  {/* 🍽️ Cooked Items */}

                  <option value="Rice">Rice</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burger">Burger</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Fried Rice">Fried Rice</option>

                  {/* 🥦 Raw Materials */}

                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>

                  {/* 📊 Dynamic API */}
                </select>

                {formErrors.typeOfFood && (
                  <span style={errorMessage}>{formErrors.typeOfFood}</span>
                )}
              </div>

              {/* Quantity Input */}
              <div style={formGroup}>
                <label style={formLabel}>Quantity (kg) *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Quantity in kg"
                  min="0.1"
                  step="0.1"
                  max={availableWaste ?? undefined}
                  style={{
                    ...formInput,
                    ...(formErrors.quantity ? formInputError : {}),
                  }}
                />
                {availableWaste !== null && availableWaste !== undefined && (
                  <span style={hintMessage}>
                    Available waste for {formData.typeOfFood || "selected food"}
                    : {availableWaste.toFixed(1)} kg
                  </span>
                )}
                {formErrors.quantity && (
                  <span style={errorMessage}>{formErrors.quantity}</span>
                )}
              </div>

              {/* Date Picker */}
              <div style={formGroup}>
                <label style={formLabel}>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  style={{
                    ...formInput,
                    ...(formErrors.date ? formInputError : {}),
                  }}
                />
                {formErrors.date && (
                  <span style={errorMessage}>{formErrors.date}</span>
                )}
              </div>

              {/* Form Buttons */}
              <div style={formButtons}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={cancelButton}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={submitButton}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Donation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={statCard}>
      <div style={{ ...statIcon, background: `${color}20`, color }}>{icon}</div>
      <div>
        <p style={statTitle}>{title}</p>
        <h3 style={statValue}>{value}</h3>
      </div>
    </div>
  );
}

function DonationCard({ donation }) {
  // Map API response format to component format
  const foodType =
    donation.materialName || donation.foodItem || donation.material;
  const quantity = donation.donatedQuantity || donation.quantity;
  const ngo = donation.recipient || donation.ngo;
  const date = donation.date;

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div style={donationCard}>
      <div style={donationHeader}>
        <Package size={20} color="#22c55e" />
        <span style={donationMaterial}>{foodType}</span>
      </div>
      <div style={donationDetails}>
        <p style={donationInfo}>
          <strong>Quantity:</strong> {quantity} kg
        </p>
        <p style={donationInfo}>
          <strong>NGO:</strong> {ngo}
        </p>
        <p style={donationInfo}>
          <strong>Date:</strong> {formatDate(date)}
        </p>
      </div>
    </div>
  );
}

function NGOCard({ ngo }) {
  return (
    <div style={ngoCard}>
      <div style={ngoHeader}>
        <Heart size={24} color="#ef4444" fill="#ef4444" />
        <div style={{ flex: 1 }}>
          <h3 style={ngoName}>{ngo.name}</h3>
          <div style={rating}>
            {"*".repeat(Math.floor(ngo.rating))} {ngo.rating}
          </div>
        </div>
      </div>

      <div style={ngoDetails}>
        <div style={ngoDetailItem}>
          <MapPin size={16} color="rgba(255,255,255,0.6)" />
          <span>{ngo.location}</span>
        </div>
        <div style={ngoDetailItem}>
          <Phone size={16} color="rgba(255,255,255,0.6)" />
          <span>{ngo.phone}</span>
        </div>
        <div style={ngoDetailItem}>
          <Mail size={16} color="rgba(255,255,255,0.6)" />
          <span>{ngo.email}</span>
        </div>
      </div>

      <div style={materialsSection}>
        <p style={materialsLabel}>Accepts:</p>
        <div style={materialTags}>
          {(ngo.materialsAccepted || ngo.materials || []).map(
            (material, idx) => (
              <span key={idx} style={materialTag}>
                {material}
              </span>
            ),
          )}
        </div>
      </div>

      <button style={contactButton}>
        <Send size={16} />
        Contact NGO
      </button>
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

const donateButton = {
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
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
  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "40px",
};

const statCard = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const statIcon = {
  fontSize: "28px",
  padding: "12px",
  borderRadius: "12px",
};

const statTitle = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "14px",
  margin: "0 0 5px 0",
};

const statValue = {
  color: "white",
  fontSize: "24px",
  fontWeight: "700",
  margin: 0,
};

const section = {
  marginBottom: "40px",
};

const sectionTitle = {
  color: "white",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 20px 0",
};

const donationsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
};

const donationCard = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const donationHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
};

const donationMaterial = {
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  flex: 1,
};

const statusBadge = {
  padding: "4px 12px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "capitalize",
};

const donationDetails = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const donationInfo = {
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "14px",
  margin: 0,
};

const ngosGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "20px",
};

const ngoCard = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const ngoHeader = {
  display: "flex",
  alignItems: "flex-start",
  gap: "15px",
  marginBottom: "20px",
};

const ngoName = {
  color: "white",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 5px 0",
};

const rating = {
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "14px",
};

const ngoDetails = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "20px",
};

const ngoDetailItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "14px",
};

const materialsSection = {
  marginBottom: "20px",
};

const materialsLabel = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "12px",
  margin: "0 0 10px 0",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const materialTags = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const materialTag = {
  background: "rgba(34, 197, 94, 0.15)",
  color: "#22c55e",
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "500",
};

const contactButton = {
  width: "100%",
  background: "rgba(239, 68, 68, 0.15)",
  color: "#ef4444",
  border: "1px solid #ef4444",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.3s ease",
};

const errorBanner = {
  background: "rgba(239, 68, 68, 0.15)",
  border: "1px solid #ef4444",
  borderRadius: "12px",
  padding: "16px 20px",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const errorIcon = {
  fontSize: "20px",
};

const errorText = {
  color: "#ef4444",
  fontSize: "14px",
  flex: 1,
};

const errorCloseButton = {
  background: "transparent",
  border: "none",
  color: "#ef4444",
  fontSize: "18px",
  cursor: "pointer",
  padding: "0 8px",
};

const loadingBanner = {
  background: "rgba(59, 130, 246, 0.15)",
  border: "1px solid #3b82f6",
  borderRadius: "12px",
  padding: "16px 20px",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const loadingText = {
  color: "#3b82f6",
  fontSize: "14px",
  fontWeight: "500",
};

// Modal Styles
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalContent = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "30px",
  maxWidth: "500px",
  width: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

const modalTitle = {
  color: "white",
  fontSize: "24px",
  fontWeight: "600",
  margin: 0,
};

const modalCloseButton = {
  background: "transparent",
  border: "none",
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "24px",
  cursor: "pointer",
  padding: "0",
  width: "30px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  transition: "all 0.2s ease",
};

const formGroup = {
  marginBottom: "20px",
};

const formLabel = {
  display: "block",
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "14px",
  fontWeight: "500",
  marginBottom: "8px",
};

const formInput = {
  width: "100%",
  background: "rgba(15, 23, 42, 0.6)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  padding: "12px 16px",
  color: "white",
  fontSize: "14px",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
};

const formInputError = {
  borderColor: "#ef4444",
};

const errorMessage = {
  display: "block",
  color: "#ef4444",
  fontSize: "12px",
  marginTop: "6px",
};

const formButtons = {
  display: "flex",
  gap: "12px",
  marginTop: "30px",
};

const cancelButton = {
  flex: 1,
  background: "rgba(255, 255, 255, 0.05)",
  color: "rgba(255, 255, 255, 0.7)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const submitButton = {
  flex: 1,
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
  transition: "all 0.2s ease",
};

const emptyState = {
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "60px 40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
};

const emptyStateText = {
  color: "white",
  fontSize: "18px",
  fontWeight: "600",
  margin: "20px 0 8px 0",
};

const emptyStateSubtext = {
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: "14px",
  margin: 0,
};

const hintMessage = {
  display: "block",
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "12px",
  marginTop: "6px",
};

const seeMoreContainer = {
  marginTop: "16px",
  display: "flex",
  justifyContent: "center",
};

const seeMoreButton = {
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.16)",
  color: "white",
  padding: "10px 18px",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s ease",
};
