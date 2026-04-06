import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../../services/api";
import { useToast } from "../../../components/Toast";
import { TRAVEL_PURPOSES } from "../../../types/visa";
import LoadingSpinner from "../../../components/LoadingSpinner";
import CountryInput from "../../../components/CountryInput";
import { formatDateToBackend } from "../../../utils/dateUtils";
import { COUNTRIES } from "../../../utils/countries";

const VisaRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    destinationCountry: "",
    travelPurpose: "",
    intendedTravelDate: "", // stored as DD/MM/YYYY
    passportNumber: "",
  });
  const [document, setDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /** Parse DD/MM/YYYY → Date, or null if invalid */
  const parseDMY = (dmy: string): Date | null => {
    const parts = dmy.split("/");
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts.map(Number);
    if (!dd || !mm || !yyyy || yyyy < 1900) return null;
    const d = new Date(yyyy, mm - 1, dd);
    if (
      d.getFullYear() !== yyyy ||
      d.getMonth() !== mm - 1 ||
      d.getDate() !== dd
    )
      return null;
    return d;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        document: "File size must be less than 5MB",
      }));
      return;
    }
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        document: "Only PDF, JPEG, PNG files are allowed",
      }));
      return;
    }
    setDocument(file);
    setErrors((prev) => ({ ...prev, document: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.destinationCountry.trim()) {
      newErrors.destinationCountry = "Destination country is required";
    } else if (!COUNTRIES.includes(formData.destinationCountry)) {
      newErrors.destinationCountry =
        "Please select a valid country from the list";
    }

    if (!formData.travelPurpose) {
      newErrors.travelPurpose = "Travel purpose is required";
    }

    if (!formData.intendedTravelDate) {
      newErrors.intendedTravelDate = "Intended travel date is required";
    } else {
      const d = parseDMY(formData.intendedTravelDate);
      if (!d) {
        newErrors.intendedTravelDate = "Enter date as DD/MM/YYYY";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (d <= today)
          newErrors.intendedTravelDate = "Travel date must be in the future";
      }
    }

    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = "Passport number is required";
    } else if (formData.passportNumber.length < 6) {
      newErrors.passportNumber =
        "Passport number must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);
    try {
      // Convert DD/MM/YYYY → YYYY-MM-DD for backend
      const isoDate = formatDateToBackend(
        parseDMY(formData.intendedTravelDate)!,
      );

      const submitData = new FormData();
      submitData.append("destinationCountry", formData.destinationCountry);
      submitData.append("travelPurpose", formData.travelPurpose);
      submitData.append("intendedTravelDate", isoDate);
      submitData.append("passportNumber", formData.passportNumber);
      if (document) submitData.append("document", document);

      await apiService.submitVisaRequest(submitData);
      showToast("Visa request submitted successfully!", "success");
      navigate("/visa-status");
    } catch (error) {
      console.error("Failed to submit visa request:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to submit visa request",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="visa-request-form">
      <div className="form-header">
        <h2>🛂 Visa Assistance Request</h2>
        <p>
          Submit your visa application details and we'll assist you with the
          process.
        </p>
        <div className="disclaimer">
          <small>
            ⚠️ <strong>Disclaimer:</strong> This is a simulation for visa
            assistance only. This does not imply real embassy or government
            integration.
          </small>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="visa-form">
        <div className="form-row">
          {/* Country autocomplete */}
          <div className="form-group">
            <label htmlFor="destinationCountry" className="form-label">
              Destination Country *
            </label>
            <CountryInput
              id="destinationCountry"
              name="destinationCountry"
              value={formData.destinationCountry}
              onChange={(country) => {
                setFormData((prev) => ({
                  ...prev,
                  destinationCountry: country,
                }));
                if (errors.destinationCountry)
                  setErrors((prev) => ({ ...prev, destinationCountry: "" }));
              }}
              hasError={!!errors.destinationCountry}
              placeholder="Type to search countries…"
              disabled={loading}
            />
            {errors.destinationCountry && (
              <div className="form-error">{errors.destinationCountry}</div>
            )}
          </div>

          {/* Travel purpose */}
          <div className="form-group">
            <label htmlFor="travelPurpose" className="form-label">
              Travel Purpose *
            </label>
            <select
              id="travelPurpose"
              name="travelPurpose"
              value={formData.travelPurpose}
              onChange={handleInputChange}
              className={`form-input ${errors.travelPurpose ? "error" : ""}`}
              disabled={loading}
            >
              <option value="">Select travel purpose</option>
              {TRAVEL_PURPOSES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {errors.travelPurpose && (
              <div className="form-error">{errors.travelPurpose}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          {/* Date — text input DD/MM/YYYY, no browser date picker */}
          <div className="form-group">
            <label htmlFor="intendedTravelDate" className="form-label">
              Intended Travel Date *{" "}
              <small
                style={{ fontWeight: 400, color: "var(--text-secondary)" }}
              >
                (DD/MM/YYYY)
              </small>
            </label>
            <input
              type="text"
              id="intendedTravelDate"
              name="intendedTravelDate"
              value={formData.intendedTravelDate}
              onChange={(e) => {
                // Strip non-digit/slash, auto-insert slashes at positions 2 and 5
                let v = e.target.value.replace(/[^\d/]/g, "");
                const prev = formData.intendedTravelDate;
                if (v.length === 2 && !v.includes("/") && prev.length === 1)
                  v += "/";
                if (
                  v.length === 5 &&
                  v.split("/").length === 2 &&
                  prev.length === 4
                )
                  v += "/";
                setFormData((p) => ({ ...p, intendedTravelDate: v }));
                if (errors.intendedTravelDate)
                  setErrors((p) => ({ ...p, intendedTravelDate: "" }));
              }}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              className={`form-input ${errors.intendedTravelDate ? "error" : ""}`}
              disabled={loading}
            />
            {errors.intendedTravelDate && (
              <div className="form-error">{errors.intendedTravelDate}</div>
            )}
          </div>

          {/* Passport number */}
          <div className="form-group">
            <label htmlFor="passportNumber" className="form-label">
              Passport Number *
            </label>
            <input
              type="text"
              id="passportNumber"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
              className={`form-input ${errors.passportNumber ? "error" : ""}`}
              placeholder="Enter passport number"
              disabled={loading}
            />
            {errors.passportNumber && (
              <div className="form-error">{errors.passportNumber}</div>
            )}
            <small className="form-help">
              📝 This is for simulation purposes only
            </small>
          </div>
        </div>

        {/* Document upload */}
        <div className="form-group">
          <label htmlFor="document" className="form-label">
            Supporting Documents (Optional)
          </label>
          <input
            type="file"
            id="document"
            name="document"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className={`form-input ${errors.document ? "error" : ""}`}
            disabled={loading}
          />
          {errors.document && (
            <div className="form-error">{errors.document}</div>
          )}
          <small className="form-help">
            📎 Upload passport copy, photos, or other supporting documents (PDF,
            JPEG, PNG — Max 5MB)
          </small>
          {document && (
            <div className="file-preview">
              <span>📄 {document.name}</span>
              <button
                type="button"
                onClick={() => setDocument(null)}
                className="remove-file"
                disabled={loading}
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/tourist/dashboard")}
            className="btn btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <LoadingSpinner size="small" text="" />
            ) : (
              "Submit Visa Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisaRequestForm;
