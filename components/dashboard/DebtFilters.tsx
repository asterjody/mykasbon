'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SortOption } from '@/types';
import { DebtSorter } from './DebtSorters';

interface DebtFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterType: string;
  onTypeChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: 'list' | 'grouped';
  onViewModeChange: (value: 'list' | 'grouped') => void;
}

export function DebtFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterType,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: DebtFiltersProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Row 1: Search + Status + Type */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Cari nama..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Urutkan:
            </span>
            <DebtSorter sortBy={sortBy} onSortChange={onSortChange} />
          </div>
        </div>
      </div>

      {/* Row 2: Sort + View Mode */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2">
          <Select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="flex-1 sm:w-36"
          >
            <option value="all">Semua Status</option>
            <option value="unsettled">Belum Lunas</option>
            <option value="settled">Lunas</option>
          </Select>
          <Select
            value={filterType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="flex-1 sm:w-36"
          >
            <option value="all">Semua Tipe</option>
            <option value="owed_to_me">Dihutang</option>
            <option value="i_owe">Saya Hutang</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Tampilan:
          </span>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              List
            </button>
            <button
              onClick={() => onViewModeChange('grouped')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'grouped'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
