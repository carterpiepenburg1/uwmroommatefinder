import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Group.css";

function Group() {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Your Group | Roommate Finder";
    fetch("http://localhost:8000/api/group/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setGroup(data.group))
      .catch((err) => console.error("Error fetching group:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLeave = () => {
    if (!confirm("Are you sure you want to leave your group? This cannot be undone.")) return;

    fetch("http://localhost:8000/api/group/leave/", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Reload so the page reflects the new solo state
          window.location.reload();
        } else {
          alert(data.error || "Could not leave group.");
        }
      })
      .catch(() => alert("Something went wrong. Please try again."));
  };

  if (loading) return <div className="group-page"><p style={{ color: "#aaa" }}>Loading...</p></div>;

  const isSolo = !group || group.members.length <= 1;

  return (
    <div className="group-page">
      <h1 className="group-title">Your Group</h1>

      {isSolo ? (
        <div className="group-empty">
          <p>You haven't matched with anyone yet.</p>
          <Link to="/matches" className="group-explore-btn">
            Go to Explore &amp; Connect
          </Link>
        </div>
      ) : (
        <>
          <p className="group-subtitle">{group.name}</p>

          <section className="group-section">
            <h2 className="group-section-title">Members</h2>
            <div className="group-members-list">
              {group.members.map((member) => (
                <div key={member.id} className={`group-member-card ${member.is_current_user ? "is-you" : ""}`}>
                  <div className="group-member-header">
                    <span className="group-member-name">{member.name}</span>
                    {member.is_current_user && <span className="group-you-badge">You</span>}
                  </div>
                  <div className="group-member-details">
                    <span>{member.standing}</span>
                    <span>{member.gender}</span>
                    <span>{member.dorm_building}</span>
                    <span>{member.room_type} Room</span>
                  </div>
                  {member.programs.length > 0 && (
                    <div className="group-member-programs">
                      {member.programs.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="group-section">
            <h2 className="group-section-title">Shared Checklist</h2>
            <div className="group-checklist-placeholder">
              <p>Coming soon — your group's shared checklist will appear here.</p>
            </div>
          </section>

          <button className="group-leave-btn" onClick={handleLeave}>
            Leave Group
          </button>
        </>
      )}
    </div>
  );
}

export default Group;
