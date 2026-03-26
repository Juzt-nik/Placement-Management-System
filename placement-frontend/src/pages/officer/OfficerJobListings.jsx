import React, { useState, useEffect } from 'react';
import {
  getOpportunities, createOpportunity, updateOpportunity, deleteOpportunity,
  getOrganizations,
} from '../../services/api';
import OfficerLayout from './OfficerLayout';
import { Spinner } from '../../components/UI';

const MODES       = ['On-site', 'Remote', 'Hybrid'];
const TYPES       = ['Placement', 'Internship'];
const STATUS      = ['Open', 'Upcoming', 'Closed'];
const DRIVE_TYPES = ['On-Campus', 'Off-Campus', 'Other'];

const statusColor = {
  Open:     'bg-green-100 text-green-700',
  Upcoming: 'bg-amber-100 text-amber-700',
  Closed:   'bg-gray-100 text-gray-400',
};
const typeColor = {
  Placement:  'bg-blue-100 text-blue-700',
  Internship: 'bg-purple-100 text-purple-700',
};
const driveTypeColor = {
  'On-Campus':  'bg-teal-100 text-teal-700',
  'Off-Campus': 'bg-orange-100 text-orange-700',
  'Other':      'bg-gray-100 text-gray-500',
};

const empty = {
  organization_id: '', role_title: '', job_type: 'Placement',
  drive_type: 'On-Campus', description: '', location: '',
  mode: 'On-site', stipend_or_ctc: '', duration_months: '',
  start_date: '', end_date: '', application_deadline: '', status: 'Open',
};

