import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import { clubApi } from '../../api/clubApi';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { Calendar, MapPin, ChevronDown, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import './EventsListPage.css';

export default function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedClub, setSelectedClub] = useState('');

  useEffect(() => {
    clubApi.getAllClubs()
      .then(res => setClubs(res.data?.content || res.data || []))
      .catch(() => toast.error('Failed to load clubs'));
  }, []);

  useEffect(() => {
    setLoading(true);
    eventApi.getAllEvents(selectedClub || null, page, 9)
      .then(res => {
        setEvents(res.data.data || res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, [page, selectedClub]);

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: '—', month: '—', time: '—' };
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPast: d < new Date(),
    };
  };

  return (
    <div className="el-root">

      {/* ── PAGE HEADER ── */}
      <div className="el-header">
        <div className="el-header-inner">
          <p className="el-eyebrow">What's happening</p>
          <h1 className="el-title">Campus <em>Events</em></h1>
          <p className="el-subtitle">Register for workshops, hackathons, cultural fests and more across all clubs.</p>
        </div>
        <div className="el-header-bg-grid" />
        <div className="el-header-glow" />
      </div>

      {/* ── FILTER BAR ── */}
      <div className="el-filter-bar">
        <div className="el-filter-inner">
          <div className="el-filter-label">
            <SlidersHorizontal size={14} />
            Filter by club
          </div>
          <div className="el-select-wrap">
            <select
              value={selectedClub}
              onChange={e => { setSelectedClub(e.target.value); setPage(0); }}
              className="el-select"
            >
              <option value="">All Clubs</option>
              {clubs.map(club => (
                <option key={club.clubId} value={club.clubId}>{club.clubName}</option>
              ))}
            </select>
            <ChevronDown size={14} className="el-select-icon" />
          </div>
          {selectedClub && (
            <button className="el-clear-btn" onClick={() => { setSelectedClub(''); setPage(0); }}>
              Clear filter ×
            </button>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="el-body">

        {loading ? (
          <div className="el-loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="el-skeleton" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="el-empty">
            <Calendar size={32} className="el-empty-icon" />
            <p className="el-empty-title">No events found</p>
            <p className="el-empty-sub">Try a different club filter or check back later.</p>
          </div>
        ) : (
          <>
            <div className="el-grid">
              {events.map(event => {
                const { day, month, time, isPast } = formatDate(event.eventDateTime);
                return (
                  <Link key={event.eventId} to={`/events/${event.eventId}`} className="el-card">

                    {/* Date stamp */}
                    <div className="el-card-date">
                      <span className="el-card-day">{day}</span>
                      <span className="el-card-month">{month}</span>
                    </div>

                    {/* Status badge */}
                    <span className={`el-badge ${isPast ? 'el-badge-gray' : 'el-badge-green'}`}>
                      {isPast ? 'Past' : 'Open'}
                    </span>

                    {/* Event image */}
                    {event.eventImage && (
                      <img src={event.eventImage} alt={event.eventName} className="el-card-img" />
                    )}

                    {/* Club name */}
                    {event.club?.clubName && (
                      <span className="el-card-club">{event.club.clubName}</span>
                    )}

                    {/* Event name */}
                    <h3 className="el-card-title">{event.eventName}</h3>

                    {/* Meta info */}
                    <div className="el-card-meta">
                      <span className="el-meta-item">
                        <Calendar size={12} />
                        {time}
                      </span>
                      {event.location && (
                        <span className="el-meta-item">
                          <MapPin size={12} />
                          {event.location}
                        </span>
                      )}
                    </div>

                    {/* Hover arrow */}
                    <div className="el-card-arrow">→</div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="el-pagination">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}