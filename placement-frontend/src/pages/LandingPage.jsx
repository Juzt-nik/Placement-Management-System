import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const teamMembers = [
  {
    name: 'SAGNIK ROY CHOWDHURY',
    role: 'Full Stack Developer',
    linkedin: 'https://www.linkedin.com/in/s-r-chowdhury/',
    avatar: '/images/sagnik.png',
    initials: 'SG',
  },
  {
    name: 'JUSTIN JUBY',
    role: 'Frontend Developer',
    linkedin: 'https://www.linkedin.com/in/justinjuby/',
    avatar: '/images/justin.png',
    initials: 'JJ',
  },
  {
    name: 'FRANKLIN BABU',
    role: 'Backend Developer',
    linkedin: 'https://www.linkedin.com/in/franklin-babu-852022327/',
    avatar: '/images/franklin.png',
    initials: 'FB',
  },
  
];

const features = [
  { icon: 'school', title: 'Student Portal', desc: 'Students can browse opportunities, apply to jobs, track application rounds, and manage their profile all in one place.', color: '#3b82f6' },
  { icon: 'corporate_fare', title: 'Company Management', desc: 'Placement officers can onboard companies, post job listings, and manage the full recruitment pipeline.', color: '#10b981' },
  { icon: 'people', title: 'Faculty Oversight', desc: 'Faculty and HODs get real-time visibility into student placement progress and department statistics.', color: '#f59e0b' },
  { icon: 'bar_chart', title: 'Analytics & Reports', desc: 'Detailed placement analytics, internship ratios, CTC breakdowns, and exportable reports for stakeholders.', color: '#8b5cf6' },
  { icon: 'verified', title: 'Round Tracking', desc: 'Track every interview round — aptitude, technical, HR — with live status updates for each student.', color: '#ef4444' },
  { icon: 'lock', title: 'Role-Based Access', desc: 'Separate secure portals for students, faculty, and placement officers with role-specific dashboards.', color: '#06b6d4' },
];

const stats = [
  { value: '3', label: 'User Roles', icon: 'group' },
  { value: '6+', label: 'Core Modules', icon: 'dashboard' },
  { value: '100%', label: 'Cloud-Ready', icon: 'cloud' },
  { value: 'REST', label: 'API Powered', icon: 'api' },
];

