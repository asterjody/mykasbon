# MyKasbon

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-2.45-3FCF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel" />
</div>

<p align="center">
  Aplikasi web sederhana untuk tracking utang piutang pribadi.
  <br />
  Kelola siapa hutang berapa ke kamu, atau kamu hutang berapa ke siapa.
  <br />
  <br />
  <a href="https://mykasbon.vercel.app"><strong>🚀 Live Demo</strong></a>
  ·
  <a href="https://github.com/asterjody/mykasbon/issues"><strong>Report Bug</strong></a>
  ·
  <a href="https://github.com/asterjody/mykasbon/issues"><strong>Request Feature</strong></a>
</p>

---

## Demo

**Live Demo:** [https://mykasbon.vercel.app](https://mykasbon.vercel.app)

> **Test Account** (untuk demo):
>
> - Email: `demo@example.com`
> - Password: `demodemo123`

---

## Fitur

### Autentikasi

- Signup & login dengan email + password (Supabase Auth)
- Logout button di header
- Halaman aplikasi hanya bisa diakses user yang login (middleware protection)

### Dashboard

- **3 Summary Cards:**
  - "Total dihutang ke saya" (Rp X)
  - "Total saya hutang" (Rp Y)
  - "Net" (X - Y, dengan warna hijau/merah)
- **List semua entry** dengan:
  - Nama orang
  - Tipe (dihutang / saya hutang)
  - Jumlah (format Rp 1.234.000)
  - Tanggal relative ("3 hari lalu", "kemarin")
  - Status: Belum lunas / Lunas
- **Tombol aksi:** "Tandai lunas", "Edit", "Hapus"
- **Filter:** dropdown status (semua / belum / lunas) + tipe (semua / dihutang / hutang)
- **Search:** cari berdasarkan nama orang
- **Sorter:** urutkan berdasarkan terlama / terbaru / tertinggi / terendah

### Form Tambah / Edit

- Tipe (radio): Saya dihutang / Saya hutang
- Nama orang (text, wajib)
- Jumlah (number, wajib, format Rupiah dengan separator)
- Tanggal (default hari ini)
- Catatan (opsional, max 200 char)
- Validasi client + server

### API Endpoints

| Method | Endpoint          | Fungsi                                              |
| ------ | ----------------- | --------------------------------------------------- |
| GET    | `/api/debts`      | List debt user (dengan query `?status=` & `?type=`) |
| POST   | `/api/debts`      | Create entry baru                                   |
| PATCH  | `/api/debts/[id]` | Update (termasuk tandai lunas)                      |
| DELETE | `/api/debts/[id]` | Hapus entry                                         |

> Semua endpoint wajib auth, validasi input, dan error response dalam Bahasa Indonesia.

---

## Tech Stack

| Teknologi                                                   | Versi           | Kegunaan                                |
| ----------------------------------------------------------- | --------------- | --------------------------------------- |
| [Next.js](https://nextjs.org/)                              | 16 (App Router) | Framework React dengan SSR & API routes |
| [TypeScript](https://www.typescriptlang.org/)               | 5.3             | Type safety & developer experience      |
| [Tailwind CSS](https://tailwindcss.com/)                    | 4.0             | Styling dengan utility-first            |
| [Supabase](https://supabase.com/)                           | 2.45            | Database (PostgreSQL) + Autentikasi     |
| [Lucide React](https://lucide.dev/)                         | 0.344           | Icon library                            |
| [Zod](https://zod.dev/)                                     | 3.22            | Schema validation                       |
| [date-fns](https://date-fns.org/)                           | 3.6             | Date formatting & manipulation          |
| [clsx](https://github.com/lukeed/clsx)                      | 2.1             | Conditional className utility           |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 2.3             | Merge Tailwind classes                  |

---

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/asterjody/mykasbon.git
cd mykasbon
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Cara dapat credentials:** Login ke [Supabase Dashboard](https://app.supabase.com) → Pilih project → Settings → API

### 4. Setup Database

1. Buka Supabase Dashboard → SQL Editor
2. Jalankan SQL migration `_sql/db_.sql`

Atau via CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migration
supabase db push
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Struktur Proyek

```
mykasbon/
├── app/
│   ├── (auth)/                 # Auth pages (login/signup)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/            # Dashboard pages
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── debts/             # API routes
│   │       ├── route.ts       # GET & POST
│   │       └── [id]/
│   │           └── route.ts   # PATCH & DELETE
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Select.tsx
│   │   └── Skeleton.tsx
│   ├── auth/                  # Auth components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/             # Dashboard components
│   │   ├── SummaryCards.tsx
│   │   ├── DebtList.tsx
│   │   ├── DebtItem.tsx
│   │   ├── DebtFilters.tsx
│   │   ├── DebtSorters.tsx
│   │   ├── GroupedDebtItem.tsx
│   │   └── DebtForm.tsx
│   └── shared/               # Shared components
│       ├── Header.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── supabase/             # Supabase clients
│   │   ├── client.ts         # Browser client
│   │   └── server.ts         # Server client
│   ├── utils/                # Utility functions
│   │   ├── format.ts         # Rupiah formatting
│   │   ├── date.ts           # Date formatting
│   │   ├── validations.ts    # Zod schemas
│   │   └── classnames.ts     # cn() utility
│   │   └── debtUtils.ts      # debt utility
│   └── hooks/                # Custom hooks
│       └── useDebts.ts       # Debt management hook
├── types/
│   └── index.ts              # TypeScript types
├── middleware.ts             # Auth middleware
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## Approach

Saya memilih **Next.js 16 App Router** karena memberikan performa optimal dengan server components dan API routes yang terintegrasi. **Supabase** dipilih karena menyediakan autentikasi dan database yang mudah diintegrasikan dengan RLS bawaan - ini memungkinkan saya mengimplementasikan keamanan data dengan policies yang strict tanpa perlu setup server sendiri. Untuk UI, saya menggunakan **Tailwind CSS** dengan pendekatan mobile-first dan micro-interactions untuk pengalaman pengguna yang lebih baik. Saya juga membuat custom hook `useDebts` untuk mengelola state dan data fetching secara reusable. Semua business logic dan validasi diimplementasikan di server (API routes) untuk keamanan, sementara Zod memastikan data valid sebelum masuk ke database.

---

## Trade-off

Jika ada **1 hari lagi**, saya akan polish:

1. **Dark Mode**: Implementasi dark mode dengan Tailwind
2. **Export Data**: Fitur export ke CSV/Excel
3. **Bar Chart**: Visualisasi perbandingan total dihutang vs hutang

---

## Time Spent

**Total waktu pengerjaan:** ±10 jam

Rincian:

- Setup & configuration: 30 menit
- Database & Supabase integration: 1 jam
- Authentication pages: 1 jam
- UI Components: 2 jam
- Dashboard & CRUD features: 2 jam
- API endpoints: 1 jam
- Polish & responsive design: 2 jam
- Documentation & deployment: 1 jam

---

## RLS Policies

User hanya bisa mengakses data miliknya sendiri. Policies yang diterapkan:

```sql
-- SELECT: Hanya row dengan user_id = auth.uid()
CREATE POLICY "Users can view their own debts"
    ON debts FOR SELECT
    USING (auth.uid() = user_id);

-- INSERT: User ID harus sama dengan auth.uid()
CREATE POLICY "Users can insert their own debts"
    ON debts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: Hanya row milik sendiri
CREATE POLICY "Users can update their own debts"
    ON debts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: Hanya row milik sendiri
CREATE POLICY "Users can delete their own debts"
    ON debts FOR DELETE
    USING (auth.uid() = user_id);
```

### Testing RLS dengan curl

```bash
# Test kebocoran data
curl -X GET https://mykasbon.vercel.app/api/debts \
  -H "Authorization: Bearer YOUR_TOKEN"

# Pastikan hanya data user yang login yang muncul
```

---

## Deployment

### Deploy ke Vercel

1. Push repository ke GitHub:

```bash
git push origin main
```

2. Buka [Vercel](https://vercel.com) dan klik "Add New Project"

3. Import repository dari GitHub

4. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Klik "Deploy"

### Environment Variables di Vercel

Pastikan di Vercel sudah set:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Contributing

Pull requests welcome! Untuk perubahan besar, buka issue terlebih dahulu untuk diskusi.

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [date-fns Documentation](https://date-fns.org/docs)
- [Zod Documentation](https://zod.dev)

---

<p align="center">
  Made by <a href="https://github.com/asterjody">Jody</a>
</p>
