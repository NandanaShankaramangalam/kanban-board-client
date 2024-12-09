import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import { setAuthToken } from "./api/apiClient";
import { useEffect, useState } from "react";
import Task from "./components/board/Task";
import Header from "./components/header/Header";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/kanban" element={<Dashboard />} />
          <Route path="/kanban/board/:boardId" element={<Task />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
