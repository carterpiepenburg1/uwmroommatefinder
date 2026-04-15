// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import ProfileSetupForm from '../components/ProfileSetupForm';
import PreferencesForm from '../components/PreferencesForm';
import tutorial_1 from "../assets/tutorial_1.png";
import tutorial_2 from "../assets/tutorial_2.png";
import tutorial_3 from "../assets/tutorial_3.png";
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // Add a loading state to prevent flashing the wrong screen
  const [loading, setLoading] = useState(true);
  // Initialize with a safe default
  const [user, setUser] = useState({ first_name: '', last_name: '', email: '' });

  useEffect(() => {
    fetch('http://localhost:8000/api/current_user/', {
      method: 'GET',
      credentials: 'include', 
    })
    .then(response => response.json())
    .then(data => {
      setUser(data); // Save the whole object
      setLoading(false); // <-- Done fetching, turn off the loading screen
    })
    .catch(error => {
      console.error("Error:", error);
      setLoading(false);
    });
  }, []);

  // STATE 1: Still waiting for Django
  if (loading) {
    return <div style={{ color: "white", padding: "20px" }}>Loading your dashboard...</div>;
  }

  // STATE 2: Profile info not complete
  if (user && user.is_profile_complete === false) {
    return (
      <ProfileSetupForm
        user={user}
        onComplete={() => window.location.reload()}
      />
    );
  }

  // STATE 2.5: Preferences not complete
  if (user && user.is_preferences_complete === false) {
    return (
      <PreferencesForm
        user={user}
        onComplete={() => window.location.reload()}
      />
    );
  }

  // STATE 3: THE ACTUAL APP
  return (
      <div className="dashboard-container">
        <h2>
          Welcome, {user.first_name ? user.first_name : user.email}!
        </h2>
        <p>This is your dashboard. If this is your first time here, check below for a tutorial on how to get started. Otherwise, feel free to explore the app and check your matches!</p>
        <div style={{ color: "white", padding: "20px"}}>
          <h2>Getting Started</h2>
          <h3>1. Finalize Your Profile</h3>
            <p>
              You should have already filled out your profile information and preferences, but sometimes you might want to update them! 
              Just click on the "Profile" tab in the navigation bar to edit your information and preferences. This helps us find better matches for you.
              <br></br>
              <br></br>
              To edit, scroll down to Profile Info or click on Preferences:   
            </p>
            <img style={{ marginBottom: '50px' }} src={tutorial_1} alt="Update Info" />
            <p>Update the desired field(s):</p>
            <img style={{ marginBottom: '50px' }} src={tutorial_2} alt="Menu Selection" />
            <p>Then click Save:</p>
            <img style={{ marginBottom: '50px' }} src={tutorial_3} alt="Save Changes" />
          <h3>2. Find Your Perfect Roommate</h3>
          <h3>3. Start Chatting!</h3>
          <h3>4. Check Notifications</h3>
        </div>

          {/* Navigation grid for different parts of the app */}
          <div className="dashboard-grid">
              <Link to="/Profile" className="dashboard-card">
                  <h3> Profile</h3>
                  <p>Edit profile details and adjust preferences</p>
              </Link>

              <Link to="/Checklist" className="dashboard-card">
                  <h3>Checklist</h3>
                  <p>Adjust your checklist for when you move in</p>
              </Link>

              <Link to="/Matches" className="dashboard-card">
                  <h3>Explore and Connect</h3>
                  <p>Connect and reach out to other students</p>
              </Link>

              <Link to="/Chat" className="dashboard-card">
                  <h3>Chat</h3>
                  <p>Checkout your chats with other students</p>
              </Link>

              <Link to="/Notifications" className="dashboard-card">
                  <h3>Notifications</h3>
                  <p>Notifications for matches, chats, and more</p>
              </Link>
          </div>
      </div>
  );
};

export default Dashboard;