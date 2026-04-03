import "../styles/MatchCard.css";

const PREF_FIELDS = [
  { key: 'noise_level',       label: 'Noise',    display: 'noise_level_display',       priority: 'noise_level_priority' },
  { key: 'cleanliness',       label: 'Clean',    display: 'cleanliness_display',       priority: 'cleanliness_priority' },
  { key: 'sleep_habits',      label: 'Sleep',    display: 'sleep_habits_display',      priority: 'sleep_habits_priority' },
  { key: 'social_level',      label: 'Social',   display: 'social_level_display',      priority: 'social_level_priority' },
  { key: 'guest_policy',      label: 'Guests',   display: 'guest_policy_display',      priority: 'guest_policy_priority' },
  { key: 'alcohol_policy',    label: 'Alcohol',  display: 'alcohol_policy_display',    priority: 'alcohol_policy_priority' },
  { key: 'shared_belongings', label: 'Sharing',  display: 'shared_belongings_display', priority: 'shared_belongings_priority' },
];

export default function MatchCard({ match }) {
  if (!match) return null;

  const setPrefs = PREF_FIELDS.filter(p => match[p.display]);

  return (
    <div className="match-card-container">
      <div className="match-card">

        <div className="match-card-header">
          <h2 className="match-card-name">{match.name}</h2>
          <span className="match-score-badge">{match.compatibility_score}% Match</span>
        </div>

        <div className="match-card-section">
          <p><strong>Program(s):</strong> {match.programs?.join(", ") || "N/A"}</p>
          <p><strong>Gender:</strong> {match.gender || "N/A"}</p>
          <p><strong>Standing:</strong> {match.standing || "N/A"}</p>
          <p><strong>Dorm:</strong> {match.dorm_building || "N/A"}</p>
          <p><strong>Room Type:</strong> {match.room_type || "N/A"}</p>
          <p><strong>Term:</strong> {match.term || "N/A"}</p>
        </div>

        <div className="match-card-section">
          <strong>Preferences:</strong>
          <ul className="match-pref-list">
            {setPrefs.length > 0
              ? setPrefs.map(p => (
                  <li key={p.key} className="match-pref-item">
                    {p.label}: {match[p.display]}{match[p.priority] ? ' ★' : ''}
                  </li>
                ))
              : <li className="match-pref-item">No preferences set</li>
            }
          </ul>
        </div>

      </div>
    </div>
  );
}
