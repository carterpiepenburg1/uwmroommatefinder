// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import ProfileSetupForm from '../components/ProfileSetupForm';
import PreferencesForm from '../components/PreferencesForm';
import tutorial_1 from "../assets/tutorial_1.png";
import tutorial_2 from "../assets/tutorial_2.png";
import tutorial_3 from "../assets/tutorial_3.png";
import tutorial_4 from "../assets/tutorial_4.png";
import tutorial_5 from "../assets/tutorial_5.png";
import tutorial_6 from "../assets/tutorial_6.png";
import tutorial_7 from "../assets/tutorial_7.png";
import tutorial_8 from "../assets/tutorial_8.png";
import tutorial_9 from "../assets/tutorial_9.png";
import tutorial_10 from "../assets/tutorial_10.png";
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
        {/* Navigation grid for different parts of the app */}
          <div className="dashboard-grid">
              <Link to="/Profile" className="dashboard-card">
                  <h3>Profile</h3>
                  <p>Edit profile details and adjust preferences</p>
              </Link>

              <Link to="/Matches" className="dashboard-card">
                  <h3>Explore and Connect</h3>
                  <p>Connect and reach out to other students</p>
              </Link>

              <Link to="/Notifications" className="dashboard-card">
                  <h3>Notifications</h3>
                  <p>Notifications for matches, chats, and more</p>
              </Link>

              <Link to="/group" className="dashboard-card">
                  <h3>Your Group</h3>
                  <p>See the people you've matched with</p>
              </Link>

              <Link to="/Chat" className="dashboard-card">
                  <h3>Chat</h3>
                  <p>Checkout your chats with other students</p>
              </Link>

              <Link to="/Checklist" className="dashboard-card">
                  <h3>Checklist</h3>
                  <p>Adjust your checklist for when you move in</p>
              </Link>
          </div>
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
            <p>You can prioritize your preferences by checking the "Priority" box next to each one (visible as a star next to the preference). 
              This will make them more important in the matching algorithm.
            </p>
          <h3>2. Find Your Perfect Roommate</h3>
            <p>
              Click on the "Explore and Connect" tab to see potential matches. Each profile will show you their basic info, 
              preferences, and a compatibility score based on how well your preferences align.  
            </p>
            <img style={{ marginBottom: '50px' }} src={tutorial_4} alt="Explore Matches" />
            <p>
              If you find someone interesting, click the "Match" button on their profile. This will send them a match request. 
              If they accept, you'll be able to chat and get to know each other better! Otherwise, click skip and keep exploring other profiles.
            </p>
          <h3>3. Start Chatting!</h3>
            <p>
              Once you have successfully matched with someone, you can start chatting with them! Just click on the "Chat" tab to see all your matches and conversations.
            </p>
            <img style={{ marginBottom: '50px' }} src={tutorial_5} alt="Start Chatting" />
          <h3>4. Check Notifications</h3>
            <p>
              Don't forget to check your notifications! This is where you'll see updates about new matches, messages, and other important info. 
              Just click on the "Notifications" tab to stay in the loop.
            </p>
            <img style={{ marginBottom: '50px' }} src={tutorial_6} alt="Check Notifications" />
          <h3>5. Other Features</h3>
            <p>
              There is a checklist feature to help you stay organized for move-in day. You can find it in the navigation bar as well. You can add whatever items you want 
              to the checklist and check them off as you get them. It's a great way to make sure you don't forget anything important!
            </p>
            <img style={{ marginBottom: '50px' }} src={tutorial_7} alt="Checklist" />
            <p>
              Under the Groups tab, you can see the other people that you have matched with. These are the people that you will (hopefully) be living with, so it's a good idea 
              to check out their profiles and get to know them before move-in day. You can also chat with them in the Chat tab.
            </p>
            <img src={tutorial_8} alt="Groups" />
            <img style={{ marginBottom: '50px' }} src={tutorial_9} alt="Groups 2" />
            <p>
              If you end up deciding that you don't want to be in a group anymore, you can click the "Leave Group" button in the Group tab. 
              This will remove you from the group and allow you to explore other matches.
            </p>
            <img style={{ marginBottom: '50px' }} src={tutorial_10} alt="Leave Group" />
        </div>
      </div>
  );
};

export default Dashboard;