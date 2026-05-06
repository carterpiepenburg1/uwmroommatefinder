import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Sidebar.css";

function Sidebar() {
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/notifications/", { credentials: "include" })
      .then(res => res.json())
      .then(data => setNotifCount((data.requests || []).length))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include",
    });

    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2 className="logo">UWM Roommate Finder</h2>

      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/matches">Explore and Connect</Link>
          </li>
          <li>
            <Link to="/notifications">
              Notifications
              {notifCount > 0 && <span className="sidebar-badge">{notifCount}</span>}
            </Link>
          </li>
          <li>
            <Link to="/group">Your Group</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>
            <Link to="/checklist">Checklist</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
