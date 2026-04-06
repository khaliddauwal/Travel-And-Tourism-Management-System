import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import { apiService, Package } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/common/Modal";

interface PackageFormData {
  name: string;
  type: string;
  location: string;
  priceNGN: number;
  priceUSD: number;
  features: string;
  details: string;
  image: string;
  duration: number;
  maxParticipants: number;
  status: "draft" | "published" | "archived";
}

const PackageManagement: React.FC = () => {
  const { hasPermission } = useAuth();
  const { showToast } = useToast();

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    type: "",
    location: "",
    priceNGN: 0,
    priceUSD: 0,
    features: "",
    details: "",
    image: "",
    duration: 1,
    maxParticipants: 10,
    status: "draft",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");

  const packageTypes = [
    "City Tour",
    "Adventure",
    "Cultural",
    "Nature",
    "Wildlife",
    "Festival",
    "Religious",
    "Educational",
    "Luxury",
    "Budget",
    "Umrah",
    "Hajj",
  ];

  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      // Admin sees all statuses; pass status=all to bypass the default 'published' filter
      const params: any = { limit: 50, status: "all" };

      if (filter !== "all") {
        params.type = filter.toLowerCase().replace(/\s+/g, "_");
      }

      console.log("[PackageManagement] Loading packages with params:", params);
      const response = await apiService.getPackages(params);
      console.log("[PackageManagement] API response:", response);

      const list: Package[] = response.packages ?? response.data ?? [];
      console.log("[PackageManagement] Packages loaded:", list.length);
      setPackages(list);
    } catch (error) {
      console.error("[PackageManagement] Failed to load packages:", error);
      showToast("Failed to load packages. Please try again.", "error");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [filter, showToast]);

  useEffect(() => {
    loadPackages();
  }, [filter, loadPackages]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("price") ||
        name === "duration" ||
        name === "maxParticipants"
          ? parseFloat(value) || 0
          : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Package name is required";
    if (!formData.type) newErrors.type = "Package type is required";
    if (!formData.location.trim())
      newErrors.location = "Destination is required";
    if (formData.priceNGN <= 0)
      newErrors.priceNGN = "Price must be greater than 0";
    if (formData.duration < 1)
      newErrors.duration = "Duration must be at least 1 day";
    if (!formData.details.trim()) newErrors.details = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("destination", formData.location);

      // Convert display type to backend snake_case format
      const backendType = formData.type.toLowerCase().replace(/\s+/g, "_");
      formDataToSend.append("type", backendType);

      formDataToSend.append("duration", formData.duration.toString());
      formDataToSend.append("price", formData.priceNGN.toString());
      formDataToSend.append("description", formData.details);
      formDataToSend.append("inclusions", formData.features);
      formDataToSend.append("status", formData.status);

      if (formData.image) {
        formDataToSend.append("image_url", formData.image);
      }

      console.log("[PackageManagement] Submitting package:", {
        name: formData.name,
        destination: formData.location,
        type: backendType,
        duration: formData.duration,
        price: formData.priceNGN,
        status: formData.status,
      });

      if (editingPackage) {
        await apiService.updatePackage(editingPackage.id, formDataToSend);
        showToast("Package updated successfully!", "success");
      } else {
        const created = await apiService.createPackage(formDataToSend);
        console.log("[PackageManagement] Package created:", created);
        showToast("Package created successfully!", "success");
      }

      resetForm();
      await loadPackages();
    } catch (error: any) {
      console.error("[PackageManagement] Failed to save package:", error);
      let msg = "Failed to save package. Please try again.";
      if (error?.response?.data?.errors) {
        msg = Object.values(error.response.data.errors).flat().join(", ");
      } else if (error?.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error?.message) {
        msg = error.message;
      }
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      location: "",
      priceNGN: 0,
      priceUSD: 0,
      features: "",
      details: "",
      image: "",
      duration: 1,
      maxParticipants: 10,
      status: "draft",
    });
    setEditingPackage(null);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      name: pkg.name,
      type: pkg.type,
      location: (pkg as any).location || (pkg as any).destination || "",
      priceNGN: pkg.price.ngn,
      priceUSD: pkg.price.usd,
      features: (pkg as any).features || (pkg as any).inclusions || "",
      details: (pkg as any).details || (pkg as any).description || "",
      image: pkg.image,
      duration: (pkg as any).duration || 1,
      maxParticipants: 10,
      status:
        ((pkg as any).status as "draft" | "published" | "archived") || "draft",
    });
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this package? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await apiService.deletePackage(id);
      showToast("Package deleted successfully!", "success");
      await loadPackages();
    } catch (error: any) {
      console.error("Failed to delete package:", error);
      showToast(error.message || "Failed to delete package.", "error");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiService.updatePackageStatus(id, status);
      showToast(`Package ${status} successfully!`, "success");
      await loadPackages();
    } catch (error: any) {
      console.error("Failed to update package status:", error);
      showToast(error.message || "Failed to update package status.", "error");
    }
  };

  if (!hasPermission("canManagePackages")) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to manage packages.</p>
      </div>
    );
  }

  return (
    <div className="package-management">
      <div className="page-header">
        <div className="header-content">
          <h1>📦 Package Management</h1>
          <p>Create, edit, and manage travel packages</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          + Add New Package
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          {packageTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Package List */}
      {loading ? (
        <LoadingSpinner text="Loading packages..." />
      ) : (
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <img src={pkg.image} alt={pkg.name} className="package-image" />
              <div className="package-content">
                <h3>{pkg.name}</h3>
                <p className="location">📍 {pkg.location}</p>
                <span className="type-badge">{pkg.type}</span>
                <p className="features">{pkg.features}</p>
                <div className="price">{pkg.price.formatted}</div>

                <div className="package-actions">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="btn btn-sm btn-outline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleStatusChange(pkg.id, "published")}
                    className="btn btn-sm btn-success"
                  >
                    📢 Publish
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Form Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={resetForm}
          title={editingPackage ? "Edit Package" : "Add New Package"}
        >
          <form onSubmit={handleSubmit} className="package-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Package Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos City Explorer"
                  disabled={submitting}
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="type">
                  Package Type <span className="required">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={submitting}
                >
                  <option value="">Select type</option>
                  {packageTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span className="error-message">{errors.type}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Lagos, Nigeria"
                disabled={submitting}
              />
              {errors.location && (
                <span className="error-message">{errors.location}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priceNGN">
                  Price (NGN) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="priceNGN"
                  name="priceNGN"
                  value={formData.priceNGN}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  placeholder="e.g., 150000"
                  disabled={submitting}
                />
                {errors.priceNGN && (
                  <span className="error-message">{errors.priceNGN}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="duration">
                  Duration (Days) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="e.g., 3"
                  disabled={submitting}
                />
                {errors.duration && (
                  <span className="error-message">{errors.duration}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="features">Inclusions / Features</label>
              <input
                type="text"
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., Hotel, Meals, Transport, Guide"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="details">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Describe what's included in this package..."
                rows={4}
                disabled={submitting}
              />
              {errors.details && (
                <span className="error-message">{errors.details}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL (optional)</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={submitting}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <LoadingSpinner size="small" text="" />
                ) : editingPackage ? (
                  "Update Package"
                ) : (
                  "Create Package"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PackageManagement;
