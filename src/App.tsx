/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Code2,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';
import { Budget, ScreenRoute, Transaction, Wallet, WalletType } from './types';
import { AndroidFrame } from './components/AndroidFrame';
import { TakaBottomBar } from './components/TakaBottomBar';
import { QuickAddModal } from './components/QuickAddModal';
import { HomeScreen } from './components/screens/HomeScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { WalletsScreen } from './components/screens/WalletsScreen';
import { SecondaryScreens } from './components/screens/SecondaryScreens';
import { CodeInspector } from './components/CodeInspector';
import { MobilePushModal } from './components/MobilePushModal';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(false);

  // Active view mode for desktop container (Simulator vs Code Inspector vs Split)
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'split'>('split');

  // Honest Zero-State Financial State (Milestone 1 requirement: zero fictional transactions)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);

  // Navigation State & Backstack
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('home');
  const [routeStack, setRouteStack] = useState<ScreenRoute[]>(['home']);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  // Quick Add Bottom Sheet Modal State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Mobile Push Modal State
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);

  // PWA Direct Install Hook
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Transient notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Navigation push
  const handleNavigate = (route: ScreenRoute) => {
    if (route === currentRoute) return;
    setRouteStack((prev) => [...prev, route]);
    setCurrentRoute(route);
  };

  // Navigation pop (Back button)
  const handleSystemBack = () => {
    // If Quick Add sheet is open, dismiss it first
    if (isQuickAddOpen) {
      setIsQuickAddOpen(false);
      return;
    }

    if (routeStack.length > 1) {
      const nextStack = [...routeStack];
      nextStack.pop();
      const previous = nextStack[nextStack.length - 1];
      setRouteStack(nextStack);
      setCurrentRoute(previous);
    }
  };

  // Reset to initial zero-state
  const handleResetZeroState = () => {
    setTransactions([]);
    setWallets([]);
    setBudget(null);
    setCurrentRoute('home');
    setRouteStack(['home']);
    showToast('App reset to clean first-time zero state.');
  };

  // Add Transaction
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id'>,
    notice: string
  ) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx_' + Date.now(),
    };

    // Update in-memory state
    setTransactions((prev) => [newTx, ...prev]);

    // Update wallet balance if matching wallet found
    if (txData.walletId) {
      setWallets((prev) =>
        prev.map((w) => {
          if (w.id === txData.walletId) {
            const diff =
              txData.type === 'EXPENSE'
                ? -txData.amount
                : txData.type === 'INCOME'
                ? txData.amount
                : -txData.amount;
            return { ...w, currentBalance: w.currentBalance + diff };
          }
          if (txData.type === 'TRANSFER' && w.id === txData.targetWalletId) {
            return { ...w, currentBalance: w.currentBalance + txData.amount };
          }
          return w;
        })
      );
    }

    showToast(notice);
  };

  // Add Wallet
  const handleCreateWallet = (name: string, type: WalletType, initialBalance: number) => {
    const newWallet: Wallet = {
      id: 'wallet_' + Date.now(),
      name,
      type,
      initialBalance,
      currentBalance: initialBalance,
      currency: 'BDT',
      colorHex:
        type === 'MFS_BKASH'
          ? '#E2136E'
          : type === 'MFS_NAGAD'
          ? '#F7941D'
          : type === 'BANK'
          ? '#1976D2'
          : '#006C4C',
      isArchived: false,
      createdAt: Date.now(),
    };
    setWallets((prev) => [...prev, newWallet]);
    showToast(`Wallet "${name}" created with ৳${initialBalance.toLocaleString()} balance.`);
  };

  // Transfer Between Wallets
  const handleTransferWallets = (fromId: string, toId: string, amount: number) => {
    setWallets((prev) =>
      prev.map((w) => {
        if (w.id === fromId) return { ...w, currentBalance: w.currentBalance - amount };
        if (w.id === toId) return { ...w, currentBalance: w.currentBalance + amount };
        return w;
      })
    );
    showToast(`Transferred ৳${amount.toLocaleString()} between accounts.`);
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed from state.');
  };

  // Save budget
  const handleSaveBudget = (amountLimit: number) => {
    const d = new Date();
    setBudget({
      id: 'budget_current',
      amountLimit,
      month: d.getMonth(),
      year: d.getFullYear(),
    });
    showToast(`Monthly budget set to ৳${amountLimit.toLocaleString()}.`);
  };

  // Determine if on primary tab
  const isPrimaryTab =
    currentRoute === 'home' ||
    currentRoute === 'history' ||
    currentRoute === 'insights' ||
    currentRoute === 'wallets';

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${isDark ? 'bg-[#0E0F12] text-white' : 'bg-[#F4F1EA] text-slate-900'}`}>
      {/* Top Applet Header */}
      <header className="h-16 px-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/70 dark:bg-[#121316]/70 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#006C4C] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            ৳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-sm">TAKA Journal</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#006C4C]/15 text-[#006C4C] dark:text-[#68DBAB]">
                Milestone 1 Foundation
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Native Android (Jetpack Compose & Material 3) · com.takajournal.app
            </p>
          </div>
        </div>

        {/* View Switcher & Controls */}
        <div className="flex items-center gap-3">
          {/* Layout Mode Selector (Desktop) */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'simulator'
                  ? 'bg-white dark:bg-[#1F2127] text-[#006C4C] dark:text-[#68DBAB] shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'split'
                  ? 'bg-white dark:bg-[#1F2127] text-[#006C4C] dark:text-[#68DBAB] shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'code'
                  ? 'bg-white dark:bg-[#1F2127] text-[#006C4C] dark:text-[#68DBAB] shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Android Code</span>
            </button>
          </div>

          {/* In-App Direct Install Button */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-95 transition-all animate-pulse"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install to Device</span>
            </button>
          )}

          {/* Push to Phone Button */}
          <button
            onClick={() => setIsPushModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#006C4C] text-white hover:bg-[#00583e] dark:bg-[#68DBAB] dark:text-[#003825] shadow-sm active:scale-95 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Push to Phone</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-4 md:p-8 flex justify-center items-start overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
          {/* Left/Center Column: Android Mobile Device Simulator */}
          {(activeTab === 'simulator' || activeTab === 'split') && (
            <div className={`w-full flex flex-col items-center shrink-0 ${activeTab === 'split' ? 'lg:w-[420px]' : 'max-w-md'}`}>
              <AndroidFrame
                isDark={isDark}
                onSystemBack={handleSystemBack}
                onResetState={handleResetZeroState}
              >
                {/* Screen Content Router */}
                <div className="relative flex-1 overflow-hidden flex flex-col">
                  {currentRoute === 'home' && (
                    <HomeScreen
                      transactions={transactions}
                      budget={budget}
                      isDark={isDark}
                      onNavigate={handleNavigate}
                      onQuickAdd={() => setIsQuickAddOpen(true)}
                      onSelectTransaction={(id) => {
                        setSelectedTransactionId(id);
                        handleNavigate('transaction_detail');
                      }}
                    />
                  )}

                  {currentRoute === 'history' && (
                    <HistoryScreen
                      transactions={transactions}
                      isDark={isDark}
                      onNavigate={handleNavigate}
                      onQuickAdd={() => setIsQuickAddOpen(true)}
                      onSelectTransaction={(id) => {
                        setSelectedTransactionId(id);
                        handleNavigate('transaction_detail');
                      }}
                    />
                  )}

                  {currentRoute === 'insights' && (
                    <InsightsScreen
                      transactions={transactions}
                      isDark={isDark}
                      onNavigate={handleNavigate}
                      onQuickAdd={() => setIsQuickAddOpen(true)}
                    />
                  )}

                  {currentRoute === 'wallets' && (
                    <WalletsScreen
                      wallets={wallets}
                      isDark={isDark}
                      onNavigate={handleNavigate}
                      onSelectWallet={(id) => {
                        setSelectedWalletId(id);
                        handleNavigate('wallet_detail');
                      }}
                      onCreateWallet={handleCreateWallet}
                      onTransfer={handleTransferWallets}
                    />
                  )}

                  {/* Secondary Routes */}
                  {!isPrimaryTab && (
                    <SecondaryScreens
                      currentRoute={currentRoute}
                      selectedTransactionId={selectedTransactionId}
                      selectedWalletId={selectedWalletId}
                      transactions={transactions}
                      wallets={wallets}
                      budget={budget}
                      isDark={isDark}
                      onNavigateBack={handleSystemBack}
                      onNavigateToEdit={(id) => {
                        setSelectedTransactionId(id);
                        handleNavigate('edit_transaction');
                      }}
                      onDeleteTransaction={handleDeleteTransaction}
                      onSaveBudget={handleSaveBudget}
                      onToggleTheme={() => setIsDark(!isDark)}
                    />
                  )}
                </div>

                {/* Bottom Bar: Only shown on the 4 primary tabs */}
                {isPrimaryTab && (
                  <TakaBottomBar
                    currentRoute={currentRoute}
                    onNavigate={handleNavigate}
                    onQuickAdd={() => setIsQuickAddOpen(true)}
                    isDark={isDark}
                  />
                )}

                {/* Quick Add Modal Sheet */}
                <QuickAddModal
                  isOpen={isQuickAddOpen}
                  wallets={wallets}
                  isDark={isDark}
                  onClose={() => setIsQuickAddOpen(false)}
                  onSave={handleSaveTransaction}
                />
              </AndroidFrame>

              {/* Mobile Simulator Subtext */}
              <div className="text-center mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span>Interactive Compose Simulator</span>
                <span className="mx-1.5">·</span>
                <span>Click (+) to test Quick Add & Discard draft guard</span>
              </div>
            </div>
          )}

          {/* Right Column: Android Project Architecture & Code Inspector */}
          {(activeTab === 'code' || activeTab === 'split') && (
            <div className={`w-full flex-1 flex flex-col gap-4 ${activeTab === 'split' ? 'max-w-2xl' : 'max-w-4xl'}`}>
              {/* Architecture & Milestone 1 Summary Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#16181D] border border-black/10 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#006C4C] dark:text-[#68DBAB]" />
                    <h2 className="text-sm font-bold">Milestone 1 Architecture Verified</h2>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                    Foundation Ready
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  The complete native Android project has been generated in <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[11px]">/android</code> with single-activity navigation, ViewModels, StateFlow, Material 3 design tokens, and domain models ready for Milestone 2.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Clean Architecture & Domain Models</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>4 Destinations + Modal Quick Add FAB</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Draft Protection & Honest Zero States</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Bangladeshi Taka (৳) Tabular Formats</span>
                  </div>
                </div>
              </div>

              {/* Code Inspector Component */}
              <div className="h-[680px]">
                <CodeInspector />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-medium shadow-2xl animate-fade-in max-w-md text-center">
          <Info className="w-4 h-4 shrink-0 text-[#68DBAB] dark:text-[#006C4C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Push & QR Code Modal */}
      <MobilePushModal
        isOpen={isPushModalOpen}
        onClose={() => setIsPushModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
