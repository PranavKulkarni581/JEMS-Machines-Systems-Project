import React, { useEffect, useState } from 'react';
import { ChevronRight, LogOut } from 'lucide-react';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

export default function ManagerTask({
  machine,
  currentUser,
  onBack,
  onLogout,
  onOpenStage
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadMachine();
    // eslint-disable-next-line
  }, []);

  const loadMachine = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/manager/machines/${machine.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) throw new Error('Failed to load machine');

      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <button onClick={onBack}>
              <ChevronRight className="rotate-180" />
            </button>
            <h1 className="font-bold text-xl">{machine.name}</h1>
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

            {task.assignedTo && (
              <p className="text-xs mt-1 text-slate-500">
                Assigned to <b>{task.assignedTo}</b>
              </p>
            )}
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="bg-white border rounded-lg p-6 text-center text-slate-600">
            No stages found
          </div>
        )}
      </div>
    </div>
  );
}
