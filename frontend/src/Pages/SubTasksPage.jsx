import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  Plus,
  X
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

export default function SubTasksPage({
  machine,
  stageKey,
  currentUser,
  onBack
}) {
  const [task, setTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadTask();
    loadAssignees();
  }, []);

  /* ================= LOAD TASK ================= */
  const loadTask = async () => {
    const res = await fetch(
      `${API_BASE_URL}/admin/machines/${machine.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    const found = data.tasks.find(t => t.id === stageKey);
    setTask(found);
  };

  /* ================= LOAD EMPLOYEES + MANAGERS ================= */
  const loadAssignees = async () => {
    const [empRes, mgrRes] = await Promise.all([
      fetch(`${API_BASE_URL}/admin/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${API_BASE_URL}/admin/managers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    setEmployees(await empRes.json());
    setManagers(await mgrRes.json());
  };

  /* ================= CREATE SUBTASK ================= */
  const createSubtask = async (payload) => {
    const body = {
      name: payload.name,
      description: payload.description,
      assignedEmployee: payload.assignedEmployee,
      assignedEmployeeId: Number(payload.assignedEmployeeId),
      status: 'PENDING',
      startDate: `${payload.startDate}T00:00:00`,
      endDate: `${payload.endDate}T00:00:00`
    };

    const res = await fetch(
      `${API_BASE_URL}/admin/machines/${machine.id}/tasks/${task.id}/subtasks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(errorText);
      alert('Failed to create subtask');
      return;
    }

    await loadTask();
    setShowModal(false);
  };

  if (!task) return null;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex gap-4 items-center">
          <button onClick={onBack}>
            <ChevronRight className="rotate-180" />
          </button>
          <h1 className="font-bold text-xl">{task.stageName}</h1>
        </div>
      </header>

      {/* SUBTASK LIST */}
      <div className="p-6 space-y-4">
        {task.subTasks?.map(st => (
          <div key={st.id} className="bg-white p-4 rounded-xl shadow border">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{st.name}</h3>
              <StatusBadge status={st.status} />
            </div>

            <p className="text-sm text-slate-500">{st.description}</p>

            {st.assignedEmployee && (
              <p className="text-xs mt-2 text-slate-600">
                Assigned to <b>{st.assignedEmployee}</b>
              </p>
            )}
          </div>
        ))}

        {currentUser.roles?.includes('ADMIN') && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex gap-2 justify-center"
          >
            <Plus size={16} />
            Add Subtask
          </button>
        )}
      </div>

      {showModal && (
        <AddSubtaskModal
          onClose={() => setShowModal(false)}
          onCreate={createSubtask}
          employees={employees}
          managers={managers}
        />
      )}
    </div>
  );
}

/* ================= ADD SUBTASK MODAL ================= */
function AddSubtaskModal({
  onClose,
  onCreate,
  employees,
  managers
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    assignedEmployee: '',
    assignedEmployeeId: '',
    startDate: '',
    endDate: ''
  });

  const assignees = [
    ...employees.map(e => ({
      id: e.id.toString(),
      name: e.name,
      role: 'Employee'
    })),
    ...managers.map(m => ({
      id: m.id.toString(),
      name: m.fullName,
      role: 'Manager'
    }))
  ];

  const isValid = form.name && form.assignedEmployeeId;

  const handleAssigneeChange = (e) => {
    const selected = assignees.find(a => a.id === e.target.value);
    if (!selected) return;

    setForm(prev => ({
      ...prev,
      assignedEmployee: selected.name,
      assignedEmployeeId: selected.id
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">

        <div className="flex justify-between mb-4">
          <h2 className="font-bold">Add Subtask</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Subtask Name"
            className="input"
            value={form.name}
            onChange={e =>
              setForm(prev => ({ ...prev, name: e.target.value }))
            }
          />

          <textarea
            placeholder="Description"
            className="input"
            rows={2}
            value={form.description}
            onChange={e =>
              setForm(prev => ({ ...prev, description: e.target.value }))
            }
          />

          {/* CONTROLLED DROPDOWN */}
          <select
            className="input"
            value={form.assignedEmployeeId}
            onChange={handleAssigneeChange}
          >
            <option value="" disabled>
              Select Employee / Manager
            </option>

            {assignees.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.role})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="input"
              value={form.startDate}
              onChange={e =>
                setForm(prev => ({ ...prev, startDate: e.target.value }))
              }
            />
            <input
              type="date"
              className="input"
              value={form.endDate}
              onChange={e =>
                setForm(prev => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>

          <button
            disabled={!isValid}
            onClick={() => onCreate(form)}
            className={`w-full py-2 rounded-lg text-white ${
              isValid ? 'bg-blue-600' : 'bg-slate-400'
            }`}
          >
            Add Subtask
          </button>
        </div>
      </div>
    </div>
  );
}
