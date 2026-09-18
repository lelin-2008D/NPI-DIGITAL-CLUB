import React from 'react';
import type { SiteSettings } from '../../types/site';
import { Link } from 'react-router-dom';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const rawCopyright = settings?.copyright || 'NPI Digital Club';
  const copyrightText = rawCopyright.replace('Designed with ❤️ by ', '');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-luxury" id="footer">
      <div className="section-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img
                src="/assets/images/logonpi.svg"
                alt="NPI Digital Club"
                className="footer-logo-img"
                width="40"
                height="40"
              />
              <span className="brand-title space-grotesk">NPI DIGITAL CLUB</span>
            </div>
            <p className="footer-desc">
              Empowering students with real-world engineering skills, modern software practices, and collaborative product development at Nepal Polytechnic Institute.
            </p>
            <div className="footer-campus-tag space-mono">
              <span>EST. 2081 • BHARATPUR, CHITWAN</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-links-col">
            <h4 className="footer-heading space-grotesk">Explore</h4>
            <ul className="footer-links">
              <li>
                <a href="#story">Our Story</a>
              </li>
              <li>
                <a href="#services">What We Do</a>
              </li>
              <li>
                <a href="#projects">Project Portfolio</a>
              </li>
              <li>
                <a href="#events">Roadmap Timeline</a>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="footer-links-col">
            <h4 className="footer-heading space-grotesk">Community</h4>
            <ul className="footer-links">
              <li>
                <a href="#team">Executive Committee</a>
              </li>
              <li>
                <a href="#gallery">Photo Archive</a>
              </li>
              <li>
                <a href="#testimonials">Testimonials</a>
              </li>
              <li>
                <Link to="/admin" className="accent-gold">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="footer-links-col">
            <h4 className="footer-heading space-grotesk">Inquiries</h4>
            <ul className="footer-links">
              <li>
                <a href="#contact">Direct Contact Form</a>
              </li>
              <li>
                <a href="mailto:npidigitalclub@gmail.com">npidigitalclub@gmail.com</a>
              </li>
              <li>
                <a href="tel:+9779745998159">+977-974-5998159</a>
              </li>
              <li>
                <span className="text-sm opacity-60">Bharatpur, Chitwan, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright space-mono" id="footer-copyright">
            © {currentYear} {copyrightText}. All Rights Reserved.
          </p>
          <button
            type="button"
            className="back-to-top space-mono"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
          >
            <span>Top</span>
            <span className="top-arrow">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
