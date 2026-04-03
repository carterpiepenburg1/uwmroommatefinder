import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import "../styles/Matches.css";

const PAGE_SIZE = 10;

const EXAMPLE_USER = {
  id: "example",
  name: "Alex Johnson",
  programs: ["Computer Science"],
  gender: "Male",
  standing: "Sophomore",
  dorm_building: "Sandburg (N/S/W)",
  room_type: "Double",
  term: "Fall",
  compatibility_score: 85,
  noise_level_display: "Moderate",       noise_level_priority: false,
  cleanliness_display: "Very Clean",     cleanliness_priority: true,
  sleep_habits_display: "Night Owl",     sleep_habits_priority: false,
  social_level_display: "Ambivert",      social_level_priority: false,
  guest_policy_display: "Occasionally",  guest_policy_priority: false,
  alcohol_policy_display: "Strictly Dry", alcohol_policy_priority: true,
  shared_belongings_display: "Ask First", shared_belongings_priority: false,
};

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    document.title = "Explore and Connect | Roommate Finder";
    fetch("http://localhost:8000/api/matches/potential/", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load matches");
        return res.json();
      })
      .then(data => setMatches(data.matches || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "2rem", color: "white" }}>Loading matches...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  // TEMP: prepend example user for display testing — revert when removing EXAMPLE_USER
  const allMatches = [EXAMPLE_USER, ...matches];
  // const allMatches = matches;
  const totalPages = Math.ceil(allMatches.length / PAGE_SIZE);
  const pageMatches = allMatches.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="matches-page">
      <h1 className="matches-title">Explore and Connect</h1>
      <p className="matches-subtitle">Showing your top matches based on compatibility.</p>

      {allMatches.length === 0 ? (
        <div className="matches-empty">
          <h3>No matches found right now</h3>
          <p>Make sure your profile and preferences are complete, and check back as more users join.</p>
        </div>
      ) : (
        <>
          <div className="matches-list">
            {pageMatches.map(match => (
              <div key={match.id}>
                <MatchCard match={match} />
                <div className="match-card-actions">
                  <button className="match-btn match-btn-accept">Match</button>
                  <button className="match-btn match-btn-deny">Skip</button>
                </div>
              </div>
            ))}
          </div>

          <div className="matches-pagination">
            <button
              className="matches-pagination-btn"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
            >
              Previous
            </button>
            <span className="matches-pagination-label">
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="matches-pagination-btn"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Matches;
