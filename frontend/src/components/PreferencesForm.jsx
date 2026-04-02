import { useState, useEffect } from 'react';
import '../styles/ProfileSetupForm.css';
import FieldHint from './FieldHint';

const PREFERENCE_FIELDS = [
  { key: 'noise_level', label: 'Noise Level', hint: 'How much noise is acceptable in your living space?', options: [[0, 'Quiet'], [1, 'Moderate'], [2, 'Lively']] },
  { key: 'cleanliness', label: 'Cleanliness', hint: 'How tidy do you expect your shared living space to be?', options: [[0, 'Very Clean'], [1, 'Moderate'], [2, 'Relaxed']] },
  { key: 'sleep_habits', label: 'Sleep Habits', hint: 'Are you an early bird, night owl, or somewhere in between?', options: [[0, 'Early Bird'], [1, 'Moderate'], [2, 'Night Owl']] },
  { key: 'social_level', label: 'Social Level', hint: 'How social do you like to be with your roommate?', options: [[0, 'Introvert'], [1, 'Ambivert'], [2, 'Extrovert']] },
  { key: 'guest_policy', label: 'Guest Policy', hint: 'How often do you expect to have guests over?', options: [[0, 'Barely'], [1, 'Occasionally'], [2, 'Frequently']] },
  { key: 'alcohol_policy', label: 'Alcohol Policy', hint: 'What is your stance on alcohol in the living space?', options: [[0, 'Strictly Dry'], [1, 'Occasionally'], [2, 'Comfortable']] },
  { key: 'shared_belongings', label: 'Shared Belongings', hint: 'How do you feel about sharing personal belongings with your roommate?', options: [[0, 'Keep Separate'], [1, 'Ask First'], [2, 'Share Everything']] },
];

const buildInitialState = (user) => {
  const data = {};
  PREFERENCE_FIELDS.forEach(({ key }) => {
    data[key] = user?.[key] ?? '';
    data[`${key}_priority`] = user?.[`${key}_priority`] ?? false;
  });
  return data;
};

const PreferencesForm = ({ user, onComplete }) => {
  const [formData, setFormData] = useState(() => buildInitialState(user));

  useEffect(() => {
    if (user) setFormData(buildInitialState(user));
  }, [user]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value === '' ? '' : parseInt(value) }));
  };

  const handlePriorityChange = (key) => {
    setFormData(prev => ({ ...prev, [`${key}_priority`]: !prev[`${key}_priority`] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/preferences/update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onComplete();
      } else {
        console.error('Failed to save preferences.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="profile-form-wrapper">
      <div className="form-card" style={{ maxWidth: '600px' }}>
        <h2>Your Preferences</h2>
        <p className="info-blurb">
          Help us find your best matches by telling us about your living habits.
          Check "Prioritize?" for anything that's a dealbreaker.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          {PREFERENCE_FIELDS.map(({ key, label, hint, options }) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label>
                  {label}
                  <FieldHint text={hint} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#FFBD00', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData[`${key}_priority`]}
                    onChange={() => handlePriorityChange(key)}
                    style={{ accentColor: '#FFBD00', width: '14px', height: '14px' }}
                  />
                  Prioritize?
                </label>
              </div>
              <select
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                required
                style={dropdownStyle}
              >
                <option value="" disabled>Select...</option>
                {options.map(([val, display]) => (
                  <option key={val} value={val}>{display}</option>
                ))}
              </select>
            </div>
          ))}

          <button type="submit" className="form-btn" style={{ marginTop: '20px' }}>
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

const dropdownStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '6px',
  border: '1px solid #999999',
  backgroundColor: '#202020',
  color: 'white',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
};

export default PreferencesForm;
