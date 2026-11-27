
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationPanel from '../components/NotificationPanel';
import { useNotifications } from '../hooks/useNotifications';
import { FiBell, FiMenu, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

/**
 * ============================================================
 * EMS KENYA — DASHBOARD LAYOUT
 * Professional White Theme | Responsive Dashboard
 * ============================================================
 */

export default function DashboardLayout({ children, title = '' }) {
  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  const { user } = useAuth();

  // ==========================================================
  // SIDEBAR STATE
  // ==========================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

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

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="
      min-h-screen
      w-full
      flex
      overflow-x-hidden
      bg-white
      text-slate-800
    ">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ======================================================
          DASHBOARD CONTENT WRAPPER
      ====================================================== */}

      <div className="
        flex-1
        min-w-0
        min-h-screen
        flex
        flex-col
        overflow-hidden
        bg-white
      ">

        {/* ====================================================
            DASHBOARD HEADER
        ==================================================== */}

        <header className="
          sticky
          top-0
          z-30
          min-h-14
          md:min-h-16
          w-full
          flex
          flex-shrink-0
          items-center
          justify-between
          gap-3
          border-b
          border-slate-200
          bg-white
          px-4
          py-2
          md:px-6
        ">

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="
              md:hidden
              flex
              h-10
              w-10
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              transition-colors
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-red-500
            "
            aria-label="Open menu"
          >
            <FiMenu size={19} />
          </button>

          {/* Page Title */}

          <h1 className="
            min-w-0
            flex-1
            truncate
            text-base
            font-bold
            text-slate-900
            md:text-lg
          ">
            {title}
          </h1>

          {/* Header Actions */}

          <div className="
            flex
            flex-shrink-0
            items-center
            gap-2
            md:gap-4
          ">

            {/* Emergency SOS Button */}

            {user?.role === 'patient' && (
              <Link
                to="/emergency"
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  bg-red-600
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                  transition-all
                  hover:bg-red-700
                  active:scale-95
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-red-500
                  md:hidden
                "
              >
                <FiAlertTriangle size={14} />
                SOS
              </Link>
            )}

            {/* Notification Button and Panel */}

            <div className="relative">

              <button
                type="button"
                onClick={togglePanel}
                className={`
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  transition-colors
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-red-500
                  ${
                    panelOpen
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
                aria-label={`Notifications${
                  unreadCount > 0 ? ` (${unreadCount} unread)` : ''
                }`}
                aria-expanded={panelOpen}
              >
                <FiBell size={18} />

                {/* Unread Notification Counter */}

                {unreadCount > 0 && (
                  <span className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-4
                    min-w-4
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white
                    bg-red-600
                    px-1
                    text-[9px]
                    font-bold
                    leading-none
                    text-white
                  ">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}

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

            {/* User Information */}

            <div className="hidden text-right sm:block">

              <p className="
                text-sm
                font-semibold
                leading-tight
                text-slate-900
              ">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="
                mt-0.5
                text-xs
                capitalize
                text-slate-500
              ">
                {user?.role}
              </p>

            </div>

          </div>
        </header>

        {/* ====================================================
            MAIN DASHBOARD CONTENT
        ==================================================== */}

        <main
          id="dashboard-content"
          className="
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            bg-slate-50
            p-4
            text-slate-800
            md:p-6
          "
        >
          {children}
        </main>

      </div>
    </div>
  );
}