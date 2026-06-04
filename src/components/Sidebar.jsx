import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiAlertTriangle, FiMapPin, FiUsers, FiTruck,
  FiHeart, FiSettings, FiLogOut, FiActivity, FiBarChart2,
  FiShield, FiCreditCard, FiChevronsRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const patientLinks = [
  { to: '/dashboard', icon: FiGrid, label: 'Overview' },
  { to: '/emergency', icon: FiAlertTriangle, label: 'Request Emergency' },
  { to: '/tracking', icon: FiMapPin, label: 'Track Response' },
  { to: '/membership', icon: FiHeart, label: 'My Membership' },
  { to: '/hospitals', icon: FiActivity, label: 'Hospitals' },
  { to: '/settings', icon: FiSettings, label: 'Settings' }
];

const adminLinks = [
  { to: '/admin', icon: FiBarChart2, label: 'Dashboard' },
  { to: '/admin/emergencies', icon: FiAlertTriangle, label: 'Emergencies' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/fleet', icon: FiTruck, label: 'Fleet' },
  { to: '/admin/hospitals', icon: FiActivity, label: 'Hospitals' },
  { to: '/admin/memberships', icon: FiCreditCard, label: 'Memberships' },
  { to: '/settings', icon: FiSettings, label: 'Settings' }
];

const emtLinks = [
  { to: '/emt', icon: FiGrid, label: 'My Dashboard' },
  { to: '/emt/dispatch', icon: FiAlertTriangle, label: 'Dispatch Queue' },
  { to: '/hospitals', icon: FiActivity, label: 'Hospitals' },
  { to: '/settings', icon: FiSettings, label: 'Settings' }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === 'admin' || user?.role === 'superadmin' ? adminLinks
    : user?.role === 'emt' ? emtLinks
    : patientLinks;

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/');
  };

  const roleLabel = { patient: 'Patient', emt: 'EMT', admin: 'Admin', superadmin: 'Super Admin', hospital: 'Hospital' };

  return (
    <aside className="w-64 min-h-screen bg-ems-dark border-r border-ems-border flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-ems-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emergency-red rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display text-base">EMS</span>
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm">EMS Kenya</div>
            <div className="text-ems-muted text-xs">{roleLabel[user?.role] || 'Portal'}</div>
          </div>
        </div>
      </div>

      {/* Emergency CTA for patients */}
      {user?.role === 'patient' && (
        <div className="mx-3 mt-3">
          <NavLink to="/emergency" className="flex items-center gap-2 bg-emergency-red/10 border border-emergency-red/30 hover:bg-emergency-red hover:border-emergency-red text-emergency-red hover:text-white rounded-xl px-3 py-2.5 transition-all text-sm font-semibold">
            <FiAlertTriangle size={15} />
            <span>Request Emergency</span>
            <FiChevronsRight size={14} className="ml-auto" />
          </NavLink>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={['/admin','/dashboard','/emt'].includes(to)}
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

      {/* Membership badge */}
      {user?.role === 'patient' && user?.membership?.status === 'active' && (
        <div className="mx-3 mb-3 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <FiShield size={14} className="text-green-400" />
            <div className="min-w-0">
              <p className="text-green-400 text-xs font-medium capitalize">{user.membership.type} Plan</p>
              <p className="text-ems-muted text-xs truncate">Active until {new Date(user.membership.expiryDate).toLocaleDateString('en-KE')}</p>
            </div>
          </div>
        </div>
      )}

      {/* User footer */}
      <div className="p-3 border-t border-ems-border">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-8 h-8 bg-emergency-red rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-ems-white text-xs font-medium truncate">{user?.firstName} {user?.lastName}</div>
            <div className="text-ems-muted text-xs truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-2 py-2 text-ems-muted hover:text-red-400 hover:bg-red-500/5 rounded-xl text-xs transition-all"
        >
          <FiLogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
