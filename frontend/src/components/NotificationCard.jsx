import MatchCard from "./MatchCard";

function NotificationCard({ notification, onAccept, onDecline }) {
  const isResolved = notification.status !== "pending";

  return (
    <div className={`notification-card ${isResolved ? `resolved ${notification.status}` : ""}`}>
      <MatchCard match={notification} />
      <div className="notification-footer">
        {isResolved ? (
          <span className={`notification-badge ${notification.status}`}>
            {notification.status === "accepted" ? "Accepted" : "Declined"}
          </span>
        ) : (
          <div className="notification-actions">
            <button className="btn-accept" onClick={() => onAccept(notification.id)}>
              Accept
            </button>
            <button className="btn-decline" onClick={() => onDecline(notification.id)}>
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationCard;
