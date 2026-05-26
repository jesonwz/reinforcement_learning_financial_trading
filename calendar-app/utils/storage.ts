import { CalendarEvent, DeletedEvent, CalendarCategory, UserSettings, NotificationItem, ReminderTime } from '../types';

const EVENTS_KEY = 'calendar_events';
const DELETED_EVENTS_KEY = 'calendar_deleted_events';
const CATEGORIES_KEY = 'calendar_categories';
const SETTINGS_KEY = 'calendar_settings';
const NOTIFICATIONS_KEY = 'calendar_notifications';
const RECYCLE_BIN_DAYS = 30;

const defaultCategories: CalendarCategory[] = [
  { id: 'cat-1', name: '团队会议', color: '#3b82f6', enabled: true },
  { id: 'cat-2', name: '客户电话', color: '#8b5cf6', enabled: true },
  { id: 'cat-3', name: '午餐约会', color: '#f59e0b', enabled: true },
  { id: 'cat-4', name: '项目评审', color: '#10b981', enabled: true },
  { id: 'cat-5', name: '健身运动', color: '#ec4899', enabled: true },
  { id: 'cat-6', name: '个人事务', color: '#06b6d4', enabled: true },
];

const defaultSettings: UserSettings = {
  defaultReminderTime: 10,
  autoPlayMusic: false,
  theme: 'dark',
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getEvents = (): CalendarEvent[] => {
  try {
    const data = localStorage.getItem(EVENTS_KEY);
    if (data) {
      const events = JSON.parse(data);
      return events.map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
        createdAt: new Date(e.createdAt),
        updatedAt: new Date(e.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load events:', error);
  }
  return getDefaultEvents();
};

export const saveEvents = (events: CalendarEvent[]): void => {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events:', error);
  }
};

export const getDefaultEvents = (): CalendarEvent[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    {
      id: 'event-1',
      title: '团队周会',
      description: '每周例行团队会议，讨论项目进展',
      start: new Date(today.getTime() + 9 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 10 * 60 * 60 * 1000),
      location: '会议室A',
      participants: ['张三', '李四', '王五'],
      category: 'cat-1',
      status: 'pending',
      reminderTime: 10,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'event-2',
      title: '客户电话会议',
      description: '与客户讨论需求变更',
      start: new Date(today.getTime() + 14 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 15 * 60 * 60 * 1000),
      location: '线上',
      participants: ['客户A'],
      category: 'cat-2',
      status: 'pending',
      reminderTime: 10,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'event-3',
      title: '午餐约会',
      description: '与同事共进午餐',
      start: new Date(today.getTime() + 12 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 13 * 60 * 60 * 1000),
      location: '公司餐厅',
      participants: ['赵六'],
      category: 'cat-3',
      status: 'completed',
      reminderTime: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'event-4',
      title: '项目评审会',
      description: 'Q2项目进度评审',
      start: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
      location: '大会议室',
      participants: ['张三', '李四', '王五', '陈七'],
      category: 'cat-4',
      status: 'pending',
      reminderTime: 30,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'event-5',
      title: '健身房锻炼',
      description: '有氧运动 + 力量训练',
      start: new Date(today.getTime() + 18 * 60 * 60 * 1000),
      end: new Date(today.getTime() + 19 * 60 * 60 * 1000),
      location: '健身房',
      participants: [],
      category: 'cat-5',
      status: 'pending',
      reminderTime: 20,
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const getCategories = (): CalendarCategory[] => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
  return defaultCategories;
};

export const saveCategories = (categories: CalendarCategory[]): void => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories:', error);
  }
};

export const getSettings = (): UserSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const createEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): CalendarEvent => {
  const now = new Date();
  const newEvent: CalendarEvent = {
    ...eventData,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  
  const events = getEvents();
  events.push(newEvent);
  saveEvents(events);
  
  return newEvent;
};

export const updateEvent = (id: string, updates: Partial<CalendarEvent>): CalendarEvent | null => {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  
  if (index === -1) return null;
  
  events[index] = {
    ...events[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  saveEvents(events);
  return events[index];
};

export const deleteEvent = (id: string): boolean => {
  const events = getEvents();
  const eventToDelete = events.find(e => e.id === id);
  
  if (!eventToDelete) return false;
  
  const deletedEvents = getDeletedEvents();
  deletedEvents.push({
    ...eventToDelete,
    deletedAt: new Date(),
  });
  saveDeletedEvents(deletedEvents);
  
  const filteredEvents = events.filter(e => e.id !== id);
  saveEvents(filteredEvents);
  
  return true;
};

export const getDeletedEvents = (): DeletedEvent[] => {
  try {
    const data = localStorage.getItem(DELETED_EVENTS_KEY);
    if (data) {
      const events = JSON.parse(data);
      return events
        .map((e: any) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
          deletedAt: new Date(e.deletedAt),
        }))
        .filter((e: DeletedEvent) => {
          const daysSinceDeletion = (new Date().getTime() - e.deletedAt.getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceDeletion <= RECYCLE_BIN_DAYS;
        });
    }
  } catch (error) {
    console.error('Failed to load deleted events:', error);
  }
  return [];
};

export const saveDeletedEvents = (events: DeletedEvent[]): void => {
  try {
    localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save deleted events:', error);
  }
};

export const restoreEvent = (id: string): boolean => {
  const deletedEvents = getDeletedEvents();
  const eventToRestore = deletedEvents.find(e => e.id === id);
  
  if (!eventToRestore) return false;
  
  const { deletedAt, ...event } = eventToRestore;
  const events = getEvents();
  events.push(event);
  saveEvents(events);
  
  const filteredDeleted = deletedEvents.filter(e => e.id !== id);
  saveDeletedEvents(filteredDeleted);
  
  return true;
};

export const getNotifications = (): NotificationItem[] => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (data) {
      const notifications = JSON.parse(data);
      return notifications.map((n: any) => ({
        ...n,
        time: new Date(n.time),
      }));
    }
  } catch (error) {
    console.error('Failed to load notifications:', error);
  }
  return [];
};

export const saveNotifications = (notifications: NotificationItem[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
};

export const addNotification = (eventId: string, title: string, time: Date): void => {
  const notifications = getNotifications();
  notifications.push({
    id: generateId(),
    eventId,
    title,
    time,
    read: false,
  });
  saveNotifications(notifications);
};

export const markNotificationAsRead = (id: string): void => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications[index].read = true;
    saveNotifications(notifications);
  }
};

export const getUnreadNotificationCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.read).length;
};

export const clearExpiredNotifications = (): void => {
  const notifications = getNotifications();
  const now = new Date();
  const validNotifications = notifications.filter(n => n.time.getTime() > now.getTime() - 24 * 60 * 60 * 1000);
  saveNotifications(validNotifications);
};

export const calculateTimeUntilEvent = (eventStart: Date): string => {
  const now = new Date();
  const diff = eventStart.getTime() - now.getTime();
  
  if (diff < 0) {
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}小时${minutes}分钟前`;
    }
    return `${minutes}分钟前`;
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟后`;
  }
  return `${minutes}分钟后`;
};

export const reminderOptions: { value: ReminderTime; label: string }[] = [
  { value: 5, label: '5分钟' },
  { value: 10, label: '10分钟' },
  { value: 20, label: '20分钟' },
  { value: 30, label: '30分钟' },
  { value: 60, label: '1小时' },
  { value: 120, label: '2小时' },
];
