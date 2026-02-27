import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStudent, getApplications } from '../../services/api';
import StudentLayout from './StudentLayout';
import { Spinner } from '../../components/UI';

export default function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.student_id) { setLoading(false); return; }
      try {
        const [sRes, aRes] = await Promise.all([
          getStudent(user.student_id),
          getApplications().catch(() => ({ data: [] }))
        ]);
        setStudentData(sRes.data);
        setApplications(aRes.data || []);
        if (sRes.data?.name) updateUser({ name: sRes.data.name });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user?.student_id]);

  if (loading) return <StudentLayout><Spinner /></StudentLayout>;

  const isProfileIncomplete = !studentData?.name || !studentData?.department || !studentData?.cgpa;
  const myApps = applications.filter(a => a.student_id === user?.student_id);
  const placed = myApps.some(a => a.status === 'Selected');
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = studentData?.name?.split(' ')[0] || user?.username?.split('@')[0];

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              {greeting()}, {firstName}! 👋
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {studentData?.register_number} · <span className="font-semibold">{studentData?.department || 'Complete your profile'}</span>
            </p>
          </div>
          {placed && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600">verified</span>
              <p className="text-green-800 font-black text-sm">You've been placed! 🎉</p>
            </div>
          )}
        </div>

        {/* Profile incomplete warning */}
        {isProfileIncomplete && (
          <div
            onClick={() => navigate('/student/profile')}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:bg-amber-100 transition-all group"
          >
            <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-600">warning</span>
            </div>
            <div className="flex-1">
              <p className="font-black text-amber-800 text-sm uppercase tracking-wide">Complete your profile</p>
              <p className="text-amber-600 text-sm font-medium mt-0.5">Add your department, CGPA, skills and resume link to be visible to recruiters.</p>
            </div>
            <span className="material-symbols-outlined text-amber-500 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { label: 'Applications', value: myApps.length, icon: 'list_alt', bg: 'bg-blue-50', iconClass: 'bg-blue-100 text-blue-600' },
            { label: 'Shortlisted', value: myApps.filter(a => a.status === 'In Process').length, icon: 'schedule', bg: 'bg-amber-50', iconClass: 'bg-amber-100 text-amber-600' },
            { label: 'Selected', value: myApps.filter(a => a.status === 'Selected').length, icon: 'check_circle', bg: 'bg-green-50', iconClass: 'bg-green-100 text-green-600' },
            { label: 'CGPA', value: studentData?.cgpa || '—', icon: 'school', bg: 'bg-purple-50', iconClass: 'bg-purple-100 text-purple-600' },
          ].map(({ label, value, icon, bg, iconClass }) => (
            <div key={label} className={`${bg} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconClass}`}>
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">{value}</h3>
            </div>
          ))}
        </div>

        {/* Two col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Snapshot */}
          {studentData && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Profile Snapshot</h3>
                <button onClick={() => navigate('/student/profile')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                  Edit Profile →
                </button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', value: studentData.name },
                  { label: 'Department', value: studentData.department },
                  { label: 'Year', value: studentData.year_of_study ? `Year ${studentData.year_of_study}` : null },
                  { label: 'CGPA', value: studentData.cgpa },
                  { label: 'Phone', value: studentData.phone },
                  { label: 'Skills', value: studentData.skill_set },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{label}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">{value || <span className="text-gray-300 italic font-normal">Not set</span>}</p>
                  </div>
                ))}
              </div>
              {studentData.resume_link && (
                <div className="px-6 pb-5">
                  <a href={studentData.resume_link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 text-sm font-bold hover:underline">
                    <span className="material-symbols-outlined text-[18px]">description</span>
                    View Resume
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Recent Applications</h3>
              <button onClick={() => navigate('/student/applications')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                View all →
              </button>
            </div>
            {myApps.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <span className="material-symbols-outlined text-gray-200 text-5xl">work_outline</span>
                <p className="text-gray-400 text-sm font-medium mt-2">No applications yet</p>
                <button onClick={() => navigate('/student/opportunities')} className="mt-3 text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">
                  Browse Opportunities →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {myApps.slice(0, 5).map(app => (
                  <div key={app.application_id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/50">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{app.organization_name || 'Company'}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{app.role_title || 'Role'} · Round {app.current_round || 0}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      app.status === 'Selected' ? 'bg-green-100 text-green-700' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      app.status === 'In Process' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
