import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const roleHome = {
  student:           '/student/dashboard',
  faculty:           '/faculty/dashboard',
  hod:               '/faculty/dashboard',
  placement_officer: '/officer/dashboard',
  admin:             '/officer/dashboard',
};

const portalRoles = [
  { label: 'Student', icon: 'school', color: '#3b82f6' },
  { label: 'Faculty / HOD', icon: 'menu_book', color: '#8b5cf6' },
  { label: 'Placement Officer', icon: 'work', color: '#10b981' },
];

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

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
      const dest = roleHome[role];
      if (!dest) { setError(`Unknown role "${role}". Contact your administrator.`); return; }
      navigate(dest);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed. Check your credentials.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0c1a2e' }}>
      {/* Grid bg */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-[420px]">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/30">
              <span className="material-symbols-outlined text-blue-800 text-3xl">school</span>
            </div>
            <div className="text-left">
              <p className="text-white font-black text-xl leading-none uppercase tracking-tight">SRM Havloc</p>
              <p className="text-blue-400 text-[10px] tracking-[0.25em] uppercase mt-1">Placement Portal</p>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Welcome back</h1>
          <p className="text-white/40 mt-2 text-sm font-medium">Sign in to continue to your portal</p>
        </div>

        {/* Role chips */}
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {portalRoles.map(({ label, icon, color }) => (
            <div key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
              style={{ background: color + '15', color: color, borderColor: color + '30' }}
            >
              <span className="material-symbols-outlined text-[14px]">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">Email / Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[20px]">person</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-white/25 text-sm font-medium focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                  placeholder="your@email.com"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[20px]">lock</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl text-white placeholder-white/25 text-sm font-medium focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm font-medium flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">warning</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm uppercase tracking-widest"
              style={{ boxShadow: '0 8px 20px rgba(59,130,246,0.25)' }}
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                <><span>Sign In</span><span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-white/30 text-sm font-medium">
              First time?{' '}
              <Link to="/activate" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Activate Account →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
