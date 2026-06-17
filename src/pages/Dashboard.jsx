import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { TopNavbar } from '../components/Sidebar';

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenuToggle={() => setMobileOpen(true)} />

        <main className="diablo-bg flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
