import { useState, useEffect } from 'react';
import '../styles/ProfileSetupForm.css';

const ProfileSetupForm = ({ user, onComplete }) => {
  // 1. Set up the state to hold the form answers. 
  // We use the data Django sent as the starting point (which will be null at first)
  const [formData, setFormData] = useState({
    gender: user?.gender || '',
    standing: user?.standing || '',
    term: user?.term || '',
    dorm_building: user?.dorm_building || '',
    room_type: user?.room_type || '',
    programs: user?.programs || [],
  });

  const [availablePrograms, setAvailablePrograms] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        gender: user.gender || '',
        standing: user.standing || '',
        term: user.term || '',
        dorm_building: user.dorm_building || '',
        room_type: user.room_type || '',
        programs: user.programs || [],
      });
    }
  }, [user]);

  useEffect(() => {
    fetch('http://localhost:8000/api/programs/')
      .then(res => res.json())
      .then(data => {
        // data.programs is the list of dictionaries Django sent over
        setAvailablePrograms(data.programs); 
      })
      .catch(err => console.error("Failed to fetch programs:", err));
  }, []);

  

  // 2. This handles updating the state whenever a dropdown changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProgramChange = (e) => {
    setFormData({
      ...formData,
      programs: [e.target.value] // Wraps "CS" into ["CS"]
    });
  };

  // 3. When save is clicked:
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stops the page from refreshing instantly
    
    try {
      // Send the formData state to our new Django URL
      const response = await fetch('http://localhost:8000/api/update_profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // sends your Microsoft session cookie
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // If success, call the function that refreshes the Dashboard
        onComplete(); 
      } else {
        console.error("Django rejected the data.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="form-card" style={{ maxWidth: '600px' }}>
        <h2>Complete Your Profile</h2>
        <p className="info-blurb">
          We need a few details to start finding your perfect roommate matches.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          
          {/* GENDER */}
          <div>
            <label>Gender Identity</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required style={dropdownStyle}>
              <option value="" disabled>Select...</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other / Inclusive Housing</option>
            </select>
          </div>

          {/* STANDING */}
          <div>
            <label>Class Standing</label>
            <select name="standing" value={formData.standing} onChange={handleChange} required style={dropdownStyle}>
              <option value="" disabled>Select...</option>
              <option value="FR">Freshman</option>
              <option value="SO">Sophomore</option>
              <option value="JR">Junior</option>
              <option value="SR">Senior</option>
            </select>
          </div>

          {/* 5. NEW: The dynamic programs dropdown */}
          <div>
            <label>Primary Major / Program</label>
            <select 
              name="programs" 
              value={formData.programs[0] || ''} 
              onChange={handleProgramChange} 
              required 
              style={dropdownStyle}
            >
              <option value="" disabled>Select your major...</option>
              {availablePrograms.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>
          </div>

          {/* DORM BUILDING */}
          <div>
            <label>Preferred Dorm</label>
            <select name="dorm_building" value={formData.dorm_building} onChange={handleChange} required style={dropdownStyle}>
              <option value="" disabled>Select...</option>
              <option value="C">Cambridge Commons</option>
              <option value="R">Riverview</option>
              <option value="S1">Sandburg (N/S/W)</option>
              <option value="S2">Sandburg (East)</option>
            </select>
          </div>

          {/* ROOM TYPE */}
          <div>
            <label>Room Type</label>
            <select name="room_type" value={formData.room_type} onChange={handleChange} required style={dropdownStyle}>
              <option value="" disabled>Select...</option>
              <option value="S">Single</option>
              <option value="D">Double</option>
              <option value="T">Triple</option>
            </select>
          </div>

          {/* TERM */}
          <div>
            <label>Term</label>
            <select name="term" value={formData.term} onChange={handleChange} required style={dropdownStyle}>
              <option value="" disabled>Select...</option>
              <option value="F">Fall</option>
              <option value="S">Spring</option>
            </select>
          </div>

          <button type="submit" className="form-btn" style={{ marginTop: '20px' }}>
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

// A quick inline style to make the dropdowns look nice in dark mode
const dropdownStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '6px',
  border: '1px solid #999999',
  backgroundColor: '#202020',
  color: 'white',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
};

export default ProfileSetupForm;