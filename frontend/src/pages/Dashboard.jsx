// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import ProfileSetupForm from '../components/ProfileSetupForm';
import PreferencesForm from '../components/PreferencesForm';
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
        
        <h1>Dashboard</h1>
        {/* Logic: If we have a first name, show "Welcome, Max!". 
          Otherwise, show "Welcome, maxkrug@uwm.edu!" 
        */}
        <p>
          Welcome, {user.first_name ? user.first_name : user.email}!
        </p>

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