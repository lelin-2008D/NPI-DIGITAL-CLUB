import React, { useState } from 'react';
import type { ContactData } from '../../types/site';
import { GoogleMapEmbed } from '../common/GoogleMapEmbed';
import { MagneticButton } from '../common/MagneticButton';
import { SupabaseService } from '../../services/supabaseService';
import { isValidEmail, isNonEmpty } from '../../utils/validation';

interface ContactSectionProps {
  contact?: ContactData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const email = contact?.email || 'npidigitalclub@gmail.com';
  const phone = contact?.phone || '+977-974-5998159';
  const address =
    contact?.address || 'Nepal Polytechnic Institute (NPI), Bharatpur, Chitwan, Nepal';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isNonEmpty(formData.name)) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!isNonEmpty(formData.message)) {
      setErrorMsg('Please enter your message.');
      return;
    }

    setSubmitting(true);
    try {
      if (SupabaseService.isConfigured()) {
        await SupabaseService.submitContact(formData);
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('Contact submission failed:', err);
      setErrorMsg(err?.message || 'Could not send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padded contact-section" id="contact">
      <div className="section-container">
        <div className="contact-grid">
          {/* Info & Map Column */}
          <div className="contact-info-col reveal-on-scroll">
            <div className="section-tag space-mono">
              <span className="tag-line" />
              <span>COMMUNICATIONS</span>
            </div>
            <h2 className="section-title font-heading">Connect With Our Team</h2>
            <p className="section-desc">
              Have questions regarding membership, workshop collaborations, or student projects? Reach out to us directly.
            </p>

            <div className="contact-details-list">
              <div className="contact-item">
                <span className="contact-icon">✉</span>
                <div className="contact-item-texts">
                  <span className="contact-label space-mono">EMAIL DIRECTORY</span>
                  <a href={`mailto:${email}`} className="contact-value" id="contact-email">
                    {email}
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">☎</span>
                <div className="contact-item-texts">
                  <span className="contact-label space-mono">PHONE INQUIRIES</span>
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="contact-value" id="contact-phone">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div className="contact-item-texts">
                  <span className="contact-label space-mono">CAMPUS BASE</span>
                  <span className="contact-value" id="contact-address">
                    {address}
                  </span>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <GoogleMapEmbed />
          </div>

          {/* Interactive Form Column */}
          <div className="contact-form-col reveal-on-scroll">
            <div className="contact-form-card glass-panel">
              <h3 className="form-card-title space-grotesk">Send an Inquiry</h3>
              <p className="form-card-desc">
                Fill in the details below and our executive team will respond promptly.
              </p>

              {submitted ? (
                <div className="rsvp-success-box text-center">
                  <div className="rsvp-success-icon">✓</div>
                  <h4 className="space-grotesk font-bold text-xl mb-2">Message Dispatched</h4>
                  <p className="text-sm opacity-80 mb-6">
                    Thank you! Your message has been received. Our team will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    className="btn btn-magnetic btn-primary"
                    onClick={() => setSubmitted(false)}
                  >
                    <span className="btn-text">Send Another Message</span>
                  </button>
                </div>
              ) : (
                <form className="luxury-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="contact-name" className="space-grotesk">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      className="form-input"
                      placeholder="e.g. Aayush Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <span className="input-line" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-form-email" className="space-grotesk">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      id="contact-form-email"
                      className="form-input"
                      placeholder="e.g. aayush@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <span className="input-line" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject" className="space-grotesk">
                      SUBJECT / TOPIC
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      className="form-input"
                      placeholder="e.g. Workshop Collaboration / Membership"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                    <span className="input-line" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message" className="space-grotesk">
                      YOUR MESSAGE *
                    </label>
                    <textarea
                      id="contact-message"
                      className="form-input form-textarea"
                      rows={4}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                    className="form-submit-btn w-full"
                    disabled={submitting}
                  >
                    {submitting ? 'Transmitting...' : 'Send Message'}
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
