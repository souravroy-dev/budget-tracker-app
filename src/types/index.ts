export type TransactionType = 'EXPENSE' | 'INCOME' | 'TRANSFER';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  iconName: string;
  colorHex: string;
}

export type WalletType =
  | 'CASH'
  | 'MFS_BKASH'
  | 'MFS_NAGAD'
  | 'MFS_ROCKET'
  | 'BANK'
  | 'OTHER';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  colorHex: string;
  isArchived: boolean;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  walletId: string;
  targetWalletId?: string;
  categoryId?: string;
  timestamp: number;
  notes?: string;
  tags?: string[];
  photoUri?: string;
  locationName?: string;
}

export interface Budget {
  id: string;
  categoryId?: string;
  amountLimit: number;
  month: number;
  year: number;
}

export type ScreenRoute =
  | 'home'
  | 'history'
  | 'insights'
  | 'wallets'
  | 'settings'
  | 'budget_management'
  | 'backup_restore'
  | 'transaction_detail'
  | 'edit_transaction'
  | 'wallet_detail';
