import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiPhone, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/membership', label: 'Membership' },
    { to: '/hospitals', label: 'Hospitals' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ems-black/95 backdrop-blur-md border-b border-ems-border">
      {/* Top emergency bar */}
      <div className="bg-emergency-red py-1.5 px-4 text-center">
        <span className="text-white text-xs font-medium flex items-center justify-center gap-2">
          <FiPhone className="inline" />
          Emergency Toll Free: <strong>0700 395 395</strong> &nbsp;|&nbsp; USSD: <strong>*888#</strong>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center">
              <span className="text-white font-display text-lg">EMS</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">Emergency Medical</div>
              <div className="text-ems-muted text-xs">Kenya Response System</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${location.pathname === link.to ? 'text-emergency-red' : 'text-ems-light hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-ems-card border border-ems-border px-3 py-2 rounded-xl hover:border-emergency-red transition-colors"
                >
                  <div className="w-7 h-7 bg-emergency-red rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="text-ems-white text-sm">{user?.firstName}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 bg-ems-card border border-ems-border rounded-2xl py-2 w-52 shadow-2xl">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-ems-dark text-ems-light hover:text-white text-sm transition-colors" onClick={() => setDropdownOpen(false)}>
                      <FiUser size={14} /> Dashboard
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2 hover:bg-ems-dark text-ems-light hover:text-white text-sm transition-colors" onClick={() => setDropdownOpen(false)}>
                        <FiSettings size={14} /> Admin Panel
                      </Link>
                    )}
                    {user?.role === 'emt' && (
                      <Link to="/emt" className="flex items-center gap-3 px-4 py-2 hover:bg-ems-dark text-ems-light hover:text-white text-sm transition-colors" onClick={() => setDropdownOpen(false)}>
                        <FiSettings size={14} /> EMT Panel
                      </Link>
                    )}
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-ems-dark text-ems-light hover:text-white text-sm transition-colors" onClick={() => setDropdownOpen(false)}>
                      <FiSettings size={14} /> Settings
                    </Link>
                    <hr className="border-ems-border my-2" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 hover:bg-ems-dark text-red-400 text-sm w-full transition-colors">
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-ems-light hover:text-white text-sm transition-colors">Sign In</Link>
                <Link to="/register" className="btn-emergency text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button className="md:hidden text-ems-light" onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-ems-dark border-t border-ems-border px-4 py-6 space-y-4">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="block text-ems-light hover:text-white py-2" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-ems-border space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-ems-light py-2" onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="text-red-400 py-2">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block btn-ghost text-center py-3" onClick={() => setOpen(false)}>Sign In</Link>
                <Link to="/register" className="block btn-emergency text-center py-3" onClick={() => setOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
