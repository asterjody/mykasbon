'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useDebts } from '@/lib/hooks/useDebts';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { DebtList } from '@/components/dashboard/DebtList';
import { DebtFilters } from '@/components/dashboard/DebtFilters';
import { DebtForm } from '@/components/dashboard/DebtForm';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/shared/Header';
import { Debt } from '@/types';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
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

  const filteredDebts = debts.filter((debt) =>
    debt.counterpart_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SummaryCards debts={debts} />

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <DebtFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onStatusChange={setFilterStatus}
              filterType={filterType}
              onTypeChange={setFilterType}
            />

            <Button onClick={handleAddNew} className="w-full sm:w-auto">
              <Plus className="w-5 h-5" />
              Catat Baru
            </Button>
          </div>

          <DebtList
            debts={filteredDebts}
            loading={loading}
            onToggleSettle={handleToggleSettle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
          />
        </div>
      </main>

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
