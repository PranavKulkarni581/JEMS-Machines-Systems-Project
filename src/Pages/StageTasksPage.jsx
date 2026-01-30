import React, { useState } from 'react';
import { ChevronRight, CheckCircle, MessageSquare, Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { USERS } from '../data/machines';

export default function StageTasksPage({
  machine,
  stageKey,
  currentUser,
  onBack,
  onUpdateTask,
  onAddSubtask
}) {
  const [remarks, setRemarks] = useState({});
  const stage = machine.stages[stageKey];

  const employeeList = Object.values(USERS).filter(
    u => u.role === 'employee'
  );

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

  const handleAssign = (taskId, employeeId) => {
    onUpdateTask(
      machine.id,
      stageKey,
      taskId,
      'In Progress',
      '',
      employeeId
    );
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

      {/* SUBTASKS */}
      <div className="px-6 py-8 space-y-4">
        {stage.subtasks.map(task => {
          const isAdmin = currentUser.role === 'admin';
          const isAssignedEmployee =
            currentUser.role === 'employee' &&
            task.assignedTo === currentUser.id;

          const canMarkComplete =
            (isAdmin || isAssignedEmployee) &&
            task.status !== 'Completed';

          return (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md p-5 border"
            >
              <div className="flex justify-between mb-2">
                <div className="w-full">
                  <h3 className="font-semibold">{task.name}</h3>

                  <p className="text-sm text-slate-500 mt-1">Assigned to:</p>

                  {isAdmin ? (
                    <select
                      value={task.assignedTo || ''}
                      onChange={(e) =>
                        handleAssign(task.id, e.target.value)
                      }
                      className="mt-1 border rounded-lg px-2 py-1 text-sm"
                    >
                      <option value="">Unassigned</option>
                      {employeeList.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm font-medium">
                      {task.assignedTo || 'Unassigned'}
                    </p>
                  )}
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
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Completed
                  </button>
                </>
              )}
            </div>
          );
        })}

        {/* ADD SUBTASK */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => {
              const name = prompt('Enter subtask name');
              if (name) onAddSubtask(machine.id, stageKey, name);
            }}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            <Plus size={16} />
            Add Subtask
          </button>
        )}
      </div>
    </div>
  );
}
