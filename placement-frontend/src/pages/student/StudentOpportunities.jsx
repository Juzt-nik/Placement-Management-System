import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOpportunities, createApplication, getMyApplications } from '../../services/api';
import StudentLayout from './StudentLayout';
import { Spinner } from '../../components/UI';

const statusColor = {
  Open:     'bg-green-100 text-green-700',
  Upcoming: 'bg-amber-100 text-amber-700',
  Closed:   'bg-gray-100 text-gray-400',
};
const typeColor = {
  Placement:  'bg-blue-100 text-blue-700',
  Internship: 'bg-purple-100 text-purple-700',
};

export default function StudentOpportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null); // opportunity_id being applied to
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [oRes, aRes] = await Promise.all([
        getOpportunities(),
        getMyApplications().catch(() => ({ data: [] })),
      ]);
      setOpportunities(oRes.data || []);
      const ids = new Set((aRes.data || []).map(a => a.opportunity_id));
      setAppliedIds(ids);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleApply = async (opp) => {
    if (!user?.student_id) {
      setToast('Your student profile is not linked. Contact your placement officer.');
      setTimeout(() => setToast(''), 4000);
      return;
    }
    if (opp.status === 'Closed') return;
    setApplying(opp.opportunity_id);
    try {
      await createApplication({ student_id: user.student_id, opportunity_id: opp.opportunity_id });
      setAppliedIds(prev => new Set([...prev, opp.opportunity_id]));
      setToast(`Applied to ${opp.role_title} at ${opp.organization_name}!`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.response?.data?.error || 'Failed to apply. Try again.');
      setTimeout(() => setToast(''), 4000);
    } finally { setApplying(null); }
  };

  if (loading) return <StudentLayout><Spinner /></StudentLayout>;

  const filtered = opportunities.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (o.role_title||'').toLowerCase().includes(q) ||
      (o.organization_name||'').toLowerCase().includes(q) ||
      (o.location||'').toLowerCase().includes(q);
    const matchTab = tab === 'all' || o.job_type === tab;
    return matchSearch && matchTab;
  });

  const open = opportunities.filter(o => o.status === 'Open').length;

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Opportunities</h1>
            <p className="text-gray-500 font-medium mt-1">
              <span className="text-blue-700 font-black">{open} open</span> listings available for you
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Applied:</span>
            <span className="bg-blue-100 text-blue-700 font-black text-sm px-3 py-1 rounded-full">{appliedIds.size}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, companies, locations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all" />
          </div>
          <div className="flex gap-2">
            {[['all','All'],['Placement','Placement'],['Internship','Internship']].map(([v, label]) => (
              <button key={v} onClick={() => setTab(v)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  tab === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>{label}</button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <span className="material-symbols-outlined text-gray-200 text-6xl">work_outline</span>
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs mt-4">No opportunities yet</p>
            <p className="text-gray-400 text-sm font-medium mt-1">Your placement officer will post listings here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map(opp => {
              const hasApplied = appliedIds.has(opp.opportunity_id);
              const isClosed = opp.status === 'Closed';
              const isApplying = applying === opp.opportunity_id;
              return (
                <div key={opp.opportunity_id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-all">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shrink-0">
                        {(opp.organization_name || 'C').charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-base leading-tight">{opp.role_title}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{opp.organization_name}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 uppercase tracking-widest ${statusColor[opp.status] || 'bg-gray-100 text-gray-400'}`}>
                      {opp.status}
                    </span>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${typeColor[opp.job_type] || 'bg-gray-100 text-gray-500'}`}>
                      {opp.job_type}
                    </span>
                    {opp.mode && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>{opp.mode}
                      </span>
                    )}
                    {opp.location && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{opp.location}</span>
                    )}
                    {opp.stipend_or_ctc && (
                      <span className="text-[10px] bg-green-50 text-green-700 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {opp.stipend_or_ctc}
                      </span>
                    )}
                    {opp.duration_months && (
                      <span className="text-[10px] bg-purple-50 text-purple-700 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{opp.duration_months}m</span>
                    )}
                  </div>

                  {/* Description */}
                  {opp.description && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{opp.description}</p>
                  )}

                  {/* Deadline */}
                  {opp.application_deadline && (
                    <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      Apply by {new Date(opp.application_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  )}

                  {/* Apply button */}
                  <div className="pt-2 border-t border-gray-50 mt-auto">
                    {hasApplied ? (
                      <div className="w-full py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Applied
                      </div>
                    ) : isClosed ? (
                      <div className="w-full py-2.5 bg-gray-50 text-gray-400 text-sm font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        Closed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(opp)}
                        disabled={isApplying}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 shadow-sm"
                      >
                        {isApplying
                          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying...</>
                          : <><span className="material-symbols-outlined text-[18px]">send</span> Apply Now</>
                        }
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-green-400">check_circle</span>
          {toast}
        </div>
      )}
    </StudentLayout>
  );
}
