import React, { useState, useMemo } from 'react';
import { PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { ScreenRoute, Transaction } from '../../types';
import { DEFAULT_CATEGORIES } from '../../data/categories';
import { TabularCurrency } from '../TabularCurrency';
import { EmptyState } from '../EmptyState';

interface InsightsScreenProps {
  transactions: Transaction[];
  isDark: boolean;
  onNavigate: (route: ScreenRoute) => void;
  onQuickAdd: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  transactions,
  isDark,
  onNavigate,
  onQuickAdd,
}) => {
  const [period, setPeriod] = useState<'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>('MONTH');

  // Filter transactions by period
  const periodTransactions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    return transactions.filter((tx) => {
      const d = new Date(tx.timestamp);
      if (period === 'DAY') return d >= today;
      if (period === 'WEEK') return d >= weekStart;
      if (period === 'MONTH') return d >= monthStart;
      if (period === 'YEAR') return d >= yearStart;
      return true;
    });
  }, [transactions, period]);

  // Aggregate stats
  const { totalExpense, totalIncome, netSavings, categoryBreakdown } = useMemo(() => {
    let exp = 0;
    let inc = 0;
    const catMap: { [catId: string]: number } = {};

    periodTransactions.forEach((tx) => {
      if (tx.type === 'EXPENSE') {
        exp += tx.amount;
        const cId = tx.categoryId || 'cat_other_exp';
        catMap[cId] = (catMap[cId] || 0) + tx.amount;
      } else if (tx.type === 'INCOME') {
        inc += tx.amount;
      }
    });

    const breakdown = Object.entries(catMap)
      .map(([catId, amount]) => {
        const cat = DEFAULT_CATEGORIES.find((c) => c.id === catId);
        return {
          catId,
          name: cat?.name || 'Other Expense',
          color: cat?.colorHex || '#616161',
          amount,
          percentage: exp > 0 ? (amount / exp) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      totalExpense: exp,
      totalIncome: inc,
      netSavings: inc - exp,
      categoryBreakdown: breakdown,
    };
  }, [periodTransactions]);

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
        <h1 className="text-xl font-bold tracking-tight">Financial Insights</h1>
      </header>

      {/* Screen Body */}
      <div className="p-4 space-y-4 pb-20">
        {/* Period Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-[#24262C] rounded-xl text-xs font-semibold">
          {(['DAY', 'WEEK', 'MONTH', 'YEAR'] as const).map((p) => {
            const active = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`py-1.5 rounded-lg transition-all ${
                  active
                    ? isDark
                      ? 'bg-[#1A1C20] text-[#68DBAB] shadow-xs'
                      : 'bg-white text-[#006C4C] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {p === 'DAY' ? 'Day' : p === 'WEEK' ? 'Week' : p === 'MONTH' ? 'Month' : 'Year'}
              </button>
            );
          })}
        </div>

        {/* Period Metrics Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Total Spending
            </span>
            <TabularCurrency
              amount={totalExpense}
              type="EXPENSE"
              className="text-lg font-bold"
              isDark={isDark}
            />
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Net Savings
            </span>
            <TabularCurrency
              amount={netSavings}
              className={`text-lg font-bold ${
                netSavings >= 0 ? 'text-[#006C4C] dark:text-[#68DBAB]' : 'text-red-600 dark:text-red-400'
              }`}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Visual Chart Breakdown Area */}
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Spending Distribution
            </h2>
            <span className="text-[10px] text-slate-400">
              {periodTransactions.length} entries
            </span>
          </div>

          {totalExpense === 0 ? (
            <EmptyState
              icon={PieChartIcon}
              title="No expense data for this period"
              description={`Add your expenses during this ${period.toLowerCase()} to generate the category breakdown.`}
              actionLabel="Add Transaction"
              onAction={onQuickAdd}
              isDark={isDark}
            />
          ) : (
            <div className="space-y-4">
              {/* Proportional Segmented Bar */}
              <div className="h-3 w-full rounded-full flex overflow-hidden gap-0.5 bg-slate-100 dark:bg-[#24262C]">
                {categoryBreakdown.map((cat) => (
                  <div
                    key={cat.catId}
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                    title={`${cat.name}: ${cat.percentage.toFixed(1)}%`}
                    className="h-full first:rounded-l-full last:rounded-r-full transition-all"
                  />
                ))}
              </div>

              {/* Category Breakdown Drill-Down List */}
              <div className="space-y-2.5 pt-1">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.catId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {cat.percentage.toFixed(1)}%
                      </span>
                      <TabularCurrency
                        amount={cat.amount}
                        className="text-xs font-semibold"
                        isDark={isDark}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
