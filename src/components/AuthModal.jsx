import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export default function AuthModal({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });
        alert('Account created! Logging you in...');
        onLoginSuccess();
      } else {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="page active" id="page-auth">
      {/* Floating Icons Background */}
      <div id="floatingIcons" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
         {/* ... These are usually dynamically generated in the original js, leaving as placeholder for now ... */}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '8px', fontSize: '28px', background: 'linear-gradient(90deg, #fff, #aaa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Welcome to SystemForge</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '14px' }}>Master system design with interactive simulations.</p>
          
          <div id="authTabs" style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <button className={`ws-action-btn ${mode === 'login' ? 'active' : ''}`} style={{ flex: 1, justifyContent: 'center', opacity: mode === 'login' ? 1 : 0.6 }} onClick={() => setMode('login')}>Login</button>
            <button className={`ws-action-btn ${mode === 'signup' ? 'active' : ''}`} style={{ flex: 1, justifyContent: 'center', opacity: mode === 'signup' ? 1 : 0.6 }} onClick={() => setMode('signup')}>Sign Up</button>
          </div>

          <form id="authForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {mode === 'signup' && (
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', outline: 'none' }} />
            )}
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', outline: 'none' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', outline: 'none' }} />
            
            {error && <p style={{ color: '#ff5577', fontSize: '13px', marginTop: '5px' }}>{error}</p>}
            
            <button type="submit" className="primary" style={{ padding: '14px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
