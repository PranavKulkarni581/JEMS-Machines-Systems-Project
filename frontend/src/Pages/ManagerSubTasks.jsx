import React, { useEffect, useState } from 'react';
import { ChevronRight, CheckCircle, Lock, User, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

export default function ManagerSubTasks({ currentUser }) {
  const { machineId, stageId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [task, setTask] = useState(null);
  const [isAssignedManager, setIsAssignedManager] = useState(false);
  const [updating, setUpdating] = useState(false);

  /* ================= LOAD TASK ================= */
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

      const found = data.tasks.find(t => t.id === stageId);
      setTask(found || null);
    } catch (err) {
      console.error(err);
      alert('Failed to load subtasks');
    }
  };

  /* ================= COMPLETE SUBTASK ================= */
  const markComplete = async (subTaskId) => {
    if (!task?.id || updating) return;

    setUpdating(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/manager/machines/${machineId}/tasks/${task.id}/subtasks/${subTaskId}/complete`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            remarks: 'Completed successfully'
          })
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        alert('Failed to mark subtask complete');
        return;
      }

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
      
      {/* HEADER */}
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

      {/* SUBTASKS LIST */}
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        {task.subTasks && task.subTasks.length > 0 ? (
          task.subTasks.map(st => {
            const canEdit =
              isAssignedManager ||
              st.assignedEmployee === currentUser.fullName;

            return (
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

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  {st.assignedEmployee && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <User size={16} strokeWidth={2} style={{ color: '#0F2A44' }} />
                      <span>
                        Assigned to <span className="font-semibold text-slate-900">{st.assignedEmployee}</span>
                      </span>
                    </div>
                  )}
                  
                  {st.startDate && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={16} strokeWidth={2} style={{ color: '#0F2A44' }} />
                      <span>Start: {new Date(st.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {st.endDate && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={16} strokeWidth={2} style={{ color: '#0F2A44' }} />
                      <span>End: {new Date(st.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100">
                  {st.status !== 'COMPLETED' && (
                    canEdit ? (
                      <button
                        disabled={updating}
                        onClick={() => markComplete(st.id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      >
                        <CheckCircle size={18} strokeWidth={2} />
                        {updating ? 'Marking Complete...' : 'Mark Complete'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                        <Lock size={16} strokeWidth={2} />
                        View only - Not assigned to you
                      </div>
                    )
                  )}
                  
                  {st.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border-2"
                         style={{ 
                           color: '#10b981',
                           borderColor: '#10b981',
                           backgroundColor: 'rgba(16, 185, 129, 0.1)'
                         }}>
                      <CheckCircle size={18} strokeWidth={2} />
                      Completed
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Calendar className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No subtasks available</h3>
            <p className="text-sm text-slate-500">This task doesn't have any subtasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}