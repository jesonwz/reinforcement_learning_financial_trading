'use client';

import { useState, useEffect, useCallback } from 'react';
import NaturalBackground from '../components/NaturalBackground';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import WeekView from '../components/WeekView';
import MonthView from '../components/MonthView';
import EventModal from '../components/EventModal';
import NotificationCenter from '../components/NotificationCenter';
import AIAssistant from '../components/AIAssistant';
import RecycleBin from '../components/RecycleBin';
import ViewSwitcher, { ViewType } from '../components/ViewSwitcher';
import MusicPlayer from '../components/MusicPlayer';
import type { CalendarEvent, CalendarCategory, EventStatus, DeletedEvent, NotificationItem } from '../types';
import { getEvents, saveEvents, createEvent, updateEvent, deleteEvent, getCategories, saveCategories, getDeletedEvents, restoreEvent, getNotifications, saveNotifications, addNotification, markNotificationAsRead, getUnreadNotificationCount, clearExpiredNotifications } from '../utils/storage';

export default function CalendarApp() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<CalendarCategory[]>([]);
  const [deletedEvents, setDeletedEvents] = useState<DeletedEvent[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    setEvents(getEvents());
    setCategories(getCategories());
    setDeletedEvents(getDeletedEvents());
    setNotifications(getNotifications());
    clearExpiredNotifications();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAIAssistantOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      events.forEach(event => {
        if (event.status !== 'completed') {
          const reminderTime = event.reminderTime * 60 * 1000;
          const eventStart = new Date(event.start).getTime();
          const reminderTimeStart = eventStart - reminderTime;
          
          if (now.getTime() >= reminderTimeStart && now.getTime() < eventStart) {
            const existingNotification = notifications.find(n => n.eventId === event.id);
            if (!existingNotification) {
              addNotification(event.id, event.title, new Date(event.start));
              setNotifications(prev => [...prev, {
                id: `${Date.now()}`,
                eventId: event.id,
                title: event.title,
                time: new Date(event.start),
                read: false,
              }]);
            }
          }
        }
      });
      setDeletedEvents(getDeletedEvents());
    }, 60000);

    return () => clearInterval(interval);
  }, [events, notifications]);

  const filteredEvents = events.filter(event => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.participants.some(p => p.toLowerCase().includes(query)) ||
      event.description.toLowerCase().includes(query)
    );
  }).filter(event => {
    const category = categories.find(c => c.id === event.category);
    return category?.enabled !== false;
  });

  const handleSaveEvent = useCallback((event: CalendarEvent) => {
    if (selectedEvent?.id === event.id) {
      updateEvent(event.id, event);
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    } else {
      const newEvent = createEvent({
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        participants: event.participants,
        category: event.category,
        status: event.status,
        reminderTime: event.reminderTime,
      });
      setEvents(prev => [...prev, newEvent]);
    }
  }, [selectedEvent]);

  const handleDeleteEvent = useCallback((id: string) => {
    deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
    setDeletedEvents(getDeletedEvents());
  }, []);

  const handleStatusChange = useCallback((id: string, status: EventStatus) => {
    updateEvent(id, { status });
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  }, []);

  const handleRestoreEvent = useCallback((id: string) => {
    restoreEvent(id);
    setDeletedEvents(getDeletedEvents());
    setEvents(getEvents());
  }, []);

  const handleCategoryToggle = useCallback((id: string) => {
    const updatedCategories = categories.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    setCategories(updatedCategories);
    saveCategories(updatedCategories);
  }, [categories]);

  const handleMarkNotificationAsRead = useCallback((id: string) => {
    markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const notificationCount = getUnreadNotificationCount();

  return (
    <div className="min-h-screen w-full relative">
      <NaturalBackground />
      
      <div className="relative z-10 h-screen flex flex-col">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notificationCount={notificationCount}
          onNotificationsClick={() => setIsNotificationCenterOpen(true)}
        />
        
        <div className="flex-1 flex overflow-hidden pt-20">
          <Sidebar
            categories={categories}
            onCategoryToggle={handleCategoryToggle}
            onAddEvent={() => {
              setIsNewEvent(true);
              setSelectedEvent(null);
              setIsEventModalOpen(true);
            }}
            currentDate={currentDate}
            onDateClick={setCurrentDate}
            events={filteredEvents}
          />
          
          <main className="flex-1 p-6 ml-64 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {currentView === 'week' ? '周视图' : '月视图'}
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <MusicPlayer
                  isPlaying={isMusicPlaying}
                  onToggle={() => setIsMusicPlaying(!isMusicPlaying)}
                />
                <ViewSwitcher
                  currentView={currentView}
                  onViewChange={setCurrentView}
                  onOpenRecycleBin={() => setIsRecycleBinOpen(true)}
                />
              </div>
            </div>
            
            <div className={`h-[calc(100%-80px)] ${currentView === 'month' ? 'overflow-auto' : ''}`}>
              {currentView === 'week' ? (
                <WeekView
                  events={filteredEvents}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  onEventClick={(event) => {
                    setSelectedEvent(event);
                    setIsNewEvent(false);
                    setIsEventModalOpen(true);
                  }}
                  categories={categories}
                />
              ) : (
                <MonthView
                  events={filteredEvents}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  onEventClick={(event) => {
                    setSelectedEvent(event);
                    setIsNewEvent(false);
                    setIsEventModalOpen(true);
                  }}
                  categories={categories}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
          setIsNewEvent(false);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        onStatusChange={handleStatusChange}
        categories={categories}
        isNew={isNewEvent}
      />

      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
      />

      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

      <RecycleBin
        isOpen={isRecycleBinOpen}
        onClose={() => setIsRecycleBinOpen(false)}
        deletedEvents={deletedEvents}
        onRestore={handleRestoreEvent}
        categories={categories}
      />
    </div>
  );
}
