import { useState, useEffect } from 'react';
import { X, Clock, MapPin, Users, Calendar, Copy, Share2, Trash2, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import type { CalendarEvent, CalendarCategory, EventStatus, ReminderTime } from '../types';
import { reminderOptions } from '../utils/storage';

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: EventStatus) => void;
  categories: CalendarCategory[];
  isNew?: boolean;
}

export default function EventModal({ event, isOpen, onClose, onSave, onDelete, onStatusChange, categories, isNew = false }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
    participants: '',
    category: categories[0]?.id || '',
    reminderTime: 10 as ReminderTime,
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (event && isOpen) {
      const startStr = event.start.toISOString().slice(0, 16);
      const endStr = event.end.toISOString().slice(0, 16);
      setFormData({
        title: event.title,
        description: event.description,
        start: startStr,
        end: endStr,
        location: event.location,
        participants: event.participants.join(', '),
        category: event.category,
        reminderTime: event.reminderTime,
      });
    } else if (isOpen && isNew) {
      const now = new Date();
      const end = new Date(now.getTime() + 60 * 60 * 1000);
      setFormData({
        title: '',
        description: '',
        start: now.toISOString().slice(0, 16),
        end: end.toISOString().slice(0, 16),
        location: '',
        participants: '',
        category: categories[0]?.id || '',
        reminderTime: 10,
      });
    }
  }, [event, isOpen, isNew, categories]);

  const handleSubmit = () => {
    const startDate = new Date(formData.start);
    const now = new Date();
    
    if (startDate < now && startDate.getTime() + 60000 < now.getTime()) {
      setIsExpired(true);
      setShowExpiredWarning(true);
      return;
    }
    
    saveEvent();
  };

  const saveEvent = () => {
    const newEvent: CalendarEvent = {
      id: event?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      description: formData.description,
      start: new Date(formData.start),
      end: new Date(formData.end),
      location: formData.location,
      participants: formData.participants.split(',').map(p => p.trim()).filter(Boolean),
      category: formData.category,
      status: event?.status || 'pending',
      reminderTime: formData.reminderTime,
      createdAt: event?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSave(newEvent);
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  };

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const getStatusLabel = (status: EventStatus): string => {
    const labels = { pending: '未完成', reminded: '已提醒', completed: '已完成' };
    return labels[status];
  };

  const getStatusColor = (status: EventStatus): string => {
    const colors = { pending: 'bg-yellow-500', reminded: 'bg-blue-500', completed: 'bg-green-500' };
    return colors[status];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg mx-4 glass-effect-strong rounded-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isNew ? '创建日程' : '编辑日程'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1.5">标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-effect text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="输入日程标题"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                开始时间
              </label>
              <input
                type="datetime-local"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-effect text-white outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                结束时间
              </label>
              <input
                type="datetime-local"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-effect text-white outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              地点
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-effect text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="输入地点"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              参与者
            </label>
            <input
              type="text"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-effect text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="输入参与者，用逗号分隔"
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              分类
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFormData({ ...formData, category: category.id })}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    formData.category === category.id
                      ? 'ring-2 ring-white/50'
                      : 'hover:bg-white/10'
                  }`}
                  style={{ backgroundColor: formData.category === category.id ? category.color : 'rgba(255,255,255,0.1)' }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" />
              前置提醒
            </label>
            <div className="flex flex-wrap gap-2">
              {reminderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, reminderTime: option.value })}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    formData.reminderTime === option.value
                      ? 'bg-blue-500 text-white'
                      : 'glass-effect text-white/70 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-effect text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              rows={3}
              placeholder="输入日程描述"
            />
          </div>

          {!isNew && event && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">状态</span>
                <div className="flex gap-2">
                  {(['pending', 'reminded', 'completed'] as EventStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => onStatusChange(event.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-1 ${
                        event.status === status
                          ? `${getStatusColor(status)} text-white`
                          : 'glass-effect text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/10">
                <span>创建时间: {event.createdAt.toLocaleString('zh-CN')}</span>
                <span>最后修改: {event.updatedAt.toLocaleString('zh-CN')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          {!isNew && (
            <div className="flex gap-2">
              <button className="p-2 rounded-lg glass-effect hover:bg-white/20 transition-colors">
                <Copy className="w-4 h-4 text-white/70" />
              </button>
              <button className="p-2 rounded-lg glass-effect hover:bg-white/20 transition-colors">
                <Share2 className="w-4 h-4 text-white/70" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-lg glass-effect hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl glass-effect text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-400 hover:to-blue-500 transition-all duration-200"
            >
              {isNew ? '创建' : '保存'}
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm mx-4 glass-effect-strong rounded-2xl p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">确认删除</h3>
              <p className="text-white/60 text-sm mb-6">此操作将把日程移至回收站，30天内可恢复。</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-xl glass-effect text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-400 transition-all duration-200"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExpiredWarning && (
        <div className="absolute inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExpiredWarning(false)} />
          <div className="relative w-full max-w-sm mx-4 glass-effect-strong rounded-2xl p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">事件已过期</h3>
              <p className="text-white/60 text-sm mb-6">您设置的时间早于当前时间，确定要创建此过期事件吗？</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExpiredWarning(false)}
                  className="flex-1 px-4 py-2 rounded-xl glass-effect text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    saveEvent();
                    setShowExpiredWarning(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-400 transition-all duration-200"
                >
                  确认创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
