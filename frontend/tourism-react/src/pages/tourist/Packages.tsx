import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiService, Package } from "../../services/api";

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState<string[]>([]);

  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getPackages({
        search: search || undefined,
        type: selectedType || undefined,
        limit: 50,
      });
      console.log("Tourist API response:", response);
      const list: Package[] = response.packages ?? response.data ?? [];
      console.log("Packages state:", list);
      setPackages(list);
    } catch (error) {
      console.error("Failed to load packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedType]);

  const loadPackageTypes = async () => {
    try {
      const packageTypes = await apiService.getPackageTypes();
      setTypes(packageTypes);
    } catch (error) {
      console.error("Failed to load package types:", error);
      setTypes([]);
    }
  };

  useEffect(() => {
    loadPackages();
    loadPackageTypes();
  }, [loadPackages]);

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">All Travel Packages</h2>

        {/* Search and Filter */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="loading"></div>
            <p>Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center">
            <p>No packages found matching your criteria.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "2rem",
              margin: "2rem 0",
            }}
          >
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  background: "var(--card-bg, #fff)",
                  border: "2px solid var(--border-light, #e9ecef)",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image */}
                {pkg.image ? (
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "160px",
                      background: "linear-gradient(135deg, #3F84B1, #1a5276)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                    }}
                  >
                    🌍
                  </div>
                )}

                {/* Content */}
                <div
                  style={{
                    padding: "1.5rem",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--primary-blue, #3F84B1)",
                      margin: 0,
                    }}
                  >
                    {pkg.name}
                  </h3>
                  <p style={{ color: "var(--text-gray, #666)", margin: 0 }}>
                    📍 {(pkg as any).destination || pkg.location}
                  </p>
                  <span
                    style={{
                      background: "var(--primary-blue, #3F84B1)",
                      color: "#fff",
                      padding: "0.2rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      alignSelf: "flex-start",
                    }}
                  >
                    {pkg.type?.replace(/_/g, " ")}
                  </span>
                  {(pkg as any).duration && (
                    <p
                      style={{
                        color: "var(--text-gray, #666)",
                        margin: 0,
                        fontSize: "0.9rem",
                      }}
                    >
                      ⏱ {(pkg as any).duration} day
                      {(pkg as any).duration !== 1 ? "s" : ""}
                    </p>
                  )}
                  <p
                    style={{
                      color: "var(--text-secondary, #555)",
                      margin: 0,
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {pkg.details?.slice(0, 100)}
                    {pkg.details?.length > 100 ? "…" : ""}
                  </p>
                  <div
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "var(--primary-green, #34ad00)",
                    }}
                  >
                    {pkg.price?.formatted ??
                      `₦${(pkg.price as any)?.ngn?.toLocaleString()}`}
                  </div>
                  <Link
                    to={`/packages/${pkg.id}`}
                    className="btn btn-primary"
                    style={{ textAlign: "center", marginTop: "auto" }}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Packages;
