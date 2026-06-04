import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiBell, FiMenu, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title = '' }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ems-black flex">

      {/* ── Sidebar (desktop always-on / mobile drawer) ── */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content column ────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Top header bar ─────────────────────────────── */}
        <header className="h-14 md:h-16 bg-ems-dark border-b border-ems-border flex items-center justify-between px-4 md:px-6 flex-shrink-0 gap-3">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl
                       text-ems-muted hover:text-white hover:bg-ems-card
                       border border-ems-border transition-all"
            aria-label="Open menu"
          >
            <FiMenu size={18} />
          </button>

          {/* Page title */}
          <h1 className="flex-1 text-ems-white font-semibold text-base md:text-lg truncate">
            {title}
          </h1>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">

            {/* SOS quick button — patients mobile */}
            {user?.role === 'patient' && (
              <Link
                to="/emergency"
                className="md:hidden flex items-center gap-1.5 bg-emergency-red text-white
                           text-xs font-bold px-3 py-2 rounded-xl
                           active:scale-95 transition-transform"
              >
                <FiAlertTriangle size={13} />
                SOS
              </Link>
            )}

            {/* Notification bell */}
            <button
              className="relative w-9 h-9 bg-ems-card border border-ems-border
                         rounded-xl flex items-center justify-center
                         text-ems-muted hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <FiBell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emergency-red rounded-full" />
            </button>

            {/* User info — hidden on very small screens */}
            <div className="hidden sm:block text-right">
              <p className="text-ems-white text-sm font-medium leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-ems-muted text-xs capitalize">{user?.role}</p>
            </div>

          </div>
        </header>

        {/* ── Page content ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
