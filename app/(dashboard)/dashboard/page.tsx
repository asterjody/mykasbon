'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useDebts } from '@/lib/hooks/useDebts';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { DebtList } from '@/components/dashboard/DebtList';
import { DebtFilters } from '@/components/dashboard/DebtFilters';
import { DebtForm } from '@/components/dashboard/DebtForm';
import { GroupedDebtItem } from '@/components/dashboard/GroupedDebtItem';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/shared/Header';
import { Debt, SortOption } from '@/types';
import { sortDebts, groupDebtsByPerson } from '@/lib/utils/debtUtils';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const router = useRouter();
  const supabase = createClient();
  const { debts, loading, fetchDebts, toggleSettle, deleteDebt } = useDebts({
    status: filterStatus,
    type: filterType,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const processedDebts = useMemo(() => {
    const filtered = debts.filter((debt) =>
      debt.counterpart_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return sortDebts(filtered, sortBy);
  }, [debts, searchQuery, sortBy]);

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        await deleteDebt(id);
      } catch (err) {
        alert('Gagal menghapus data');
      }
    }
  };

  const handleToggleSettle = async (id: string, settled: boolean) => {
    try {
      await toggleSettle(id, settled);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal update status');
    }
  };

  const handleAddNew = () => {
    setEditingDebt(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDebt(null);
  };

  const handleSaveForm = () => {
    setShowForm(false);
    setEditingDebt(null);
    fetchDebts();
  };

  return (
    <>
      <Header onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Summary Cards */}
        <SummaryCards debts={debts} />

        {/* Filter & Action Bar */}
        <div className="mt-6 sm:mt-8">
          {/* Filter Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm mb-4">
            <DebtFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onStatusChange={setFilterStatus}
              filterType={filterType}
              onTypeChange={setFilterType}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Action Button - Mobile Floating */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              {processedDebts.length} entry
            </div>
            <Button onClick={handleAddNew} className="hidden sm:flex">
              <Plus className="w-5 h-5" />
              Tambah
            </Button>
          </div>

          {/* Debt List */}
          {viewMode === 'list' ? (
            <DebtList
              debts={processedDebts}
              loading={loading}
              onToggleSettle={handleToggleSettle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
            />
          ) : (
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : processedDebts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada data
                </div>
              ) : (
                groupDebtsByPerson(processedDebts).map((group) => (
                  <GroupedDebtItem
                    key={group.counterpart_name}
                    group={group}
                    onToggleSettle={handleToggleSettle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button untuk Mobile */}
      <Button
        onClick={handleAddNew}
        className="fixed bottom-6 right-6 sm:hidden rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-50"
        size="lg"
      >
        <Plus className="w-7 h-7" />
      </Button>

      {showForm && (
        <DebtForm
          key={editingDebt?.id || 'new'}
          debt={editingDebt}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      )}
    </>
  );
}
