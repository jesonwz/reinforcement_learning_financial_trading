import { Plus, Calendar, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';
import GlassCard from './GlassCard';
import type { CalendarCategory, CalendarEvent } from '../types';

interface SidebarProps {
  categories: CalendarCategory[];
  onCategoryToggle: (id: string) => void;
  onAddEvent: () => void;
  currentDate: Date;
  onDateClick: (date: Date) => void;
  events: CalendarEvent[];
}

export default function Sidebar({ categories, onCategoryToggle, onAddEvent, currentDate, onDateClick, events }: SidebarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const days = ['日', '一', '二', '三', '四', '五', '六'];
  
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
      return eventStart.getTime() === targetDate.getTime();
    });
  };

  const hasEvents = (date: number): boolean => {
    return getEventsForDate(date).length > 0;
  };

  const getEnabledCategories = () => categories.filter(c => c.enabled);

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 glass-effect border-r border-white/10 p-4 overflow-y-auto scrollbar-hide">
      <div className="space-y-4">
        <button
          onClick={onAddEvent}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>创建日程</span>
        </button>

        <GlassCard className="animate-fade-in-delay-1">
          <h3 className="text-white/80 font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
          </h3>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-white/40 text-xs py-1">
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
              const isSelected = currentDateObj.getMonth() === currentDate.getMonth() && date === currentDate.getDate();
              const hasEvent = hasEvents(date);
              
              return (
                <button
                  key={date}
                  onClick={() => onDateClick(new Date(year, month, date))}
                  className={`relative aspect-square rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${
                    isToday 
                      ? 'bg-blue-500 text-white' 
                      : isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  {date}
                  {hasEvent && (
                    <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                      isToday ? 'bg-white/80' : 'bg-blue-400'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="animate-fade-in-delay-2">
          <h3 className="text-white/80 font-medium mb-3">我的日历</h3>
          
          <div className="space-y-1">
            {categories.map((category) => {
              const isHovered = hoveredCategory === category.id;
              const isEnabled = category.enabled;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryToggle(category.id)}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 ${
                    isEnabled ? 'hover:bg-white/10' : 'opacity-50 hover:opacity-70'
                  } ${isHovered && isEnabled ? 'bg-white/10' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: isEnabled ? category.color : '#9ca3af' }}
                    />
                    <span className={`text-sm ${isEnabled ? 'text-white/80' : 'text-white/40'}`}>
                      {category.name}
                    </span>
                  </div>
                  <div className={`flex items-center ${isEnabled ? '' : 'opacity-30'}`}>
                    {isEnabled ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        <div className="text-center text-white/30 text-xs pt-4">
          {getEnabledCategories().length} / {categories.length} 日历已启用
        </div>
      </div>
    </aside>
  );
}
