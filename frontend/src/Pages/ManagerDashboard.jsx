import React, { useEffect, useState } from 'react';
import { Package, LogOut, CheckCircle } from 'lucide-react';
import MachineCard from './MachineCard';
import StatusBadge from './StatusBadge';
import ManagerTask from './ManagerTask';

const API_BASE_URL = 'http://localhost:8080/api';

export default function ManagerDashboard({ currentUser, onLogout }) {
  const [machines, setMachines] = useState([]);
  const [pendingSubtasks, setPendingSubtasks] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineDetails, setMachineDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 🔑 IMPORTANT: fetch ALL machines manager can access
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

          // ❌ Skip machines user has no relation to
          if (!isAssignedManager && !hasAssignedTask) continue;

          // Collect pending subtasks ONLY user can act on
          details.tasks.forEach(task => {
            task.subTasks.forEach(sub => {
              const canEditSub =
                isAssignedManager ||
                sub.assignedEmployee === currentUser.fullName;

              if (sub.status !== 'COMPLETED' && canEditSub) {
                allPending.push({
                  ...sub,
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

  if (loading) return <div className="p-6">Loading dashboard...</div>;

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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">My Workspace</h1>
        <button onClick={onLogout}><LogOut /></button>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard title="Machines" value={machines.length} />
          <StatCard title="My Pending Subtasks" value={pendingSubtasks.length} />
          <StatCard title="Completed Today" value="—" />
        </div>

        <section className="mb-8">
          <h2 className="font-bold mb-3">Pending Subtasks</h2>
          {pendingSubtasks.map(sub => (
            <div key={sub.id} className="bg-white p-4 rounded border mb-2">
              <p className="font-semibold">{sub.name}</p>
              <p className="text-sm text-slate-500">
                {sub.machineName} – {sub.stageName}
              </p>
              <StatusBadge status={sub.status} />
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-bold mb-3">Machines</h2>
          <div className="grid grid-cols-4 gap-6">
            {machines.map(m => (
              <MachineCard
                key={m.machineId}
                machine={{
                  id: m.machineId,
                  name: m.machineName,
                  progress: m.overallProgress,
                  status: m.status
                }}
                onClick={() => openMachine(m)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
