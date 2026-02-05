import React, { useEffect, useState } from 'react';
import { Package, LogOut, CheckCircle } from 'lucide-react';
import MachineCard from './MachineCard';
import StatusBadge from './StatusBadge';
import ManagerTask from './ManagerTask';

const API_BASE_URL = 'http://localhost:8080/api';

export default function ManagerDashboard({
  currentUser,
  onSelectMachine,
  onLogout
}) {
  const [machines, setMachines] = useState([]);
  const [pendingSubtasks, setPendingSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        /* 1️⃣ Machines assigned to this manager */
        const res = await fetch(
          `${API_BASE_URL}/manager/machines/assigned`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) throw new Error('Failed to load assigned machines');
        const assignedMachines = await res.json();

        const allMachines = [];
        const allPending = [];

        /* 2️⃣ Fetch details for each machine */
        for (const m of assignedMachines) {
          const dRes = await fetch(
            `${API_BASE_URL}/manager/machines/${m.machineId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (!dRes.ok) continue;
          const details = await dRes.json();

          /* Manager owns this machine → full edit rights */
          const canEditMachine = true;

          details.tasks.forEach(task => {
            task.subTasks.forEach(sub => {
              if (sub.status !== 'COMPLETED') {
                allPending.push({
                  ...sub,
                  taskId: task.id,
                  stageName: task.stageName,
                  machineId: details.machineId,
                  machineName: details.machineName,
                  client: details.clientName,
                  canEdit: canEditMachine
                });
              }
            });
          });

          allMachines.push({
            machineId: details.machineId,
            machineName: details.machineName,
            overallProgress: details.overallProgress,
            status: details.status
          });
        }

        setMachines(allMachines);
        setPendingSubtasks(allPending);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm w-full">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                My Workspace
              </h1>
              <p className="text-sm text-slate-500">
                JEMS Machines & Systems
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">
                {currentUser.fullName}
              </p>
              <p className="text-xs text-slate-500">Manager</p>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="w-full px-6 py-8">
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          <StatCard title="Assigned Machines" value={machines.length} />
          <StatCard title="Pending Subtasks" value={pendingSubtasks.length} />
          <StatCard title="Completed Today" value="—" />
        </div>

        {/* ================= PENDING SUBTASKS ================= */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Pending Subtasks
          </h2>

          <div className="space-y-3">
            {pendingSubtasks.map(sub => (
              <div
                key={sub.id}
                className="bg-white rounded-lg shadow-md p-5 border border-slate-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {sub.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-1">
                      {sub.machineName} – {sub.client}
                    </p>
                    <p className="text-xs text-slate-500 mb-2">
                      Stage: {sub.stageName}
                    </p>
                    <StatusBadge status={sub.status} />
                  </div>

                  <button
                    onClick={() =>
                      onSelectMachine({
                        id: sub.machineId,
                        name: sub.machineName
                      })
                    }
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {pendingSubtasks.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center border border-slate-200">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-slate-600">
                  All assigned work is completed 🎉
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ================= MACHINES ================= */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            My Machines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {machines.map(machine => (
              <MachineCard
                key={machine.machineId}
                machine={{
                  id: machine.machineId,
                  name: machine.machineName,
                  progress: machine.overallProgress,
                  status: machine.status
                }}
                onClick={() =>
                  onSelectMachine({
                    id: machine.machineId,
                    name: machine.machineName
                  })
                }
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border">
      <p className="text-sm text-slate-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
