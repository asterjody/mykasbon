import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika belum login, redirect ke login
  if (!user) {
    redirect('/login');
  }

  // Jika sudah login, tampilkan dashboard di root (/)
  // (dashboard)/page.tsx akan otomatis tampil di root
  // Kita tidak perlu redirect karena (dashboard) sudah di root
  return null; // Tidak akan pernah sampai sini karena middleware handle
}
