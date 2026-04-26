import { useEffect, useState } from 'react';
import { apiClient } from './api';
import type{ Record } from './types';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import {  Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { TopPage } from './components/TopPage';

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

  const handleTransfar = (buttonType: string) => { 
    if (buttonType == "login") {
      navigate('/login')
    } else if (buttonType == "dashboard") {
      navigate('/dashboard')
    } else if (buttonType == "kari") {
      navigate('/kari')
    } else {
      navigate('/')
    }
  }

  return (
      <Routes>
        <Route
          path='/'
          element={<TopPage handleTransfar={handleTransfar}></TopPage>}
        ></Route>

        {/* ログイン */}
        <Route
          path="/login"
          element={<AuthForm setRecords={setRecords} handleTransfar={handleTransfar}></AuthForm>}
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
            handleTransfar={handleTransfar}
          ></Dashboard>}
        ></Route>
        {/* 初期ページをログインへ設定 */}
          <Route path='/' element={<TopPage handleTransfar={handleTransfar}></TopPage>}></Route>
      </Routes>
  );
}

export default App;
