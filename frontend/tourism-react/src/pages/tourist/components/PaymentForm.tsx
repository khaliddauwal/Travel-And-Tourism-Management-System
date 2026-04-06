import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/Toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

interface PaymentFormProps {
  amount: number;
  bookingId?: string;
  onSuccess?: (paymentData: any) => void;
}

interface PaymentData {
  method: "card" | "bank_transfer" | "paystack";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  email: string;
  phone: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  bookingId,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Format card number
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formatted.length <= 19) {
        // 16 digits + 3 spaces
        setPaymentData((prev) => ({ ...prev, [name]: formatted }));
      }
      return;
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2");
      if (formatted.length <= 5) {
        setPaymentData((prev) => ({ ...prev, [name]: formatted }));
      }
      return;
    }

    // Format CVV
    if (name === "cvv") {
      const formatted = value.replace(/\D/g, "");
      if (formatted.length <= 4) {
        setPaymentData((prev) => ({ ...prev, [name]: formatted }));
      }
      return;
    }

    setPaymentData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentData.method === "card") {
      // Card validation
      const cardNumber = paymentData.cardNumber.replace(/\s/g, "");
      if (!cardNumber) {
        newErrors.cardNumber = "Card number is required";
      } else if (cardNumber.length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      if (!paymentData.expiryDate) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        newErrors.expiryDate = "Invalid expiry date format (MM/YY)";
      } else {
        const [month, year] = paymentData.expiryDate.split("/");
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        if (parseInt(month) < 1 || parseInt(month) > 12) {
          newErrors.expiryDate = "Invalid month";
        } else if (
          parseInt(year) < currentYear ||
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          newErrors.expiryDate = "Card has expired";
        }
      }

      if (!paymentData.cvv) {
        newErrors.cvv = "CVV is required";
      } else if (paymentData.cvv.length < 3) {
        newErrors.cvv = "CVV must be 3-4 digits";
      }

      if (!paymentData.cardName.trim()) {
        newErrors.cardName = "Cardholder name is required";
      }
    }

    if (!paymentData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(paymentData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!paymentData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[0-9\-\s()]{10,}$/.test(paymentData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTransactionRef = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const transactionRef = generateTransactionRef();

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const paymentResult = {
        transactionId: transactionRef,
        amount: amount,
        method: paymentData.method,
        status: "completed",
        reference: transactionRef,
        timestamp: new Date().toISOString(),
      };

      showToast("Payment processed successfully!", "success");

      if (onSuccess) {
        onSuccess(paymentResult);
      } else {
        navigate("/payment-success", {
          state: { paymentResult, bookingId },
        });
      }
    } catch (error) {
      showToast("Payment failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h2>💳 Secure Payment</h2>
        <div className="payment-amount">
          <span>Total Amount: </span>
          <strong>₦{amount.toLocaleString()}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        {/* Payment Method */}
        <div className="form-group">
          <label htmlFor="method">Payment Method</label>
          <select
            id="method"
            name="method"
            value={paymentData.method}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="card">💳 Credit/Debit Card</option>
            <option value="paystack">🏦 Paystack</option>
            <option value="bank_transfer">🏛️ Bank Transfer</option>
          </select>
        </div>

        {paymentData.method === "card" && (
          <>
            {/* Card Number */}
            <div className="form-group">
              <label htmlFor="cardNumber">
                Card Number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                disabled={loading}
              />
              {errors.cardNumber && (
                <span className="error-message">{errors.cardNumber}</span>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {/* Expiry Date */}
              <div className="form-group">
                <label htmlFor="expiryDate">
                  Expiry Date <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  disabled={loading}
                />
                {errors.expiryDate && (
                  <span className="error-message">{errors.expiryDate}</span>
                )}
              </div>

              {/* CVV */}
              <div className="form-group">
                <label htmlFor="cvv">
                  CVV <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  disabled={loading}
                />
                {errors.cvv && (
                  <span className="error-message">{errors.cvv}</span>
                )}
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="form-group">
              <label htmlFor="cardName">
                Cardholder Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={paymentData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                disabled={loading}
              />
              {errors.cardName && (
                <span className="error-message">{errors.cardName}</span>
              )}
            </div>
          </>
        )}

        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={paymentData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              disabled={loading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={paymentData.phone}
              onChange={handleInputChange}
              placeholder="+234-800-123-4567"
              disabled={loading}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <div>
            <strong>Secure Payment</strong>
            <p>
              Your payment information is encrypted and secure. We never store
              your card details.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary payment-submit-btn"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : `💳 Pay ₦${amount.toLocaleString()}`}
        </button>

        <p className="payment-terms">
          <small>
            By proceeding with payment, you agree to our{" "}
            <a href="/terms" target="_blank">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank">
              Privacy Policy
            </a>
            .
          </small>
        </p>
      </form>
    </div>
  );
};

export default PaymentForm;
