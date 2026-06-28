'use client';

import { SortOption } from '@/types';
import { Select } from '@/components/ui/Select';

interface DebtSorterProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function DebtSorter({ sortBy, onSortChange }: DebtSorterProps) {
  return (
    <Select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value as SortOption)}
      className="w-40"
    >
      <option value="newest">⬇️ Terbaru</option>
      <option value="oldest">⬆️ Terlama</option>
      <option value="amount_high">💰 Tertinggi</option>
      <option value="amount_low">💰 Terendah</option>
    </Select>
  );
}
