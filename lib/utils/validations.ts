import { z } from 'zod';

export const debtSchema = z.object({
  type: z.enum(['owed_to_me', 'i_owe']),
  counterpart_name: z.string().min(1, 'Nama wajib diisi'),
  amount: z.number().positive('Jumlah harus lebih dari 0'),
  note: z.string().max(200, 'Catatan maksimal 200 karakter').optional(),
  due_date: z.string().optional(),
});

export const updateDebtSchema = debtSchema.partial().extend({
  settled: z.boolean().optional(),
});
