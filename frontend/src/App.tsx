import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import PendingApprovals from "./pages/PendingApprovals";
import AuditLogs from "./pages/AuditLogs";
import { useAuth } from "./context/AuthContext";
import MISView from "./pages/MISView";

const NavBar: React.FC = () => {
  const { token, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navLink = (path: string, label: string) => (
    <Link
      to={path}
      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
        location.pathname === path
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );

  return (

    <nav className="flex justify-between items-center px-6 py-3 bg-gray-100 shadow-md">
      <div className="flex gap-2">
        {navLink("/upload", "Upload")}
        {navLink("/mis", "MIS")}
        {isAdmin && (
          <>
            {navLink("/approvals", "Pending Approvals")}
            {navLink("/audit", "Audit Logs")}
          </>
        )}
      </div>

      <div>
        {!token ? (
          navLink("/login", "Login")
        ) : (
          <button
            onClick={logout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
          
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />

      <main className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/mis" element={<MISView />} />

            <Route
              path="/approvals"
              element={
                <ProtectedRoute>
                  <PendingApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/upload" replace />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
};

export default App;
