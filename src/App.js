import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import { setAuthToken } from "./api/apiClient";
import { useEffect, useState } from "react";
import Task from "./components/board/Task";
import Header from "./components/header/Header";
import Chat from "./components/chat/Chat";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/protectedRoute";
import AuthGuard from "./components/authGuard";
import ErrorPage from "./components/NotFound";
import { Spinner } from "./utils/utils";

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
    return <Spinner />;
  }
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <HomePage />
              </AuthGuard>
            }
          />
          <Route
            path="/login"
            element={
              <AuthGuard>
                <LoginPage />
              </AuthGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthGuard>
                <SignUpPage />
              </AuthGuard>
            }
          />
          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kanban/board/:boardId"
            element={
              <ProtectedRoute>
                <Task />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kanban/messages/:boardId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
