import { X, RefreshCw, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import type { DeletedEvent, CalendarCategory } from '../types';

interface RecycleBinProps {
  isOpen: boolean;
  onClose: () => void;
  deletedEvents: DeletedEvent[];
  onRestore: (id: string) => void;
  categories: CalendarCategory[];
}

export default function RecycleBin({ isOpen, onClose, deletedEvents, onRestore, categories }: RecycleBinProps) {
  if (!isOpen) return null;

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '未分类';
  };

  const formatDaysAgo = (deletedAt: Date): string => {
    const diff = new Date().getTime() - deletedAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return '今天删除';
    if (days === 1) return '昨天删除';
    return `${days}天前删除`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg mx-4 glass-effect-strong rounded-2xl overflow-hidden animate-scale-in max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">回收站</h3>
              <p className="text-xs text-white/50">已删除的日程（30天内可恢复）</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {deletedEvents.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">回收站为空</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deletedEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl glass-effect bg-gray-500/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(event.category) }}
                      />
                      <span className="text-white/60 text-xs">{getCategoryName(event.category)}</span>
                    </div>
                    <span className="text-xs text-white/40">{formatDaysAgo(event.deletedAt)}</span>
                  </div>
                  
                  <h4 className="text-white font-medium mb-2">{event.title}</h4>
                  
                  <div className="space-y-1 text-xs text-white/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(event.start).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(event.start).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(event.end).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onRestore(event.id)}
                    className="mt-3 w-full py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    恢复日程
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <div className="text-center text-xs text-white/40">
            共 {deletedEvents.length} 条已删除日程
          </div>
        </div>
      </div>
    </div>
  );
}
