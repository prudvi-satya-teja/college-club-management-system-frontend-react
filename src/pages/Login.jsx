import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import useAuthStore from '../store/authStore';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';


export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async e => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login(email, password);
      
      const authHeader = res.headers?.authorization || res.headers?.Authorization;
      const token = authHeader?.replace(/^Bearer\s+/i, '');
      
      console.log('Login response headers:', res.headers);
      console.log('Authorization header:', authHeader);
      console.log('Extracted token:', token);
      
      if (token && typeof token === 'string' && token.length > 0) {
        login(token);
        toast.success('Login successful!');


        navigate('/');
      } else {
        console.error('No token in Authorization header');
        toast.error('No valid token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || err.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
   

  const handleOAuth = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/microsoft';
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="login-grid" />
        <div className="login-glow login-glow-1" />
        <div className="login-glow login-glow-2" />
      </div>

     
      <div className="login-topbar">
        <Link to="/" className="login-logo">A<span>Club</span></Link>
      </div>

    
      <div className="login-center">
        <div className="login-card">

       
          <div className="login-card-header">
            <div className="login-eyebrow">
              <span className="login-eyebrow-dot" />
              Member Portal
            </div>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to manage your clubs and events</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email Address <span className="login-req">*</span>
              </label>
              <div className="login-input-wrap">
                <Mail className="login-input-icon" size={15} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="login-input"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password" className="login-label">
                  Password <span className="login-req">*</span>
                </label>
                <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
              </div>
              <div className="login-input-wrap">
                <Lock className="login-input-icon" size={15} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="login-input login-input-pw"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="login-pw-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <label className="login-remember">
              <input type="checkbox" className="login-checkbox" />
              <span>Remember me</span>
            </label>

            <button type="submit" disabled={loading} className="login-submit">
              {loading ? (
                <>
                  <Loader size={16} className="login-spinner" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

      
          <div className="login-divider">
            <span>Or continue with</span>
          </div>

         
          <button type="button" onClick={handleOAuth} className="login-microsoft">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
            </svg>
            Continue with Microsoft
          </button>

          
          <p className="login-footer-text">
            Don't have an account?{' '}
            <Link to="/signup" className="login-link">Sign up</Link>
          </p>
        </div>

        
        <div className="login-side">
          <div className="login-side-inner">
            <div className="login-side-eyebrow">AClub Platform</div>
            <h2 className="login-side-title">
              Your campus.<br /><em>Connected.</em>
            </h2>
            <p className="login-side-desc">
              Manage clubs, join events, and stay connected with your college community — all in one place.
            </p>
            <div className="login-side-stats">
              <div className="login-side-stat">
                <span className="login-side-num">24+</span>
                <span className="login-side-label">Active Clubs</span>
              </div>
              <div className="login-side-div" />
              <div className="login-side-stat">
                <span className="login-side-num">180+</span>
                <span className="login-side-label">Events Hosted</span>
              </div>
              <div className="login-side-div" />
              <div className="login-side-stat">
                <span className="login-side-num">1.2k+</span>
                <span className="login-side-label">Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}