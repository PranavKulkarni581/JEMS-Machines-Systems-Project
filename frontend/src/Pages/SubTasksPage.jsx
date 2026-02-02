import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  Plus,
  X,
  CheckCircle
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

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    const res = await fetch(
      `${API_BASE_URL}/admin/machines/${machine.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const found = data.tasks.find(t => t.id === stageKey);
    setTask(found);
  };

  /* ================= ADD SUBTASK ================= */
  const createSubtask = async (payload) => {
    const res = await fetch(
      `${API_BASE_URL}/admin/machines/${machine.id}/tasks/${task.id}/subtasks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      alert('Failed to add subtask');
      return;
    }

    loadTask();
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

      {/* SUBTASKS */}
      <div className="p-6 space-y-4">
        {task.subTasks?.map(st => (
          <div key={st.id} className="bg-white p-4 rounded-xl shadow border">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{st.name}</h3>
              <StatusBadge status={st.status} />
            </div>
            <p className="text-sm text-slate-500">{st.description}</p>
          </div>
        ))}

        {currentUser.roles?.includes('ADMIN') && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex gap-2 justify-center"
          >
            <Plus size={16} /> Add Subtask
          </button>
        )}
      </div>

      {/* ADD SUBTASK MODAL */}
      {showModal && (
        <AddSubtaskModal
          onClose={() => setShowModal(false)}
          onCreate={createSubtask}
        />
      )}
    </div>
  );
}

/* ================= ADD SUBTASK MODAL ================= */
function AddSubtaskModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    assignedEmployee: '',
    assignedEmployeeId: '',
    startDate: '',
    endDate: ''
  });

  const isValid = form.name && form.assignedEmployeeId;

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
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="input"
            rows={2}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Assigned Employee Name"
            className="input"
            onChange={e =>
              setForm({ ...form, assignedEmployee: e.target.value })
            }
          />

          <input
            placeholder="Assigned Employee ID"
            className="input"
            onChange={e =>
              setForm({ ...form, assignedEmployeeId: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="input"
              onChange={e => setForm({ ...form, startDate: e.target.value })}
            />
            <input
              type="date"
              className="input"
              onChange={e => setForm({ ...form, endDate: e.target.value })}
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
