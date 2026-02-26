import "../styles/Profilecard.css";

function Profilecard({
  name = "Jane Doe",
  major = "Computer Science",
  year = "Junior",
  bio = "Friendly, organized, and looking for a chill roommate.",
  lifestyle = "Night Owl",
  interests = ["Cooking", "Hiking", "Netflix"],
  image = "https://via.placeholder.com/150",
}) {
  return (
    <div className="profile-card">
      <div className="profile-left">
        <img src={image} alt={name} className="profile-image" />
      </div>

      <div className="profile-right">
        <h3 className="profile-name">{name}</h3>

        <p className="profile-meta">
          {major} • {year}
        </p>

        <p className="profile-bio">{bio}</p>

        <div className="profile-tags">
          <span className="tag lifestyle">{lifestyle}</span>

          {interests.map((interest, index) => (
            <span key={index} className="tag interest">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profilecard;