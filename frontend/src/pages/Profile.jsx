import { useState, useEffect } from 'react';
import ProfileCard from "../components/Profilecard";
import ProfileSetupForm from "../components/ProfileSetupForm";

function Profile() {
  // 1. Create a state to hold the user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the data from Django when they open the Profile page
  useEffect(() => {
    fetch('http://localhost:8000/api/current_user/', {
      method: 'GET',
      credentials: 'include', 
    })
    .then(response => response.json())
    .then(data => {
      setUser(data); // Save the Django data to our state
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching user:", error);
      setLoading(false);
    });
  }, []);

  // 3. Wait for the data to arrive before trying to draw the screen
  if (loading) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading profile data...</div>;
  }

  // 4. Now 'user' actually has data in it, so the form won't crash!
  return (
    <div>
      {/* You might also want to pass 'user' to ProfileCard if it needs to display their name/info! */}
      <ProfileCard />

      <ProfileSetupForm user={user} onComplete={() => window.location.reload()} />
    </div>
  );
}

export default Profile;