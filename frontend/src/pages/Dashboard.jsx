// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import ProfileSetupForm from '../components/ProfileSetupForm';

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

  // STATE 2: THE BOUNCER
  // If Django explicitly says the profile isn't done, force them to the form
  if (user && user.is_profile_complete === false) {
    return (
      <ProfileSetupForm 
        user={user} 
        // When the form finishes saving, refresh the page to pull the new "true" flag
        onComplete={() => window.location.reload()} 
      />
    );
  }

  // STATE 3: THE ACTUAL APP
  return (
      <div style={{ color: "white", padding: "20px" }}>
        
        <h1>Dashboard</h1>
        
        {/* Logic: If we have a first name, show "Welcome, Max!". 
          Otherwise, show "Welcome, maxkrug@uwm.edu!" 
        */}
        <p>
          Welcome, {user.first_name ? user.first_name : user.email}!
        </p>
        
        {/* Show full details for debugging */}
        <small>Full Name: {user.first_name} {user.last_name}</small>
      </div>
  );
};

export default Dashboard;