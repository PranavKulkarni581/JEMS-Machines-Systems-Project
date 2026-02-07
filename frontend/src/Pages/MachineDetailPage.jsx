import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

      if (empRes.ok) {
        const empData = await empRes.json();
        setEmployees(empData);
      }
      if (mgrRes.ok) {
        const mgrData = await mgrRes.json();
        setManagers(mgrData);
      }
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
        assignedTo: form.assignedToName,
        startDate: `${form.startDate}T00:00:00`,
        endDate: `${form.endDate}T00:00:00`
      };

      console.log('Creating task:', payload);
      console.log('For machine ID:', machineId);

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
        console.error('Task creation failed:', err);
        alert(`Failed to create task: ${err}`);
        return;
      }

      const result = await res.json();
      console.log('Task created successfully:', result);
      
      onCreated();
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
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
            placeholder="Stage Name *"
            className="w-full px-4 py-2 border rounded-lg"
            value={form.stageName}
            onChange={e =>
              setForm(prev => ({ ...prev, stageName: e.target.value }))
            }
          />

          <input
            placeholder="Stage Number *"
            className="w-full px-4 py-2 border rounded-lg"
            value={form.stageNumber}
            onChange={e =>
              setForm(prev => ({ ...prev, stageNumber: e.target.value }))
            }
          />

          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-lg"
            rows={2}
            value={form.description}
            onChange={e =>
              setForm(prev => ({ ...prev, description: e.target.value }))
            }
          />

          <input
            placeholder="Checked By"
            className="w-full px-4 py-2 border rounded-lg"
            value={form.checkedBy}
            onChange={e =>
              setForm(prev => ({ ...prev, checkedBy: e.target.value }))
            }
          />

          <input
            placeholder="Approved By"
            className="w-full px-4 py-2 border rounded-lg"
            value={form.approvedBy}
            onChange={e =>
              setForm(prev => ({ ...prev, approvedBy: e.target.value }))
            }
          />

          <select
            className="w-full px-4 py-2 border rounded-lg"
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
              Assign To (Employee / Manager) *
            </option>

            {assignees.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.role})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Start Date *</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                value={form.startDate}
                onChange={e =>
                  setForm(prev => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">End Date *</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                value={form.endDate}
                onChange={e =>
                  setForm(prev => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          <button
            disabled={!isValid}
            onClick={createTask}
            className={`w-full py-2 rounded-lg text-white transition ${
              isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400 cursor-not-allowed'
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
  currentUser,
  onBack,
  onLogout,
  onOpenStage
}) {
  const { machineId } = useParams(); // Business ID from URL (e.g., "M-2024-001")
  
  const [machine, setMachine] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('MachineDetailPage - machineId from URL:', machineId);
    if (machineId) {
      loadMachine();
    }
  }, [machineId]);

  const loadMachine = async () => {
    try {
      // API endpoint uses business machineId (e.g., "M-2024-001")
      const url = `${API_BASE_URL}/admin/machines/${machineId}`;
      console.log('Fetching machine from:', url);
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Response:', res.status, errorText);
        throw new Error(`Failed to load machine: ${res.status}`);
      }

      const data = await res.json();
      console.log('Machine loaded:', data);
      console.log('Tasks count:', data.tasks?.length || 0);
      
      setMachine(data);
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error loading machine:', error);
      alert(`Failed to load machine: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading machine...</p>
          <p className="text-xs text-slate-500 mt-2">ID: {machineId}</p>
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg">Machine not found</p>
          <p className="text-sm text-slate-500 mb-4">Machine ID: {machineId}</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between">
          <div className="flex gap-4 items-center">
            <button onClick={onBack} className="hover:bg-slate-100 p-2 rounded-lg transition">
              <ChevronRight className="rotate-180" />
            </button>
            <div>
              <h1 className="font-bold text-xl">{machine.machineName}</h1>
              <p className="text-sm text-slate-500">ID: {machine.machineId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{currentUser?.fullName}</p>
              <p className="text-xs text-slate-500">
                {currentUser?.roles?.includes('ADMIN') ? 'Admin' : 'Manager'}
              </p>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-lg hover:bg-slate-300 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div
              key={task.id}
              onClick={() => {
                console.log('Clicking task - machineId:', machineId, 'taskId:', task.id);
                // Pass business machineId to maintain consistency
                onOpenStage(machineId, task.id);
              }}
              className="bg-white p-5 rounded-xl border shadow cursor-pointer hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{task.stageName}</h3>
                  <p className="text-xs text-slate-500">Stage #{task.stageNumber}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>

              {task.description && (
                <p className="text-sm text-slate-600 mb-2">{task.description}</p>
              )}

              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                {task.assignedTo && (
                  <p className="text-xs text-slate-500">
                    Assigned to <b>{task.assignedTo}</b>
                  </p>
                )}
                
                <div className="flex gap-4 text-xs text-slate-500">
                  {task.subTasks && (
                    <span>Subtasks: {task.subTasks.length}</span>
                  )}
                  <span className="text-blue-600 font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-xl shadow border text-center text-slate-500">
            <p className="mb-2">No tasks added yet</p>
            <p className="text-sm">Click the button below to add your first task</p>
          </div>
        )}

        {currentUser?.roles?.includes('ADMIN') && (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add Task
          </button>
        )}
      </div>

      {showAddTask && (
        <AddTaskModal
          machineId={machineId}
          onClose={() => setShowAddTask(false)}
          onCreated={loadMachine}
        />
      )}
    </div>
  );
}
