import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { ToastProvider } from "./components/Toast";
import { ThemeProvider } from "./context/ThemeContext";
import PublicHome from "./pages/PublicHome";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Tourist Pages
import TouristDashboard from "./pages/tourist/TouristDashboard";
import TouristBookings from "./pages/tourist/TouristBookings";
import Packages from "./pages/tourist/Packages";
import PackageDetails from "./pages/tourist/PackageDetails";
import BookingConfirmation from "./pages/tourist/BookingConfirmation";
import Payment from "./pages/tourist/Payment";
import AIRecommendationsPage from "./pages/tourist/AIRecommendationsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import PackageManagement from "./pages/admin/PackageManagement";
import BookingManagement from "./pages/admin/BookingManagement";

// Tourist Components
import VisaRequestForm from "./pages/tourist/components/VisaRequestForm";
import VisaStatusDashboard from "./pages/tourist/components/VisaStatusDashboard";

// Admin Components
import AdminVisaManagement from "./pages/admin/components/AdminVisaManagement";

import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                <Header />
                <main>
                  <Routes>
                    {/* ==================== ROOT ROUTE ==================== */}
                    {/* Public homepage - accessible to visitors and tourists, redirects admins */}
                    <Route path="/" element={<PublicHome />} />

                    {/* ==================== PUBLIC ROUTES ==================== */}
                    {/* These routes are accessible without login */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />

                    {/* ==================== TOURIST ROUTES ==================== */}
                    {/* Only accessible to logged-in tourists */}
                    <Route
                      path="/tourist/dashboard"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <TouristDashboard />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/tourist/bookings"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <TouristBookings />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/packages"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <Packages />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/packages/:id"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <PackageDetails />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/tourist/booking/:bookingId"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <BookingConfirmation />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/payment"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <Payment />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/payment/:bookingId"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <Payment />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/ai-recommendations"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <AIRecommendationsPage />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/visa-request"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <VisaRequestForm />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/visa-status"
                      element={
                        <RoleBasedRoute allowedRoles={["tourist"]}>
                          <VisaStatusDashboard />
                        </RoleBasedRoute>
                      }
                    />

                    {/* ==================== ADMIN ROUTES ==================== */}
                    {/* Only accessible to logged-in admins */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <RoleBasedRoute allowedRoles={["admin"]}>
                          <AdminDashboard />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <RoleBasedRoute allowedRoles={["admin"]}>
                          <UserManagement />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/admin/packages"
                      element={
                        <RoleBasedRoute allowedRoles={["admin"]}>
                          <PackageManagement />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/admin/bookings"
                      element={
                        <RoleBasedRoute allowedRoles={["admin"]}>
                          <BookingManagement />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/admin/visa"
                      element={
                        <RoleBasedRoute allowedRoles={["admin"]}>
                          <AdminVisaManagement />
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/admin/reports"
                      element={
                        <RoleBasedRoute allowedRoles={["admin"]}>
                          <div className="page-content">
                            <h1>📊 Admin Reports</h1>
                            <p>Reports and analytics coming soon...</p>
                          </div>
                        </RoleBasedRoute>
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <RoleBasedRoute allowedRoles={["admin"]}>
                          <div className="page-content">
                            <h1>⚙️ System Settings</h1>
                            <p>Settings management coming soon...</p>
                          </div>
                        </RoleBasedRoute>
                      }
                    />

                    {/* ==================== FALLBACK ROUTE ==================== */}
                    {/* Redirect any unknown routes to root */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
