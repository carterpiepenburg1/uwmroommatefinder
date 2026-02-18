import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">UWM Roommate Finder</h2>

      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/matches">Matches</Link>
          </li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
