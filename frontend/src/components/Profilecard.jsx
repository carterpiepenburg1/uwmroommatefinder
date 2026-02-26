import React, { useState, useEffect } from "react"; // 1. Don't forget the imports!
import "../styles/Profilecard.css";

function Profilecard({
  // Default props if no data is passed from a parent
  major = "Computer Science",
  year = "Junior",
  bio = "Friendly, organized, and looking for a chill roommate.",
  lifestyle = "Night Owl",
  interests = ["Cooking", "Hiking", "Netflix"],
  image = "https://via.placeholder.com/150",
}) {
  // 2. Move state and effects INSIDE the function
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });

  useEffect(() => {
    fetch('http://localhost:8000/api/current_user/', {
      method: 'GET',
      credentials: 'include', 
    })
    .then(response => response.json())
    .then(data => {
      setUser(data); 
    })
    .catch(error => console.error("Error:", error));
  }, []);

  // 3. Logic for the name (using the state variable 'user')
  const displayName = user.first_name ? user.first_name : user.email;

  return (
    <div className="profile-card">
      <div className="profile-left">
        <img src={image} alt={displayName} className="profile-image" />
      </div>

      <div className="profile-right">
        <h3 className="profile-name">{displayName}</h3>
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