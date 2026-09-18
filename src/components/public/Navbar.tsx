import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Section tracker
      const sections = ['story', 'services', 'projects', 'events', 'team', 'gallery', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#hero" className="brand-logo" onClick={closeMobile}>
          <div className="logo-emblem">
            <img
              src="/assets/images/logonpi.svg"
              alt="NPI Digital Club"
              className="logo-img"
              width="44"
              height="44"
            />
          </div>
          <div className="brand-text">
            <span className="brand-title space-grotesk">NPI DIGITAL</span>
            <span className="brand-tag space-mono">CLUB</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <a
                href="#story"
                className={`nav-item ${activeSection === 'story' ? 'active' : ''}`}
              >
                Story
              </a>
            </li>
            <li>
              <a
                href="#services"
                className={`nav-item ${activeSection === 'services' ? 'active' : ''}`}
              >
                What We Do
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#events"
                className={`nav-item ${activeSection === 'events' ? 'active' : ''}`}
              >
                Roadmap
              </a>
            </li>
            <li>
              <a
                href="#team"
                className={`nav-item ${activeSection === 'team' ? 'active' : ''}`}
              >
                Leadership
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                className={`nav-item ${activeSection === 'gallery' ? 'active' : ''}`}
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}
              >
                Inquire
              </a>
            </li>
          </ul>
        </nav>

        {/* Nav Controls */}
        <div className="nav-actions">
          <button
            className="theme-toggle"
            id="theme-toggle"
            aria-label="Toggle visual theme mode"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="theme-toggle-icon">
              {theme === 'dark' ? '☀' : '☾'}
            </span>
          </button>

          <Link to="/admin" className="btn btn-magnetic btn-nav-cta">
            <span className="btn-text">Admin</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
            id="mobile-menu-btn"
            aria-label="Toggle navigation drawer"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`mobile-menu-drawer ${mobileMenuOpen ? 'active' : ''}`}
        id="mobile-drawer"
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          <ul className="mobile-links">
            <li>
              <a href="#story" onClick={closeMobile} className="mobile-item">
                Our Story
              </a>
            </li>
            <li>
              <a href="#services" onClick={closeMobile} className="mobile-item">
                What We Do
              </a>
            </li>
            <li>
              <a href="#projects" onClick={closeMobile} className="mobile-item">
                Projects
              </a>
            </li>
            <li>
              <a href="#events" onClick={closeMobile} className="mobile-item">
                Roadmap
              </a>
            </li>
            <li>
              <a href="#team" onClick={closeMobile} className="mobile-item">
                Leadership
              </a>
            </li>
            <li>
              <a href="#gallery" onClick={closeMobile} className="mobile-item">
                Gallery
              </a>
            </li>
            <li>
              <a href="#contact" onClick={closeMobile} className="mobile-item">
                Inquire
              </a>
            </li>
            <li>
              <Link to="/admin" onClick={closeMobile} className="mobile-item accent-gold">
                Admin Console
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
