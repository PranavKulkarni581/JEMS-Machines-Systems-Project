import React, { useEffect, useState } from 'react';
import { ChevronRight, LogOut, Plus, X, Calendar, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const API_BASE_URL = 'http://localhost:8080/api';

// Input styles
const inputStyles = `
  .modal-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    color: #0f172a;
    background-color: #ffffff;
    transition: all 0.2s;
  }
  
  .modal-input::placeholder {
    color: #94a3b8;
  }
  
  .modal-input:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #0F2A44;
  }
`;

/* ================= ADD TASK MODAL ================= */
function AddTaskModal({ machineId, onClose, onCreated }) {
  const token = localStorage.getItem('token');

  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    stageName: '',
    stageNumber: '',
    description: '',
    checkedBy: '',
    approvedBy: '',
    assignedToName: '',
    assignedToId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadAssignees();
  }, []);

  /* ================= LOAD EMPLOYEES + MANAGERS ================= */
  const loadAssignees = async () => {
    try {
      const [empRes, mgrRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/employees`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/managers`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (empRes.ok) {
        const empData = await empRes.json();
        setEmployees(empData);
      }
      if (mgrRes.ok) {
        const mgrData = await mgrRes.json();
        setManagers(mgrData);
      }
    } catch (err) {
      console.error('Failed to load assignees', err);
    }
  };

  const assignees = [
    ...employees.map(e => ({
      id: e.id.toString(),
      name: e.name,
      role: 'Employee'
    })),
    ...managers.map(m => ({
      id: m.id.toString(),
      name: m.fullName,
      role: 'Manager'
    }))
  ];

  const isValid =
    form.stageName &&
    form.stageNumber &&
    form.startDate &&
    form.endDate &&
    form.assignedToId;

  /* ================= CREATE TASK ================= */
  const createTask = async () => {
    try {
      const payload = {
        stageName: form.stageName,
        stageNumber: form.stageNumber,
        description: form.description,
        checkedBy: form.checkedBy,
        approvedBy: form.approvedBy,
        assignedTo: form.assignedToName,
        startDate: `${form.startDate}T00:00:00`,
        endDate: `${form.endDate}T00:00:00`
      };

      console.log('Creating task:', payload);
      console.log('For machine ID:', machineId);

      const res = await fetch(
        `${API_BASE_URL}/admin/machines/${machineId}/tasks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error('Task creation failed:', err);
        alert(`Failed to create task: ${err}`);
        return;
      }

      const result = await res.json();
      console.log('Task created successfully:', result);
      
      onCreated();
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Unexpected error while creating task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <style>{inputStyles}</style>
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-slate-200"
             style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
          <h2 className="font-bold text-xl text-white">Add New Task</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="text-white" size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Stage Name <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="e.g., Design Phase"
                className="modal-input"
                value={form.stageName}
                onChange={e =>
                  setForm(prev => ({ ...prev, stageName: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Stage Number <span className="text-red-600">*</span>
              </label>
              <input
                placeholder="e.g., 1"
                className="modal-input"
                value={form.stageNumber}
                onChange={e =>
                  setForm(prev => ({ ...prev, stageNumber: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter task description..."
              className="modal-input resize-none"
              rows={3}
              value={form.description}
              onChange={e =>
                setForm(prev => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Checked By
              </label>
              <input
                placeholder="Name"
                className="modal-input"
                value={form.checkedBy}
                onChange={e =>
                  setForm(prev => ({ ...prev, checkedBy: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Approved By
              </label>
              <input
                placeholder="Name"
                className="modal-input"
                value={form.approvedBy}
                onChange={e =>
                  setForm(prev => ({ ...prev, approvedBy: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Assign To <span className="text-red-600">*</span>
            </label>
            <select
              className="modal-input"
              value={form.assignedToId}
              onChange={e => {
                const selected = assignees.find(
                  a => a.id === e.target.value
                );
                if (!selected) return;

                setForm(prev => ({
                  ...prev,
                  assignedToId: selected.id,
                  assignedToName: selected.name
                }));
              }}
            >
              <option value="" disabled>
                Select Employee or Manager
              </option>

              {assignees.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                className="modal-input"
                value={form.startDate}
                onChange={e =>
                  setForm(prev => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                className="modal-input"
                value={form.endDate}
                onChange={e =>
                  setForm(prev => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          
          <button
            disabled={!isValid}
            onClick={createTask}
            className="flex-1 text-white py-3 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={isValid ? { 
              background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)'
            } : { background: '#94a3b8' }}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= FILE UPLOAD MODAL ================= */
function FileUploadModal({
  machineId,
  tasks,
  currentUser,
  onClose
}) {
  const token = localStorage.getItem('token');

  const [selectedTaskId, setSelectedTaskId] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  /* ================= LOAD FILES ================= */
  const loadFiles = async () => {
    try {

      // ✅ FIXED URL (Query Param instead of /machine/)
      let url = `${API_BASE_URL}/files?machineId=${machineId}`;

      if (selectedTaskId) {
        url += `&taskId=${selectedTaskId}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        console.error("Failed to fetch files");
        return;
      }

      const data = await res.json();

      // 🔥 Sort ADMIN first
      const sorted = data.sort((a, b) => {
        if (a.uploadedByRole === b.uploadedByRole) return 0;
        return a.uploadedByRole === "ADMIN" ? -1 : 1;
      });

      setFiles(sorted);

    } catch (err) {
      console.error("Failed to load files", err);
    }
  };

  React.useEffect(() => {
    loadFiles();
  }, [machineId, selectedTaskId]);

  /* ================= UPLOAD FILE ================= */
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("machineId", machineId);
    formData.append("taskId", selectedTaskId || "");

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const err = await res.text();
        alert("Upload failed: " + err);
        return;
      }

      // Refresh file list
      await loadFiles();

      // Reset inputs
      setSelectedFile(null);
      setSelectedTaskId("");

    } catch (err) {
      alert("Upload error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE FILE ================= */
  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/files/${fileId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      // Refresh list
      await loadFiles();

    } catch (err) {
      alert("Delete error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div
          className="px-6 py-5 flex justify-between items-center"
          style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
        >
          <h2 className="text-white font-bold text-lg">Machine Uploads</h2>
          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Stage selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Assign to Stage (Optional)
            </label>
            <select
              className="modal-input"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              <option value="">No Stage (General File)</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.stageName} (Stage #{task.stageNumber})
                </option>
              ))}
            </select>
          </div>

          {/* File input */}
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="modal-input"
          />

          <button
            disabled={!selectedFile || loading}
            onClick={handleUpload}
            className="w-full text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>

          {/* Existing files */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              Existing Uploads
            </h3>

            {files.length === 0 ? (
              <p className="text-sm text-slate-500">
                No files uploaded yet
              </p>
            ) : (
              <div className="space-y-2">
                {files.map(file => (
                  <div
                    key={file.id}
                    className="p-3 border border-slate-200 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {file.uploadedByRole === "ADMIN" ? "Admin" : "Manager"} • {file.uploadedByName}
                      </p>
                    </div>

                    <div className="flex gap-3 items-center">
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View
                      </a>

                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}



/* ================= MACHINE DETAIL PAGE ================= */
export default function MachineDetailPage({
  currentUser,
  onBack,
  onLogout,
  onOpenStage
}) {
  const { machineId } = useParams();
  
  const [machine, setMachine] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
 const [loading, setLoading] = useState(true);
 const [showUploadModal, setShowUploadModal] = useState(false);

 
 const token = localStorage.getItem('token');

 useEffect(() => {
 console.log('MachineDetailPage - machineId from URL:', machineId);
 if (machineId) {
 loadMachine();
 }
 }, [machineId]);

 const loadMachine = async () => {
 try {
 const url = `${API_BASE_URL}/admin/machines/${machineId}`;
 console.log('Fetching machine from:', url);
 
 const res = await fetch(url, {
 headers: { Authorization: `Bearer ${token}` }
 });

 if (!res.ok) {
 const errorText = await res.text();
 console.error('API Response:', res.status, errorText);
 throw new Error(`Failed to load machine: ${res.status}`);
 }

 const data = await res.json();
 console.log('Machine loaded:', data);
 console.log('Tasks count:', data.tasks?.length || 0);
 
 setMachine(data);
 setTasks(data.tasks || []);
 } catch (error) {
 console.error('Error loading machine:', error);
 alert(`Failed to load machine: ${error.message}`);
 } finally {
 setLoading(false);
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
 <div className="text-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#0F2A44' }}></div>
 <p className="text-slate-900 font-semibold">Loading machine...</p>
 <p className="text-xs text-slate-500 mt-2">ID: {machineId}</p>
 </div>
 </div>
 );
 }

 if (!machine) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
 <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
 <p className="mb-4 text-lg font-semibold text-slate-900">Machine not found</p>
 <p className="text-sm text-slate-500 mb-6">Machine ID: {machineId}</p>
 <button
 onClick={onBack}
 className="px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
 style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
 >
 Go Back to Dashboard
 </button>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
 
 {/* HEADER */}
   <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <button 
              onClick={onBack} 
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <ChevronRight className="rotate-180" style={{ color: '#0F2A44' }} strokeWidth={2} />
            </button>
            <div>
              <h1 className="font-bold text-xl text-slate-900">{machine.machineName}</h1>
              <p className="text-sm text-slate-500 font-medium">ID: {machine.machineId}</p>
            </div>
          </div>

          
          
          <div className="flex items-center gap-4">
            <button
  onClick={() => setShowUploadModal(true)}
  className="px-4 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all"
  style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}>
  Upload
   </button>

            <div className="text-right px-3 py-2 bg-slate-100 rounded-xl border border-slate-200">
              <p className="font-semibold text-slate-900 text-sm">{currentUser?.fullName}</p>
              <p className="text-xs font-medium" style={{ color: '#0F2A44' }}>
                {currentUser?.roles?.includes('ADMIN') ? 'Admin' : 'Manager'}
              </p>
            </div>
            
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-700 transition-all"
            >
              <LogOut size={18} strokeWidth={2} />
              Logout
            </button>
          </div>
        </div>
      </header>
 {/* TASKS LIST */}
 <div className="p-6 max-w-6xl mx-auto space-y-4">
 {tasks.length > 0 ? (
 tasks.map(task => (
 <div
 key={task.id}
 onClick={() => {
 console.log('Clicking task - machineId:', machineId, 'taskId:', task.id);
 onOpenStage(machineId, task.id);
 }}
 className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
 >
 <div className="flex justify-between items-start mb-3">
 <div className="flex-1">
 <h3 className="font-bold text-lg text-slate-900 group-hover:text-opacity-80 transition-colors">
 {task.stageName}
 </h3>
 <p className="text-sm font-semibold text-slate-500 mt-1">
 Stage #{task.stageNumber}
 </p>
 </div>
 <StatusBadge status={task.status} />
 </div>

 {task.description && (
 <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
 )}

 <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
 {task.assignedTo && (
 <div className="flex items-center gap-2 text-sm text-slate-600">
 <User size={16} strokeWidth={2} style={{ color: '#0F2A44' }} />
 <span>
 Assigned to <span className="font-semibold text-slate-900">{task.assignedTo}</span>
 </span>
 </div>
 )}
 
 <div className="flex gap-4 text-sm items-center">
 {task.subTasks && task.subTasks.length > 0 && (
 <span className="text-slate-500">
 {task.subTasks.length} Subtask{task.subTasks.length !== 1 ? 's' : ''}
 </span>
 )}
 <span className="font-semibold flex items-center gap-1 transition-all group-hover:gap-2" 
 style={{ color: '#0F2A44' }}>
 View Details
 <ChevronRight size={16} strokeWidth={2.5} />
 </span>
 </div>
 </div>
 </div>
 ))
 ) : (
 <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
 <Calendar className="text-slate-400" size={32} />
 </div>
 <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks added yet</h3>
 <p className="text-sm text-slate-500">Click the button below to add your first task</p>
 </div>
 )}

 {/* ADD TASK BUTTON */}
 {currentUser?.roles?.includes('ADMIN') && (
 <button
 onClick={() => setShowAddTask(true)}
 className="w-full text-white py-4 rounded-2xl flex justify-center items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
 style={{ background: 'linear-gradient(135deg, #0F2A44, #1a3a5a)' }}
 >
 <Plus size={20} strokeWidth={2.5} />
 Add Task
 </button>
 )}
 </div>

 {/* ADD TASK MODAL */}
 {showAddTask && (
 <AddTaskModal
 machineId={machineId}
 onClose={() => setShowAddTask(false)}
 onCreated={loadMachine}
 />
 )}

 {showUploadModal && (
 <FileUploadModal
 machineId={machineId}
 tasks={tasks}
 currentUser={currentUser}
 onClose={() => setShowUploadModal(false)}
 />
)}



 </div>
 );
}
