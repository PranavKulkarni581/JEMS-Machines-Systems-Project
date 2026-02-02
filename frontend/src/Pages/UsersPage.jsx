import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Pencil,
  X
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

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
  loadEmployees(); // ✅ THIS FIXES EVERYTHING
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
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Admin – Employees & Managers
        </h1>

        {onBack && (
          <button
            onClick={onBack}
            className="bg-slate-200 px-4 py-2 rounded-lg"
          >
            Back
          </button>
        )}
      </div>

      {/* ADD EMPLOYEE */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="flex gap-3">
          <input
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
            placeholder="Employee name"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            onClick={addEmployee}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Employee
          </button>
        </div>
      </div>

      {/* FILTER + SEARCH */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter('manager')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'manager'
                ? 'bg-green-600 text-white'
                : 'bg-slate-200'
            }`}
          >
            Managers
          </button>
        </div>

        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full md:w-64"
        />
      </div>

      {/* EMPLOYEE LIST */}
      <div className="space-y-3">
        {filteredEmployees.map(emp => {
          const manager = getManager(emp.name);

          return (
            <div
              key={emp.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{emp.name}</p>
                <p className="text-sm text-slate-500">
                  {manager ? 'Manager' : 'Employee'}
                </p>
              </div>

              {!manager ? (
                <button
                  onClick={() => openCreateManager(emp)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex gap-2"
                >
                  <ShieldCheck size={16} />
                  Create Manager
                </button>
              ) : (
                <button
                  onClick={() => openEditManager(manager)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingManager ? 'Edit Manager' : 'Create Manager'}
            </h2>

            <div className="space-y-3">
              {!editingManager && (
                <input
                  placeholder="Username"
                  className="w-full border px-3 py-2 rounded-lg"
                  value={managerData.username}
                  onChange={(e) =>
                    setManagerData({ ...managerData, username: e.target.value })
                  }
                />
              )}

              <input
                placeholder="Full Name"
                className="w-full border px-3 py-2 rounded-lg"
                value={managerData.fullName}
                onChange={(e) =>
                  setManagerData({ ...managerData, fullName: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="w-full border px-3 py-2 rounded-lg"
                value={managerData.email}
                onChange={(e) =>
                  setManagerData({ ...managerData, email: e.target.value })
                }
              />

              {!editingManager && (
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border px-3 py-2 rounded-lg"
                  value={managerData.password}
                  onChange={(e) =>
                    setManagerData({ ...managerData, password: e.target.value })
                  }
                />
              )}

              <input
                placeholder="Phone Number"
                className="w-full border px-3 py-2 rounded-lg"
                value={managerData.phoneNumber}
                onChange={(e) =>
                  setManagerData({ ...managerData, phoneNumber: e.target.value })
                }
              />

              <button
                onClick={saveManager}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                {editingManager ? 'Update Manager' : 'Create Manager'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
