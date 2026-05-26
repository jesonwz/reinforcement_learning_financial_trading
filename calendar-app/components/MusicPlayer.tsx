import { useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import Tooltip from './Tooltip';

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function MusicPlayer({ isPlaying, onToggle }: MusicPlayerProps) {
  const [progress, setProgress] = useState(35);

  return (
    <Tooltip content="Hans Zimmer 音乐推荐">
      <div className="flex items-center gap-3 glass-effect rounded-xl px-3 py-2">
        <button
          onClick={onToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isPlaying 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-3 h-3 text-white/50" />
            <span className="text-xs text-white/70 truncate">Time - Hans Zimmer</span>
          </div>
          {isPlaying && (
            <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );
}
