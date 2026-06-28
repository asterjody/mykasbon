'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface DebtFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterType: string;
  onTypeChange: (value: string) => void;
}

export function DebtFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterType,
  onTypeChange,
}: DebtFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="flex-1">
        <Input
          placeholder="Cari nama..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search className="w-5 h-5" />}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-40"
        >
          <option value="all">Semua Status</option>
          <option value="unsettled">Belum Lunas</option>
          <option value="settled">Lunas</option>
        </Select>
        <Select
          value={filterType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-40"
        >
          <option value="all">Semua Tipe</option>
          <option value="owed_to_me">Dihutang</option>
          <option value="i_owe">Saya Hutang</option>
        </Select>
      </div>
    </div>
  );
}
