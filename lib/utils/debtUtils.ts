import { Debt, SortOption, GroupedDebt } from '@/types';

export function sortDebts(debts: Debt[], sortBy: SortOption): Debt[] {
  const sorted = [...debts];

  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    case 'amount_high':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'amount_low':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
}

export function groupDebtsByPerson(debts: Debt[]): GroupedDebt[] {
  const grouped = debts.reduce(
    (acc, debt) => {
      const key = debt.counterpart_name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(debt);
      return acc;
    },
    {} as Record<string, Debt[]>,
  );

  return Object.entries(grouped).map(([name, debts]) => ({
    counterpart_name: name,
    debts,
    totalAmount: debts.reduce((sum, d) => sum + d.amount, 0),
    count: debts.length,
  }));
}
