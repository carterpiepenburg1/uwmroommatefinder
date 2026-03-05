import React from 'react';
import '../styles/Header.css';
import UWM_Logo from  '../../public/UWMLogos/Primary/UWM Primary Logo_Full Color on Light.png'

const Header = () => {
  return (
    <header className="uwm-header">
      {/* Top Utility Bar */}
      <div className="utility-bar">
        <nav className="utility-links">
          <a href="#canvas">Canvas</a>
          <a href="#paws">PAWS</a>
          <a href="#panthermail">PantherMail</a>
        </nav>
      </div>

      {/* Main Brand Bar */}
      <div className="brand-bar">
        <div className="logo-container">
          <img src={UWM_Logo} alt="UWM Logo" className="header-logo"/>
        </div>

        <nav className="main-navigation">
          <button className="search-btn">Search</button>
          <button className="menu-btn">Menu</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;