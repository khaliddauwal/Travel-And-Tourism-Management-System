import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/Toast";
import { apiService } from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner";

interface BookingFormData {
  travelDate: string;
  participants: number;
  specialRequests: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface BookingFormProps {
  packageId?: number;
  packageTitle?: string;
  packagePrice?: number;
  onSuccess?: (bookingId: number) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  packageId,
  packageTitle,
  packagePrice,
  onSuccess,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<BookingFormData>({
    travelDate: "",
    participants: 1,
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentPackageId = packageId || parseInt(id || "0");
  const currentPackagePrice = packagePrice || 50000; // Default price

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.travelDate) {
      newErrors.travelDate = "Travel date is required";
    } else {
      const travelDate = new Date(formData.travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (travelDate <= today) {
        newErrors.travelDate = "Travel date must be in the future";
      }

      // Check if travel date is at least 7 days from now
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      if (travelDate < minDate) {
        newErrors.travelDate = "Travel date must be at least 7 days from now";
      }
    }

    if (formData.participants < 1 || formData.participants > 10) {
      newErrors.participants =
        "Number of participants must be between 1 and 10";
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = "Emergency contact name is required";
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = "Emergency contact phone is required";
    } else if (!/^[+]?[0-9\-\s()]{10,}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return currentPackagePrice * formData.participants;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);

    try {
      const booking = await apiService.createBooking({
        packageId: currentPackageId,
        travelDate: formData.travelDate,
        participants: Number(formData.participants),
        emergencyContact: `${formData.emergencyContact} (${formData.emergencyPhone})`,
        specialRequests: formData.specialRequests || undefined,
      });

      showToast("Booking submitted successfully! 🎉", "success");

      if (onSuccess) {
        onSuccess(booking.id);
      } else {
        navigate(`/tourist/booking/${booking.id}`, {
          state: { booking },
        });
      }
    } catch (error: any) {
      console.error("Booking failed:", error);
      showToast(
        error.message || "Failed to submit booking. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <div className="booking-form-container">
      <div className="booking-form-header">
        <h2>🎫 Book Your Trip</h2>
        {packageTitle && (
          <p className="package-title">
            Package: <strong>{packageTitle}</strong>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Travel Date */}
        <div className="form-group">
          <label htmlFor="travelDate">
            📅 Travel Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="travelDate"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleInputChange}
            min={minDateString}
            required
            disabled={loading}
          />
          {errors.travelDate && (
            <span className="error-message">{errors.travelDate}</span>
          )}
        </div>

        {/* Number of Participants */}
        <div className="form-group">
          <label htmlFor="participants">
            👥 Number of Participants <span className="required">*</span>
          </label>
          <select
            id="participants"
            name="participants"
            value={formData.participants}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Person" : "People"}
              </option>
            ))}
          </select>
          {errors.participants && (
            <span className="error-message">{errors.participants}</span>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="form-group">
          <label htmlFor="emergencyContact">
            🚨 Emergency Contact Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="Full name of emergency contact"
            required
            disabled={loading}
          />
          {errors.emergencyContact && (
            <span className="error-message">{errors.emergencyContact}</span>
          )}
        </div>

        {/* Emergency Phone */}
        <div className="form-group">
          <label htmlFor="emergencyPhone">
            📞 Emergency Contact Phone <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="emergencyPhone"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleInputChange}
            placeholder="+234-800-123-4567"
            required
            disabled={loading}
          />
          {errors.emergencyPhone && (
            <span className="error-message">{errors.emergencyPhone}</span>
          )}
        </div>

        {/* Special Requests */}
        <div className="form-group">
          <label htmlFor="specialRequests">
            📝 Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Booking Summary */}
        <div className="booking-summary">
          <h3>📋 Booking Summary</h3>
          <div className="summary-row">
            <span>Package Price (per person):</span>
            <span>₦{currentPackagePrice.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Number of Participants:</span>
            <span>{formData.participants}</span>
          </div>
          <div className="summary-row total">
            <span>
              <strong>Total Amount:</strong>
            </span>
            <span>
              <strong>₦{calculateTotal().toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary booking-submit-btn"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "🎯 Proceed to Payment"}
        </button>

        <p className="booking-note">
          <small>
            💡 <strong>Note:</strong> Your booking will be confirmed after
            payment verification. You will receive a confirmation email with
            your booking reference.
          </small>
        </p>
      </form>
    </div>
  );
};

export default BookingForm;
