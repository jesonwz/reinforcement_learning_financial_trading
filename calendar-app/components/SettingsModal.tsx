'use client';

import { X, Palette, Image, Music, Bell, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UserSettings, ReminderTime, SnoozeTime } from '../types';
import { themeOptions, backgroundOptions, musicOptions, snoozeOptions, reminderOptions } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl mx-4 glass-effect-strong rounded-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Palette className="w-6 h-6" />
            设置
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 颜色主题 */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              颜色主题
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {themeOptions.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setLocalSettings({ ...localSettings, theme: theme.id })}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                    localSettings.theme === theme.id 
                      ? 'ring-2 ring-white/50' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div 
                    className="w-full aspect-square rounded-lg mb-2"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <p className="text-xs text-white/70">{theme.name}</p>
                  {localSettings.theme === theme.id && (
                    <div className="absolute top-2 right-2 text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* 背景图片 */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" aria-hidden="true" />
              背景图片
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {backgroundOptions.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setLocalSettings({ ...localSettings, backgroundId: bg.id })}
                  className={`relative p-1 rounded-xl transition-all duration-200 hover:scale-105 ${
                    localSettings.backgroundId === bg.id 
                      ? 'ring-2 ring-white/50' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div 
                    className="w-full aspect-video rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${bg.url})` }}
                  />
                  <p className="text-xs text-white/70 mt-2">{bg.name}</p>
                  {localSettings.backgroundId === bg.id && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-white/20">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* 音乐选择 */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              音乐选择
            </h3>
            <div className="space-y-2">
              {musicOptions.map((music) => (
                <button
                  key={music.id}
                  onClick={() => setLocalSettings({ ...localSettings, musicId: music.id })}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    localSettings.musicId === music.id 
                      ? 'bg-white/20 ring-1 ring-white/30' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-white font-medium">{music.name}</p>
                    <p className="text-white/50 text-xs">{music.artist}</p>
                  </div>
                  {localSettings.musicId === music.id && (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* 提醒设置 */}
          <section>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              提醒设置
            </h3>
            <div className="space-y-6">
              {/* 提前提醒时间 */}
              <div>
                <label className="block text-white/70 text-sm mb-3">
                  提前提醒时间
                </label>
                <div className="flex flex-wrap gap-2">
                  {reminderOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLocalSettings({ 
                        ...localSettings, 
                        defaultReminderTime: option.value as ReminderTime 
                      })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        localSettings.defaultReminderTime === option.value
                          ? 'bg-blue-500 text-white'
                          : 'glass-effect text-white/70 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 稍后提醒时间 */}
              <div>
                <label className="block text-white/70 text-sm mb-3">
                  稍后提醒时间
                </label>
                <div className="flex flex-wrap gap-2">
                  {snoozeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLocalSettings({ 
                        ...localSettings, 
                        defaultSnoozeTime: option.value as SnoozeTime 
                      })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        localSettings.defaultSnoozeTime === option.value
                          ? 'bg-blue-500 text-white'
                          : 'glass-effect text-white/70 hover:text-white hover:bg-white/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl glass-effect text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-400 hover:to-blue-500 transition-all duration-200"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
