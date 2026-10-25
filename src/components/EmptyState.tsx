import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isDark?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  isDark = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 py-10 w-full">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
          isDark ? 'bg-[#005138]/30 text-[#68DBAB]' : 'bg-[#E3F7EE] text-[#006C4C]'
        }`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3 className={`text-base font-semibold mb-1.5 ${isDark ? 'text-[#E4E2E6]' : 'text-[#1C1B1F]'}`}>
        {title}
      </h3>
      <p
        className={`text-xs leading-relaxed max-w-xs mb-5 ${
          isDark ? 'text-[#C7C5D0]' : 'text-[#49454F]'
        }`}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`px-4 py-2 text-xs font-semibold rounded-xl shadow-sm active:scale-95 transition-all ${
            isDark
              ? 'bg-[#68DBAB] text-[#003825] hover:bg-[#58ca9b]'
              : 'bg-[#006C4C] text-white hover:bg-[#00583e]'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
