import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard, getStudents, getApplications, getPlacements } from '../services/api';
import { Spinner, StatusBadge } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const StatCard = ({ label, value, icon, colorClass, bgClass }) => (
  <div className={`${bgClass} p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all card-hover`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
    <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">{value ?? '—'}</h3>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const proms = [getStudents(), getApplications().catch(() => ({ data: [] })), getPlacements().catch(() => ({ data: [] }))];
        const isStaff = ['admin', 'placement_officer', 'faculty', 'hod'].includes(user?.role);
        if (isStaff) proms.push(getDashboard());
        const results = await Promise.allSettled(proms);
        setStudents(results[0].value?.data || []);
        setApplications(results[1].value?.data || []);
        setPlacements(results[2].value?.data || []);
        if (isStaff && results[3]?.value) setReport(results[3].value.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const isStaff = ['admin', 'placement_officer', 'faculty', 'hod'].includes(user?.role);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <Spinner />;

  const placed = students.filter(s => s.placement_status === 'Placed').length;
  const recentApps = applications.slice(0, 5);
  const recentPlacements = placements.slice(0, 5);
  const name = user?.username?.split('@')[0];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            {greeting()}, {name}! 👋
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
            {isStaff
              ? <>Managing <span className="text-blue-700 font-black">{students.length} students</span> · {applications.length} applications</>
              : "Here's your placement overview"
            }
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Today</p>
            <p className="text-sm font-black text-gray-900 leading-none">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={students.length} icon="people" colorClass="bg-blue-100 text-blue-600" bgClass="bg-white" />
        <StatCard label="Applications" value={applications.length} icon="list_alt" colorClass="bg-indigo-100 text-indigo-600" bgClass="bg-white" />
        <StatCard label="Placed Students" value={placed} icon="verified" colorClass="bg-green-100 text-green-600" bgClass="bg-white" />
        <StatCard label="Placements" value={placements.length} icon="trending_up" colorClass="bg-purple-100 text-purple-600" bgClass="bg-white" />
      </div>

      {/* Charts - staff only */}
      {isStaff && report && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {report.studentsByStage?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Applications by Status</h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={report.studentsByStage} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Plus Jakarta Sans' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ background: '#0c1a2e', border: 'none', borderRadius: 12, color: '#f8fafc', fontFamily: 'Plus Jakarta Sans', fontSize: 12 }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {report.internshipVsPlacementRatio?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Internship vs Placement</h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={report.internshipVsPlacementRatio} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} label={({ type, count }) => `${type}: ${count}`} labelLine={false}>
                      {report.internshipVsPlacementRatio.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0c1a2e', border: 'none', borderRadius: 12, color: '#f8fafc', fontSize: 12 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {report.placementByOrganization?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Top Recruiting Organizations</h3>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={report.placementByOrganization.slice(0, 6)} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis dataKey="organization_name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={90} />
                    <Tooltip contentStyle={{ background: '#0c1a2e', border: 'none', borderRadius: 12, color: '#f8fafc', fontSize: 12 }} />
                    <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {report.summary && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Placement Summary</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Total Placed Students', value: report.summary.totalPlaced, color: 'text-green-600' },
                  { label: 'Total Internships', value: report.summary.totalInternships, color: 'text-blue-600' },
                  { label: 'Total Placements', value: report.summary.totalPlacements, color: 'text-purple-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 text-sm font-medium">{label}</span>
                    <span className={`font-black text-2xl ${color}`}>{value ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Recent Applications</h3>
            <a href="/applications" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View all →</a>
          </div>
          {recentApps.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm font-medium">No applications yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.map(app => (
                <div key={app.application_id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{app.student_name || `Student #${app.student_id}`}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{app.organization_name || 'Unknown Org'} · {app.role_title || 'N/A'}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Recent Placements</h3>
            <a href="/placements" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View all →</a>
          </div>
          {recentPlacements.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm font-medium">No placements recorded</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentPlacements.map(p => (
                <div key={p.placement_id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{p.student_name || `Student #${p.student_id}`}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{p.organization_name} · {p.job_role}</p>
                  </div>
                  <span className="text-green-600 font-black text-sm">{p.package_lpa} LPA</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
