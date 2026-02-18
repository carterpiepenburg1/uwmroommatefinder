import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/me/", {
      withCredentials: true
    })
    .then(() => {
      setIsAuthenticated(true);
      setLoading(false);
    })
    .catch(() => {
      setIsAuthenticated(false);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
