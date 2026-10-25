import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Food & Groceries', type: 'EXPENSE', iconName: 'Utensils', colorHex: '#006C4C' },
  { id: 'cat_transport', name: 'Transport & Rickshaw', type: 'EXPENSE', iconName: 'Car', colorHex: '#1976D2' },
  { id: 'cat_utilities', name: 'Utilities & Bills', type: 'EXPENSE', iconName: 'Zap', colorHex: '#F57C00' },
  { id: 'cat_recharge', name: 'Mobile Recharge', type: 'EXPENSE', iconName: 'Smartphone', colorHex: '#7B1FA2' },
  { id: 'cat_dining', name: 'Dining Out', type: 'EXPENSE', iconName: 'Coffee', colorHex: '#D32F2F' },
  { id: 'cat_shopping', name: 'Shopping', type: 'EXPENSE', iconName: 'ShoppingBag', colorHex: '#C2185B' },
  { id: 'cat_health', name: 'Health & Pharmacy', type: 'EXPENSE', iconName: 'Activity', colorHex: '#388E3C' },
  { id: 'cat_housing', name: 'Rent & Housing', type: 'EXPENSE', iconName: 'Home', colorHex: '#5D4037' },
  { id: 'cat_other_exp', name: 'Other Expense', type: 'EXPENSE', iconName: 'MoreHorizontal', colorHex: '#616161' },

  { id: 'cat_salary', name: 'Salary', type: 'INCOME', iconName: 'Banknote', colorHex: '#2E7D32' },
  { id: 'cat_freelance', name: 'Freelancing', type: 'INCOME', iconName: 'Laptop', colorHex: '#0288D1' },
  { id: 'cat_business', name: 'Business & Sales', type: 'INCOME', iconName: 'Store', colorHex: '#689F38' },
  { id: 'cat_gift', name: 'Gift & Remittance', type: 'INCOME', iconName: 'Gift', colorHex: '#7B1FA2' },
  { id: 'cat_other_inc', name: 'Other Income', type: 'INCOME', iconName: 'PiggyBank', colorHex: '#00796B' },

  { id: 'cat_transfer', name: 'Transfer', type: 'TRANSFER', iconName: 'ArrowLeftRight', colorHex: '#455A64' },
];
