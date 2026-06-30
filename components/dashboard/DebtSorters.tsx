'use client';

import { SortOption } from '@/types';
import { Select } from '@/components/ui/Select';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CircleDollarSign,
} from 'lucide-react';

interface DebtSorterProps {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function DebtSorter({ sortBy, onSortChange }: DebtSorterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <ArrowUpDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <Select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="w-40"
      >
        <option value="newest">
          <span className="flex items-center gap-1">
            <ArrowDown className="w-3 h-3" /> Terbaru
          </span>
        </option>
        <option value="oldest">
          <span className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3" /> Terlama
          </span>
        </option>
        <option value="amount_high">
          <span className="flex items-center gap-1">
            <CircleDollarSign className="w-3 h-3" /> Tertinggi
          </span>
        </option>
        <option value="amount_low">
          <span className="flex items-center gap-1">
            <CircleDollarSign className="w-3 h-3" /> Terendah
          </span>
        </option>
      </Select>
    </div>
  );
}
