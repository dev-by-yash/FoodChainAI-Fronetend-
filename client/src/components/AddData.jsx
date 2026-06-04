import "./add_data_style.css";
import { useState } from "react";

const initialForm = {
  "Food Item": "",
  "Event Type": "",
  "Quantity of Food": "",
  "Storage Conditions": "",
  "Purchase History": "",
  Seasonality: "",
  "Preparation Method": "",
  "Geographical Location": "",
  Pricing: "",
  "Wastage Food Amount": "",
};

const fieldsConfig = [
  {
    label: "Food Item",
    type: "text",
    placeholder: "e.g. Rice, Vegetables, Chicken",
  },
  {
    label: "Event Type",
    type: "select",
    options: [
      "Wedding",
      "Conference",
      "Birthday",
      "Corporate",
      "Festival",
      "Other",
    ],
    placeholder: "Select event type",
  },
  {
    label: "Quantity of Food",
    type: "number",
    placeholder: "e.g. 200 (in kg)",
  },
  {
    label: "Storage Conditions",
    type: "select",
    options: ["Refrigerated", "Frozen", "Room Temperature", "Hot Storage"],
    placeholder: "Select storage",
  },
  {
    label: "Purchase History",
    type: "select",
    options: ["Frequent", "Occasional", "Rare", "First Time"],
    placeholder: "Select history",
  },
  {
    label: "Seasonality",
    type: "select",
    options: ["Summer", "Winter", "Monsoon", "Spring", "Autumn"],
    placeholder: "Select season",
  },
  {
    label: "Preparation Method",
    type: "select",
    options: ["Buffet", "Plated", "Family Style", "Food Stations", "Boxed"],
    placeholder: "Select method",
  },
  {
    label: "Geographical Location",
    type: "text",
    placeholder: "City / Region",
  },
  {
    label: "Pricing",
    type: "select",
    options: ["Low", "High", "Moderate"],
    placeholder: "Select price",
  },
  {
    label: "Wastage Food Amount",
    type: "number",
    placeholder: "e.g. 25 (in kg)",
  },
];

export default function AddData() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const value = form[key].trim();

      if (!value) {
        newErrors[key] = `${key} is required`;
        return;
      }

      if (["Quantity of Food", "Wastage Food Amount"].includes(key)) {
        const num = Number(value);
        if (isNaN(num) || num < 0) {
          newErrors[key] = `${key} must be a positive number`;
        }
      }

      if (value.length > 100) {
        newErrors[key] = `${key} must be under 100 characters`;
      }
    });

    if (
      form["Quantity of Food"] &&
      form["Wastage Food Amount"] &&
      Number(form["Wastage Food Amount"]) > Number(form["Quantity of Food"])
    ) {
      newErrors["Wastage Food Amount"] = "Wastage cannot exceed total quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      await res.json().catch(() => ({}));
      alert("[OK] Data Added Successfully");
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("[ERROR] Error adding data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="add-data-page">
      <div className="add-data-container">
        <header className="add-data-header">
          <h1> Add Food Data</h1>
          <p>Fill in the details below to log a new food record</p>
        </header>

        <form onSubmit={handleSubmit} className="add-data-form" noValidate>
          <div className="add-data-grid">
            {fieldsConfig.map((field) => (
              <div className="form-field" key={field.label}>
                <label htmlFor={field.label}>
                  {field.label} <span className="req">*</span>
                </label>

                {field.type === "select" ? (
                  <select
                    id={field.label}
                    name={field.label}
                    value={form[field.label]}
                    onChange={handleChange}
                    className={errors[field.label] ? "input-error" : ""}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.label}
                    type={field.type}
                    name={field.label}
                    value={form[field.label]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    maxLength={100}
                    min={field.type === "number" ? 0 : undefined}
                    className={errors[field.label] ? "input-error" : ""}
                  />
                )}

                {errors[field.label] && (
                  <span className="error-msg">[!] {errors[field.label]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              disabled={submitting}
            >
              Reset
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
