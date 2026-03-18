import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { User, Mail, Lock, Phone, BookOpen, Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import './Signup.css';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    rollNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.name.trim() || !form.rollNumber.trim() || !form.email.trim() || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await authApi.signup(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-root">
    
      <div className="signup-bg">
        <div className="signup-grid" />
        <div className="signup-glow signup-glow-1" />
        <div className="signup-glow signup-glow-2" />
      </div>

     
      <div className="signup-topbar">
        <Link to="/" className="signup-logo">A<span>Club</span></Link>
        <p className="signup-topbar-hint">
          Already have an account?{' '}
          <Link to="/login" className="signup-topbar-link">Sign in</Link>
        </p>
      </div>

    
      <div className="signup-center">

  
        <div className="signup-side">
          <div className="signup-side-inner">
            <div className="signup-side-eyebrow">Join AClub</div>
            <h2 className="signup-side-title">
              Start your<br /><em>journey.</em>
            </h2>
            <p className="signup-side-desc">
              Become part of a thriving campus community. Discover clubs, attend events, and build connections that last.
            </p>
            <ul className="signup-side-list">
              <li><span className="signup-side-check">✓</span> Browse 24+ active clubs</li>
              <li><span className="signup-side-check">✓</span> Register for events instantly</li>
              <li><span className="signup-side-check">✓</span> Track your memberships</li>
              <li><span className="signup-side-check">✓</span> Rate &amp; review events</li>
            </ul>
          </div>
        </div>

      
        <div className="signup-card">
          <div className="signup-card-header">
            <div className="signup-eyebrow">
              <span className="signup-eyebrow-dot" />
              New Account
            </div>
            <h1 className="signup-title">Create account</h1>
            <p className="signup-subtitle">Join our campus community today</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">

         
            <div className="signup-row">
              <div className="signup-field">
                <label htmlFor="name" className="signup-label">
                  Full Name <span className="signup-req">*</span>
                </label>
                <div className="signup-input-wrap">
                  <User className="signup-input-icon" size={15} />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="signup-input"
                    required
                  />
                </div>
              </div>

              <div className="signup-field">
                <label htmlFor="rollNumber" className="signup-label">
                  Roll Number <span className="signup-req">*</span>
                </label>
                <div className="signup-input-wrap">
                  <BookOpen className="signup-input-icon" size={15} />
                  <input
                    id="rollNumber"
                    type="text"
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={handleChange}
                    placeholder="2021CSE001"
                    className="signup-input"
                    required
                  />
                </div>
              </div>
            </div>

           
            <div className="signup-field">
              <label htmlFor="email" className="signup-label">
                Email Address <span className="signup-req">*</span>
              </label>
              <div className="signup-input-wrap">
                <Mail className="signup-input-icon" size={15} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="signup-input"
                  required
                />
              </div>
            </div>

           
            <div className="signup-field">
              <label htmlFor="phoneNumber" className="signup-label">
                Phone Number
                <span className="signup-optional"> (optional)</span>
              </label>
              <div className="signup-input-wrap">
                <Phone className="signup-input-icon" size={15} />
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="signup-input"
                />
              </div>
            </div>

            <div className="signup-row">
              <div className="signup-field">
                <label htmlFor="password" className="signup-label">
                  Password <span className="signup-req">*</span>
                </label>
                <div className="signup-input-wrap">
                  <Lock className="signup-input-icon" size={15} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="signup-input signup-input-pw"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="signup-pw-toggle"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="signup-field">
                <label htmlFor="confirmPassword" className="signup-label">
                  Confirm Password <span className="signup-req">*</span>
                </label>
                <div className="signup-input-wrap">
                  <Lock className="signup-input-icon" size={15} />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="signup-input signup-input-pw"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="signup-pw-toggle"
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

      
            <p className="signup-hint">Password must be at least 6 characters.</p>

          
            <button type="submit" disabled={loading} className="signup-submit">
              {loading ? (
                <>
                  <Loader size={16} className="signup-spinner" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="signup-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="signup-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}