import React, { useState } from 'react';
import { SupabaseService } from '../../services/supabaseService';
import { MagneticButton } from '../common/MagneticButton';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    setSubmitting(true);

    if (SupabaseService.isConfigured()) {
      try {
        await SupabaseService.signIn(email, password);
        if (remember) {
          localStorage.setItem('admin_logged_perm', 'true');
        } else {
          sessionStorage.setItem('admin_logged', 'true');
        }
        onSuccess();
      } catch (err: any) {
        setFeedback(err?.message || 'Invalid administrative credentials.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Local development fallback
      if (email === 'admin@npidigital.org' && password === 'digitalpass') {
        if (remember) {
          localStorage.setItem('admin_logged_perm', 'true');
        } else {
          sessionStorage.setItem('admin_logged', 'true');
        }
        onSuccess();
      } else {
        setFeedback('Supabase not configured. For local demo, use admin@npidigital.org / digitalpass');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="login-card glass-panel">
        <div className="login-logo-box">
          <span className="logo-symbol">N</span>
          <span className="logo-txt space-grotesk">
            NPI DIGITAL <span className="accent-gold">ADMIN</span>
          </span>
        </div>
        <h2 className="login-title font-heading">Access Portal</h2>
        <p className="login-subtitle">Authenticate using administrative credentials.</p>

        <form className="login-form luxury-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email" className="space-grotesk">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              id="admin-email"
              className="form-input"
              placeholder="admin@npidigital.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="input-line" />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" className="space-grotesk">
              SECURITY PASSWORD
            </label>
            <input
              type="password"
              id="admin-password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="input-line" />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember Session</span>
            </label>
            <span
              className="forgot-pwd space-grotesk cursor-pointer"
              onClick={() =>
                alert('For Supabase auth, ask a project administrator to reset your password. For local demo, use digitalpass.')
              }
            >
              Forgot Key?
            </span>
          </div>

          <MagneticButton type="submit" className="login-submit-btn w-full" disabled={submitting}>
            {submitting ? 'Verifying...' : 'Unlock Dashboard'}
          </MagneticButton>

          {feedback && (
            <div className="login-error-msg space-grotesk text-center mt-4" style={{ color: '#ef4444' }}>
              {feedback}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
