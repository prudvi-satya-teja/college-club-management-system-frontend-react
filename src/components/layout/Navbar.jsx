import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, BookOpen, LogOut, Calendar, Users, LayoutDashboard } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import './Navbar.css';

export default function Navbar({ variant = 'light' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userRef = useRef(null);
  const isDark = variant === 'dark';

  const getInitial = (name) => (name || '').trim().charAt(0).toUpperCase();

  const AvatarContent = ({ name, size = 16 }) => {
    const initial = getInitial(name);
    return initial
      ? <span>{initial}</span>
      : <User size={size} />;
  };

  const navLinks = [
    { to: '/clubs',  label: 'Clubs',  icon: <BookOpen size={15} /> },
    { to: '/events', label: 'Events', icon: <Calendar size={15} /> },
    ...(isAuthenticated && user?.role === 'SUPER_ADMIN'
      ? [{ to: '/users', label: 'Users', icon: <Users size={15} /> }]
      : []),
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isDark ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="navbar-inner">

        <Link to="/" className="navbar-logo">
          A<span>Club</span>
        </Link>

        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar-link ${isActive(link.to) ? 'navbar-link-active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          {isAuthenticated ? (
            <div
              className="navbar-user"
              ref={userRef}
              onClick={() => setDropdownOpen(o => !o)}
            >
              <div className="navbar-avatar">
                <AvatarContent name={user?.name} size={15} />
              </div>
              <ChevronDown size={14} className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`} />

              {dropdownOpen && (
                <div
                  className="navbar-dropdown"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="navbar-dropdown-header">
                    <div className="navbar-dropdown-avatar">
                      <AvatarContent name={user?.name} size={18} />
                    </div>
                    <div>
                      <div className="navbar-dropdown-name">{user?.name || 'User'}</div>
                      <div className="navbar-dropdown-email">{user?.email || ''}</div>
                    </div>
                  </div>
                  <div className="navbar-dropdown-divider" />
                  <Link to="/profile" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={14} /> Profile
                  </Link>
                  <Link to="/my-registrations" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <BookOpen size={14} /> My Registrations
                  </Link>
                  <div className="navbar-dropdown-divider" />
                  <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-signin">Sign In</Link>
              <Link to="/signup" className="navbar-signup-btn">Join Now</Link>
            </div>
          )}

          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="navbar-mobile">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar-mobile-link ${isActive(link.to) ? 'navbar-mobile-link-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <div className="navbar-mobile-divider" />
          {isAuthenticated ? (
            <>
              <div className="navbar-mobile-user">
                <div className="navbar-avatar">
                  <AvatarContent name={user?.name} size={15} />
                </div>
                <div>
                  <div className="navbar-mobile-user-name">{user?.name || 'User'}</div>
                  <div className="navbar-mobile-user-email">{user?.email || ''}</div>
                </div>
              </div>
              <div className="navbar-mobile-divider" />
              <Link to="/profile" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                <User size={15} /> Profile
              </Link>
              <Link to="/my-registrations" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
                <BookOpen size={15} /> My Registrations
              </Link>
              <button className="navbar-mobile-link navbar-mobile-logout" onClick={handleLogout}>
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>Join Now</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}