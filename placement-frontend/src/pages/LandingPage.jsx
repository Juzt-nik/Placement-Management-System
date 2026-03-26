import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const teamMembers = [
  { name: 'SAGNIK ROY CHOWDHURY', role: 'Developer', linkedin: 'https://www.linkedin.com/in/s-r-chowdhury/', avatar: '/images/sagnik.png', initials: 'SRC' },
  { name: 'JUSTIN JUBY',          role: 'Developer', linkedin: 'https://www.linkedin.com/in/justinjuby/',    avatar: '/images/justin.png',  initials: 'JJ'  },
  { name: 'FRANKLIN BABU',        role: 'Developer', linkedin: 'https://www.linkedin.com/in/franklin-babu-852022327/', avatar: '/images/franklin.png', initials: 'FB' },
];

const features = [
  { icon: 'school',         title: 'Student Portal',      desc: 'Students can browse opportunities, apply to jobs, track application rounds, and manage their profile all in one place.',         color: '#2563eb' },
  { icon: 'corporate_fare', title: 'Company Management',  desc: 'Placement officers can onboard companies, post job listings, and manage the full recruitment pipeline.',                         color: '#059669' },
  { icon: 'people',         title: 'Faculty Oversight',   desc: 'Faculty and HODs get real-time visibility into student placement progress and department statistics.',                           color: '#d97706' },
  { icon: 'bar_chart',      title: 'Analytics & Reports', desc: 'Detailed placement analytics, internship ratios, CTC breakdowns, and exportable reports for stakeholders.',                     color: '#7c3aed' },
  { icon: 'verified',       title: 'Round Tracking',      desc: 'Track every interview round — aptitude, technical, HR — with live status updates for each student.',                           color: '#dc2626' },
  { icon: 'lock',           title: 'Role-Based Access',   desc: 'Separate secure portals for students, faculty, and placement officers with role-specific dashboards.',                         color: '#0891b2' },
];

const stats = [
  { value: '3',    label: 'User Roles'   },
  { value: '6+',   label: 'Core Modules' },
  { value: '100%', label: 'Cloud-Ready'  },
  { value: 'REST', label: 'API Powered'  },
];

