import React from 'react';
import { ChevronRight, Activity } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MachineCard({ machine, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        w-full
        bg-white
        rounded-xl
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
        cursor-pointer
        border
        border-slate-200
        overflow-hidden
        group
      "
    >
      <div className="p-6">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition">
              {machine.name}
            </h3>

            <p className="text-sm text-slate-500">
              ID: {machine.id}
            </p>

            {machine.client && (
              <p className="text-sm text-slate-600 mt-1">
                Client: {machine.client}
              </p>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>

        {/* ================= PROGRESS ================= */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-600">
              Progress
            </span>

            <span className="text-sm font-bold text-blue-600">
              {machine.progress}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${machine.progress}%` }}
            />
          </div>
        </div>

        {/* ================= STATUS ================= */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Activity className="w-4 h-4" />
            <span className="font-medium">
              {machine.status.replace('_', ' ')}
            </span>
          </div>

          <StatusBadge status={machine.status} />
        </div>

      </div>
    </div>
  );
}
