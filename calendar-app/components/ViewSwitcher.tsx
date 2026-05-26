import { CalendarDays, Calendar, Trash2 } from 'lucide-react';
import Tooltip from './Tooltip';

export type ViewType = 'week' | 'month';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onOpenRecycleBin: () => void;
}

export default function ViewSwitcher({ currentView, onViewChange, onOpenRecycleBin }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2 glass-effect rounded-xl p-1">
      <Tooltip content="周视图">
        <button
          onClick={() => onViewChange('week')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentView === 'week'
              ? 'bg-blue-500 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span className="text-sm font-medium">周</span>
        </button>
      </Tooltip>
      
      <Tooltip content="月视图">
        <button
          onClick={() => onViewChange('month')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentView === 'month'
              ? 'bg-blue-500 text-white'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">月</span>
        </button>
      </Tooltip>
      
      <div className="w-px h-6 bg-white/20 mx-1" />
      
      <Tooltip content="回收站">
        <button
          onClick={onOpenRecycleBin}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
}
