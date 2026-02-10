import React, { useEffect, useState } from 'react';
import { X, Package, Calendar, User, FileText } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

// Add this style tag to your main CSS or index.css
const inputStyles = `
  .input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    color: #0f172a;
    background-color: #ffffff;
    transition: all 0.2s;
  }
  
  .input::placeholder {
    color: #94a3b8;
  }
  
  .input:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #0F2A44;
  }
  
  .input:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
  }
`;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Inject styles */}
      <style>{inputStyles}</style>
      
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <div className="px-8 py-6 flex justify-between items-center" 
               style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Package className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Machine</h1>
                <p className="text-slate-200 text-sm font-medium mt-0.5">Add machine details and configuration</p>
              </div>
            </div>
            
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
            >
              <X className="text-white" size={24} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          
          {/* Machine Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-slate-700" size={20} strokeWidth={2} />
              <h2 className="text-lg font-bold text-slate-900">Machine Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Machine ID" required>
                <input
                  className="input"
                  placeholder="e.g., M-2024-001"
                  value={form.machineId}
                  onChange={e =>
                    setForm(prev => ({ ...prev, machineId: e.target.value }))
                  }
                />
              </Field>

              <Field label="Machine Name" required>
                <input
                  className="input"
                  placeholder="Enter machine name"
                  value={form.machineName}
                  onChange={e =>
                    setForm(prev => ({ ...prev, machineName: e.target.value }))
                  }
                />
              </Field>

              <Field label="Machine Type">
                <input
                  className="input"
                  placeholder="e.g., CNC, Lathe, Mill"
                  value={form.machineType}
                  onChange={e =>
                    setForm(prev => ({ ...prev, machineType: e.target.value }))
                  }
                />
              </Field>

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
            </div>
          </div>

          {/* Client Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-slate-700" size={20} strokeWidth={2} />
              <h2 className="text-lg font-bold text-slate-900">Client Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Client Name" required>
                <input
                  className="input"
                  placeholder="Enter client name"
                  value={form.clientName}
                  onChange={e =>
                    setForm(prev => ({ ...prev, clientName: e.target.value }))
                  }
                />
              </Field>

              <Field label="Client Contact">
                <input
                  className="input"
                  placeholder="Phone or email"
                  value={form.clientContact}
                  onChange={e =>
                    setForm(prev => ({ ...prev, clientContact: e.target.value }))
                  }
                />
              </Field>
            </div>
          </div>

          {/* Project Timeline Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-slate-700" size={20} strokeWidth={2} />
              <h2 className="text-lg font-bold text-slate-900">Project Timeline</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Project Start Date" required>
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

              <Field label="Delivery Date" required>
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
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-slate-700" size={20} strokeWidth={2} />
              <h2 className="text-lg font-bold text-slate-900">Description</h2>
            </div>
            
            <Field label="Machine Description">
              <textarea
                rows={4}
                className="input resize-none"
                placeholder="Enter detailed description, specifications, or notes..."
                value={form.description}
                onChange={e =>
                  setForm(prev => ({ ...prev, description: e.target.value }))
                }
              />
            </Field>
          </div>

          {/* Required Fields Notice */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Note:</span> Fields marked with{' '}
              <span className="text-red-600 font-semibold">*</span> are required
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              Cancel
            </button>
            
            <button
              onClick={createMachine}
              disabled={loading}
              className="flex-1 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={!loading ? { 
                background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)'
              } : { background: '#94a3b8' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Machine...
                </span>
              ) : (
                'Create Machine'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FIELD COMPONENT ================= */
function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 block mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}