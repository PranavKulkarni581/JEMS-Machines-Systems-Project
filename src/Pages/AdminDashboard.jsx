import React, { useState } from 'react';
import {
  Package,
  LogOut,
  Search,
  Users,
  Plus
} from 'lucide-react';

import MachineCard from './MachineCard';

export default function AdminDashboard({
  machines = [],
  currentUser,
  onSelectMachine,
  onLogout,
  searchQuery = '',
  setSearchQuery,
  onOpenUsers,
  onAddMachineNavigate
}) {
  const [statusFilter, setStatusFilter] = useState('all');

  /* ================= FILTER BY STATUS ================= */
  const statusFilteredMachines =
    statusFilter === 'all'
      ? machines
      : statusFilter === 'completed'
      ? machines.filter((m) => m.progress === 100)
      : machines.filter((m) => m.status === statusFilter);

  /* ================= SEARCH ================= */
  const filteredMachines = statusFilteredMachines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= STATS ================= */
  const stats = {
    total: machines.length,
    'On Track': machines.filter((m) => m.status === 'On Track').length,
    Delayed: machines.filter((m) => m.status === 'Delayed').length,
    Completed: machines.filter((m) => m.progress === 100).length
  };

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
              <p className="font-medium">{currentUser?.name}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Stat
            title="Total"
            value={stats.total}
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          />
          <Stat
            title="On Track"
            value={stats['On Track']}
            active={statusFilter === 'On Track'}
            onClick={() => setStatusFilter('On Track')}
          />
          <Stat
            title="Delayed"
            value={stats.Delayed}
            active={statusFilter === 'Delayed'}
            onClick={() => setStatusFilter('Delayed')}
          />
          <Stat
            title="Completed"
            value={stats.Completed}
            active={statusFilter === 'completed'}
            onClick={() => setStatusFilter('completed')}
          />
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search machines..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg"
          />
        </div>

        {/* ================= MACHINES ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredMachines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onClick={() => onSelectMachine(machine)}
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
function Stat({ title, value, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl border shadow transition ${
        active ? 'bg-blue-600 text-white' : 'bg-white'
      }`}
    >
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
