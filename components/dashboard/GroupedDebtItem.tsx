'use client';

import { Debt, GroupedDebt } from '@/types';
import { User, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DebtItem } from './DebtItem';
import { formatRupiah } from '@/lib/utils/format';

interface GroupedDebtItemProps {
  group: GroupedDebt;
  onToggleSettle: (id: string, settled: boolean) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export function GroupedDebtItem({
  group,
  onToggleSettle,
  onEdit,
  onDelete,
}: GroupedDebtItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">
              {group.counterpart_name}
            </h3>
            <p className="text-sm text-gray-500">
              {group.count} entry • Total {formatRupiah(group.totalAmount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">
            {formatRupiah(group.totalAmount)}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
          {group.debts.map((debt) => (
            <DebtItem
              key={debt.id}
              debt={debt}
              onToggleSettle={onToggleSettle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
