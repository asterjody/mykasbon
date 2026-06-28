'use client';

import { Debt } from '@/types';
import { formatRupiah } from '@/lib/utils/format';
import { getRelativeTime } from '@/lib/utils/date';
import {
  CheckCircle,
  Circle,
  Edit2,
  Trash2,
  User,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface DebtItemProps {
  debt: Debt;
  onToggleSettle: (id: string, settled: boolean) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export function DebtItem({
  debt,
  onToggleSettle,
  onEdit,
  onDelete,
}: DebtItemProps) {
  const isSettled = !!debt.settled_at;
  const isOwedToMe = debt.type === 'owed_to_me';

  const handleToggle = () => {
    console.log('Toggling debt:', { id: debt.id, currentStatus: isSettled }); // Debug log
    onToggleSettle(debt.id, !isSettled);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 truncate">
                {debt.counterpart_name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                <span
                  className={isOwedToMe ? 'text-green-600' : 'text-red-600'}
                >
                  {isOwedToMe ? 'Dihutang' : 'Saya hutang'}
                </span>
                <span>•</span>
                <span>{getRelativeTime(debt.created_at)}</span>
                {debt.due_date && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Jatuh tempo:{' '}
                      {new Date(debt.due_date).toLocaleDateString('id-ID')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-lg font-semibold text-gray-900">
            {formatRupiah(debt.amount)}
          </span>

          <Badge variant={isSettled ? 'success' : 'warning'}>
            {isSettled ? 'Lunas' : 'Belum Lunas'}
          </Badge>

          <div className="flex gap-1 ml-auto sm:ml-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="text-xs"
              title={isSettled ? 'Tandai belum lunas' : 'Tandai lunas'}
            >
              {isSettled ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(debt)}
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(debt.id)}
              className="text-red-600 hover:text-red-700"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {debt.note && (
        <p className="text-sm text-gray-600 mt-2 pl-10 border-l-2 border-gray-200">
          {debt.note}
        </p>
      )}
    </div>
  );
}
