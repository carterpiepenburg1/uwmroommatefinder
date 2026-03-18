import PropTypes from "prop-types";

function NotificationCard({ request, onAccept, onDecline }) {
  const isResolved = request.status !== "pending";

  return (
    <div className={`notification-card ${isResolved ? `resolved ${request.status}` : ""}`}>
      <div className="notification-info">
        <span className="notification-sender">{request.sender}</span>
        <span className="notification-meta">
          {request.program} · {request.standing} · {request.roomType} · {request.dorm}
        </span>
        <span className="notification-time">{request.sentAt}</span>
      </div>

      {isResolved ? (
        <span className={`notification-badge ${request.status}`}>
          {request.status === "accepted" ? "Accepted" : "Declined"}
        </span>
      ) : (
        <div className="notification-actions">
          <button className="btn-accept" onClick={() => onAccept(request.id)}>
            Accept
          </button>
          <button className="btn-decline" onClick={() => onDecline(request.id)}>
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

NotificationCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    sender: PropTypes.string.isRequired,
    program: PropTypes.string,
    standing: PropTypes.string,
    roomType: PropTypes.string,
    dorm: PropTypes.string,
    sentAt: PropTypes.string,
    status: PropTypes.oneOf(["pending", "accepted", "declined"]).isRequired,
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default NotificationCard;
