import { useState, useEffect } from "react";
import NotificationCard from "../components/NotificationCard";
import "../styles/Notifications.css";

function Notifications() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Notifications | Roommate Finder";
    fetch("http://localhost:8000/api/notifications/", { credentials: "include" })
      .then(res => res.json())
      .then(data => setRequests((data.requests || []).map(r => ({ ...r, status: "pending" }))))
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = (id) => {
    fetch(`http://localhost:8000/api/match/accept/${id}/`, {
      method: "POST",
      credentials: "include",
    });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "accepted" } : r));
    setTimeout(() => window.dispatchEvent(new Event("notifications-changed")), 300);
  };

  const handleDecline = (id) => {
    fetch(`http://localhost:8000/api/match/decline/${id}/`, {
      method: "POST",
      credentials: "include",
    });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "declined" } : r));
    setTimeout(() => window.dispatchEvent(new Event("notifications-changed")), 300);
  };

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  if (loading) return <div style={{ padding: "2rem", color: "white" }}>Loading...</div>;

  return (
    <div className="notifications-page">
      <p className="notifications-subtitle">Match requests from other students.</p>

      {pending.length === 0 && resolved.length === 0 && (
        <div className="notifications-empty">
          <p>No notifications yet.</p>
        </div>
      )}

      {pending.length > 0 && (
        <section className="notifications-section">
          <h2 className="notifications-section-title">Pending</h2>
          <div className="notifications-list">
            {pending.map((req) => (
              <NotificationCard
                key={req.id}
                notification={req}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </div>
        </section>
      )}

      {resolved.length > 0 && (
        <section className="notifications-section">
          <h2 className="notifications-section-title">Earlier</h2>
          <div className="notifications-list">
            {resolved.map((req) => (
              <NotificationCard
                key={req.id}
                notification={req}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Notifications;
