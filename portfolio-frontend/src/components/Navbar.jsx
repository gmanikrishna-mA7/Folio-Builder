import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: 'Developer', email: '', phone: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    setIsAuthenticated(!!token);

    if (token) {
      // Set basic info from storage
      setUserProfile((prev) => ({
        ...prev,
        email: email || '',
        name: email ? email.split('@')[0].toUpperCase() : 'DEVELOPER'
      }));

      // Fetch actual profile info from backend for the dropdown details
      api.get('/api/profile/list')
        .then((res) => {
          const profiles = res.data;
          if (profiles && profiles.length > 0) {
            const activeProfile = profiles[0];
            setUserProfile({
              name: activeProfile.name || 'Developer',
              email: activeProfile.email || email || '',
              phone: activeProfile.phone || 'Not Provided'
            });
          }
        })
        .catch((err) => {
          console.log('Error fetching navbar profile info: ', err);
        });
    }
  }, [location]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold tracking-wider text-white flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Folio</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition">Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition">Builder</Link>
                <Link to="/guide" className="text-sm font-medium text-slate-300 hover:text-white transition">Guide</Link>
                <Link to="/resume-guide" className="text-sm font-medium text-slate-300 hover:text-white transition">Resume Guide</Link>
                <Link to="/job-analyzer" className="text-sm font-medium text-slate-300 hover:text-white transition">Job Analyzer</Link>
                
                {/* Profile Dropdown Button */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm border-2 border-white/10 hover:border-indigo-400 transition"
                  >
                    {userProfile.name.charAt(0).toUpperCase()}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-72 rounded-xl bg-slate-900 border border-white/10 p-5 shadow-2xl transition transform origin-top-right z-50">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold text-lg">
                          {userProfile.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-white truncate">{userProfile.name}</h4>
                          <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
                          {userProfile.phone && (
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">📱 {userProfile.phone}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="block text-center w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
                        >
                          My Builder
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">Login</Link>
                <Link
                  to="/register"
                  className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-slate-950 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                Builder
              </Link>
              <Link
                to="/guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                Guide
              </Link>
              <Link
                to="/resume-guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                Resume Guide
              </Link>
              <Link
                to="/job-analyzer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                Job Analyzer
              </Link>
              
              {/* Mobile Profile Card */}
              <div className="border-t border-white/5 pt-3 mt-3">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{userProfile.name}</h4>
                    <p className="text-xs text-slate-400">{userProfile.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="block mt-2 w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-400 hover:bg-slate-900 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 transition"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
