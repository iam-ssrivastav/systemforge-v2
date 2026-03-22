import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './App.css';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import AuthModal from './components/AuthModal';

// Firebase Configuration extracted from V1
const firebaseConfig = {
  apiKey: "AIzaSyDXb6DZsvEnXdov3I20sjaHCX1au9-qut0",
  authDomain: "systemforge-5269d.firebaseapp.com",
  projectId: "systemforge-5269d",
  storageBucket: "systemforge-5269d.firebasestorage.app",
  messagingSenderId: "1018107667228",
  appId: "1:1018107667228:web:cbfd3550a301e6dfa450d9",
  measurementId: "G-Q41X253W4G"
};

// Initialize Firebase once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [activeProblem, setActiveProblem] = useState(null);
  const [isPro, setIsPro] = useState(false);
  
  // Modal states
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallTitle, setPaywallTitle] = useState('SystemForge PRO');

  useEffect(() => {
    // 1. Check for payment success hack
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      localStorage.setItem('systemforge_pro', 'true');
      window.history.replaceState({}, document.title, window.location.pathname);
      alert('🎉 Payment Successful! PRO Lifetime Access unlocked.');
    }
    
    // 2. Set Pro state
    setIsPro(localStorage.getItem('systemforge_pro') === 'true');

    // 3. Firebase Auth listener
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    // Bridge React State & Logic to window for the original systemforge-engine (app.js)
    window.setActiveViewInReact = (view) => setActiveView(view);
    window.setActiveProblemInReact = (p) => setActiveProblem(p);
    window.firebase = firebase; // Give engine access to our Firebase
    
    // Mock showPage for app.js to use React routing
    window.showPage = (view) => {
      console.log('[SystemForge Engine] showPage request:', view);
      setActiveView(view);
    };

    // Override the engine's startProblem if it exists, or provide a backup
    const originalStartProblem = window.startProblem;
    window.startProblem = (id) => {
      if (typeof originalStartProblem === 'function') {
        originalStartProblem(id);
      } else {
        // Fallback UI switch if engine hasn't loaded yet
        setActiveView('workspace');
      }
    };
    
    return () => unsubscribe();
  }, []);

  const handleStartProblem = (problem) => {
    if (problem.isPremium && !isPro) {
      setPaywallTitle(problem.title);
      setShowPaywall(true);
      return;
    }
    setActiveProblem(problem);
    setActiveView('workspace');
    window.scrollTo(0, 0);
  };

  return (
    <div id="app">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setActiveView={setActiveView} 
        activeView={activeView} 
      />
      
      <div className="app-container">
        {activeView === 'dashboard' && (
          <Dashboard onStart={handleStartProblem} isPro={isPro} isLoggedIn={isLoggedIn} setActiveView={setActiveView} />
        )}
        
        {activeView === 'workspace' && activeProblem && (
          <Workspace 
            problem={activeProblem} 
            onBack={() => setActiveView('dashboard')} 
          />
        )}

        {activeView === 'auth' && (
          <AuthModal onLoginSuccess={() => setActiveView('dashboard')} />
        )}
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000, alignItems:'center', justifyContent:'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
          <div className="modal" style={{ background: '#111', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,215,0,0.3)', maxWidth: '420px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px', color: '#ffd700' }}>🔒</div>
            <h2 style={{ color: 'white', marginBottom: '12px', fontSize: '20px', lineHeight: '1.4' }}>Upgrade to access <br/><span style={{ color: '#ffd700' }}>{paywallTitle}</span></h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '24px', fontSize: '15px' }}>Unlock the complete <strong>FAANG System Design Suite</strong> including interactive simulations, unmetered network stress tests, and 10+ downloadable masterclass PDFs.</p>
            <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '12px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <span style={{ display:'block', color: '#777', fontSize: '13px', textDecoration: 'line-through' }}>Regular Price: $49/mo</span>
               <span style={{ display:'block', color: '#00d4aa', fontWeight: 'bold', fontSize: '18px', marginTop: '4px' }}>Lifetime Access: ₹799 ($10)</span>
            </div>
            <div style={{ display:'flex', gap: '12px', justifyContent: 'space-between' }}>
               <button className="ws-action-btn" onClick={() => setShowPaywall(false)} style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>Cancel</button>
               <button className="ws-action-btn primary" onClick={() => { window.open('https://rzp.io/rzp/aVExvTId', '_blank'); setShowPaywall(false); }} style={{ flex: 2, padding: '12px', justifyContent: 'center', fontWeight: 'bold', background: 'linear-gradient(90deg, #3399cc, #2b82ad)', border: 'none' }}>Go to Razorpay ⚡</button>
            </div>
          </div>
        </div>
      )}

      {/* Persistence for Tooltip and Drag Ghost in global scope */}
      <div className="tooltip" id="tooltip"></div>
      <div className="drag-ghost" id="dragGhost" style={{ display: 'none' }}></div>
    </div>
  );
}

export default App;
