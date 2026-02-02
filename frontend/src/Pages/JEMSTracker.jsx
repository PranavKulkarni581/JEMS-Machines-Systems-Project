import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LoginPage from './LoginPage';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import MachineDetailPage from './MachineDetailPage';
import StageTasksPage from './SubTasksPage';
import UsersPage from './UsersPage';
import AddMachine from './AddMachine';

const API_BASE_URL = 'http://localhost:8080/api';

export default function JEMSTracker() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  /* ================= TOKEN VALIDATION ================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(user => {
        setCurrentUser(user);
      })
      .catch(() => {
        localStorage.clear();
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = (user) => {
    setCurrentUser(user);

    if (user.roles?.includes('ADMIN')) {
      navigate('/admin');
    } else if (user.roles?.includes('MANAGER')) {
      navigate('/manager');
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate('/');
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/"
        element={
          currentUser ? (
            <Navigate
              to={
                currentUser.roles.includes('ADMIN')
                  ? '/admin'
                  : '/manager'
              }
            />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          currentUser?.roles?.includes('ADMIN') ? (
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
              onLogout={handleLogout}
            />
          ) : <Navigate to="/" />
        }
      />

      {/* ADD MACHINE */}
      <Route
        path="/add-machine"
        element={
          currentUser?.roles?.includes('ADMIN') ? (
            <AddMachine
              employees={employees}
              managers={managers}
              onBack={() => navigate('/admin')}
              onCreateMachine={(m) => {
                setMachines(prev => [...prev, m]);
                navigate('/admin');
              }}
            />
          ) : <Navigate to="/" />
        }
      />

      {/* MANAGER */}
      <Route
        path="/manager"
        element={
          currentUser?.roles?.includes('MANAGER') ? (
            <ManagerDashboard
              machines={machines}
              currentUser={currentUser}
              onSelectMachine={(m) => {
                setSelectedMachine(m);
                navigate('/machine');
              }}
              onLogout={handleLogout}
            />
          ) : <Navigate to="/" />
        }
      />

      {/* USERS */}
      <Route
        path="/users"
        element={
          currentUser?.roles?.includes('ADMIN') ? (
           <UsersPage
  employees={employees}
  setEmployees={setEmployees}
  users={managers}
  setUsers={setManagers}
  onBack={() => navigate('/admin')}
/>

          ) : <Navigate to="/" />
        }
      />

      {/* MACHINE */}
      <Route
        path="/machine"
        element={
          selectedMachine ? (
            <MachineDetailPage
              machine={selectedMachine}
              currentUser={currentUser}
              onBack={() =>
                navigate(
                  currentUser.roles.includes('ADMIN')
                    ? '/admin'
                    : '/manager'
                )
              }
              onOpenStage={(stageKey) => {
                setSelectedStage(stageKey);
                navigate('/stage');
              }}
            />
          ) : <Navigate to="/" />
        }
      />

      {/* STAGE */}
      <Route
        path="/stage"
        element={
          selectedStage ? (
            <StageTasksPage
              machine={selectedMachine}
              stageKey={selectedStage}
              currentUser={currentUser}
              onBack={() => navigate('/machine')}
            />
          ) : <Navigate to="/" />
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
