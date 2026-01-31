import React, { useState, useEffect } from 'react';
import { ChevronRight, LogOut, Plus, X, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

/* -----------------------------------------------------
   ADD TASK MODAL
----------------------------------------------------- */
function AddTaskModal({
  onClose,
  onSubmit,
  tasks = [],
  managers = [],
  employees = [],
  subtasksByTaskId = {}
}) {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [customTaskName, setCustomTaskName] = useState('');
  const [managerId, setManagerId] = useState('');

  const emptySubtask = {
    selectedSubtaskId: '',
    customSubtaskName: '',
    employeeIds: [],
    description: ''
  };

  const [subtasks, setSubtasks] = useState([emptySubtask]);

  /* Reset subtasks when task changes */
  useEffect(() => {
    setSubtasks([emptySubtask]);
  }, [selectedTaskId]);

  const addSubtask = () => {
    setSubtasks(prev => [...prev, { ...emptySubtask }]);
  };

  const removeSubtask = index => {
    if (subtasks.length === 1) return;
    setSubtasks(prev => prev.filter((_, i) => i !== index));
  };

  const updateSubtask = (index, field, value) => {
    setSubtasks(prev =>
      prev.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    );
  };

  /* Validation */
  const isValid =
    (selectedTaskId || customTaskName.trim()) &&
    managerId &&
    subtasks.length >= 1 &&
    subtasks.every(
      s =>
        (s.selectedSubtaskId || s.customSubtaskName.trim()) &&
        s.employeeIds.length >= 1
    );

  const handleSubmit = () => {
    if (!isValid) return;

    onSubmit({
      task: selectedTaskId || customTaskName.trim(),
      managerId,
      subtasks
    });
  };

  const availableSubtasks =
    selectedTaskId && subtasksByTaskId[selectedTaskId]
      ? subtasksByTaskId[selectedTaskId]
      : [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add Task</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* TASK */}
        <div className="mb-4">
          <label className="font-medium block mb-1">
            Task <span className="text-red-500">*</span>
          </label>

          <select
            value={selectedTaskId}
            onChange={e => {
              setSelectedTaskId(e.target.value);
              setCustomTaskName('');
            }}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select existing task</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.name}
              </option>
            ))}
          </select>

          {!selectedTaskId && (
            <input
              type="text"
              placeholder="Or enter custom task name"
              value={customTaskName}
              onChange={e => setCustomTaskName(e.target.value)}
              className="w-full border rounded-lg p-2 mt-2"
            />
          )}
        </div>

        {/* MANAGER */}
        <div className="mb-6">
          <label className="font-medium block mb-1">
            Manager <span className="text-red-500">*</span>
          </label>

          <select
            value={managerId}
            onChange={e => setManagerId(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select manager</option>
            {managers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* SUBTASKS */}
        <div className="space-y-4">
          <h3 className="font-semibold">
            Subtasks <span className="text-red-500">*</span>
          </h3>

          {subtasks.map((subtask, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 space-y-3 bg-slate-50 relative"
            >
              {subtasks.length > 1 && (
                <button
                  onClick={() => removeSubtask(index)}
                  className="absolute top-2 right-2 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              )}

              {/* SUBTASK NAME */}
              <select
                value={subtask.selectedSubtaskId}
                onChange={e =>
                  updateSubtask(index, 'selectedSubtaskId', e.target.value)
                }
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select subtask</option>
                {availableSubtasks.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>

              {!subtask.selectedSubtaskId && (
                <input
                  type="text"
                  placeholder="Custom subtask name"
                  value={subtask.customSubtaskName}
                  onChange={e =>
                    updateSubtask(index, 'customSubtaskName', e.target.value)
                  }
                  className="w-full border rounded-lg p-2"
                />
              )}

              {/* EMPLOYEES */}
              <select
                multiple
                value={subtask.employeeIds}
                onChange={e =>
                  updateSubtask(
                    index,
                    'employeeIds',
                    Array.from(e.target.selectedOptions, o => o.value)
                  )
                }
                className="w-full border rounded-lg p-2 h-28"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              {/* DESCRIPTION */}
              <textarea
                placeholder="Subtask description"
                value={subtask.description}
                onChange={e =>
                  updateSubtask(index, 'description', e.target.value)
                }
                className="w-full border rounded-lg p-2"
              />
            </div>
          ))}

          <button
            onClick={addSubtask}
            className="text-blue-600 font-medium"
          >
            + Add another subtask
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-4 py-2 rounded-lg text-white ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-slate-400 cursor-not-allowed'
            }`}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------
   MACHINE DETAIL PAGE
----------------------------------------------------- */
export default function MachineDetailPage({
  machine,
  currentUser,
  onBack,
  onLogout,
  onOpenStage,
  onAddStage,
  tasks,
  managers,
  employees,
  subtasksByTaskId
}) {
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack}>
              <ChevronRight className="rotate-180 w-6 h-6" />
            </button>

            <div>
              <h1 className="text-xl font-bold">{machine.name}</h1>
              <p className="text-sm text-slate-500">
                {machine.client} • {machine.id}
              </p>
            </div>
          </div>

          <button onClick={onLogout}>
            <LogOut />
          </button>
        </div>
      </header>

      {/* STAGES */}
      <div className="px-6 py-6 space-y-4">
        {Object.entries(machine.stages).map(([key, stage]) => (
          <div
            key={key}
            onClick={() => onOpenStage(key)}
            className="bg-white p-5 rounded-xl border shadow-md cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{stage.name}</h3>
              <StatusBadge status={stage.status} />
            </div>
          </div>
        ))}

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            <Plus size={16} />
            Add Task
          </button>
        )}
      </div>

      {/* MODAL */}
      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onSubmit={data => {
            onAddStage(machine.id, data);
            setShowAddTask(false);
          }}
          tasks={tasks}
          managers={managers}
          employees={employees}
          subtasksByTaskId={subtasksByTaskId}
        />
      )}
    </div>
  );
}
