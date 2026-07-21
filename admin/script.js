/**
 * NPI Digital Console Logic
 * Coordinates authentications, CRUD states, split-screen previews,
 * and JSON data backups.
 */

import { Storage } from '../js/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Authenticate local DB
  const db = await Storage.initialize();

  // 2. Setup Cursor
  initAdminCursor();

  // 3. Setup Login Flow
  initAuthentication();

  // 4. Setup Section Forms Populate
  populateSettingsForms(db);

  // 5. Sidebar Navigation Toggles
  initSidebarNav();

  // 6. Setup CRUD list tables
  renderAllTables();

  // 7. General Settings & Backup listeners
  initGeneralListeners();

  // 8. CRUD Form Submit Binding
  initCRUDFormSubmit();
});

/* ==========================================================================
   AUTHENTICATION SYSTEM
   ========================================================================== */
function initAuthentication() {
  const loginScreen = document.getElementById('login-screen');
  const adminApp = document.getElementById('admin-app');
  const loginForm = document.getElementById('login-form');
  const feedback = document.getElementById('login-feedback');
  const logoutBtn = document.getElementById('logout-btn');

  const checkAuth = () => {
    const isLogged = sessionStorage.getItem('admin_logged') === 'true' || localStorage.getItem('admin_logged_perm') === 'true';
    if (isLogged) {
      loginScreen.classList.add('hidden');
      adminApp.style.display = 'flex';
      updatePreview();
    } else {
      loginScreen.classList.remove('hidden');
      adminApp.style.display = 'none';
    }
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const remember = document.getElementById('remember-me').checked;

      // Demo login validation
      if (email === 'admin@npidigital.org' && pass === 'digitalpass') {
        feedback.textContent = '';
        if (remember) {
          localStorage.setItem('admin_logged_perm', 'true');
        } else {
          sessionStorage.setItem('admin_logged', 'true');
        }
        checkAuth();
      } else {
        feedback.textContent = 'Invalid credentials. Password hint: digitalpass';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_logged');
      localStorage.removeItem('admin_logged_perm');
      checkAuth();
    });
  }

  checkAuth();
}

/* ==========================================================================
   SIDEBAR NAVIGATION
   ========================================================================== */
