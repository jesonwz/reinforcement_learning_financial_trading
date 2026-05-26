import { X, Clock, Bell, CheckCircle } from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
}

export default function NotificationCenter({ isOpen, onClose, notifications, onMarkAsRead }: NotificationCenterProps) {
  if (!isOpen) return null;

  const sortedNotifications = [...notifications].sort((a, b) => a.time.getTime() - b.time.getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-4">
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      <div className="relative w-80 glass-effect-strong rounded-2xl overflow-hidden animate-scale-in max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">通知中心</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sortedNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">暂无待提醒事件</p>
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  notification.read ? 'bg-white/5' : 'bg-blue-500/10 ring-1 ring-blue-500/30'
                }`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`font-medium ${notification.read ? 'text-white/60' : 'text-white'}`}>
                      {notification.title}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      {notification.time.toLocaleString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {notification.read ? (
                    <CheckCircle className="w-4 h-4 text-green-400/50" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 border-t border-white/10">
          <div className="text-xs text-white/40 text-center">
            {notifications.filter(n => !n.read).length} 条未读通知
          </div>
        </div>
      </div>
    </div>
  );
}
