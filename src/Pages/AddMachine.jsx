import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const BASE_TASKS = [
  'Design',
  'Manufacturing',
  'Assembly',
  'Quality Check',
  'Delivery'
];

const SUBTASKS_BY_TASK = {
  Design: ['Blueprint', 'Review'],
  Manufacturing: ['Raw Material', 'Fabrication'],
  Assembly: ['Mechanical', 'Electrical'],
  'Quality Check': ['Inspection', 'Testing'],
  Delivery: ['Packaging', 'Transport']
};

export default function AddMachine({
  employees = [],
  users = [],
  onCreateMachine,
  onBack
}) {
  const managers = users.filter(u => u.role === 'manager');

  const [machine, setMachine] = useState({
    name: '',
    id: '',
    client: '',
    deadline: '',
    description: '',
    tasks: []
  });

  const [newTaskName, setNewTaskName] = useState('');
  const [newSubtask, setNewSubtask] = useState({});

  /* ================= ADD TASK ================= */
  const addTask = (name) => {
    if (!name.trim()) return;

    setMachine(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          name,
          managerId: '',
          subtasks: []
        }
      ]
    }));

    setNewTaskName('');
  };

  /* ================= ADD SUBTASK ================= */
  const addSubtask = (taskIndex, name) => {
    if (!name.trim()) return;

    const updated = [...machine.tasks];
    updated[taskIndex].subtasks.push({
      name,
      description: '',
      employeeIds: []
    });

    setMachine({ ...machine, tasks: updated });
    setNewSubtask(prev => ({ ...prev, [taskIndex]: '' }));
  };

  /* ================= ASSIGN TASK MANAGER ================= */
  const assignTaskManager = (taskIndex, managerId) => {
    const updated = [...machine.tasks];
    updated[taskIndex].managerId = managerId;
    setMachine({ ...machine, tasks: updated });
  };

  /* ================= SUBTASK DESCRIPTION ================= */
  const updateSubtaskDescription = (t, s, value) => {
    const updated = [...machine.tasks];
    updated[t].subtasks[s].description = value;
    setMachine({ ...machine, tasks: updated });
  };

  /* ================= ASSIGN EMPLOYEES ================= */
  const handleEmployeeSelect = (t, s, options) => {
    const ids = Array.from(options).map(o => o.value);
    const updated = [...machine.tasks];
    updated[t].subtasks[s].employeeIds = ids;
    setMachine({ ...machine, tasks: updated });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Machine</h1>
          <button onClick={onBack}><X /></button>
        </div>

        {/* MACHINE INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">Machine Name</label>
            <input
              className="border p-2 rounded w-full"
              value={machine.name}
              onChange={e => setMachine({ ...machine, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Machine ID</label>
            <input
              className="border p-2 rounded w-full"
              value={machine.id}
              onChange={e => setMachine({ ...machine, id: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Client</label>
            <input
              className="border p-2 rounded w-full"
              value={machine.client}
              onChange={e => setMachine({ ...machine, client: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Deadline</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={machine.deadline}
              onChange={e => setMachine({ ...machine, deadline: e.target.value })}
            />
          </div>
        </div>

        {/* MACHINE DESCRIPTION */}
        <div className="mb-6">
          <label className="text-sm font-medium">Machine Description</label>
          <textarea
            className="border p-2 rounded w-full"
            rows={3}
            value={machine.description}
            onChange={e =>
              setMachine({ ...machine, description: e.target.value })
            }
          />
        </div>

        {/* TASKS */}
        <h2 className="font-semibold mb-2">Tasks</h2>

        <select
          className="border p-2 rounded w-full mb-2"
          onChange={(e) => {
            addTask(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Select Existing Task</option>
          {BASE_TASKS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* ADD TASK */}
        <div className="flex gap-2 mb-6">
          <input
            placeholder="Add new task..."
            className="border p-2 rounded w-full"
            value={newTaskName}
            onChange={e => setNewTaskName(e.target.value)}
          />
          <button
            onClick={() => addTask(newTaskName)}
            className="bg-blue-600 text-white px-4 rounded"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* TASK LIST */}
        {machine.tasks.map((task, tIndex) => (
          <div key={tIndex} className="border p-4 rounded mb-4">

            <h3 className="font-semibold mb-2">{task.name}</h3>

            {/* TASK MANAGER */}
            <label className="text-sm font-medium">Task Manager</label>
            <select
              className="border p-2 rounded w-full mb-3"
              value={task.managerId}
              onChange={e => assignTaskManager(tIndex, e.target.value)}
            >
              <option value="">Select Manager</option>
              {managers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            {/* SUBTASK SELECT */}
            <select
              className="border p-2 rounded w-full mb-2"
              onChange={(e) => {
                addSubtask(tIndex, e.target.value);
                e.target.value = '';
              }}
            >
              <option value="">Select Existing Subtask</option>
              {(SUBTASKS_BY_TASK[task.name] || []).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* ADD SUBTASK */}
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Add new subtask..."
                className="border p-2 rounded w-full"
                value={newSubtask[tIndex] || ''}
                onChange={e =>
                  setNewSubtask(prev => ({
                    ...prev,
                    [tIndex]: e.target.value
                  }))
                }
              />
              <button
                onClick={() => addSubtask(tIndex, newSubtask[tIndex])}
                className="bg-blue-600 text-white px-3 rounded"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* SUBTASK LIST */}
            {task.subtasks.map((sub, sIndex) => (
              <div key={sIndex} className="bg-slate-50 p-3 rounded mb-3">

                <p className="font-medium">{sub.name}</p>

                {/* SUBTASK DESCRIPTION */}
                <textarea
                  placeholder="Subtask description..."
                  className="border p-2 rounded w-full mb-2"
                  rows={2}
                  value={sub.description}
                  onChange={e =>
                    updateSubtaskDescription(tIndex, sIndex, e.target.value)
                  }
                />

                {/* EMPLOYEE MULTI SELECT */}
                <label className="text-sm font-medium">Assign Employees</label>
                <select
                  multiple
                  className="border p-2 rounded w-full"
                  value={sub.employeeIds}
                  onChange={e =>
                    handleEmployeeSelect(
                      tIndex,
                      sIndex,
                      e.target.selectedOptions
                    )
                  }
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}

        {/* CREATE */}
        <button
          onClick={() => onCreateMachine(machine)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4"
        >
          Create Machine
        </button>
      </div>
    </div>
  );
}
