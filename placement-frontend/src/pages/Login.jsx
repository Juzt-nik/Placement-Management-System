import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getOfficerProfile, getFacultyProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const roleHome = {
  student:           '/student/dashboard',
  faculty:           '/faculty/dashboard',
  hod:               '/faculty/dashboard',
  placement_officer: '/officer/dashboard',
  admin:             '/officer/dashboard',
};

const portals = [
  { label: 'Student', color: '#3b82f6' },
  { label: 'Faculty', color: '#8b5cf6' },
  { label: 'Officer', color: '#2D6A4F' },
];

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      const data = res.data;
      const token = data.token || data.access_token;
      const role  = data.role || data.user?.role || data.data?.role;
      if (!token) throw new Error('No token received from server');
      loginUser(token, { role, username: form.username });

      // Fetch profile to get real name for sidebar/header
      try {
        let profileRes = null;
        if (role === 'placement_officer' || role === 'admin') {
          profileRes = await getOfficerProfile();
        } else if (role === 'faculty' || role === 'hod') {
          profileRes = await getFacultyProfile();
        }
        if (profileRes?.data?.name) {
          loginUser(token, { role, username: form.username, name: profileRes.data.name, department: profileRes.data.department });
        }
      } catch (_) { /* profile not yet set, skip */ }

      const dest = roleHome[role];
      if (!dest) { setError(`Unknown role "${role}". Contact your administrator.`); return; }
      navigate(dest);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed. Check your credentials.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", minHeight: '100vh', display: 'flex', background: '#F5F2ED' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          background: #fff;
          border: 1.5px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          font-weight: 400;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          border-color: #2D6A4F;
          box-shadow: 0 0 0 3px rgba(45,106,79,0.1);
        }
        .login-input::placeholder { color: #bbb; }

        .login-btn {
          width: 100%;
          padding: 15px;
          background: #1a1a1a;
          color: #F5F2ED;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-btn:hover:not(:disabled) { background: #2D6A4F; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .slide-in {
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .slide-in.in { opacity: 1; transform: translateX(0); }
        .slide-in.d1 { transition-delay: 0.05s; }
        .slide-in.d2 { transition-delay: 0.15s; }
        .slide-in.d3 { transition-delay: 0.25s; }
        .slide-in.d4 { transition-delay: 0.35s; }
        .slide-in.d5 { transition-delay: 0.45s; }

        .portal-dot {
          width: 8px; height: 8px; border-radius: 50%;
          display: inline-block;
        }
      `}</style>

      {/* LEFT PANEL — decorative */}
      <div style={{ flex: 1, background: '#1a1a1a', padding: '48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
        className="login-left">
        <style>{`
          @media (max-width: 768px) { .login-left { display: none !important; } }
        `}</style>

        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

        {/* Glow blob */}
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,106,79,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#F5F2ED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <span style={{ color: '#F5F2ED', fontWeight: 700, fontSize: 15 }}>SRM</span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: '#F5F2ED', lineHeight: 1.1, fontWeight: 400, marginBottom: 24 }}>
            Your placement<br />
            journey starts<br />
            <em style={{ color: '#4ade80', fontStyle: 'italic' }}>right here.</em>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontWeight: 300, lineHeight: 1.7, maxWidth: 300 }}>
            Havloc is a full-stack placement management system — connecting students, faculty, and officers in one unified platform.
          </p>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {portals.map(({ label, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="portal-dot" style={{ background: color }} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500 }}>{label} Portal</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div style={{ width: '100%', maxWidth: 480, padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F2ED' }}>
        <div style={{ width: '100%' }}>

          <div className={`slide-in d1 ${mounted ? 'in' : ''}`} style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2D6A4F' }}>Placement Portal</span>
          </div>

          <h1 className={`slide-in d2 ${mounted ? 'in' : ''}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: 10, letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>

          <p className={`slide-in d3 ${mounted ? 'in' : ''}`} style={{ fontSize: 15, color: '#888', fontWeight: 300, marginBottom: 40, lineHeight: 1.5 }}>
            Sign in to continue to your portal.
          </p>

          <form onSubmit={handleSubmit} className={`slide-in d3 ${mounted ? 'in' : ''}`}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#777', marginBottom: 8 }}>
                Email / Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="login-input"
                placeholder="your@email.com"
                autoComplete="username"
                required
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#777', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="login-input"
                  style={{ paddingRight: 48 }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4, display: 'flex', alignItems: 'center' }}
                >
                  {showPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: 13, color: '#dc2626', lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(245,242,237,0.3)', borderTopColor: '#F5F2ED', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in…
                </>
              ) : 'Sign In →'}
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          <div className={`slide-in d5 ${mounted ? 'in' : ''}`} style={{ marginTop: 28, paddingTop: 28, borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#999' }}>
              First time?{' '}
              <Link to="/activate" style={{ color: '#2D6A4F', fontWeight: 600, textDecoration: 'none' }}>
                Activate your account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}