function useIntersection(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return visible;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled]     = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hv = (delay) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", background: '#FAFAF8', color: '#111', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .serif { font-family: 'DM Serif Display', Georgia, serif; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 13px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: white; }
        .feature-card { background: white; border: 1px solid rgba(0,0,0,0.07); border-radius: 18px; padding: 28px; transition: transform 0.25s, box-shadow 0.25s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.07); }
        .portal-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 32px 24px; text-align: center; text-decoration: none; display: block; transition: all 0.25s; }
        .team-card { background: white; border: 1px solid rgba(0,0,0,0.07); border-radius: 18px; padding: 32px 20px; text-align: center; transition: all 0.25s; text-decoration: none; display: block; }
        .team-card:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,0.09); border-color: #2563eb; }
        .section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #059669; display: block; margin-bottom: 14px; }
        .marquee-wrap { overflow: hidden; border-top: 1px solid rgba(0,0,0,0.08); border-bottom: 1px solid rgba(0,0,0,0.08); padding: 14px 0; background: white; }
        .marquee-track { display: flex; gap: 40px; animation: marquee 22s linear infinite; width: max-content; }
        .marquee-item { font-size: 11px; font-weight: 700; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; }
        .marquee-dot { color: #059669; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        @media (max-width:600px) { .stat-grid { grid-template-columns: repeat(2,1fr); } }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        @media (max-width:768px) { .about-grid { grid-template-columns: 1fr; gap: 40px; } }
        .portal-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media (max-width:640px) { .portal-grid { grid-template-columns: 1fr; } }
        .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 24px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap: 20px; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: scrolled ? 'rgba(12,26,46,0.96)' : 'transparent', backdropFilter: scrolled ? 'blur(14px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'white', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: 20 }}>school</span>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', lineHeight: 1 }}>SRM</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Placement Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#team" className="nav-link">Team</a>
          <Link to="/login" style={{ background: 'white', color: '#111', padding: '8px 22px', borderRadius: 100, textDecoration: 'none', fontWeight: 700, fontSize: 13, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#111'; }}
          >Login →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(160deg, #0c1a2e 0%, #0d2a40 55%, #0c1f14 100%)', position: 'relative', overflow: 'hidden', padding: '100px 40px 80px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '56px 56px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ ...hv(0.05), display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 100, padding: '6px 16px', marginBottom: 36 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#6ee7b7', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>SRM Institute of Science and Technology</span>
          </div>

          {/* Headline */}
          <h1 className="serif" style={{ ...hv(0.18), fontSize: 'clamp(3.4rem, 9vw, 7.5rem)', fontWeight: 400, lineHeight: 0.95, color: 'white', letterSpacing: '-0.02em', marginBottom: 32 }}>
            Campus<br />
            Placement<br />
            <em style={{ color: '#34d399', fontStyle: 'italic' }}>Reimagined.</em>
          </h1>

          <p style={{ ...hv(0.3), color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.75, maxWidth: 500, fontWeight: 300, marginBottom: 44 }}>
            Havloc is a full-stack placement management system built for SRM — connecting students, faculty, and placement officers in one unified platform.
          </p>

          <div style={{ ...hv(0.42), display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/login"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FAFAF8', color: '#111', padding: '14px 32px', borderRadius: 100, textDecoration: 'none', fontWeight: 700, fontSize: 15, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FAFAF8'; e.currentTarget.style.color = '#111'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span>
              Enter Portal
            </Link>
            <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', padding: '13px 28px', borderRadius: 100, textDecoration: 'none', fontWeight: 500, fontSize: 14, border: '1px solid rgba(255,255,255,0.12)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              Explore Features
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>expand_more</span>
            </a>
          </div>


        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {['Student Portal','·','Company Management','·','Faculty Oversight','·','Round Tracker','·','Analytics','·','REST API','·','Role-Based Access','·','Placement Records',
            'Student Portal','·','Company Management','·','Faculty Oversight','·','Round Tracker','·','Analytics','·','REST API','·','Role-Based Access','·','Placement Records'].map((item, i) => (
            <span key={i} className={item === '·' ? 'marquee-item marquee-dot' : 'marquee-item'}>{item}</span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section style={{ padding: '100px 40px', background: '#FAFAF8' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <div className="about-grid">
              <div>
                <span className="section-label">About the Project</span>
                <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
                  One platform for the entire placement lifecycle
                </h2>
                <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 15, fontWeight: 300, marginBottom: 14 }}>
                  Havloc (Highly Automated Virtual Liaison for Opportunities and Campus) was developed as a B.Tech DBMS project at SRM Institute of Science and Technology to solve the fragmented, manual processes in campus placement.
                </p>
                <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 15, fontWeight: 300, marginBottom: 28 }}>
                  From job listings and student applications to round-by-round tracking and placement analytics — everything is centralized, real-time, and role-aware.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['React.js','Node.js','PostgreSQL','REST API','Tailwind CSS'].map(t => (
                    <span key={t} style={{ background: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, border: '1px solid rgba(0,0,0,0.06)' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { icon: 'rocket_launch',             label: 'Built from scratch', sub: 'No templates used'       },
                  { icon: 'devices',                   label: 'Fully Responsive',   sub: 'Desktop & mobile ready'  },
                  { icon: 'security',                  label: 'JWT Auth',           sub: 'Secure role-based access' },
                  { icon: 'integration_instructions',  label: 'API-First',          sub: 'Clean REST architecture' },
                ].map((c, i) => (
                  <div key={i} style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16, padding: '22px 18px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#2563eb', fontSize: 26, marginBottom: 10, display: 'block' }}>{c.icon}</span>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#111', marginBottom: 3 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 40px', background: 'white' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <Reveal>
            <div style={{ marginBottom: 56 }}>
              <span className="section-label">Features</span>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 460 }}>
                Everything placement <em style={{ fontStyle: 'italic', color: '#059669' }}>needs.</em>
              </h2>
            </div>
          </Reveal>
          <div className="features-grid">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="feature-card">
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: f.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <span className="material-symbols-outlined" style={{ color: f.color, fontSize: 24 }}>{f.icon}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, letterSpacing: '-0.01em', color: '#111' }}>{f.title}</h3>
                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section style={{ padding: '100px 40px', background: '#0c1a2e', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '56px 56px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <span className="section-label" style={{ color: '#6ee7b7' }}>Three Portals</span>
            <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: 'white', letterSpacing: '-0.02em', marginBottom: 48 }}>
              One system, every <em style={{ fontStyle: 'italic', color: '#34d399' }}>stakeholder.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="portal-grid">
              {[
                { icon: 'school',    label: 'Student',           color: '#3b82f6', desc: 'Apply, track rounds, manage profile' },
                { icon: 'menu_book', label: 'Faculty / HOD',     color: '#8b5cf6', desc: 'Monitor students, view reports' },
                { icon: 'badge',     label: 'Placement Officer', color: '#10b981', desc: 'Manage companies, jobs, placements' },
              ].map((p, i) => (
                <Link key={i} to="/login" className="portal-card"
                  onMouseEnter={e => { e.currentTarget.style.background = p.color + '18'; e.currentTarget.style.borderColor = p.color + '55'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: p.color + '1e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <span className="material-symbols-outlined" style={{ color: p.color, fontSize: 26 }}>{p.icon}</span>
                  </div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{p.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 300, marginBottom: 18 }}>{p.desc}</div>
                  <div style={{ color: p.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Login <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" style={{ padding: '100px 40px', background: '#FAFAF8' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <span className="section-label">The Team</span>
            <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Built by students,<br /><em style={{ fontStyle: 'italic', color: '#059669' }}>for students.</em>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 400, marginBottom: 52 }}>SRM Institute of Science and Technology · B.Tech DBMS Project</p>
          </Reveal>
          <div className="team-grid">
            {teamMembers.map((m, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="team-card">
                  <img src={m.avatar} alt={m.name}
                    style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 18px', display: 'block', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                    onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                  />
                  <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #059669)', display: 'none', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: 'white', fontWeight: 800, fontSize: 22 }}>
                    {m.initials}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4, letterSpacing: '-0.01em' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, marginBottom: 18 }}>{m.role}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', color: '#1d4ed8', padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 40px 100px', background: '#FAFAF8' }}>
        <Reveal>
          <div style={{ maxWidth: 1080, margin: '0 auto', background: '#111', borderRadius: 22, padding: '64px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#FAFAF8', fontWeight: 400, lineHeight: 1.1, marginBottom: 10 }}>
                Ready to get <em style={{ color: '#34d399', fontStyle: 'italic' }}>placed?</em>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 300 }}>Sign in with your credentials to access your portal.</p>
            </div>
            <Link to="/login"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FAFAF8', color: '#111', padding: '16px 36px', borderRadius: 100, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#34d399'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FAFAF8'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Enter Portal →</Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0c1a2e', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: 'white', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#1e3a8a', fontSize: 17 }}>school</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em' }}>SRM</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 1 }}>Placement Portal</div>
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 400 }}>Built with ❤️ by SRM Students · DBMS Project 2026</div>
          <Link to="/login"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: 100, textDecoration: 'none', fontWeight: 600, fontSize: 13, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >Login to Portal →</Link>
        </div>
      </footer>
    </div>
  );
}