import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { clubApi } from '../api/clubApi';
import { eventApi } from '../api/eventApi';
import { Users, Calendar, ArrowUpRight, ChevronRight, Star, Zap, Shield } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/common/Footer';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    clubApi.getAllClubs()
  .then(res => setClubs((res.data.content || res.data || []).slice(0, 4)))
  .catch(() => setClubs([]))
  .finally(() => setLoadingClubs(false));

    eventApi.getAllEvents(null, 0, 3)
      .then(res => setEvents(res.data.content || res.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('en-US', { month: 'short' }),
    };
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avatarColors = [
    '#c9a84c', '#4a6cf7', '#34c77b', '#e05a5a',
    '#9b59b6', '#e67e22', '#1abc9c',
  ];
  const getColor = (str = '') =>
    avatarColors[str.charCodeAt(0) % avatarColors.length];

  return (
    <div className="home-root">
      <Navbar variant="dark" />

      <section className="home-hero">
        <div className="home-hero-bg">
          <div className="home-hero-grid" />
          <div className="home-hero-glow" />
          <div className="home-hero-glow2" />
        </div>
        <div className="home-hero-content">
          <div className="home-eyebrow">
            <span className="home-eyebrow-dot" />
            Your College Campus, Organised
          </div>
          <h1 className="home-h1">
            Every Club.<br />Every Event.<em> One Place.</em>
          </h1>
          <p className="home-hero-desc">
            AClub brings your campus community together — discover clubs,
            manage memberships, register for events, and collaborate seamlessly.
          </p>
          <div className="home-hero-actions">
            <button className="home-btn-gold home-btn-lg" onClick={() => navigate(isAuthenticated ? '/clubs' : '/signup')}>
              Explore Clubs
            </button>
            <button className="home-btn-outline home-btn-lg" onClick={() => navigate(isAuthenticated ? '/events' : '/login')}>
              Browse Events
            </button>
          </div>
        </div>

<div className="home-hero-card-wrap">
  <div className="home-hero-card">
    {clubs[0] ? (
      <div className="home-hero-card-header">
        {clubs[0].clubImage ? (
          <img src={clubs[0].clubImage} alt={clubs[0].clubName} className="home-hero-card-avatar-img" />
        ) : (
          <div className="home-hero-card-avatar"
            style={{ background: `${getColor(clubs[0].clubName)}22`, color: getColor(clubs[0].clubName) }}>
            {getInitials(clubs[0].clubName)}
          </div>
        )}
        <div>
          <div className="home-hero-card-name">{clubs[0].clubName}</div>
          <div className="home-hero-card-meta">Active</div>
        </div>
        <span className="home-live-dot" />
      </div>
    ) : (
      <div className="home-hero-card-header">
        <div className="home-hero-card-avatar" style={{ background: 'rgba(201,168,76,0.22)', color: '#c9a84c' }}>--</div>
        <div>
          <div className="home-hero-card-name">Loading...</div>
          <div className="home-hero-card-meta">—</div>
        </div>
      </div>
    )}
    <div className="home-hero-card-event">
      <span className="home-hero-card-event-label">Next Event</span>
      {events[0]
        ? `${events[0].eventName} — ${new Date(events[0].eventDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : 'No upcoming events'}
    </div>
  </div>

  <div className="home-hero-card home-hero-card-sm">
    {events[1] ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="home-hero-card-avatar"
          style={{ background: 'rgba(74,108,247,0.18)', color: '#7a9af7', fontSize: '1rem' }}>
          <Calendar size={16} />
        </div>
        <div>
          <div className="home-hero-card-name">{events[1].eventName}</div>
          <div className="home-hero-card-meta">
            {events[1].club?.clubName && `${events[1].club.clubName} · `}
            {new Date(events[1].eventDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="home-hero-card-avatar"
          style={{ background: 'rgba(74,108,247,0.18)', color: '#7a9af7', fontSize: '1rem' }}>
          <Calendar size={16} />
        </div>
        <div>
          <div className="home-hero-card-name">No events</div>
          <div className="home-hero-card-meta">Check back soon</div>
        </div>
      </div>
    )}
    <span className="home-badge home-badge-blue">
      {events[1] ? (new Date(events[1].eventDateTime) > new Date() ? 'Open' : 'Past') : '—'}
    </span>
  </div>
</div>
      </section>

      <div className="home-stats-strip">
        {[
          { num: '24+', label: 'Active Clubs' },
          { num: '1,200+', label: 'Students' },
          { num: '180+', label: 'Events Hosted' },
          { num: '98%', label: 'Satisfaction Rate' },
        ].map(s => (
          <div className="home-stat-cell" key={s.label}>
            <div className="home-stat-num">{s.num}</div>
            <div className="home-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="home-section">
        <div className="home-section-inner">
          <p className="home-section-tag">Everything you need</p>
          <h2 className="home-section-title">Built for <em>campus life</em></h2>
          <p className="home-section-sub">
            From club discovery to event management — a complete system for students and administrators.
          </p>
          <div className="home-bento">
            <div className="home-bento-cell home-bento-wide">
              <div className="home-cell-icon home-icon-blue"><Users size={18} /></div>
              <div className="home-cell-title">Club Directory</div>
              <div className="home-cell-desc">Browse every active club on campus. Filter by category, membership size, or activity. Join with a single click.</div>
              <span className="home-cell-tag home-tag-blue">Core Feature</span>
              <span className="home-cell-bg-num">01</span>
            </div>
            <div className="home-bento-cell home-bento-narrow">
              <div className="home-cell-icon home-icon-gold"><Calendar size={18} /></div>
              <div className="home-cell-title">Event Calendar</div>
              <div className="home-cell-desc">Club admins post events, students register, and everyone gets notified in real time.</div>
              <span className="home-cell-tag home-tag-gold">Live Now</span>
              <span className="home-cell-bg-num">02</span>
            </div>
            <div className="home-bento-cell home-bento-third">
              <div className="home-cell-icon home-icon-green"><Shield size={18} /></div>
              <div className="home-cell-title">Member Roles</div>
              <div className="home-cell-desc">Assign admins, members with fine-grained permissions per club.</div>
              <span className="home-cell-tag home-tag-green">RBAC</span>
            </div>
            <div className="home-bento-cell home-bento-third">
              <div className="home-cell-icon home-icon-blue"><Zap size={18} /></div>
              <div className="home-cell-title">Smart Search</div>
              <div className="home-cell-desc">Find clubs by name, code, or activity type instantly across the whole platform.</div>
              <span className="home-cell-tag home-tag-blue">Fast</span>
            </div>
            <div className="home-bento-cell home-bento-third">
              <div className="home-cell-icon home-icon-gold"><Star size={18} /></div>
              <div className="home-cell-title">Ratings &amp; Feedback</div>
              <div className="home-cell-desc">Rate events after attending. Share feedback and help clubs improve.</div>
              <span className="home-cell-tag home-tag-gold">Students</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="home-section-inner">
          <p className="home-section-tag">Trending on campus</p>
          <h2 className="home-section-title">Popular <em>clubs</em></h2>

          {loadingClubs ? (
  <div className="home-loading-row">
    {[0, 1, 2, 3].map(i => <div key={i} className="home-skeleton home-skeleton-club" />)}
  </div>
) : clubs.length === 0 ? (
  <div className="home-empty">No clubs yet.</div>
) : (
  <div className="home-clubs-grid">
    {clubs.map(club => (
      <Link
        key={club.clubId}
        to={`/clubs/${club.clubId}`}
        className="home-club-card"
      >
        <ArrowUpRight size={16} className="home-club-arrow" />
        {club.clubImage ? (
          <img src={club.clubImage} alt={club.clubName} className="home-club-img" />
        ) : (
          <div
            className="home-club-avatar"
            style={{ background: `${getColor(club.clubName)}22`, color: getColor(club.clubName) }}
          >
            {getInitials(club.clubName)}
          </div>
        )}
        <div className="home-club-name">{club.clubName}</div>
        <div className="home-club-code">{club.clubCode}</div>
        <div className="home-club-footer">
          <span className="home-live-dot" style={{ width: 6, height: 6 }} />
          <span>Active</span>
        </div>
      </Link>
    ))}
    <Link to="/clubs" className="home-club-card home-club-card-more">
      <ArrowUpRight size={16} className="home-club-arrow" />
      <div className="home-club-avatar" style={{ border: '1px dashed #2e3142', background: 'transparent', color: '#7a7e8f' }}>
        +
      </div>
      <div className="home-club-name" style={{ color: '#7a7e8f' }}>View all clubs</div>
      <div className="home-club-code">Browse full directory →</div>
    </Link>
  </div>
)}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-inner">
          <p className="home-section-tag">Simple to start</p>
          <h2 className="home-section-title">Three steps to <em>get started</em></h2>
          <div className="home-steps">
            {[
              { num: '01', title: 'Create your account', desc: 'Sign up with your college email. Your profile is linked to your roll number automatically.' },
              { num: '02', title: 'Join or create a club', desc: 'Browse available clubs and join with a code, or request to start your own and become an admin.' },
              { num: '03', title: 'Attend & engage', desc: 'Register for events, track your participation, and connect with members across your campus.' },
            ].map((step, i) => (
              <div className="home-step" key={step.num} style={{ paddingLeft: i > 0 ? '2rem' : 0 }}>
                <div className="home-step-num">{step.num}</div>
                <div className="home-step-title">{step.title}</div>
                <div className="home-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="home-section-inner">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p className="home-section-tag">What's happening</p>
              <h2 className="home-section-title" style={{ marginBottom: 0 }}>Upcoming <em>events</em></h2>
            </div>
            <Link to="/events" className="home-view-all">
              View all events <ChevronRight size={14} />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="home-events-list">
              {[0, 1, 2].map(i => <div key={i} className="home-skeleton home-skeleton-event" />)}
            </div>
          ) : events.length === 0 ? (
            <div className="home-empty">No upcoming events yet.</div>
          ) : (
            <div className="home-events-list">
              {events.map(event => {
                const { day, month } = formatDate(event.eventDateTime);
                const isPast = new Date(event.eventDateTime) < new Date();
                return (
                  <Link key={event.eventId} to={`/events/${event.eventId}`} className="home-event-row">
                    <div className="home-event-date">
                      <div className="home-event-day">{day}</div>
                      <div className="home-event-month">{month}</div>
                    </div>
                    <div className="home-event-info">
                      <div className="home-event-name">{event.eventName}</div>
                      <div className="home-event-sub">
                        {event.club?.clubName && <span>{event.club.clubName}</span>}
                        {event.location && <span> · {event.location}</span>}
                        {event.mainTheme && <span> · {event.mainTheme}</span>}
                      </div>
                    </div>
                    <span className={`home-badge ${isPast ? 'home-badge-gray' : 'home-badge-green'}`}>
                      {isPast ? 'Past' : 'Open'}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-inner">
          <div className="home-cta-banner">
            <div className="home-cta-glow" />
            <h2 className="home-cta-title">
              Ready to find<br />your <em>community?</em>
            </h2>
            <p className="home-cta-sub">
              Join 1,200+ students already using AClub on campus.
            </p>
            <div className="home-cta-actions">
              {isAuthenticated ? (
                <button className="home-btn-gold home-btn-lg" onClick={() => navigate('/clubs')}>
                  Go to Clubs
                </button>
              ) : (
                <>
                  <button className="home-btn-gold home-btn-lg" onClick={() => navigate('/signup')}>
                    Join Now — It's Free
                  </button>
                  <button className="home-btn-outline home-btn-lg" onClick={() => navigate('/login')}>
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer className="footer-dark" />
    </div>
  );
}