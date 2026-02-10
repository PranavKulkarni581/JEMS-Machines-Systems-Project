import React from 'react';
import { ChevronRight, Activity, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MachineCard({ machine, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        w-full
        bg-white
        rounded-2xl
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        cursor-pointer
        border
        border-slate-200
        overflow-hidden
        group
        hover:scale-[1.02]
        hover:border-slate-300
      "
    >
      <div className="p-6">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1 transition-colors duration-200"
                style={{ 
                  color: 'inherit'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0F2A44'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
            >
              {machine.name}
            </h3>

            <p className="text-sm font-medium text-slate-500 mb-2">
              ID: <span className="font-semibold text-slate-700">{machine.machineId || machine.id}</span>
            </p>

            {machine.client && (
              <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                <span className="font-medium">{machine.client}</span>
              </div>
            )}

            {machine.assignedManager && machine.assignedManager !== '—' && (
              <p className="text-xs text-slate-500 mt-2">
                Manager: <span className="font-semibold text-slate-700">{machine.assignedManager}</span>
              </p>
            )}
          </div>

          <div 
            className="p-2 rounded-xl transition-all duration-200 group-hover:scale-110"
            style={{ backgroundColor: 'rgba(15, 42, 68, 0.05)' }}
          >
            <ChevronRight 
              className="w-5 h-5 transition-all duration-200" 
              style={{ color: '#0F2A44' }}
            />
          </div>
        </div>

        {/* ================= PROGRESS ================= */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Progress
            </span>

            <span className="text-sm font-bold px-2 py-0.5 rounded-lg" 
                  style={{ 
                    color: '#0F2A44',
                    backgroundColor: 'rgba(15, 42, 68, 0.1)'
                  }}>
              {machine.progress}%
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ 
                width: `${machine.progress}%`,
                background: 'linear-gradient(90deg, #0F2A44, #1a3a5a, #0F2A44)',
                backgroundSize: '200% 100%',
                animation: machine.progress > 0 && machine.progress < 100 ? 'shimmer 2s infinite' : 'none'
              }}
            />
          </div>
        </div>

        {/* ================= STATUS & MANAGER ================= */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Activity className="w-4 h-4" strokeWidth={2} style={{ color: '#0F2A44' }} />
            <span className="font-semibold text-slate-700">
              {machine.status?.replace('_', ' ') || 'N/A'}
            </span>
          </div>

          <StatusBadge status={machine.status} />
        </div>

      </div>

      {/* Shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
      `}</style>
    </div>
  );
}