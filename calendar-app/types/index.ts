export type EventStatus = 'pending' | 'reminded' | 'completed';

export type ReminderTime = 5 | 10 | 20 | 30 | 60 | 120;

export type CalendarCategory = {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
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
  autoPlayMusic: boolean;
  theme: 'light' | 'dark';
}

export interface NotificationItem {
  id: string;
  eventId: string;
  title: string;
  time: Date;
  read: boolean;
}
