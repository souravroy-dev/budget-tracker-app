import { Settings, TrendingDown, TrendingUp, Plus, Receipt, Target } from 'lucide-react';
import { Budget, ScreenRoute, Transaction } from '../../types';
import { TabularCurrency } from '../TabularCurrency';
import { EmptyState } from '../EmptyState';

interface HomeScreenProps {
  transactions: Transaction[];
  budget: Budget | null;
  isDark: boolean;
  onNavigate: (route: ScreenRoute) => void;
  onQuickAdd: () => void;
  onSelectTransaction: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  transactions,
  budget,
  isDark,
  onNavigate,
  onQuickAdd,
  onSelectTransaction,
}) => {
  // Calculate today's spending, month spending, and month income
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let todaySpending = 0;
  let monthSpending = 0;
  let monthIncome = 0;

  transactions.forEach((tx) => {
    const txDate = new Date(tx.timestamp);
    if (tx.type === 'EXPENSE') {
      if (txDate >= today) {
        todaySpending += tx.amount;
      }
      if (txDate >= startOfMonth) {
        monthSpending += tx.amount;
      }
    } else if (tx.type === 'INCOME') {
      if (txDate >= startOfMonth) {
        monthIncome += tx.amount;
      }
    }
  });

  const recentTransactions = [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const budgetLimit = budget?.amountLimit || 0;
  const budgetProgress = budgetLimit > 0 ? Math.min(monthSpending / budgetLimit, 1) : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top Bar */}
      <header
        className={`sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#121316]/90 border-b border-[#2F3138]'
            : 'bg-[#FBF9F5]/90 border-b border-[#E6E2DA]'
        }`}
      >
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#006C4C] dark:text-[#68DBAB]">
            Bangladesh
          </span>
          <h1 className="text-xl font-bold tracking-tight">TAKA Journal</h1>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-[#1A1C20] text-slate-300' : 'hover:bg-[#F2EFE8] text-slate-700'
          }`}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>
      </header>

      {/* Screen Body Content */}
      <div className="p-4 space-y-4 pb-20">
        {/* 1. Today's Spending Hero Card */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#1A1C20] border-[#2F3138]'
              : 'bg-[#FFFFFF] border-[#E6E2DA] shadow-xs'
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Today's Spending
          </span>
          <div className="flex items-baseline justify-between">
            <TabularCurrency
              amount={todaySpending}
              className="text-3xl font-bold"
              isDark={isDark}
            />
            <button
              onClick={onQuickAdd}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition-transform ${
                isDark
                  ? 'bg-[#68DBAB] text-[#003825]'
                  : 'bg-[#006C4C] text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Record</span>
            </button>
          </div>
        </div>

        {/* 2. Monthly Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Month Spending */}
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-[#BA1A1A] dark:text-[#FFB4AB]">
                <TrendingDown className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                This Month
              </span>
            </div>
            <TabularCurrency
              amount={monthSpending}
              type="EXPENSE"
              className="text-lg font-bold"
              isDark={isDark}
            />
          </div>

          {/* Month Income */}
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-[#006C4C] dark:text-[#68DBAB]">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Total Income
              </span>
            </div>
            <TabularCurrency
              amount={monthIncome}
              type="INCOME"
              className="text-lg font-bold"
              isDark={isDark}
            />
          </div>
        </div>

        {/* 3. Monthly Budget Progress Area */}
        <div
          onClick={() => onNavigate('budget_management')}
          className={`p-4 rounded-2xl border cursor-pointer hover:border-[#006C4C] dark:hover:border-[#68DBAB] transition-colors ${
            isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#006C4C] dark:text-[#68DBAB]" />
              <span className="text-xs font-semibold">Monthly Budget</span>
            </div>
            <span className="text-[11px] font-bold text-[#006C4C] dark:text-[#68DBAB]">
              {budgetLimit > 0 ? 'Manage' : 'Set Target'}
            </span>
          </div>

          {budgetLimit > 0 ? (
            <div className="space-y-1.5 mt-2">
              <div className="w-full bg-slate-100 dark:bg-[#24262C] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetProgress >= 1 ? 'bg-[#BA1A1A]' : 'bg-[#006C4C] dark:bg-[#68DBAB]'
                  }`}
                  style={{ width: `${budgetProgress * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Spent ৳{monthSpending.toLocaleString()}</span>
                <span>Limit ৳{budgetLimit.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              No budget set for this month. Tap to establish a healthy spending ceiling.
            </p>
          )}
        </div>

        {/* 4. Recent Transactions Section */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-sm font-bold">Recent Transactions</h2>
            {transactions.length > 0 && (
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-[#006C4C] dark:text-[#68DBAB] hover:underline"
              >
                See All
              </button>
            )}
          </div>

          {recentTransactions.length === 0 ? (
            <div
              className={`rounded-2xl border ${
                isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
              }`}
            >
              <EmptyState
                icon={Receipt}
                title="No transactions yet"
                description="Your daily spending and earnings will appear here once recorded."
                actionLabel="Add First Transaction"
                onAction={onQuickAdd}
                isDark={isDark}
              />
            </div>
          ) : (
            <div
              className={`rounded-2xl border divide-y overflow-hidden ${
                isDark
                  ? 'bg-[#1A1C20] border-[#2F3138] divide-[#2F3138]'
                  : 'bg-[#FFFFFF] border-[#E6E2DA] divide-[#E6E2DA]'
              }`}
            >
              {recentTransactions.map((tx) => (
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
                      {new Date(tx.timestamp).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
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
          )}
        </div>
      </div>
    </div>
  );
};
