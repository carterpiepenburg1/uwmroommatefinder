import '../styles/Header.css';
import { Link } from 'react-router-dom'
import UWM_Logo from  '../../public/UWMLogos/Primary/UWM Primary Logo_Full Color on Light.png'

const Header = () => {
  return (
      <header className="uwm-header">
          {/* Top Utility Bar */}
          <div className="utility-bar">
              <nav className="utility-links">
                  <a href="https://uwmil.instructure.com/login/saml/15">Canvas</a>
                  <a href="https://www.uwm.sis.wisconsin.edu/milprd-login">PAWS</a>
                  <a href="http://login.microsoftonline.com/">Microsoft 365</a>
                  <a href="https://uwm.starrezhousing.com/StarRezPortalX/4CDDDF11/1/1/Home-Home?UrlToken=9527B353">Housing portal</a>
                  <a href="https://uwm.hed.boldyn.com/">Wifi Portal</a>
              </nav>
          </div>

          {/* Main Brand Bar */}
          <div className="brand-bar">
              <div className="logo-container">
                  <Link to="https://uwm.edu">
                  <img src={UWM_Logo} alt="UWM Logo" className="header-logo"/>
                  </Link>
              </div>
          </div>
      </header>
  );
};

export default Header;