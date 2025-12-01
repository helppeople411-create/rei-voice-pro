import { LeadInfo, OfferInfo } from '../types';

const STORAGE_KEYS = {
  LEADS: 'rei_voice_pro_leads',
  OFFERS: 'rei_voice_pro_offers',
  TRANSCRIPT: 'rei_voice_pro_transcript',
} as const;

/**
 * Storage utility for persisting application data
 */
export class Storage {
  /**
   * Save leads to localStorage
   */
  static saveLeads(leads: LeadInfo[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    } catch (error) {
      console.error('Failed to save leads:', error);
    }
  }

  /**
   * Load leads from localStorage
   */
  static loadLeads(): LeadInfo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load leads:', error);
      return [];
    }
  }

  /**
   * Save offers to localStorage
   */
  static saveOffers(offers: OfferInfo[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    } catch (error) {
      console.error('Failed to save offers:', error);
    }
  }

  /**
   * Load offers from localStorage
   */
  static loadOffers(): OfferInfo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load offers:', error);
      return [];
    }
  }

  /**
   * Clear all stored data
   */
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Export all data as JSON
   */
  static exportData(): string {
    const data = {
      leads: this.loadLeads(),
      offers: this.loadOffers(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON string
   */
  static importData(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.leads && Array.isArray(data.leads)) {
        this.saveLeads(data.leads);
      }
      
      if (data.offers && Array.isArray(data.offers)) {
        this.saveOffers(data.offers);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Invalid JSON format' 
      };
    }
  }
}
