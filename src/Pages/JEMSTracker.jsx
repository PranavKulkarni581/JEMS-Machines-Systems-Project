import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { mockMachines, USERS } from '../data/machines';

import LoginPage from './LoginPage';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import MachineDetailPage from './MachineDetailPage';
import StageTasksPage from './StageTasksPage';
import UsersPage from './UsersPage';
import AddMachine from './AddMachine';

export default function JEMSTracker() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [currentUser, setCurrentUser] = useState(null);
  const [machines, setMachines] = useState(mockMachines);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  /* ================= LOGIN ================= */
  const handleLogin = (userId, password) => {
    const user = USERS[userId];
    if (user && user.password === password) {
      setCurrentUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/manager');
      return true;
    }
    return false;
  };

  /* ================= TASK UPDATE ================= */
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

  /* ================= ADD STAGE ================= */
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

  /* ================= ADD SUBTASK ================= */
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

  /* ================= ADD MACHINE ================= */
  const addMachine = (machine) => {
    setMachines(prev => [
      ...prev,
      {
        ...machine,
        status: 'On Track',
        progress: 0,
        stages: {}
      }
    ]);
  };

  return (
    <Routes>

      {/* ================= LOGIN ================= */}
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

      {/* ================= ADMIN ================= */}
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
              onAddMachineNavigate={() => navigate('/add-machine')}
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

      {/* ================= ADD MACHINE ================= */}
      <Route
        path="/add-machine"
        element={
          currentUser?.role === 'admin' ? (
            <AddMachine
              employees={employees}
              managers={managers}
              onBack={() => navigate('/admin')}
              onCreateMachine={(newMachine) => {
                addMachine(newMachine);
                navigate('/admin');
              }}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* ================= MANAGER ================= */}
      <Route
        path="/manager"
        element={
          currentUser?.role === 'manager' ? (
            <ManagerDashboard
              machines={machines}
              currentUser={currentUser}
              onSelectMachine={(m) => {
                setSelectedMachine(m);
                navigate('/machine');
              }}
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

      {/* ================= USERS ================= */}
      <Route
        path="/users"
        element={
          currentUser?.role === 'admin' ? (
            <UsersPage
              employees={employees}
              setEmployees={setEmployees}
              managers={managers}
              setManagers={setManagers}
              onBack={() => navigate('/admin')}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* ================= MACHINE ================= */}
      <Route
        path="/machine"
        element={
          selectedMachine ? (
            <MachineDetailPage
              machine={selectedMachine}
              currentUser={currentUser}
              onBack={() =>
                navigate(currentUser?.role === 'admin' ? '/admin' : '/manager')
              }
              onOpenStage={(key) => {
                setSelectedStage(key);
                navigate('/stage');
              }}
              onAddStage={addStage}
            />
          ) : (
            <Navigate to="/admin" />
          )
        }
      />

      {/* ================= STAGE ================= */}
      <Route
        path="/stage"
        element={
          selectedStage ? (
            <StageTasksPage
              machine={selectedMachine}
              stageKey={selectedStage}
              currentUser={currentUser}
              onBack={() => navigate('/machine')}
              onUpdateTask={updateTaskStatus}
              onAddSubtask={addSubtask}
            />
          ) : (
            <Navigate to="/admin" />
          )
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
