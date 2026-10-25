import React from 'react';
import { TransactionType } from '../types';

interface TabularCurrencyProps {
  amount: number;
  type?: TransactionType;
  showPrefixSign?: boolean;
  className?: string;
  isDark?: boolean;
}

export const TabularCurrency: React.FC<TabularCurrencyProps> = ({
  amount,
  type,
  showPrefixSign = false,
  className = 'text-base font-semibold',
  isDark = false,
}) => {
  const formattedNumber = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let sign = '';
  if (showPrefixSign && type === 'EXPENSE') sign = '- ';
  if (showPrefixSign && type === 'INCOME') sign = '+ ';

  let colorClass = isDark ? 'text-[#E4E2E6]' : 'text-[#1C1B1F]';

  if (type === 'EXPENSE') {
    colorClass = isDark ? 'text-[#FFB4AB]' : 'text-[#BA1A1A]';
  } else if (type === 'INCOME') {
    colorClass = isDark ? 'text-[#68DBAB]' : 'text-[#006C4C]';
  } else if (type === 'TRANSFER') {
    colorClass = isDark ? 'text-[#A5C8FF]' : 'text-[#3E5F90]';
  }

  return (
    <span className={`tabular-nums font-mono tracking-tight ${colorClass} ${className}`}>
      {sign}৳{formattedNumber}
    </span>
  );
};