function JobForm({ form, onFieldChange, onSubmit, onCancel, saving, error, modal, orgs }) {
  const f = field => e => onFieldChange(field, e.target.value);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Company */}
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Company <span className="text-red-500">*</span></label>
          <select value={form.organization_id} onChange={f('organization_id')} required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-all">
            <option value="">Select company</option>
            {orgs.map(o => <option key={o.organization_id} value={o.organization_id}>{o.organization_name}</option>)}
          </select>
        </div>

        {/* Role */}
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Role Title <span className="text-red-500">*</span></label>
          <input value={form.role_title} onChange={f('role_title')} required placeholder="e.g. Software Engineer, Data Science Intern"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-all" />
        </div>

        {/* Type + Drive Type */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Opportunity Type</label>
          <select value={form.job_type} onChange={f('job_type')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-all">
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Drive Type</label>
          <select value={form.drive_type} onChange={f('drive_type')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-all">
            {DRIVE_TYPES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* Mode + Location */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Work Mode</label>
          <select value={form.mode} onChange={f('mode')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-all">
            {MODES.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Location</label>
          <input value={form.location} onChange={f('location')} placeholder="Chennai, Tamil Nadu"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-all" />
        </div>

        {/* Compensation + Duration */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
            {form.job_type === 'Internship' ? 'Stipend/month' : 'CTC (LPA)'}
          </label>
          <input value={form.stipend_or_ctc} onChange={f('stipend_or_ctc')}
            placeholder={form.job_type === 'Internship' ? '₹15,000' : '6 LPA'}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-all" />
        </div>
        {form.job_type === 'Internship' && (
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Duration (months)</label>
            <input type="number" min="1" max="24" value={form.duration_months} onChange={f('duration_months')} placeholder="3"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-all" />
          </div>
        )}

        {/* Status */}
        <div className={form.job_type === 'Internship' ? '' : 'sm:col-span-2'}>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Drive Status</label>
          <select value={form.status} onChange={f('status')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-all">
            {STATUS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-3">Drive Schedule</p>
        <div className="grid grid-cols-3 gap-3">
          {[['Opening Date','start_date'],['Closing Date','end_date'],['Application Deadline','application_deadline']].map(([label, field]) => (
            <div key={field}>
              <label className="block text-[10px] font-black text-blue-600 mb-1.5">{label}</label>
              <input type="date" value={form[field]} onChange={f(field)}
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Description / Eligibility</label>
        <textarea value={form.description} onChange={f('description')} rows={3}
          placeholder="Requirements, responsibilities, CGPA cutoff..."
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-blue-500 transition-all resize-none" />
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">{error}</div>}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-black rounded-xl transition-all">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black px-6 py-2.5 rounded-xl transition-all disabled:opacity-50">
          {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {modal === 'create' ? 'Post Listing' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

export default function OfficerJobListings() {
  const [listings, setListings] = useState([]);
  const [orgs, setOrgs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [driveTab, setDriveTab] = useState('all');   // on-campus / off-campus / other / all
  const [typeFilter, setTypeFilter] = useState('all');
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(empty);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [lRes, oRes] = await Promise.all([getOpportunities(), getOrganizations()]);
      setListings(lRes.data || []);
      setOrgs(oRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const f = field => e => setForm(p => ({ ...p, [field]: e.target.value }));
  const handleFieldChange = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        organization_id: parseInt(form.organization_id),
        duration_months: form.duration_months ? parseInt(form.duration_months) : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        application_deadline: form.application_deadline || null,
      };
      if (modal === 'create') await createOpportunity(payload);
      else await updateOpportunity(selected.opportunity_id, payload);
      setModal(null); setForm(empty); load();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this listing?')) return;
    try { await deleteOpportunity(id); load(); } catch { alert('Failed to delete'); }
  };

  const openEdit = (item) => {
    setSelected(item);
    setForm({
      organization_id: item.organization_id || '',
      role_title: item.role_title || '',
      job_type: item.job_type || 'Placement',
      drive_type: item.drive_type || 'On-Campus',
      description: item.description || '',
      location: item.location || '',
      mode: item.mode || 'On-site',
      stipend_or_ctc: item.stipend_or_ctc || '',
      duration_months: item.duration_months || '',
      start_date: item.start_date ? item.start_date.split('T')[0] : '',
      end_date: item.end_date ? item.end_date.split('T')[0] : '',
      application_deadline: item.application_deadline ? item.application_deadline.split('T')[0] : '',
      status: item.status || 'Open',
    });
    setError(''); setModal('edit');
  };

  const filtered = listings.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (l.role_title || '').toLowerCase().includes(q) ||
      (l.organization_name || '').toLowerCase().includes(q) ||
      (l.location || '').toLowerCase().includes(q);
    const matchDrive = driveTab === 'all' || l.drive_type === driveTab;
    const matchType  = typeFilter === 'all' || l.job_type === typeFilter || l.status === typeFilter;
    return matchSearch && matchDrive && matchType;
  });

  // Tab counts
  const tabCounts = {
    all:          listings.length,
    'On-Campus':  listings.filter(l => l.drive_type === 'On-Campus').length,
    'Off-Campus': listings.filter(l => l.drive_type === 'Off-Campus').length,
    'Other':      listings.filter(l => l.drive_type === 'Other').length,
  };

  if (loading) return <OfficerLayout><Spinner /></OfficerLayout>;

  return (
    <OfficerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Job Listings</h1>
            <p className="text-gray-500 font-medium mt-1">{listings.length} placement drives &amp; internship openings</p>
          </div>
          <button onClick={() => { setForm(empty); setError(''); setModal('create'); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-5 py-3 rounded-xl transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span> Post Listing
          </button>
        </div>

        {/* Drive Type Tabs — the main feature */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1">
          {[
            { key: 'all', label: 'All Drives', icon: 'work' },
            { key: 'On-Campus', label: 'On-Campus', icon: 'school' },
            { key: 'Off-Campus', label: 'Off-Campus', icon: 'language' },
            { key: 'Other', label: 'Other / App Offers', icon: 'open_in_new' },
          ].map(({ key, label, icon }) => (
            <button key={key} onClick={() => setDriveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                driveTab === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}>
              <span className="material-symbols-outlined text-[16px]">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${driveTab === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {tabCounts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Sub-filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, companies..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'Placement', 'Internship', 'Open', 'Upcoming', 'Closed'].map(v => (
              <button key={v} onClick={() => setTypeFilter(v)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  typeFilter === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>{v === 'all' ? 'All' : v}</button>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: listings.length, bg: 'bg-gray-50', text: 'text-gray-700' },
            { label: 'Open', value: listings.filter(l => l.status === 'Open').length, bg: 'bg-green-50', text: 'text-green-700' },
            { label: 'On-Campus', value: listings.filter(l => l.drive_type === 'On-Campus').length, bg: 'bg-teal-50', text: 'text-teal-700' },
            { label: 'Off-Campus', value: listings.filter(l => l.drive_type === 'Off-Campus').length, bg: 'bg-orange-50', text: 'text-orange-700' },
          ].map(({ label, value, bg, text }) => (
            <div key={label} className={`${bg} rounded-2xl border border-gray-100 p-5`}>
              <p className={`text-3xl font-black ${text}`}>{value}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <span className="material-symbols-outlined text-gray-200 text-6xl">work_outline</span>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs mt-4">No listings for this category</p>
            <p className="text-gray-400 text-sm font-medium mt-1">Post a new listing using the button above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => (
              <div key={item.opportunity_id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-all">

                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shrink-0">
                      {(item.organization_name || 'C').charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm leading-tight">{item.role_title}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{item.organization_name}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full shrink-0 uppercase tracking-widest ${statusColor[item.status] || 'bg-gray-100 text-gray-400'}`}>
                    {item.status}
                  </span>
                </div>

                {/* Pills */}
                <div className="flex flex-wrap gap-2">
                  {item.job_type && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${typeColor[item.job_type] || 'bg-gray-100 text-gray-500'}`}>
                      {item.job_type}
                    </span>
                  )}
                  {item.drive_type && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 ${driveTypeColor[item.drive_type] || 'bg-gray-100 text-gray-500'}`}>
                      <span className="material-symbols-outlined text-[10px]">
                        {item.drive_type === 'On-Campus' ? 'school' : item.drive_type === 'Off-Campus' ? 'language' : 'open_in_new'}
                      </span>
                      {item.drive_type}
                    </span>
                  )}
                  {item.mode && (
                    <span className="text-[9px] bg-gray-100 text-gray-500 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{item.mode}</span>
                  )}
                  {item.stipend_or_ctc && (
                    <span className="text-[9px] bg-green-50 text-green-700 font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{item.stipend_or_ctc}</span>
                  )}
                </div>

                {item.application_deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold">
                    <span className="material-symbols-outlined text-[14px]">event</span>
                    Deadline: {new Date(item.application_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                )}

                {item.description && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-50 mt-auto">
                  <button onClick={() => openEdit(item)}
                    className="flex-1 text-[10px] font-black py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all flex items-center justify-center gap-1 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                  </button>
                  <button onClick={() => handleDelete(item.opportunity_id)}
                    className="flex-1 text-[10px] font-black py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all flex items-center justify-center gap-1 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px]">delete</span> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">
                {modal === 'create' ? 'Post New Listing' : 'Edit Listing'}
              </h2>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6">
              <JobForm
                form={form}
                onFieldChange={handleFieldChange}
                onSubmit={handleSave}
                onCancel={() => setModal(null)}
                saving={saving}
                error={error}
                modal={modal}
                orgs={orgs}
              />
            </div>
          </div>
        </div>
      )}
    </OfficerLayout>
  );
}