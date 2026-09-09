/**
 * Main Application Bootstrapper
 * Orchestrates imports, initializes local database and triggers page renders.
 */

import { Storage } from './storage.js';
import { ContentManager } from './contentManager.js';
import { Animations } from './animations.js';
import { UI } from './ui.js';

const startApp = async () => {
  // 1. Initialize performance animations and preloader immediately
  try {
    Animations.init();
  } catch (e) {
    console.error('Animations init error:', e);
  }

  // 2. Initialize database (Supabase or default local JSON)
  try {
    const db = await Storage.initialize();
    if (db) {
      ContentManager.renderAll(db);
    }
  } catch (e) {
    console.error('Storage/ContentManager init error:', e);
  }

  // 3. Bind UI interactions
  try {
    UI.init();
  } catch (e) {
    console.error('UI init error:', e);
  }

  // 4. Live update listener
  window.addEventListener('storage', () => {
    try {
      const updatedDb = Storage.getData();
      if (updatedDb) {
        console.log('Local storage update detected. Re-rendering sections...');
        ContentManager.renderAll(updatedDb);
      }
    } catch (e) {
      console.error('Storage update re-render error:', e);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
