import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, deleteStudent, getStudentProfile, verifyStudent } from '../../services/api';
import OfficerLayout from './OfficerLayout';
import { Spinner } from '../../components/UI';

const statusBadge = {
  Verified:  'bg-green-100 text-green-700',
  Submitted: 'bg-amber-100 text-amber-700',
  Pending:   'bg-gray-100 text-gray-500',
};

const appStatusStyle = {
  Applied:      'bg-blue-100 text-blue-700',
  'In Process': 'bg-amber-100 text-amber-700',
  Selected:     'bg-green-100 text-green-700',
  Rejected:     'bg-red-100 text-red-600',
};

const roundResultStyle = {
  Cleared:    'bg-green-500 text-white',
  Eliminated: 'bg-red-500 text-white',
  Pending:    'bg-gray-200 text-gray-500',
};

export default function OfficerStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add student modal
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ register_number: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState('');
  const [tokenModal, setTokenModal] = useState(null);
  const [copied, setCopied] = useState(false);

  // Student detail modal
  const [profileModal, setProfileModal] = useState(null); // full profile object
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const r = await getStudents(); setStudents(r.data || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openProfile = async (student) => {
    setProfileModal({ ...student, applications: null }); // show modal immediately with skeleton
    setProfileLoading(true);
    try {
      const res = await getStudentProfile(student.student_id);
      setProfileModal(res.data);
    } catch (e) {
      setProfileModal({ ...student, applications: [] });
    } finally { setProfileLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setAddError('');
    try {
      const res = await createStudent({ register_number: form.register_number, email: form.email });
      setShowAdd(false);
      setForm({ register_number: '', email: '' });
      setTokenModal({ token: res.data.registration_token, email: form.email, reg: form.register_number });
      load();
    } catch (err) {
      setAddError(err.response?.data?.error || err.response?.data?.message || 'Failed to create student');
    } finally { setSaving(false); }
  };

  const handleVerify = async (id) => {
    try { await verifyStudent(id); load(); } catch { alert('Failed to verify'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try { await deleteStudent(id); load(); if (profileModal?.student_id === id) setProfileModal(null); }
    catch { alert('Failed to delete'); }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(tokenModal.token);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.register_number || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.department || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <OfficerLayout><Spinner /></OfficerLayout>;

  return (
    <OfficerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Students</h1>
            <p className="text-gray-500 font-medium mt-1">{students.length} registered students</p>
          </div>
          <button onClick={() => { setShowAdd(true); setForm({ register_number: '', email: '' }); setAddError(''); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-5 py-3 rounded-xl transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">person_add</span> Add Student
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total', value: students.length, bg: 'bg-gray-50', text: 'text-gray-700' },
            { label: 'Verified', value: students.filter(s => s.profile_status === 'Verified').length, bg: 'bg-green-50', text: 'text-green-700' },
            { label: 'Placed', value: students.filter(s => s.placement_status === 'Placed').length, bg: 'bg-blue-50', text: 'text-blue-700' },
          ].map(({ label, value, bg, text }) => (
            <div key={label} className={`${bg} rounded-2xl border border-gray-100 p-5`}>
              <p className={`text-3xl font-black ${text}`}>{value}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <span className="material-symbols-outlined text-gray-200 text-6xl">group</span>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs mt-4">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Student', 'Register No', 'Dept / Year', 'CGPA', 'Profile', 'Placement', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(s => (
                    <tr key={s.student_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        {/* Clickable name */}
                        <button onClick={() => openProfile(s)} className="flex items-center gap-3 text-left group">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-black shrink-0">
                            {(s.name || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                              {s.name || <span className="text-gray-400 italic font-medium">Not set</span>}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">{s.email}</p>
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono font-bold">{s.register_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-medium">{s.department || '—'}{s.year_of_study ? ` · Y${s.year_of_study}` : ''}</td>
                      <td className="px-4 py-3 text-sm font-black text-gray-700">{s.cgpa || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge[s.profile_status] || statusBadge.Pending}`}>
                          {s.profile_status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${s.placement_status === 'Placed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {s.placement_status || 'Unplaced'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openProfile(s)} title="View Profile"
                            className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-[18px]">person</span>
                          </button>
                          {s.profile_status === 'Submitted' && (
                            <button onClick={() => handleVerify(s.student_id)} title="Verify Student"
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all">
                              <span className="material-symbols-outlined text-[18px]">verified</span>
                            </button>
                          )}
                          <button onClick={() => handleDelete(s.student_id)} title="Delete"
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Student Profile Modal ─────────────────────────────── */}
      {profileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProfileModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full sm:max-w-3xl max-h-[85vh] flex flex-col mt-0">

            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-black text-2xl">
                  {(profileModal.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">{profileModal.name || 'Student'}</h2>
                  <p className="text-sm text-gray-400 font-medium">{profileModal.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge[profileModal.profile_status] || statusBadge.Pending}`}>
                      {profileModal.profile_status || 'Pending'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${profileModal.placement_status === 'Placed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {profileModal.placement_status || 'Unplaced'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setProfileModal(null)} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Register No', value: profileModal.register_number || '—' },
                  { label: 'Department', value: profileModal.department || '—' },
                  { label: 'Year', value: profileModal.year_of_study ? `Year ${profileModal.year_of_study}` : '—' },
                  { label: 'CGPA', value: profileModal.cgpa || '—' },
                  { label: 'Phone', value: profileModal.phone || '—' },
                  { label: 'Skill Set', value: profileModal.skill_set || '—' },
                  { label: 'Resume', value: profileModal.resume_link ? 'Available' : 'Not uploaded' },
                  { label: 'Active', value: profileModal.is_active ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                    <p className="font-black text-gray-700 text-sm mt-0.5 truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Application history */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Application History
                  {profileModal.applications && (
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full normal-case font-black text-[10px]">
                      {profileModal.applications.length} companies
                    </span>
                  )}
                </p>

                {profileLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                  </div>
                ) : !profileModal.applications || profileModal.applications.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                    <span className="material-symbols-outlined text-gray-300 text-4xl">list_alt</span>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs mt-3">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profileModal.applications.map(app => (
                      <div key={app.application_id} className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                        {/* Company row */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white font-black text-base shrink-0">
                              {(app.organization_name || 'C').charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-gray-800">{app.organization_name}</p>
                              <p className="text-xs text-gray-500 font-medium">
                                {app.role_title}
                                {app.job_type && <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.job_type === 'Placement' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{app.job_type}</span>}
                                {app.drive_type && <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-200 text-gray-600">{app.drive_type}</span>}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${appStatusStyle[app.status] || 'bg-gray-100 text-gray-500'}`}>
                            {app.status}
                          </span>
                        </div>

                        {/* Rounds timeline */}
                        {app.rounds && app.rounds.length > 0 ? (
                          <div className="flex items-center gap-0">
                            {app.rounds.map((r, idx) => (
                              <div key={r.round_id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${roundResultStyle[r.result] || roundResultStyle.Pending}`}>
                                    {r.result === 'Cleared' ? '✓' : r.result === 'Eliminated' ? '✗' : r.round_number}
                                  </div>
                                  <p className="text-[9px] text-gray-400 font-medium mt-1 max-w-[60px] text-center leading-tight">{r.round_name}</p>
                                </div>
                                {idx < app.rounds.length - 1 && (
                                  <div className={`w-8 h-0.5 mb-4 ${
                                    app.rounds[idx].result === 'Cleared' ? 'bg-green-400' :
                                    app.rounds[idx].result === 'Eliminated' ? 'bg-red-300' : 'bg-gray-200'
                                  }`} />
                                )}
                              </div>
                            ))}
                            {app.status === 'Selected' && (
                              <>
                                <div className="w-8 h-0.5 mb-4 bg-green-400" />
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-[12px] font-black text-white">🎉</div>
                                  <p className="text-[9px] text-green-600 font-black mt-1">Selected</p>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 font-medium italic">No rounds recorded yet</p>
                        )}

                        {/* Levels reached info */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                          <span>Applied: {new Date(app.application_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span>Rounds cleared: {app.rounds?.filter(r => r.result === 'Cleared').length || 0} / {app.rounds?.length || 0}</span>
                          {app.stipend_or_ctc && <span className="text-green-600 font-black">{app.stipend_or_ctc}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-gray-100 flex gap-3">
              {profileModal.profile_status === 'Submitted' && (
                <button onClick={() => { handleVerify(profileModal.student_id); setProfileModal(p => ({ ...p, profile_status: 'Verified' })); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-black py-2.5 rounded-xl transition-all">
                  <span className="material-symbols-outlined text-[18px]">verified</span> Verify Student
                </button>
              )}
              <button onClick={() => setProfileModal(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-black rounded-xl transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Student Modal ─────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Add New Student</h2>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Register Number <span className="text-red-500">*</span></label>
                <input value={form.register_number} onChange={e => setForm(p => ({ ...p, register_number: e.target.value }))} required
                  placeholder="e.g. RA2111003010001"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 font-mono focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                  placeholder="student@srmist.edu.in"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                💡 A unique registration token will be generated. Share it with the student to activate their account.
              </div>
              {addError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">{addError}</div>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-black rounded-xl transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black py-2.5 rounded-xl transition-all disabled:opacity-50">
                  {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Token Modal ───────────────────────────────────────── */}
      {tokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
            </div>
            <h2 className="text-lg font-black text-gray-900 text-center mb-1">Student Created!</h2>
            <p className="text-gray-400 text-sm text-center mb-5">Share this token with <strong>{tokenModal.email}</strong></p>
            <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-3 mb-4">
              <code className="text-green-400 text-sm break-all font-mono flex-1">{tokenModal.token}</code>
              <button onClick={copyToken}
                className={`shrink-0 p-2 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 mb-5 space-y-1">
              <p className="font-black">Student instructions:</p>
              <p>1. Go to <code className="bg-blue-100 px-1 rounded">/activate</code> on the portal</p>
              <p>2. Paste the token above and set a password</p>
              <p>3. Wait for verification before they can log in</p>
            </div>
            <button onClick={() => setTokenModal(null)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-all">Done</button>
          </div>
        </div>
      )}
    </OfficerLayout>
  );
}
