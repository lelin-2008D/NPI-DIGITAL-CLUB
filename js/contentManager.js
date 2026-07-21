/**
 * ContentManager Class
 * Dynamically renders HTML layouts from the stored JSON database.
 * Enables full live updates when changes occur in the Admin Dashboard.
 */
export class ContentManager {
  /**
   * Main orchestrator to render all content sections
   * @param {Object} db - The database object retrieved from Storage
   */
  static renderAll(db) {
    if (!db) return;
    
    this.renderSEO(db.settings);
    this.renderHero(db.hero);
    this.renderStory(db.story);
    this.renderServices(db.whatWeDo);
    this.renderProjects(db.projects);
    this.renderTimeline(db.timeline);
    this.renderStats(db.story.stats); // stats are nested in story
    this.renderTeam(db.team);
    this.renderGallery(db.gallery);
    this.renderTestimonials(db.testimonials);
    this.renderQuote(db.quote);
    this.renderContact(db.contact);
    this.renderFooter(db.settings);
  }

  /**
   * Update Document Title and SEO Meta elements
   */
  static renderSEO(settings) {
    if (!settings) return;
    if (settings.siteTitle) document.title = settings.siteTitle;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.metaDesc) metaDesc.setAttribute('content', settings.metaDesc);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && settings.metaKeywords) metaKeywords.setAttribute('content', settings.metaKeywords);
  }

  /**
   * Render Hero Section content
   */
  static renderHero(hero) {
    if (!hero) return;
    
    const titleEl = document.getElementById('dynamic-hero-title');
    const subtitleEl = document.getElementById('dynamic-hero-subtitle');
    const descEl = document.getElementById('dynamic-hero-desc');
    const btnEl = document.getElementById('dynamic-hero-btn');

    if (titleEl && hero.title) titleEl.textContent = hero.title;
    if (subtitleEl && hero.subtitle) subtitleEl.textContent = hero.subtitle;
    if (descEl && hero.description) descEl.textContent = hero.description;
    if (btnEl && hero.exploreBtn) {
      btnEl.querySelector('.btn-text').textContent = hero.exploreBtn;
    }
  }

  /**
   * Render Our Story / About Section details
   */
  static renderStory(story) {
    if (!story) return;

    const badgeEl = document.getElementById('story-badge');
    const titleEl = document.getElementById('story-title');
    const missionEl = document.getElementById('story-mission');
    const visionEl = document.getElementById('story-vision');
    const purposeEl = document.getElementById('story-purpose');
    const historyEl = document.getElementById('story-history');
    const imgEl = document.getElementById('story-image');

    if (badgeEl && story.badge) badgeEl.textContent = story.badge;
    if (titleEl && story.title) titleEl.textContent = story.title;
    if (missionEl && story.mission) missionEl.textContent = story.mission;
    if (visionEl && story.vision) visionEl.textContent = story.vision;
    if (purposeEl && story.purpose) purposeEl.textContent = story.purpose;
    if (historyEl && story.history) historyEl.textContent = story.history;
    if (imgEl && story.image) imgEl.src = story.image;
  }

  /**
   * Render What We Do / Services Section
   */
  static renderServices(whatWeDo) {
    if (!whatWeDo) return;

    const badgeEl = document.getElementById('services-badge');
    const titleEl = document.getElementById('services-title');
    const descEl = document.getElementById('services-desc');
    const gridContainer = document.getElementById('services-grid-container');

    if (badgeEl && whatWeDo.badge) badgeEl.textContent = whatWeDo.badge;
    if (titleEl && whatWeDo.title) titleEl.textContent = whatWeDo.title;
    if (descEl && whatWeDo.description) descEl.textContent = whatWeDo.description;

    if (gridContainer && whatWeDo.cards) {
      gridContainer.innerHTML = '';
      whatWeDo.cards.forEach((card, index) => {
        const cardHtml = `
          <div class="service-card reveal-fade-up" style="transition-delay: ${index * 0.1}s;">
            <span class="service-icon" aria-hidden="true">${card.icon || '⚡'}</span>
            <h3 class="service-title space-grotesk">${card.title}</h3>
            <p class="service-desc inter">${card.desc}</p>
          </div>
        `;
        gridContainer.insertAdjacentHTML('beforeend', cardHtml);
      });
    }
  }

  /**
   * Render Featured Projects Showcase
   */
  static renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';
    
    // Sort projects to display featured first
    const displayList = projects || [];
    
    if (displayList.length === 0) {
      container.innerHTML = '<p class="inter text-center">No projects found. Create one in the dashboard.</p>';
      return;
    }

    displayList.forEach((project) => {
      const isFeatured = project.featured ? ' • FEATURED' : '';
      const projectHtml = `
        <div class="project-item reveal-fade-up">
          <div class="project-media-col">
            <a href="${project.link || '#'}" class="project-img-link" target="_blank" rel="noopener" aria-label="View Project Source Code">
              <img src="${project.image || 'assets/images/project_smartcampus.jpg'}" alt="${project.title}" class="project-img">
            </a>
          </div>
          <div class="project-info-col">
            <div class="project-meta">
              <span class="project-category space-grotesk">${project.category}${isFeatured}</span>
              <span class="project-year space-grotesk">${project.year}</span>
            </div>
            <h3 class="project-title cormorant">${project.title}</h3>
            <p class="project-desc inter">${project.desc}</p>
            <a href="${project.link || '#'}" class="project-link-btn btn-magnetic" target="_blank" rel="noopener">
              <span class="btn-text">EXPLORE SOURCE CODE ⟶</span>
            </a>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', projectHtml);
    });
  }

  /**
   * Render Timeline events list
   */
  static renderTimeline(timeline) {
    const track = document.getElementById('timeline-cards-container');
    if (!track) return;

    track.innerHTML = '';
    const events = timeline || [];

    if (events.length === 0) {
      track.innerHTML = '<p class="inter">No roadmap milestones scheduled.</p>';
      return;
    }

    events.forEach((event) => {
      const cardHtml = `
        <div class="timeline-card" data-event-id="${event.id}">
          <div class="timeline-node-wrapper">
            <div class="timeline-node"></div>
          </div>
          <span class="timeline-date space-grotesk">${event.date}</span>
          <div class="timeline-content">
            <h4 class="timeline-event-title cormorant">${event.title}</h4>
            <span class="timeline-loc space-grotesk">⚲ ${event.location}</span>
            <p class="timeline-event-desc inter">${event.desc}</p>
            <button class="btn btn-magnetic timeline-btn" onclick="window.triggerRSVP('${event.id}', '${event.title.replace(/'/g, "\\'")}')">
              <span class="btn-text">RESERVE SEAT</span>
            </button>
          </div>
        </div>
      `;
      track.insertAdjacentHTML('beforeend', cardHtml);
    });
  }

  /**
   * Render Stats counters
   */
  static renderStats(stats) {
    const container = document.getElementById('stats-grid-container');
    if (!container) return;

    container.innerHTML = '';
    const statsList = stats || [];

    statsList.forEach((stat) => {
      const statHtml = `
        <div class="stat-item reveal-fade-up">
          <div class="stat-num cormorant" data-target="${stat.number}" data-suffix="${stat.suffix}">0</div>
          <div class="stat-lbl space-grotesk">${stat.label}</div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', statHtml);
    });
  }

  /**
   * Render Executive Roster
   */
  static renderTeam(team) {
    const container = document.getElementById('team-grid-container');
    if (!container) return;

    container.innerHTML = '';
    const members = team || [];

    if (members.length === 0) {
      container.innerHTML = '<p class="inter">No committee members configured.</p>';
      return;
    }

    members.forEach((member) => {
      const memberHtml = `
        <div class="team-member-card reveal-fade-up">
          <div class="team-image-box">
            <img src="${member.image || 'assets/images/team_member.jpg'}" alt="${member.name}" class="team-photo">
            <div class="team-info-overlay">
              <h3 class="team-name-title cormorant">${member.name}</h3>
              <span class="team-role-title space-grotesk">${member.role}</span>
              <p class="team-bio-txt inter">${member.bio}</p>
              <div class="team-social-links">
                <a href="${member.github || '#'}" class="team-social-link btn-magnetic" target="_blank" rel="noopener"><span class="btn-text">GH</span></a>
                <a href="${member.linkedin || '#'}" class="team-social-link btn-magnetic" target="_blank" rel="noopener"><span class="btn-text">LN</span></a>
                <a href="mailto:${member.email || ''}" class="team-social-link btn-magnetic"><span class="btn-text">EM</span></a>
              </div>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', memberHtml);
    });
  }

  /**
   * Render Masonry Gallery items
   */
  static renderGallery(gallery) {
    const container = document.getElementById('gallery-grid-container');
    if (!container) return;

    container.innerHTML = '';
    const items = gallery || [];

    if (items.length === 0) {
      container.innerHTML = '<p class="inter">Gallery folder empty.</p>';
      return;
    }

    items.forEach((item, index) => {
      const cardHtml = `
        <div class="gallery-item-card reveal-fade-up" data-category="${item.category}" data-index="${index}" onclick="window.openLightbox(${index})">
          <div class="gallery-image-wrapper">
            <img src="${item.image}" alt="${item.caption}" class="gallery-img" loading="lazy">
            <div class="gallery-overlay-box">
              <h4 class="gallery-caption cormorant">${item.caption}</h4>
              <span class="gallery-category space-grotesk">${item.category}</span>
              <span class="gallery-zoom-ico">🔍</span>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
  }

  /**
   * Render Testimonials
   */
  static renderTestimonials(testimonials) {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    container.innerHTML = '';
    const reviews = testimonials || [];

    if (reviews.length === 0) {
      container.innerHTML = '<p class="inter">No testimonials recorded yet.</p>';
      return;
    }

    reviews.forEach((item) => {
      const cardHtml = `
        <div class="testimonial-card reveal-fade-up">
          <div class="quote-icon-bubble">“</div>
          <blockquote class="testimonial-text inter">
            ${item.review}
          </blockquote>
          <div class="testimonial-client">
            <span class="client-name space-grotesk">${item.name}</span>
            <span class="client-role inter">${item.role}</span>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
  }

  /**
   * Render Quote Section
   */
  static renderQuote(quote) {
    if (!quote) return;
    const txtEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');

    if (txtEl && quote.text) txtEl.textContent = `"${quote.text}"`;
    if (authorEl && quote.author) authorEl.textContent = `— ${quote.author}`;
  }

  /**
   * Render Contact details
   */
  static renderContact(contact) {
    if (!contact) return;
    
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const addressEl = document.getElementById('contact-address');
    const coordsEl = document.querySelector('.map-coords');

    if (emailEl && contact.email) {
      emailEl.textContent = contact.email;
      emailEl.href = `mailto:${contact.email}`;
    }
    if (phoneEl && contact.phone) {
      phoneEl.textContent = contact.phone;
      phoneEl.href = `tel:${contact.phone.replace(/[^0-9+]/g, '')}`;
    }
    if (addressEl && contact.address) addressEl.textContent = contact.address;

    if (coordsEl && contact.mapCoords) {
      coordsEl.textContent = `LAT: ${contact.mapCoords.lat}° N | LNG: ${contact.mapCoords.lng}° E`;
    }
  }

  /**
   * Render Footer copyright
   */
  static renderFooter(settings) {
    if (!settings) return;
    const copyrightEl = document.getElementById('footer-copyright');
    if (copyrightEl && settings.copyright) {
      copyrightEl.textContent = `© ${new Date().getFullYear()} ${settings.copyright.replace('Designed with ❤️ by ', '')}. All Rights Reserved.`;
    }
  }
}
