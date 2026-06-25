// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./components/AdminNavbar";

import Home from "./pages/Home";
import Citizens from "./pages/Citizens";
import Services from "./pages/Services";
import Complaints from "./pages/Complaints";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AdminCitizens from "./pages/AdminCitizens";
import AdminServices from "./pages/AdminServices";
import AdminComplaints from "./pages/AdminComplaints";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with User Navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </div>
            </>
          }
        />
        <Route
          path="/citizens"
          element={
            <>
              <Navbar />
              <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                  <Citizens />
                </main>
                <Footer />
              </div>
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                  <Services />
                </main>
                <Footer />
              </div>
            </>
          }
        />
        <Route
          path="/complaints"
          element={
            <>
              <Navbar />
              <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                  <Complaints />
                </main>
                <Footer />
              </div>
            </>
          }
        />

        {/* Admin Routes with Admin Navbar */}
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <AdminNavbar />
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow pt-16">
                    <Dashboard />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/citizens"
          element={
            <ProtectedRoute>
              <>
                <AdminNavbar />
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow pt-16">
                    <AdminCitizens />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <>
                <AdminNavbar />
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow pt-16">
                    <AdminServices />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <>
                <AdminNavbar />
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow pt-16">
                    <AdminComplaints />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;