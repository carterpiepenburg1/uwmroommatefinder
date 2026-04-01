import { useState, useEffect } from "react";
import NotificationCard from "../components/NotificationCard";
import "../styles/Notifications.css";

const MOCK_REQUESTS = [
  {
    id: 1,
    sender: "Alex Johnson",
    program: "Computer Science",
    standing: "Sophomore",
    roomType: "Double",
    dorm: "Sandburg (N/S/W)",
    sentAt: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    sender: "Maria Garcia",
    program: "Nursing",
    standing: "Freshman",
    roomType: "Triple",
    dorm: "Cambridge Commons",
    sentAt: "5 hours ago",
    status: "pending",
  },
  {
    id: 3,
    sender: "Jordan Lee",
    program: "Business Analytics",
    standing: "Junior",
    roomType: "Double",
    dorm: "Riverview",
    sentAt: "Yesterday",
    status: "pending",
  },
];

function Notifications() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  useEffect(() => {
    document.title = "Notifications | Roommate Finder";
  }, []);

  const handleAccept = (id) => {
    // TODO: POST to backend to accept match request
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
    );
  };

  const handleDecline = (id) => {
    // TODO: POST to backend to decline match request
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "declined" } : r))
    );
  };

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="notifications-page">
      <h1 className="notifications-title">Notifications</h1>
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
                request={req}
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
                request={req}
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
