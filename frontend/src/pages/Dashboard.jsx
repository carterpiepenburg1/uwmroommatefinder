// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout.jsx";

const Dashboard = () => {
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
    })
    .catch(error => console.error("Error:", error));
  }, []);

  return (
      <div style={{ color: "white", padding: "20px" }}>
        
        <h1>Dashboard</h1>
        
        {/* Logic: If we have a first name, show "Welcome, Max!". 
          Otherwise, show "Welcome, max@uwm.edu!" 
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