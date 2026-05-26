import { useState, useEffect } from 'react';
import { X, Sparkles, Zap, Clock, Users, Coffee } from 'lucide-react';
import type { CalendarEvent } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
}

export default function AIAssistant({ isOpen, onClose, events }: AIAssistantProps) {
  const [displayedText, setDisplayedText] = useState('');

  const generateSuggestions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime() && event.status !== 'completed';
    });

    const suggestions = [];
    
    if (todayEvents.length === 0) {
      suggestions.push({
        icon: <Coffee className="w-5 h-5 text-orange-400" />,
        title: '今日暂无日程',
        description: '您今天没有安排任何会议或活动，可以好好休息一下！',
      });
    } else {
      const morningEvents = todayEvents.filter(e => e.start.getHours() < 12);
      const afternoonEvents = todayEvents.filter(e => e.start.getHours() >= 12);
      
      if (morningEvents.length > 2) {
        suggestions.push({
          icon: <Clock className="w-5 h-5 text-blue-400" />,
          title: '上午会议较多',
          description: `您上午有${morningEvents.length}个会议，建议提前准备好相关资料，保持精力充沛！`,
        });
      }
      
      if (afternoonEvents.length === 0) {
        suggestions.push({
          icon: <Zap className="w-5 h-5 text-yellow-400" />,
          title: '下午时间充裕',
          description: '您下午没有安排会议，可以利用这段时间专注处理待办事项。',
        });
      }
      
      const longMeetings = todayEvents.filter(e => (e.end.getTime() - e.start.getTime()) > 60 * 60 * 1000);
      if (longMeetings.length > 0) {
        suggestions.push({
          icon: <Users className="w-5 h-5 text-green-400" />,
          title: '长时间会议提醒',
          description: `您有${longMeetings.length}个超过1小时的会议，建议中间适当休息。`,
        });
      }

      if (todayEvents.length > 0) {
        const firstEvent = todayEvents.reduce((prev, curr) => 
          prev.start.getTime() < curr.start.getTime() ? prev : curr
        );
        const timeUntil = new Date(firstEvent.start).getTime() - new Date().getTime();
        const minutesUntil = Math.floor(timeUntil / 60000);
        
        if (minutesUntil > 0 && minutesUntil < 60) {
          suggestions.push({
            icon: <Clock className="w-5 h-5 text-purple-400" />,
            title: '即将开始的会议',
            description: `${firstEvent.title}将在${minutesUntil}分钟后开始，请做好准备。`,
          });
        }
      }
    }

    if (suggestions.length === 0) {
      suggestions.push({
        icon: <Sparkles className="w-5 h-5 text-purple-400" />,
        title: '日程安排合理',
        description: '您今天的日程安排合理，保持高效工作！',
      });
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();
  const greeting = '根据您今天的日程安排，为您提供以下建议：';

  useEffect(() => {
    if (isOpen) {
      setDisplayedText('');
      let index = 0;
      const timer = setInterval(() => {
        if (index < greeting.length) {
          setDisplayedText(greeting.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm glass-effect-strong rounded-2xl overflow-hidden animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI 日程助手</h3>
              <p className="text-xs text-white/50">智能分析建议</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-white/80 text-sm leading-relaxed">
              {displayedText}
              {displayedText.length < greeting.length && (
                <span className="animate-pulse">|</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">{suggestion.title}</h4>
                    <p className="text-white/60 text-xs leading-relaxed">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
