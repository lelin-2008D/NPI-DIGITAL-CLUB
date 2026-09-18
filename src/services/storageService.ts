import { SupabaseService } from './supabaseService';
import type { SiteDatabase } from '../types/site';

export class StorageService {
  static STORAGE_KEY = 'npi_digital_db';
  static DEFAULT_DATA_PATH = '/data/default-data.json';

  static async initialize(options: { includeUnpublished?: boolean } = {}): Promise<SiteDatabase> {
    if (SupabaseService.isConfigured()) {
      try {
        const remoteData = await SupabaseService.fetchSiteData(options);
        if (remoteData) {
          this.saveLocalData(remoteData);
          return remoteData;
        }
      } catch (error) {
        console.warn('Error loading Supabase content, falling back to local data:', error);
      }
    }

    if (!this.isInitialized()) {
      try {
        const response = await fetch(this.DEFAULT_DATA_PATH);
        if (!response.ok) {
          throw new Error(`Failed to fetch default data: ${response.statusText}`);
        }
        const defaultData: SiteDatabase = await response.json();
        this.saveLocalData(defaultData);
        return defaultData;
      } catch (error) {
        console.error('Error fetching default data, using fallback object:', error);
        const fallback: SiteDatabase = {
          settings: { siteTitle: 'NPI Digital Club', metaDesc: '', metaKeywords: '', copyright: 'NPI Digital Club' },
          hero: { title: 'NPI DIGITAL CLUB', subtitle: 'Building Digital Innovators', description: '', exploreBtn: 'Explore Story' },
          story: { badge: 'ABOUT US', title: '', mission: '', vision: '', purpose: '', history: '', image: '', stats: [] },
          whatWeDo: { badge: 'OUR CRAFT', title: '', description: '', cards: [] },
          projects: [],
          timeline: [],
          team: [],
          gallery: [],
          testimonials: [],
          quote: { text: '', author: '' },
          contact: { email: '', phone: '', address: '', mapCoords: { lat: '', lng: '' } },
        };
        this.saveLocalData(fallback);
        return fallback;
      }
    }

    return this.getData()!;
  }

  static isInitialized(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  static getData(): SiteDatabase | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  static saveLocalData(data: SiteDatabase): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  }

  static async saveData(data: SiteDatabase): Promise<SiteDatabase> {
    if (SupabaseService.isConfigured()) {
      try {
        await SupabaseService.saveSiteData(data);
      } catch (error) {
        console.error('Failed to sync to Supabase:', error);
      }
    }
    this.saveLocalData(data);
    return data;
  }

  static async resetData(): Promise<SiteDatabase> {
    localStorage.removeItem(this.STORAGE_KEY);
    const response = await fetch(this.DEFAULT_DATA_PATH);
    if (!response.ok) {
      throw new Error(`Failed to fetch default data: ${response.statusText}`);
    }
    const defaultData: SiteDatabase = await response.json();
    await this.saveData(defaultData);
    return defaultData;
  }

  static exportJSON(): string {
    return JSON.stringify(this.getData(), null, 2);
  }

  static async importJSON(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (data && typeof data === 'object' && data.settings && data.hero) {
        await this.saveData(data);
        return true;
      }
      throw new Error('Invalid database schema structure');
    } catch (e) {
      console.error('Failed to import database JSON:', e);
      return false;
    }
  }
}
