import React, { useState, useEffect } from 'react';
import { getDashboard, getOrganizations } from '../../services/api';
import OfficerLayout from './OfficerLayout';
import { Spinner } from '../../components/UI';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid, Area, AreaChart
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="font-black text-gray-300 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-black">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, icon, color }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
        <p className={`text-4xl font-black mt-2 ${color || 'text-gray-900'}`}>{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400 font-medium mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50`}>
        <span className={`material-symbols-outlined text-2xl ${color || 'text-gray-400'}`}>{icon}</span>
      </div>
    </div>
  </div>
);

export default function OfficerReports() {
  const [report, setReport] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: '', cgpa_min: '', cgpa_max: '', organization_id: '', type: '' });

  useEffect(() => {
    getOrganizations().then(r => setOrgs(r.data || [])).catch(() => {});
    loadReport();
  }, []);

  const loadReport = async (f = filters) => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      const res = await getDashboard(clean);
      setReport(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const s = report?.summary || {};

  return (
    <OfficerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Reports & Analytics</h1>
            <p className="text-gray-500 font-medium mt-1">Placement insights and statistics</p>
          </div>
          <button onClick={() => loadReport()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-4 py-2.5 rounded-xl transition-all">
            <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Filters</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: 'year', label: 'Year', options: [['','All Years'],[1,'Year 1'],[2,'Year 2'],[3,'Year 3'],[4,'Year 4']] },
              { key: 'cgpa_min', label: 'Min CGPA', options: [['','Any'],['6','≥ 6'],['6.5','≥ 6.5'],['7','≥ 7'],['7.5','≥ 7.5'],['8','≥ 8'],['9','≥ 9']] },
              { key: 'cgpa_max', label: 'Max CGPA', options: [['','Any'],['7','≤ 7'],['7.5','≤ 7.5'],['8','≤ 8'],['8.5','≤ 8.5'],['9','≤ 9'],['10','≤ 10']] },
              { key: 'organization_id', label: 'Company', options: [['','All'], ...orgs.map(o => [o.organization_id, o.organization_name])] },
              { key: 'type', label: 'Type', options: [['','All'],['Placement','Placement'],['Internship','Internship']] },
            ].map(({ key, label, options }) => (
              <div key={key}>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{label}</label>
                <select value={filters[key]} onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 transition-all">
                  {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button onClick={() => loadReport(filters)}
            className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all">
            Apply Filters
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : !report ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <span className="material-symbols-outlined text-gray-200 text-5xl">bar_chart</span>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs mt-3">No data available yet</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Placed" value={s.totalPlaced} icon="workspace_premium" color="text-green-600"
                sub="Selected for placements" />
              <StatCard label="Internships" value={s.totalInternshipsConfirmed} icon="work_history" color="text-blue-600"
                sub="Confirmed internships" />
              <StatCard label="In Process" value={s.totalInProcess} icon="pending" color="text-amber-600"
                sub="Active applications" />
              <StatCard label="Total Students" value={s.totalStudents} icon="group" color="text-gray-700"
                sub="In the system" />
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Monthly Trend */}
              {report.monthlyTrend?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Monthly Applications</p>
                  <p className="text-xs text-gray-400 font-medium mb-5">Applications vs selections over last 6 months</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={report.monthlyTrend}>
                      <defs>
                        <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="selGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="applications" name="Applications" stroke="#3b82f6" fill="url(#appGrad)" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                      <Area type="monotone" dataKey="selected" name="Selected" stroke="#10b981" fill="url(#selGrad)" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Application Status Funnel */}
              {report.applicationsByStatus?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Application Funnel</p>
                  <p className="text-xs text-gray-400 font-medium mb-5">Breakdown by current status</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={report.applicationsByStatus} dataKey="value" nameKey="name"
                        cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                        {report.applicationsByStatus.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Charts row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Top Companies */}
              {report.topCompaniesByPlacements?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Top Recruiting Companies</p>
                  <p className="text-xs text-gray-400 font-medium mb-5">Most placements by company</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={report.topCompaniesByPlacements} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Placements" fill="#3b82f6" radius={[0, 6, 6, 0]}>
                        {report.topCompaniesByPlacements.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Dept-wise */}
              {report.placementByDepartment?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Placements by Department</p>
                  <p className="text-xs text-gray-400 font-medium mb-5">Which depts are getting placed most</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={report.placementByDepartment}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} interval={0} angle={-25} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[6, 6, 0, 0]}>
                        {report.placementByDepartment.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Charts row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              {/* Year-wise */}
              {report.placementByYear?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Placed by Year</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={report.placementByYear}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="placed" name="Placed" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Placement vs Internship */}
              {report.internshipVsPlacement?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Type Split</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={report.internshipVsPlacement} dataKey="value" nameKey="name"
                        cx="50%" cy="50%" outerRadius={65} paddingAngle={4}>
                        {report.internshipVsPlacement.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? '#3b82f6' : '#8b5cf6'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 10, fontWeight: 700 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Drive type breakdown */}
              {report.driveTypeBreakdown?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Drive Type</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={report.driveTypeBreakdown} dataKey="value" nameKey="name"
                        cx="50%" cy="50%" outerRadius={65} paddingAngle={4}>
                        {report.driveTypeBreakdown.map((_, i) => (
                          <Cell key={i} fill={['#f59e0b', '#06b6d4', '#f97316'][i % 3]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 10, fontWeight: 700 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </OfficerLayout>
  );
}
