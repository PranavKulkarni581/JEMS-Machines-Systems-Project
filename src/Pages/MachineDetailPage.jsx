import React from 'react';
import { ChevronRight, LogOut, Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MachineDetailPage({
  machine,
  currentUser,
  onBack,
  onLogout,
  onOpenStage,
  onAddStage
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack}>
              <ChevronRight className="rotate-180 w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{machine.name}</h1>
              <p className="text-sm text-slate-500">
                {machine.client} • {machine.id}
              </p>
            </div>
          </div>

          <button onClick={onLogout}>
            <LogOut />
          </button>
        </div>
      </header>

      {/* STAGES */}
      <div className="px-6 py-6 space-y-4">
        {Object.entries(machine.stages).map(([key, stage]) => (
          <div
            key={key}
            onClick={() => stage.subtasks.length && onOpenStage(key)}
            className="bg-white p-5 rounded-xl border shadow-md cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{stage.name}</h3>
              <StatusBadge status={stage.status} />
            </div>
          </div>
        ))}

        {/* ADD TASK / STAGE */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => {
              const name = prompt('Enter task name');
              if (name) onAddStage(machine.id, name);
            }}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            <Plus size={16} />
            Add Task
          </button>
        )}
      </div>
    </div>
  );
}
