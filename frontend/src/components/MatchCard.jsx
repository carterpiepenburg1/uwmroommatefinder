import PropTypes from "prop-types";

function MatchCard({ group, onLike, onPass }) {
    return (
        <div
            style={{
                background: "var(--uwm-gold)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                color: "var(--uwm-black)"
            }}
        >
            {/* Group Header (if it's a multi-person group, show the name) */}
            {group.members.length > 1 && (
                <h3 style={{
                    color: "var(--uwm-black)",
                    marginBottom: "1rem",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    paddingBottom: "0.5rem",
                    fontWeight: "800"
                }}>
                    {group.group_name} ({group.members.length} members)
                </h3>
            )}

            {/* Members List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                {group.members.map(member => (
                    <div key={member.id} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <strong style={{ fontSize: "1.2rem", color: "var(--uwm-black)" }}>{member.name}</strong>
                        <div style={{ color: "rgba(0,0,0,0.7)", fontSize: "0.95rem", fontWeight: "500" }}>
                            {member.standing || 'Unknown'} • {member.gender || 'Unknown'}
                        </div>
                        {member.programs && member.programs.length > 0 && (
                            <div style={{ color: "rgba(0,0,0,0.6)", fontSize: "0.9rem", marginTop: "0.25rem", fontStyle: "italic" }}>
                                📚 {member.programs.join(", ")}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", justifyContent: "center" }}>
                <button
                    onClick={() => onPass(group.group_id)}
                    title="Pass"
                    style={{
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        background: "white",
                        border: "none",
                        color: "#ff4444",
                        borderRadius: "50%",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)"; }}
                >
                    ✕
                </button>
                <button
                    onClick={() => onLike(group.group_id)}
                    title="Like"
                    style={{
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        background: "white",
                        border: "none",
                        color: "#2ecc71",
                        borderRadius: "50%",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)"; }}
                >
                    ♥
                </button>
            </div>
        </div>
    );
}

MatchCard.propTypes = {
    group: PropTypes.shape({
        group_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        group_name: PropTypes.string,
        members: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                name: PropTypes.string.isRequired,
                standing: PropTypes.string,
                gender: PropTypes.string,
                programs: PropTypes.arrayOf(PropTypes.string)
            })
        ).isRequired
    }).isRequired,
    onLike: PropTypes.func.isRequired,
    onPass: PropTypes.func.isRequired
};

export default MatchCard;
