import { useEffect, useState } from "react";
import "../styles/ProfileCard.css";

export default function ProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/current_user/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-name">{user.name}</h2>

        <div className="profile-section">
          <p><strong>Name:</strong> {user.first_name || "N/A"} {user.last_name || "N/A"}</p>
          <p><strong>Program(s):</strong> {user.programs || "N/A"}</p>
          <p><strong>Gender:</strong> {user.gender || "N/A"}</p>
          <p><strong>Standing:</strong> {user.standing || "N/A"}</p>
          <p><strong>Dorm:</strong> {user.dorm_building || "N/A"}</p>
          <p><strong>Room Type:</strong> {user.room_type || "N/A"}</p>
        </div>

        <div className="profile-section">
          <strong>Preferences:</strong>
          <ul>
            {user.preferences &&
            Object.keys(user.preferences).length > 0 ? (
              Object.entries(user.preferences).map(([key, value]) => (
                <li key={key}>
                  {key.replaceAll("_", " ")}: {value}
                </li>
              ))
            ) : (
              <li>No preferences set</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}