import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

export default function AddMachine({ onBack, onCreateMachine }) {
  const token = localStorage.getItem('token');

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

  /* ================= LOAD MANAGERS ================= */
  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/managers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to load managers');

      const data = await res.json();
      setManagers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CREATE MACHINE ================= */
  const createMachine = async () => {
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

    const payload = {
      machineId: form.machineId.trim(),
      machineName: form.machineName.trim(),
      machineType: form.machineType.trim(),
      description: form.description.trim(),
      clientName: form.clientName.trim(),
      clientContact: form.clientContact.trim(),

      // ✅ IMPORTANT FIX
      assignedManagerId:
        form.assignedManagerId !== ''
          ? String(form.assignedManagerId)
          : null,

      projectStartDate: `${form.projectStartDate}T00:00:00`,
      poDate: form.poDate ? `${form.poDate}T00:00:00` : null,
      deliveryPeriod: `${form.deliveryPeriod}T00:00:00`
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/admin/machines`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Create machine failed:', errorText);
        throw new Error('Failed to create machine');
      }

      const createdMachine = await res.json();
      onCreateMachine(createdMachine);
    } catch (err) {
      console.error(err);
      alert('Machine creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Machine</h1>
          <button onClick={onBack}><X /></button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field label="Machine ID *">
            <input
              className="input"
              value={form.machineId}
              onChange={e =>
                setForm(prev => ({ ...prev, machineId: e.target.value }))
              }
            />
          </Field>

          <Field label="Machine Name *">
            <input
              className="input"
              value={form.machineName}
              onChange={e =>
                setForm(prev => ({ ...prev, machineName: e.target.value }))
              }
            />
          </Field>

          <Field label="Machine Type">
            <input
              className="input"
              value={form.machineType}
              onChange={e =>
                setForm(prev => ({ ...prev, machineType: e.target.value }))
              }
            />
          </Field>

          <Field label="Client Name *">
            <input
              className="input"
              value={form.clientName}
              onChange={e =>
                setForm(prev => ({ ...prev, clientName: e.target.value }))
              }
            />
          </Field>

          <Field label="Client Contact">
            <input
              className="input"
              value={form.clientContact}
              onChange={e =>
                setForm(prev => ({ ...prev, clientContact: e.target.value }))
              }
            />
          </Field>

          {/* ✅ CONTROLLED MANAGER DROPDOWN */}
          <Field label="Assigned Manager">
            <select
              className="input"
              value={form.assignedManagerId}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  assignedManagerId: e.target.value
                }))
              }
            >
              <option value="">Select Manager</option>

              {managers.map(m => (
                <option key={m.id} value={String(m.id)}>
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
                setForm(prev => ({
                  ...prev,
                  projectStartDate: e.target.value
                }))
              }
            />
          </Field>

          <Field label="PO Date">
            <input
              type="date"
              className="input"
              value={form.poDate}
              onChange={e =>
                setForm(prev => ({ ...prev, poDate: e.target.value }))
              }
            />
          </Field>

          <Field label="Delivery Date *">
            <input
              type="date"
              className="input"
              value={form.deliveryPeriod}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  deliveryPeriod: e.target.value
                }))
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
              setForm(prev => ({ ...prev, description: e.target.value }))
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
      <label className="text-sm font-medium block mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
