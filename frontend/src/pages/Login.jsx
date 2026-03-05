import { useNavigate } from "react-router-dom";
import '../App';
import '../styles/Login.css';
import Header from '../components/Header'

function App() {
  
  const navigate = useNavigate();

  const handleLogin = () => {
    const target = encodeURIComponent("http://localhost:5173/dashboard");
    
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