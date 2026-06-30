'use client';

import { Debt } from '@/types';
import { DebtItem } from './DebtItem';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

interface DebtListProps {
  debts: Debt[];
  loading: boolean;
  onToggleSettle: (id: string, settled: boolean) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onAddNew?: () => void; // Optional callback for add new
}

export function DebtList({
  debts,
  loading,
  onToggleSettle,
  onEdit,
  onDelete,
  onAddNew,
}: DebtListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <EmptyState
        title="Belum ada data"
        description="Mulai catat utang piutangmu sekarang"
        actionLabel="Catat Baru"
        onAction={onAddNew}
      />
    );
  }

  return (
    <div className="space-y-3">
      {debts.map((debt) => (
        <DebtItem
          key={debt.id}
          debt={debt}
          onToggleSettle={onToggleSettle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
