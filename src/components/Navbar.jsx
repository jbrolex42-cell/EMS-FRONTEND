
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu,
  FiX,
  FiPhone,
  FiUser,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';

export default function Navbar() {
  // ==========================================================
  // STATE MANAGEMENT
  // ==========================================================

  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  const { user, logout, isAuthenticated } = useAuth();

  // ==========================================================
  // ROUTING
  // ==========================================================

  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================================
  // LOGOUT HANDLER
  // ==========================================================

  const handleLogout = async () => {
    await logout();

    setDropdownOpen(false);
    setOpen(false);

    navigate('/');
  };

  // ==========================================================
  // NAVIGATION LINKS
  // ==========================================================

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/membership', label: 'Membership' },
    { to: '/hospitals', label: 'Hospitals' }
  ];

  // ==========================================================
  // ACTIVE ROUTE CHECK
  // ==========================================================

  const isActive = (path) => location.pathname === path;

  // ==========================================================
  // NAVIGATION LINK STYLES
  // ==========================================================

  const getNavLinkClass = (path) => `
    relative
    py-2
    text-sm
    font-semibold
    transition-colors
    duration-200
    ${
      isActive(path)
        ? 'text-red-600'
        : 'text-slate-600 hover:text-red-600'
    }
  `;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <nav
      className="
        fixed
        inset-x-0
        top-0
        z-50
        w-full
        border-b
        border-slate-200
        bg-white/95
        shadow-sm
        backdrop-blur-xl
      "
      aria-label="Main navigation"
    >

      {/* EMERGENCY CONTACT BAR */}

      <div className="w-full bg-red-600 px-3 py-2 text-white sm:px-4">
        <div className="
          mx-auto
          flex
          max-w-7xl
          flex-wrap
          items-center
          justify-center
          gap-x-2
          gap-y-1
          text-center
          text-[11px]
          font-medium
          sm:text-xs
        ">
          <FiPhone size={14} className="flex-shrink-0" />

          <span>Emergency Toll Free:</span>

          <a
            href="tel:0757751980"
            className="
              font-bold
              text-white
              underline-offset-2
              transition-colors
              hover:text-red-100
              hover:underline
            "
          >
            0757 751 980
          </a>

          <span className="hidden text-red-200 sm:inline">
            |
          </span>

          <span>USSD:</span>

          <strong className="font-bold text-white">
            *888#
          </strong>
        </div>
      </div>

      {/* MAIN NAVIGATION */}

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="
          flex
          h-16
          items-center
          justify-between
          gap-4
        ">

          {/* BRAND LOGO */}

          <Link
            to="/"
            onClick={() => setOpen(false)}
            aria-label="EMS Kenya home"
            className="
              flex
              min-w-0
              flex-shrink-0
              items-center
              gap-3
              rounded-lg
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-red-500
            "
          >
            <div className="
              flex
              h-10
              w-10
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-600
              shadow-sm
            ">
              <span className="font-display text-lg font-bold text-white">
                EMS
              </span>
            </div>

            <div className="min-w-0">
              <div className="
                truncate
                text-sm
                font-bold
                leading-tight
                text-slate-900
              ">
                Emergency Medical
              </div>

              <div className="
                mt-0.5
                truncate
                text-xs
                font-medium
                text-slate-500
              ">
                Kenya Emergency System
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION LINKS */}

          <div className="
            hidden
            items-center
            gap-7
            md:flex
            lg:gap-8
          ">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={
                  isActive(link.to) ? 'page' : undefined
                }
                className={getNavLinkClass(link.to)}
              >
                {link.label}

                {isActive(link.to) && (
                  <span className="
                    absolute
                    -bottom-1
                    left-0
                    h-0.5
                    w-full
                    rounded-full
                    bg-red-600
                  " />
                )}
              </Link>
            ))}
          </div>

          {/* DESKTOP USER AUTHENTICATION */}

          <div className="
            hidden
            flex-shrink-0
            items-center
            gap-3
            md:flex
          ">
            {isAuthenticated ? (
              <div className="relative">

                {/* USER ACCOUNT BUTTON */}

                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2
                    transition-all
                    duration-200
                    hover:border-red-300
                    hover:bg-slate-50
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-red-500
                  "
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-600
                    text-xs
                    font-bold
                    text-white
                  ">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>

                  <span className="
                    max-w-28
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                  ">
                    {user?.firstName}
                  </span>
                </button>

                {/* ACCOUNT DROPDOWN */}

                {dropdownOpen && (
                  <div className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-56
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    py-2
                    shadow-xl
                  ">

                    {/* DASHBOARD */}

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-600
                        transition-colors
                        hover:bg-slate-50
                        hover:text-red-600
                      "
                    >
                      <FiUser size={16} />
                      Dashboard
                    </Link>

                    {/* ADMIN PANEL */}

                    {(user?.role === 'admin' ||
                      user?.role === 'superadmin') && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          text-sm
                          font-medium
                          text-slate-600
                          transition-colors
                          hover:bg-slate-50
                          hover:text-red-600
                        "
                      >
                        <FiSettings size={16} />
                        Admin Panel
                      </Link>
                    )}

                    {/* EMT PANEL */}

                    {user?.role === 'emt' && (
                      <Link
                        to="/emt"
                        onClick={() => setDropdownOpen(false)}
                        className="
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          text-sm
                          font-medium
                          text-slate-600
                          transition-colors
                          hover:bg-slate-50
                          hover:text-red-600
                        "
                      >
                        <FiSettings size={16} />
                        EMT Panel
                      </Link>
                    )}

                    {/* SETTINGS */}

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-600
                        transition-colors
                        hover:bg-slate-50
                        hover:text-red-600
                      "
                    >
                      <FiSettings size={16} />
                      Settings
                    </Link>

                    <div className="mx-3 my-1 border-t border-slate-200" />

                    {/* SIGN OUT */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-left
                        text-sm
                        font-semibold
                        text-red-600
                        transition-colors
                        hover:bg-red-50
                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-red-500
                      "
                    >
                      <FiLogOut size={16} />
                      Sign Out
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <>
                {/* GUEST NAVIGATION */}

                <Link
                  to="/login"
                  className="
                    text-sm
                    font-semibold
                    text-slate-600
                    transition-colors
                    hover:text-red-600
                  "
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-600
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-red-700
                    hover:shadow-md
                    active:scale-95
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-red-500
                  "
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="
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
              text-slate-700
              transition-colors
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-red-500
              md:hidden
            "
            aria-label={
              open
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={open}
          >
            {open ? (
              <FiX size={22} />
            ) : (
              <FiMenu size={22} />
            )}
          </button>

        </div>
      </div>

      {/* MOBILE NAVIGATION MENU */}

      {open && (
        <div className="
          border-t
          border-slate-200
          bg-white
          px-4
          py-5
          shadow-lg
          md:hidden
        ">

          {/* MOBILE NAVIGATION LINKS */}

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={
                  isActive(link.to) ? 'page' : undefined
                }
                onClick={() => setOpen(false)}
                className={`
                  block
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition-colors
                  ${
                    isActive(link.to)
                      ? 'bg-red-50 text-red-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-red-600'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* MOBILE ACCOUNT ACTIONS */}

          <div className="
            mt-4
            space-y-2
            border-t
            border-slate-200
            pt-4
          ">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="
                    block
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-slate-700
                    transition-colors
                    hover:bg-slate-50
                    hover:text-red-600
                  "
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-sm
                    font-semibold
                    text-red-600
                    transition-colors
                    hover:bg-red-50
                  "
                >
                  <FiLogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="
                    block
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-semibold
                    text-slate-700
                    transition-colors
                    hover:border-red-300
                    hover:bg-red-50
                    hover:text-red-600
                  "
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="
                    block
                    rounded-xl
                    bg-red-600
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-bold
                    text-white
                    transition-colors
                    hover:bg-red-700
                  "
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      )}

    </nav>
  );
}