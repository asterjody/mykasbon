'use client';

import { LogOut, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">MyKasbon</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
