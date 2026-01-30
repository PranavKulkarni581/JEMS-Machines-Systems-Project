import React from 'react';
import {
  Package,
  LogOut,
  Clock,
  CheckCircle
} from 'lucide-react';

import MachineCard from './MachineCard';
import StatusBadge from './StatusBadge';

export default function EmployeeDashboard({
  machines,
  currentUser,
  onSelectMachine,
  onLogout
}) {
  const myMachines = machines.filter(
    (m) => m.assignedTo === currentUser.id
  );

  const myTasks = [];
  myMachines.forEach((machine) => {
    Object.entries(machine.stages).forEach(([stageKey, stage]) => {
      if (stage.subtasks) {
        stage.subtasks.forEach((task) => {
          if (
            task.assignedTo === currentUser.id &&
            task.status !== 'Completed'
          ) {
            myTasks.push({
              ...task,
              machine: machine.name,
              machineId: machine.id,
              stage: stageKey,
              client: machine.client
            });
          }
        });
      }
    });
  });

  return (
    <div className="min-h-screen w-full bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-500">
                  Employee
                </p>
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
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Assigned Machines"
            value={myMachines.length}
            icon={<Package />}
            color="blue"
          />
          <StatCard
            title="Pending Tasks"
            value={myTasks.length}
            icon={<Clock />}
            color="yellow"
          />
          <StatCard
            title="Completed Today"
            value="5"
            icon={<CheckCircle />}
            color="green"
          />
        </div>

        {/* TASKS */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Pending Tasks
          </h2>

          <div className="space-y-3">
            {myTasks.map((task, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-5 border border-slate-200 hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {task.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {task.machine} – {task.client}
                    </p>
                    <StatusBadge status={task.status} />
                  </div>

                  <button
                    onClick={() =>
                      onSelectMachine(
                        machines.find(
                          (m) => m.id === task.machineId
                        )
                      )
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {myTasks.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center border border-slate-200">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-slate-600">
                  All tasks completed!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* MACHINES */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            My Machines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {myMachines.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onClick={() => onSelectMachine(machine)}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

/* Reusable Stat Card */
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border border-${color}-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 text-${color}-600 opacity-20`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
