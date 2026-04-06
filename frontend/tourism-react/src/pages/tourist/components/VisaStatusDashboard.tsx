import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../../services/api";
import {
  VisaRequest,
  VISA_STATUS_COLORS,
  VISA_STATUS_LABELS,
  TRAVEL_PURPOSES,
} from "../../../types/visa";
import { useToast } from "../../../components/Toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDateToDisplay } from "../../../utils/dateUtils";

const VisaStatusDashboard: React.FC = () => {
  const [visaRequests, setVisaRequests] = useState<VisaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const { showToast } = useToast();

  const loadVisaRequests = useCallback(async () => {
    try {
      setLoading(true);
      const requests = await apiService.getUserVisaRequests();
      setVisaRequests(requests);
    } catch (error) {
      console.error("Failed to load visa requests:", error);
      showToast("Failed to load visa requests", "error");
      setVisaRequests([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadVisaRequests();
  }, [loadVisaRequests]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return "📝";
      case "under_review":
        return "🔍";
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "📄";
    }
  };

  const getTravelPurposeLabel = (purpose: string) => {
    const purposeObj = TRAVEL_PURPOSES.find((p) => p.value === purpose);
    return purposeObj ? purposeObj.label : purpose;
  };

  const formatDate = (dateString: string) => formatDateToDisplay(dateString);

  const filteredRequests =
    filter === "all"
      ? visaRequests
      : visaRequests.filter((request) => request.status === filter);

  const getStatusCounts = () => {
    return {
      all: visaRequests.length,
      submitted: visaRequests.filter((r) => r.status === "submitted").length,
      under_review: visaRequests.filter((r) => r.status === "under_review")
        .length,
      approved: visaRequests.filter((r) => r.status === "approved").length,
      rejected: visaRequests.filter((r) => r.status === "rejected").length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <LoadingSpinner text="Loading your visa requests..." />;
  }

  return (
    <div className="visa-status-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>🛂 Visa Application Status</h2>
          <p>Track the progress of your visa assistance requests</p>
        </div>
        <Link to="/visa-request" className="btn btn-primary">
          + New Visa Request
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="status-tabs">
        <button
          className={`status-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({statusCounts.all})
        </button>
        <button
          className={`status-tab ${filter === "submitted" ? "active" : ""}`}
          onClick={() => setFilter("submitted")}
        >
          📝 Submitted ({statusCounts.submitted})
        </button>
        <button
          className={`status-tab ${filter === "under_review" ? "active" : ""}`}
          onClick={() => setFilter("under_review")}
        >
          🔍 Under Review ({statusCounts.under_review})
        </button>
        <button
          className={`status-tab ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
        >
          ✅ Approved ({statusCounts.approved})
        </button>
        <button
          className={`status-tab ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          ❌ Rejected ({statusCounts.rejected})
        </button>
      </div>

      {/* Visa Requests List */}
      <div className="visa-requests-list">
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛂</div>
            <h3>
              {filter === "all"
                ? "No visa requests yet"
                : `No ${VISA_STATUS_LABELS[filter as keyof typeof VISA_STATUS_LABELS].toLowerCase()} requests`}
            </h3>
            <p>
              {filter === "all"
                ? "Start by submitting your first visa assistance request"
                : `You don't have any ${VISA_STATUS_LABELS[filter as keyof typeof VISA_STATUS_LABELS].toLowerCase()} visa requests`}
            </p>
            {filter === "all" && (
              <Link to="/visa-request" className="btn btn-primary">
                Submit Visa Request
              </Link>
            )}
          </div>
        ) : (
          <div className="requests-grid">
            {filteredRequests.map((request) => (
              <div key={request.id} className="visa-request-card">
                <div className="card-header">
                  <div className="destination">
                    <h3>🌍 {request.destinationCountry}</h3>
                    <span className="purpose-badge">
                      {getTravelPurposeLabel(request.travelPurpose)}
                    </span>
                  </div>
                  <div
                    className="status-badge"
                    style={{
                      backgroundColor:
                        VISA_STATUS_COLORS[request.status] ?? "#6b7280",
                    }}
                  >
                    {getStatusIcon(request.status)}{" "}
                    {VISA_STATUS_LABELS[request.status]}
                  </div>
                </div>

                <div className="card-content">
                  <div className="request-details">
                    <div className="detail-item">
                      <span className="label">Travel Date:</span>
                      <span className="value">
                        📅 {formatDate(request.intendedTravelDate)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Passport:</span>
                      <span className="value">🛂 {request.passportNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Submitted:</span>
                      <span className="value">
                        📝 {formatDate(request.submittedAt)}
                      </span>
                    </div>
                    {request.updatedAt !== request.submittedAt && (
                      <div className="detail-item">
                        <span className="label">Last Updated:</span>
                        <span className="value">
                          🔄 {formatDate(request.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {request.adminComments && (
                    <div className="admin-comments">
                      <h4>💬 Admin Comments:</h4>
                      <p>{request.adminComments}</p>
                    </div>
                  )}

                  {request.documentPath && (
                    <div className="document-info">
                      <span className="document-icon">📎</span>
                      <span>Supporting documents uploaded</span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <small className="request-id">
                    Request ID: #{request.id}
                  </small>
                  {request.status === "approved" && (
                    <div className="next-steps">
                      <strong>Next Steps:</strong> Contact the embassy to
                      schedule your appointment
                    </div>
                  )}
                  {request.status === "rejected" && (
                    <div className="next-steps rejected">
                      <strong>
                        You can submit a new request with updated information
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="help-section">
        <h3>📞 Need Help?</h3>
        <p>
          If you have questions about your visa application status, please
          contact our support team at{" "}
          <a href="mailto:visa@travelmanagement.com">
            visa@travelmanagement.com
          </a>{" "}
          or call +1-800-TRAVEL-MGMT.
        </p>
        <div className="disclaimer">
          <small>
            ⚠️ <strong>Important:</strong> This is a simulation service. For
            actual visa applications, please contact the relevant embassy or
            consulate directly.
          </small>
        </div>
      </div>
    </div>
  );
};

export default VisaStatusDashboard;
