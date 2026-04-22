import React, { useEffect, useState } from 'react';
import { ChevronRight, CheckCircle, Lock, User, Calendar, X, Clock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = 'https://jems-machines-systems.onrender.com/api';

const inputStyles = `
  .remark-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    color: #0f172a;
    background-color: #ffffff;
    transition: all 0.2s;
    resize: none;
  }

  .remark-input::placeholder {
    color: #94a3b8;
  }

  .remark-input:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #0F2A44;
  }
`;

export default function ManagerSubTasks({ currentUser }) {
  const { machineId, stageId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [task, setTask] = useState(null);
  const [isAssignedManager, setIsAssignedManager] = useState(false);
  const [isTaskManager, setIsTaskManager] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedSubtaskId, setSelectedSubtaskId] = useState(null);
  const [remarks, setRemarks] = useState('');

  const location = useLocation();
  const highlightSubtaskId = location.state?.highlightSubtaskId;

  useEffect(() => {
    loadTask();
    // eslint-disable-next-line
  }, [machineId, stageId]);

  const loadTask = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/manager/machines/${machineId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error('Failed to load machine');

      const data = await res.json();

      setIsAssignedManager(data.assignedManagerId === currentUser.id);

      const found = data.tasks.find(t => String(t.id) === String(stageId));
      setTask(found || null);

      if (found) {
        setIsTaskManager(found.assignedTo === currentUser.fullName);
      }

    } catch (err) {
      console.error(err);
      alert('Failed to load subtasks');
    }
  };

  useEffect(() => {
    if (!highlightSubtaskId) return;
    if (!task) return;
    if (!task.subTasks || task.subTasks.length === 0) return;

    const found = task.subTasks.find(
      sub => sub.id === highlightSubtaskId
    );

    if (found) {
      setSelectedSubtaskId(found);
    }
  }, [highlightSubtaskId, task]);

  const confirmComplete = async () => {
    if (!selectedSubtaskId || updating) return;

    setUpdating(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/manager/machines/${machineId}/tasks/${task.id}/subtasks/${selectedSubtaskId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'ON_HOLD',
            remarks: remarks,
            progressPercentage: 100
          })
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        alert('Failed to submit subtask for approval');
        return;
      }

      setShowRemarkModal(false);
      setRemarks('');
      setSelectedSubtaskId(null);
      await loadTask();
    } catch (err) {
      console.error(err);
      alert('Unexpected error');
    } finally {
      setUpdating(false);
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <p className="text-lg font-semibold text-slate-900">Task not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <style>{inputStyles}</style>

      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="px-6 py-4 flex gap-4 items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ChevronRight className="rotate-180" style={{ color: '#0F2A44' }} strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl text-slate-900">{task.stageName}</h1>
            <p className="text-sm text-slate-500 font-medium">Stage #{task.stageNumber}</p>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-4">
        {task.subTasks && task.subTasks.length > 0 ? (
          task.subTasks.map(st => {

            const canEdit =
              isAssignedManager ||
              isTaskManager ||
              st.assignedEmployee === currentUser.fullName;

            return (
              <div
                key={st.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-slate-900">{st.name}</h3>
                  <StatusBadge status={st.status} />
                </div>

                {st.description && (
                  <p className="text-sm text-slate-600 mb-4">{st.description}</p>
                )}

                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  {st.assignedEmployee && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <User size={16} strokeWidth={2} style={{ color: '#0F2A44' }} />
                      <span>
                        Assigned to <span className="font-semibold text-slate-900">{st.assignedEmployee}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">

                  {(st.status === 'PENDING' || st.status === 'IN_PROGRESS') && (
                    canEdit ? (
                      <button
                        onClick={() => {
                          setSelectedSubtaskId(st.id);
                          setShowRemarkModal(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <CheckCircle size={18} strokeWidth={2} />
                        Mark Complete
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                        <Lock size={16} strokeWidth={2} />
                        View only - Not assigned to you
                      </div>
                    )
                  )}

                  {/* ✅ ADDED: Waiting for Approval UI */}
                  {st.status === 'ON_HOLD' && (
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200">
                      <Clock size={16} strokeWidth={2} />
                      Waiting for Admin Approval
                    </div>
                  )}

                </div>
              </div>
            );
          })
        ) : null}
      </div>

      {showRemarkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

            <div
              className="px-6 py-5 flex justify-between items-center border-b border-slate-200"
              style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
            >
              <h2 className="font-bold text-xl text-white">Complete Subtask</h2>
              <button onClick={() => setShowRemarkModal(false)}>
                <X className="text-white" size={24} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                rows={5}
                placeholder="Enter remarks..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="remark-input"
              />
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t flex gap-3">
              <button
                onClick={() => setShowRemarkModal(false)}
                className="flex-1 bg-white border border-slate-300 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                disabled={!remarks.trim() || updating}
                onClick={confirmComplete}
                className="flex-1 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                {updating ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
