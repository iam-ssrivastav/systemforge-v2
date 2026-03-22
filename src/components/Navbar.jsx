import React from 'react';

export default function Navbar({ isLoggedIn, setActiveView, activeView }) {
  return (
    <nav className="nav" id="mainNav">
      <div className="nav-brand" onClick={() => setActiveView('dashboard')}>
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src="/logo.png" alt="SystemForge Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span className="nav-title">SystemForge</span>
      </div>
      
      <button className="mobile-menu-btn">☰</button>
      
      <div className="nav-links" id="navLinks">
        <a href="mailto:sysforgetool@gmail.com" className="nav-link" style={{ textDecoration: 'none' }}>Contact Us</a>
        <button 
          className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          Dashboard
        </button>
        
        {!isLoggedIn ? (
          <button 
            className="nav-link" 
            id="loginBtnNav" 
            onClick={() => setActiveView('auth')}
          >
            Login / Sign Up
          </button>
        ) : (
          <button 
            className="nav-link" 
            id="logoutBtn" 
            onClick={() => {
              // Firebase logout flow placeholder
              alert('Logout triggered');
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