function initSidebarNav() {
  const navBtns = document.querySelectorAll('.sidebar-nav .nav-btn');
  const panels = document.querySelectorAll('.editor-column .panel');

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.target;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   CURSOR PHYSICS
   ========================================================================== */
function initAdminCursor() {
  const cursor = document.getElementById('custom-cursor');
  const dot = cursor?.querySelector('.cursor-dot');
  const ring = cursor?.querySelector('.cursor-ring');
  if (!cursor || !dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const update = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);

  const applyHover = () => {
    const clickables = document.querySelectorAll('button, a, input, textarea, select, .table-row');
    clickables.forEach((el) => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  };
  applyHover();
  const observer = new MutationObserver(applyHover);
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ==========================================================================
   LIVE PREVIEW SYSTEM
   ========================================================================== */
function updatePreview() {
  const iframe = document.getElementById('preview-iframe');
  if (!iframe) return;

  try {
    // If the page inside iframe is loaded, dispatch its storage event to avoid a heavy full reload
    if (iframe.contentWindow) {
      iframe.contentWindow.dispatchEvent(new Event('storage'));
    }
  } catch (e) {
    // In case of domain blocks, fallback to iframe reload
    iframe.src = iframe.src;
  }
}

/* ==========================================================================
   FORM POPULATE & SUBMIT BINDINGS
   ========================================================================== */
function populateSettingsForms(db) {
  if (!db) return;

  // 1. General & SEO Form
  if (db.settings) {
    document.getElementById('setting-site-title').value = db.settings.siteTitle || '';
    document.getElementById('setting-meta-desc').value = db.settings.metaDesc || '';
    document.getElementById('setting-meta-keys').value = db.settings.metaKeywords || '';
    document.getElementById('setting-copyright').value = db.settings.copyright || '';
  }

  // 2. Hero Form
  if (db.hero) {
    document.getElementById('hero-title-input').value = db.hero.title || '';
    document.getElementById('hero-subtitle-input').value = db.hero.subtitle || '';
    document.getElementById('hero-desc-input').value = db.hero.description || '';
    document.getElementById('hero-btn-input').value = db.hero.exploreBtn || '';
  }

  // 3. Our Story Form
  if (db.story) {
    document.getElementById('story-badge-input').value = db.story.badge || '';
    document.getElementById('story-title-input').value = db.story.title || '';
    document.getElementById('story-mission-input').value = db.story.mission || '';
    document.getElementById('story-vision-input').value = db.story.vision || '';
    document.getElementById('story-purpose-input').value = db.story.purpose || '';
    document.getElementById('story-history-input').value = db.story.history || '';
    document.getElementById('story-image-input').value = db.story.image || '';
  }

  // 4. Contact Form
  if (db.contact) {
    document.getElementById('contact-email-input').value = db.contact.email || '';
    document.getElementById('contact-phone-input').value = db.contact.phone || '';
    document.getElementById('contact-address-input').value = db.contact.address || '';
    if (db.contact.mapCoords) {
      document.getElementById('contact-lat-input').value = db.contact.mapCoords.lat || '';
      document.getElementById('contact-lng-input').value = db.contact.mapCoords.lng || '';
    }
  }

  // 5. Quote Section (inside Contact Panel)
  if (db.quote) {
    document.getElementById('quote-text-input').value = db.quote.text || '';
    document.getElementById('quote-author-input').value = db.quote.author || '';
  }

  updateDashboardCount(db);
}

function updateDashboardCount(db) {
  document.getElementById('stat-proj-count').textContent = db.projects?.length || 0;
  document.getElementById('stat-event-count').textContent = db.timeline?.length || 0;
  document.getElementById('stat-team-count').textContent = db.team?.length || 0;
  document.getElementById('stat-gallery-count').textContent = db.gallery?.length || 0;
}

function initGeneralListeners() {
  const db = Storage.getData();

  // site settings submit
  document.getElementById('form-site-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    db.settings.siteTitle = document.getElementById('setting-site-title').value;
    db.settings.metaDesc = document.getElementById('setting-meta-desc').value;
    db.settings.metaKeywords = document.getElementById('setting-meta-keys').value;
    db.settings.copyright = document.getElementById('setting-copyright').value;
    Storage.saveData(db);
    alert('Core SEO Settings Saved!');
    updatePreview();
  });

  // Hero submit
  document.getElementById('form-hero-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    db.hero.title = document.getElementById('hero-title-input').value;
    db.hero.subtitle = document.getElementById('hero-subtitle-input').value;
    db.hero.description = document.getElementById('hero-desc-input').value;
    db.hero.exploreBtn = document.getElementById('hero-btn-input').value;
    Storage.saveData(db);
    alert('Hero Settings Committed!');
    updatePreview();
  });

  // Story submit
  document.getElementById('form-story-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    db.story.badge = document.getElementById('story-badge-input').value;
    db.story.title = document.getElementById('story-title-input').value;
    db.story.mission = document.getElementById('story-mission-input').value;
    db.story.vision = document.getElementById('story-vision-input').value;
    db.story.purpose = document.getElementById('story-purpose-input').value;
    db.story.history = document.getElementById('story-history-input').value;
    db.story.image = document.getElementById('story-image-input').value;
    Storage.saveData(db);
    alert('Genesis Story Settings Saved!');
    updatePreview();
  });

  // Services Header submit
  document.getElementById('form-services-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    db.whatWeDo.badge = document.getElementById('services-badge-input').value;
    db.whatWeDo.title = document.getElementById('services-title-input').value;
    db.whatWeDo.description = document.getElementById('services-desc-input').value;
    Storage.saveData(db);
    alert('Services Header settings committed!');
    updatePreview();
  });

  // Contact submit
  document.getElementById('form-contact-settings').addEventListener('submit', (e) => {
    e.preventDefault();
    db.contact.email = document.getElementById('contact-email-input').value;
    db.contact.phone = document.getElementById('contact-phone-input').value;
    db.contact.address = document.getElementById('contact-address-input').value;
    db.contact.mapCoords = {
      lat: document.getElementById('contact-lat-input').value,
      lng: document.getElementById('contact-lng-input').value
    };

    db.quote = {
      text: document.getElementById('quote-text-input').value,
      author: document.getElementById('quote-author-input').value
    };

    Storage.saveData(db);
    alert('Contact Details & Quote elements saved!');
    updatePreview();
  });

  // Preview force reload
  document.getElementById('refresh-preview-btn').addEventListener('click', () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe) iframe.src = iframe.src;
  });

  // Export db
  document.getElementById('export-db-btn').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(Storage.exportJSON());
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `npi_digital_db_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  });

  // Import db
  document.getElementById('import-db-file').addEventListener('change', (e) => {
    const fileReader = new FileReader();
    if (!e.target.files[0]) return;
    
    fileReader.onload = function (fileLoadedEvent) {
      const textFromFileLoaded = fileLoadedEvent.target.result;
      const success = Storage.importJSON(textFromFileLoaded);
      if (success) {
        alert('Database snapshot loaded successfully! Reloading...');
        window.location.reload();
      } else {
        alert('Failed to load JSON file. Please ensure it follows the schema layout.');
      }
    };
    fileReader.readAsText(e.target.files[0], "UTF-8");
  });

  // Reset db
  document.getElementById('reset-db-btn').addEventListener('click', async () => {
    if (confirm('CAUTION: This will delete all customized edits and reset back to original default settings. Proceed?')) {
      const resetDb = await Storage.resetData();
      alert('Local storage database reset successfully!');
      window.location.reload();
    }
  });
}

/* ==========================================================================
   CRUD TABLES RENDERING
   ========================================================================== */
function renderAllTables() {
  const db = Storage.getData();
  if (!db) return;

  renderServicesListTable(db.whatWeDo.cards || []);
  renderProjectsListTable(db.projects || []);
  renderEventsListTable(db.timeline || []);
  renderGalleryListTable(db.gallery || []);
  renderTeamListTable(db.team || []);
  renderTestimonialsListTable(db.testimonials || []);
}

// 1. Services cards listing (Reorder & Edit only, no Add/Delete to protect layout count)
function renderServicesListTable(services) {
  const container = document.getElementById('services-cards-list');
  if (!container) return;

  container.innerHTML = '';
  services.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="row-info-col">
        <span class="row-title">${item.title}</span>
        <span class="row-sub">${item.icon} • ${item.desc}</span>
      </div>
      <div class="row-actions-col">
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('services', ${index}, -1)">▲</button>
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('services', ${index}, 1)">▼</button>
        <button class="action-ico-btn" onclick="window.showCRUDModal('services', '${item.id}')">Edit</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// 2. Projects table listing
function renderProjectsListTable(projects) {
  const container = document.getElementById('projects-list-table');
  if (!container) return;

  container.innerHTML = '';
  projects.forEach((item, index) => {
    const isFeatured = item.featured ? '<span class="accent-gold">[FEATURED]</span> ' : '';
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="row-info-col">
        <span class="row-title">${isFeatured}${item.title}</span>
        <span class="row-sub">${item.category} • Year ${item.year}</span>
      </div>
      <div class="row-actions-col">
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('project', ${index}, -1)">▲</button>
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('project', ${index}, 1)">▼</button>
        <button class="action-ico-btn" onclick="window.showCRUDModal('project', '${item.id}')">Edit</button>
        <button class="action-ico-btn btn-delete" onclick="window.deleteEntity('project', '${item.id}')">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// 3. Events timeline list table
function renderEventsListTable(timeline) {
  const container = document.getElementById('events-list-table');
  if (!container) return;

  container.innerHTML = '';
  timeline.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="row-info-col">
        <span class="row-title">${item.title}</span>
        <span class="row-sub">${item.date} • Location: ${item.location}</span>
      </div>
      <div class="row-actions-col">
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('event', ${index}, -1)">▲</button>
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('event', ${index}, 1)">▼</button>
        <button class="action-ico-btn" onclick="window.showCRUDModal('event', '${item.id}')">Edit</button>
        <button class="action-ico-btn btn-delete" onclick="window.deleteEntity('event', '${item.id}')">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// 4. Gallery list table
function renderGalleryListTable(gallery) {
  const container = document.getElementById('gallery-list-table');
  if (!container) return;

  container.innerHTML = '';
  gallery.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="row-info-col">
        <span class="row-title">${item.caption}</span>
        <span class="row-sub">${item.category} • Path: ${item.image}</span>
      </div>
      <div class="row-actions-col">
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('gallery', ${index}, -1)">▲</button>
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('gallery', ${index}, 1)">▼</button>
        <button class="action-ico-btn" onclick="window.showCRUDModal('gallery', '${item.id}')">Edit</button>
        <button class="action-ico-btn btn-delete" onclick="window.deleteEntity('gallery', '${item.id}')">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// 5. Team list table
function renderTeamListTable(team) {
  const container = document.getElementById('team-list-table');
  if (!container) return;

  container.innerHTML = '';
  team.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="row-info-col">
        <span class="row-title">${item.name}</span>
        <span class="row-sub">${item.role} • ${item.email}</span>
      </div>
      <div class="row-actions-col">
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('team', ${index}, -1)">▲</button>
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('team', ${index}, 1)">▼</button>
        <button class="action-ico-btn" onclick="window.showCRUDModal('team', '${item.id}')">Edit</button>
        <button class="action-ico-btn btn-delete" onclick="window.deleteEntity('team', '${item.id}')">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// 6. Testimonials list table
function renderTestimonialsListTable(testimonials) {
  const container = document.getElementById('testimonials-list-table');
  if (!container) return;

  container.innerHTML = '';
  testimonials.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="row-info-col">
        <span class="row-title">${item.name}</span>
        <span class="row-sub">${item.role}</span>
      </div>
      <div class="row-actions-col">
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('testimonial', ${index}, -1)">▲</button>
        <button class="action-ico-btn btn-arrow" onclick="window.reorderEntity('testimonial', ${index}, 1)">▼</button>
        <button class="action-ico-btn" onclick="window.showCRUDModal('testimonial', '${item.id}')">Edit</button>
        <button class="action-ico-btn btn-delete" onclick="window.deleteEntity('testimonial', '${item.id}')">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

/* ==========================================================================
   CRUD POPUP MECHANICS (ADD / EDIT / DELETE / REORDER)
   ========================================================================== */
const crudDialog = document.getElementById('crud-dialog');
const crudCloseBtn = document.getElementById('crud-close-btn');

if (crudCloseBtn) {
  crudCloseBtn.addEventListener('click', () => crudDialog.close());
  crudDialog.addEventListener('click', (e) => {
    if (e.target === crudDialog || e.target.classList.contains('admin-dialog-overlay')) {
      crudDialog.close();
    }
  });
}

// Expose showCRUDModal to global window scope so HTML buttons trigger it
window.showCRUDModal = function(type, id) {
  const db = Storage.getData();
  const titleEl = document.getElementById('crud-title');
  const typeInput = document.getElementById('crud-item-type');
  const idInput = document.getElementById('crud-item-id');
  const fieldsContainer = document.getElementById('dynamic-form-fields');

  typeInput.value = type;
  idInput.value = id || '';
  titleEl.textContent = id ? `Modify ${type.toUpperCase()}` : `Add New ${type.toUpperCase()}`;
  fieldsContainer.innerHTML = '';

  let item = null;
  if (id) {
    if (type === 'services') item = db.whatWeDo.cards.find(x => x.id === id);
    else if (type === 'project') item = db.projects.find(x => x.id === id);
    else if (type === 'event') item = db.timeline.find(x => x.id === id);
    else if (type === 'gallery') item = db.gallery.find(x => x.id === id);
    else if (type === 'team') item = db.team.find(x => x.id === id);
    else if (type === 'testimonial') item = db.testimonials.find(x => x.id === id);
  }

  // Inject input slots based on item Type
  if (type === 'services') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>SERVICE TITLE</label>
        <input type="text" id="field-title" class="admin-input" value="${item?.title || ''}" required>
      </div>
      <div class="form-group">
        <label>ICON / EMOJI</label>
        <input type="text" id="field-icon" class="admin-input" value="${item?.icon || '⚡'}" required>
      </div>
      <div class="form-group">
        <label>DESCRIPTION</label>
        <textarea id="field-desc" class="admin-input admin-textarea" required>${item?.desc || ''}</textarea>
      </div>
    `;
  } else if (type === 'project') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>PROJECT TITLE</label>
        <input type="text" id="field-title" class="admin-input" value="${item?.title || ''}" required>
      </div>
      <div class="form-group">
        <label>CATEGORY</label>
        <input type="text" id="field-category" class="admin-input" value="${item?.category || ''}" required>
      </div>
      <div class="form-group">
        <label>YEAR</label>
        <input type="text" id="field-year" class="admin-input" value="${item?.year || ''}" required>
      </div>
      <div class="form-group">
        <label>MOCKUP IMAGE ASSET PATH</label>
        <input type="text" id="field-image" class="admin-input" value="${item?.image || 'assets/images/project_smartcampus.jpg'}" required>
      </div>
      <div class="form-group">
        <label>EXTERNAL / GITHUB LINK</label>
        <input type="url" id="field-link" class="admin-input" value="${item?.link || '#'}" required>
      </div>
      <div class="form-group">
        <label>DESCRIPTION DETAIL</label>
        <textarea id="field-desc" class="admin-input admin-textarea" required>${item?.desc || ''}</textarea>
      </div>
      <label class="crud-checkbox-wrapper">
        <input type="checkbox" id="field-featured" ${item?.featured ? 'checked' : ''}> Feature on Portfolio Showcase
      </label>
    `;
  } else if (type === 'event') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>EVENT DATE / PERIOD</label>
        <input type="text" id="field-date" class="admin-input" placeholder="e.g. August 2026" value="${item?.date || ''}" required>
      </div>
      <div class="form-group">
        <label>EVENT TITLE</label>
        <input type="text" id="field-title" class="admin-input" value="${item?.title || ''}" required>
      </div>
      <div class="form-group">
        <label>LOCATION</label>
        <input type="text" id="field-location" class="admin-input" value="${item?.location || ''}" required>
      </div>
      <div class="form-group">
        <label>EVENT SUMMARY</label>
        <textarea id="field-desc" class="admin-input admin-textarea" required>${item?.desc || ''}</textarea>
      </div>
    `;
  } else if (type === 'gallery') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>PHOTO ASSET PATH</label>
        <input type="text" id="field-image" class="admin-input" value="${item?.image || 'assets/images/gallery_tech_event.jpg'}" required>
      </div>
      <div class="form-group">
        <label>CAPTION / LABEL</label>
        <input type="text" id="field-caption" class="admin-input" value="${item?.caption || ''}" required>
      </div>
      <div class="form-group">
        <label>CATEGORY TYPE</label>
        <select id="field-category" class="admin-input" style="background-color: var(--bg-card);">
          <option value="Workshops" ${item?.category === 'Workshops' ? 'selected' : ''}>Workshops</option>
          <option value="Design" ${item?.category === 'Design' ? 'selected' : ''}>Design</option>
          <option value="Exhibitions" ${item?.category === 'Exhibitions' ? 'selected' : ''}>Exhibitions</option>
          <option value="Hardware" ${item?.category === 'Hardware' ? 'selected' : ''}>Hardware</option>
        </select>
      </div>
    `;
  } else if (type === 'team') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>MEMBER NAME</label>
        <input type="text" id="field-name" class="admin-input" value="${item?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>ROLE / POSITION</label>
        <input type="text" id="field-role" class="admin-input" value="${item?.role || ''}" required>
      </div>
      <div class="form-group">
        <label>PHOTO PATH</label>
        <input type="text" id="field-image" class="admin-input" value="${item?.image || 'assets/images/team_member.jpg'}" required>
      </div>
      <div class="form-group">
        <label>GITHUB LINK</label>
        <input type="url" id="field-github" class="admin-input" value="${item?.github || 'https://github.com'}" required>
      </div>
      <div class="form-group">
        <label>LINKEDIN LINK</label>
        <input type="url" id="field-linkedin" class="admin-input" value="${item?.linkedin || 'https://linkedin.com'}" required>
      </div>
      <div class="form-group">
        <label>EMAIL CHANNELS</label>
        <input type="email" id="field-email" class="admin-input" value="${item?.email || ''}" required>
      </div>
      <div class="form-group">
        <label>BRIEF PERSONAL BIO</label>
        <textarea id="field-bio" class="admin-input admin-textarea" required>${item?.bio || ''}</textarea>
      </div>
    `;
  } else if (type === 'testimonial') {
    fieldsContainer.innerHTML = `
      <div class="form-group">
        <label>STUDENT / ALUMNUS NAME</label>
        <input type="text" id="field-name" class="admin-input" value="${item?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>ROLE / DESIGNATION</label>
        <input type="text" id="field-role" class="admin-input" value="${item?.role || ''}" required>
      </div>
      <div class="form-group">
        <label>REVIEW TRANSCRIPT</label>
        <textarea id="field-review" class="admin-input admin-textarea" required>${item?.review || ''}</textarea>
      </div>
    `;
  }

  crudDialog.showModal();
};

