import React from 'react';
import { Home, History, BarChart3, Wallet, Plus } from 'lucide-react';
import { ScreenRoute } from '../types';

interface TakaBottomBarProps {
  currentRoute: ScreenRoute;
  onNavigate: (route: ScreenRoute) => void;
  onQuickAdd: () => void;
  isDark: boolean;
}

export const TakaBottomBar: React.FC<TakaBottomBarProps> = ({
  currentRoute,
  onNavigate,
  onQuickAdd,
  isDark,
}) => {
  const tabs: { route: ScreenRoute; label: string; icon: typeof Home }[] = [
    { route: 'home', label: 'Home', icon: Home },
    { route: 'history', label: 'History', icon: History },
    { route: 'insights', label: 'Insights', icon: BarChart3 },
    { route: 'wallets', label: 'Wallets', icon: Wallet },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className={`shrink-0 w-full border-t transition-colors select-none ${
        isDark
          ? 'bg-[#1A1C20] border-[#2F3138]'
          : 'bg-[#FFFFFF] border-[#E6E2DA]'
      }`}
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* Tab 1: Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            currentRoute === 'home'
              ? isDark
                ? 'text-[#68DBAB]'
                : 'text-[#006C4C]'
              : isDark
              ? 'text-[#C7C5D0]/60 hover:text-[#C7C5D0]'
              : 'text-[#49454F]/70 hover:text-[#1C1B1F]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentRoute === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
        </button>

        {/* Tab 2: History */}
        <button
          onClick={() => onNavigate('history')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            currentRoute === 'history'
              ? isDark
                ? 'text-[#68DBAB]'
                : 'text-[#006C4C]'
              : isDark
              ? 'text-[#C7C5D0]/60 hover:text-[#C7C5D0]'
              : 'text-[#49454F]/70 hover:text-[#1C1B1F]'
          }`}
        >
          <History className={`w-5 h-5 ${currentRoute === 'history' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">History</span>
        </button>

        {/* Center Action: Quick Add (+) - Action Button, not a permanent destination */}
        <div className="flex items-center justify-center">
          <button
            onClick={onQuickAdd}
            aria-label="Quick Add Transaction"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform ${
              isDark
                ? 'bg-[#68DBAB] text-[#003825] shadow-[#68DBAB]/20'
                : 'bg-[#006C4C] text-white shadow-[#006C4C]/30'
            }`}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Insights */}
        <button
          onClick={() => onNavigate('insights')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            currentRoute === 'insights'
              ? isDark
                ? 'text-[#68DBAB]'
                : 'text-[#006C4C]'
              : isDark
              ? 'text-[#C7C5D0]/60 hover:text-[#C7C5D0]'
              : 'text-[#49454F]/70 hover:text-[#1C1B1F]'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${currentRoute === 'insights' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Insights</span>
        </button>

        {/* Tab 4: Wallets */}
        <button
          onClick={() => onNavigate('wallets')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            currentRoute === 'wallets'
              ? isDark
                ? 'text-[#68DBAB]'
                : 'text-[#006C4C]'
              : isDark
              ? 'text-[#C7C5D0]/60 hover:text-[#C7C5D0]'
              : 'text-[#49454F]/70 hover:text-[#1C1B1F]'
          }`}
        >
          <Wallet className={`w-5 h-5 ${currentRoute === 'wallets' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Wallets</span>
        </button>
      </div>
    </nav>
  );
};
