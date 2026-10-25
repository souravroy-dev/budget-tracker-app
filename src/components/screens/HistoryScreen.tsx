import React, { useState, useMemo } from 'react';
import { Search, X, History as HistoryIcon } from 'lucide-react';
import { ScreenRoute, Transaction, TransactionType } from '../../types';
import { TabularCurrency } from '../TabularCurrency';
import { EmptyState } from '../EmptyState';

interface HistoryScreenProps {
  transactions: Transaction[];
  isDark: boolean;
  onNavigate: (route: ScreenRoute) => void;
  onSelectTransaction: (id: string) => void;
  onQuickAdd: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  transactions,
  isDark,
  onNavigate,
  onSelectTransaction,
  onQuickAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

  // Filter & Group transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return transactions.filter((tx) => {
      // 1. Text Search
      const matchesSearch =
        searchQuery.trim() === '' ||
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Type Filter
      const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;

      // 3. Date Filter
      const txDate = new Date(tx.timestamp);
      let matchesDate = true;
      if (dateFilter === 'TODAY') matchesDate = txDate >= today;
      else if (dateFilter === 'WEEK') matchesDate = txDate >= weekStart;
      else if (dateFilter === 'MONTH') matchesDate = txDate >= monthStart;

      return matchesSearch && matchesType && matchesDate;
    });
  }, [transactions, searchQuery, typeFilter, dateFilter]);

  // Day Grouping
  const dayGroups = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => b.timestamp - a.timestamp);
    const groups: { [key: string]: { dateStr: string; items: Transaction[]; expenseTotal: number } } = {};

    sorted.forEach((tx) => {
      const d = new Date(tx.timestamp);
      const key = d.toDateString();
      if (!groups[key]) {
        groups[key] = {
          dateStr: d.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          items: [],
          expenseTotal: 0,
        };
      }
      groups[key].items.push(tx);
      if (tx.type === 'EXPENSE') {
        groups[key].expenseTotal += tx.amount;
      }
    });

    return Object.values(groups);
  }, [filteredTransactions]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top Bar */}
      <header
        className={`sticky top-0 z-20 px-5 py-3.5 backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#121316]/90 border-b border-[#2F3138]'
            : 'bg-[#FBF9F5]/90 border-b border-[#E6E2DA]'
        }`}
      >
        <h1 className="text-xl font-bold tracking-tight">History</h1>
      </header>

      {/* Search & Filter Controls */}
      <div className="p-4 space-y-3 pb-2">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, notes..."
            className={`w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#1A1C20] border-[#2F3138] focus:border-[#68DBAB] text-white'
                : 'bg-[#FFFFFF] border-[#E6E2DA] focus:border-[#006C4C] text-slate-900'
            } outline-hidden`}
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {/* Type Chips */}
          {(['ALL', 'EXPENSE', 'INCOME', 'TRANSFER'] as const).map((t) => {
            const active = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  active
                    ? isDark
                      ? 'bg-[#68DBAB] text-[#003825]'
                      : 'bg-[#006C4C] text-white'
                    : isDark
                    ? 'bg-[#1A1C20] border border-[#2F3138] text-slate-300'
                    : 'bg-white border border-[#E6E2DA] text-slate-700'
                }`}
              >
                {t === 'ALL'
                  ? 'All Types'
                  : t === 'EXPENSE'
                  ? 'Expense'
                  : t === 'INCOME'
                  ? 'Income'
                  : 'Transfer'}
              </button>
            );
          })}

          <span className="text-slate-300 dark:text-slate-700">|</span>

          {/* Date Chips */}
          {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((d) => {
            const active = dateFilter === d;
            return (
              <button
                key={d}
                onClick={() => setDateFilter(d)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  active
                    ? isDark
                      ? 'bg-[#68DBAB] text-[#003825]'
                      : 'bg-[#006C4C] text-white'
                    : isDark
                    ? 'bg-[#1A1C20] border border-[#2F3138] text-slate-300'
                    : 'bg-white border border-[#E6E2DA] text-slate-700'
                }`}
              >
                {d === 'ALL' ? 'All Dates' : d === 'TODAY' ? 'Today' : d === 'WEEK' ? 'Week' : 'Month'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Chronological List */}
      <div className="px-4 pb-20 space-y-4">
        {dayGroups.length === 0 ? (
          <div
            className={`rounded-2xl border ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
            }`}
          >
            <EmptyState
              icon={HistoryIcon}
              title={searchQuery || typeFilter !== 'ALL' ? 'No matching records' : 'No history yet'}
              description={
                searchQuery || typeFilter !== 'ALL'
                  ? 'Try clearing your filters to see more transaction entries.'
                  : 'Recorded entries will be archived here grouped chronologically by day.'
              }
              actionLabel={searchQuery || typeFilter !== 'ALL' ? 'Reset Filters' : 'Record Transaction'}
              onAction={
                searchQuery || typeFilter !== 'ALL'
                  ? () => {
                      setSearchQuery('');
                      setTypeFilter('ALL');
                      setDateFilter('ALL');
                    }
                  : onQuickAdd
              }
              isDark={isDark}
            />
          </div>
        ) : (
          dayGroups.map((group) => (
            <div key={group.dateStr} className="space-y-1.5">
              {/* Day Header */}
              <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>{group.dateStr}</span>
                {group.expenseTotal > 0 && (
                  <span className="font-mono text-red-600 dark:text-red-400">
                    -৳{group.expenseTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              {/* Transactions in Day */}
              <div
                className={`rounded-2xl border divide-y overflow-hidden ${
                  isDark
                    ? 'bg-[#1A1C20] border-[#2F3138] divide-[#2F3138]'
                    : 'bg-[#FFFFFF] border-[#E6E2DA] divide-[#E6E2DA]'
                }`}
              >
                {group.items.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx.id)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-[#24262C]' : 'hover:bg-[#F2EFE8]'
                    }`}
                  >
                    <div>
                      <h3 className="text-xs font-semibold">{tx.description}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {new Date(tx.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </p>
                    </div>
                    <TabularCurrency
                      amount={tx.amount}
                      type={tx.type}
                      showPrefixSign={true}
                      className="text-xs font-bold"
                      isDark={isDark}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
