import React, { useEffect, useState } from 'react';
import { Package, LogOut, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import MachineCard from './MachineCard';
import StatusBadge from './StatusBadge';
import ManagerTask from './ManagerTask';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://jems-machines-systems.onrender.com/api';

export default function ManagerDashboard({ currentUser, onLogout }) {
  const [machines, setMachines] = useState([]);
  const [pendingSubtasks, setPendingSubtasks] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineDetails, setMachineDetails] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();


  const token = localStorage.getItem('token');

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/manager/machines`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error('Failed to load machines');
        const allMachines = await res.json();

        const visibleMachines = [];
        const allPending = [];

        for (const m of allMachines) {
          const dRes = await fetch(
            `${API_BASE_URL}/manager/machines/${m.machineId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!dRes.ok) continue;
          const details = await dRes.json();

          const isAssignedManager =
            details.assignedManagerId === currentUser.id;

          const hasAssignedTask = details.tasks?.some(
            t => t.assignedTo === currentUser.fullName
          );

          if (!isAssignedManager && !hasAssignedTask) continue;

          details.tasks.forEach(task => {
            task.subTasks.forEach(sub => {
              const canEditSub =
                isAssignedManager ||
                sub.assignedEmployee === currentUser.fullName;

              if (sub.status !== 'COMPLETED' && canEditSub) {
                allPending.push({
                  ...sub,
                  machineId: details.machineId,
                  machineName: details.machineName,
                  stageName: task.stageName
                });
              }
            });
          });

          visibleMachines.push({
            machineId: details.machineId,
            machineName: details.machineName,
            overallProgress: details.overallProgress,
            status: details.status,
            isAssignedManager
          });
        }

        setMachines(visibleMachines);
        setPendingSubtasks(allPending);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, currentUser]);

  /* ================= OPEN MACHINE ================= */
  const openMachine = async machine => {
    const res = await fetch(
      `${API_BASE_URL}/manager/machines/${machine.machineId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.ok) {
      const data = await res.json();
      setSelectedMachine({
        ...data,
        isAssignedManager: machine.isAssignedManager
      });
      setMachineDetails(data);
    }
  };

  /* ================= OPEN MACHINE WITH SUBTASK (VIEW)================= */
  const openSubtaskDirectly = async (machineId, subtaskId) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/manager/machines/${machineId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) return;

    const data = await res.json();

    // Find which stage contains the subtask
    for (let task of data.tasks || []) {
      const found = task.subTasks?.find(
        sub => sub.id === subtaskId
      );

      if (found) {
        navigate(
          `/machine/${machineId}/stage/${task.id}`,
          { state: { highlightSubtaskId: subtaskId } }
        );
        break;
      }
    }

  } catch (err) {
    console.error("Navigation failed:", err);
  }
};


  if (loading) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  /* ================= MACHINE VIEW ================= */
  if (selectedMachine && machineDetails) {
    return (
      <ManagerTask
        machine={selectedMachine}
        currentUser={currentUser}
        onBack={() => {
          setSelectedMachine(null);
          setMachineDetails(null);
        }}
      />
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
              <Package className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Workspace</h1>
              <p className="text-sm text-slate-500 font-medium">Manager Dashboard</p>
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

      {/* MAIN CONTENT */}
      <main className="p-6 max-w-[1800px] mx-auto">
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="My Machines" 
            value={machines.length} 
            icon={<Package size={24} />}
          />
          <StatCard 
            title="Pending Subtasks" 
            value={pendingSubtasks.length} 
            icon={<Clock size={24} />}
          />
          <StatCard 
            title="Completed Today" 
            value="—" 
            icon={<CheckCircle size={24} />}
          />
        </div>

        {/* PENDING SUBTASKS */}
       
        {pendingSubtasks.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Pending Subtasks
            </h2>
            <div className="space-y-3">
              {pendingSubtasks.map(sub => (
                <div key={sub.id} className="bg-white p-5 rounded-2xl border shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{sub.name}</p>
                      <p className="text-sm text-slate-500">
                        {sub.machineName} – {sub.stageName}
                      </p>
                    </div>
                    <StatusBadge status={sub.status} />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        openSubtaskDirectly(sub.machineId, sub.id)
                      }
                      className="px-3 py-1.5 bg-[#0F2A44] text-white rounded-full text-xs font-semibold hover:opacity-90 transition-all">

                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MACHINES GRID */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} strokeWidth={2} style={{ color: '#0F2A44' }} />
            My Machines
          </h2>
          
          {machines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {machines.map(m => (
                <MachineCard
                  key={m.machineId}
                  machine={{
                    id: m.machineId,
                    machineId: m.machineId,
                    name: m.machineName,
                    progress: m.overallProgress,
                    status: m.status
                  }}
                  onClick={() => openMachine(m)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Package className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No machines assigned</h3>
              <p className="text-sm text-slate-500">You don't have any machines assigned yet</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <div className="p-2 rounded-xl" style={{ background: 'rgba(15, 42, 68, 0.1)' }}>
          <div style={{ color: '#0F2A44' }}>
            {icon}
          </div>
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}