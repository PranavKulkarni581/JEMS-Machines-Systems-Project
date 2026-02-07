import React, { useEffect, useState } from 'react';
import {
  Package,
  LogOut,
  Search,
  Users,
  Plus
} from 'lucide-react';

import MachineCard from './MachineCard';

const API_BASE_URL = 'http://localhost:8080/api';

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
    return <div className="p-6">Loading machines...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b sticky top-0 shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">JEMS Control Center</h1>
              <p className="text-sm text-slate-500">Machines & Systems</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenUsers}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Users size={16} /> Users
            </button>

            <div className="text-right">
              <p className="font-medium">{currentUser?.fullName}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-lg"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="p-6">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Stat title="Total" value={stats.total} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
          <Stat title="In Progress" value={stats.inProgress} active={statusFilter === 'IN_PROGRESS'} onClick={() => setStatusFilter('IN_PROGRESS')} />
          <Stat title="On Hold" value={stats.onHold} active={statusFilter === 'ON_HOLD'} onClick={() => setStatusFilter('ON_HOLD')} />
          <Stat title="Completed" value={stats.completed} active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')} />
          <Stat title="Avg Progress" value={`${stats.avgProgress}%`} disabled />
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search machines..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg"
          />
        </div>

        {/* ================= MACHINES ================= */}
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

          {/* ================= ADD MACHINE ================= */}
          <div
            onClick={onAddMachineNavigate}
            className="bg-white border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:shadow p-6"
          >
            <Plus size={32} className="text-blue-600" />
            <p className="mt-2 font-semibold">Add Machine</p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= STAT CARD ================= */
function Stat({ title, value, onClick, active, disabled }) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`p-4 rounded-xl border shadow transition ${
        disabled
          ? 'bg-white cursor-default'
          : active
          ? 'bg-blue-600 text-white cursor-pointer'
          : 'bg-white cursor-pointer'
      }`}
    >
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
