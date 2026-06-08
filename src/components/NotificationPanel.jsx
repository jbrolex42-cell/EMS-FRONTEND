// components/NotificationPanel.jsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell, FiX, FiCheck, FiTrash2, FiRefreshCw,
  FiAlertTriangle, FiUser, FiTruck, FiActivity,
  FiCheckCircle, FiAlertCircle, FiInfo, FiCreditCard
} from 'react-icons/fi';
import { timeAgo } from '../utils/formatTime';

// ── Icon + accent colour per notification type ────────────────────
const TYPE_META = {
  new_emergency:      { icon: FiAlertTriangle, color: '#FF3B30', bg: 'bg-red-500/10',    label: 'Emergency' },
  emergency_dispatched:{ icon: FiTruck,        color: '#3B82F6', bg: 'bg-blue-500/10',   label: 'Dispatch' },
  ambulance_arrived:  { icon: FiCheckCircle,   color: '#22C55E', bg: 'bg-green-500/10',  label: 'Arrived' },
  emergency_resolved: { icon: FiCheckCircle,   color: '#10B981', bg: 'bg-green-500/10',  label: 'Resolved' },
  emergency_update:   { icon: FiActivity,      color: '#F59E0B', bg: 'bg-yellow-500/10', label: 'Update' },
  emergency_cancelled:{ icon: FiX,             color: '#EF4444', bg: 'bg-red-500/10',    label: 'Cancelled' },
  new_assignment:     { icon: FiAlertCircle,   color: '#F97316', bg: 'bg-orange-500/10', label: 'Assignment' },
  new_user:           { icon: FiUser,          color: '#8B5CF6', bg: 'bg-purple-500/10', label: 'New User' },
  emt_status:         { icon: FiActivity,      color: '#06B6D4', bg: 'bg-cyan-500/10',   label: 'EMT' },
  membership:         { icon: FiCreditCard,    color: '#22C55E', bg: 'bg-green-500/10',  label: 'Membership' },
  system_alert:       { icon: FiAlertTriangle, color: '#F59E0B', bg: 'bg-yellow-500/10', label: 'System' },
  default:            { icon: FiInfo,          color: '#6B7280', bg: 'bg-gray-500/10',   label: 'Info' },
};

function getMeta(type) {
  return TYPE_META[type] || TYPE_META.default;
}

// ── Link destination per type ──────────────────────────────────────
function getLink(notif, userRole) {
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  switch (notif.type) {
    case 'new_emergency':
    case 'emergency_dispatched':
    case 'ambulance_arrived':
    case 'emergency_update':
    case 'emergency_resolved':
    case 'emergency_cancelled':
      return isAdmin ? '/admin/emergencies' : '/tracking';
    case 'new_assignment':
      return '/emt';
    case 'new_user':
      return '/admin/users';
    case 'emt_status':
      return '/admin/emt';
    case 'membership':
      return isAdmin ? '/admin/memberships' : '/membership';
    default:
      return null;
  }
}

export default function NotificationPanel({ notifications, loading, unreadCount, onClose, onMarkRead, onClearAll, onRefresh, userRole }) {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-1rem)]
                 bg-ems-dark border border-ems-border rounded-2xl shadow-2xl
                 flex flex-col overflow-hidden"
      style={{ maxHeight: '520px' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ems-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <FiBell size={15} className="text-emergency-red" />
          <span className="text-ems-white font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-emergency-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            title="Refresh"
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       text-ems-muted hover:text-white hover:bg-ems-card transition-colors"
          >
            <FiRefreshCw size={13} />
          </button>
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              title="Clear all"
              className="w-7 h-7 flex items-center justify-center rounded-lg
                         text-ems-muted hover:text-red-400 hover:bg-ems-card transition-colors"
            >
              <FiTrash2 size={13} />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       text-ems-muted hover:text-white hover:bg-ems-card transition-colors"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-6 h-6 border-2 border-ems-border border-t-emergency-red rounded-full animate-spin" />
            <p className="text-ems-muted text-xs">Loading…</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-12 h-12 bg-ems-card border border-ems-border rounded-2xl flex items-center justify-center">
              <FiBell size={20} className="text-ems-muted" />
            </div>
            <p className="text-ems-white text-sm font-medium">All clear</p>
            <p className="text-ems-muted text-xs">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-ems-border">
            {notifications.map((notif) => {
              const { icon: Icon, color, bg } = getMeta(notif.type);
              const link = getLink(notif, userRole);

              const inner = (
                <div
                  key={notif._id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer
                              ${notif.read ? 'hover:bg-ems-black/40' : 'bg-ems-card/50 hover:bg-ems-card'}
                            `}
                  onClick={() => !notif.read && onMarkRead(notif._id)}
                >
                  {/* Icon bubble */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${bg}`}>
                    <Icon size={14} style={{ color }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium leading-tight ${notif.read ? 'text-ems-muted' : 'text-ems-white'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 bg-emergency-red rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-ems-muted text-xs mt-0.5 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-ems-muted/60 text-[10px] mt-1">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                </div>
              );

              return link ? (
                <Link key={notif._id} to={link} onClick={onClose}>
                  {inner}
                </Link>
              ) : (
                <div key={notif._id}>{inner}</div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {notifications.length > 0 && (
        <div className="border-t border-ems-border px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClearAll}
            className="text-ems-muted hover:text-red-400 text-xs transition-colors flex items-center gap-1"
          >
            <FiTrash2 size={11} /> Clear all
          </button>
          <span className="text-ems-muted/60 text-[10px]">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
