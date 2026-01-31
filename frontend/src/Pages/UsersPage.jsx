import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  Pencil,
  X
} from 'lucide-react';

/*
  Props expected:
  employees, setEmployees
  users, setUsers
  onBack (optional – for router compatibility)
*/

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
    name: '',
    email: '',
    password: ''
  });

  const [filter, setFilter] = useState('all'); // all | manager
  const [search, setSearch] = useState('');

  /* ================= ADD EMPLOYEE ================= */
  const addEmployee = () => {
    if (!newEmployeeName.trim()) return;

    setEmployees([
      ...employees,
      {
        id: `emp_${Date.now()}`,
        name: newEmployeeName,
        hasUser: false,
        role: 'employee'
      }
    ]);

    setNewEmployeeName('');
  };

  /* ================= OPEN CREATE MANAGER ================= */
  const openCreateManager = (emp) => {
    setSelectedEmployee(emp);
    setEditingManager(null);
    setManagerData({ name: '', email: '', password: '' });
    setShowModal(true);
  };

  /* ================= OPEN EDIT MANAGER ================= */
  const openEditManager = (manager) => {
    setEditingManager(manager);
    setSelectedEmployee(
      employees.find(e => e.id === manager.employeeId)
    );

    setManagerData({
      name: manager.name,
      email: manager.email,
      password: manager.password
    });

    setShowModal(true);
  };

  /* ================= SAVE MANAGER ================= */
  const saveManager = () => {
    const { name, email, password } = managerData;
    if (!name || !email || !password) return;

    if (editingManager) {
      // UPDATE
      setUsers(
        users.map(u =>
          u.id === editingManager.id
            ? { ...u, name, email, password }
            : u
        )
      );
    } else {
      // CREATE
      setUsers([
        ...users,
        {
          id: `user_${Date.now()}`,
          name,
          email,
          password,
          role: 'manager',
          employeeId: selectedEmployee.id
        }
      ]);

      setEmployees(
        employees.map(e =>
          e.id === selectedEmployee.id
            ? { ...e, hasUser: true, role: 'manager' }
            : e
        )
      );
    }

    closeModal();
  };

  /* ================= CLOSE MODAL ================= */
  const closeModal = () => {
    setShowModal(false);
    setEditingManager(null);
    setSelectedEmployee(null);
    setManagerData({ name: '', email: '', password: '' });
  };

  /* ================= HELPERS ================= */
  const getManager = (empId) =>
    users.find(u => u.employeeId === empId);

  /* ================= FILTER + SEARCH ================= */
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase());

    if (filter === 'manager') {
      return emp.role === 'manager' && matchesSearch;
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
          const manager = getManager(emp.id);

          return (
            <div
              key={emp.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{emp.name}</p>
                <p className="text-sm text-slate-500">
                  {emp.hasUser ? 'Manager' : 'Employee'}
                </p>
              </div>

              {!emp.hasUser ? (
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
              <input
                placeholder="Name"
                className="w-full border px-3 py-2 rounded-lg"
                value={managerData.name}
                onChange={(e) =>
                  setManagerData({
                    ...managerData,
                    name: e.target.value
                  })
                }
              />

              <input
                placeholder="Email"
                className="w-full border px-3 py-2 rounded-lg"
                value={managerData.email}
                onChange={(e) =>
                  setManagerData({
                    ...managerData,
                    email: e.target.value
                  })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded-lg"
                value={managerData.password}
                onChange={(e) =>
                  setManagerData({
                    ...managerData,
                    password: e.target.value
                  })
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
