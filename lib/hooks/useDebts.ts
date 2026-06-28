'use client';

import { useState, useEffect, useCallback } from 'react';
import { Debt } from '@/types';

interface UseDebtsOptions {
  status?: string;
  type?: string;
}

export function useDebts(options: UseDebtsOptions = {}) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.status && options.status !== 'all') {
        params.append('status', options.status);
      }
      if (options.type && options.type !== 'all') {
        params.append('type', options.type);
      }

      const response = await fetch(`/api/debts?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal fetch data');
      }
      const data = await response.json();
      setDebts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [options.status, options.type]);

  const toggleSettle = useCallback(
    async (id: string, settled: boolean) => {
      try {
        console.log('Toggling settle:', { id, settled }); // Debug log

        const response = await fetch(`/api/debts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settled }),
        });

        const data = await response.json();
        console.log('Response:', { status: response.status, data }); // Debug log

        if (!response.ok) {
          throw new Error(data.error || 'Gagal update status');
        }

        // Refresh data setelah update
        await fetchDebts();
        return data;
      } catch (err) {
        console.error('Toggle settle error:', err);
        throw err;
      }
    },
    [fetchDebts],
  );

  const deleteDebt = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/debts/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Gagal hapus data');
        }

        // Refresh data setelah delete
        await fetchDebts();
        return data;
      } catch (err) {
        console.error('Delete error:', err);
        throw err;
      }
    },
    [fetchDebts],
  );

  // Fetch data saat mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDebts();
  }, [fetchDebts]);

  return {
    debts,
    loading,
    error,
    fetchDebts,
    toggleSettle,
    deleteDebt,
  };
}
