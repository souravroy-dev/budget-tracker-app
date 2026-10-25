import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ChevronLeft, RotateCcw } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isDark: boolean;
  onSystemBack: () => void;
  onResetState: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isDark,
  onSystemBack,
  onResetState,
}) => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto flex flex-col items-center">
      {/* Outer Phone Bezel */}
      <div
        className={`relative w-[390px] h-[810px] rounded-[48px] p-3 shadow-2xl border-4 transition-colors ${
          isDark
            ? 'bg-[#090A0C] border-[#2A2B30] shadow-black/80'
            : 'bg-[#1C1B1F] border-[#38373B] shadow-2xl shadow-slate-900/20'
        }`}
      >
        {/* Inner Screen Display */}
        <div
          className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col transition-colors select-none ${
            isDark ? 'bg-[#121316] text-[#E4E2E6]' : 'bg-[#FBF9F5] text-[#1C1B1F]'
          }`}
        >
          {/* Android Status Bar */}
          <div
            className={`shrink-0 h-10 px-6 flex items-center justify-between text-xs font-semibold z-30 select-none ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {/* Clock */}
            <span className="font-mono text-[11px] tracking-tight">{timeStr}</span>

            {/* Camera Punch Hole */}
            <div className="w-4 h-4 rounded-full bg-black mx-auto" />

            {/* System Status Icons */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="relative flex-1 overflow-hidden flex flex-col">
            {children}
          </div>

          {/* Android System Gesture Navigation Bar */}
          <div
            className={`shrink-0 h-7 flex items-center justify-between px-6 z-30 transition-colors ${
              isDark ? 'bg-[#1A1C20]' : 'bg-[#FFFFFF]'
            }`}
          >
            {/* System Back Button affordance */}
            <button
              onClick={onSystemBack}
              title="System Back"
              className="p-1 -ml-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Home Pill Indicator */}
            <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            {/* Reset App State shortcut */}
            <button
              onClick={onResetState}
              title="Reset Initial Zero-State"
              className="p-1 -mr-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
