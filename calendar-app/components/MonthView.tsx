import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useState } from 'react';
import Tooltip from './Tooltip';
import type { CalendarEvent, CalendarCategory } from '../types';

interface MonthViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  categories: CalendarCategory[];
}

export default function MonthView({ events, currentDate, onDateChange, onEventClick, categories }: MonthViewProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getEventsForDate = (date: number): CalendarEvent[] => {
    const targetDate = new Date(year, month, date);
    return events.filter(event => {
      const eventStart = new Date(event.start);
      eventStart.setHours(0, 0, 0, 0);
      const eventEnd = new Date(event.end);
      eventEnd.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);
      return targetDate >= eventStart && targetDate <= eventEnd;
    });
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(year, month + direction, 1);
    onDateChange(newDate);
  };

  const handleDateClick = (date: number) => {
    const clickedDate = new Date(year, month, date);
    setSelectedDate(clickedDate);
    onDateChange(clickedDate);
  };

  const hoveredEvents = hoveredDate ? getEventsForDate(hoveredDate.getDate()) : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Tooltip content="上个月">
            <button
              onClick={() => navigateMonth(-1)}
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
          
          <Tooltip content="下个月">
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg glass-effect hover:bg-white/20 transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5 text-white/70" />
            </button>
          </Tooltip>
        </div>
        
        <div className="text-white/80 font-medium">
          {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
        </div>
      </div>

      <div className="flex-1 glass-effect rounded-2xl p-4 overflow-auto">
        <div className="grid grid-cols-7 gap-1 mb-3">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="text-center text-white/40 text-sm py-2 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = i + 1;
            const currentDateObj = new Date(year, month, date);
            currentDateObj.setHours(0, 0, 0, 0);
            const isToday = currentDateObj.getTime() === today.getTime();
            const isSelected = selectedDate && selectedDate.getTime() === currentDateObj.getTime();
            const dayEvents = getEventsForDate(date);
            const hasEvents = dayEvents.length > 0;
            
            return (
              <div
                key={date}
                className={`relative aspect-square rounded-xl p-2 cursor-pointer transition-all duration-200 ${
                  isToday 
                    ? 'bg-blue-500/30 ring-1 ring-blue-500' 
                    : isSelected 
                      ? 'bg-white/20' 
                      : 'hover:bg-white/10'
                }`}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(new Date(year, month, date))}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div className={`text-sm font-medium ${
                  isToday ? 'text-blue-400' : isSelected ? 'text-white' : 'text-white/70'
                }`}>
                  {date}
                </div>
                
                {hasEvents && (
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getCategoryColor(event.category) }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-xs text-white/50">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {hoveredDate && hoveredEvents.length > 0 && (
          <div className="mt-4 glass-effect-strong rounded-xl p-3 animate-slide-up">
            <div className="text-white/60 text-sm mb-2">
              {hoveredDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'long' })}
            </div>
            <div className="space-y-2 max-h-48 overflow-auto scrollbar-hide">
              {hoveredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200 ${
                    event.status === 'completed' ? 'opacity-70' : ''
                  }`}
                  style={{ 
                    borderLeft: `3px solid ${getCategoryColor(event.category)}`,
                    backgroundColor: event.status === 'completed' ? 'rgba(107, 114, 128, 0.2)' : undefined
                  }}
                  onClick={() => onEventClick(event)}
                >
                  <div className={`text-sm font-medium ${
                    event.status === 'completed' ? 'text-white/60 line-through' : 'text-white'
                  }`}>
                    {event.title}
                  </div>
                  <div className="text-xs text-white/50">
                    {new Date(event.start).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(event.end).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
