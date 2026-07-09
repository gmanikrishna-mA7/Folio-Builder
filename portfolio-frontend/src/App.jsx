import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './pages/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import PublicPortfolio from './pages/PublicPortfolio';
import Guide from './pages/Guide';
import ResumeGuide from './pages/ResumeGuide';
import Reviews from './pages/Reviews';
import JobAnalyzer from './pages/JobAnalyzer';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guide"
              element={
                <ProtectedRoute>
                  <Guide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-guide"
              element={
                <ProtectedRoute>
                  <ResumeGuide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-analyzer"
              element={
                <ProtectedRoute>
                  <JobAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/public/portfolio/:slug" element={<PublicPortfolio />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
