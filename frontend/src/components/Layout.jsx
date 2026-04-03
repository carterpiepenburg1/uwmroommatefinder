import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import '../styles/Layout.css';
import {useState} from "react";

function Layout() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/profile":
        return "Profile";
      case "/matches":
        return "Matches";
      case "/chat":
        return "Chat";
      default:
        return "";
    }
  };

  return (
      /* Sidebar logic */
    <div className="layout">
        <div className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
      <Sidebar />
        </div>

      <div className={`content-wrapper ${sidebarOpen ? 'shifted' : ''}`}>
        <header className="topbar">
            <button className="menu-toggle" onClick={toggleSidebar}>
                {sidebarOpen ? 'X' : '≡'}
            </button>
          <h2>{getPageTitle()}</h2>
        </header>

        <main className="main-content">
          <Outlet />
        </main>

        <footer className="footer">
          © {new Date().getFullYear()} UWM Roommate Finder. All rights reserved.
        </footer>
      </div>

          {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
      </div>
  );
}

export default Layout;


