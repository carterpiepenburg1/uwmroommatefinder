import { useState, useEffect } from 'react';
import ProfileCard from "../components/Profilecard";
import ProfileSetupForm from "../components/ProfileSetupForm";
import PreferencesForm from "../components/PreferencesForm";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const fetchUser = () => {
    fetch('http://localhost:8000/api/current_user/', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      setUser(data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching user:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div style={{ color: 'white', padding: '20px' }}>Loading profile data...</div>;
  }

  return (
    <div>
      <ProfileCard user={user} />

      <div style={{ display: 'flex', maxWidth: '600px', margin: '24px auto 0' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{ ...tabStyle, borderBottom: activeTab === 'profile' ? '2px solid #FFBD00' : '2px solid transparent', color: activeTab === 'profile' ? '#FFBD00' : '#999' }}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          style={{ ...tabStyle, borderBottom: activeTab === 'preferences' ? '2px solid #FFBD00' : '2px solid transparent', color: activeTab === 'preferences' ? '#FFBD00' : '#999' }}
        >
          Preferences
        </button>
      </div>

      {activeTab === 'profile' && (
        <ProfileSetupForm user={user} onComplete={fetchUser} />
      )}
      {activeTab === 'preferences' && (
        <PreferencesForm user={user} onComplete={fetchUser} />
      )}
    </div>
  );
}

const tabStyle = {
  flex: 1,
  padding: '12px',
  background: 'none',
  border: 'none',
  borderRadius: '0',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  transition: 'color 0.2s, border-bottom 0.2s',
};

export default Profile;
