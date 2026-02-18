import { useEffect } from "react";

function Profile() {
  useEffect(() => {
    document.title = "Profile | Roommate Finder";
  }, []);

  return (
    <div>
      <h1>Your Profile</h1>
      <p>This is your profile page.</p>

      <div style={{ marginTop: "20px" }}>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Major:</strong> Computer Science</p>
        <p><strong>Year:</strong> Junior</p>
        <p><strong>Housing Preference:</strong> On-campus</p>
      </div>
    </div>
  );
}

export default Profile;
