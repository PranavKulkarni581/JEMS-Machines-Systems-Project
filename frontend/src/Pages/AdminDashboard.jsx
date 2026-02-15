import React, { useEffect, useState } from 'react';
import {
  Package,
  LogOut,
  Search,
  Users,
  Plus
} from 'lucide-react';

import MachineCard from './MachineCard';

const API_BASE_URL = 'https://jems-machines-systems.onrender.com/api';

export default function AdminDashboard({
  currentUser,
  onSelectMachine,
  onLogout,
  searchQuery = '',
  setSearchQuery,
  onOpenUsers,
  onAddMachineNavigate
}) {
  const [machines, setMachines] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  /* ================= FETCH MACHINES ================= */
  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${API_BASE_URL}/admin/machines`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load machines');
        return res.json();
      })
      .then(data => {
        console.log('Fetched machines:', data); // Debug log
        
        const mapped = data.map(m => ({
          id: m.id,                    // database id (for reference)
          machineId: m.machineId,      // business id (M-2024-001) - USE THIS FOR API CALLS
          name: m.machineName,
          status: m.status,
          progress: m.overallProgress ?? 0,
          assignedManager: m.assignedManager ?? '—',
          client: m.clientName ?? ''
        }));
        
        console.log('Mapped machines:', mapped); // Debug log
        setMachines(mapped);
      })
      .catch(err => {
        console.error('Error loading machines:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER BY STATUS ================= */
  const statusFilteredMachines =
    statusFilter === 'all'
      ? machines
      : statusFilter === 'completed'
      ? machines.filter(m => m.progress === 100)
      : machines.filter(m => m.status === statusFilter);

  /* ================= SEARCH ================= */
  const filteredMachines = statusFilteredMachines.filter(
    m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.machineId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= STATS ================= */
  const stats = {
    total: machines.length,
    inProgress: machines.filter(m => m.status === 'IN_PROGRESS').length,
    onHold: machines.filter(m => m.status === 'ON_HOLD').length,
    completed: machines.filter(m => m.progress === 100).length,
    avgProgress:
      machines.length > 0
        ? Math.round(
            machines.reduce((sum, m) => sum + m.progress, 0) / machines.length
          )
        : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#0F2A44' }}></div>
          <p className="text-slate-600 font-medium">Loading machines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 shadow-sm z-10 backdrop-blur-sm bg-white/95">
        <div className="px-6 py-4 flex justify-between items-center max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
              <Package className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">JEMS Control Center</h1>
              <p className="text-sm text-slate-500 font-medium">Machines & Systems</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenUsers}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
            >
              <Users size={18} strokeWidth={2} />
              Users
            </button>

            <div className="text-right px-3 py-2 bg-slate-100 rounded-xl border border-slate-200">
              <p className="font-semibold text-slate-900 text-sm">{currentUser?.fullName}</p>
              <p className="text-xs font-medium" style={{ color: '#0F2A44' }}>Admin</p>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogOut size={18} strokeWidth={2} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="p-6 max-w-[1800px] mx-auto">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Stat 
            title="Total Machines" 
            value={stats.total} 
            active={statusFilter === 'all'} 
            onClick={() => setStatusFilter('all')} 
          />
          <Stat 
            title="In Progress" 
            value={stats.inProgress} 
            active={statusFilter === 'IN_PROGRESS'} 
            onClick={() => setStatusFilter('IN_PROGRESS')} 
          />
          <Stat 
            title="On Hold" 
            value={stats.onHold} 
            active={statusFilter === 'ON_HOLD'} 
            onClick={() => setStatusFilter('ON_HOLD')} 
          />
          <Stat 
            title="Completed" 
            value={stats.completed} 
            active={statusFilter === 'completed'} 
            onClick={() => setStatusFilter('completed')} 
          />
          <Stat 
            title="Avg Progress" 
            value={`${stats.avgProgress}%`} 
            disabled 
          />
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={2} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by machine name or ID..."
            className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 
                     focus:outline-none focus:ring-2 focus:border-transparent shadow-sm
                     transition-all duration-200"
            style={{ '--tw-ring-color': '#0F2A44' } }
            onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #0F2A44'}
            onBlur={(e) => e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)'}
          />
        </div>

        {/* ================= MACHINES GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredMachines.map(machine => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onClick={() => {
                console.log('Selecting machine:', machine); // Debug log
                onSelectMachine(machine);
              }}
            />
          ))}

          {/* ================= ADD MACHINE CARD ================= */}
          <div
            onClick={onAddMachineNavigate}
            className="bg-white border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 hover:shadow-lg transition-all duration-200 p-8 min-h-[200px] group"
          >
            <div className="p-4 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform duration-200" 
                 style={{ background: 'linear-gradient(135deg, rgba(15, 42, 68, 0.05), rgba(26, 58, 90, 0.05))' }}>
              <Plus size={40} strokeWidth={2} style={{ color: '#0F2A44' }} />
            </div>
            <p className="mt-4 font-semibold text-slate-900 text-lg">Add Machine</p>
            <p className="text-sm text-slate-500 mt-1">Create a new machine entry</p>
          </div>
        </div>

        {/* Empty State */}
        {filteredMachines.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No machines found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= STAT CARD ================= */
function Stat({ title, value, onClick, active, disabled }) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`p-5 rounded-2xl border shadow-sm transition-all duration-200 ${
        disabled
          ? 'bg-white cursor-default border-slate-200'
          : active
          ? 'text-white cursor-pointer shadow-lg scale-[1.02] border-transparent'
          : 'bg-white cursor-pointer hover:shadow-md hover:scale-[1.01] border-slate-200'
      }`}
      style={active && !disabled ? { 
        background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)',
      } : {}}
    >
      <p className={`text-sm font-semibold mb-2 ${active && !disabled ? 'text-white/80' : 'text-slate-500'}`}>
        {title}
      </p>
      <p className={`text-3xl font-bold ${active && !disabled ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </p>
    </div>
  );
}