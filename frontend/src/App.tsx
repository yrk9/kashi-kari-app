import { useEffect, useState } from "react";
import { apiClient } from "./api";
import type { Record } from "./types";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const fetchRecords = async () => {
    try {
      const data = await apiClient("/records");
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch records:", error);
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
    localStorage.removeItem("token");
    setRecords([]);
    navigate("/login");
  };

  const handleTransfar = (buttonType: string) => {
    if (buttonType == "login") {
      navigate("/login");
    } else if (buttonType == "dashboard") {
      navigate("/dashboard");
    } else if (buttonType == "kari") {
      navigate("/kari");
    } else if (buttonType == "register") {
      navigate("/register");
    } else {
      navigate("/");
    }
  };

  return (
    <Routes>
      {/* ログイン */}
      <Route
        path="/login"
        element={
          <AuthForm
            isLogin={true}
            setRecords={setRecords}
            handleTransfar={handleTransfar}
            setToken={setToken}
          ></AuthForm>
        }
      ></Route>
      {/* 登録 */}
      <Route
        path="/register"
        element={
          <AuthForm
            isLogin={false}
            setRecords={setRecords}
            handleTransfar={handleTransfar}
            setToken={setToken}
          ></AuthForm>
        }
      ></Route>

      {/* ダッシュボード */}
      <Route
        path="/"
        element={
          <Dashboard
            token={token}
            records={records}
            setRecords={setRecords}
            handleLogout={handleLogout}
            fetchRecords={fetchRecords}
            handleTransfar={handleTransfar}
          ></Dashboard>
        }
      ></Route>
    </Routes>
  );
}

export default App;
