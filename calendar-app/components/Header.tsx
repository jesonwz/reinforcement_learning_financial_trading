import { Search, Bell, Settings, User } from 'lucide-react';
import { useState } from 'react';
import Tooltip from './Tooltip';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notificationCount: number;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
}

export default function Header({ searchQuery, onSearchChange, notificationCount, onNotificationsClick, onSettingsClick }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-effect-strong border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-semibold text-white/90">Calendar Pro</h1>
        </div>

        <div className={`flex-1 max-w-xl mx-8 transition-all duration-300 ${
          isSearchFocused ? 'scale-105' : 'scale-100'
        }`}>
          <div className={`flex items-center glass-effect rounded-xl px-4 py-2.5 transition-all duration-300 ${
            isSearchFocused ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : ''
          }`}>
            <Search className="w-5 h-5 text-white/50 mr-3" />
            <input
              type="text"
              placeholder="搜索日程、地点、参与者..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 bg-transparent text-white/90 placeholder-white/40 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content="设置">
            <button 
              onClick={onSettingsClick}
              className="p-2.5 rounded-xl glass-effect hover:bg-white/20 transition-all duration-200"
            >
              <Settings className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
            </button>
          </Tooltip>

          <Tooltip content="通知中心">
            <button 
              className="p-2.5 rounded-xl glass-effect hover:bg-white/20 transition-all duration-200 relative"
              onClick={onNotificationsClick}
            >
              <Bell className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
              {notificationCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium ${
                  notificationCount > 9 ? 'px-1.5' : ''
                }`}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          </Tooltip>

          <div className="w-px h-8 bg-white/20 mx-2" />

          <Tooltip content="用户头像">
            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-white" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
