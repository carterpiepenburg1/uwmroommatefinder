import "../styles/ProfileCard.css";

export default function ProfileCard({ user }) {
  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-name">{user.name}</h2>

        <div className="profile-section">
          <p><strong>Name:</strong> {user.first_name || "N/A"} {user.last_name || "N/A"}</p>
          <p><strong>Program(s):</strong> {user.programs_display || "N/A"}</p>
          <p><strong>Gender:</strong> {user.gender_display || "N/A"}</p>
          <p><strong>Standing:</strong> {user.standing_display || "N/A"}</p>
          <p><strong>Dorm:</strong> {user.dorm_building_display || "N/A"}</p>
          <p><strong>Room Type:</strong> {user.room_type_display || "N/A"}</p>
        </div>

        <div className="profile-section">
          <strong>Preferences:</strong>
          <ul>
            {[
              { key: 'noise_level',       label: 'Noise',     display: user.noise_level_display,       priority: user.noise_level_priority },
              { key: 'cleanliness',       label: 'Clean',     display: user.cleanliness_display,       priority: user.cleanliness_priority },
              { key: 'sleep_habits',      label: 'Sleep',     display: user.sleep_habits_display,      priority: user.sleep_habits_priority },
              { key: 'social_level',      label: 'Social',    display: user.social_level_display,      priority: user.social_level_priority },
              { key: 'guest_policy',      label: 'Guests',    display: user.guest_policy_display,      priority: user.guest_policy_priority },
              { key: 'alcohol_policy',    label: 'Alcohol',   display: user.alcohol_policy_display,    priority: user.alcohol_policy_priority },
              { key: 'shared_belongings', label: 'Sharing',   display: user.shared_belongings_display, priority: user.shared_belongings_priority },
            ].filter(p => p.display).map(p => (
              <li key={p.key}>
                {p.label}: {p.display}{p.priority ? ' ★' : ''}
              </li>
            ))}
            {!user.noise_level_display && !user.cleanliness_display && <li>No preferences set</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}