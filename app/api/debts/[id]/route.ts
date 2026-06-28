import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateSchema = z.object({
  type: z.enum(['owed_to_me', 'i_owe']).optional(),
  counterpart_name: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  note: z.string().max(200).optional(),
  due_date: z.string().nullable().optional(),
  settled: z.boolean().optional(),
});

type UpdateData = {
  type?: 'owed_to_me' | 'i_owe';
  counterpart_name?: string;
  amount?: number;
  note?: string | null;
  due_date?: string | null;
  settled_at?: string | null;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received payload:', body);

    const validated = updateSchema.parse(body);
    console.log('Validated data:', validated);

    // First verify ownership
    const { data: existing, error: checkError } = await supabase
      .from('debts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existing) {
      console.log('Debt not found or not owned:', id);
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
        { status: 404 },
      );
    }

    // Prepare update data dengan type yang jelas
    const updateData: UpdateData = {};

    // Copy validated data ke updateData
    if (validated.type !== undefined) updateData.type = validated.type;
    if (validated.counterpart_name !== undefined)
      updateData.counterpart_name = validated.counterpart_name;
    if (validated.amount !== undefined) updateData.amount = validated.amount;
    if (validated.note !== undefined) updateData.note = validated.note;
    if (validated.due_date !== undefined)
      updateData.due_date = validated.due_date;

    // Handle settled status
    if (validated.settled !== undefined) {
      updateData.settled_at = validated.settled
        ? new Date().toISOString()
        : null;
    }

    console.log('Final update data:', updateData);

    const { data, error } = await supabase
      .from('debts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: 'Gagal mengupdate data: ' + error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    // Handle Zod validation error
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0];
      const errorMessage = firstError?.message || 'Validasi gagal';

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: existing, error: checkError } = await supabase
      .from('debts')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
        { status: 404 },
      );
    }

    const { error } = await supabase.from('debts').delete().eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Gagal menghapus data' },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
}
