export interface DailyMessage {
  id: string;
  title: string;
  message: string;
  date: string;
  unlocked: boolean;
}

export interface Compliment {
  id: string;
  category: string;
  text: string;
}

export interface Roast {
  id: string;
  text: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  audioEnabled: boolean;
  animationsEnabled: boolean;
}