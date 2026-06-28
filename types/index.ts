export type DebtType = 'owed_to_me' | 'i_owe';

export interface Debt {
  id: string;
  user_id: string;
  type: DebtType;
  counterpart_name: string;
  amount: number;
  note: string | null;
  due_date: string | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DebtSummary {
  totalOwedToMe: number;
  totalIOwe: number;
  net: number;
}

export type SortOption = 'newest' | 'oldest' | 'amount_high' | 'amount_low';

export interface GroupedDebt {
  counterpart_name: string;
  debts: Debt[];
  totalAmount: number;
  count: number;
}
