import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/api/placeholder/150/50" alt="Logo" />
          </Link>
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

 
        <div className={`nav-auth ${isOpen ? 'active' : ''}`}>
          <Link to="/loginpage" className="login-button">Login</Link>
          <Link to="/registerpage" className="register-button">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;