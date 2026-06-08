// layouts/DashboardLayout.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationPanel from '../components/NotificationPanel';
import { useNotifications } from '../hooks/useNotifications';
import { FiBell, FiMenu, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title = '' }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    panelOpen,
    togglePanel,
    setPanelOpen,
    markRead,
    clearAll,
    refresh,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-ems-black flex">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main column ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="h-14 md:h-16 bg-ems-dark border-b border-ems-border
                           flex items-center justify-between px-4 md:px-6 flex-shrink-0 gap-3">

          {/* Hamburger – mobile only */}
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

            {/* SOS quick button – patients on mobile */}
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

            {/* ── Notification bell (now functional) ───────────── */}
            <div className="relative">
              <button
                onClick={togglePanel}
                className={`relative w-9 h-9 border rounded-xl flex items-center justify-center
                            transition-colors
                            ${panelOpen
                              ? 'bg-emergency-red/10 border-emergency-red/40 text-emergency-red'
                              : 'bg-ems-card border-ems-border text-ems-muted hover:text-white'
                            }`}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              >
                <FiBell size={16} />

                {/* Unread badge */}
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5
                               bg-emergency-red text-white text-[9px] font-bold
                               rounded-full flex items-center justify-center
                               border border-ems-dark animate-pulse"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Panel dropdown */}
              {panelOpen && (
                <NotificationPanel
                  notifications={notifications}
                  loading={loading}
                  unreadCount={unreadCount}
                  userRole={user?.role}
                  onClose={() => setPanelOpen(false)}
                  onMarkRead={markRead}
                  onClearAll={clearAll}
                  onRefresh={refresh}
                />
              )}
            </div>

            {/* User info – hidden on very small screens */}
            <div className="hidden sm:block text-right">
              <p className="text-ems-white text-sm font-medium leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-ems-muted text-xs capitalize">{user?.role}</p>
            </div>

          </div>
        </header>

        {/* ── Page content ────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
