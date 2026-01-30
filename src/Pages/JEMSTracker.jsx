import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { mockMachines, USERS } from '../data/machines';

import LoginPage from './LoginPage';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import MachineDetailPage from './MachineDetailPage';
import StageTasksPage from './StageTasksPage';
import UsersPage from './UsersPage';

export default function JEMSTracker() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [machines, setMachines] = useState(mockMachines);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔐 LOGIN
  const handleLogin = (userId, password) => {
    const user = USERS[userId];
    if (user && user.password === password) {
      setCurrentUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/employee');
      return true;
    }
    return false;
  };

  // 🔄 TASK UPDATE
  const updateTaskStatus = (
    machineId,
    stageKey,
    taskId,
    status,
    remarks,
    assignedTo
  ) => {
    setMachines(prev =>
      prev.map(m =>
        m.id === machineId
          ? {
              ...m,
              stages: {
                ...m.stages,
                [stageKey]: {
                  ...m.stages[stageKey],
                  subtasks: m.stages[stageKey].subtasks.map(t =>
                    t.id === taskId
                      ? {
                          ...t,
                          status,
                          remarks: remarks ?? t.remarks,
                          assignedTo: assignedTo ?? t.assignedTo
                        }
                      : t
                  )
                }
              }
            }
          : m
      )
    );
  };

  const addStage = (machineId, name) => {
    setMachines(prev =>
      prev.map(m =>
        m.id === machineId
          ? {
              ...m,
              stages: {
                ...m.stages,
                [name.toLowerCase().replace(/\s/g, '')]: {
                  name,
                  status: 'Not Started',
                  subtasks: []
                }
              }
            }
          : m
      )
    );
  };

  const addSubtask = (machineId, stageKey, name) => {
    setMachines(prev =>
      prev.map(m =>
        m.id === machineId
          ? {
              ...m,
              stages: {
                ...m.stages,
                [stageKey]: {
                  ...m.stages[stageKey],
                  subtasks: [
                    ...m.stages[stageKey].subtasks,
                    {
                      id: Date.now().toString(),
                      name,
                      status: 'Not Started',
                      assignedTo: ''
                    }
                  ]
                }
              }
            }
          : m
      )
    );
  };

  const addMachine = ({ name, client, id }) => {
    setMachines(prev => [
      ...prev,
      {
        id,
        name,
        client,
        status: 'On Track',
        progress: 0,
        stages: {}
      }
    ]);
  };

  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              machines={machines}
              currentUser={currentUser}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectMachine={(m) => {
                setSelectedMachine(m);
                navigate('/machine');
              }}
              onOpenUsers={() => navigate('/users')}
              onAddMachine={addMachine}
              onLogout={() => {
                setCurrentUser(null);
                navigate('/');
              }}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* USERS */}
      <Route
        path="/users"
        element={
          currentUser?.role === 'admin' ? (
            <UsersPage
              employees={employees}
              setEmployees={setEmployees}
              users={users}
              setUsers={setUsers}
              onBack={() => navigate('/admin')}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* MACHINE */}
      <Route
        path="/machine"
        element={
          <MachineDetailPage
            machine={selectedMachine}
            currentUser={currentUser}
            onBack={() => navigate('/admin')}
            onOpenStage={(key) => {
              setSelectedStage(key);
              navigate('/stage');
            }}
            onAddStage={addStage}
          />
        }
      />

      {/* STAGE */}
      <Route
        path="/stage"
        element={
          <StageTasksPage
            machine={selectedMachine}
            stageKey={selectedStage}
            currentUser={currentUser}
            onBack={() => navigate('/machine')}
            onUpdateTask={updateTaskStatus}
            onAddSubtask={addSubtask}
          />
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
