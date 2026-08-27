/**
 * UI Module
 * Manages user interactions: scroll states, responsive menus,
 * horizontal timeline drag physics, lightbox controllers, filters, and form actions.
 */

import { Storage } from './storage.js';

export class UI {
  static galleryItems = [];
  static activeLightboxIndex = 0;

  /**
   * Initialize UI bindings
   */
  static init() {
    this.initThemeToggle();
    this.initNavbar();
    this.initMobileMenu();
    this.initTimelineDrag();
    this.initGalleryFilters();
    this.initLightbox();
    this.initContactForm();
    this.initRSVPForm();

    // Map global windows hooks for dynamically rendered content links
    window.triggerRSVP = (eventId, eventTitle) => this.openRSVP(eventId, eventTitle);
    window.openLightbox = (index) => this.openLightboxModal(index);
  }

  /**
   * 0. Persistent light/dark theme toggle
   */
  static initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const storageKey = 'npi-theme';
    if (!toggle) return;

    const applyTheme = (theme, persist = true) => {
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      toggle.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      toggle.setAttribute(
        'aria-checked',
        theme === 'light' ? 'true' : 'false'
      );

      if (persist) {
        try {
          localStorage.setItem(storageKey, theme);
        } catch (error) {
          // Theme still works for the current session when storage is unavailable.
        }
      }
    };

    const initialTheme = root.dataset.theme === 'light' ? 'light' : 'dark';
    applyTheme(initialTheme, false);

