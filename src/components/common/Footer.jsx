import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './Footer.css';

export default function Footer({ className = '' }) {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <footer className={`footer${className ? ' ' + className : ''}`}>
      <div className="footer-inner">

  
        <div className="footer-brand">
          <div className="footer-logo">A<span>Club</span></div>
          <p className="footer-tagline">
            Bringing your campus community together — one club, one event, one moment at a time.
          </p>
          <div className="footer-social">
          
            <a href="#" className="footer-social-btn" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>

            <a href="#" className="footer-social-btn" aria-label="Twitter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <a href="#" className="footer-social-btn" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Explore</div>
          <ul className="footer-col-links">
            <li><Link to="/clubs">All Clubs</Link></li>
            <li><Link to="/events">All Events</Link></li>
            <li><Link to={isAuthenticated ? '/my-registrations' : '/login'}>My Registrations</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Account</div>
          <ul className="footer-col-links">
            {isAuthenticated ? (
              <>
                <li><Link to="/profile">My Profile</Link></li>
                <li><Link to="/my-registrations">Registrations</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/signup">Create Account</Link></li>
                <li><Link to="/forgot-password">Forgot Password</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Campus at a Glance</div>
          <div className="footer-stats">
            <div className="footer-stat-item">
              <span className="footer-stat-num">24+</span>
              <span className="footer-stat-label">Active Clubs</span>
            </div>
            <div className="footer-stat-item">
              <span className="footer-stat-num">180+</span>
              <span className="footer-stat-label">Events Hosted</span>
            </div>
            <div className="footer-stat-item">
              <span className="footer-stat-num">1.2k+</span>
              <span className="footer-stat-label">Student Members</span>
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <span className="footer-copy">© 2025 AClub. Built for students, by students.</span>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
