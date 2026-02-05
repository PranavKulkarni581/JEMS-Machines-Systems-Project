import React, { useEffect, useState } from 'react';
import { ChevronRight, LogOut, Plus, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

/* ================= ADD TASK MODAL ================= */
function AddTaskModal({ machineId, onClose, onCreated }) {
  const token = localStorage.getItem('token');

  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    stageName: '',
    stageNumber: '',
    description: '',
    checkedBy: '',
    approvedBy: '',
    assignedToName: '',
    assignedToId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadAssignees();
  }, []);

  /* ================= LOAD EMPLOYEES + MANAGERS ================= */
  const loadAssignees = async () => {
    try {
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
    } catch (err) {
      console.error('Failed to load assignees', err);
    }
  };

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

  const isValid =
    form.stageName &&
    form.stageNumber &&
    form.startDate &&
    form.endDate &&
    form.assignedToId;

  /* ================= CREATE TASK ================= */
  const createTask = async () => {
    try {
      const payload = {
        stageName: form.stageName,
        stageNumber: form.stageNumber,
        description: form.description,
        checkedBy: form.checkedBy,
        approvedBy: form.approvedBy,
        assignedTo: form.assignedToName, // ✅ BACKEND EXPECTS NAME
        startDate: `${form.startDate}T00:00:00`,
        endDate: `${form.endDate}T00:00:00`
      };

      const res = await fetch(
        `${API_BASE_URL}/admin/machines/${machineId}/tasks`,
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
        const err = await res.text();
        console.error(err);
        alert('Failed to create task');
        return;
      }

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Unexpected error while creating task');
    }
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
            placeholder="Stage Name"
            className="input"
            value={form.stageName}
            onChange={e =>
              setForm(prev => ({ ...prev, stageName: e.target.value }))
            }
          />

          <input
            placeholder="Stage Number"
            className="input"
            value={form.stageNumber}
            onChange={e =>
              setForm(prev => ({ ...prev, stageNumber: e.target.value }))
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

          <input
            placeholder="Checked By"
            className="input"
            value={form.checkedBy}
            onChange={e =>
              setForm(prev => ({ ...prev, checkedBy: e.target.value }))
            }
          />

          <input
            placeholder="Approved By"
            className="input"
            value={form.approvedBy}
            onChange={e =>
              setForm(prev => ({ ...prev, approvedBy: e.target.value }))
            }
          />

          {/* ✅ SAME DROPDOWN PATTERN AS SUBTASKS */}
          <select
            className="input"
            value={form.assignedToId}
            onChange={e => {
              const selected = assignees.find(
                a => a.id === e.target.value
              );
              if (!selected) return;

              setForm(prev => ({
                ...prev,
                assignedToId: selected.id,
                assignedToName: selected.name
              }));
            }}
          >
            <option value="" disabled>
              Assign To (Employee / Manager)
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
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between">
          <div className="flex gap-4 items-center">
            <button onClick={onBack}>
              <ChevronRight className="rotate-180" />
            </button>
            <div>
              <h1 className="font-bold text-xl">{machine.machineName}</h1>
              <p className="text-sm text-slate-500">{machine.machineId}</p>
            </div>
          </div>
          <button onClick={onLogout}><LogOut /></button>
        </div>
      </header>

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

            {task.assignedTo && (
              <p className="text-xs mt-1 text-slate-500">
                Assigned to <b>{task.assignedTo}</b>
              </p>
            )}
          </div>
        ))}

        {currentUser.roles?.includes('ADMIN') && (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center gap-2"
          >
            <Plus size={16} />
            Add Task
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
