'use client';

import { useState, useEffect } from 'react';
import { Debt } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/classnames';

type DebtType = 'owed_to_me' | 'i_owe';

interface FormData {
  type: DebtType;
  counterpart_name: string;
  amount: string;
  note: string;
  due_date: string;
}

interface DebtFormProps {
  debt?: Debt | null;
  onClose: () => void;
  onSave: () => void;
}

// Helper function to format number with thousand separators
function formatRupiah(value: string): string {
  // Hanya angka
  const number = value.replace(/[^0-9]/g, '');
  if (!number) return '';

  // Format dengan titik sebagai separator ribuan
  return new Intl.NumberFormat('id-ID').format(parseInt(number));
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to get initial form data
function getInitialFormData(debt?: Debt | null): FormData {
  if (debt) {
    return {
      type: debt.type,
      counterpart_name: debt.counterpart_name,
      amount: debt.amount.toString(),
      note: debt.note || '',
      due_date: debt.due_date
        ? new Date(debt.due_date).toISOString().split('T')[0]
        : getTodayDate(),
    };
  }

  return {
    type: 'owed_to_me',
    counterpart_name: '',
    amount: '',
    note: '',
    due_date: getTodayDate(), // Default today for new entry
  };
}

export function DebtForm({ debt, onClose, onSave }: DebtFormProps) {
  // Use state with initial value based on debt
  const [formData, setFormData] = useState<FormData>(() =>
    getInitialFormData(debt),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!debt;

  // Handle amount change with formatting
  const handleAmountChange = (value: string) => {
    // Simpan nilai numerik murni untuk state
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, amount: numericValue });
  };

  // Reset form when debt changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(getInitialFormData(debt));
  }, [debt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate amount
    const amountNum = parseInt(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Jumlah harus lebih dari 0');
      setLoading(false);
      return;
    }

    const payload = {
      type: formData.type,
      counterpart_name: formData.counterpart_name.trim(),
      amount: amountNum,
      note: formData.note.trim() || null,
      due_date: formData.due_date || null,
    };

    try {
      const url = isEditing ? `/api/debts/${debt?.id}` : '/api/debts';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal menyimpan data');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // Display formatted amount with thousand separators
  const displayAmount = formData.amount ? formatRupiah(formData.amount) : '';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? 'Edit Entry' : 'Tambah'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Tipe</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'owed_to_me' as DebtType, label: 'Saya Dihutang' },
              { value: 'i_owe' as DebtType, label: 'Saya Hutang' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: option.value })}
                className={cn(
                  'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                  formData.type === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Nama Orang"
          placeholder="Masukkan nama"
          value={formData.counterpart_name}
          onChange={(e) =>
            setFormData({ ...formData, counterpart_name: e.target.value })
          }
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah (Rp)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              Rp
            </span>
            <input
              type="text"
              placeholder="0"
              value={displayAmount}
              onChange={(e) => {
                // Ambil hanya angka dari input
                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                handleAmountChange(rawValue);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Masukkan angka tanpa titik atau koma
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal
          </label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Input
          label="Catatan (opsional)"
          placeholder="Tambahkan catatan"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          maxLength={200}
        />
        <p className="text-xs text-gray-500 text-right">
          {formData.note.length}/200 karakter
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Batal
          </Button>
          <Button type="submit" loading={loading} fullWidth>
            {isEditing ? 'Update' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
