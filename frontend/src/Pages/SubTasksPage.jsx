import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronRight,
  Plus,
  X
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

export default function SubTasksPage({
  currentUser,
  onBack
}) {
  const { machineId, stageId } = useParams(); // machineId is business ID (e.g., "M-2024-001")
  
  const [machine, setMachine] = useState(null);
  const [task, setTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('SubTasksPage - machineId:', machineId, 'stageId:', stageId);
    loadMachineAndTask();
    loadAssignees();
  }, [machineId, stageId]);

  /* ================= LOAD MACHINE AND TASK ================= */
  const loadMachineAndTask = async () => {
    try {
      // API uses business machineId (e.g., "M-2024-001")
      const url = `${API_BASE_URL}/admin/machines/${machineId}`;
      console.log('Fetching machine from:', url);
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API error:', res.status, errorText);
        throw new Error(`Failed to load machine: ${res.status}`);
      }

      const data = await res.json();
      console.log('Machine data loaded:', data);
      console.log('Tasks in machine:', data.tasks);
      
      setMachine(data);
      
      const found = data.tasks?.find(t => t.id === stageId);
      console.log('Found task with id', stageId, ':', found);
      
      if (!found) {
        console.error('Task not found! Available task IDs:', data.tasks?.map(t => t.id));
      }
      
      setTask(found);
    } catch (error) {
      console.error('Error loading machine:', error);
      alert(`Failed to load machine data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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

      if (empRes.ok) setEmployees(await empRes.json());
      if (mgrRes.ok) setManagers(await mgrRes.json());
    } catch (error) {
      console.error('Error loading assignees:', error);
    }
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

    try {
      console.log('Creating subtask:', body);
      console.log('For machine:', machineId, 'task:', task.id);
      
      const res = await fetch(
        `${API_BASE_URL}/admin/machines/${machineId}/tasks/${task.id}/subtasks`,
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
        console.error('Subtask creation failed:', errorText);
        alert(`Failed to create subtask: ${errorText}`);
        return;
      }

      const result = await res.json();
      console.log('Subtask created:', result);

      await loadMachineAndTask();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating subtask:', error);
      alert('Failed to create subtask');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Task not found</p>
          <p className="text-sm text-slate-500 mb-4">
            Machine: {machineId}, Task: {stageId}
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex gap-4 items-center">
          <button onClick={onBack} className="hover:bg-slate-100 p-2 rounded-lg transition">
            <ChevronRight className="rotate-180" />
          </button>
          <div>
            <h1 className="font-bold text-xl">{task.stageName}</h1>
            <p className="text-sm text-slate-500">{machine?.machineName} - Stage #{task.stageNumber}</p>
          </div>
        </div>
      </header>

      {/* SUBTASK LIST */}
      <div className="p-6 space-y-4">
        {task.subTasks && task.subTasks.length > 0 ? (
          task.subTasks.map(st => (
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

              <div className="flex gap-4 text-xs text-slate-500 mt-2">
                {st.startDate && (
                  <span>Start: {new Date(st.startDate).toLocaleDateString()}</span>
                )}
                {st.endDate && (
                  <span>End: {new Date(st.endDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-xl shadow border text-center text-slate-500">
            No subtasks added yet. Click the button below to add one.
          </div>
        )}

        {currentUser?.roles?.includes('ADMIN') && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex gap-2 justify-center items-center hover:bg-blue-700 transition"
          >
            <Plus size={20} />
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
            placeholder="Subtask Name *"
            className="w-full px-4 py-2 border rounded-lg"
            value={form.name}
            onChange={e =>
              setForm(prev => ({ ...prev, name: e.target.value }))
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

          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={form.assignedEmployeeId}
            onChange={handleAssigneeChange}
          >
            <option value="" disabled>
              Select Employee / Manager *
            </option>

            {assignees.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.role})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Start Date</label>
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
              <label className="text-xs text-slate-600 block mb-1">End Date</label>
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
            onClick={() => onCreate(form)}
            className={`w-full py-2 rounded-lg text-white ${
              isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400 cursor-not-allowed'
            }`}
          >
            Add Subtask
          </button>
        </div>
      </div>
    </div>
  );
}
