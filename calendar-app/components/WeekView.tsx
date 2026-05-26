import { Clock, Users, MapPin, ChevronLeft, ChevronRight, CalendarDays, Plus } from 'lucide-react';
import { useState } from 'react';
import Tooltip from './Tooltip';
import type { CalendarEvent, CalendarCategory } from '../types';
import { calculateTimeUntilEvent } from '../utils/storage';

interface WeekViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onNewEvent: (date: Date) => void;
  categories: CalendarCategory[];
}

export default function WeekView({ events, currentDate, onDateChange, onEventClick, onNewEvent, categories }: WeekViewProps) {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; date: Date } | null>(null);
  
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const timeSlots = Array.from({ length: 9 }, (_, i) => ({
    hour: 8 + i,
    label: `${8 + i}:00`,
  }));

  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  const getEventsForDay = (dayOffset: number): CalendarEvent[] => {
    const dayStart = new Date(startOfWeek);
    dayStart.setDate(startOfWeek.getDate() + dayOffset);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= dayStart && eventStart < dayEnd;
    });
  };

  const getEventPosition = (event: CalendarEvent) => {
    const eventStart = new Date(event.start);
    const dayOffset = eventStart.getDay();
    const hourOffset = eventStart.getHours() - 8;
    const minuteOffset = eventStart.getMinutes() / 60;
    const top = (hourOffset + minuteOffset) * 80;
    
    const eventDuration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
    const maxHeight = (17 - 8) * 80 - 4;
    const height = Math.min(Math.max(eventDuration * 80 - 4, 32), maxHeight);
    
    return { dayOffset, top, height, isOverflow: eventDuration * 80 - 4 > maxHeight };
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Tooltip content="上一周">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() - 7);
                onDateChange(newDate);
              }}
              className="p-2 rounded-lg glass-effect hover:bg-white/20 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
          </Tooltip>
          
          <Tooltip content="回到今天">
            <button
              onClick={() => onDateChange(new Date())}
              className="px-3 py-2 rounded-lg glass-effect hover:bg-white/20 transition-all duration-200 text-sm text-white/80 flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4" />
              今天
            </button>
          </Tooltip>
          
          <Tooltip content="下一周">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() + 7);
                onDateChange(newDate);
              }}
              className="p-2 rounded-lg glass-effect hover:bg-white/20 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
          </Tooltip>
        </div>
        
        <div className="text-white/80 font-medium">
          {formatDate(startOfWeek)} - {formatDate(endOfWeek)}
        </div>
      </div>

      <div className="flex-1 glass-effect rounded-2xl overflow-hidden">
        <div className="grid grid-cols-8 h-full">
          <div className="border-r border-white/10 bg-white/5">
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="h-[80px] flex items-center justify-end pr-3 text-white/50 text-sm">
                {slot.label}
              </div>
            ))}
          </div>

          {Array.from({ length: 7 }).map((_, dayOffset) => {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + dayOffset);
            dayDate.setHours(0, 0, 0, 0);
            const isToday = dayDate.getTime() === today.getTime();
            const dayEvents = getEventsForDay(dayOffset);

            const handleContextMenu = (e: React.MouseEvent) => {
              e.preventDefault();
              const clickedHour = Math.max(8, Math.min(17, 8 + Math.floor((e.clientY - e.currentTarget.getBoundingClientRect().top) / 80)));
              const eventDate = new Date(dayDate);
              eventDate.setHours(clickedHour, 0, 0, 0);
              setContextMenu({ x: e.clientX, y: e.clientY, date: eventDate });
            };
            
            return (
              <div
                key={dayOffset}
                className={`relative border-r border-white/10 last:border-r-0 ${
                  isToday ? 'bg-blue-500/10' : 'bg-white/[0.02]'
                }`}
                onContextMenu={handleContextMenu}
              >
                <div className={`p-3 text-center border-b border-white/10 ${
                  isToday ? 'bg-blue-500/20' : ''
                }`}>
                  <div className={`text-white/40 text-xs ${isToday ? 'text-blue-300' : ''}`}>
                    {days[dayOffset]}
                  </div>
                  <div className={`text-white/90 font-medium ${
                    isToday ? 'text-blue-400' : ''
                  }`}>
                    {dayDate.getDate()}
                  </div>
                </div>

                <div className="relative min-h-[640px]">
                  {dayEvents.map((event) => {
                    const { top, height, isOverflow } = getEventPosition(event);
                    const categoryColor = getCategoryColor(event.category);
                    const isCompleted = event.status === 'completed';
                    const isHovered = hoveredEvent === event.id;
                    
                    return (
                      <div
                        key={event.id}
                        className={`absolute left-2 right-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-gray-500/30' 
                            : 'hover-lift'
                        } ${isHovered ? 'z-10 scale-[1.02]' : ''}`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: isCompleted ? undefined : categoryColor,
                        }}
                        onClick={() => onEventClick(event)}
                        onMouseEnter={() => setHoveredEvent(event.id)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      >
                        <div className={`p-2 h-full flex flex-col ${
                          isCompleted ? 'opacity-70' : ''
                        } ${isOverflow ? 'justify-between' : 'justify-between'}`}>
                          <div className={`${isOverflow ? 'overflow-hidden' : ''}`}>
                            <div className={`text-sm font-medium leading-tight ${
                              isCompleted ? 'text-white/60 line-through' : 'text-white'
                            }`}>
                              {event.title}
                            </div>
                            {!isOverflow && (
                              <>
                                <div className="text-xs text-white/60 mt-1">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {new Date(event.start).toLocaleTimeString('zh-CN', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                                {event.location && (
                                  <div className="text-xs text-white/50 mt-0.5 truncate">
                                    {event.location}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          
                          {!isCompleted && (
                            <div className="text-xs text-white/70 mt-1 flex items-center justify-between">
                              <span>{calculateTimeUntilEvent(event.start)}</span>
                              {isOverflow && (
                                <span className="text-white/50">...</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 glass-effect-strong rounded-xl py-2 min-w-[160px] animate-scale-in"
            style={{
              left: Math.min(contextMenu.x, window.innerWidth - 180),
              top: Math.min(contextMenu.y, window.innerHeight - 100),
            }}
          >
            <button
              onClick={() => {
                onNewEvent(contextMenu.date);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              创建日程
            </button>
          </div>
        </>
      )}
    </div>
  );
}
