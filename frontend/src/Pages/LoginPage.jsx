import React, { useState } from 'react';
import { Package, User, Settings, Lock, LogIn } from 'lucide-react';

const API_BASE_URL = 'https://jems-machines-systems.onrender.com/api';

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('manager'); // UI only
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      /* ================= LOGIN ================= */
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!loginRes.ok) {
        throw new Error('Invalid credentials');
      }

      const loginData = await loginRes.json();
      const token = loginData.token;

      localStorage.setItem('token', token);

      /* ================= VALIDATE TOKEN ================= */
      const validateRes = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!validateRes.ok) {
        throw new Error('Token validation failed');
      }

      const userData = await validateRes.json();
      localStorage.setItem('user', JSON.stringify(userData));

      /* ================= PASS TO APP ================= */
      onLogin(userData);

    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center px-4 py-8">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" style={{ backgroundColor: '#0F2A44' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" style={{ backgroundColor: '#1a3a5a' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" style={{ backgroundColor: '#0F2A44' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden backdrop-blur-sm bg-opacity-95">

          {/* Header Section */}
          <div className="relative px-8 py-10" style={{ background: 'linear-gradient(to bottom right, #0F2A44, #1a3a5a, #0F2A44)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Package className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">JEMS</h1>
                <p className="text-slate-200 text-sm font-medium">Machines & Systems</p>
              </div>
            </div>
            <p className="text-slate-100 text-sm mt-2 font-light">
              Project Progress Tracking System
            </p>

            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          </div>

          {/* Form Section */}
          <div className="px-8 py-8">

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setSelectedRole('manager')}
                  className={`
                    relative flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm
                    transition-all duration-200 ease-out
                    ${selectedRole === 'manager'
                      ? 'bg-white shadow-md scale-[1.02]'
                      : 'bg-transparent text-slate-600 hover:text-slate-900'
                    }
                  `}
                  style={selectedRole === 'manager' ? { color: '#0F2A44' } : {}}
                >
                  <User className="w-4 h-4" strokeWidth={2.5} />
                  Manager
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`
                    relative flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm
                    transition-all duration-200 ease-out
                    ${selectedRole === 'admin'
                      ? 'bg-white shadow-md scale-[1.02]'
                      : 'bg-transparent text-slate-600 hover:text-slate-900'
                    }
                  `}
                  style={selectedRole === 'admin' ? { color: '#0F2A44' } : {}}
                >
                  <Settings className="w-4 h-4" strokeWidth={2.5} />
                  Admin
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Input Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your username"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 
                             focus:outline-none focus:ring-2 focus:border-transparent
                             transition-all duration-200"
                    style={{ '--tw-ring-color': '#0F2A44' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #0F2A44'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 
                             focus:outline-none focus:ring-2 focus:border-transparent
                             transition-all duration-200"
                    style={{ '--tw-ring-color': '#0F2A44' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #0F2A44'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  />
                </div>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`
                  flex items-center justify-center gap-2 py-3.5 px-12 rounded-xl font-semibold text-base
                  transition-all duration-200 transform
                  ${loading
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
                style={!loading ? { 
                  background: 'linear-gradient(to right, #0F2A44, #1a3a5a)',
                  boxShadow: '0 10px 25px -5px rgba(15, 42, 68, 0.3)'
                } : {}}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(15, 42, 68, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 42, 68, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center mt-6 text-sm text-slate-600">
          © 2026 JEMS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
