import React, { useState, useEffect } from 'react';
import {
  getApplications, deleteApplication,
  addRoundToApplication, markApplicationSelected, updateRound
} from '../../services/api';
import OfficerLayout from './OfficerLayout';
import { Spinner } from '../../components/UI';

const ROUND_TYPES = ['Aptitude Test', 'Coding Test', 'Technical Interview', 'HR Interview', 'Group Discussion', 'Manager Round', 'Final Interview'];

const STATUS_STYLE = {
  Applied:      { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  'In Process': { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500'  },
  Selected:     { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  Rejected:     { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
};

const RESULT_STYLE = {
  Pending:    'bg-gray-100 text-gray-500',
  Cleared:    'bg-green-100 text-green-700',
  Eliminated: 'bg-red-100 text-red-600',
};

export default function OfficerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  // Modals
  const [roundModal, setRoundModal] = useState(null); // { app }
  const [roundForm, setRoundForm] = useState({ round_name: '', round_date: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getApplications();
      // Sort: In Process first, then Applied, Selected, Rejected
      const order = { 'In Process': 0, Applied: 1, Selected: 2, Rejected: 3 };
      const sorted = (res.data || []).sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
      setApplications(sorted);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAddRound = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const nextRound = (roundModal.app.current_round || 0) + 1;
      await addRoundToApplication(roundModal.app.application_id, {
        round_number: nextRound,
        round_name: roundForm.round_name,
        round_date: roundForm.round_date || null,
      });
      setRoundModal(null);
      setRoundForm({ round_name: '', round_date: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add round');
    } finally { setSaving(false); }
  };

  const handleMarkSelected = async (app) => {
    if (!window.confirm(`Mark ${app.student_name} as Selected for ${app.organization_name}?\n\nThis will:\n• Update their application status\n• Set their placement status to Placed\n• Auto-create a ${app.job_type} record`)) return;
    try { await markApplicationSelected(app.application_id); load(); }
    catch { alert('Failed'); }
  };

  const handleRoundResult = async (roundId, result, appId) => {
    try {
      await updateRound(roundId, { result });
      // Expand the app so user sees the result update
      setExpanded(appId);
      load();
    } catch { alert('Failed to update round'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application? This cannot be undone.')) return;
    try { await deleteApplication(id); load(); } catch { alert('Failed'); }
  };

  const filtered = applications.filter(a => {
    const q = search.toLowerCase();
    const match = (a.student_name || '').toLowerCase().includes(q) ||
      (a.organization_name || '').toLowerCase().includes(q) ||
      (a.role_title || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return match && matchStatus;
  });

  if (loading) return <OfficerLayout><Spinner /></OfficerLayout>;

  const stats = ['Applied', 'In Process', 'Selected', 'Rejected'].map(s => ({
    label: s, count: applications.filter(a => a.status === s).length,
    style: STATUS_STYLE[s]
  }));

  return (
    <OfficerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Applications</h1>
          <p className="text-gray-500 font-medium mt-1">Manage placement drives and interview rounds</p>
        </div>

        {/* Stats — clickable filter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, count, style }) => (
            <button key={label} onClick={() => setStatusFilter(statusFilter === label ? 'all' : label)}
              className={`rounded-2xl p-5 border-2 text-left transition-all ${
                statusFilter === label
                  ? `${style.bg} border-current`
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}>
              <p className={`text-3xl font-black ${style.text}`}>{count}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                <p className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>{label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by student, company, role..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all" />
          </div>
          {statusFilter !== 'all' && (
            <button onClick={() => setStatusFilter('all')}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black rounded-xl uppercase tracking-widest transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">close</span> Clear
            </button>
          )}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <span className="material-symbols-outlined text-gray-200 text-6xl">inbox</span>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs mt-4">No applications found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => {
              const style = STATUS_STYLE[app.status] || STATUS_STYLE.Applied;
              const isExpanded = expanded === app.application_id;
              const roundsArr = app.rounds || [];

              return (
                <div key={app.application_id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* Main row */}
                  <div className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : app.application_id)}>

                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center text-white font-black text-base shrink-0">
                      {(app.student_name || 'S').charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-800 text-sm leading-tight truncate">{app.student_name}</p>
                      <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                        {app.organization_name}
                        {app.role_title && <span className="text-gray-300"> · {app.role_title}</span>}
                        {app.job_type && <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.job_type === 'Placement' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{app.job_type}</span>}
                      </p>
                    </div>

                    {/* Round progress dots */}
                    {(app.current_round || 0) > 0 && (
                      <div className="hidden sm:flex items-center gap-1 shrink-0">
                        {Array.from({ length: app.current_round }).map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-blue-400" />
                        ))}
                        <span className="text-[10px] text-gray-400 font-black ml-1 uppercase tracking-widest">R{app.current_round}</span>
                      </div>
                    )}

                    {/* Status badge */}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${style.bg} ${style.text}`}>
                      {app.status}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                      {app.status !== 'Selected' && app.status !== 'Rejected' && (
                        <>
                          <button
                            onClick={() => { setRoundModal({ app }); setRoundForm({ round_name: '', round_date: '' }); setError(''); }}
                            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest transition-all">
                            <span className="material-symbols-outlined text-[14px]">add_circle</span> Round
                          </button>
                          <button
                            onClick={() => handleMarkSelected(app)}
                            className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-widest transition-all">
                            <span className="material-symbols-outlined text-[14px]">verified</span> Select
                          </button>
                        </>
                      )}
                      {app.status === 'Selected' && (
                        <span className="flex items-center gap-1 text-green-600 text-[10px] font-black uppercase tracking-widest">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span> Placed
                        </span>
                      )}
                      <button onClick={() => handleDelete(app.application_id)}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </div>

                  {/* Compact round dots (always visible) */}
                  {(app.current_round || 0) > 0 && (
                    <div className="px-6 pb-3 flex items-center gap-2">
                      {roundsArr.map((r, i) => (
                        <div key={r.round_id || i} className="flex items-center gap-1.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black ${
                            r.result === 'Cleared' ? 'bg-green-500 text-white' :
                            r.result === 'Eliminated' ? 'bg-red-500 text-white' :
                            'bg-blue-100 text-blue-700'
                          }`}>{r.round_number}</div>
                          <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">{r.round_name}</span>
                          {i < roundsArr.length - 1 && <div className="w-4 h-px bg-gray-200 mx-1" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Expanded section */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-5">Interview Rounds</p>

                      {roundsArr.length === 0 ? (
                        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center">
                          <span className="material-symbols-outlined text-gray-300 text-3xl">timeline</span>
                          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">No rounds added yet</p>
                          <p className="text-gray-400 text-xs mt-1">Click "Round" to add the first interview round</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {roundsArr.map(r => (
                            <div key={r.round_id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                                  r.result === 'Cleared' ? 'bg-green-100 text-green-700' :
                                  r.result === 'Eliminated' ? 'bg-red-100 text-red-600' :
                                  'bg-blue-100 text-blue-700'
                                }`}>R{r.round_number}</div>
                                <div>
                                  <p className="font-black text-gray-800 text-sm">{r.round_name}</p>
                                  {r.round_date && (
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                                      {new Date(r.round_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {r.result === 'Pending' ? (
                                  <>
                                    <button onClick={() => handleRoundResult(r.round_id, 'Cleared', app.application_id)}
                                      className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[14px]">check</span> Cleared
                                    </button>
                                    <button onClick={() => handleRoundResult(r.round_id, 'Eliminated', app.application_id)}
                                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[14px]">close</span> Eliminated
                                    </button>
                                  </>
                                ) : (
                                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${RESULT_STYLE[r.result]}`}>
                                    {r.result === 'Cleared' ? '✓ ' : '✗ '}{r.result}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Meta details */}
                      <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: 'Applied On', value: app.application_date ? new Date(app.application_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                          { label: 'Company', value: app.organization_name || '—' },
                          { label: 'Role', value: app.role_title || '—' },
                          { label: 'Current Round', value: app.current_round ? `Round ${app.current_round}` : 'Not started' },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{label}</p>
                            <p className="font-black text-gray-700 text-sm mt-0.5 truncate">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Final actions */}
                      {app.status !== 'Selected' && app.status !== 'Rejected' && (
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => { setRoundModal({ app }); setRoundForm({ round_name: '', round_date: '' }); setError(''); }}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-widest transition-all">
                            <span className="material-symbols-outlined text-[16px]">add_circle</span> Add Next Round
                          </button>
                          <button
                            onClick={() => handleMarkSelected(app)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-widest transition-all">
                            <span className="material-symbols-outlined text-[16px]">verified</span> Mark as Selected
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Round Modal */}
      {roundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setRoundModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">Add Interview Round</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Round {(roundModal.app.current_round || 0) + 1} for {roundModal.app.student_name}
                </p>
              </div>
              <button onClick={() => setRoundModal(null)} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddRound} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Round Type <span className="text-red-500">*</span></label>
                <select value={roundForm.round_name} onChange={e => setRoundForm(p => ({ ...p, round_name: e.target.value }))} required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-all">
                  <option value="">Select round type</option>
                  {ROUND_TYPES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Scheduled Date</label>
                <input type="date" value={roundForm.round_date} onChange={e => setRoundForm(p => ({ ...p, round_date: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">{error}</div>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setRoundModal(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-black rounded-xl transition-all">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black py-2.5 rounded-xl transition-all disabled:opacity-50">
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Add Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OfficerLayout>
  );
}
