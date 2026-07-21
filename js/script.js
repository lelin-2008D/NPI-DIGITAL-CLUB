/**
 * Main Application Bootstrapper
 * Orchestrates imports, initializes local database and triggers page renders.
 */

import { Storage } from './storage.js';
import { ContentManager } from './contentManager.js';
import { Animations } from './animations.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize local database (will fetch default JSON if empty)
  const db = await Storage.initialize();

  // 2. Render all content layers onto the DOM dynamically
  ContentManager.renderAll(db);

  // 3. Bind UI interactions (clicks, lightbox, form capture, drag timeline)
  UI.init();

  // 4. Initialize performance animations (lerp cursor, scroll triggers, canvas)
  Animations.init();

  // 5. Live update listener
  // Whenever localStorage changes (e.g. from the Admin Dashboard in another tab or iframe), re-render content
  window.addEventListener('storage', () => {
    const updatedDb = Storage.getData();
    if (updatedDb) {
      console.log('Local storage update detected. Re-rendering sections...');
      ContentManager.renderAll(updatedDb);
    }
  });
});
