import { useEffect } from "react";

function Matches() {
  useEffect(() => {
    document.title = "Matches | Roommate Finder";
  }, []);

  return (
    <div>
      <h1>Your Matches</h1>
      <p>Here are your potential roommates.</p>

      <div style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <strong>Sarah Johnson</strong>
          <p>Biology • Sophomore • Night Owl</p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Alex Martinez</strong>
          <p>Engineering • Junior • Early Riser</p>
        </div>

        <div>
          <strong>Chris Lee</strong>
          <p>Business • Senior • Quiet Lifestyle</p>
        </div>
      </div>
    </div>
  );
}

export default Matches;
