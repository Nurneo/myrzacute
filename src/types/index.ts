export interface DailyMessage {
  day: number;
  title: string;
  message: string;
}

export interface PickupLine {
  id: number;
  text: string;
}

export interface Roast {
  id: number;
  text: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  audioEnabled: boolean;
  animationsEnabled: boolean;
}