import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { eventApi } from '../../api/eventApi';
import { registrationApi } from '../../api/registrationApi';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import { ArrowLeft, Calendar, MapPin, Star, User, MessageSquare, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import './EventDetailPage.css';

export default function EventDetailPage() {
  const { id } = useParams();
  const user = useAuthStore(state => state.user);
  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [feedbackPage, setFeedbackPage] = useState(0);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

  const fetchEventAndData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const eventRes = await eventApi.getEventById(id);
      setEvent(eventRes.data);
      const regsRes = await registrationApi.getAllRegistrations(id, null, 0, 100);
      const userReg = regsRes.data.data?.find(r => r.user?.id === user?.userId);
      if (userReg) { setIsRegistered(true); setRegistrationId(userReg.registrationId); }
    } catch (err) {
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [id, user?.userId]);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await registrationApi.getFeedbacks(id, feedbackPage, 5);
      const feedbackData = res.data.data || [];
      setFeedbacks(feedbackData);
      setFeedbackTotalPages(res.data.totalPages || 0);
      if (user?.userId && registrationId) {
        const userFeedback = feedbackData.find(
          f => f.registrationId === registrationId && f.rating != null
        );
        if (userFeedback) setHasSubmittedFeedback(true);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    }
  }, [id, feedbackPage, registrationId, user?.userId]);

  useEffect(() => { fetchEventAndData(); }, [fetchEventAndData]);
  useEffect(() => { if (event) fetchFeedbacks(); }, [feedbackPage, event, id, fetchFeedbacks]);

  const handleRegister = async () => {
    try {
      await registrationApi.createRegistration(id, user.userId);
      setIsRegistered(true);
      toast.success('Registered successfully!');
      fetchEventAndData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!rating) { toast.error('Please select a rating'); return; }
    try {
      setSubmitting(true);
      await registrationApi.submitFeedback(registrationId, { rating, message });
      toast.success('Feedback submitted!');
      setRating(0); setMessage(''); setHasSubmittedFeedback(true);
      fetchFeedbacks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const isEventPast = event && new Date(event.eventDateTime) < new Date();
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
    : null;

  const avatarColors = ['#c9a84c','#4a6cf7','#34c77b','#e05a5a','#9b59b6','#e67e22','#1abc9c'];
  const getColor = (str = '') => avatarColors[str.charCodeAt(0) % avatarColors.length];

  if (loading) return (
    <div className="edp-root edp-center"><Spinner size="lg" /></div>
  );

  if (!event) return (
    <div className="edp-root">
      <Link to="/events" className="edp-back"><ArrowLeft size={15} /> Back to Events</Link>
      <p className="edp-not-found">Event not found.</p>
    </div>
  );

  return (
    <div className="edp-root">

  
      <div className="edp-topbar">
        <Link to="/events" className="edp-back"><ArrowLeft size={15} /> Back to Events</Link>
        <span className={`edp-status-pill ${isEventPast ? 'edp-pill-gray' : 'edp-pill-green'}`}>
          {isEventPast ? 'Past Event' : 'Open'}
        </span>
      </div>

    
      <div className="edp-hero">
        <div className="edp-hero-bg-grid" />
        <div className="edp-hero-glow" />

        {event.eventImage && (
          <div className="edp-hero-img-wrap">
            <img src={event.eventImage} alt={event.eventName} className="edp-hero-img" />
            <div className="edp-hero-img-fade" />
          </div>
        )}

        <div className="edp-hero-body">
          {event.club?.clubName && (
            <span className="edp-club-tag">{event.club.clubName}</span>
          )}
          <h1 className="edp-title">{event.eventName}</h1>
          {event.mainTheme && (
            <span className="edp-theme-tag">{event.mainTheme}</span>
          )}

          <div className="edp-meta-row">
            <div className="edp-meta-item">
              <Calendar size={14} className="edp-meta-icon" />
              <div>
                <span className="edp-meta-label">Date & Time</span>
                <span className="edp-meta-value">
                  {new Date(event.eventDateTime).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })} · {new Date(event.eventDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            {event.location && (
              <div className="edp-meta-item">
                <MapPin size={14} className="edp-meta-icon" />
                <div>
                  <span className="edp-meta-label">Location</span>
                  <span className="edp-meta-value">{event.location}</span>
                </div>
              </div>
            )}
            {event.guest && (
              <div className="edp-meta-item">
                <Mic size={14} className="edp-meta-icon" />
                <div>
                  <span className="edp-meta-label">Guest Speaker</span>
                  <span className="edp-meta-value">{event.guest}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className="edp-grid">

       
        <div className="edp-col-main">

          
          {event.details && (
            <div className="edp-card">
              <h2 className="edp-section-title">About this event</h2>
              <p className="edp-about-text">{event.details}</p>
            </div>
          )}

          
          {isRegistered && !hasSubmittedFeedback && (
            <div className="edp-card">
              <h2 className="edp-section-title">
                <MessageSquare size={16} /> Share your feedback
              </h2>

              <p className="edp-rating-label">How would you rate this event?</p>
              <div className="edp-stars-row">
                {[1,2,3,4,5].map(i => (
                  <button
                    key={i}
                    className="edp-star-btn"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={28}
                      className={`edp-star ${i <= (hoverRating || rating) ? 'edp-star-on' : ''}`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="edp-rating-word">
                    {['','Poor','Fair','Good','Great','Excellent!'][rating]}
                  </span>
                )}
              </div>

              <label className="edp-textarea-label">Your thoughts (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What did you enjoy? What could be improved?"
                className="edp-textarea"
                rows={4}
              />

              <button onClick={handleSubmitFeedback} disabled={submitting} className="edp-submit-btn">
                {submitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
            </div>
          )}

          {isRegistered && hasSubmittedFeedback && (
            <div className="edp-card edp-submitted-card">
              <Star size={18} className="edp-submitted-star" />
              <div>
                <p className="edp-submitted-title">Feedback submitted</p>
                <p className="edp-submitted-sub">Thank you for sharing your thoughts!</p>
              </div>
            </div>
          )}

          {feedbacks.length > 0 && (
            <div className="edp-card">
              <div className="edp-reviews-header">
                <h2 className="edp-section-title" style={{ margin: 0 }}>
                  <Star size={16} className="edp-title-star" /> Reviews
                </h2>
                
              </div>

              <div className="edp-reviews-list">
                {feedbacks.map(feedback => (
                  <div key={feedback.registrationId} className="edp-review">
                    <div
                      className="edp-review-avatar"
                      style={{
                        background: `${getColor(feedback.user?.name || 'A')}22`,
                        color: getColor(feedback.user?.name || 'A'),
                      }}
                    >
                      {(feedback.user?.name || 'A')[0].toUpperCase()}
                    </div>
                    <div className="edp-review-body">
                      <div className="edp-review-top">
                        <span className="edp-review-name">{feedback.user?.name || 'Anonymous'}</span>
                        <span className="edp-review-date">
                          {new Date(feedback.updatedAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="edp-review-stars">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={12}
                            className={`edp-star ${i <= feedback.rating ? 'edp-star-on' : ''}`} />
                        ))}
                      </div>
                      {feedback.feedback && (
                        <p className="edp-review-text">{feedback.feedback}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {feedbackTotalPages > 1 && (
                <div className="edp-pagination">
                  <Pagination page={feedbackPage} totalPages={feedbackTotalPages} onPageChange={setFeedbackPage} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="edp-col-side">
          <div className="edp-card edp-reg-card">
            {isRegistered ? (
              <div className="edp-registered">
                <div className="edp-registered-check">✓</div>
                <p className="edp-registered-title">You're registered!</p>
                <p className="edp-registered-sub">See you at the event.</p>
              </div>
            ) : !isEventPast ? (
              <>
                <p className="edp-reg-prompt">Ready to join this event?</p>
                <button onClick={handleRegister} className="edp-reg-btn">
                  Register Now
                </button>
              </>
            ) : (
              <p className="edp-ended-text">This event has ended.</p>
            )}
          </div>

          {avgRating && (
            <div className="edp-card edp-side-stat">
              <p className="edp-side-stat-label">Avg. Rating</p>
              <p className="edp-side-stat-num">{avgRating} <span>/ 5</span></p>
              <div className="edp-side-stars">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14}
                    className={`edp-star ${i <= Math.round(avgRating) ? 'edp-star-on' : ''}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}