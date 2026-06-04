import { useState } from "react";
import axios from "axios";
import { CheckCircle, AlertCircle, Plus } from "lucide-react";

export default function AddFood() {
  const [formData, setFormData] = useState({
    eventType: "",
    quantityOfFood: "",
    storageConditions: "",
    purchaseHistory: "",
    seasonality: "",
    preparationMethod: "",
    geographicalLocation: "",
    pricing: "",
    wastageFoodAmount: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Dropdown options
  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Corporate Event",
    "Restaurant Service",
    "Catering",
    "Festival",
    "Conference",
    "Other",
  ];

  const storageConditionOptions = [
    "Refrigerated (0-4°C)",
    "Frozen (-18°C or below)",
    "Room Temperature (20-25°C)",
    "Cool & Dry",
    "Ambient",
    "Cold Storage",
  ];

  const seasonalityOptions = [
    "Spring",
    "Summer",
    "Fall",
    "Winter",
    "Year-round",
  ];

  const preparationMethods = [
    "Raw",
    "Cooked",
    "Fried",
    "Baked",
    "Grilled",
    "Steamed",
    "Boiled",
    "Roasted",
    "Mixed",
  ];

  const locationOptions = [
    "North India",
    "South India",
    "East India",
    "West India",
    "Central India",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Other",
  ];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventType) {
      newErrors.eventType = "Event type is required";
    }

    if (!formData.quantityOfFood || formData.quantityOfFood <= 0) {
      newErrors.quantityOfFood = "Quantity must be greater than 0";
    }

    if (!formData.storageConditions) {
      newErrors.storageConditions = "Storage conditions are required";
    }

    if (!formData.purchaseHistory || formData.purchaseHistory.trim() === "") {
      newErrors.purchaseHistory = "Purchase history/Food name is required";
    }

    if (!formData.seasonality) {
      newErrors.seasonality = "Seasonality is required";
    }

    if (!formData.preparationMethod) {
      newErrors.preparationMethod = "Preparation method is required";
    }

    if (!formData.geographicalLocation) {
      newErrors.geographicalLocation = "Location is required";
    }

    if (!formData.pricing || formData.pricing <= 0) {
      newErrors.pricing = "Pricing must be greater than 0";
    }

    if (formData.wastageFoodAmount && formData.wastageFoodAmount < 0) {
      newErrors.wastageFoodAmount = "Wastage cannot be negative";
    }

    if (
      formData.wastageFoodAmount &&
      parseFloat(formData.wastageFoodAmount) >
        parseFloat(formData.quantityOfFood)
    ) {
      newErrors.wastageFoodAmount = "Wastage cannot exceed total quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      setErrorMessage("Please fix the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("https://foodchainai-server.onrender.com/api/food/add", {
        "Event Type": formData.eventType,
        "Quantity of Food": Number(formData.quantityOfFood),
        "Storage Conditions": formData.storageConditions,
        "Purchase History": formData.purchaseHistory,
        Seasonality: formData.seasonality,
        "Preparation Method": formData.preparationMethod,
        "Geographical Location": formData.geographicalLocation,
        Pricing: formData.pricing,
        "Wastage Food Amount": Number(formData.wastageFoodAmount) || 0,
      });

      console.log(res.data);
      setSuccessMessage("Food data added successfully! [OK]");

      // Reset form
      setFormData({
        eventType: "",
        quantityOfFood: "",
        storageConditions: "",
        purchaseHistory: "",
        seasonality: "",
        preparationMethod: "",
        geographicalLocation: "",
        pricing: "",
        wastageFoodAmount: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      setErrorMessage(
        err.response?.data?.message ||
          "Error adding food data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Add Food Data
          </h1>
          <p className="text-gray-600">
            Enter detailed information about food items for tracking and
            analysis
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
            <CheckCircle className="text-green-600" size={24} />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fade-in">
            <AlertCircle className="text-red-600" size={24} />
            <span className="text-red-800 font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.eventType
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="">Select Event Type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>
              )}
            </div>

            {/* Purchase History / Food Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="purchaseHistory"
                value={formData.purchaseHistory}
                onChange={handleChange}
                placeholder="e.g., Rice Plate, Chicken Biryani"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.purchaseHistory
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.purchaseHistory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.purchaseHistory}
                </p>
              )}
            </div>

            {/* Quantity of Food */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity of Food (kg/units){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantityOfFood"
                value={formData.quantityOfFood}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.quantityOfFood
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.quantityOfFood && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.quantityOfFood}
                </p>
              )}
            </div>

            {/* Wastage Food Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Wastage Amount (kg/units)
              </label>
              <input
                type="number"
                name="wastageFoodAmount"
                value={formData.wastageFoodAmount}
                onChange={handleChange}
                placeholder="e.g., 5"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.wastageFoodAmount
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.wastageFoodAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.wastageFoodAmount}
                </p>
              )}
            </div>

            {/* Storage Conditions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Storage Conditions <span className="text-red-500">*</span>
              </label>
              <select
                name="storageConditions"
                value={formData.storageConditions}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.storageConditions
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="">Select Storage Condition</option>
                {storageConditionOptions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              {errors.storageConditions && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.storageConditions}
                </p>
              )}
            </div>

            {/* Seasonality */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Seasonality <span className="text-red-500">*</span>
              </label>
              <select
                name="seasonality"
                value={formData.seasonality}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.seasonality
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="">Select Season</option>
                {seasonalityOptions.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
              {errors.seasonality && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.seasonality}
                </p>
              )}
            </div>

            {/* Preparation Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preparation Method <span className="text-red-500">*</span>
              </label>
              <select
                name="preparationMethod"
                value={formData.preparationMethod}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.preparationMethod
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="">Select Preparation Method</option>
                {preparationMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {errors.preparationMethod && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.preparationMethod}
                </p>
              )}
            </div>

            {/* Geographical Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Geographical Location <span className="text-red-500">*</span>
              </label>
              <select
                name="geographicalLocation"
                value={formData.geographicalLocation}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.geographicalLocation
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              >
                <option value="">Select Location</option>
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.geographicalLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.geographicalLocation}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pricing (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pricing"
                value={formData.pricing}
                onChange={handleChange}
                placeholder="e.g., ₹500 or 500"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.pricing
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.pricing && (
                <p className="mt-1 text-sm text-red-600">{errors.pricing}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Add Food Data</span>
                </>
              )}
            </button>
          </div>

          {/* Required Fields Note */}
          <p className="mt-4 text-sm text-gray-500 text-center">
            <span className="text-red-500">*</span> Required fields
          </p>
        </form>
      </div>
    </div>
  );
}
