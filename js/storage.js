/**
 * Storage Class
 * Handles reading/writing the site database from localStorage.
 * Architects the storage layer so it can be easily replaced by REST API, Supabase, Firebase etc.
 */
export class Storage {
  static STORAGE_KEY = 'npi_digital_db';
  static DEFAULT_DATA_PATH = './data/default-data.json';

  /**
   * Initialize the database. If localStorage is empty, fetch the default-data.json file.
   * @returns {Promise<Object>} The database object
   */
  static async initialize() {
    if (!this.isInitialized()) {
      try {
        const response = await fetch(this.DEFAULT_DATA_PATH);
        if (!response.ok) {
          throw new Error(`Failed to fetch default data: ${response.statusText}`);
        }
        const defaultData = await response.json();
        this.saveData(defaultData);
        console.log('Database initialized with default data.');
        return defaultData;
      } catch (error) {
        console.error('Error initializing database, using local fallback:', error);
        // Minimal fallback in case network fetch fails
        const fallback = {
          settings: { siteTitle: 'NPI Digital Club', theme: {} },
          hero: { title: 'NPI DIGITAL CLUB', subtitle: 'Building Digital Innovators' },
          story: { stats: [] },
          projects: [],
          timeline: [],
          team: [],
          gallery: []
        };
        this.saveData(fallback);
        return fallback;
      }
    }
    return this.getData();
  }

  /**
   * Checks if database is initialized in localStorage
   * @returns {boolean}
   */
  static isInitialized() {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  /**
   * Retrieves the complete database object
   * @returns {Object} The parsed DB object
   */
  static getData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Saves the entire database object to localStorage
   * @param {Object} data - The DB object to save
   */
  static saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    // Trigger storage event manually for same-window updates
    window.dispatchEvent(new Event('storage'));
  }

  /**
   * Resets database back to default-data.json
   * @returns {Promise<Object>} The reset database object
   */
  static async resetData() {
    localStorage.removeItem(this.STORAGE_KEY);
    return await this.initialize();
  }

  /**
   * Exports database as a JSON string
   * @returns {string}
   */
  static exportJSON() {
    return JSON.stringify(this.getData(), null, 2);
  }

  /**
   * Imports database from a JSON string
   * @param {string} jsonString - The JSON string representing database
   * @returns {boolean} True if successful, false otherwise
   */
  static importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data && typeof data === 'object' && data.settings && data.hero) {
        this.saveData(data);
        return true;
      }
      throw new Error('Invalid database schema structure');
    } catch (e) {
      console.error('Failed to import database JSON:', e);
      return false;
    }
  }
}
