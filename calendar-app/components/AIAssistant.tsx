import { useState, useEffect } from 'react';
import { X, Sparkles, ChevronRight, Zap, Clock, Users, Target } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const fullText = '您好！我是您的智能日程助手。我可以帮您分析日程冲突、会议密度和空闲时段，提供个性化的时间优化建议。';

  useEffect(() => {
    if (isOpen) {
      setDisplayedText('');
      setShowSuggestions(false);
      let index = 0;
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setTimeout(() => setShowSuggestions(true), 500);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const suggestions = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      title: '智能时间优化',
      description: '分析您的日程安排，识别低效时间片段，推荐优化方案',
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      title: '会议密度分析',
      description: '检测连续会议安排，提醒适当休息，避免疲劳',
    },
    {
      icon: <Users className="w-5 h-5 text-green-400" />,
      title: '参与者协调',
      description: '智能分析参与者日程，推荐最佳会议时间',
    },
    {
      icon: <Target className="w-5 h-5 text-purple-400" />,
      title: '目标追踪',
      description: '根据您的日程目标，提供进度追踪和提醒',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md mx-4 glass-effect-strong rounded-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI 智能助手</h3>
              <p className="text-xs text-white/50">智能日程分析</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-white/80 text-sm leading-relaxed">
              {displayedText}
              {displayedText.length < fullText.length && (
                <span className="animate-pulse">|</span>
              )}
            </div>
          </div>

          <div className={`space-y-3 transition-all duration-500 ${showSuggestions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button className="w-full flex items-center justify-between p-3 rounded-xl glass-effect hover:bg-white/10 transition-all duration-200">
              <span className="text-white/70 text-sm">查看更多建议</span>
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
            
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl glass-effect transition-all duration-300 hover:bg-white/10 ${
                  showSuggestions ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    {suggestion.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{suggestion.title}</h4>
                    <p className="text-white/50 text-xs">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <div className="text-center text-xs text-white/40">
            AI 助手正在分析您的日程数据...
          </div>
        </div>
      </div>
    </div>
  );
}
