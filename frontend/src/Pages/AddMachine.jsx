import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

export default function AddMachine({ onBack, onCreateMachine }) {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    machineId: '',
    machineName: '',
    machineType: '',
    description: '',
    clientName: '',
    clientContact: '',
    projectStartDate: '',
    poDate: '',
    deliveryPeriod: '',
    assignedManagerId: ''
  });

  const token = localStorage.getItem('token');

  /* ================= LOAD MANAGERS ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/managers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setManagers(data))
      .catch(err => console.error(err));
  }, [token]);

  /* ================= CREATE MACHINE ================= */
  const createMachine = () => {
    if (
      !form.machineId ||
      !form.machineName ||
      !form.clientName ||
      !form.projectStartDate ||
      !form.deliveryPeriod
    ) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    fetch(`${API_BASE_URL}/admin/machines`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create machine');
        return res.json();
      })
      .then(createdMachine => {
        onCreateMachine(createdMachine);
      })
      .catch(err => {
        console.error(err);
        alert('Machine creation failed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Machine</h1>
          <button onClick={onBack}>
            <X />
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field label="Machine ID *">
            <input
              className="input"
              value={form.machineId}
              onChange={e => setForm({ ...form, machineId: e.target.value })}
            />
          </Field>

          <Field label="Machine Name *">
            <input
              className="input"
              value={form.machineName}
              onChange={e => setForm({ ...form, machineName: e.target.value })}
            />
          </Field>

          <Field label="Machine Type">
            <input
              className="input"
              value={form.machineType}
              onChange={e => setForm({ ...form, machineType: e.target.value })}
            />
          </Field>

          <Field label="Client Name *">
            <input
              className="input"
              value={form.clientName}
              onChange={e => setForm({ ...form, clientName: e.target.value })}
            />
          </Field>

          <Field label="Client Contact">
            <input
              className="input"
              value={form.clientContact}
              onChange={e => setForm({ ...form, clientContact: e.target.value })}
            />
          </Field>

          <Field label="Assigned Manager">
            <select
              className="input"
              value={form.assignedManagerId}
              onChange={e =>
                setForm({ ...form, assignedManagerId: e.target.value })
              }
            >
              <option value="">Select manager</option>
              {managers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.fullName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Project Start Date *">
            <input
              type="date"
              className="input"
              value={form.projectStartDate}
              onChange={e =>
                setForm({ ...form, projectStartDate: e.target.value })
              }
            />
          </Field>

          <Field label="PO Date">
            <input
              type="date"
              className="input"
              value={form.poDate}
              onChange={e => setForm({ ...form, poDate: e.target.value })}
            />
          </Field>

          <Field label="Delivery Date *">
            <input
              type="date"
              className="input"
              value={form.deliveryPeriod}
              onChange={e =>
                setForm({ ...form, deliveryPeriod: e.target.value })
              }
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            rows={3}
            className="input"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </Field>

        {/* ACTION */}
        <button
          onClick={createMachine}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6"
        >
          {loading ? 'Creating...' : 'Create Machine'}
        </button>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */
function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      {children}
    </div>
  );
}
