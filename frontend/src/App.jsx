import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page (no sidebar) */}
        <Route path="/" element={<Login />} />

        {/* All pages with sidebar */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirect /admin to the backend admin panel */}
        <Route path="/admin" element={<NavigateToAdmin />} />

      </Routes>
    </BrowserRouter>
  );
}

const NavigateToAdmin = () => {
  window.location.href = "http://localhost:8000/admin/";
  return null;
};

export default App;

