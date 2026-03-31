import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchCard from "../components/MatchCard";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load matches on mount
  useEffect(() => {
    document.title = "Explore and Connect | Roommate Finder";
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/matches/potential/", {
        credentials: "include", // Needs Django session cookie
      });
      if (!res.ok) throw new Error("Failed to load potential matches");
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (groupId) => {
    try {
      const res = await fetch("http://localhost:8000/api/matches/like/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group_id: groupId }),
      });

      if (!res.ok) throw new Error("Failed to like group");
      const data = await res.json();

      // Remove the liked group from the list immediately
      setMatches((prev) => prev.filter((m) => m.group_id !== groupId));

      if (data.is_match) {
        // If it's a mutual like, notify the user!
        alert("🎉 It's a Match! A new chat has been created.");
        // Redirect them to the chat to start talking
        navigate("/chat");
      }
    } catch (err) {
      alert("Error liking group: " + err.message);
    }
  };

  const handlePass = (groupId) => {
    // For now, "Pass" just removes them from the local UI state.
    // In a full implementation, you'd send this to the backend so they don't show up again.
    setMatches((prev) => prev.filter((m) => m.group_id !== groupId));
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading potential matches...</div>;
  if (error) return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "var(--uwm-gold)", marginBottom: "0.5rem" }}>Explore and Connect</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>Find potential roommates and groups.</p>

      {matches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--uwm-dark)", borderRadius: "8px" }}>
          <h3>No more matches right now</h3>
          <p style={{ color: "#aaa", marginTop: "1rem" }}>
            Check back later as more users join!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {matches.map((group) => (
            <MatchCard
              key={group.group_id}
              group={group}
              onLike={handleLike}
              onPass={handlePass}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;
