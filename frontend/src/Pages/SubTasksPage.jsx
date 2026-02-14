import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronRight,
  Plus,
  X,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

// Input styles
const inputStyles = `
  .subtask-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    color: #0f172a;
    background-color: #ffffff;
    transition: all 0.2s;
  }
  
  .subtask-input::placeholder {
    color: #94a3b8;
  }
  
  .subtask-input:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #0F2A44;
  }
`;

export default function SubTasksPage({
  currentUser,
  onBack
}) {
  const { machineId, stageId } = useParams();
  
  const [machine, setMachine] = useState(null);
  const [task, setTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  /* Approval state */
  const [approvingSubtask, setApprovingSubtask] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('SubTasksPage - machineId:', machineId, 'stageId:', stageId);
    loadMachineAndTask();
    loadAssignees();
  }, [machineId, stageId]);

  /* ================= LOAD MACHINE AND TASK ================= */
  const loadMachineAndTask = async () => {
    try {
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

  /* ================= APPROVE SUBTASK (Change ON_HOLD → COMPLETED) ================= */
  const handleApprove = async (subtaskId) => {
    try {
      setApprovingSubtask(subtaskId);
      
      // Use manager endpoint - admin has access to all machines
      const res = await fetch(
        `${API_BASE_URL}/manager/machines/${machineId}/tasks/${task.id}/subtasks/${subtaskId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'COMPLETED',
            progressPercentage: 100
            // Remarks are already saved, no need to send again
          })
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Approval failed:', errorText);
        alert(`Failed to approve subtask: ${errorText}`);
        return;
      }

      await loadMachineAndTask();
    } catch (error) {
      console.error('Error approving subtask:', error);
      alert('Failed to approve subtask');
    } finally {
      setApprovingSubtask(null);
    }
  };

  /* ================= REJECT SUBTASK (Change ON_HOLD → PENDING) ================= */
  const handleReject = async (subtaskId) => {
    try {
      setApprovingSubtask(subtaskId);
      
      // Use manager endpoint - admin has access to all machines
      const res = await fetch(
        `${API_BASE_URL}/manager/machines/${machineId}/tasks/${task.id}/subtasks/${subtaskId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'PENDING',
            remarks: '', // Clear remarks on rejection
            progressPercentage: 0
          })
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Rejection failed:', errorText);
        alert(`Failed to reject subtask: ${errorText}`);
        return;
      }

      await loadMachineAndTask();
    } catch (error) {
      console.error('Error rejecting subtask:', error);
      alert('Failed to reject subtask');
    } finally {
      setApprovingSubtask(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#0F2A44' }}></div>
          <p className="text-slate-900 font-semibold">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <p className="mb-4 text-lg font-semibold text-slate-900">Task not found</p>
          <p className="text-sm text-slate-500 mb-6">
            Machine: {machineId}, Task: {stageId}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <style>{inputStyles}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="px-6 py-4 flex gap-4 items-center">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ChevronRight className="rotate-180" style={{ color: '#0F2A44' }} strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl text-slate-900">{task.stageName}</h1>
            <p className="text-sm text-slate-500 font-medium">
              {machine?.machineName} - Stage #{task.stageNumber}
            </p>
          </div>
        </div>
      </header>

      {/* SUBTASK LIST */}
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        {task.subTasks && task.subTasks.length > 0 ? (
          task.subTasks.map(st => (
            <div 
              key={st.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-900">{st.name}</h3>
                <StatusBadge status={st.status} />
              </div>

              {/* Description */}
              {st.description && (
                <p className="text-sm text-slate-600 mb-4">{st.description}</p>
              )}

              {/* Meta Information */}
              <div className="space-y-2 mb-4">
                {st.assignedEmployee && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User size={16} strokeWidth={2} style={{ color: '#0F2A44' }} />
                    <span>
                      Assigned to <span className="font-semibold text-slate-900">{st.assignedEmployee}</span>
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  {st.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} strokeWidth={2} style={{ color: '#0F2A44' }} />
                      <span>Start: {new Date(st.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {st.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} strokeWidth={2} style={{ color: '#0F2A44' }} />
                      <span>End: {new Date(st.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remarks Display (if ON_HOLD or COMPLETED) */}
              {st.remarks && (st.status === 'ON_HOLD' || st.status === 'COMPLETED') && (
                <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Manager's Remarks:</p>
                  <p className="text-sm text-slate-700">{st.remarks}</p>
                </div>
              )}

              {/* Approval Actions (Only for ON_HOLD status) */}
              {st.status === 'ON_HOLD' && currentUser?.roles?.includes('ADMIN') && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border-2 mb-3"
                       style={{ 
                         color: '#f59e0b',
                         borderColor: '#f59e0b',
                         backgroundColor: 'rgba(245, 158, 11, 0.1)'
                       }}>
                    <Clock size={18} strokeWidth={2} />
                    Awaiting Your Approval
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(st.id)}
                      disabled={approvingSubtask === st.id}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-red-600 to-red-700 disabled:opacity-50"
                    >
                      <XCircle size={18} strokeWidth={2} />
                      {approvingSubtask === st.id ? 'Processing...' : 'Reject'}
                    </button>

                    <button
                      onClick={() => handleApprove(st.id)}
                      disabled={approvingSubtask === st.id}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    >
                      <CheckCircle size={18} strokeWidth={2} />
                      {approvingSubtask === st.id ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                </div>
              )}

              {/* Completed Badge */}
              {st.status === 'COMPLETED' && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border-2"
                       style={{ 
                         color: '#10b981',
                         borderColor: '#10b981',
                         backgroundColor: 'rgba(16, 185, 129, 0.1)'
                       }}>
                    <CheckCircle size={18} strokeWidth={2} />
                    Approved & Completed
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <FileText className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No subtasks yet</h3>
            <p className="text-sm text-slate-500">Click the button below to add your first subtask</p>
          </div>
        )}

        {/* ADD SUBTASK BUTTON */}
        {currentUser?.roles?.includes('ADMIN') && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full text-white py-4 rounded-2xl flex gap-2 justify-center items-center font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
          >
            <Plus size={20} strokeWidth={2.5} />
            Add Subtask
          </button>
        )}
      </div>

      {/* ADD SUBTASK MODAL */}
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-slate-200"
             style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
          <h2 className="font-bold text-xl text-white">Add Subtask</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="text-white" size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subtask Name <span className="text-red-600">*</span>
            </label>
            <input
              placeholder="Enter subtask name"
              className="subtask-input"
              value={form.name}
              onChange={e =>
                setForm(prev => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description (optional)"
              className="subtask-input resize-none"
              rows={3}
              value={form.description}
              onChange={e =>
                setForm(prev => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Assign To <span className="text-red-600">*</span>
            </label>
            <select
              className="subtask-input"
              value={form.assignedEmployeeId}
              onChange={handleAssigneeChange}
            >
              <option value="" disabled>
                Select Employee or Manager
              </option>

              {assignees.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="subtask-input"
                value={form.startDate}
                onChange={e =>
                  setForm(prev => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="subtask-input"
                value={form.endDate}
                onChange={e =>
                  setForm(prev => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          
          <button
            disabled={!isValid}
            onClick={() => onCreate(form)}
            className="flex-1 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={isValid ? { 
              background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)'
            } : { background: '#94a3b8' }}
          >
            Add Subtask
          </button>
        </div>
      </div>
    </div>
  );
}