function initCRUDFormSubmit() {
  const form = document.getElementById('crud-form-element');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const db = Storage.getData();
    
    const type = document.getElementById('crud-item-type').value;
    const id = document.getElementById('crud-item-id').value;

    let targetArray = null;
    if (type === 'services') targetArray = db.whatWeDo.cards;
    else if (type === 'project') targetArray = db.projects;
    else if (type === 'event') targetArray = db.timeline;
    else if (type === 'gallery') targetArray = db.gallery;
    else if (type === 'team') targetArray = db.team;
    else if (type === 'testimonial') targetArray = db.testimonials;

    if (!targetArray) return;

    const dataObj = {};
    
    // Fill specific inputs depending on entity type
    if (type === 'services') {
      dataObj.title = document.getElementById('field-title').value;
      dataObj.icon = document.getElementById('field-icon').value;
      dataObj.desc = document.getElementById('field-desc').value;
    } else if (type === 'project') {
      dataObj.title = document.getElementById('field-title').value;
      dataObj.category = document.getElementById('field-category').value;
      dataObj.year = document.getElementById('field-year').value;
      dataObj.image = document.getElementById('field-image').value;
      dataObj.link = document.getElementById('field-link').value;
      dataObj.desc = document.getElementById('field-desc').value;
      dataObj.featured = document.getElementById('field-featured').checked;
    } else if (type === 'event') {
      dataObj.date = document.getElementById('field-date').value;
      dataObj.title = document.getElementById('field-title').value;
      dataObj.location = document.getElementById('field-location').value;
      dataObj.desc = document.getElementById('field-desc').value;
    } else if (type === 'gallery') {
      dataObj.image = document.getElementById('field-image').value;
      dataObj.caption = document.getElementById('field-caption').value;
      dataObj.category = document.getElementById('field-category').value;
    } else if (type === 'team') {
      dataObj.name = document.getElementById('field-name').value;
      dataObj.role = document.getElementById('field-role').value;
      dataObj.image = document.getElementById('field-image').value;
      dataObj.github = document.getElementById('field-github').value;
      dataObj.linkedin = document.getElementById('field-linkedin').value;
      dataObj.email = document.getElementById('field-email').value;
      dataObj.bio = document.getElementById('field-bio').value;
    } else if (type === 'testimonial') {
      dataObj.name = document.getElementById('field-name').value;
      dataObj.role = document.getElementById('field-role').value;
      dataObj.review = document.getElementById('field-review').value;
    }

    if (id) {
      // Edit existing
      const index = targetArray.findIndex(x => x.id === id);
      if (index !== -1) {
        targetArray[index] = { ...targetArray[index], ...dataObj };
      }
    } else {
      // Create new
      dataObj.id = `${type.slice(0, 3)}-${Date.now()}`;
      targetArray.push(dataObj);
    }

    // Save database
    Storage.saveData(db);

    // Refresh display
    renderAllTables();
    updateDashboardCount(db);
    updatePreview();
    
    crudDialog.close();
  });
}

