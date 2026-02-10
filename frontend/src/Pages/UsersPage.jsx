import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Pencil,
  X,
  Users,
  UserPlus,
  Search
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

// Input styles
const inputStyles = `
  .user-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    color: #0f172a;
    background-color: #ffffff;
    transition: all 0.2s;
  }
  
  .user-input::placeholder {
    color: #94a3b8;
  }
  
  .user-input:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #0F2A44;
  }
`;

export default function UsersPage({
  employees,
  setEmployees,
  users,
  setUsers,
  onBack
}) {
  /* ================= STATE ================= */
  const [newEmployeeName, setNewEmployeeName] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [managerData, setManagerData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: ''
  });

  const [filter, setFilter] = useState('all'); // all | manager
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadEmployees();
    loadManagers();
  }, []);

  const loadEmployees = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setEmployees(data);
  };

  const loadManagers = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/managers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  /* ================= ADD EMPLOYEE ================= */
  const addEmployee = async () => {
    if (!newEmployeeName.trim()) return;

    await fetch(`${API_BASE_URL}/admin/employees`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newEmployeeName })
    });

    setNewEmployeeName('');
    loadEmployees();
  };

  /* ================= OPEN CREATE MANAGER ================= */
  const openCreateManager = (emp) => {
    setSelectedEmployee(emp);
    setEditingManager(null);
    setManagerData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      phoneNumber: ''
    });
    setShowModal(true);
  };

  /* ================= OPEN EDIT MANAGER ================= */
  const openEditManager = (manager) => {
    setEditingManager(manager);
    setSelectedEmployee(null);

    setManagerData({
      username: manager.username,
      email: manager.email,
      password: '',
      fullName: manager.fullName,
      phoneNumber: manager.phoneNumber || ''
    });

    setShowModal(true);
  };

  /* ================= SAVE MANAGER ================= */
  const saveManager = async () => {
    const { username, email, password, fullName, phoneNumber } = managerData;

    if (!email || !fullName || (!editingManager && !password)) return;

    if (editingManager) {
      await fetch(`${API_BASE_URL}/admin/managers/${editingManager.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fullName, email, phoneNumber })
      });
    } else {
      await fetch(`${API_BASE_URL}/admin/managers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          fullName,
          phoneNumber
        })
      });
    }

    closeModal();
    loadManagers();
    loadEmployees();
  };

  /* ================= CLOSE MODAL ================= */
  const closeModal = () => {
    setShowModal(false);
    setEditingManager(null);
    setSelectedEmployee(null);
    setManagerData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      phoneNumber: ''
    });
  };

  /* ================= HELPERS ================= */
  const getManager = (empName) =>
    users.find(u => u.fullName === empName);

  /* ================= FILTER + SEARCH ================= */
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase());

    if (filter === 'manager') {
      return getManager(emp.name) && matchesSearch;
    }

    return matchesSearch;
  });

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <style>{inputStyles}</style>

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
              <Users className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Employees & Managers
              </h1>
              <p className="text-sm text-slate-500 font-medium">Manage your team members</p>
            </div>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-slate-700 transition-all"
            >
              Back to Dashboard
            </button>
          )}
        </div>

        {/* ADD EMPLOYEE */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <UserPlus size={18} strokeWidth={2} style={{ color: '#0F2A44' }} />
            Add New Employee
          </h3>
          <div className="flex gap-3">
            <input
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="Enter employee name"
              className="user-input flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addEmployee()}
            />
            <button
              onClick={addEmployee}
              className="px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
            >
              Add Employee
            </button>
          </div>
        </div>

        {/* FILTER + SEARCH */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                filter === 'all'
                  ? 'text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={filter === 'all' ? { background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' } : {}}
            >
              All Employees
            </button>

            <button
              onClick={() => setFilter('manager')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                filter === 'manager'
                  ? 'text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={filter === 'manager' ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : {}}
            >
              Managers Only
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="user-input pl-10"
            />
          </div>
        </div>

        {/* EMPLOYEE LIST */}
        <div className="space-y-3">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(emp => {
              const manager = getManager(emp.name);

              return (
                <div
                  key={emp.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-semibold text-slate-900 text-lg">{emp.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                        manager 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {manager ? 'Manager' : 'Employee'}
                      </span>
                      {manager && manager.email && (
                        <span className="text-xs text-slate-500">{manager.email}</span>
                      )}
                    </div>
                  </div>

                  {!manager ? (
                    <button
                      onClick={() => openCreateManager(emp)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    >
                      <ShieldCheck size={18} strokeWidth={2} />
                      Create Manager
                    </button>
                  ) : (
                    <button
                      onClick={() => openEditManager(manager)}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <Pencil size={18} strokeWidth={2} />
                      Edit Manager
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No employees found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              
              {/* Modal Header */}
              <div className="px-6 py-5 flex justify-between items-center border-b border-slate-200"
                   style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
                <h2 className="text-xl font-bold text-white">
                  {editingManager ? 'Edit Manager' : 'Create Manager'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="text-white" size={24} strokeWidth={2} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {!editingManager && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Username <span className="text-red-600">*</span>
                    </label>
                    <input
                      placeholder="Enter username"
                      className="user-input"
                      value={managerData.username}
                      onChange={(e) =>
                        setManagerData({ ...managerData, username: e.target.value })
                      }
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    placeholder="Enter full name"
                    className="user-input"
                    value={managerData.fullName}
                    onChange={(e) =>
                      setManagerData({ ...managerData, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="user-input"
                    value={managerData.email}
                    onChange={(e) =>
                      setManagerData({ ...managerData, email: e.target.value })
                    }
                  />
                </div>

                {!editingManager && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="user-input"
                      value={managerData.password}
                      onChange={(e) =>
                        setManagerData({ ...managerData, password: e.target.value })
                      }
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="user-input"
                    value={managerData.phoneNumber}
                    onChange={(e) =>
                      setManagerData({ ...managerData, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                
                <button
                  onClick={saveManager}
                  className="flex-1 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  {editingManager ? 'Update Manager' : 'Create Manager'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}