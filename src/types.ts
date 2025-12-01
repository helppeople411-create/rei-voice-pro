export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr',
}

export interface AgentConfig {
  voiceName: VoiceName;
  systemInstruction: string;
}

export interface LiveConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export interface LeadInfo {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  propertyAddress?: string;
  motivation?: string;
  timestamp: string;
}

export interface OfferInfo {
  id: string;
  offerType: 'CASH' | 'SELLER_FINANCE' | 'SUB_TO' | 'LEASE_OPTION' | 'OTHER';
  purchasePrice: number;
  arv?: number; // Added ARV field
  downPayment?: number;
  interestRate?: number;
  termLength?: string;
  monthlyPayment?: number;
  closingDays?: number;
  contingencies?: string;
  timestamp: string;
}