// Expose deleteEntity to global window scope
window.deleteEntity = function(type, id) {
  if (confirm(`Are you sure you want to delete this ${type}?`)) {
    const db = Storage.getData();
    let targetArray = null;

    if (type === 'project') targetArray = db.projects;
    else if (type === 'event') targetArray = db.timeline;
    else if (type === 'gallery') targetArray = db.gallery;
    else if (type === 'team') targetArray = db.team;
    else if (type === 'testimonial') targetArray = db.testimonials;

    if (!targetArray) return;

    const filtered = targetArray.filter(x => x.id !== id);
    
    if (type === 'project') db.projects = filtered;
    else if (type === 'event') db.timeline = filtered;
    else if (type === 'gallery') db.gallery = filtered;
    else if (type === 'team') db.team = filtered;
    else if (type === 'testimonial') db.testimonials = filtered;

    Storage.saveData(db);
    renderAllTables();
    updateDashboardCount(db);
    updatePreview();
  }
};

// Expose reorderEntity to global window scope
window.reorderEntity = function(type, index, direction) {
  const db = Storage.getData();
  let targetArray = null;

  if (type === 'services') targetArray = db.whatWeDo.cards;
  else if (type === 'project') targetArray = db.projects;
  else if (type === 'event') targetArray = db.timeline;
  else if (type === 'gallery') targetArray = db.gallery;
  else if (type === 'team') targetArray = db.team;
  else if (type === 'testimonial') targetArray = db.testimonials;

  if (!targetArray) return;

  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= targetArray.length) return;

  // Swap positions
  const temp = targetArray[index];
  targetArray[index] = targetArray[targetIndex];
  targetArray[targetIndex] = temp;

  Storage.saveData(db);
  renderAllTables();
  updatePreview();
};
