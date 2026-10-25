import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Wallet as WalletIcon,
  Tag,
  Info,
  Shield,
  Download,
  Upload,
  Lock,
  Moon,
  Sun,
  Globe,
  Bell,
} from 'lucide-react';
import { ScreenRoute, Transaction, Wallet, Budget } from '../../types';
import { TabularCurrency } from '../TabularCurrency';

interface SecondaryScreenProps {
  currentRoute: ScreenRoute;
  selectedTransactionId: string | null;
  selectedWalletId: string | null;
  transactions: Transaction[];
  wallets: Wallet[];
  budget: Budget | null;
  isDark: boolean;
  onNavigateBack: () => void;
  onNavigateToEdit: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
  onSaveBudget: (limit: number) => void;
  onToggleTheme: () => void;
}

export const SecondaryScreens: React.FC<SecondaryScreenProps> = ({
  currentRoute,
  selectedTransactionId,
  selectedWalletId,
  transactions,
  wallets,
  budget,
  isDark,
  onNavigateBack,
  onNavigateToEdit,
  onDeleteTransaction,
  onSaveBudget,
  onToggleTheme,
}) => {
  // Budget screen state
  const [budgetLimitInput, setBudgetLimitInput] = useState(
    budget?.amountLimit ? budget.amountLimit.toString() : '20000'
  );

  // Settings screen state
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  // Find target transaction / wallet
  const tx = transactions.find((t) => t.id === selectedTransactionId);
  const wallet = wallets.find((w) => w.id === selectedWalletId);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Universal Top Header */}
      <header
        className={`sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#121316]/90 border-b border-[#2F3138]'
            : 'bg-[#FBF9F5]/90 border-b border-[#E6E2DA]'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateBack}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#1A1C20] text-slate-300' : 'hover:bg-[#F2EFE8] text-slate-700'
            }`}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-base font-bold capitalize">
            {currentRoute === 'transaction_detail' && 'Transaction Details'}
            {currentRoute === 'edit_transaction' && 'Edit Transaction'}
            {currentRoute === 'wallet_detail' && (wallet?.name || 'Wallet Details')}
            {currentRoute === 'budget_management' && 'Monthly Budget'}
            {currentRoute === 'settings' && 'Settings'}
            {currentRoute === 'backup_restore' && 'Backup & Vault'}
          </h1>
        </div>

        {currentRoute === 'transaction_detail' && tx && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigateToEdit(tx.id)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg"
              aria-label="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onDeleteTransaction(tx.id);
                onNavigateBack();
              }}
              className="p-1.5 text-red-500 hover:text-red-700 rounded-lg"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Screen Body Router */}
      <div className="p-4 space-y-4 pb-12">
        {/* Route: Transaction Detail */}
        {currentRoute === 'transaction_detail' && (
          <>
            {tx ? (
              <div className="space-y-4">
                <div
                  className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                    {tx.type} RECORD
                  </span>
                  <TabularCurrency
                    amount={tx.amount}
                    type={tx.type}
                    showPrefixSign={true}
                    className="text-3xl font-bold block mb-2"
                    isDark={isDark}
                  />
                  <h2 className="text-base font-semibold">{tx.description}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(tx.timestamp).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {tx.notes && (
                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Notes & Remarks
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {tx.notes}
                    </p>
                  </div>
                )}

                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                    isDark
                      ? 'bg-[#1A1C20] border-[#2F3138] text-slate-400'
                      : 'bg-[#F2EFE8] border-[#E6E2DA] text-slate-600'
                  }`}
                >
                  <Info className="w-4 h-4 shrink-0 text-[#006C4C] dark:text-[#68DBAB] mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Milestone 1 Architecture:
                    </span>{' '}
                    Receipt photo uploads, GPS coordinates, and PDF statement generation will be
                    integrated in Milestone 2.
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-xs text-slate-400 py-8">
                Transaction not found or deleted.
              </p>
            )}
          </>
        )}

        {/* Route: Edit Transaction */}
        {currentRoute === 'edit_transaction' && (
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
            }`}
          >
            <h2 className="text-sm font-bold">Edit Entry #{selectedTransactionId}</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full interactive updates and transaction history re-calculation will be connected
              alongside the persistent database in Milestone 2.
            </p>
            <button
              onClick={onNavigateBack}
              className="w-full py-2.5 rounded-xl bg-[#006C4C] text-white text-xs font-semibold"
            >
              Return to Transaction
            </button>
          </div>
        )}

        {/* Route: Wallet Detail */}
        {currentRoute === 'wallet_detail' && (
          <div className="space-y-4">
            {wallet ? (
              <>
                <div
                  className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
                  }`}
                >
                  <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                    Current Balance
                  </span>
                  <TabularCurrency
                    amount={wallet.currentBalance}
                    className="text-3xl font-bold block mb-2"
                    isDark={isDark}
                  />
                  <div className="text-xs text-slate-500">
                    Type: <span className="font-semibold text-slate-800 dark:text-slate-200">{wallet.type}</span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border text-xs text-slate-500 ${
                    isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
                  }`}
                >
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Wallet History
                  </h3>
                  <p>
                    Transactions associated specifically with this {wallet.name} account will be
                    charted and listed here in Milestone 2.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center text-xs text-slate-400">Wallet not found.</p>
            )}
          </div>
        )}

        {/* Route: Budget Management */}
        {currentRoute === 'budget_management' && (
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
            }`}
          >
            <div>
              <h2 className="text-sm font-bold">Monthly Spending Ceiling</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Establish an overall limit to keep your personal expenses within target bounds.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Budget Limit (৳ Taka)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 font-bold text-sm text-slate-500">৳</span>
                <input
                  type="number"
                  value={budgetLimitInput}
                  onChange={(e) => setBudgetLimitInput(e.target.value)}
                  className={`w-full text-base font-mono pl-8 pr-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                />
              </div>
            </div>

            <button
              onClick={() => {
                onSaveBudget(parseFloat(budgetLimitInput) || 0);
                onNavigateBack();
              }}
              className="w-full py-2.5 rounded-xl bg-[#006C4C] text-white text-xs font-semibold shadow-xs hover:bg-[#00583e]"
            >
              Save Monthly Budget
            </button>
          </div>
        )}

        {/* Route: Settings */}
        {currentRoute === 'settings' && (
          <div className="space-y-4">
            {/* Preferences */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
              }`}
            >
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Preferences & Theme
              </h2>

              {/* Theme Switcher */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs">
                  {isDark ? <Moon className="w-4 h-4 text-[#68DBAB]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span className="font-semibold">Appearance Theme</span>
                </div>
                <button
                  onClick={onToggleTheme}
                  className={`text-xs px-3 py-1 rounded-lg border font-semibold ${
                    isDark
                      ? 'border-[#2F3138] bg-[#24262C] text-[#68DBAB]'
                      : 'border-[#E6E2DA] bg-[#F2EFE8] text-[#006C4C]'
                  }`}
                >
                  {isDark ? 'Dark Mode' : 'Warm Light'}
                </button>
              </div>

              {/* Currency format */}
              <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold">Default Currency</span>
                </div>
                <span className="font-mono text-slate-500">৳ BDT</span>
              </div>

              {/* App Lock */}
              <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="font-semibold">App Lock & Biometrics</div>
                    <div className="text-[10px] text-slate-400">Require PIN or fingerprint</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={biometricsEnabled}
                  onChange={(e) => setBiometricsEnabled(e.target.checked)}
                  className="rounded text-[#006C4C] focus:ring-[#006C4C]"
                />
              </div>
            </div>

            {/* Data & Storage */}
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
              }`}
            >
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Data & Storage
              </h2>
              <p className="text-xs text-slate-500">
                TAKA Journal operates completely offline. No accounts, internet, or third-party servers
                are required for daily operation.
              </p>
              <button
                onClick={() => onSaveBudget(budget?.amountLimit || 20000)} // or open vault
                className="w-full py-2 px-3 rounded-xl border border-[#006C4C] dark:border-[#68DBAB] text-[#006C4C] dark:text-[#68DBAB] text-xs font-semibold hover:bg-[#006C4C]/10"
              >
                Offline Data Vault (Backup / Export)
              </button>
            </div>

            {/* About */}
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1 ${
                isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
              }`}
            >
              <h3 className="font-bold">TAKA Journal</h3>
              <p className="text-slate-500 text-[11px]">
                Version 1.0.0 — Milestone 1: Complete App Foundation
              </p>
              <p className="text-slate-500 text-[11px] pt-1">
                Handcrafted for personal finance management in Bangladesh.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
