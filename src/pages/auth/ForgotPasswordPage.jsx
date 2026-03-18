import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../../api/authApi';
import { ChevronRight, ChevronLeft, Mail, Key, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onEmailSubmit = async data => {
    setLoading(true);
    try {
      await authApi.sendOtp(data.email);
      setEmail(data.email);
      setStep(2);
      toast.success('OTP sent to your email');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async data => {
    setLoading(true);
    try {
      await authApi.verifyOtp(email, data.otp);
      setStep(3);
      toast.success('OTP verified');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async data => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(email, data.password);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Email', 'Verify OTP', 'New Password'];

  return (
    <div className="fp-root">
      <div className="fp-bg">
        <div className="fp-grid" />
        <div className="fp-glow fp-glow-1" />
        <div className="fp-glow fp-glow-2" />
      </div>

      <div className="fp-topbar">
        <Link to="/" className="fp-logo">A<span>Club</span></Link>
        <Link to="/login" className="fp-topbar-back">
          <ChevronLeft size={14} /> Back to Sign in
        </Link>
      </div>

      <div className="fp-center">
        <div className="fp-card">

          <div className="fp-card-header">
            <div className="fp-eyebrow">
              <span className="fp-eyebrow-dot" />
              Password Reset
            </div>
            <h1 className="fp-title">Reset password</h1>
            <p className="fp-subtitle">
              {step === 1 && 'Enter your email address to receive a one-time password.'}
              {step === 2 && `Enter the OTP sent to ${email}`}
              {step === 3 && 'Choose a strong new password for your account.'}
            </p>
          </div>

          <div className="fp-stepper">
            {stepLabels.map((label, i) => {
              const s = i + 1;
              return (
                <div key={s} className="fp-step-wrap">
                  <div className={`fp-step-item ${step > s ? 'fp-step-done' : step === s ? 'fp-step-active' : 'fp-step-idle'}`}>
                    <div className="fp-step-circle">
                      {step > s ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : s}
                    </div>
                    <span className="fp-step-label">{label}</span>
                  </div>
                  {s < 3 && <div className={`fp-step-line ${step > s ? 'fp-step-line-done' : ''}`} />}
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmit(onEmailSubmit)} className="fp-form">
              <div className="fp-field">
                <label htmlFor="email" className="fp-label">
                  Email Address <span className="fp-req">*</span>
                </label>
                <div className="fp-input-wrap">
                  <Mail className="fp-input-icon" size={15} />
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' }
                    })}
                    placeholder="student@college.edu"
                    className={`fp-input ${errors.email ? 'fp-input-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="fp-error-msg">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="fp-submit">
                {loading ? (
                  <><Loader size={16} className="fp-spinner" /> Sending OTP&hellip;</>
                ) : (
                  <>Send OTP <ChevronRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(onOtpSubmit)} className="fp-form">
              <div className="fp-field">
                <label htmlFor="otp" className="fp-label">
                  One-Time Password <span className="fp-req">*</span>
                </label>
                <div className="fp-input-wrap">
                  <Key className="fp-input-icon" size={15} />
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    {...register('otp', {
                      required: 'OTP is required',
                      minLength: { value: 4, message: 'OTP must be at least 4 digits' }
                    })}
                    placeholder="Enter 6-digit OTP"
                    className={`fp-input fp-input-otp ${errors.otp ? 'fp-input-error' : ''}`}
                  />
                </div>
                {errors.otp && <p className="fp-error-msg">{errors.otp.message}</p>}
                <p className="fp-resend-hint">
                  Didn't receive it?{' '}
                  <button type="button" className="fp-resend-btn" onClick={() => { setStep(1); reset(); }}>
                    Resend OTP
                  </button>
                </p>
              </div>
              <div className="fp-btn-row">
                <button type="button" className="fp-back-btn" onClick={() => { setStep(1); reset(); }}>
                  <ChevronLeft size={15} /> Back
                </button>
                <button type="submit" disabled={loading} className="fp-submit fp-submit-flex">
                  {loading ? (
                    <><Loader size={16} className="fp-spinner" /> Verifying&hellip;</>
                  ) : (
                    <>Verify OTP <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="fp-form">
              <div className="fp-field">
                <label htmlFor="password" className="fp-label">
                  New Password <span className="fp-req">*</span>
                </label>
                <div className="fp-input-wrap">
                  <Lock className="fp-input-icon" size={15} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    placeholder="Enter new password"
                    className={`fp-input fp-input-pw ${errors.password ? 'fp-input-error' : ''}`}
                  />
                  <button type="button" className="fp-pw-toggle" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="fp-error-msg">{errors.password.message}</p>}
              </div>
              <div className="fp-field">
                <label htmlFor="confirmPassword" className="fp-label">
                  Confirm Password <span className="fp-req">*</span>
                </label>
                <div className="fp-input-wrap">
                  <Lock className="fp-input-icon" size={15} />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    placeholder="Confirm new password"
                    className={`fp-input fp-input-pw ${errors.confirmPassword ? 'fp-input-error' : ''}`}
                  />
                  <button type="button" className="fp-pw-toggle" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="fp-error-msg">{errors.confirmPassword.message}</p>}
              </div>
              <div className="fp-btn-row">
                <button type="button" className="fp-back-btn" onClick={() => { setStep(2); reset(); }}>
                  <ChevronLeft size={15} /> Back
                </button>
                <button type="submit" disabled={loading} className="fp-submit fp-submit-flex">
                  {loading ? (
                    <><Loader size={16} className="fp-spinner" /> Resetting&hellip;</>
                  ) : (
                    <>Reset Password <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}