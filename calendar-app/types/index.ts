export type EventStatus = 'pending' | 'reminded' | 'completed';

export type ReminderTime = 5 | 10 | 20 | 30 | 60 | 120;
export type SnoozeTime = 5 | 10 | 15 | 30 | 60;

export type CalendarCategory = {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
};

export type ThemeOption = {
  id: string;
  name: string;
  primaryColor: string;
};

export type BackgroundOption = {
  id: string;
  name: string;
  url: string;
};

export type MusicOption = {
  id: string;
  name: string;
  artist: string;
};

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  participants: string[];
  category: string;
  status: EventStatus;
  reminderTime: ReminderTime;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeletedEvent extends CalendarEvent {
  deletedAt: Date;
}

export interface UserSettings {
  defaultReminderTime: ReminderTime;
  defaultSnoozeTime: SnoozeTime;
  autoPlayMusic: boolean;
  theme: string;
  backgroundId: string;
  musicId: string;
}

export interface NotificationItem {
  id: string;
  eventId: string;
  title: string;
  time: Date;
  read: boolean;
}
