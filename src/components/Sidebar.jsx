import { useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiAlertTriangle, FiMapPin, FiUsers, FiTruck,
  FiHeart, FiSettings, FiLogOut, FiActivity, FiBarChart2,
  FiShield, FiCreditCard, FiX, FiChevronsRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const patientLinks = [
  { to: '/dashboard',  icon: FiGrid,          label: 'Overview' },
  { to: '/emergency',  icon: FiAlertTriangle,  label: 'Request Emergency' },
  { to: '/tracking',   icon: FiMapPin,         label: 'Track Response' },
  { to: '/membership', icon: FiHeart,          label: 'My Membership' },
  { to: '/hospitals',  icon: FiActivity,       label: 'Hospitals' },
  { to: '/settings',   icon: FiSettings,       label: 'Settings' },
];
const adminLinks = [
  { to: '/admin',               icon: FiBarChart2,    label: 'Dashboard' },
  { to: '/admin/emergencies',   icon: FiAlertTriangle,label: 'Emergencies' },
  { to: '/admin/users',         icon: FiUsers,        label: 'Users' },
  { to: '/admin/fleet',         icon: FiTruck,        label: 'Fleet' },
  { to: '/admin/hospitals',     icon: FiActivity,     label: 'Hospitals' },
  { to: '/admin/memberships',   icon: FiCreditCard,   label: 'Memberships' },
  { to: '/settings',            icon: FiSettings,     label: 'Settings' },
];
const emtLinks = [
  { to: '/emt',          icon: FiGrid,          label: 'My Dashboard' },
  { to: '/emt/dispatch', icon: FiAlertTriangle, label: 'Dispatch Queue' },
  { to: '/hospitals',    icon: FiActivity,      label: 'Hospitals' },
  { to: '/settings',     icon: FiSettings,      label: 'Settings' },
];

const roleLabel = {
  patient: 'Patient', emt: 'EMT',
  admin: 'Admin', superadmin: 'Super Admin', hospital: 'Hospital'
};

// ── Sidebar inner content (shared between desktop & mobile drawer) ────────────
function SidebarContent({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === 'admin' || user?.role === 'superadmin' ? adminLinks
    : user?.role === 'emt' ? emtLinks
    : patientLinks;

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    onClose?.();
    navigate('/');
  };

  const handleNavClick = () => onClose?.();

  return (
    <div className="flex flex-col h-full">

      {/* ── Logo + close button ──────────────────────── */}
      <div className="flex items-center justify-between p-5 border-b border-ems-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emergency-red rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display text-base">EMS</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">EMS Kenya</p>
            <p className="text-ems-muted text-xs">{roleLabel[user?.role] || 'Portal'}</p>
          </div>
        </div>
        {/* Close button — only visible in mobile drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-ems-muted hover:text-white hover:bg-ems-card transition-all"
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* ── Emergency CTA ────────────────────────────── */}
      {user?.role === 'patient' && (
        <div className="px-3 pt-4 flex-shrink-0">
          <NavLink
            to="/emergency"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 bg-emergency-red/10 border border-emergency-red/30
                       hover:bg-emergency-red hover:border-emergency-red
                       text-emergency-red hover:text-white
                       rounded-xl px-4 py-3 transition-all text-sm font-semibold group"
          >
            <FiAlertTriangle size={16} />
            <span className="flex-1">Request Emergency</span>
            <FiChevronsRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>
      )}

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            end={['/admin', '/dashboard', '/emt'].includes(to)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-emergency-red/15 text-emergency-red border border-emergency-red/20 font-medium'
                  : 'text-ems-muted hover:text-ems-white hover:bg-ems-card'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Membership badge ─────────────────────────── */}
      {user?.role === 'patient' && user?.membership?.status === 'active' && (
        <div className="mx-3 mb-3 p-3 bg-green-500/5 border border-green-500/20 rounded-xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <FiShield size={13} className="text-green-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-green-400 text-xs font-medium capitalize">
                {user.membership.type} Plan
              </p>
              <p className="text-ems-muted text-xs truncate">
                Active · expires {new Date(user.membership.expiryDate).toLocaleDateString('en-KE')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── User footer ──────────────────────────────── */}
      <div className="p-3 border-t border-ems-border flex-shrink-0">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-8 h-8 bg-emergency-red rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-ems-white text-xs font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-ems-muted text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-2 py-2 text-ems-muted hover:text-red-400
                     hover:bg-red-500/5 rounded-xl text-xs transition-all"
        >
          <FiLogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ── Main Sidebar export ───────────────────────────────────────────────────────
// Props:  mobileOpen (bool)  — controlled by DashboardLayout
//         onClose    (fn)    — called when backdrop or X clicked
export default function Sidebar({ mobileOpen = false, onClose }) {
  const drawerRef = useRef(null);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    onClose?.();
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop: always-visible sidebar ─────────── */}
      <aside className="hidden md:flex w-64 min-h-screen bg-ems-dark border-r border-ems-border flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile: slide-in drawer ──────────────────── */}
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/70 backdrop-blur-sm
          transition-opacity duration-300 md:hidden
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw]
          bg-ems-dark border-r border-ems-border
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Navigation menu"
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}
