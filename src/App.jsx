import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Overview from "./pages/Overview.jsx";
import Bookings from "./pages/Bookings.jsx";
import Services from "./pages/Services.jsx";
import Settings from "./pages/Settings.jsx";
import Ngos from "./pages/ngos.jsx";
import Nysc from "./pages/nysc.jsx";
import Nerd from "./pages/Nerd.jsx";
import Personal from "./pages/Personal.jsx";
import Resume from "./pages/Resume.jsx";
import CompanyName from "./pages/CompanyName.jsx";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-brand-cream font-sans text-brand-ink">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Overview />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Bookings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngos"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Ngos />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
           <Route
          path="/nerd"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Nerd />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nysc"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Nysc />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/personal"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Personal />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Resume />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/company-name"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CompanyName />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
