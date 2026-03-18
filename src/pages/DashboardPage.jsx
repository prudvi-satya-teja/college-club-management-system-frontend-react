import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { clubApi } from '../api/clubApi';
import { eventApi } from '../api/eventApi';
import { BarChart3, Calendar, Users, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';
import './DashboardPage.css';

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const [stats, setStats] = useState({ clubs: 0, events: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubsRes, eventsRes] = await Promise.all([
          clubApi.getAllClubs(),
          eventApi.getAllEvents(null, 0, 100)
        ]);

        setStats({
          clubs: clubsRes.data.content?.length || 0,
          events: eventsRes.data.totalElements || 0
        });

        setRecentEvents(eventsRes.data.content?.slice(0, 5) || []);
      } catch (err) {
        console.error('Dashboard error:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = useCallback(({ icon: Icon, title, value, colorClass }) => (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-info">
        <p className="stat-label">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
      {Icon && <Icon className="stat-icon" />}
    </div>
  ), []);

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.email}</h1>
        <p className="dashboard-role">
          Role: <span className="dashboard-role-badge">{user?.role || 'USER'}</span>
        </p>
      </div>

      <div className="stats-grid">
        <StatCard icon={Users} title="Total Clubs" value={stats.clubs} colorClass="blue" />
        <StatCard icon={Calendar} title="Total Events" value={stats.events} colorClass="green" />
        <StatCard icon={Zap} title="My Registrations" value={0} colorClass="orange" />
        <StatCard icon={TrendingUp} title="My Memberships" value={0} colorClass="purple" />
      </div>

      <div className="events-section">
        <div className="section-header">
          <BarChart3 className="section-icon" />
          <h2 className="section-title">Recent Events</h2>
        </div>

        {recentEvents.length === 0 ? (
          <div className="empty-state">
            <Calendar className="empty-icon" />
            <p className="empty-text">No events found</p>
          </div>
        ) : (
          <div className="events-list">
            {recentEvents.map(event => (
              <Link
                key={event.eventId}
                to={`/events/${event.eventId}`}
                className="event-item"
              >
                <div className="event-content">
                  <div className="event-info">
                    <h3 className="event-name">{event.eventName}</h3>
                    <p className="event-meta">
                      📅 {new Date(event.eventDateTime).toLocaleDateString()} at{' '}
                      {new Date(event.eventDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="event-meta">📍 {event.location}</p>
                    <p className="event-meta">🏢 {event.club?.clubName}</p>
                  </div>
                  {event.image && (
                    <img src={event.image} alt={event.eventName} className="event-image" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link
          to="/events"
          className="view-all-link"
        >
          View All Events <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="action-grid">
        <Link
          to="/clubs"
          className="action-button"
        >
          Browse Clubs
        </Link>
        <Link
          to="/events"
          className="action-button green"
        >
          Find Events
        </Link>
        <Link
          to="/my-registrations"
          className="action-button orange"
        >
          My Registrations
        </Link>
        <Link
          to="/profile"
          className="action-button purple"
        >
          My Profile
        </Link>
      </div>
    </div>
  );
}