    toggle.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });

    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    systemPreference.addEventListener?.('change', (event) => {
      try {
        if (localStorage.getItem(storageKey)) return;
      } catch (error) {
        return;
      }
      applyTheme(event.matches ? 'dark' : 'light', false);
    });
  }

  /**
   * 1. Navigation Shrink and Active Link Tracking on Scroll
   */
  static initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
      // Shrink effect
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Track active section
      let currentSectionId = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 150) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navItems.forEach((item) => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${currentSectionId}`) {
            item.classList.add('active');
          }
        });
      }
    }, { passive: true });
  }

  /**
   * 2. Mobile Responsive Menu
   */
  static initMobileMenu() {
    const btn = document.getElementById('hamburger-btn');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
      const active = btn.classList.toggle('active');
      links.classList.toggle('active');
      btn.setAttribute('aria-expanded', active);
    });

    // Close menu when clicking a link
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        btn.classList.remove('active');
        links.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /**
   * 3. Horizontal Drag-scroll Physics inside Event Timeline
   */
  static initTimelineDrag() {
    const container = document.getElementById('timeline-track');
    const progressBar = document.getElementById('timeline-progress');
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const updateProgressBar = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) {
        progressBar.style.width = '100%';
        return;
      }
      const scrollPercent = (container.scrollLeft / maxScroll) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    };

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('dragging');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // multiplier for drag speed
      container.scrollLeft = scrollLeft - walk;
      updateProgressBar();
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    }, { passive: true });

    container.addEventListener('touchend', () => {
      isDown = false;
    });

    container.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 1.2;
      container.scrollLeft = scrollLeft - walk;
      updateProgressBar();
    }, { passive: true });

    // Track standard horizontal wheel scroll
    container.addEventListener('scroll', updateProgressBar, { passive: true });
    window.addEventListener('resize', updateProgressBar);
    setTimeout(updateProgressBar, 500); // Trigger initial progress
  }

  /**
   * 4. Gallery Category Filter
   */
  static initGalleryFilters() {
    const filtersContainer = document.getElementById('gallery-filters-container');
    if (!filtersContainer) return;

    filtersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Update active btn style
      filtersContainer.querySelectorAll('.filter-btn').forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      const cards = document.querySelectorAll('.gallery-item-card');

      cards.forEach((card) => {
        const cat = card.dataset.category;
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  /**
   * 5. Lightbox Modal logic (Keyboard navigation included)
   */
  static initLightbox() {
    const modal = document.getElementById('gallery-lightbox');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    if (!modal) return;

    // Close actions
    closeBtn?.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('lightbox-overlay')) {
        modal.close();
      }
    });

    // Navigation actions
    prevBtn?.addEventListener('click', () => this.navigateLightbox(-1));
    nextBtn?.addEventListener('click', () => this.navigateLightbox(1));

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!modal.open) return;
      if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
      if (e.key === 'ArrowRight') this.navigateLightbox(1);
      if (e.key === 'Escape') modal.close();
    });
  }

  /**
   * Opens lightbox modal for specific gallery index
   * @param {number} index
   */
  static openLightboxModal(index) {
    const db = Storage.getData();
    if (!db || !db.gallery) return;

    this.galleryItems = db.gallery;
    this.activeLightboxIndex = index;
    
    this.updateLightboxContent();
    
    const modal = document.getElementById('gallery-lightbox');
    if (modal) modal.showModal();
  }

  /**
   * Slides lightbox forward/backward
   */
  static navigateLightbox(direction) {
    if (this.galleryItems.length === 0) return;
    
    let newIndex = this.activeLightboxIndex + direction;
    if (newIndex < 0) newIndex = this.galleryItems.length - 1;
    if (newIndex >= this.galleryItems.length) newIndex = 0;
    
    this.activeLightboxIndex = newIndex;
    this.updateLightboxContent();
  }

  /**
   * Redraw active image details inside lightbox modal
   */
  static updateLightboxContent() {
    const imgEl = document.getElementById('lightbox-active-img');
    const captionEl = document.getElementById('lightbox-caption-text');
    const counterEl = document.getElementById('lightbox-index-counter');
    
    const activeItem = this.galleryItems[this.activeLightboxIndex];
    if (!activeItem) return;

    if (imgEl) imgEl.src = activeItem.image;
    if (captionEl) captionEl.textContent = activeItem.caption;
    if (counterEl) {
      counterEl.textContent = `${this.activeLightboxIndex + 1} / ${this.galleryItems.length}`;
    }
  }

  /**
   * 6. Timeline RSVP Dialog Controller
   */
  static openRSVP(eventId, eventTitle) {
    const modal = document.getElementById('rsvp-modal');
    const titleEl = document.getElementById('rsvp-event-title');
    const idInput = document.getElementById('rsvp-event-id');

    if (!modal) return;
    if (titleEl) titleEl.textContent = eventTitle;
    if (idInput) idInput.value = eventId;

    modal.showModal();
  }

  static initRSVPForm() {
    const modal = document.getElementById('rsvp-modal');
    const closeBtn = document.getElementById('rsvp-close-btn');
    const form = document.getElementById('rsvp-form-element');

    if (!modal) return;

    closeBtn?.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('rsvp-modal-overlay')) {
        modal.close();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Capture details for simulated backend log
        const eventTitle = document.getElementById('rsvp-event-title').textContent;
        const name = document.getElementById('rsvp-name').value;
        const email = document.getElementById('rsvp-email').value;

        alert(`Transmission complete!\nThank you ${name}.\nYour seat for [${eventTitle}] has been confirmed. Verification details sent to ${email}.`);
        
        form.reset();
        modal.close();
      });
    }
  }

  /**
   * 7. Luxury Contact Form Submissions
   */
  static initContactForm() {
    const form = document.getElementById('contact-form-element');
    const feedback = document.getElementById('form-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show luxury loader placeholder message
      feedback.className = 'form-response-msg';
      feedback.textContent = 'Transmitting data packets...';

      // Simulate a network dispatch latency
      setTimeout(() => {
        const name = document.getElementById('contact-name').value;
        feedback.className = 'form-response-msg success';
        feedback.textContent = `Packet accepted! Thank you, ${name}. We will follow up.`;
        form.reset();
      }, 1500);
    });
  }
}