function useIntersection(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return visible;
}

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8fafc', color: '#0f172a', overflowX: 'hidden' }}>
      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(12,26,46,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 2rem',
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 38, height: 38, background: 'white', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: 22 }}>school</span>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 900, fontSize: 14, letterSpacing: '0.05em', lineHeight: 1 }}>SRM HAVLOC</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Placement Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Features</a>
          <a href="#team" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Team</a>
          <Link to="/login" style={{
            background: '#3b82f6', color: 'white', padding: '9px 22px', borderRadius: 10,
            textDecoration: 'none', fontWeight: 900, fontSize: 13, letterSpacing: '0.05em',
            boxShadow: '0 4px 14px rgba(59,130,246,0.4)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
          >
            Login →
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0c1a2e 0%, #0f2848 50%, #0c1a2e 100%)',
        position: 'relative', overflow: 'hidden', padding: '80px 2rem 60px',
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.3,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#93c5fd', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>SRM Institute Of Science And Technology</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 900, color: 'white',
            lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 28,
          }}>
            Campus Placement<br />
            <span style={{ background: 'linear-gradient(90deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Reimagined.
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 48px', fontWeight: 500 }}>
            Havloc is a full-stack placement management system built for SRM — connecting students, faculty, and placement officers in one unified platform.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{
              background: '#3b82f6', color: 'white', padding: '16px 36px', borderRadius: 14,
              textDecoration: 'none', fontWeight: 900, fontSize: 15, letterSpacing: '0.05em',
              boxShadow: '0 8px 24px rgba(59,130,246,0.35)', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span>
              Enter Portal
            </Link>
            <a href="#features" style={{
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', padding: '16px 36px', borderRadius: 14,
              textDecoration: 'none', fontWeight: 700, fontSize: 15, border: '1px solid rgba(255,255,255,0.12)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Explore Features
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>expand_more</span>
            </a>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 72, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 12px', textAlign: 'center' }}>
                <div style={{ color: '#3b82f6', fontSize: 22, fontWeight: 900 }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section style={{ padding: '100px 2rem', background: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '4px 14px', borderRadius: 100, fontSize: 11, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>About the Project</div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 20 }}>
                  One platform for the entire placement lifecycle
                </h2>
                <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
                  Havloc (Highly Automated Virtual Liaison for Opportunities and Campus) was developed as a B.Tech DBMS project at SRM Institute of Science and Technology to solve the fragmented, manual processes in campus placement.
                </p>
                <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 15 }}>
                  From job listings and student applications to round-by-round tracking and placement analytics — everything is centralized, real-time, and role-aware.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                  {['React.js', 'Node.js', 'PostgreSQL', 'REST API', 'Tailwind CSS'].map(t => (
                    <span key={t} style={{ background: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { icon: 'rocket_launch', label: 'Built from scratch', sub: 'No templates used' },
                  { icon: 'devices', label: 'Fully Responsive', sub: 'Desktop & mobile ready' },
                  { icon: 'security', label: 'JWT Auth', sub: 'Secure role-based access' },
                  { icon: 'integration_instructions', label: 'API-First', sub: 'Clean REST architecture' },
                ].map((c, i) => (
                  <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 16px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: 28, marginBottom: 10, display: 'block' }}>{c.icon}</span>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, fontWeight: 500 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ padding: '100px 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <AnimatedSection style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '4px 14px', borderRadius: 100, fontSize: 11, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Features</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>Everything placement needs</h2>
            <p style={{ color: '#64748b', fontSize: 15, maxWidth: 500, margin: '12px auto 0' }}>Designed to handle the complete placement process for students, faculty, and officers.</p>
          </AnimatedSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <AnimatedSection key={i}>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: 28, height: '100%', transition: 'all 0.2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <span className="material-symbols-outlined" style={{ color: f.color, fontSize: 26 }}>{f.icon}</span>
                  </div>
                  <h3 style={{ fontWeight: 900, fontSize: 16, marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</h3>
                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PORTALS ─── */}
      <section style={{ padding: '100px 2rem', background: '#0c1a2e', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <AnimatedSection>
            <div style={{ display: 'inline-block', background: 'rgba(59,130,246,0.15)', color: '#93c5fd', padding: '4px 14px', borderRadius: 100, fontSize: 11, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20, border: '1px solid rgba(59,130,246,0.2)' }}>Three Portals</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 48 }}>One system, every stakeholder</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { icon: 'school', label: 'Student', color: '#3b82f6', desc: 'Apply, track rounds, manage profile', path: '/login' },
                { icon: 'menu_book', label: 'Faculty / HOD', color: '#8b5cf6', desc: 'Monitor students, view reports', path: '/login' },
                { icon: 'badge', label: 'Placement Officer', color: '#10b981', desc: 'Manage companies, jobs, placements', path: '/login' },
              ].map((p, i) => (
                <Link key={i} to={p.path} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${p.color}30`, borderRadius: 20, padding: 28, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = p.color + '15'; e.currentTarget.style.borderColor = p.color + '60'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = p.color + '30'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: p.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <span className="material-symbols-outlined" style={{ color: p.color, fontSize: 28 }}>{p.icon}</span>
                    </div>
                    <div style={{ color: 'white', fontWeight: 900, fontSize: 15, marginBottom: 8 }}>{p.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500 }}>{p.desc}</div>
                    <div style={{ color: p.color, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      Login <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section id="team" style={{ padding: '100px 2rem', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', padding: '4px 14px', borderRadius: 100, fontSize: 11, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>The Team</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>Built by students, for students</h2>
              <p style={{ color: '#64748b', fontSize: 15, maxWidth: 460, margin: '12px auto 0' }}>SRM Institute of Science and Technology · B.Tech DBMS Project</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              {teamMembers.map((m, i) => (
                <a key={i} href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '28px 20px', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    {/* Avatar */}
                    <img src={m.avatar} alt={m.name} style={{width: 130,height:130,borderRadius: '50%',objectFit: 'cover',margin: '0 auto 20px',display: 'block',boxShadow: '0 10px 30px rgba(0,0,0,0.15)',imageRendering: 'auto'
                        }}/>
                    <div style={{ fontWeight: 900, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 16 }}>{m.role}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#1d4ed8', padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 800 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#0c1a2e', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: 18 }}>school</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>SRM HAVLOC</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Placement Portal</div>
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 500 }}>
            Built with ❤️ by SRM Students · DBMS Project 2025
          </div>
          <Link to="/login" style={{ background: '#3b82f6', color: 'white', padding: '9px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 800, fontSize: 12 }}>
            Login to Portal →
          </Link>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}
