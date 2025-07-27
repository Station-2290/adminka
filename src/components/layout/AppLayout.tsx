import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';

export function AppLayout() {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      <MobileHeader />
      <aside className="hidden md:flex w-64 flex-shrink-0">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}