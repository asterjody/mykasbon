'use client';

import { Debt } from '@/types';
import { formatRupiah } from '@/lib/utils/format';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface SummaryCardsProps {
  debts: Debt[];
}

export function SummaryCards({ debts }: SummaryCardsProps) {
  const totalOwedToMe = debts
    .filter((d) => d.type === 'owed_to_me' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalIOwe = debts
    .filter((d) => d.type === 'i_owe' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0);

  const net = totalOwedToMe - totalIOwe;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">
              Dihutang ke Saya
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatRupiah(totalOwedToMe)}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <ArrowUpRight className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {debts.filter((d) => d.type === 'owed_to_me' && !d.settled_at).length}{' '}
          entry aktif
        </p>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Saya Hutang</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatRupiah(totalIOwe)}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <ArrowDownRight className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {debts.filter((d) => d.type === 'i_owe' && !d.settled_at).length}{' '}
          entry aktif
        </p>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Net</p>
            <p
              className={`text-2xl font-bold mt-1 ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatRupiah(net)}
            </p>
          </div>
          <div
            className={`p-3 rounded-full ${net >= 0 ? 'bg-green-100' : 'bg-red-100'}`}
          >
            <TrendingUp
              className={`w-6 h-6 ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {net >= 0 ? 'Dihutang lebih banyak' : 'Lebih banyak hutang'}
        </p>
      </Card>
    </div>
  );
}
