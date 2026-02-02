import React, { useState } from 'react';
import { Package, User, Settings } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('manager'); // UI only
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    try {
      setLoading(true);

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
      alert('Login failed. Please check credentials.');
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-4 mb-2">
              <Package className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">JEMS</h1>
                <p className="text-blue-100 text-sm">Machines & Systems</p>
              </div>
            </div>
            <p className="text-blue-100 mt-4 text-sm">
              Project Progress Tracking System
            </p>
          </div>

          {/* Content */}
          <div className="p-8">

            {/* Role Toggle (UI only) */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedRole('manager')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium ${
                  selectedRole === 'manager'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <User className="w-5 h-5 inline mr-2" />
                Manager
              </button>

              <button
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium ${
                  selectedRole === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Settings className="w-5 h-5 inline mr-2" />
                Admin
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 border rounded-xl"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-xl"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
