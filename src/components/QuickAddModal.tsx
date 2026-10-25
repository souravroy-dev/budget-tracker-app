import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar,
  Tag,
  FileText,
  Check,
} from 'lucide-react';
import { Transaction, TransactionType, Wallet } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

interface QuickAddModalProps {
  isOpen: boolean;
  wallets: Wallet[];
  isDark: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>, notice: string) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  wallets,
  isDark,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [naturalText, setNaturalText] = useState('');
  const [detectedAmount, setDetectedAmount] = useState<number | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');
  const [targetWalletId, setTargetWalletId] = useState(wallets[1]?.id || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat_food');
  const [notes, setNotes] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Sync default wallet if wallets change
  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id);
    }
  }, [wallets, selectedWalletId]);

  // Is draft dirty?
  const isDirty =
    amountInput.trim() !== '' ||
    description.trim() !== '' ||
    naturalText.trim() !== '' ||
    notes.trim() !== '';

  const handleNaturalTextChange = (text: string) => {
    setNaturalText(text);
    // Regex for currency detection (e.g. "Rickshaw 60", "250 tk lunch")
    const match = text.match(/\b\d+(\.\d{1,2})?\b/);
    if (match) {
      const num = parseFloat(match[0]);
      setDetectedAmount(num);
      if (!amountInput) {
        setAmountInput(num.toString());
      }
      // Extract remaining text as description
      let cleanDesc = text.replace(match[0], '').replace(/\b(tk|taka|bdt|৳)\b/gi, '').trim();
      if (cleanDesc && !description) {
        setDescription(cleanDesc);
      }
    } else {
      setDetectedAmount(null);
    }
  };

  const handleDismissAttempt = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      handleFullReset();
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    handleFullReset();
    onClose();
  };

  const handleFullReset = () => {
    setType('EXPENSE');
    setNaturalText('');
    setDetectedAmount(null);
    setAmountInput('');
    setDescription('');
    setNotes('');
    setIsAdvancedOpen(false);
    setShowDiscardConfirm(false);
  };

  const handleSave = () => {
    const parsedAmount = parseFloat(amountInput);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onSave(
      {
        type,
        amount: parsedAmount,
        currency: 'BDT',
        description: description.trim() || type.toLowerCase(),
        walletId: selectedWalletId || 'default_cash',
        targetWalletId: type === 'TRANSFER' ? targetWalletId : undefined,
        categoryId: selectedCategoryId,
        timestamp: Date.now(),
        notes: notes.trim(),
      },
      'Milestone 1 Preview: Persistence to Room SQLite is slated for Milestone 2. Entry verified in app state!'
    );

    handleFullReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Click outside backdrop triggers dismiss check */}
      <div className="absolute inset-0" onClick={handleDismissAttempt} />

      <div
        className={`relative z-10 w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden transition-all ${
          isDark ? 'bg-[#1A1C20] text-[#E4E2E6]' : 'bg-[#FFFFFF] text-[#1C1B1F]'
        }`}
      >
        {/* Top Drag Handle / Header */}
        <div className="pt-3 px-6 pb-2 shrink-0">
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Quick Record</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Offline financial journal entry
              </p>
            </div>
            <button
              onClick={handleDismissAttempt}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-3 overflow-y-auto space-y-4">
          {/* 1. Transaction Type Segmented Control */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-[#24262C] rounded-xl text-xs font-semibold">
            {(['EXPENSE', 'INCOME', 'TRANSFER'] as TransactionType[]).map((t) => {
              const active = type === t;
              let activeColor = 'bg-white dark:bg-[#1A1C20] text-slate-900 dark:text-white shadow-xs';
              if (active) {
                if (t === 'EXPENSE') activeColor = 'bg-[#BA1A1A] text-white shadow-xs';
                if (t === 'INCOME') activeColor = 'bg-[#006C4C] text-white shadow-xs';
                if (t === 'TRANSFER') activeColor = 'bg-[#3E5F90] text-white shadow-xs';
              }
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 rounded-lg transition-all ${
                    active ? activeColor : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t === 'EXPENSE' ? 'Expense' : t === 'INCOME' ? 'Income' : 'Transfer'}
                </button>
              );
            })}
          </div>

          {/* 2. Free-Text Natural Input with live parser */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type="text"
                value={naturalText}
                onChange={(e) => handleNaturalTextChange(e.target.value)}
                placeholder="Smart Entry: e.g. Rickshaw 60 or Lunch 250 tk"
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-[#121316] border-[#2F3138] focus:border-[#68DBAB]'
                    : 'bg-[#FBF9F5] border-[#E6E2DA] focus:border-[#006C4C]'
                } outline-hidden`}
              />
              <Sparkles className="w-4 h-4 absolute right-3 top-3 text-[#006C4C] dark:text-[#68DBAB] pointer-events-none opacity-80" />
            </div>
            {detectedAmount !== null && (
              <p className="text-[11px] text-[#006C4C] dark:text-[#68DBAB] font-medium pl-1 flex items-center gap-1">
                <span>Detected amount:</span>
                <span className="font-mono font-bold">৳{detectedAmount}</span>
              </p>
            )}
          </div>

          {/* 3. Amount & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Amount (৳ Taka)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 font-bold text-sm text-slate-500 dark:text-slate-400">
                  ৳
                </span>
                <input
                  type="number"
                  step="any"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className={`w-full text-base font-mono font-semibold pl-8 pr-3.5 py-2 rounded-xl border transition-colors ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] focus:border-[#68DBAB]'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] focus:border-[#006C4C]'
                  } outline-hidden`}
                />
              </div>

              {/* Quick increment pills */}
              <div className="flex gap-1.5 mt-2">
                {[50, 100, 500, 1000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(amountInput) || 0;
                      setAmountInput((cur + inc).toString());
                    }}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                      isDark
                        ? 'border-[#2F3138] bg-[#24262C] text-slate-300'
                        : 'border-[#E6E2DA] bg-[#F2EFE8] text-slate-700'
                    }`}
                  >
                    +{inc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this for?"
                className={`w-full text-xs px-3.5 py-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-[#121316] border-[#2F3138] focus:border-[#68DBAB]'
                    : 'bg-[#FBF9F5] border-[#E6E2DA] focus:border-[#006C4C]'
                } outline-hidden`}
              />
            </div>
          </div>

          {/* 4. Wallet Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {type === 'TRANSFER' ? 'From Wallet' : 'Paid From / Saved To'}
              </label>
              {wallets.length > 0 ? (
                <select
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.type})
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  className={`text-[11px] px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#24262C] border-[#2F3138] text-slate-400'
                      : 'bg-[#F2EFE8] border-[#E6E2DA] text-slate-600'
                  }`}
                >
                  Default Cash (no custom wallets yet)
                </div>
              )}
            </div>

            {type === 'TRANSFER' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  To Destination Wallet
                </label>
                <select
                  value={targetWalletId}
                  onChange={(e) => setTargetWalletId(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${
                    isDark
                      ? 'bg-[#121316] border-[#2F3138] text-white'
                      : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                  } outline-hidden`}
                >
                  {wallets
                    .filter((w) => w.id !== selectedWalletId)
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.type})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* 5. Expandable Advanced Details */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[#006C4C] dark:text-[#68DBAB] py-1"
            >
              <span>Advanced Details (Category, Notes, Tags)</span>
              {isAdvancedOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isAdvancedOpen && (
              <div className="mt-2 space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border ${
                      isDark
                        ? 'bg-[#121316] border-[#2F3138] text-white'
                        : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                    } outline-hidden`}
                  >
                    {DEFAULT_CATEGORIES.filter((c) => c.type === type).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Notes & Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional memo or breakdown..."
                    className={`w-full text-xs px-3.5 py-2 rounded-xl border resize-none ${
                      isDark
                        ? 'bg-[#121316] border-[#2F3138] text-white'
                        : 'bg-[#FBF9F5] border-[#E6E2DA] text-slate-900'
                    } outline-hidden`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. Honest Milestone 1 Persistence Notice Banner */}
          <div
            className={`p-3 rounded-xl flex items-start gap-2.5 text-[11px] ${
              isDark
                ? 'bg-[#005138]/20 border border-[#005138]/40 text-[#68DBAB]'
                : 'bg-[#E3F7EE] border border-[#C8F0DC] text-[#006C4C]'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Milestone 1 Preview:</span> Persistence to Room
              SQLite database is slated for Milestone 2. Entries will be verified live in app
              state!
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div
          className={`p-4 border-t shrink-0 flex items-center justify-end gap-3 ${
            isDark ? 'border-[#2F3138] bg-[#1A1C20]' : 'border-[#E6E2DA] bg-[#FFFFFF]'
          }`}
        >
          <button
            type="button"
            onClick={handleDismissAttempt}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              isDark
                ? 'border-[#2F3138] text-slate-300 hover:bg-[#24262C]'
                : 'border-[#E6E2DA] text-slate-700 hover:bg-[#F2EFE8]'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!amountInput || parseFloat(amountInput) <= 0}
            className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm ${
              !amountInput || parseFloat(amountInput) <= 0
                ? 'opacity-40 cursor-not-allowed bg-slate-300 text-slate-500'
                : isDark
                ? 'bg-[#68DBAB] text-[#003825] hover:bg-[#58ca9b] active:scale-95'
                : 'bg-[#006C4C] text-white hover:bg-[#00583e] active:scale-95'
            }`}
          >
            Save Entry
          </button>
        </div>
      </div>

      {/* Discard Draft Confirmation Alert */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 animate-fade-in">
          <div
            className={`w-full max-w-xs p-5 rounded-2xl shadow-xl ${
              isDark ? 'bg-[#24262C] text-[#E4E2E6]' : 'bg-[#FFFFFF] text-[#1C1B1F]'
            }`}
          >
            <h3 className="text-sm font-bold mb-1.5">Discard entry draft?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              You have unsaved changes in this transaction. Discarding will lose this information.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Editing
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Discard Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
