import React, { useState, useEffect } from 'react';
import { SupabaseService } from '../../services/supabaseService';
import { isValidEmail, isNonEmpty } from '../../utils/validation';
import { MagneticButton } from '../common/MagneticButton';

interface RSVPModalProps {
  isOpen: boolean;
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({
  isOpen,
  eventId,
  eventTitle,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roll, setRoll] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setRoll('');
      setErrorMsg('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isNonEmpty(name)) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!isNonEmpty(roll)) {
      setErrorMsg('Please provide your student Roll Number or Institution ID.');
      return;
    }

    setSubmitting(true);
    try {
      if (SupabaseService.isConfigured()) {
        await SupabaseService.submitRSVP({ eventId, name, email, roll });
      }
      setIsSuccess(true);
    } catch (err: any) {
      console.error('RSVP submission error:', err);
      setErrorMsg(err?.message || 'Could not register for this event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay active"
      id="rsvp-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog glass-panel" id="rsvp-modal-dialog">
        <button
          type="button"
          className="modal-close"
          id="rsvp-close-btn"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ✕
        </button>

        {isSuccess ? (
          <div className="rsvp-success-container text-center py-4">
            <div className="rsvp-success-icon">✓</div>
            <h3 className="rsvp-success-title space-grotesk font-bold text-xl mb-2">
              Registration Confirmed
            </h3>
            <p className="rsvp-success-desc text-sm opacity-80 mb-6">
              You are officially registered for <strong className="accent-gold">{eventTitle}</strong>. We look forward to seeing you there!
            </p>
            <MagneticButton type="button" className="btn-primary w-full" onClick={onClose}>
              Done
            </MagneticButton>
          </div>
        ) : (
          <div className="rsvp-form-container">
            <div className="modal-header">
              <span className="modal-tag space-mono">EVENT REGISTRATION</span>
              <h3 className="modal-title font-heading" id="rsvp-modal-title">
                Reserve Your Seat
              </h3>
              <p className="modal-event-name space-grotesk accent-gold font-medium">
                {eventTitle}
              </p>
            </div>

            <form className="luxury-form rsvp-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="rsvp-name" className="space-grotesk">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  id="rsvp-name"
                  className="form-input"
                  placeholder="e.g. Suman Thapa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <span className="input-line" />
              </div>

              <div className="form-group">
                <label htmlFor="rsvp-email" className="space-grotesk">
                  INSTITUTIONAL / PERSONAL EMAIL *
                </label>
                <input
                  type="email"
                  id="rsvp-email"
                  className="form-input"
                  placeholder="e.g. suman@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="input-line" />
              </div>

              <div className="form-group">
                <label htmlFor="rsvp-roll" className="space-grotesk">
                  ROLL NUMBER / STUDENT ID *
                </label>
                <input
                  type="text"
                  id="rsvp-roll"
                  className="form-input"
                  placeholder="e.g. NPI-CT-079-01"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  required
                />
                <span className="input-line" />
              </div>

              {errorMsg && (
                <div className="form-error-banner space-mono" style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  ⚠ {errorMsg}
                </div>
              )}

              <MagneticButton
                type="submit"
                className="rsvp-submit-btn w-full"
                disabled={submitting}
              >
                {submitting ? 'Confirming...' : 'Confirm Registration'}
              </MagneticButton>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
