import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store token immediately to enable interceptor
      localStorage.setItem('token', token);

      // Fetch user profile list to initialize local storage variables
      api.get('/api/profile/list')
        .then((response) => {
          const profiles = response.data;
          const profile = profiles && profiles.length > 0 ? profiles[0] : { name: 'user' };
          // Set username/email and role
          localStorage.setItem('userEmail', profile.name + '@gmail.com'); // Fallback or derived
          localStorage.setItem('userRole', 'ROLE_USER');
          
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error('Failed to fetch profile during OAuth2 callback', error);
          // Clean state and redirect
          localStorage.removeItem('token');
          navigate('/login?error=oauth2_failed');
        });
    } else {
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-slate-950 flex items-center justify-center text-slate-300">
      <div className="text-center space-y-4">
        {/* Loading Spinner */}
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold tracking-wide">Finalizing Google Authentication...</p>
      </div>
    </div>
  );
}
