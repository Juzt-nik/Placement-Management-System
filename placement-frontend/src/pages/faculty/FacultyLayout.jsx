import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const facultyNav = [
  { label: 'Dashboard',    icon: 'dashboard',      path: '/faculty/dashboard' },
  { label: 'Students',     icon: 'people',          path: '/faculty/students' },
  { label: 'Applications', icon: 'list_alt',        path: '/faculty/applications' },
  { label: 'Reports',      icon: 'bar_chart',       path: '/faculty/reports' },
  { label: 'My Profile',   icon: 'account_circle',  path: '/faculty/profile' },
];

const roleLabels = { faculty: 'Faculty', hod: 'Head of Department' };

export default function FacultyLayout({ children }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <aside
        className="flex flex-col h-full text-white shadow-2xl z-30 transition-all duration-300"
        style={{ width: open ? 256 : 68, background: '#0c1a2e', flexShrink: 0 }}
      >
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-md cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <span className="material-symbols-outlined text-blue-800 text-2xl">school</span>
          </div>
          {open && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-black uppercase tracking-tight leading-tight">SRM Havloc</h1>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.2em]">Faculty Portal</p>
            </div>
          )}
        </div>

        {open && (
          <div className="px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                {(user?.username || 'F').charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-sm font-bold truncate">{user?.username?.split('@')[0]}</p>
                <p className="text-white/40 text-[10px]">{roleLabels[user?.role] || 'Faculty'}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 custom-scrollbar">
          {facultyNav.map(({ label, icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-white/10 text-amber-400 border-l-4 border-amber-400 pl-3'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined text-[22px] shrink-0">{icon}</span>
              {open && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          {open ? (
            <button
              onClick={() => { logoutUser(); navigate('/login'); }}
              className="w-full bg-white text-blue-900 font-black py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 shadow-md text-sm"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              Logout
            </button>
          ) : (
            <button onClick={() => { logoutUser(); navigate('/login'); }} className="w-full flex justify-center py-2.5 text-white/60 hover:text-white">
              <span className="material-symbols-outlined text-[22px]">logout</span>
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20 shrink-0">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            <input
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-gray-400"
              placeholder="Search students, reports..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4 ml-6">
            <button className="relative text-gray-400 hover:text-purple-600 p-1.5 hover:bg-gray-50 rounded-xl">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-none">{user?.username?.split('@')[0] || 'Faculty'}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{roleLabels[user?.role] || 'Faculty'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-black text-sm ring-2 ring-white shadow-sm">
                {(user?.username || 'F').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] custom-scrollbar">
          <div className="p-8 max-w-6xl mx-auto page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
