import React, { useEffect, useState } from 'react';
import { ChevronRight, CheckCircle, Lock } from 'lucide-react';
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

      // 🔁 reload to reflect updated status everywhere
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
      <div className="p-6 text-center text-slate-600">
        Task not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex gap-4 items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronRight className="rotate-180" />
          </button>
          <h1 className="font-bold text-xl">{task.stageName}</h1>
        </div>
      </header>

      {/* ================= SUBTASKS ================= */}
      <div className="p-6 space-y-4">
        {task.subTasks?.map(st => {
          const canEdit =
            isAssignedManager ||
            st.assignedEmployee === currentUser.fullName;

          return (
            <div
              key={st.id}
              className="bg-white p-4 rounded-xl shadow border"
            >
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

              {/* ================= ACTION ================= */}
              {st.status !== 'COMPLETED' && (
                canEdit ? (
                  <button
                    disabled={updating}
                    onClick={() => markComplete(st.id)}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm"
                  >
                    <CheckCircle size={16} />
                    Mark Complete
                  </button>
                ) : (
                  <div className="mt-3 text-sm text-slate-400 flex gap-2 items-center">
                    <Lock size={14} />
                    View only
                  </div>
                )
              )}
            </div>
          );
        })}

        {(!task.subTasks || task.subTasks.length === 0) && (
          <div className="bg-white border rounded-lg p-6 text-center text-slate-600">
            No subtasks available
          </div>
        )}
      </div>
    </div>
  );
}
