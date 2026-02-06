import React, { useEffect, useState } from 'react';
import { ChevronRight, LogOut, UserCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

export default function ManagerTask({
  machine,
  currentUser,
  onBack,
  onLogout
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAssignedManager, setIsAssignedManager] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    loadMachine();
  }, []);

  const loadMachine = async () => {
    const res = await fetch(
      `${API_BASE_URL}/manager/machines/${machine.machineId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    setTasks(data.tasks || []);
    setIsAssignedManager(data.assignedManagerId === currentUser.id);
    setLoading(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <button onClick={onBack}>
              <ChevronRight className="rotate-180" />
            </button>
            <div>
              <h1 className="font-bold text-xl">
                {machine.machineName}
              </h1>
              {isAssignedManager && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Shield size={14} /> Assigned Manager
                </p>
              )}
            </div>
          </div>
          <button onClick={onLogout}><LogOut /></button>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={() =>
              navigate(`/machine/${machine.machineId}/stage/${task.id}`)
            }
            className="bg-white p-5 rounded-xl border shadow cursor-pointer hover:border-blue-500 transition"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{task.stageName}</h3>
                {task.assignedTo && (
                  <p className="text-xs text-slate-500">
                    Assigned to <b>{task.assignedTo}</b>
                  </p>
                )}
              </div>
              <StatusBadge status={task.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
