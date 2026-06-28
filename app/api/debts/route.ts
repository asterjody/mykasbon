import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const debtSchema = z.object({
  type: z.enum(['owed_to_me', 'i_owe']),
  counterpart_name: z.string().min(1, 'Nama wajib diisi'),
  amount: z.number().positive('Jumlah harus lebih dari 0'),
  note: z.string().max(200, 'Catatan maksimal 200 karakter').optional(),
  due_date: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabase.from('debts').select('*').eq('user_id', user.id);

    if (status === 'settled') {
      query = query.not('settled_at', 'is', null);
    } else if (status === 'unsettled') {
      query = query.is('settled_at', null);
    }

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Gagal mengambil data' },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = debtSchema.parse(body);

    const { data, error } = await supabase
      .from('debts')
      .insert({
        ...validated,
        user_id: user.id,
        settled_at: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { error: 'Gagal menyimpan data' },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    // Handle Zod validation error
    if (error instanceof z.ZodError) {
      // Ambil pesan error pertama dari ZodError
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
