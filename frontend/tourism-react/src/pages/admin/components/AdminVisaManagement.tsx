import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "../../../services/api";
import {
  VisaRequest,
  VISA_STATUS_COLORS,
  VISA_STATUS_LABELS,
  TRAVEL_PURPOSES,
} from "../../../types/visa";
import { useToast } from "../../../components/Toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatDateTimeToDisplay } from "../../../utils/dateUtils";

const AdminVisaManagement: React.FC = () => {
  const [visaRequests, setVisaRequests] = useState<VisaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<VisaRequest | null>(
    null,
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    adminComments: "",
  });
  const [updating, setUpdating] = useState(false);

  const { showToast } = useToast();

  const loadVisaRequests = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const response = await apiService.getAllVisaRequests(params);
      setVisaRequests(response.data);
    } catch (error) {
      console.error("Failed to load visa requests:", error);
      showToast("Failed to load visa requests", "error");
      setVisaRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filter, showToast]);

  useEffect(() => {
    loadVisaRequests();
  }, [loadVisaRequests]);

  const handleUpdateStatus = (request: VisaRequest) => {
    setSelectedRequest(request);
    setUpdateData({
      status: request.status,
      adminComments: request.adminComments || "",
    });
    setShowUpdateModal(true);
  };

  const submitStatusUpdate = async () => {
    if (!selectedRequest) return;

    setUpdating(true);
    try {
      const updatedRequest = await apiService.updateVisaStatus(
        selectedRequest.id,
        {
          status: updateData.status as any,
          adminComments: updateData.adminComments,
        },
      );

      // Update the request in the list
      setVisaRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id ? updatedRequest : req,
        ),
      );

      showToast("Visa status updated successfully", "success");
      setShowUpdateModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to update visa status:", error);
      showToast("Failed to update visa status", "error");
    } finally {
      setUpdating(false);
    }
  };

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

  const formatDate = (dateString: string) =>
    formatDateTimeToDisplay(dateString);

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
    return <LoadingSpinner text="Loading visa requests..." />;
  }

  return (
    <div className="admin-visa-management">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>🛂 Visa Request Management</h2>
          <p>
            Welcome, Khalid Auwal Hafiz - Manage and process visa assistance
            requests
          </p>
        </div>
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
          📝 New ({statusCounts.submitted})
        </button>
        <button
          className={`status-tab ${filter === "under_review" ? "active" : ""}`}
          onClick={() => setFilter("under_review")}
        >
          🔍 In Review ({statusCounts.under_review})
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

      {/* Visa Requests Table */}
      <div className="admin-table-container">
        {visaRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛂</div>
            <h3>No visa requests found</h3>
            <p>
              {filter === "all"
                ? "No visa requests have been submitted yet"
                : `No ${VISA_STATUS_LABELS[filter as keyof typeof VISA_STATUS_LABELS].toLowerCase()} requests found`}
            </p>
          </div>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>User</th>
                  <th>Destination</th>
                  <th>Purpose</th>
                  <th>Travel Date</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visaRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>#{request.id}</strong>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-name">{request.userFullName}</div>
                        <div className="user-email">{request.userEmail}</div>
                      </div>
                    </td>
                    <td>
                      <div className="destination-info">
                        <span className="country">
                          🌍 {request.destinationCountry}
                        </span>
                        <small className="passport">
                          🛂 {request.passportNumber}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="purpose-badge">
                        {getTravelPurposeLabel(request.travelPurpose)}
                      </span>
                    </td>
                    <td>📅 {formatDate(request.intendedTravelDate)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: VISA_STATUS_COLORS[request.status],
                        }}
                      >
                        {getStatusIcon(request.status)}{" "}
                        {VISA_STATUS_LABELS[request.status]}
                      </span>
                    </td>
                    <td>{formatDate(request.submittedAt)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleUpdateStatus(request)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && selectedRequest && (
        <div
          className="modal-overlay"
          onClick={() => setShowUpdateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Visa Request Status</h3>
              <button
                className="modal-close"
                onClick={() => setShowUpdateModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="request-summary">
                <h4>Request Details</h4>
                <p>
                  <strong>User:</strong> {selectedRequest.userFullName}
                </p>
                <p>
                  <strong>Destination:</strong>{" "}
                  {selectedRequest.destinationCountry}
                </p>
                <p>
                  <strong>Purpose:</strong>{" "}
                  {getTravelPurposeLabel(selectedRequest.travelPurpose)}
                </p>
                <p>
                  <strong>Travel Date:</strong>{" "}
                  {formatDate(selectedRequest.intendedTravelDate)}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status *
                </label>
                <select
                  id="status"
                  value={updateData.status}
                  onChange={(e) =>
                    setUpdateData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="form-input"
                  disabled={updating}
                >
                  <option value="submitted">📝 Submitted</option>
                  <option value="under_review">🔍 Under Review</option>
                  <option value="approved">✅ Approved</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="adminComments" className="form-label">
                  Admin Comments
                </label>
                <textarea
                  id="adminComments"
                  value={updateData.adminComments}
                  onChange={(e) =>
                    setUpdateData((prev) => ({
                      ...prev,
                      adminComments: e.target.value,
                    }))
                  }
                  className="form-input"
                  rows={4}
                  placeholder="Add comments for the user (optional)"
                  disabled={updating}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowUpdateModal(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={submitStatusUpdate}
                disabled={updating}
              >
                {updating ? (
                  <LoadingSpinner size="small" text="" />
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVisaManagement;
