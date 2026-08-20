import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useProfile } from '../context/ProfileContext';
import { useSaved } from '../context/SavedContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { Compass, Heart, Sparkles, User, LogIn, LogOut, X, Key, Mail } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, navigateTo } = useNavigation();
  const { isProfileSetup, userId, signIn, signUp, signOut } = useProfile();
  const { savedIds } = useSaved();

  // Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePersonalizeClick = () => {
    if (isProfileSetup) {
      navigateTo('results');
    } else {
      navigateTo('profile');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = authMode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password);

      if (res.error) {
        setError(res.error);
      } else {
        // Success
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
        navigateTo('discover');
      }
    } catch (err) {
      setError('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => navigateTo('discover')}>
            <Sparkles size={24} style={{ color: 'var(--primary)' }} />
            <span>Opportunity Hub</span>
          </div>
          
          <nav className="nav-links">
            <button 
              className={`nav-link ${currentPage === 'discover' ? 'active' : ''}`}
              onClick={() => navigateTo('discover')}
            >
              <Compass size={18} />
              <span>Discover</span>
            </button>
            
            <button 
              className={`nav-link ${currentPage === 'saved' ? 'active' : ''}`}
              onClick={() => navigateTo('saved')}
            >
              <Heart size={18} />
              <span>Saved</span>
              {savedIds.length > 0 && (
                <span style={{ 
                  background: 'var(--danger)', 
                  color: 'white', 
                  fontSize: '0.75rem', 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: '50%',
                  fontWeight: 700,
                  marginLeft: '0.2rem'
                }}>
                  {savedIds.length}
                </span>
              )}
            </button>
            
            <button 
              className={`nav-link accent-btn ${(currentPage === 'results' || currentPage === 'profile') ? 'active' : ''}`}
              onClick={handlePersonalizeClick}
            >
              <span>🎯 Personalize for Me</span>
            </button>

            {isProfileSetup && (
              <button 
                className="nav-link"
                onClick={() => navigateTo('profile')}
                title="Edit Profile"
                style={{ padding: '0.6rem' }}
              >
                <User size={18} />
              </button>
            )}

            {/* Auth Buttons */}
            {userId ? (
              <button 
                className="nav-link" 
                onClick={signOut}
                title="Sign Out"
                style={{ color: 'var(--danger)', padding: '0.6rem' }}
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button 
                className="nav-link" 
                onClick={() => {
                  setError('');
                  setShowAuthModal(true);
                }}
                title="Sign In"
                style={{ color: 'var(--primary)', padding: '0.6rem' }}
              >
                <LogIn size={18} />
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            width: '90%',
            maxWidth: '420px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            padding: '2rem',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={20} />
            </button>

            <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', padding: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '0.5rem' }}>
                <Sparkles size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                {authMode === 'login' ? 'Sign In to Opportunity Hub' : 'Create Student Account'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Sync your profile configuration and saved cards across devices.
              </p>
            </header>

            {/* Offline notification banner if Supabase not configured */}
            {!isSupabaseConfigured && (
              <div style={{
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-hover)',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                ⚙️ Running in Offline Mode. Logins are simulated locally.
              </div>
            )}

            {error && (
              <div style={{
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                fontSize: '0.85rem',
                fontWeight: 500,
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Email Address</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
                  <input 
                    type="email"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    placeholder="e.g. name@student.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Key size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
                  <input 
                    type="password"
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {authMode === 'login' ? (
                  <span>
                    New to the Hub?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setError(''); setAuthMode('signup'); }}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Create Account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setError(''); setAuthMode('login'); }}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
