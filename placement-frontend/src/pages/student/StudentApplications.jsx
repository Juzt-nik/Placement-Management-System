import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../services/api';
import StudentLayout from './StudentLayout';
import { Spinner } from '../../components/UI';
import RoundTracker from '../../components/RoundTracker';

const statusStyle = {
  Applied:      'bg-blue-100 text-blue-700',
  'In Process': 'bg-amber-100 text-amber-700',
  Selected:     'bg-green-100 text-green-700',
  Rejected:     'bg-red-100 text-red-700',
};

export default function StudentApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Uses /applications/my — student only gets their own
        const res = await getMyApplications();
        setApplications(res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <StudentLayout><Spinner /></StudentLayout>;

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Applications</h1>
          <p className="text-gray-500 font-medium mt-1">Track your status and interview round progress</p>
        </div>

        {/* Status summary */}
        {applications.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {[
              ['Applied', 'blue'],
              ['In Process', 'amber'],
              ['Selected', 'green'],
              ['Rejected', 'red'],
            ].map(([s, c]) => {
              const count = applications.filter(a => a.status === s).length;
              if (!count) return null;
              return (
                <div key={s} className={`bg-${c}-50 border border-${c}-100 rounded-2xl px-5 py-3 text-center`}>
                  <p className={`text-3xl font-black text-${c}-700`}>{count}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest text-${c}-400 mt-0.5`}>{s}</p>
                </div>
              );
            })}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <span className="material-symbols-outlined text-gray-200 text-6xl">list_alt</span>
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs mt-4">No applications yet</p>
            <p className="text-gray-400 text-sm font-medium mt-1">Browse opportunities and hit Apply to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.application_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Row */}
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpanded(expanded === app.application_id ? null : app.application_id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center text-white font-black text-base shrink-0">
                      {(app.organization_name || 'C').charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-gray-800">{app.organization_name || 'Company'}</p>
                      <p className="text-sm text-gray-400 font-medium">
                        {app.role_title || 'Position'}
                        {app.job_type && <span className={`ml-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${app.job_type === 'Placement' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{app.job_type}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.stipend_or_ctc && (
                      <span className="text-sm font-black text-green-600 hidden sm:block">{app.stipend_or_ctc}</span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle[app.status] || 'bg-gray-100 text-gray-500'}`}>
                      {app.status}
                    </span>
                    {(app.current_round || 0) > 0 && (
                      <span className="text-xs text-gray-400 font-bold hidden sm:block">Round {app.current_round}</span>
                    )}
                    <span className="material-symbols-outlined text-gray-400 text-[20px]">
                      {expanded === app.application_id ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>

                {/* Compact round tracker */}
                <div className="px-6 pb-3">
                  <RoundTracker application={app} compact />
                </div>

                {/* Expanded details */}
                {expanded === app.application_id && (
                  <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-5">Full Application Timeline</p>
                    <RoundTracker application={app} />
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      {[
                        { label: 'Applied On', value: app.application_date ? new Date(app.application_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                        { label: 'Current Round', value: app.current_round ? `Round ${app.current_round}` : 'Not started' },
                        { label: 'Mode', value: app.mode || '—' },
                        { label: 'Status', value: app.status, highlight: app.status === 'Selected' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : app.status === 'In Process' ? 'text-amber-600' : 'text-blue-600' },
                      ].map(({ label, value, highlight }) => (
                        <div key={label}>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{label}</p>
                          <p className={`font-black mt-0.5 ${highlight || 'text-gray-700'}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {app.status === 'Selected' && (
                      <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-600 text-2xl">verified</span>
                        <div>
                          <p className="font-black text-green-800 text-sm">Congratulations! You've been selected 🎉</p>
                          <p className="text-green-600 text-xs font-medium mt-0.5">Your placement/internship record has been created in the system.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
