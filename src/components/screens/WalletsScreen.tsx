import React, { useState } from 'react';
import {
  Wallet as WalletIcon,
  Plus,
  ArrowLeftRight,
  ChevronRight,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { ScreenRoute, Wallet, WalletType } from '../../types';
import { TabularCurrency } from '../TabularCurrency';
import { EmptyState } from '../EmptyState';

interface WalletsScreenProps {
  wallets: Wallet[];
  isDark: boolean;
  onNavigate: (route: ScreenRoute) => void;
  onSelectWallet: (id: string) => void;
  onCreateWallet: (name: string, type: WalletType, initialBalance: number) => void;
  onTransfer: (fromId: string, toId: string, amount: number) => void;
}

export const WalletsScreen: React.FC<WalletsScreenProps> = ({
  wallets,
  isDark,
  onNavigate,
  onSelectWallet,
  onCreateWallet,
  onTransfer,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Add Wallet State
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState<WalletType>('CASH');
  const [initialBalance, setInitialBalance] = useState('');

  // Transfer State
  const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || '');
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || '');
  const [transferAmount, setTransferAmount] = useState('');

  const totalBalance = wallets.reduce((acc, w) => acc + w.currentBalance, 0);

  const getWalletIcon = (type: WalletType) => {
    switch (type) {
      case 'CASH':
        return Banknote;
      case 'MFS_BKASH':
      case 'MFS_NAGAD':
      case 'MFS_ROCKET':
        return Smartphone;
      case 'BANK':
        return Building;
      default:
        return CreditCard;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletName.trim()) return;
    onCreateWallet(walletName.trim(), walletType, parseFloat(initialBalance) || 0);
    setWalletName('');
    setInitialBalance('');
    setShowAddModal(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0 || fromWalletId === toWalletId) return;
    onTransfer(fromWalletId, toWalletId, amt);
    setTransferAmount('');
    setShowTransferModal(false);
  };

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
        <h1 className="text-xl font-bold tracking-tight">Wallets & Accounts</h1>
      </header>

      {/* Screen Body */}
      <div className="p-4 space-y-4 pb-20">
        {/* Total Balance Hero Card */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA] shadow-xs'
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Total Combined Funds
          </span>
          <TabularCurrency
            amount={totalBalance}
            className="text-3xl font-bold block mb-4"
            isDark={isDark}
          />

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 ${
                isDark
                  ? 'bg-[#68DBAB] text-[#003825] hover:bg-[#58ca9b]'
                  : 'bg-[#006C4C] text-white hover:bg-[#00583e]'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Wallet</span>
            </button>

            <button
              onClick={() => {
                if (wallets.length >= 2) {
                  setFromWalletId(wallets[0].id);
                  setToWalletId(wallets[1].id);
                  setShowTransferModal(true);
                }
              }}
              disabled={wallets.length < 2}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                wallets.length < 2
                  ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                  : isDark
                  ? 'border-[#2F3138] hover:bg-[#24262C] text-[#E4E2E6]'
                  : 'border-[#E6E2DA] hover:bg-[#F2EFE8] text-[#1C1B1F]'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Wallets List Section */}
        <div>
          <h2 className="text-sm font-bold mb-2 px-1">My Wallets & Accounts</h2>

          {wallets.length === 0 ? (
            <div
              className={`rounded-2xl border ${
                isDark ? 'bg-[#1A1C20] border-[#2F3138]' : 'bg-[#FFFFFF] border-[#E6E2DA]'
              }`}
            >
              <EmptyState
                icon={WalletIcon}
                title="No wallets created"
                description="Add your physical cash pocket, bKash, Nagad, or bank accounts to track where your money lives."
                actionLabel="Add First Wallet"
                onAction={() => setShowAddModal(true)}
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
              {wallets.map((wallet) => {
                const Icon = getWalletIcon(wallet.type);
                return (
                  <div
                    key={wallet.id}
                    onClick={() => onSelectWallet(wallet.id)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-[#24262C]' : 'hover:bg-[#F2EFE8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: wallet.colorHex || '#006C4C' }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold">{wallet.name}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {wallet.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TabularCurrency
                        amount={wallet.currentBalance}
                        className="text-xs font-bold"
                        isDark={isDark}
                      />
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Wallet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden ${
              isDark ? 'bg-[#1A1C20] text-white' : 'bg-white text-slate-900'
            }`}
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold">Add New Wallet</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Wallet Name
                </label>
                <input
                  type="text"
                  required
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="e.g. Daily Cash, Personal bKash"
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Account Type
                </label>
                <select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value as WalletType)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                >
                  <option value="CASH">Physical Cash</option>
                  <option value="MFS_BKASH">bKash (MFS)</option>
                  <option value="MFS_NAGAD">Nagad (MFS)</option>
                  <option value="MFS_ROCKET">Rocket (MFS)</option>
                  <option value="BANK">Bank Account</option>
                  <option value="OTHER">Other Account</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Initial Balance (৳ Taka)
                </label>
                <input
                  type="number"
                  step="any"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0.00"
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#006C4C] text-white hover:bg-[#00583e]"
                >
                  Create Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Funds Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden ${
              isDark ? 'bg-[#1A1C20] text-white' : 'bg-white text-slate-900'
            }`}
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold">Transfer Between Wallets</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleTransferSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Source Account
                </label>
                <select
                  value={fromWalletId}
                  onChange={(e) => setFromWalletId(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (৳{w.currentBalance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Destination Account
                </label>
                <select
                  value={toWalletId}
                  onChange={(e) => setToWalletId(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                >
                  {wallets
                    .filter((w) => w.id !== fromWalletId)
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} (৳{w.currentBalance.toLocaleString()})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Transfer Amount (৳ Taka)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#006C4C] text-white hover:bg-[#00583e]"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
