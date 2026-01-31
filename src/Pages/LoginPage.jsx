import React, { useState } from 'react';
import { Package, User, Settings } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('manager');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    const success = onLogin(userId, password);
    if (!success) {
      alert('Invalid credentials! Please check username and password.');
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">

      {/* Background overlay (decorative) */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,...')] bg-cover pointer-events-none"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-4 mb-2">
              <Package className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">JEMS</h1>
                <p className="text-blue-100 text-sm">
                  Machines & Systems
                </p>
              </div>
            </div>
            <p className="text-blue-100 mt-4 text-sm">
              Project Progress Tracking System
            </p>
          </div>

          {/* Content */}
          <div className="p-8">

            {/* Role Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedRole('manager')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all text-center ${
                  selectedRole === 'manager'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <User className="w-5 h-5 inline mr-2" />
                Manager
              </button>

              <button
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all text-center ${
                  selectedRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Settings className="w-5 h-5 inline mr-2" />
                Admin
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin'
                      : 'emp1, emp2, or emp3'
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
              <p className="font-medium text-slate-600 mb-1">
                Demo Credentials:
              </p>
              <p>Admin: admin / admin123</p>
              <p>Manager: emp1 / emp123</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
