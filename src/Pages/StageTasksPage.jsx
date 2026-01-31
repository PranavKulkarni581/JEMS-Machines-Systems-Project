import React, { useState } from 'react';
import {
  ChevronRight,
  CheckCircle,
  MessageSquare,
  Plus,
  X
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { USERS } from '../data/machines';

const SUBTASK_OPTIONS_BY_STAGE = {
  Design: ['Blueprint', 'Review'],
  Manufacturing: ['Raw Material', 'Fabrication'],
  Assembly: ['Mechanical', 'Electrical'],
  'Quality Check': ['Inspection', 'Testing'],
  Delivery: ['Packaging', 'Transport']
};

export default function StageTasksPage({
  machine,
  stageKey,
  currentUser,
  onBack,
  onUpdateTask,
  onAddSubtask
}) {
  const stage = machine?.stages?.[stageKey];

  const [remarks, setRemarks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState('');

  const [newSubtask, setNewSubtask] = useState({
    name: '',
    description: '',
    employeeIds: []
  });

  if (!stage) return null;

  const employeeList = Object.values(USERS).filter(
    u => u.role === 'employee'
  );

  /* ================= COMPLETE TASK ================= */
  const handleComplete = (taskId) => {
    onUpdateTask(
      machine.id,
      stageKey,
      taskId,
      'Completed',
      remarks[taskId] || ''
    );

    setRemarks(prev => ({ ...prev, [taskId]: '' }));
  };

  /* ================= CREATE SUBTASK ================= */
  const handleCreateSubtask = () => {
    const finalName =
      newSubtask.name === 'CUSTOM'
        ? customName.trim()
        : newSubtask.name.trim();

    if (!finalName) return;

    onAddSubtask(machine.id, stageKey, {
      name: finalName,
      description: newSubtask.description,
      employeeIds: newSubtask.employeeIds
    });

    // reset
    setNewSubtask({ name: '', description: '', employeeIds: [] });
    setCustomName('');
    setShowModal(false);
  };

  const toggleEmployee = (id) => {
    setNewSubtask(prev => ({
      ...prev,
      employeeIds: prev.employeeIds.includes(id)
        ? prev.employeeIds.filter(e => e !== id)
        : [...prev.employeeIds, id]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={onBack}>
            <ChevronRight className="rotate-180 w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{stage.name}</h1>
            <p className="text-sm text-slate-500">
              {machine.name} • {machine.id}
            </p>
          </div>
        </div>
      </header>

      {/* SUBTASK LIST */}
      <div className="px-6 py-8 space-y-4">
        {(stage.subtasks || []).map(task => {
          const canMarkComplete =
            (currentUser.role === 'admin' ||
              task.employeeIds?.includes(currentUser.id)) &&
            task.status !== 'Completed';

          return (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md p-5 border"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{task.name}</h3>

                  {task.description && (
                    <p className="text-sm text-slate-500 mt-1">
                      {task.description}
                    </p>
                  )}

                  <p className="text-sm text-slate-500 mt-2">
                    Assigned:
                  </p>

                  <p className="text-sm font-medium">
                    {task.employeeIds?.length
                      ? task.employeeIds
                          .map(id => USERS[id]?.name)
                          .join(', ')
                      : 'Unassigned'}
                  </p>
                </div>

                <StatusBadge status={task.status} />
              </div>

              {task.remarks && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                  <div className="flex gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-700">
                      {task.remarks}
                    </p>
                  </div>
                </div>
              )}

              {canMarkComplete && (
                <>
                  <textarea
                    rows="2"
                    value={remarks[task.id] || ''}
                    onChange={(e) =>
                      setRemarks(prev => ({
                        ...prev,
                        [task.id]: e.target.value
                      }))
                    }
                    className="w-full border rounded-lg p-2 mb-2 text-sm"
                    placeholder="Add remarks"
                  />

                  <button
                    onClick={() => handleComplete(task.id)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg flex justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Mark Completed
                  </button>
                </>
              )}
            </div>
          );
        })}

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center gap-2"
          >
            <Plus size={16} />
            Add Subtask
          </button>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">

            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Add Subtask</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <label className="text-sm font-medium">Subtask</label>
            <select
              className="border p-2 rounded w-full mb-3"
              value={newSubtask.name}
              onChange={e =>
                setNewSubtask(prev => ({
                  ...prev,
                  name: e.target.value
                }))
              }
            >
              <option value="">Select subtask</option>
              {(SUBTASK_OPTIONS_BY_STAGE[stage.name] || []).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
              <option value="CUSTOM">Other (Custom)</option>
            </select>

            {newSubtask.name === 'CUSTOM' && (
              <input
                className="border p-2 rounded w-full mb-3"
                placeholder="Enter subtask name"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
            )}

            <textarea
              rows={3}
              className="border p-2 rounded w-full mb-3"
              placeholder="Description"
              value={newSubtask.description}
              onChange={e =>
                setNewSubtask(prev => ({
                  ...prev,
                  description: e.target.value
                }))
              }
            />

            <label className="text-sm font-medium block mb-2">
              Assign Employees
            </label>
            <div className="space-y-2 mb-4">
              {employeeList.map(emp => (
                <label key={emp.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newSubtask.employeeIds.includes(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                  />
                  {emp.name}
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 border py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubtask}
                className="w-1/2 bg-blue-600 text-white py-2 rounded-lg"
              >
                Add Subtask
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
