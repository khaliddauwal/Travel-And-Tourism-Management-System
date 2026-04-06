import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import { Booking, TableColumn } from "../../types/management";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { apiService } from "../../services/api";
import { formatDateToDisplay } from "../../utils/dateUtils";

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { hasPermission, getUserRole } = useAuth();
  const { showToast } = useToast();
  const userRole = getUserRole();

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getBookings({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      setBookings(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
      }));
    } catch (error) {
      console.error("Failed to load bookings:", error);
      showToast("Failed to load bookings. Please try again.", "error");
      setBookings([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.current,
    pagination.pageSize,
    searchTerm,
    statusFilter,
    showToast,
  ]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      await apiService.updateBookingStatus(bookingId, newStatus);
      showToast("Booking status updated successfully", "success");
      loadBookings(); // Reload the list
    } catch (error: any) {
      console.error("Failed to update booking status:", error);
      showToast(error.message || "Failed to update booking status", "error");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const columns: TableColumn<Booking>[] = [
    {
      key: "id",
      title: "Booking ID",
      sortable: true,
      render: (value) => `#${value}`,
    },
    {
      key: "userFullName",
      title: "Customer",
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="customer-name">{value}</div>
          <small className="package-title">{record.packageTitle}</small>
        </div>
      ),
    },
    {
      key: "travelDate",
      title: "Travel Date",
      sortable: true,
      render: (value) => formatDateToDisplay(value),
    },
    {
      key: "participants",
      title: "Participants",
      sortable: true,
      render: (value) => `${value} person${value > 1 ? "s" : ""}`,
    },
    {
      key: "totalAmount",
      title: "Amount",
      sortable: true,
      render: (value) => formatCurrency(value),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value) => <StatusBadge status={value} variant="booking" />,
    },
    {
      key: "paymentStatus",
      title: "Payment",
      sortable: true,
      render: (value) => <StatusBadge status={value} variant="payment" />,
    },
    {
      key: "bookingDate",
      title: "Booked On",
      sortable: true,
      render: (value) => formatDateToDisplay(value),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, record) => (
        <div className="table-actions">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => {
              setSelectedBooking(record);
              setShowDetailsModal(true);
            }}
          >
            View
          </button>
          {hasPermission("canViewAllBookings") &&
            record.status === "pending" && (
              <select
                className="status-select"
                value={record.status}
                onChange={(e) => handleStatusUpdate(record.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirm</option>
                <option value="cancelled">Cancel</option>
              </select>
            )}
        </div>
      ),
    },
  ];

  const getPageTitle = () => {
    switch (userRole) {
      case "tourist":
        return "📅 My Bookings";
      case "admin":
        return "📅 Booking Management";
      default:
        return "📅 Bookings";
    }
  };

  const getPageDescription = () => {
    switch (userRole) {
      case "tourist":
        return "View and manage your travel bookings";
      case "admin":
        return "Comprehensive booking management and oversight";
      default:
        return "Booking management";
    }
  };

  return (
    <div className="booking-management">
      <div className="page-header">
        <div className="page-title">
          <h1>{getPageTitle()}</h1>
          <p>{getPageDescription()}</p>
        </div>
        <div className="page-actions">
          {userRole === "tourist" && (
            <Link to="/packages" className="btn btn-primary">
              + New Booking
            </Link>
          )}
        </div>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <DataTable
          data={bookings}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) =>
              setPagination((prev) => ({ ...prev, current: page, pageSize })),
          }}
        />
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBooking(null);
        }}
        title="Booking Details"
        size="large"
      >
        {selectedBooking && (
          <div className="booking-details">
            <div className="booking-header">
              <h3>Booking #{selectedBooking.id}</h3>
              <div className="booking-status-badges">
                <StatusBadge
                  status={selectedBooking.status}
                  variant="booking"
                />
                <StatusBadge
                  status={selectedBooking.paymentStatus}
                  variant="payment"
                />
              </div>
            </div>

            <div className="booking-info-grid">
              <div className="info-section">
                <h4>Customer Information</h4>
                <p>
                  <strong>Name:</strong> {selectedBooking.userFullName}
                </p>
                <p>
                  <strong>Booking Date:</strong>{" "}
                  {new Date(selectedBooking.bookingDate).toLocaleString()}
                </p>
              </div>

              <div className="info-section">
                <h4>Package Information</h4>
                <p>
                  <strong>Package:</strong> {selectedBooking.packageTitle}
                </p>
                <p>
                  <strong>Travel Date:</strong>{" "}
                  {formatDateToDisplay(selectedBooking.travelDate)}
                </p>
                <p>
                  <strong>Participants:</strong> {selectedBooking.participants}
                </p>
              </div>

              <div className="info-section">
                <h4>Payment Information</h4>
                <p>
                  <strong>Total Amount:</strong>{" "}
                  {formatCurrency(selectedBooking.totalAmount)}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedBooking.paymentStatus}
                </p>
              </div>

              {selectedBooking.specialRequests && (
                <div className="info-section">
                  <h4>Special Requests</h4>
                  <p>{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="booking-actions">
              {hasPermission("canViewAllBookings") &&
                selectedBooking.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        handleStatusUpdate(selectedBooking.id, "confirmed");
                        setShowDetailsModal(false);
                      }}
                    >
                      Confirm Booking
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleStatusUpdate(selectedBooking.id, "cancelled");
                        setShowDetailsModal(false);
                      }}
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
              {selectedBooking.status === "confirmed" && (
                <button className="btn btn-primary">Generate Invoice</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement;
