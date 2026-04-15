import { useState, useEffect } from 'react';
import ProfileCard from "../components/Profilecard";
import ProfileSetupForm from "../components/ProfileSetupForm";
import PreferencesForm from "../components/PreferencesForm";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const handleToggleActive = () => {
    const newValue = !user.is_active;
    fetch('http://localhost:8000/api/profile/active/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ is_active: newValue }),
    })
      .then(res => res.json())
      .then(data => setUser(prev => ({ ...prev, is_active: data.is_active })));
  };

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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '20px auto 0', maxWidth: '600px' }}>
        <span style={{ color: user.is_active ? '#FFBD00' : '#999', fontWeight: 'bold', fontSize: '0.9rem', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          {user.is_active ? 'Looking for Roommates' : 'Not Looking for Roommates'}
        </span>
        <div onClick={handleToggleActive} style={{ ...toggleTrackStyle, backgroundColor: user.is_active ? '#FFBD00' : '#555' }}>
          <div style={{ ...toggleThumbStyle, transform: user.is_active ? 'translateX(20px)' : 'translateX(0)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: '600px', margin: '12px auto 0' }}>
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

const toggleTrackStyle = {
  width: '44px',
  height: '24px',
  borderRadius: '12px',
  cursor: 'pointer',
  position: 'relative',
  transition: 'background-color 0.2s',
  flexShrink: 0,
};

const toggleThumbStyle = {
  position: 'absolute',
  top: '3px',
  left: '3px',
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  backgroundColor: 'white',
  transition: 'transform 0.2s',
};

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
