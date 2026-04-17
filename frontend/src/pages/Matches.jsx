import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import "../styles/Matches.css";

const PAGE_SIZE = 10;

function Matches() {
  const [matches, setMatches] = useState([]);
  const [pendingIds, setPendingIds] = useState(new Set());
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
      .then(data => {
        setMatches(data.matches || []);
        setPendingIds(new Set(data.pending_request_ids || []));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleMatchRequest = (userId) => {
    setPendingIds(prev => new Set([...prev, userId]));
    fetch(`http://localhost:8000/api/match/request/${userId}/`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      // revert optimistic update on failure
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });
  };

  if (loading) return <div style={{ padding: "2rem", color: "white" }}>Loading matches...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  const allMatches = matches;
  const totalPages = Math.ceil(allMatches.length / PAGE_SIZE);
  const pageMatches = allMatches.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="matches-page">
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
                  <button
                    className={`match-btn ${pendingIds.has(match.id) ? "match-btn-pending" : "match-btn-accept"}`}
                    onClick={() => handleMatchRequest(match.id)}
                    disabled={pendingIds.has(match.id)}
                  >
                    {pendingIds.has(match.id) ? "Pending" : "Match"}
                  </button>
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
