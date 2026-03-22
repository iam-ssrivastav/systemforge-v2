import React, { useState } from 'react';

export default function Navbar({ isLoggedIn, setActiveView, activeView }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    // Call Firebase Auth from window if available, or just clear standard auth state
    if (window.firebase) {
      window.firebase.auth().signOut().then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  return (
    <>
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
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-card, #1e1e2d)', 
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
            borderRadius: '12px', padding: '30px', maxWidth: '400px', width: '90%',
            textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px' }}>Logout</h3>
            <p style={{ color: 'var(--text-secondary, #aaa)', marginBottom: '25px' }}>
              Are you sure you want to log out of your account?
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none',
                  fontWeight: 'bold', transition: '0.2s', flex: 1
                }}
              >Cancel</button>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: '#ff5577', color: 'white', border: 'none',
                  fontWeight: 'bold', transition: '0.2s', flex: 1
                }}
              >Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
