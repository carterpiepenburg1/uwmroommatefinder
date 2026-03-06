import { useNavigate } from "react-router-dom";
import '../App';
import '../styles/Login.css';
import Header from '../components/Header'

function App() {

  const navigate = useNavigate();

  const handleLogin = () => {
    // We point 'next' to the backend root (/) instead of the dashboard.
    // This allows the Django backend to decide whether to send the user 
    // to the /admin/ panel (if staff) or the React /dashboard (if student).
    const target = encodeURIComponent("http://localhost:8000/");

    window.location.href = `http://localhost:8000/microsoft/to-auth-redirect/?next=${target}`;
  };

  return (
      <>
          <Header />

    <div className="app-container">
      <div className="login-card">
        <h1>UWM Roommate Finder</h1>

        <div className="info-blurb">
          <p>
            Welcome! To ensure safety and verify student status,
            access is restricted to current students.
          </p>
          <p>
            <strong>Please log in using your UWM-issued Microsoft account.</strong>
            <br />
            (e.g., <em>pawsid@uwm.edu</em>)
          </p>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login with Microsoft
        </button>
      </div>
    </div>
    </>
  );
}

export default App;