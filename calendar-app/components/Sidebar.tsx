import { Plus, Calendar, ChevronRight, Check, X, Edit2 } from 'lucide-react';
import { useState } from 'react';
import GlassCard from './GlassCard';
import type { CalendarCategory, CalendarEvent } from '../types';

interface SidebarProps {
  categories: CalendarCategory[];
  onCategoryToggle: (id: string) => void;
  onCategoryAdd: (category: Omit<CalendarCategory, 'id'>) => void;
  onCategoryDelete: (id: string) => void;
  onCategoryUpdate: (id: string, updates: Partial<CalendarCategory>) => void;
  onAddEvent: () => void;
  currentDate: Date;
  onDateClick: (date: Date) => void;
  events: CalendarEvent[];
}

export default function Sidebar({ categories, onCategoryToggle, onCategoryAdd, onCategoryDelete, onCategoryUpdate, onAddEvent, currentDate, onDateClick, events }: SidebarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const colorOptions = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', 
    '#ef4444', '#84cc16', '#f97316', '#a855f7'
  ];

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onCategoryAdd({
        name: newCategoryName.trim(),
        color: newCategoryColor,
        enabled: true,
      });
      setNewCategoryName('');
      setNewCategoryColor('#3b82f6');
      setShowAddCategory(false);
    }
  };

  const handleStartEdit = (category: CalendarCategory) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editingCategoryName.trim()) {
      onCategoryUpdate(id, { name: editingCategoryName.trim() });
    }
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

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
                  className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all duration-200 ${
                    isToday 
                      ? 'bg-blue-500 text-white' 
                      : isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:bg-white/10'
                  }`}
                  style={{ minHeight: '40px' }}
                >
                  <span className="leading-none flex-shrink-0">{date}</span>
                  {hasEvent && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                      isToday ? 'bg-white/80' : 'bg-blue-400'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="animate-fade-in-delay-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white/80 font-medium">我的日历</h3>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4 text-white/50" />
            </button>
          </div>
          
          {showAddCategory && (
            <div className="p-3 rounded-xl bg-white/5 mb-3 space-y-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="分类名称"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm placeholder-white/40 outline-none focus:ring-1 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex flex-wrap gap-1.5">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                      newCategoryColor === color ? 'ring-2 ring-white/50' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-400 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            {categories.map((category) => {
              const isHovered = hoveredCategory === category.id;
              const isEnabled = category.enabled;
              const isEditing = editingCategoryId === category.id;
              
              return (
                <div
                  key={category.id}
                  className={`w-full rounded-lg transition-all duration-200 ${
                    isEnabled ? 'hover:bg-white/10' : 'opacity-50'
                  }`}
                >
                  {isEditing ? (
                    <div className="p-2.5 flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: isEnabled ? category.color : '#9ca3af' }}
                      />
                      <input
                        type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="flex-1 bg-white/10 text-white text-sm outline-none rounded-lg px-2 py-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(category.id);
                          if (e.key === 'Escape') setEditingCategoryId(null);
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(category.id)}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                      >
                        <Check className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        onClick={() => setEditingCategoryId(null)}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-white/50" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onCategoryToggle(category.id)}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`w-full flex items-center justify-between p-2.5 ${
                        isHovered && isEnabled ? 'bg-white/10' : ''
                      }`}
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(category);
                          }}
                          className="p-1 rounded hover:bg-white/20 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-white/40" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCategoryDelete(category.id);
                          }}
                          className="p-1 rounded hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-red-400/70" />
                        </button>
                        <div className={`${isEnabled ? '' : 'opacity-30'}`}>
                          {isEnabled ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-white/30" />
                          )}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
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
