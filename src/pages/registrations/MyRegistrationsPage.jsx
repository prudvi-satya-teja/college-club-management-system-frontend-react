import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { registrationApi } from '../../api/registrationApi';
import { eventApi } from '../../api/eventApi';
import Spinner from '../../components/common/Spinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Calendar, MapPin, Star, MessageSquare, X, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import './MyRegistrationsPage.css';

export default function MyRegistrationsPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [registrations, setRegistrations] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackForm, setFeedbackForm] = useState({
    open: false, registrationId: null, rating: 0, hoverRating: 0, comment: '',
  });
  const [cancelConfirm, setCancelConfirm] = useState({ open: false, registrationId: null });

  useEffect(() => { fetchData(); }, [user?.userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [regRes, eventRes] = await Promise.all([
        registrationApi.getAllRegistrations(null, user?.userId, 0, 10),
        eventApi.getAllEvents(null, 0, 1000),
      ]);
      setRegistrations(regRes.data.data?.filter(r => r.user?.id === user?.userId) || []);
      setAllEvents(eventRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const getEventDetails = eventId => allEvents.find(e => e.eventId === eventId);
  const isEventPast = eventDate => new Date(eventDate) < new Date();

  const closeFeedback = () =>
    setFeedbackForm({ open: false, registrationId: null, rating: 0, hoverRating: 0, comment: '' });

  const handleCancelRegistration = async () => {
    try {
      await registrationApi.deleteRegistration(cancelConfirm.registrationId);
      setRegistrations(prev => prev.filter(r => r.registrationId !== cancelConfirm.registrationId));
      setCancelConfirm({ open: false, registrationId: null });
      toast.success('Registration cancelled');
    } catch (err) {
      toast.error('Failed to cancel registration');
    }
  };

  const handleSubmitFeedback = async () => {
    if (feedbackForm.rating === 0) { toast.error('Please select a rating'); return; }
    try {
      await registrationApi.updateRegistration(feedbackForm.registrationId, feedbackForm.rating, feedbackForm.comment);
      setRegistrations(prev =>
        prev.map(r => r.registrationId === feedbackForm.registrationId
          ? { ...r, rating: feedbackForm.rating, feedback: feedbackForm.comment }
          : r
        )
      );
      closeFeedback();
      toast.success('Feedback submitted!');
    } catch (err) {
      toast.error('Failed to submit feedback');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: '—', month: '—' };
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
  };

  if (loading) return (
    <div className="mrp-root mrp-center"><Spinner size="lg" /></div>
  );

  return (
    <div className="mrp-root">

      {/* ── HEADER ── */}
      <div className="mrp-header">
        <div className="mrp-header-inner">
          <p className="mrp-eyebrow">Account</p>
          <h1 className="mrp-title">My <em>Registrations</em></h1>
          <p className="mrp-subtitle">All events you've signed up for.</p>
        </div>
        <div className="mrp-header-grid" />
        <div className="mrp-header-glow" />
      </div>

      <div className="mrp-body">

        {registrations.length === 0 ? (
          <div className="mrp-empty">
            <Ticket size={32} className="mrp-empty-icon" />
            <p className="mrp-empty-title">No registrations yet</p>
            <p className="mrp-empty-sub">Browse upcoming events and register to see them here.</p>
            <button onClick={() => navigate('/events')} className="mrp-browse-btn">
              Browse Events
            </button>
          </div>
        ) : (
          <div className="mrp-grid">
            {registrations.map(registration => {
              const event = getEventDetails(registration.event?.eventId);
              const isPast = event ? isEventPast(event.eventDateTime) : false;
              const hasFeedback = registration.rating != null && registration.rating !== 0;
              const { day, month, full } = formatDate(event?.eventDateTime);

              return (
                <div key={registration.registrationId} className="mrp-card">

                  
                  <div className="mrp-card-date-strip">
                    <div className="mrp-card-date">
                      <span className="mrp-card-day">{day}</span>
                      <span className="mrp-card-month">{month}</span>
                    </div>
                    <span className={`mrp-status-pill ${isPast ? 'mrp-pill-gray' : 'mrp-pill-green'}`}>
                      {isPast ? 'Past' : 'Upcoming'}
                    </span>
                  </div>

                 
                  {event?.eventImage && (
                    <div className="mrp-card-img-wrap">
                      <img src={event.eventImage} alt={event.eventName} className="mrp-card-img" />
                    </div>
                  )}

                  
                  <div className="mrp-card-body">
                    {event?.club?.clubName && (
                      <span className="mrp-card-club">{event.club.clubName}</span>
                    )}
                    <h3 className="mrp-card-title">{event?.eventName || 'Unknown Event'}</h3>

                    <div className="mrp-card-meta">
                      <span className="mrp-meta-item">
                        <Calendar size={12} />{full}
                      </span>
                      {event?.location && (
                        <span className="mrp-meta-item">
                          <MapPin size={12} />{event.location}
                        </span>
                      )}
                    </div>

                  
                    {isPast && hasFeedback && (
                      <div className="mrp-feedback-display">
                        <div className="mrp-feedback-stars">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={13}
                              className={`mrp-star ${s <= registration.rating ? 'mrp-star-on' : ''}`} />
                          ))}
                          <span className="mrp-feedback-label">Your rating</span>
                        </div>
                        {registration.feedback && (
                          <p className="mrp-feedback-text">"{registration.feedback}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mrp-card-footer">
                    <button
                      onClick={() => navigate(`/events/${event?.eventId}`)}
                      className="mrp-btn-view"
                    >
                      View Event
                    </button>
                    {isPast && !hasFeedback && (
                      <button
                        onClick={() => setFeedbackForm({
                          open: true, registrationId: registration.registrationId,
                          rating: 0, hoverRating: 0, comment: '',
                        })}
                        className="mrp-btn-feedback"
                      >
                        <MessageSquare size={13} /> Feedback
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    
      {feedbackForm.open && (
        <div className="mrp-backdrop" onClick={closeFeedback}>
          <div className="mrp-modal" onClick={e => e.stopPropagation()}>
            <div className="mrp-modal-header">
              <h2 className="mrp-modal-title">Give Feedback</h2>
              <button className="mrp-modal-close" onClick={closeFeedback}><X size={18} /></button>
            </div>

            <div className="mrp-modal-body">
              <div className="mrp-modal-field">
                <label className="mrp-modal-label">How would you rate this event?</label>
                <div className="mrp-modal-stars">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      className="mrp-modal-star-btn"
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: s })}
                      onMouseEnter={() => setFeedbackForm({ ...feedbackForm, hoverRating: s })}
                      onMouseLeave={() => setFeedbackForm({ ...feedbackForm, hoverRating: 0 })}
                    >
                      <Star size={30}
                        className={`mrp-star ${s <= (feedbackForm.hoverRating || feedbackForm.rating) ? 'mrp-star-on' : ''}`} />
                    </button>
                  ))}
                </div>
                {feedbackForm.rating > 0 && (
                  <p className="mrp-modal-hint">
                    {['','Poor','Fair','Good','Great','Excellent!'][feedbackForm.rating]}
                  </p>
                )}
              </div>

              <div className="mrp-modal-field">
                <label className="mrp-modal-label">Your thoughts (optional)</label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                  placeholder="What did you enjoy? What could be improved?"
                  className="mrp-modal-textarea"
                  rows={4}
                />
              </div>
            </div>

            <div className="mrp-modal-footer">
              <button onClick={handleSubmitFeedback} className="mrp-btn-submit">Submit Feedback</button>
              <button onClick={closeFeedback} className="mrp-btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={cancelConfirm.open}
        onClose={() => setCancelConfirm({ open: false, registrationId: null })}
        onConfirm={handleCancelRegistration}
        title="Cancel Registration"
        message="Are you sure you want to cancel your registration for this event?"
      />
    </div>
  );
}