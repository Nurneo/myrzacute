export interface DailyMessage {
  date: string; // Format: YYYY-MM-DD
  title: string;
  message: string;
}

export type PickupLine = string;
export type Roast = string;

export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  audioEnabled: boolean;
  animationsEnabled: boolean;
}