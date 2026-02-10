import React, { useEffect, useState } from 'react';
import { ChevronRight, LogOut, Shield, Package, TrendingUp } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#0F2A44' }}></div>
          <p className="text-slate-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <ChevronRight className="rotate-180" style={{ color: '#0F2A44' }} strokeWidth={2} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
                <Package className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900">
                  {machine.machineName}
                </h1>
                {isAssignedManager && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield size={14} strokeWidth={2} style={{ color: '#10b981' }} />
                    <p className="text-xs font-semibold text-green-600">
                      Assigned Manager
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right px-3 py-2 bg-slate-100 rounded-xl border border-slate-200">
              <p className="font-semibold text-slate-900 text-sm">{currentUser?.fullName}</p>
              <p className="text-xs font-medium" style={{ color: '#0F2A44' }}>Manager</p>
            </div>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 transition-all"
            >
              <LogOut size={18} strokeWidth={2} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* TASKS LIST */}
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <TrendingUp size={20} strokeWidth={2} style={{ color: '#0F2A44' }} />
            Tasks & Stages
          </h2>
          <p className="text-sm text-slate-500">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in this machine
          </p>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() =>
                  navigate(`/machine/${machine.machineId}/stage/${task.id}`)
                }
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-opacity-80 transition-colors">
                      {task.stageName}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                      Stage #{task.stageNumber}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>

                {task.description && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  {task.assignedTo && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="p-1.5 rounded-lg" style={{ background: 'rgba(15, 42, 68, 0.1)' }}>
                        <Shield size={14} strokeWidth={2} style={{ color: '#0F2A44' }} />
                      </div>
                      <span>
                        Assigned to <span className="font-semibold text-slate-900">{task.assignedTo}</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {task.subTasks && task.subTasks.length > 0 && (
                      <span className="text-sm text-slate-500">
                        {task.subTasks.length} Subtask{task.subTasks.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    <span className="font-semibold text-sm flex items-center gap-1 transition-all group-hover:gap-2" 
                          style={{ color: '#0F2A44' }}>
                      View Details
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Package className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks yet</h3>
            <p className="text-sm text-slate-500">This machine doesn't have any tasks assigned yet</p>
          </div>
        )}
      </div>
    </div>
  );
}