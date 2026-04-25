import { useEffect, useState } from 'react';
import { apiClient } from './api';
import type{ Record } from './types';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import {  Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isGuest, setIsGuest] = useState(false);

  const fetchRecords = async () => {
      try {
        const data = await apiClient('/records');
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
  };

  useEffect(() => {
    if (token) {
      fetchRecords();
    } else {
      setRecords([]);
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setIsGuest(false);
    localStorage.removeItem('token');
    setRecords([]);
    navigate('/login')
  };

  return (
      <Routes>
        {/* ログイン */}
        <Route
          path="/login"
          element={<AuthForm setRecords={setRecords}></AuthForm>}
        ></Route>
        {/* ダッシュボード */}
        <Route
          path="/dashboard"
          element={<Dashboard 
            token={token} 
            records={records}
            setRecords={setRecords}
            handleLogout={handleLogout}
            fetchRecords={fetchRecords}
          ></Dashboard>}
        ></Route>
        {/* 初期ページをログインへ設定 */}
          <Route path="/" element={<AuthForm setRecords={setRecords}></AuthForm>}></Route>
      </Routes>
  );
}

export default App;
