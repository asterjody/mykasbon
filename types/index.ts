import { User } from '@supabase/supabase-js';

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

export type DebtInsert = Omit<
  Debt,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;
export type DebtUpdate = Partial<DebtInsert>;

export type { User };
