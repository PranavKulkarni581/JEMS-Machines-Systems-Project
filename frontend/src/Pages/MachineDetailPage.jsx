import React, { useEffect, useState } from 'react';
import { ChevronRight, LogOut, Plus, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

/* ================= ADD TASK MODAL ================= */
function AddTaskModal({ machineId, onClose, onCreated }) {
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    stageName: '',
    stageNumber: '',
    description: '',
    checkedBy: '',
    approvedBy: '',
    assignedTo: '',
    startDate: '',
    endDate: ''
  });

  const isValid =
    form.stageName &&
    form.stageNumber &&
    form.startDate &&
    form.endDate;

  const createTask = async () => {
    if (!isValid) return;

    const res = await fetch(
      `${API_BASE_URL}/admin/machines/${machineId}/tasks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      }
    );

    if (!res.ok) {
      alert('Failed to create task');
      return;
    }

    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">

        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Add Task</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Stage Name (Design, Assembly...)"
            className="input"
            onChange={e => setForm({ ...form, stageName: e.target.value })}
          />

          <input
            placeholder="Stage Number"
            className="input"
            onChange={e => setForm({ ...form, stageNumber: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="input"
            rows={2}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            placeholder="Checked By"
            className="input"
            onChange={e => setForm({ ...form, checkedBy: e.target.value })}
          />

          <input
            placeholder="Approved By"
            className="input"
            onChange={e => setForm({ ...form, approvedBy: e.target.value })}
          />

          <input
            placeholder="Assigned To"
            className="input"
            onChange={e => setForm({ ...form, assignedTo: e.target.value })}
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
            onClick={createTask}
            className={`w-full py-2 rounded-lg text-white ${
              isValid ? 'bg-blue-600' : 'bg-slate-400'
            }`}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= MACHINE DETAIL PAGE ================= */
export default function MachineDetailPage({
  machine,
  currentUser,
  onBack,
  onLogout,
  onOpenStage
}) {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadMachine();
  }, []);

  const loadMachine = async () => {
    const res = await fetch(
      `${API_BASE_URL}/admin/machines/${machine.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between">
          <div className="flex gap-4 items-center">
            <button onClick={onBack}>
              <ChevronRight className="rotate-180" />
            </button>
            <div>
              <h1 className="font-bold text-xl">{machine.machineName}</h1>
              <p className="text-sm text-slate-500">
                {machine.machineId}
              </p>
            </div>
          </div>
          <button onClick={onLogout}><LogOut /></button>
        </div>
      </header>

      {/* TASKS */}
      <div className="p-6 space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() => onOpenStage(task.id)}
            className="bg-white p-5 rounded-xl border shadow cursor-pointer"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{task.stageName}</h3>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {task.description}
            </p>
          </div>
        ))}

        {currentUser.roles?.includes('ADMIN') && (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center gap-2"
          >
            <Plus size={16} /> Add Task
          </button>
        )}
      </div>

      {showAddTask && (
        <AddTaskModal
          machineId={machine.id}
          onClose={() => setShowAddTask(false)}
          onCreated={loadMachine}
        />
      )}
    </div>
  );
}
